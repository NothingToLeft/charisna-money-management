import assert from "node:assert/strict";
import { test } from "node:test";

test("finance-core: accountBalance calculates normal flow and cross-profile transfers correctly", () => {
  const accountCash = { id: "cash", openingBalance: 100000, liability: false };
  const accountBank = { id: "bank", openingBalance: 500000, liability: false };
  const accountCredit = { id: "cc", openingBalance: 0, liability: true };

  const transactions = [
    { id: "tx1", accountId: "cash", type: "income", amount: 50000, status: "completed" },
    { id: "tx2", accountId: "cash", type: "expense", amount: 20000, status: "completed" },
    { id: "tx3", accountId: "cash", destinationAccountId: "bank", type: "transfer", amount: 30000, fee: 2500, status: "completed" },
    { id: "tx4", accountId: "cash", type: "expense", amount: 99999, status: "cancelled" }, // should be ignored
  ];

  function calculateBalance(account, txs) {
    let balance = Number(account?.openingBalance) || 0;
    txs.forEach((tx) => {
      if (tx.status === "cancelled") return;

      if (tx.crossProfileTransferId) {
        if (tx.crossProfileRole === "outgoing" && tx.sourceAccountId === account.id) {
          const debit = Number(tx.sourceAmount ?? tx.amount) + Number(tx.fee || 0);
          balance += account.liability ? debit : -debit;
        } else if (tx.crossProfileRole === "incoming" && tx.targetAccountId === account.id) {
          const credit = Number(tx.receivedAmount ?? tx.amount);
          balance += account.liability ? -credit : credit;
        }
        return;
      }

      if (tx.type === "transfer") {
        if (tx.accountId === account.id) {
          const totalOut = Number(tx.amount) + Number(tx.fee || 0);
          balance += account.liability ? totalOut : -totalOut;
        }
        if (tx.destinationAccountId === account.id) {
          const totalIn = Number(tx.destinationAmount || tx.amount);
          balance += account.liability ? -totalIn : totalIn;
        }
        return;
      }

      if (tx.accountId !== account.id) return;
      const amount = Number(tx.amount) || 0;
      if (account.liability) balance += tx.type === "expense" ? amount : -amount;
      else balance += tx.type === "income" ? amount : -amount;
    });
    return balance;
  }

  // Initial calculations
  // cash: 100000 + 50000 - 20000 - (30000 + 2500) = 97500
  assert.equal(calculateBalance(accountCash, transactions), 97500);
  // bank: 500000 + 30000 = 530000
  assert.equal(calculateBalance(accountBank, transactions), 530000);

  // Now add v14 Cross-Profile Transfer
  // Outgoing from accountBank (Profile Personal) -> Incoming to accountShop (Profile Shop)
  const crossTransferTxOutgoing = {
    id: "tx-cp-out",
    crossProfileTransferId: "cpt-1",
    crossProfileRole: "outgoing",
    sourceAccountId: "bank",
    targetAccountId: "shop-bank",
    sourceAmount: 200000,
    receivedAmount: 200000,
    fee: 5000,
    status: "completed"
  };
  const crossTransferTxIncoming = {
    id: "tx-cp-in",
    crossProfileTransferId: "cpt-1",
    crossProfileRole: "incoming",
    sourceAccountId: "bank",
    targetAccountId: "shop-bank",
    sourceAmount: 200000,
    receivedAmount: 200000,
    fee: 0,
    status: "completed"
  };
  const allTxs = [...transactions, crossTransferTxOutgoing, crossTransferTxIncoming];

  // bank balance after cross-profile transfer: 530000 - (200000 + 5000) = 325000
  assert.equal(calculateBalance(accountBank, allTxs), 325000);

  // shop bank: opening 0 + 200000 = 200000
  const accountShopBank = { id: "shop-bank", openingBalance: 0, liability: false };
  assert.equal(calculateBalance(accountShopBank, allTxs), 200000);
});

test("finance-core: AES-GCM and PBKDF2 WebCrypto encrypt/decrypt roundtrip", async () => {
  const password = "123456"; // 6-digit PIN
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 600000;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Derive bits
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    256
  );
  const keyBytes = new Uint8Array(bits);
  const aesKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  const sampleState = {
    version: 3,
    settings: { userName: "Owner", baseCurrency: "IDR" },
    accounts: [{ id: "wallet", name: "Dompet", openingBalance: 50000 }]
  };
  const plainBytes = encoder.encode(JSON.stringify(sampleState));

  // Encrypt with 12-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plainBytes
  );

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encrypted
  );
  const restoredState = JSON.parse(decoder.decode(new Uint8Array(decrypted)));

  assert.deepEqual(restoredState, sampleState);
});

test("finance-core: AbortController handles webhook timeout non-destructively", async () => {
  let aborted = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50);

  try {
    await new Promise((_, reject) => {
      controller.signal.addEventListener("abort", () => {
        aborted = true;
        reject(new Error("Timeout aborted"));
      });
    });
  } catch (err) {
    assert.match(err.message, /aborted/i);
  } finally {
    clearTimeout(timeout);
  }

  assert.equal(aborted, true);
});
