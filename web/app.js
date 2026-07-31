"use strict";

const STORAGE_KEY = "moniflow-v3-encrypted";
const SESSION_KEY = "moniflow-v3-session-key";
const ATTACHMENT_DB = "moniflow-v3-attachments";
const RATE_ENDPOINT = "https://open.er-api.com/v6/latest/USD";
const PBKDF2_ITERATIONS = 250000;
const PIN_PBKDF2_ITERATIONS = 600000;
const PIN_LENGTHS = [4, 6, 8, 12];
const CLOUD_RECOVERY_KEY = "charisna-cloud-recovery-v12";

const SUPABASE_URL = "https://ankctkfybpepwpdnswwe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_M-qTmK2xHIkxr3M6TaJKmw_p6mEZsmF";
const CLOUD_TABLE = "moniflow_vaults";
const DEVICE_ID_KEY = "moniflow-cloud-device-id";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const FALLBACK_CURRENCIES = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG",
  "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND",
  "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD",
  "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU",
  "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD",
  "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS",
  "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HTG", "HUF",
  "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY",
  "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT",
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA",
  "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN",
  "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD",
  "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR",
  "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
  "SGD", "SHP", "SLE", "SOS", "SRD", "SSP", "STN", "SVC", "SYP",
  "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD",
  "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UYW", "UZS",
  "VED", "VES", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA",
  "XBB", "XBC", "XBD", "XCD", "XCG", "XDR", "XOF", "XPD", "XPF",
  "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWG"
];

const DEFAULT_RATES = {
  USD: 1,
  IDR: 16200,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 157,
  SGD: 1.35,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.9,
  CNY: 7.26,
  HKD: 7.81,
  KRW: 1380,
  MYR: 4.7,
  THB: 36.4,
  PHP: 58.5,
  INR: 83.5,
  AED: 3.6725,
  SAR: 3.75,
  NZD: 1.66
};

const CATEGORIES = {
  Gaji: { icon: "💼", color: "#13b888", type: "income" },
  Bonus: { icon: "🎉", color: "#398cf5", type: "income" },
  Freelance: { icon: "💻", color: "#7558ff", type: "income" },
  Investasi: { icon: "📈", color: "#00a8a8", type: "income" },
  Makanan: { icon: "🍜", color: "#ff9f43", type: "expense" },
  Transportasi: { icon: "🚕", color: "#398cf5", type: "expense" },
  Belanja: { icon: "🛍️", color: "#ff6da8", type: "expense" },
  Hiburan: { icon: "🎮", color: "#9b5de5", type: "expense" },
  Tagihan: { icon: "🧾", color: "#ff5967", type: "expense" },
  Kesehatan: { icon: "💊", color: "#13b888", type: "expense" },
  Pendidikan: { icon: "📚", color: "#7558ff", type: "expense" },
  Traveling: { icon: "✈️", color: "#00b4d8", type: "expense" },
  Donasi: { icon: "🤝", color: "#f4a261", type: "expense" },
  Rumah: { icon: "🏠", color: "#577590", type: "expense" },
  Pajak: { icon: "🧮", color: "#e76f51", type: "expense" },
  Lainnya: { icon: "✨", color: "#8c8ca1", type: "both" }
};

const ACCOUNT_TYPES = {
  bank: { label: "Bank", icon: "🏦", liability: false },
  cash: { label: "Tunai", icon: "💵", liability: false },
  ewallet: { label: "E-wallet", icon: "📱", liability: false },
  investment: { label: "Investasi", icon: "📈", liability: false },
  asset: { label: "Aset", icon: "🏠", liability: false },
  credit: { label: "Kartu Kredit", icon: "💳", liability: true },
  paylater: { label: "PayLater", icon: "🛍️", liability: true },
  loan: { label: "Pinjaman", icon: "🏦", liability: true },
  debt: { label: "Utang", icon: "📕", liability: true },
  receivable: { label: "Piutang", icon: "📗", liability: false }
};

const SECTION_COPY = {
  dashboard: ["Dashboard", "Ringkasan kondisi keuanganmu."],
  transactions: ["Transaksi", "Seluruh aktivitas keuangan dan transfer."],
  accounts: ["Akun", "Aset, rekening, kartu kredit, utang, dan piutang."],
  budgets: ["Budget", "Atur batas pengeluaran yang lebih fleksibel."],
  goals: ["Financial Goals", "Bangun dana untuk tujuan penting."],
  calendar: ["Kalender", "Lihat transaksi dan pembayaran berdasarkan tanggal."],
  reports: ["Laporan", "Analisis, forecast, pajak, dan perubahan net worth."],
  tools: ["Tools", "Import, OCR, QR, rekonsiliasi, aturan, dan audit."],
  settings: ["Setting", "Preferensi, keamanan, integrasi, dan sinkronisasi."]
};

const DEFAULT_WIDGETS = [
  { id: "balance", label: "Total Saldo", enabled: true, size: "small" },
  { id: "income", label: "Pemasukan", enabled: true, size: "small" },
  { id: "expense", label: "Pengeluaran", enabled: true, size: "small" },
  { id: "networth", label: "Net Worth", enabled: true, size: "small" },
  { id: "cashflow", label: "Arus Kas", enabled: true, size: "large" },
  { id: "category", label: "Kategori", enabled: true, size: "medium" },
  { id: "budgets", label: "Budget", enabled: true, size: "medium" },
  { id: "upcoming", label: "Pembayaran Rutin", enabled: true, size: "medium" },
  { id: "goals", label: "Goals", enabled: true, size: "medium" },
  { id: "insights", label: "Insight", enabled: true, size: "medium" }
];

let vault = null;
let state = null;
let currentKey = null;
let currentKeyBytes = null;
let currentSection = "dashboard";
let calendarCursor = new Date();
let undoStack = [];
let redoStack = [];
let dashboardCashflowChart = null;
let cashflowChart = null;
let categoryChart = null;
let autoLockTimer = null;
let lastActivity = Date.now();
let installPrompt = null;
let pendingAttachmentFile = null;
let supabaseClient = null;
let cloudSession = null;
let cloudSyncTimer = null;
let cloudSyncBusy = false;
let cloudSyncQueued = false;
let latestEncryptionPromise = Promise.resolve(true);
let cloudConflict = null;
let cloudAuthMode = "login";
let cloudLastMessage = "Belum tersinkron.";
let cloudLastTone = "offline";
let loginAttemptInProgress = false;
let automaticPinUnlockTimer = null;

const currencyCodes = getCurrencyCodes();
const currencyNames = new Intl.DisplayNames(["id"], {
  type: "currency",
  fallback: "code"
});

function getCurrencyCodes() {
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      return Array.from(
        new Set([
          ...Intl.supportedValuesOf("currency"),
          ...FALLBACK_CURRENCIES
        ])
      ).sort();
    }
  } catch (error) {
    console.warn(error);
  }

  return [...FALLBACK_CURRENCIES].sort();
}

function currencyName(code) {
  try {
    return currencyNames.of(code) || code;
  } catch {
    return code;
  }
}

function currencyOptions(selected = "") {
  const favorites = [
    ...(state?.settings?.favoriteCurrencies || ["IDR", "USD", "SGD", "EUR"]),
    ...currencyCodes
  ];

  return Array.from(new Set(favorites))
    .map(
      (code) => `
        <option value="${code}" ${code === selected ? "selected" : ""}>
          ${code} — ${escapeHTML(currencyName(code))}
        </option>
      `
    )
    .join("");
}

function categoryOptions(type = "expense", selected = "") {
  return Object.entries(CATEGORIES)
    .filter(([, value]) => value.type === type || value.type === "both")
    .map(
      ([name, value]) => `
        <option value="${name}" ${name === selected ? "selected" : ""}>
          ${value.icon} ${name}
        </option>
      `
    )
    .join("");
}

function accountOptions(selected = "", includeLiability = true) {
  return financialItems(state.accounts)
    .filter((account) => includeLiability || !account.liability)
    .map(
      (account) => `
        <option value="${account.id}" ${account.id === selected ? "selected" : ""}>
          ${account.icon} ${escapeHTML(account.name)} · ${account.currency}
        </option>
      `
    )
    .join("");
}

function profileOptions(selected = "") {
  return state.profiles
    .map(
      (profile) => `
        <option value="${profile.id}" ${profile.id === selected ? "selected" : ""}>
          ${escapeHTML(profile.name)} · ${profile.type}
        </option>
      `
    )
    .join("");
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16)}`;
}

function localISO(date = new Date()) {
  const adjusted = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return adjusted.toISOString().slice(0, 10);
}

function monthOffset(offset, day = 2) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  date.setDate(Math.min(day, 27));
  return localISO(date);
}

function dayOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return localISO(date);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function deepClone(value) {
  return structuredClone
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function bytesToBase64(bytes) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const result = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    result[index] = binary.charCodeAt(index);
  }

  return result;
}

async function deriveKeyBytes(password, salt, iterations = PBKDF2_ITERATIONS) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: Math.max(100000, Number(iterations) || PBKDF2_ITERATIONS),
      hash: "SHA-256"
    },
    baseKey,
    256
  );

  return new Uint8Array(bits);
}

async function importAesKey(keyBytes) {
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptBytes(bytes, key = currentKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    bytes
  );

  return {
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(encrypted))
  };
}

async function decryptBytes(payload, key = currentKey) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBytes(payload.iv)
    },
    key,
    base64ToBytes(payload.data)
  );

  return new Uint8Array(decrypted);
}

function encryptState() {
  if (!state || !currentKey || !vault) {
    return Promise.resolve(false);
  }

  const targetVault = vault;
  const targetKey = currentKey;
  const targetSalt = vault.salt;
  const serializedState = encoder.encode(JSON.stringify(state));
  const previousEncryption = latestEncryptionPromise.catch(() => false);

  const operation = previousEncryption.then(async () => {
    const payload = await encryptBytes(serializedState, targetKey);

    if (vault !== targetVault || targetVault.salt !== targetSalt) {
      return false;
    }

    targetVault.payload = payload;
    targetVault.localUpdatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(targetVault));

    await sendWebhook("state.updated");
    scheduleCloudSync();
    return true;
  });

  latestEncryptionPromise = operation;
  return operation;
}

async function decryptState(key) {
  const bytes = await decryptBytes(vault.payload, key);
  return JSON.parse(decoder.decode(bytes));
}

function createDefaultState(userName) {
  return {
    version: 3,

    settings: {
      userName,
      baseCurrency: "IDR",
      darkMode: false,
      privacyMode: false,
      autoLockMinutes: 5,
      favoriteCurrencies: ["IDR", "USD", "SGD", "EUR", "JPY"],
      dashboardWidgets: deepClone(DEFAULT_WIDGETS),
      cloudEndpoint: "",
      cloudToken: "",
      bankFeedEndpoint: "",
      bankFeedToken: "",
      webhookUrl: "",
      notificationsEnabled: false
    },

    rates: {
      ...DEFAULT_RATES
    },

    rateHistory: [],
    lastRateUpdate: null,

    profiles: [
      {
        id: "profile-personal",
        name: "Personal",
        type: "personal",
        members: [userName],
        color: "#7558ff"
      },
      {
        id: "profile-business",
        name: "Bisnis",
        type: "business",
        members: [userName],
        color: "#13b888"
      }
    ],

    accounts: [
      {
        id: "account-bca",
        name: "BCA Utama",
        type: "bank",
        liability: false,
        currency: "IDR",
        openingBalance: 8500000,
        openingRate: 1,
        icon: "🏦",
        color: "#7558ff",
        profileId: "profile-personal",
        sharedWith: [],
        creditLimit: 0,
        statementDay: null,
        dueDay: null
      },
      {
        id: "account-gopay",
        name: "GoPay",
        type: "ewallet",
        liability: false,
        currency: "IDR",
        openingBalance: 650000,
        openingRate: 1,
        icon: "📱",
        color: "#13b888",
        profileId: "profile-personal",
        sharedWith: []
      },
      {
        id: "account-usd",
        name: "Travel USD",
        type: "cash",
        liability: false,
        currency: "USD",
        openingBalance: 500,
        openingRate: 16000,
        icon: "✈️",
        color: "#398cf5",
        profileId: "profile-personal",
        sharedWith: []
      },
      {
        id: "account-credit",
        name: "Kartu Kredit",
        type: "credit",
        liability: true,
        currency: "IDR",
        openingBalance: 750000,
        openingRate: 1,
        icon: "💳",
        color: "#ff5967",
        profileId: "profile-personal",
        sharedWith: [],
        creditLimit: 10000000,
        statementDay: 20,
        dueDay: 5
      }
    ],

    transactions: [
      {
        id: "tx-salary-current",
        type: "income",
        description: "Gaji bulanan",
        merchant: "Perusahaan",
        date: monthOffset(0, 2),
        accountId: "account-bca",
        destinationAccountId: null,
        amount: 12500000,
        destinationAmount: null,
        fee: 0,
        currency: "IDR",
        category: "Gaji",
        splits: [],
        tags: ["kantor"],
        notes: "",
        status: "completed",
        deductible: false,
        reconciled: true,
        profileId: "profile-personal",
        baseCurrency: "IDR",
        historicalRate: 1,
        baseAmount: 12500000,
        attachmentIds: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "tx-food-current",
        type: "expense",
        description: "Belanja supermarket",
        merchant: "Supermarket",
        date: monthOffset(0, 6),
        accountId: "account-bca",
        destinationAccountId: null,
        amount: 875000,
        destinationAmount: null,
        fee: 0,
        currency: "IDR",
        category: "Makanan",
        splits: [
          { category: "Makanan", amount: 650000 },
          { category: "Rumah", amount: 225000 }
        ],
        tags: ["rumah"],
        notes: "",
        status: "completed",
        deductible: false,
        reconciled: false,
        profileId: "profile-personal",
        baseCurrency: "IDR",
        historicalRate: 1,
        baseAmount: 875000,
        attachmentIds: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "tx-transfer-current",
        type: "transfer",
        description: "Top up GoPay",
        merchant: "",
        date: monthOffset(0, 8),
        accountId: "account-bca",
        destinationAccountId: "account-gopay",
        amount: 400000,
        destinationAmount: 397500,
        fee: 2500,
        currency: "IDR",
        category: "Lainnya",
        splits: [],
        tags: ["transfer"],
        notes: "",
        status: "completed",
        deductible: false,
        reconciled: true,
        profileId: "profile-personal",
        baseCurrency: "IDR",
        historicalRate: 1,
        baseAmount: 400000,
        attachmentIds: [],
        createdAt: new Date().toISOString()
      },
      ...[-1, -2, -3, -4, -5].flatMap((offset, index) => [
        {
          id: `tx-salary-${index}`,
          type: "income",
          description: "Gaji bulanan",
          merchant: "Perusahaan",
          date: monthOffset(offset, 2),
          accountId: "account-bca",
          destinationAccountId: null,
          amount: 11500000 + index * 150000,
          destinationAmount: null,
          fee: 0,
          currency: "IDR",
          category: "Gaji",
          splits: [],
          tags: ["kantor"],
          notes: "",
          status: "completed",
          deductible: false,
          reconciled: true,
          profileId: "profile-personal",
          baseCurrency: "IDR",
          historicalRate: 1,
          baseAmount: 11500000 + index * 150000,
          attachmentIds: [],
          createdAt: new Date().toISOString()
        },
        {
          id: `tx-expense-${index}`,
          type: "expense",
          description: "Pengeluaran bulanan",
          merchant: "Beragam",
          date: monthOffset(offset, 15),
          accountId: "account-bca",
          destinationAccountId: null,
          amount: 5200000 + index * 250000,
          destinationAmount: null,
          fee: 0,
          currency: "IDR",
          category: index % 2 ? "Belanja" : "Tagihan",
          splits: [],
          tags: [],
          notes: "",
          status: "completed",
          deductible: false,
          reconciled: true,
          profileId: "profile-personal",
          baseCurrency: "IDR",
          historicalRate: 1,
          baseAmount: 5200000 + index * 250000,
          attachmentIds: [],
          createdAt: new Date().toISOString()
        }
      ])
    ],

    budgets: [
      {
        id: "budget-food",
        name: "Makanan",
        category: "Makanan",
        limit: 2500000,
        currency: "IDR",
        period: "monthly",
        rollover: true,
        rolloverAmount: 0,
        accountId: "",
        tag: "",
        profileId: "profile-personal",
        alertLevels: [50, 75, 90, 100],
        color: "#ff9f43"
      },
      {
        id: "budget-shopping",
        name: "Belanja",
        category: "Belanja",
        limit: 2000000,
        currency: "IDR",
        period: "monthly",
        rollover: false,
        rolloverAmount: 0,
        accountId: "",
        tag: "",
        profileId: "profile-personal",
        alertLevels: [50, 75, 90, 100],
        color: "#ff6da8"
      }
    ],

    goals: [
      {
        id: "goal-emergency",
        name: "Dana Darurat",
        icon: "🛟",
        targetAmount: 30000000,
        currency: "IDR",
        targetDate: dayOffset(365),
        profileId: "profile-personal",
        contributions: [
          {
            id: "contribution-1",
            amount: 5500000,
            date: monthOffset(-2, 10)
          },
          {
            id: "contribution-2",
            amount: 2500000,
            date: monthOffset(-1, 10)
          }
        ],
        color: "#13b888"
      }
    ],

    recurring: [
      {
        id: "rec-netflix",
        name: "Netflix",
        type: "expense",
        accountId: "account-gopay",
        amount: 186000,
        currency: "IDR",
        category: "Hiburan",
        frequency: "monthly",
        nextDate: dayOffset(3),
        endDate: "",
        icon: "🎬",
        color: "#ff5967",
        profileId: "profile-personal",
        active: true
      },
      {
        id: "rec-internet",
        name: "Internet Rumah",
        type: "expense",
        accountId: "account-bca",
        amount: 425000,
        currency: "IDR",
        category: "Tagihan",
        frequency: "monthly",
        nextDate: dayOffset(7),
        endDate: "",
        icon: "📶",
        color: "#398cf5",
        profileId: "profile-personal",
        active: true
      }
    ],

    reconciliations: [],

    rules: [
      {
        id: "rule-supermarket",
        keyword: "supermarket",
        category: "Makanan",
        tags: ["rumah"],
        type: "expense"
      }
    ],

    auditLog: [
      {
        id: createId("audit"),
        action: "Brankas dibuat",
        detail: "CHARISNA Money Management v3 diinisialisasi.",
        timestamp: new Date().toISOString()
      }
    ]
  };
}

function loadVault() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function vaultUsesPin(targetVault = vault) {
  return targetVault?.credentialType === "pin";
}

function vaultCredentialIterations(targetVault = vault) {
  return Math.max(
    100000,
    Number(targetVault?.kdfIterations) || PBKDF2_ITERATIONS
  );
}

function selectedPinLength(selectId, fallback = 6) {
  const value = Number(document.getElementById(selectId)?.value || fallback);
  return PIN_LENGTHS.includes(value) ? value : fallback;
}

function isValidPin(pin, expectedLength) {
  return (
    PIN_LENGTHS.includes(Number(expectedLength)) &&
    /^\d+$/.test(String(pin || "")) &&
    String(pin).length === Number(expectedLength)
  );
}

function configureCredentialUI() {
  const isPin = vaultUsesPin();
  const pinLength = PIN_LENGTHS.includes(Number(vault?.pinLength))
    ? Number(vault.pinLength)
    : 6;
  const loginInput = document.getElementById("loginPassword");
  const loginLabel = document.getElementById("loginCredentialLabel");
  const loginHelp = document.getElementById("loginCredentialHelp");
  const pinPad = document.getElementById("loginPinPad");
  const oldInput = document.getElementById("oldPassword");
  const oldLabel = document.getElementById("oldCredentialLabel");

  if (loginInput) {
    loginInput.value = "";
    loginInput.inputMode = isPin ? "numeric" : "text";
    if (isPin) {
      loginInput.setAttribute("pattern", "[0-9]*");
    } else {
      loginInput.removeAttribute("pattern");
    }
    loginInput.removeAttribute("minlength");
    loginInput.removeAttribute("maxlength");
    loginInput.maxLength = isPin ? pinLength : 128;
    loginInput.minLength = isPin ? pinLength : 1;
    loginInput.placeholder = isPin
      ? `Masukkan ${pinLength} angka PIN`
      : "Masukkan sandi lama";
  }

  if (loginLabel) {
    loginLabel.textContent = isPin ? `PIN brankas (${pinLength} angka)` : "Sandi brankas lama";
  }

  if (loginHelp) {
    loginHelp.textContent = isPin
      ? "Cloud terbaru sudah dipilih otomatis. Dashboard terbuka otomatis setelah PIN lengkap dan benar."
      : "Buka sekali dengan sandi lama, lalu aplikasi akan membantu mengubahnya menjadi PIN angka.";
  }

  if (pinPad) {
    pinPad.hidden = !isPin;
  }

  if (oldInput) {
    oldInput.inputMode = isPin ? "numeric" : "text";
    if (isPin) {
      oldInput.setAttribute("pattern", "[0-9]*");
    } else {
      oldInput.removeAttribute("pattern");
    }
    oldInput.maxLength = isPin ? pinLength : 128;
  }

  if (oldLabel) {
    oldLabel.textContent = isPin ? "PIN lama" : "Sandi lama";
  }
}

function updatePinFieldLengths(selectId, inputIds) {
  const length = selectedPinLength(selectId);

  inputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.removeAttribute("minlength");
    input.removeAttribute("maxlength");
    input.maxLength = length;
    input.minLength = length;
    input.placeholder = `${length} angka`;
    input.value = input.value.replace(/\D/g, "").slice(0, length);
  });
}

function setLoginAttemptBusy(isBusy) {
  loginAttemptInProgress = Boolean(isBusy);

  const form = document.getElementById("loginForm");
  const input = document.getElementById("loginPassword");
  const submitButton = form?.querySelector('button[type="submit"]');

  form?.setAttribute("aria-busy", String(loginAttemptInProgress));
  if (input) input.readOnly = loginAttemptInProgress;

  document
    .querySelectorAll("#loginPinPad button")
    .forEach((button) => {
      button.disabled = loginAttemptInProgress;
    });

  if (submitButton) {
    submitButton.disabled = loginAttemptInProgress;
    submitButton.dataset.defaultLabel ||= submitButton.textContent.trim();
    submitButton.textContent = loginAttemptInProgress
      ? "Membuka..."
      : submitButton.dataset.defaultLabel;
  }
}

function requestAutomaticPinUnlock(input) {
  window.clearTimeout(automaticPinUnlockTimer);

  if (
    loginAttemptInProgress ||
    !vaultUsesPin() ||
    !vault ||
    state ||
    !input ||
    document.getElementById("loginPanel")?.hidden
  ) {
    return;
  }

  const expectedLength = Number(vault.pinLength || 6);
  const pin = input.value;

  if (!isValidPin(pin, expectedLength)) return;

  automaticPinUnlockTimer = window.setTimeout(() => {
    const form = document.getElementById("loginForm");
    const currentInput = document.getElementById("loginPassword");

    if (
      !form ||
      !currentInput ||
      loginAttemptInProgress ||
      state ||
      currentInput.value !== pin ||
      !isValidPin(currentInput.value, expectedLength)
    ) {
      return;
    }

    form.requestSubmit();
  }, 0);
}

function bindPinControls() {
  const syncSetupLength = () =>
    updatePinFieldLengths("setupPinLength", [
      "setupPassword",
      "setupPasswordConfirm"
    ]);
  const syncChangeLength = () =>
    updatePinFieldLengths("newPinLength", [
      "newPassword",
      "newPasswordConfirm"
    ]);

  document.getElementById("setupPinLength")?.addEventListener("change", syncSetupLength);
  document.getElementById("newPinLength")?.addEventListener("change", syncChangeLength);

  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("[data-pin-input]");
    if (!input) return;
    if (input.id === "loginPassword" && !vaultUsesPin()) return;

    input.value = input.value.replace(/\D/g, "").slice(0, input.maxLength || 12);

    if (input.id === "loginPassword") {
      const errorElement = document.getElementById("loginError");
      if (errorElement && !/terlalu banyak percobaan/i.test(errorElement.textContent)) {
        errorElement.textContent = "";
      }
      requestAutomaticPinUnlock(input);
    }
  });

  document.getElementById("loginPinPad")?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const input = document.getElementById("loginPassword");
    if (!button || !input || !vaultUsesPin()) return;

    if (button.dataset.pinAction === "clear") {
      input.value = "";
    } else if (button.dataset.pinAction === "backspace") {
      input.value = input.value.slice(0, -1);
    } else if (button.dataset.pinKey && input.value.length < input.maxLength) {
      input.value += button.dataset.pinKey;
    }

    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  syncSetupLength();
  syncChangeLength();
  configureCredentialUI();
}

async function setNewVaultPin(pin, pinLength) {
  if (!isValidPin(pin, pinLength)) {
    throw new Error(`PIN harus tepat ${pinLength} angka.`);
  }

  const newSalt = crypto.getRandomValues(new Uint8Array(16));
  const newKeyBytes = await deriveKeyBytes(
    pin,
    newSalt,
    PIN_PBKDF2_ITERATIONS
  );
  const newKey = await importAesKey(newKeyBytes);

  currentKeyBytes = newKeyBytes;
  currentKey = newKey;
  vault.salt = bytesToBase64(newSalt);
  vault.credentialType = "pin";
  vault.pinLength = Number(pinLength);
  vault.kdfIterations = PIN_PBKDF2_ITERATIONS;
  vault.passkeyCredentialId = null;

  sessionStorage.setItem(SESSION_KEY, bytesToBase64(currentKeyBytes));
  await encryptState();
  configureCredentialUI();

  if (cloudSession?.user && navigator.onLine) {
    await cloudPush({ silent: true });
  }
}

function showPinMigrationModal() {
  if (!state || vaultUsesPin()) {
    return;
  }

  showModal(
    "Ubah sandi lama menjadi PIN",
    "Data tetap terenkripsi. Pilih PIN angka 4, 6, 8, atau 12 digit.",
    `<form id="pinMigrationForm">
      <div class="form-stack">
        <label class="field"><span>Panjang PIN</span><select class="input" id="migrationPinLength"><option value="4">4 angka</option><option value="6" selected>6 angka · disarankan</option><option value="8">8 angka</option><option value="12">12 angka</option></select></label>
        <label class="field"><span>PIN baru</span><input class="input" id="migrationPin" type="password" inputmode="numeric" pattern="[0-9]*" minlength="6" maxlength="6" data-pin-input required /></label>
        <label class="field"><span>Ulangi PIN</span><input class="input" id="migrationPinConfirm" type="password" inputmode="numeric" pattern="[0-9]*" minlength="6" maxlength="6" data-pin-input required /></label>
        <p class="pin-security-note">PIN 6 atau 8 angka disarankan. Setelah disimpan, PIN baru otomatis dikirim ke cloud.</p>
        <p class="form-error" id="migrationPinError"></p>
      </div>
      <div class="form-actions"><button class="button secondary" id="postponePinMigration" type="button">Nanti</button><button class="button primary" type="submit">Simpan PIN</button></div>
    </form>`
  );

  const select = document.getElementById("migrationPinLength");
  const syncLength = () =>
    updatePinFieldLengths("migrationPinLength", [
      "migrationPin",
      "migrationPinConfirm"
    ]);
  select.addEventListener("change", syncLength);
  syncLength();
  document.getElementById("postponePinMigration").addEventListener("click", closeModal);
  document.getElementById("pinMigrationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const length = selectedPinLength("migrationPinLength");
    const pin = document.getElementById("migrationPin").value;
    const confirmation = document.getElementById("migrationPinConfirm").value;
    const errorElement = document.getElementById("migrationPinError");
    errorElement.textContent = "";

    if (!isValidPin(pin, length) || pin !== confirmation) {
      errorElement.textContent = `PIN harus sama dan tepat ${length} angka.`;
      return;
    }

    try {
      event.submitter.disabled = true;
      event.submitter.textContent = "Menyimpan...";
      await setNewVaultPin(pin, length);
      addAudit("Keamanan PIN diaktifkan", `Sandi lama dimigrasikan menjadi PIN ${length} angka.`);
      await encryptState();
      closeModal();
      showToast("PIN baru aktif di semua perangkat.", "🔐");
    } catch (error) {
      console.error(error);
      errorElement.textContent = error.message;
      event.submitter.disabled = false;
      event.submitter.textContent = "Simpan PIN";
    }
  });
}

function saveEncryptedCloudRecovery(label = "Sebelum memakai cloud terbaru") {
  const localVault = loadVault();

  if (!localVault?.payload) {
    return;
  }

  try {
    const items = JSON.parse(localStorage.getItem(CLOUD_RECOVERY_KEY) || "[]");
    const latest = items[0]?.vault;

    if (
      latest?.payload?.data === localVault.payload?.data &&
      latest?.payload?.iv === localVault.payload?.iv
    ) {
      return;
    }

    items.unshift({
      label,
      createdAt: new Date().toISOString(),
      cloudVersion: Number(localVault.cloud?.version || 0),
      vault: deepClone(localVault)
    });

    localStorage.setItem(CLOUD_RECOVERY_KEY, JSON.stringify(items.slice(0, 5)));
  } catch (error) {
    console.warn("Cadangan pemulihan cloud gagal dibuat:", error);
  }
}

function rateFor(currency) {
  const value = Number(state.rates[currency]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function convertCurrency(amount, from, to) {
  const sourceRate = rateFor(from);
  const targetRate = rateFor(to);

  if (from === to) {
    return Number(amount);
  }

  if (!sourceRate || !targetRate) {
    return null;
  }

  return (Number(amount) / sourceRate) * targetRate;
}

function formatCurrency(
  amount,
  currency = state.settings.baseCurrency,
  compact = false
) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 2,
      minimumFractionDigits: 0
    }).format(Number(amount) || 0);
  } catch {
    return `${currency} ${(Number(amount) || 0).toLocaleString("id-ID")}`;
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium"
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

function transactionBaseValue(transaction, amount = transaction.amount) {
  if (
    transaction.baseCurrency === state.settings.baseCurrency &&
    Number.isFinite(Number(transaction.historicalRate))
  ) {
    return Number(amount) * Number(transaction.historicalRate);
  }

  const historicalCurrencyValue =
    Number(amount) * Number(transaction.historicalRate || 0);

  return (
    convertCurrency(
      historicalCurrencyValue,
      transaction.baseCurrency || state.settings.baseCurrency,
      state.settings.baseCurrency
    ) ?? 0
  );
}

function accountBalance(account) {
  let balance = Number(account.openingBalance) || 0;

  state.transactions.forEach((transaction) => {
    if (transaction.status === "cancelled") {
      return;
    }

    if (transaction.type === "transfer") {
      if (transaction.accountId === account.id) {
        balance += account.liability
          ? Number(transaction.amount) + Number(transaction.fee || 0)
          : -(Number(transaction.amount) + Number(transaction.fee || 0));
      }

      if (transaction.destinationAccountId === account.id) {
        balance += account.liability
          ? -Number(transaction.destinationAmount || transaction.amount)
          : Number(transaction.destinationAmount || transaction.amount);
      }

      return;
    }

    if (transaction.accountId !== account.id) {
      return;
    }

    const amount = Number(transaction.amount) || 0;

    if (account.liability) {
      balance += transaction.type === "expense" ? amount : -amount;
    } else {
      balance += transaction.type === "income" ? amount : -amount;
    }
  });

  return balance;
}

function accountValueInBase(account) {
  return (
    convertCurrency(
      accountBalance(account),
      account.currency,
      state.settings.baseCurrency
    ) ?? 0
  );
}

function totalAssets() {
  return financialItems(state.accounts)
    .filter((account) => !account.liability)
    .reduce((sum, account) => sum + accountValueInBase(account), 0);
}

function totalLiabilities() {
  return financialItems(state.accounts)
    .filter((account) => account.liability)
    .reduce((sum, account) => sum + accountValueInBase(account), 0);
}

function netWorth() {
  return totalAssets() - totalLiabilities();
}

function currentMonthTransactions() {
  const now = new Date();

  return financialItems(state.transactions).filter((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
}

function periodTransactions(offset = 0) {
  const target = new Date();
  target.setMonth(target.getMonth() + offset);

  return financialItems(state.transactions).filter((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`);

    return (
      date.getMonth() === target.getMonth() &&
      date.getFullYear() === target.getFullYear()
    );
  });
}

function periodTotals(offset = 0) {
  return periodTransactions(offset).reduce(
    (result, transaction) => {
      if (
        transaction.type === "transfer" ||
        transaction.status === "cancelled"
      ) {
        return result;
      }

      const value = transactionBaseValue(transaction);

      if (transaction.type === "income") {
        result.income += value;
      } else {
        result.expense += value;
      }

      return result;
    },
    { income: 0, expense: 0 }
  );
}

function categoryTotals(offset = 0) {
  const totals = {};

  periodTransactions(offset).forEach((transaction) => {
    if (
      transaction.type !== "expense" ||
      transaction.status === "cancelled"
    ) {
      return;
    }

    if (transaction.splits?.length) {
      transaction.splits.forEach((split) => {
        totals[split.category] =
          (totals[split.category] || 0) +
          transactionBaseValue(transaction, split.amount);
      });

      return;
    }

    totals[transaction.category] =
      (totals[transaction.category] || 0) +
      transactionBaseValue(transaction);
  });

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function budgetPeriodStart(period) {
  const now = new Date();

  if (period === "weekly") {
    const day = now.getDay() || 7;
    now.setDate(now.getDate() - day + 1);
  } else if (period === "yearly") {
    now.setMonth(0, 1);
  } else {
    now.setDate(1);
  }

  now.setHours(0, 0, 0, 0);
  return now;
}

function budgetSpent(budget) {
  const start = budgetPeriodStart(budget.period);

  return financialItems(state.transactions).reduce((sum, transaction) => {
    if (
      transaction.type !== "expense" ||
      transaction.status === "cancelled" ||
      new Date(`${transaction.date}T00:00:00`) < start
    ) {
      return sum;
    }

    if (budget.accountId && transaction.accountId !== budget.accountId) {
      return sum;
    }

    if (
      budget.tag &&
      !transaction.tags?.some(
        (tag) => tag.toLowerCase() === budget.tag.toLowerCase()
      )
    ) {
      return sum;
    }

    let nativeAmount = 0;

    if (transaction.splits?.length) {
      nativeAmount = transaction.splits
        .filter((split) => split.category === budget.category)
        .reduce((total, split) => total + Number(split.amount), 0);
    } else if (transaction.category === budget.category) {
      nativeAmount = Number(transaction.amount);
    }

    return (
      sum +
      (convertCurrency(
        nativeAmount,
        transaction.currency,
        budget.currency
      ) ?? 0)
    );
  }, 0);
}

function goalSaved(goal) {
  return goal.contributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount),
    0
  );
}

function goalMonthlyRequirement(goal) {
  const remaining = Math.max(
    Number(goal.targetAmount) - goalSaved(goal),
    0
  );

  const now = new Date();
  const target = new Date(`${goal.targetDate}T00:00:00`);

  const months = Math.max(
    1,
    (target.getFullYear() - now.getFullYear()) * 12 +
      target.getMonth() -
      now.getMonth()
  );

  return remaining / months;
}

function addAudit(action, detail) {
  state.auditLog.unshift({
    id: createId("audit"),
    action,
    detail,
    timestamp: new Date().toISOString()
  });

  state.auditLog = state.auditLog.slice(0, 200);
}

async function commit(action, detail, mutator) {
  undoStack.push(deepClone(state));
  undoStack = undoStack.slice(-30);
  redoStack = [];

  mutator();
  addAudit(action, detail);

  await encryptState();
  renderAll();
}

async function undo() {
  if (!undoStack.length) {
    showToast("Tidak ada perubahan yang dapat dibatalkan.", "↶");
    return;
  }

  redoStack.push(deepClone(state));
  state = undoStack.pop();
  addAudit("Undo", "Perubahan terakhir dibatalkan.");

  await encryptState();
  renderAll();
}

async function redo() {
  if (!redoStack.length) {
    showToast("Tidak ada perubahan untuk diulangi.", "↷");
    return;
  }

  undoStack.push(deepClone(state));
  state = redoStack.pop();
  addAudit("Redo", "Perubahan diterapkan kembali.");

  await encryptState();
  renderAll();
}

function showToast(message, icon = "✔️") {
  const toast = document.createElement("div");
  toast.className = "toast";

  toast.innerHTML = `
    <span>${icon}</span>
    <strong>${escapeHTML(message)}</strong>
  `;

  document.getElementById("toastContainer").appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

function showModal(title, subtitle, content) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalSubtitle").textContent = subtitle;
  document.getElementById("modalContent").innerHTML = content;
  document.getElementById("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalBackdrop").hidden = true;
  document.body.style.overflow = "";
}

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.darkMode
    ? "dark"
    : "light";

  document.getElementById("themeButton").textContent =
    state.settings.darkMode ? "☀️" : "🌙";

  document.body.classList.toggle(
    "privacy-mode",
    state.settings.privacyMode
  );

  document.getElementById("privacyButton").textContent =
    state.settings.privacyMode ? "🙈" : "👁️";
}

function renderHeader() {
  const [title, subtitle] = SECTION_COPY[currentSection];

  document.getElementById("pageTitle").textContent =
    currentSection === "dashboard"
      ? `Halo, ${state.settings.userName}! 👋`
      : title;

  document.getElementById("pageSubtitle").textContent = subtitle;
}

function changeSection(sectionId) {
  currentSection = sectionId;

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.section === sectionId
    );
  });

  renderHeader();

  if (sectionId === "reports") {
    requestAnimationFrame(renderReportCharts);
  }
}

function renderDashboard() {
  const totals = periodTotals();
  const widgets = state.settings.dashboardWidgets.filter(
    (widget) => widget.enabled
  );

  const renderers = {
    balance: () => statWidget(
      "Total Saldo",
      totalAssets(),
      "💰",
      "Gabungan seluruh akun aset.",
      "var(--primary-soft)"
    ),

    income: () => statWidget(
      "Pemasukan Bulan Ini",
      totals.income,
      "📈",
      `${periodTransactions().filter((tx) => tx.type === "income").length} transaksi masuk`,
      "var(--green-soft)"
    ),

    expense: () => statWidget(
      "Pengeluaran Bulan Ini",
      totals.expense,
      "🛍️",
      `${periodTransactions().filter((tx) => tx.type === "expense").length} transaksi keluar`,
      "var(--red-soft)"
    ),

    networth: () => statWidget(
      "Net Worth",
      netWorth(),
      "🌍",
      `${formatCurrency(totalAssets())} aset − ${formatCurrency(totalLiabilities())} kewajiban`,
      "var(--orange-soft)"
    ),

    cashflow: () => `
      <article class="panel widget large">
        <header class="panel-header">
          <div>
            <h4>Arus Kas 6 Bulan</h4>
            <p>Pemasukan dan pengeluaran historis.</p>
          </div>
        </header>

        <canvas id="dashboardCashflowChart"></canvas>
      </article>
    `,

    category: () => {
      const categories = categoryTotals().slice(0, 5);

      return `
        <article class="panel widget medium">
          <header class="panel-header">
            <div>
              <h4>Top Kategori</h4>
              <p>Pengeluaran terbesar bulan ini.</p>
            </div>
          </header>

          <div class="simple-list">
            ${
              categories.length
                ? categories.map((item) => `
                    <button
                      class="simple-item"
                      data-drill-category="${escapeHTML(item.category)}"
                      type="button"
                    >
                      <span>
                        ${CATEGORIES[item.category]?.icon || "✨"}
                        ${escapeHTML(item.category)}
                      </span>

                      <strong class="money">
                        ${formatCurrency(item.amount, undefined, true)}
                      </strong>
                    </button>
                  `).join("")
                : emptyState("🌈", "Belum ada pengeluaran.")
            }
          </div>
        </article>
      `;
    },

    budgets: () => `
      <article class="panel widget medium">
        <header class="panel-header">
          <div>
            <h4>Budget</h4>
            <p>Progress anggaran aktif.</p>
          </div>
        </header>

        <div class="simple-list">
          ${
            financialItems(state.budgets).length
              ? financialItems(state.budgets).slice(0, 4).map((budget) => {
                  const spent = budgetSpent(budget);
                  const limit =
                    Number(budget.limit) +
                    (budget.rollover
                      ? Number(budget.rolloverAmount || 0)
                      : 0);

                  const percentage =
                    limit > 0 ? (spent / limit) * 100 : 0;

                  return `
                    <div class="insight-item">
                      <strong>
                        ${escapeHTML(budget.name)}
                        · ${percentage.toFixed(0)}%
                      </strong>

                      <div class="progress-track">
                        <div
                          class="progress-bar"
                          style="
                            width:${Math.min(percentage, 100)}%;
                            background:${percentage >= 100 ? "#ff5967" : budget.color};
                          "
                        ></div>
                      </div>
                    </div>
                  `;
                }).join("")
              : emptyState("🎯", "Belum ada budget.")
          }
        </div>
      </article>
    `,

    upcoming: () => `
      <article class="panel widget medium">
        <header class="panel-header">
          <div>
            <h4>Pembayaran Berikutnya</h4>
            <p>Tagihan dan pemasukan rutin.</p>
          </div>
        </header>

        <div class="simple-list">
          ${
            upcomingRecurring().length
              ? upcomingRecurring().slice(0, 4).map((item) => `
                  <div class="simple-item">
                    <span>
                      ${item.icon}
                      ${escapeHTML(item.name)}
                    </span>

                    <strong class="money">
                      ${formatCurrency(item.amount, item.currency)}
                    </strong>
                  </div>
                `).join("")
              : emptyState("🔁", "Belum ada pembayaran rutin.")
          }
        </div>
      </article>
    `,

    goals: () => `
      <article class="panel widget medium">
        <header class="panel-header">
          <div>
            <h4>Financial Goals</h4>
            <p>Progress tujuan keuangan.</p>
          </div>
        </header>

        <div class="simple-list">
          ${
            financialItems(state.goals).length
              ? financialItems(state.goals).slice(0, 4).map((goal) => {
                  const saved = goalSaved(goal);
                  const percentage =
                    Number(goal.targetAmount) > 0
                      ? (saved / Number(goal.targetAmount)) * 100
                      : 0;

                  return `
                    <div class="insight-item">
                      <strong>
                        ${goal.icon} ${escapeHTML(goal.name)}
                        · ${percentage.toFixed(0)}%
                      </strong>

                      <div class="progress-track">
                        <div
                          class="progress-bar"
                          style="
                            width:${Math.min(percentage, 100)}%;
                            background:${goal.color};
                          "
                        ></div>
                      </div>
                    </div>
                  `;
                }).join("")
              : emptyState("🌱", "Belum ada goal.")
          }
        </div>
      </article>
    `,

    insights: () => `
      <article class="panel widget medium">
        <header class="panel-header">
          <div>
            <h4>Insight Otomatis</h4>
            <p>Pola yang ditemukan dari data.</p>
          </div>
        </header>

        <div class="insight-list">
          ${generateInsights()
            .slice(0, 4)
            .map(
              (insight) => `
                <div class="insight-item">
                  <strong>${insight.icon} ${escapeHTML(insight.title)}</strong>
                  ${escapeHTML(insight.text)}
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    `
  };

  document.getElementById("dashboardWidgets").innerHTML = widgets
    .map((widget) => renderers[widget.id]?.() || "")
    .join("");

  requestAnimationFrame(renderDashboardChart);
}

function statWidget(label, value, icon, description, softColor) {
  return `
    <article
      class="stat-card widget small"
      style="--stat-soft:${softColor}"
    >
      <header>
        <span>${label}</span>
        <span class="stat-icon">${icon}</span>
      </header>

      <strong class="money">${formatCurrency(value)}</strong>
      <p>${description}</p>
    </article>
  `;
}

function renderTransactions() {
  const query = document
    .getElementById("transactionSearch")
    .value.trim()
    .toLowerCase();

  const typeFilter =
    document.getElementById("transactionTypeFilter").value;

  const transactions = [...financialItems(state.transactions)]
    .filter((transaction) => {
      if (typeFilter && transaction.type !== typeFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        transaction.description,
        transaction.merchant,
        transaction.category,
        ...(transaction.tags || [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById("transactionTable").innerHTML =
    transactions.length
      ? transactions.map(transactionRow).join("")
      : `
          <tr>
            <td colspan="7">
              ${emptyState("🔎", "Tidak ada transaksi yang cocok.")}
            </td>
          </tr>
        `;
}

function transactionRow(transaction) {
  const account = state.accounts.find(
    (item) => item.id === transaction.accountId
  );

  const destination = state.accounts.find(
    (item) => item.id === transaction.destinationAccountId
  );

  const meta = CATEGORIES[transaction.category] || CATEGORIES.Lainnya;

  const amountClass =
    transaction.type === "income"
      ? "positive"
      : transaction.type === "expense"
        ? "negative"
        : "";

  const amountPrefix =
    transaction.type === "income"
      ? "+"
      : transaction.type === "expense"
        ? "-"
        : "";

  return `
    <tr>
      <td>
        <div class="transaction-main">
          <div
            class="transaction-icon"
            style="
              color:${meta.color};
              background:${meta.color}20;
            "
          >
            ${transaction.type === "transfer" ? "↔️" : meta.icon}
          </div>

          <div>
            <strong>${escapeHTML(transaction.description)}</strong>

            <small>
              ${escapeHTML(transaction.merchant || "")}
              ${
                transaction.tags?.length
                  ? ` · #${transaction.tags.map(escapeHTML).join(" #")}`
                  : ""
              }
            </small>
          </div>
        </div>
      </td>

      <td>
        ${escapeHTML(account?.name || "Akun dihapus")}
        ${
          destination
            ? `<br><small>→ ${escapeHTML(destination.name)}</small>`
            : ""
        }
      </td>

      <td>${formatDate(transaction.date)}</td>

      <td>
        ${
          transaction.splits?.length
            ? `${transaction.splits.length} kategori`
            : escapeHTML(transaction.category)
        }
      </td>

      <td>
        <span class="badge">
          ${escapeHTML(transaction.status)}
          ${transaction.reconciled ? " · ✓" : ""}
        </span>
      </td>

      <td class="${amountClass} money">
        <strong>
          ${amountPrefix}
          ${formatCurrency(transaction.amount, transaction.currency)}
        </strong>
      </td>

      <td>
        <div class="table-actions">
          <button
            class="mini-button"
            data-edit-transaction="${transaction.id}"
            type="button"
            title="Edit"
          >
            ✏️
          </button>

          <button
            class="mini-button"
            data-delete-transaction="${transaction.id}"
            type="button"
            title="Hapus"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderAccounts() {
  document.getElementById("accountGrid").innerHTML =
    financialItems(state.accounts).length
      ? financialItems(state.accounts).map((account) => {
          const type = ACCOUNT_TYPES[account.type];
          const balance = accountBalance(account);
          const converted = accountValueInBase(account);

          let creditUsage = "";

          if (account.liability && Number(account.creditLimit) > 0) {
            const percentage =
              (balance / Number(account.creditLimit)) * 100;

            creditUsage = `
              <div style="margin-top:16px">
                <div class="progress-track">
                  <div
                    class="progress-bar"
                    style="
                      width:${Math.min(percentage, 100)}%;
                      background:${percentage > 80 ? "#ff5967" : account.color};
                    "
                  ></div>
                </div>

                <div class="progress-meta">
                  <span>${percentage.toFixed(0)}% limit terpakai</span>
                  <span class="money">
                    Sisa
                    ${formatCurrency(
                      Math.max(Number(account.creditLimit) - balance, 0),
                      account.currency
                    )}
                  </span>
                </div>
              </div>
            `;
          }

          return `
            <article
              class="account-card"
              style="--account-color:${account.color}"
            >
              <div class="card-top">
                <div class="card-icon">
                  ${account.icon || type.icon}
                </div>

                <span class="badge">
                  ${type.label} · ${account.currency}
                </span>
              </div>

              <h4>${escapeHTML(account.name)}</h4>

              <span class="balance money">
                ${formatCurrency(balance, account.currency)}
              </span>

              <p class="muted money">
                ≈ ${formatCurrency(converted)}
              </p>

              ${creditUsage}

              <div class="card-bottom">
                <span>
                  ${account.liability ? "Kewajiban" : "Aset"}
                  ·
                  ${
                    state.profiles.find(
                      (profile) => profile.id === account.profileId
                    )?.name || "Personal"
                  }
                </span>

                <div class="table-actions">
                  <button
                    class="mini-button"
                    data-reconcile-account="${account.id}"
                    type="button"
                    title="Rekonsiliasi"
                  >
                    ✓
                  </button>

                  <button
                    class="mini-button"
                    data-edit-account="${account.id}"
                    type="button"
                    title="Edit"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join("")
      : emptyState("👛", "Belum ada akun.");
}

function renderBudgets() {
  document.getElementById("budgetGrid").innerHTML =
    financialItems(state.budgets).length
      ? financialItems(state.budgets).map((budget) => {
          const spent = budgetSpent(budget);

          const totalLimit =
            Number(budget.limit) +
            (budget.rollover
              ? Number(budget.rolloverAmount || 0)
              : 0);

          const percentage =
            totalLimit > 0 ? (spent / totalLimit) * 100 : 0;

          return `
            <article class="budget-card">
              <div class="card-top">
                <div>
                  <span class="badge">${budget.period}</span>
                  <h4>${escapeHTML(budget.name)}</h4>
                </div>

                <strong style="color:${budget.color}">
                  ${percentage.toFixed(0)}%
                </strong>
              </div>

              <p class="muted">
                ${escapeHTML(budget.category)}
                ${budget.tag ? ` · #${escapeHTML(budget.tag)}` : ""}
                ${budget.rollover ? " · rollover" : ""}
              </p>

              <div style="margin-top:18px" class="progress-track">
                <div
                  class="progress-bar"
                  style="
                    width:${Math.min(percentage, 100)}%;
                    background:${percentage >= 100 ? "#ff5967" : budget.color};
                  "
                ></div>
              </div>

              <div class="progress-meta">
                <span class="money">
                  ${formatCurrency(spent, budget.currency)}
                </span>

                <span class="money">
                  dari ${formatCurrency(totalLimit, budget.currency)}
                </span>
              </div>

              <div class="card-bottom">
                <span>
                  Sisa
                  <strong class="money">
                    ${formatCurrency(
                      Math.max(totalLimit - spent, 0),
                      budget.currency
                    )}
                  </strong>
                </span>

                <button
                  class="mini-button"
                  data-edit-budget="${budget.id}"
                  type="button"
                >
                  ✏️
                </button>
              </div>
            </article>
          `;
        }).join("")
      : emptyState("🎯", "Belum ada budget.");
}

function renderGoals() {
  document.getElementById("goalGrid").innerHTML =
    financialItems(state.goals).length
      ? financialItems(state.goals).map((goal) => {
          const saved = goalSaved(goal);
          const percentage =
            Number(goal.targetAmount) > 0
              ? (saved / Number(goal.targetAmount)) * 100
              : 0;

          return `
            <article class="goal-card">
              <div class="card-top">
                <div class="card-icon" style="--account-color:${goal.color}">
                  ${goal.icon}
                </div>

                <span class="badge">
                  ${formatDate(goal.targetDate)}
                </span>
              </div>

              <h4>${escapeHTML(goal.name)}</h4>

              <strong class="money" style="display:block;margin-top:8px">
                ${formatCurrency(saved, goal.currency)}
              </strong>

              <p class="muted money">
                Target ${formatCurrency(goal.targetAmount, goal.currency)}
              </p>

              <div style="margin-top:18px" class="progress-track">
                <div
                  class="progress-bar"
                  style="
                    width:${Math.min(percentage, 100)}%;
                    background:${goal.color};
                  "
                ></div>
              </div>

              <div class="progress-meta">
                <span>${percentage.toFixed(1)}%</span>

                <span class="money">
                  Perlu
                  ${formatCurrency(
                    goalMonthlyRequirement(goal),
                    goal.currency
                  )}
                  /bulan
                </span>
              </div>

              <div class="card-bottom">
                <button
                  class="button secondary"
                  data-contribute-goal="${goal.id}"
                  type="button"
                >
                  ＋ Setoran
                </button>

                <button
                  class="mini-button"
                  data-edit-goal="${goal.id}"
                  type="button"
                >
                  ✏️
                </button>
              </div>
            </article>
          `;
        }).join("")
      : emptyState("🌱", "Belum ada financial goal.");
}

function upcomingRecurring() {
  return [...financialItems(state.recurring)]
    .filter((item) => item.active)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();

  document.getElementById("calendarTitle").textContent =
    new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric"
    }).format(calendarCursor);

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  const weekday = firstDay.getDay() || 7;
  start.setDate(firstDay.getDate() - weekday + 1);

  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const iso = localISO(date);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = iso === localISO();

    const events = [
      ...financialItems(state.transactions)
        .filter((transaction) => transaction.date === iso)
        .map((transaction) => ({
          label: transaction.description,
          color:
            transaction.type === "income"
              ? "#13b888"
              : transaction.type === "expense"
                ? "#ff5967"
                : "#7558ff"
        })),

      ...financialItems(state.recurring)
        .filter((item) => item.nextDate === iso && item.active)
        .map((item) => ({
          label: item.name,
          color: item.color
        })),

      ...financialItems(state.goals)
        .filter((goal) => goal.targetDate === iso)
        .map((goal) => ({
          label: `Target: ${goal.name}`,
          color: goal.color
        }))
    ];

    cells.push(`
      <div
        class="calendar-cell
          ${isCurrentMonth ? "" : "outside"}
          ${isToday ? "today" : ""}
        "
      >
        <span class="calendar-date">${date.getDate()}</span>

        ${events
          .slice(0, 4)
          .map(
            (event) => `
              <span
                class="calendar-event"
                style="--event-color:${event.color}"
                title="${escapeHTML(event.label)}"
              >
                ${escapeHTML(event.label)}
              </span>
            `
          )
          .join("")}
      </div>
    `);
  }

  document.getElementById("calendarGrid").innerHTML = `
    ${weekdays
      .map(
        (weekdayName) => `
          <div class="calendar-weekday">${weekdayName}</div>
        `
      )
      .join("")}

    ${cells.join("")}
  `;
}

function renderReports() {
  const current = periodTotals(0);
  const previous = periodTotals(-1);
  const expenseChange =
    previous.expense > 0
      ? ((current.expense - previous.expense) / previous.expense) * 100
      : 0;

  document.getElementById("reportSummary").innerHTML = `
    ${reportCard("Total Aset", totalAssets(), "💰")}
    ${reportCard("Total Kewajiban", totalLiabilities(), "💳")}
    ${reportCard("Net Worth", netWorth(), "🌍")}
    ${reportCard(
      "Perubahan Pengeluaran",
      expenseChange,
      expenseChange <= 0 ? "📉" : "📈",
      true
    )}
  `;

  renderForecast();
  renderInsights();
  renderFxReport();
  renderTaxReport();
}

function reportCard(label, value, icon, percentage = false) {
  return `
    <article class="stat-card" style="--stat-soft:var(--primary-soft)">
      <header>
        <span>${label}</span>
        <span class="stat-icon">${icon}</span>
      </header>

      <strong class="money">
        ${percentage ? `${value.toFixed(1)}%` : formatCurrency(value)}
      </strong>
    </article>
  `;
}

function sixMonthData() {
  const result = [];

  for (let offset = -5; offset <= 0; offset += 1) {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);

    const totals = periodTotals(offset);

    result.push({
      label: new Intl.DateTimeFormat("id-ID", {
        month: "short"
      }).format(date),
      income: totals.income,
      expense: totals.expense
    });
  }

  return result;
}

function renderDashboardChart() {
  if (!state) {
    return;
  }

  const canvas = document.getElementById("dashboardCashflowChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  const data = sixMonthData();

  dashboardCashflowChart?.destroy();
  const existingChart = typeof Chart.getChart === "function" ? Chart.getChart(canvas) : null;
  if (existingChart && existingChart !== dashboardCashflowChart) existingChart.destroy();

  dashboardCashflowChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: "Pemasukan",
          data: data.map((item) => item.income),
          borderColor: "#7558ff",
          backgroundColor: "rgba(117,88,255,.15)",
          fill: true,
          tension: 0.35
        },
        {
          label: "Pengeluaran",
          data: data.map((item) => item.expense),
          borderColor: "#ff6da8",
          backgroundColor: "rgba(255,109,168,.10)",
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: chartOptions()
  });
}

function renderReportCharts() {
  if (typeof Chart === "undefined") {
    return;
  }

  cashflowChart?.destroy();
  categoryChart?.destroy();

  const cashflow = sixMonthData();

  cashflowChart = new Chart(
    document.getElementById("cashflowChart"),
    {
      type: "line",
      data: {
        labels: cashflow.map((item) => item.label),
        datasets: [
          {
            label: "Pemasukan",
            data: cashflow.map((item) => item.income),
            borderColor: "#7558ff",
            backgroundColor: "rgba(117,88,255,.15)",
            fill: true,
            tension: 0.35
          },
          {
            label: "Pengeluaran",
            data: cashflow.map((item) => item.expense),
            borderColor: "#ff6da8",
            backgroundColor: "rgba(255,109,168,.12)",
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: chartOptions()
    }
  );

  const categories = categoryTotals();

  categoryChart = new Chart(
    document.getElementById("categoryChart"),
    {
      type: "doughnut",
      data: {
        labels: categories.map((item) => item.category),
        datasets: [
          {
            data: categories.map((item) => item.amount),
            backgroundColor: categories.map(
              (item) =>
                CATEGORIES[item.category]?.color || "#8c8ca1"
            ),
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        onClick: (_, elements) => {
          if (!elements.length) {
            return;
          }

          const category = categories[elements[0].index].category;
          openCategoryDrilldown(category);
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue("--muted")
                .trim()
            }
          }
        }
      }
    }
  );
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement)
            .getPropertyValue("--muted")
            .trim()
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement)
            .getPropertyValue("--muted")
            .trim()
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement)
            .getPropertyValue("--muted")
            .trim(),
          callback: (value) =>
            formatCurrency(value, state.settings.baseCurrency, true)
        },
        grid: {
          color: "rgba(127,127,150,.12)"
        }
      }
    }
  };
}

function forecastData() {
  const currentBalance = totalAssets() - totalLiabilities();
  const currentTotals = periodTotals();

  const averageDailyNet =
    (currentTotals.income - currentTotals.expense) /
    Math.max(new Date().getDate(), 1);

  const points = [];

  for (let day = 0; day <= 90; day += 15) {
    let projected = currentBalance + averageDailyNet * day;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + day);

    financialItems(state.recurring).forEach((item) => {
      if (!item.active) {
        return;
      }

      const next = new Date(`${item.nextDate}T00:00:00`);

      if (next <= targetDate) {
        const converted =
          convertCurrency(
            item.amount,
            item.currency,
            state.settings.baseCurrency
          ) ?? 0;

        projected += item.type === "income" ? converted : -converted;
      }
    });

    points.push({
      day,
      projected
    });
  }

  return points;
}

function renderForecast() {
  const points = forecastData();
  const minimum = points.reduce(
    (current, point) =>
      point.projected < current.projected ? point : current,
    points[0]
  );

  document.getElementById("forecastPanel").innerHTML = `
    <div class="simple-list">
      ${points
        .map(
          (point) => `
            <div class="simple-item">
              <span>Hari ke-${point.day}</span>

              <strong
                class="money ${point.projected < 0 ? "negative" : "positive"}"
              >
                ${formatCurrency(point.projected)}
              </strong>
            </div>
          `
        )
        .join("")}
    </div>

    <p class="muted" style="margin-top:14px">
      Titik terendah diperkirakan pada hari ke-${minimum.day},
      sebesar ${formatCurrency(minimum.projected)}.
    </p>
  `;
}

function generateInsights() {
  const current = periodTotals(0);
  const previous = periodTotals(-1);
  const categories = categoryTotals();
  const insights = [];

  if (previous.expense > 0) {
    const change =
      ((current.expense - previous.expense) / previous.expense) *
      100;

    insights.push({
      icon: change > 0 ? "📈" : "📉",
      title: "Perubahan pengeluaran",
      text:
        change > 0
          ? `Pengeluaran naik ${Math.abs(change).toFixed(1)}% dibanding bulan lalu.`
          : `Pengeluaran turun ${Math.abs(change).toFixed(1)}% dibanding bulan lalu.`
    });
  }

  if (categories[0]) {
    insights.push({
      icon: CATEGORIES[categories[0].category]?.icon || "✨",
      title: "Kategori terbesar",
      text: `${categories[0].category} menghabiskan ${formatCurrency(
        categories[0].amount
      )} bulan ini.`
    });
  }

  const subscriptionTotal = financialItems(state.recurring)
    .filter((item) => item.active && item.type === "expense")
    .reduce(
      (sum, item) =>
        sum +
        (convertCurrency(
          item.amount,
          item.currency,
          state.settings.baseCurrency
        ) ?? 0),
      0
    );

  insights.push({
    icon: "🔁",
    title: "Biaya rutin",
    text: `Total pembayaran rutin aktif sekitar ${formatCurrency(
      subscriptionTotal
    )} per siklus.`
  });

  const savingRate =
    current.income > 0
      ? ((current.income - current.expense) / current.income) * 100
      : 0;

  insights.push({
    icon: savingRate >= 20 ? "🌱" : "⚠️",
    title: "Saving rate",
    text: `Saving rate bulan ini ${savingRate.toFixed(1)}%.`
  });

  return insights;
}

function renderInsights() {
  const insights = generateInsights();

  document.getElementById("insightList").innerHTML = insights
    .map(
      (insight) => `
        <div class="insight-item">
          <strong>
            ${insight.icon} ${escapeHTML(insight.title)}
          </strong>

          ${escapeHTML(insight.text)}
        </div>
      `
    )
    .join("");

  document.getElementById("sidebarInsight").textContent =
    insights[0]?.text ||
    "Catat transaksi secara konsisten agar prediksi semakin akurat.";
}

function renderFxReport() {
  const foreignAccounts = financialItems(state.accounts).filter(
    (account) =>
      !account.liability &&
      account.currency !== state.settings.baseCurrency
  );

  document.getElementById("fxReport").innerHTML =
    foreignAccounts.length
      ? foreignAccounts.map((account) => {
          const balance = accountBalance(account);
          const currentValue = accountValueInBase(account);
          const costValue =
            balance * Number(account.openingRate || 0);

          const gain = currentValue - costValue;

          return `
            <div class="simple-item">
              <span>
                <strong>${escapeHTML(account.name)}</strong>
                ${formatCurrency(balance, account.currency)}
              </span>

              <strong
                class="money ${gain >= 0 ? "positive" : "negative"}"
              >
                ${gain >= 0 ? "+" : ""}
                ${formatCurrency(gain)}
              </strong>
            </div>
          `;
        }).join("")
      : emptyState("💱", "Belum ada akun mata uang asing.");
}

function renderTaxReport() {
  const transactions = periodTransactions();

  const taxableIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income" &&
        transaction.status !== "cancelled"
    )
    .reduce(
      (sum, transaction) =>
        sum + transactionBaseValue(transaction),
      0
    );

  const deductions = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.deductible &&
        transaction.status !== "cancelled"
    )
    .reduce(
      (sum, transaction) =>
        sum + transactionBaseValue(transaction),
      0
    );

  document.getElementById("taxReport").innerHTML = `
    <div class="simple-list">
      <div class="simple-item">
        <span>Pemasukan tercatat</span>
        <strong class="money">${formatCurrency(taxableIncome)}</strong>
      </div>

      <div class="simple-item">
        <span>Pengeluaran deductible</span>
        <strong class="money">${formatCurrency(deductions)}</strong>
      </div>

      <div class="simple-item">
        <span>Dasar estimasi</span>
        <strong class="money">
          ${formatCurrency(Math.max(taxableIncome - deductions, 0))}
        </strong>
      </div>
    </div>
  `;
}

function renderReconciliations() {
  document.getElementById("reconciliationList").innerHTML =
    financialItems(state.reconciliations).length
      ? financialItems(state.reconciliations)
          .slice(0, 8)
          .map(
            (item) => `
              <div class="simple-item">
                <span>
                  <strong>${escapeHTML(item.accountName)}</strong>
                  ${formatDate(item.date)}
                </span>

                <strong
                  class="money ${item.difference === 0 ? "positive" : "negative"}"
                >
                  ${formatCurrency(item.difference, item.currency)}
                </strong>
              </div>
            `
          )
          .join("")
      : emptyState("✓", "Belum ada rekonsiliasi.");
}

function renderRules() {
  document.getElementById("ruleList").innerHTML =
    financialItems(state.rules).length
      ? financialItems(state.rules)
          .map(
            (rule) => `
              <div class="simple-item">
                <span>
                  <strong>${escapeHTML(rule.keyword)}</strong>
                  → ${escapeHTML(rule.category)}
                </span>

                <button
                  class="mini-button"
                  data-delete-rule="${rule.id}"
                  type="button"
                >
                  🗑️
                </button>
              </div>
            `
          )
          .join("")
      : emptyState("🤖", "Belum ada aturan otomatis.");
}

function renderAudit() {
  document.getElementById("auditList").innerHTML =
    state.auditLog.length
      ? state.auditLog
          .slice(0, 30)
          .map(
            (item) => `
              <div class="audit-item">
                <strong>${escapeHTML(item.action)}</strong>
                ${escapeHTML(item.detail)}
                <time>${formatDateTime(item.timestamp)}</time>
              </div>
            `
          )
          .join("")
      : emptyState("📜", "Audit log masih kosong.");
}

function renderSettings() {
  document.getElementById("settingsUserName").value =
    state.settings.userName;

  document.getElementById("baseCurrencySelect").innerHTML =
    currencyOptions(state.settings.baseCurrency);

  document.getElementById("themeSelect").value =
    state.settings.darkMode ? "dark" : "light";

  document.getElementById("autoLockSelect").value = String(
    state.settings.autoLockMinutes
  );

  document.getElementById("manualRateCurrency").innerHTML =
    currencyOptions("IDR");

  renderCloudStatus();

  document.getElementById("bankFeedEndpoint").value =
    state.settings.bankFeedEndpoint || "";

  document.getElementById("bankFeedToken").value =
    state.settings.bankFeedToken || "";

  document.getElementById("webhookUrl").value =
    state.settings.webhookUrl || "";

  document.getElementById("rateStatus").textContent =
    state.lastRateUpdate
      ? `Terakhir diperbarui ${formatDateTime(state.lastRateUpdate)}.`
      : "Belum pernah disinkronkan secara online.";

  document.getElementById("favoriteCurrencyList").innerHTML =
    state.settings.favoriteCurrencies
      .map(
        (currency) => `
          <button
            class="currency-chip active"
            data-toggle-favorite-currency="${currency}"
            type="button"
          >
            ${currency}
          </button>
        `
      )
      .join("");

  document.getElementById("dashboardSettingList").innerHTML =
    state.settings.dashboardWidgets
      .map(
        (widget, index) => `
          <div class="dashboard-setting-row" data-dashboard-widget="${widget.id}">
            <input
              type="checkbox"
              data-widget-enabled="${widget.id}"
              ${widget.enabled ? "checked" : ""}
              role="switch"
              aria-label="Tampilkan ${escapeHTML(widget.label)}"
            />

            <span>${escapeHTML(widget.label)}</span>

            <div class="dashboard-order-actions" aria-label="Ubah urutan ${escapeHTML(widget.label)}">
              <button
                class="mini-button"
                data-widget-up="${index}"
                type="button"
                aria-label="Naikkan ${escapeHTML(widget.label)}"
                title="Naikkan"
                ${index === 0 ? "disabled" : ""}
              >↑</button>

              <button
                class="mini-button"
                data-widget-down="${index}"
                type="button"
                aria-label="Turunkan ${escapeHTML(widget.label)}"
                title="Turunkan"
                ${index === state.settings.dashboardWidgets.length - 1 ? "disabled" : ""}
              >↓</button>
            </div>
          </div>
        `
      )
      .join("");

  document.getElementById("profileList").innerHTML =
    state.profiles
      .map(
        (profile) => `
          <div class="simple-item">
            <span>
              <strong>${escapeHTML(profile.name)}</strong>
              ${escapeHTML(profile.type)}
              · ${profile.members.length} anggota
            </span>

            <button
              class="mini-button"
              data-edit-profile="${profile.id}"
              type="button"
            >
              ✏️
            </button>
          </div>
        `
      )
      .join("");

  document.getElementById("quickUnlockButton").hidden =
    !vault?.passkeyCredentialId ||
    !sessionStorage.getItem(SESSION_KEY);

  renderCloudStatus();
}

function renderWarnings() {
  const banner = document.getElementById("warningBanner");

  if (cloudConflict) {
    banner.hidden = false;
    banner.textContent =
      "Cloud terbaru sedang diterapkan otomatis. Jika PIN berubah di perangkat lain, kunci aplikasi lalu masuk memakai PIN terbaru.";
    return;
  }

  const missingRates = Array.from(
    new Set([
      state.settings.baseCurrency,
      ...financialItems(state.accounts).map((account) => account.currency),
      ...financialItems(state.budgets).map((budget) => budget.currency),
      ...financialItems(state.goals).map((goal) => goal.currency)
    ])
  ).filter((currency) => !rateFor(currency));

  if (!missingRates.length) {
    banner.hidden = true;
    return;
  }

  banner.hidden = false;
  banner.textContent =
    `Kurs belum tersedia untuk ${missingRates.join(", ")}. ` +
    `Buka Setting → Mata Uang & Kurs.`;
}

function renderAll() {
  applyTheme();
  renderHeader();
  renderDashboard();
  renderTransactions();
  renderAccounts();
  renderBudgets();
  renderGoals();
  renderCalendar();
  renderReports();
  renderReconciliations();
  renderRules();
  renderAudit();
  renderSettings();
  renderWarnings();

  if (currentSection === "reports") {
    requestAnimationFrame(renderReportCharts);
  }
}

function emptyState(icon, text) {
  return `
    <div class="empty-state">
      <span>${icon}</span>
      ${escapeHTML(text)}
    </div>
  `;
}

function applyAutomationRules(transaction) {
  const searchable = [
    transaction.description,
    transaction.merchant
  ]
    .join(" ")
    .toLowerCase();

  const rule = financialItems(state.rules).find((item) =>
    searchable.includes(item.keyword.toLowerCase())
  );

  if (!rule) {
    return transaction;
  }

  return {
    ...transaction,
    category: rule.category,
    type: rule.type || transaction.type,
    tags: Array.from(
      new Set([
        ...(transaction.tags || []),
        ...(rule.tags || [])
      ])
    )
  };
}

function openTransactionForm(existing = null, prefill = {}) {
  const transaction = existing || {
    id: "",
    type: prefill.type || "expense",
    description: prefill.description || "",
    merchant: prefill.merchant || "",
    date: prefill.date || localISO(),
    accountId: financialItems(state.accounts)[0]?.id || "",
    destinationAccountId: "",
    amount: prefill.amount || "",
    destinationAmount: "",
    fee: 0,
    category: prefill.category || "Makanan",
    tags: [],
    notes: prefill.notes || "",
    status: "completed",
    deductible: false,
    reconciled: false,
    profileId: activeFinancialUserId() || state.profiles[0]?.id || "",
    splits: []
  };

  showModal(
    existing ? "Edit Transaksi" : "Tambah Transaksi",
    "Pemasukan, pengeluaran, transfer, split, tag, dan lampiran.",
    `
      <form id="transactionForm">
        <div class="form-grid">
          <label class="field">
            <span>Jenis</span>
            <select class="input" id="txType">
              <option value="expense" ${transaction.type === "expense" ? "selected" : ""}>
                Pengeluaran
              </option>
              <option value="income" ${transaction.type === "income" ? "selected" : ""}>
                Pemasukan
              </option>
              <option value="transfer" ${transaction.type === "transfer" ? "selected" : ""}>
                Transfer
              </option>
            </select>
          </label>

          <label class="field">
            <span>Tanggal</span>
            <input class="input" id="txDate" type="date" value="${transaction.date}" required />
          </label>

          <label class="field full">
            <span>Nama transaksi</span>
            <input
              class="input"
              id="txDescription"
              value="${escapeHTML(transaction.description)}"
              required
            />
          </label>

          <label class="field">
            <span>Merchant</span>
            <input
              class="input"
              id="txMerchant"
              value="${escapeHTML(transaction.merchant)}"
            />
          </label>

          <label class="field">
            <span>Akun</span>
            <select class="input" id="txAccount" required>
              ${accountOptions(transaction.accountId)}
            </select>
          </label>

          <label class="field" id="destinationAccountField">
            <span>Akun tujuan</span>
            <select class="input" id="txDestinationAccount">
              <option value="">Pilih akun tujuan</option>
              ${accountOptions(transaction.destinationAccountId)}
            </select>
          </label>

          <label class="field">
            <span>Nominal sumber</span>
            <input
              class="input"
              id="txAmount"
              type="number"
              min="0.00000001"
              step="any"
              value="${transaction.amount}"
              required
            />
          </label>

          <label class="field" id="destinationAmountField">
            <span>Nominal diterima</span>
            <input
              class="input"
              id="txDestinationAmount"
              type="number"
              min="0"
              step="any"
              value="${transaction.destinationAmount || ""}"
            />
          </label>

          <label class="field" id="feeField">
            <span>Biaya transfer</span>
            <input
              class="input"
              id="txFee"
              type="number"
              min="0"
              step="any"
              value="${transaction.fee || 0}"
            />
          </label>

          <label class="field" id="categoryField">
            <span>Kategori</span>
            <select class="input" id="txCategory">
              ${categoryOptions(
                transaction.type === "income" ? "income" : "expense",
                transaction.category
              )}
            </select>
          </label>

          <label class="field">
            <span>Status</span>
            <select class="input" id="txStatus">
              <option value="completed" ${transaction.status === "completed" ? "selected" : ""}>Selesai</option>
              <option value="pending" ${transaction.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="cancelled" ${transaction.status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
            </select>
          </label>

          <label class="field">
            <span>Profil</span>
            <select class="input" id="txProfile">
              ${profileOptions(transaction.profileId)}
            </select>
          </label>

          <label class="field">
            <span>Tags</span>
            <input
              class="input"
              id="txTags"
              value="${escapeHTML((transaction.tags || []).join(", "))}"
              placeholder="kantor, keluarga"
            />
          </label>

          <label class="field full">
            <span>Catatan</span>
            <textarea id="txNotes">${escapeHTML(transaction.notes || "")}</textarea>
          </label>

          <label class="field">
            <span>
              <input
                id="txDeductible"
                type="checkbox"
                ${transaction.deductible ? "checked" : ""}
              />
              Pengeluaran deductible
            </span>
          </label>

          <label class="field">
            <span>
              <input
                id="txReconciled"
                type="checkbox"
                ${transaction.reconciled ? "checked" : ""}
              />
              Sudah direkonsiliasi
            </span>
          </label>

          <div class="field full" id="splitSection">
            <span>Split transaction</span>

            <div class="split-list" id="splitList">
              ${(transaction.splits || [])
                .map((split) => splitRow(split))
                .join("")}
            </div>

            <button
              class="button secondary"
              id="addSplitButton"
              type="button"
            >
              ＋ Tambah Split
            </button>
          </div>

          <label class="field full">
            <span>Lampiran struk</span>
            <input class="input" id="txAttachment" type="file" accept="image/*,.pdf" />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  const typeSelect = document.getElementById("txType");

  function updateTransactionFields() {
    const isTransfer = typeSelect.value === "transfer";
    const isIncome = typeSelect.value === "income";

    document.getElementById("destinationAccountField").hidden = !isTransfer;
    document.getElementById("destinationAmountField").hidden = !isTransfer;
    document.getElementById("feeField").hidden = !isTransfer;
    document.getElementById("categoryField").hidden = isTransfer;
    document.getElementById("splitSection").hidden = isTransfer;

    if (!isTransfer) {
      document.getElementById("txCategory").innerHTML =
        categoryOptions(
          isIncome ? "income" : "expense",
          document.getElementById("txCategory").value
        );
    }
  }

  typeSelect.addEventListener("change", updateTransactionFields);
  updateTransactionFields();

  document
    .getElementById("addSplitButton")
    .addEventListener("click", () => {
      document
        .getElementById("splitList")
        .insertAdjacentHTML(
          "beforeend",
          splitRow({
            category: "Makanan",
            amount: ""
          })
        );
    });

  document
    .getElementById("transactionForm")
    .addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-split]");

      if (removeButton) {
        removeButton.closest(".split-row").remove();
      }
    });

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("transactionForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const account = state.accounts.find(
        (item) => item.id === document.getElementById("txAccount").value
      );

      if (!account) {
        showToast("Akun tidak ditemukan.", "❗");
        return;
      }

      const type = document.getElementById("txType").value;
      const amount = Number(document.getElementById("txAmount").value);

      const destinationAccountId =
        document.getElementById("txDestinationAccount").value;

      if (
        type === "transfer" &&
        (!destinationAccountId ||
          destinationAccountId === account.id)
      ) {
        showToast("Pilih akun tujuan yang berbeda.", "❗");
        return;
      }

      const historicalRate =
        convertCurrency(
          1,
          account.currency,
          state.settings.baseCurrency
        ) ?? 0;

      const splits = Array.from(
        document.querySelectorAll(".split-row")
      )
        .map((row) => ({
          category: row.querySelector(".split-category").value,
          amount: Number(row.querySelector(".split-amount").value)
        }))
        .filter((split) => split.amount > 0);

      if (splits.length) {
        const splitTotal = splits.reduce(
          (sum, split) => sum + split.amount,
          0
        );

        if (Math.abs(splitTotal - amount) > 0.01) {
          showToast(
            "Jumlah split harus sama dengan nominal transaksi.",
            "❗"
          );
          return;
        }
      }

      const transaction = applyAutomationRules({
        id: existing?.id || createId("tx"),
        type,
        description: document
          .getElementById("txDescription")
          .value.trim(),
        merchant: document.getElementById("txMerchant").value.trim(),
        date: document.getElementById("txDate").value,
        accountId: account.id,
        destinationAccountId:
          type === "transfer" ? destinationAccountId : null,
        amount,
        destinationAmount:
          type === "transfer"
            ? Number(
                document.getElementById("txDestinationAmount").value ||
                  amount
              )
            : null,
        fee:
          type === "transfer"
            ? Number(document.getElementById("txFee").value || 0)
            : 0,
        currency: account.currency,
        category:
          type === "transfer"
            ? "Lainnya"
            : document.getElementById("txCategory").value,
        splits,
        tags: document
          .getElementById("txTags")
          .value.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes: document.getElementById("txNotes").value.trim(),
        status: document.getElementById("txStatus").value,
        deductible: document.getElementById("txDeductible").checked,
        reconciled: document.getElementById("txReconciled").checked,
        profileId: document.getElementById("txProfile").value,
        baseCurrency: state.settings.baseCurrency,
        historicalRate,
        baseAmount: amount * historicalRate,
        attachmentIds: existing?.attachmentIds || [],
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const attachment =
        document.getElementById("txAttachment").files[0] ||
        pendingAttachmentFile;

      if (attachment) {
        const attachmentId = await saveEncryptedAttachment(attachment);
        transaction.attachmentIds.push(attachmentId);
        pendingAttachmentFile = null;
      }

      await commit(
        existing ? "Transaksi diperbarui" : "Transaksi ditambahkan",
        transaction.description,
        () => {
          if (existing) {
            const index = state.transactions.findIndex(
              (item) => item.id === existing.id
            );

            state.transactions[index] = transaction;
          } else {
            state.transactions.push(transaction);
          }
        }
      );

      closeModal();
      showToast("Transaksi berhasil disimpan.");
    });
}

function splitRow(split) {
  return `
    <div class="split-row">
      <select class="input split-category">
        ${categoryOptions("expense", split.category)}
      </select>

      <input
        class="input split-amount"
        type="number"
        min="0"
        step="any"
        value="${split.amount}"
        placeholder="Nominal"
      />

      <button
        class="mini-button"
        data-remove-split
        type="button"
      >
        ✕
      </button>
    </div>
  `;
}

function openAccountForm(existing = null) {
  const account = existing || {
    name: "",
    type: "bank",
    currency: state.settings.baseCurrency,
    openingBalance: 0,
    openingRate: 1,
    color: "#7558ff",
    icon: "🏦",
    profileId: activeFinancialUserId() || state.profiles[0]?.id || "",
    sharedWith: [],
    creditLimit: 0,
    statementDay: "",
    dueDay: ""
  };

  showModal(
    existing ? "Edit Akun" : "Tambah Akun",
    "Bank, e-wallet, kartu kredit, pinjaman, aset, utang, atau piutang.",
    `
      <form id="accountForm">
        <div class="form-grid">
          <label class="field full">
            <span>Nama akun</span>
            <input
              class="input"
              id="accountName"
              value="${escapeHTML(account.name)}"
              required
            />
          </label>

          <label class="field">
            <span>Jenis akun</span>
            <select class="input" id="accountType">
              ${Object.entries(ACCOUNT_TYPES)
                .map(
                  ([key, value]) => `
                    <option
                      value="${key}"
                      ${key === account.type ? "selected" : ""}
                    >
                      ${value.icon} ${value.label}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>

          <label class="field">
            <span>Mata uang</span>
            <select class="input" id="accountCurrency">
              ${currencyOptions(account.currency)}
            </select>
          </label>

          <label class="field">
            <span>Saldo awal / kewajiban awal</span>
            <input
              class="input"
              id="accountOpeningBalance"
              type="number"
              step="any"
              value="${account.openingBalance}"
              required
            />
          </label>

          <label class="field">
            <span>Kurs awal ke mata uang utama</span>
            <input
              class="input"
              id="accountOpeningRate"
              type="number"
              min="0"
              step="any"
              value="${account.openingRate || 1}"
            />
          </label>

          <label class="field">
            <span>Limit kredit</span>
            <input
              class="input"
              id="accountCreditLimit"
              type="number"
              min="0"
              step="any"
              value="${account.creditLimit || 0}"
            />
          </label>

          <label class="field">
            <span>Tanggal cetak</span>
            <input
              class="input"
              id="accountStatementDay"
              type="number"
              min="1"
              max="31"
              value="${account.statementDay || ""}"
            />
          </label>

          <label class="field">
            <span>Tanggal jatuh tempo</span>
            <input
              class="input"
              id="accountDueDay"
              type="number"
              min="1"
              max="31"
              value="${account.dueDay || ""}"
            />
          </label>

          <label class="field">
            <span>Profil</span>
            <select class="input" id="accountProfile">
              ${profileOptions(account.profileId)}
            </select>
          </label>

          <label class="field">
            <span>Anggota bersama</span>
            <input
              class="input"
              id="accountSharedWith"
              value="${escapeHTML((account.sharedWith || []).join(", "))}"
              placeholder="Ani, Budi"
            />
          </label>

          <label class="field">
            <span>Warna</span>
            <input
              class="input"
              id="accountColor"
              type="color"
              value="${account.color}"
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("accountForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const type = document.getElementById("accountType").value;
      const typeMeta = ACCOUNT_TYPES[type];

      const nextAccount = {
        id: existing?.id || createId("account"),
        name: document.getElementById("accountName").value.trim(),
        type,
        liability: typeMeta.liability,
        currency: document.getElementById("accountCurrency").value,
        openingBalance: Number(
          document.getElementById("accountOpeningBalance").value
        ),
        openingRate: Number(
          document.getElementById("accountOpeningRate").value || 1
        ),
        icon: typeMeta.icon,
        color: document.getElementById("accountColor").value,
        profileId: document.getElementById("accountProfile").value,
        sharedWith: document
          .getElementById("accountSharedWith")
          .value.split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        creditLimit: Number(
          document.getElementById("accountCreditLimit").value || 0
        ),
        statementDay:
          Number(
            document.getElementById("accountStatementDay").value
          ) || null,
        dueDay:
          Number(document.getElementById("accountDueDay").value) ||
          null
      };

      await commit(
        existing ? "Akun diperbarui" : "Akun ditambahkan",
        nextAccount.name,
        () => {
          if (existing) {
            const index = state.accounts.findIndex(
              (item) => item.id === existing.id
            );

            state.accounts[index] = nextAccount;
          } else {
            state.accounts.push(nextAccount);
          }
        }
      );

      closeModal();
      showToast("Akun berhasil disimpan.", "👛");
    });
}

function openBudgetForm(existing = null) {
  const budget = existing || {
    name: "",
    category: "Makanan",
    limit: "",
    currency: state.settings.baseCurrency,
    period: "monthly",
    rollover: false,
    rolloverAmount: 0,
    accountId: "",
    tag: "",
    profileId: activeFinancialUserId() || state.profiles[0]?.id || "",
    color: "#7558ff"
  };

  showModal(
    existing ? "Edit Budget" : "Buat Budget",
    "Budget mingguan, bulanan, tahunan, rollover, akun, dan tag.",
    `
      <form id="budgetForm">
        <div class="form-grid">
          <label class="field full">
            <span>Nama budget</span>
            <input
              class="input"
              id="budgetName"
              value="${escapeHTML(budget.name)}"
              required
            />
          </label>

          <label class="field">
            <span>Kategori</span>
            <select class="input" id="budgetCategory">
              ${categoryOptions("expense", budget.category)}
            </select>
          </label>

          <label class="field">
            <span>Periode</span>
            <select class="input" id="budgetPeriod">
              <option value="weekly" ${budget.period === "weekly" ? "selected" : ""}>Mingguan</option>
              <option value="monthly" ${budget.period === "monthly" ? "selected" : ""}>Bulanan</option>
              <option value="yearly" ${budget.period === "yearly" ? "selected" : ""}>Tahunan</option>
            </select>
          </label>

          <label class="field">
            <span>Batas</span>
            <input
              class="input"
              id="budgetLimit"
              type="number"
              min="0.00000001"
              step="any"
              value="${budget.limit}"
              required
            />
          </label>

          <label class="field">
            <span>Mata uang</span>
            <select class="input" id="budgetCurrency">
              ${currencyOptions(budget.currency)}
            </select>
          </label>

          <label class="field">
            <span>Akun tertentu</span>
            <select class="input" id="budgetAccount">
              <option value="">Semua akun</option>
              ${accountOptions(budget.accountId)}
            </select>
          </label>

          <label class="field">
            <span>Tag tertentu</span>
            <input
              class="input"
              id="budgetTag"
              value="${escapeHTML(budget.tag || "")}"
            />
          </label>

          <label class="field">
            <span>Profil</span>
            <select class="input" id="budgetProfile">
              ${profileOptions(budget.profileId)}
            </select>
          </label>

          <label class="field">
            <span>Warna</span>
            <input
              class="input"
              id="budgetColor"
              type="color"
              value="${budget.color}"
            />
          </label>

          <label class="field full">
            <span>
              <input
                id="budgetRollover"
                type="checkbox"
                ${budget.rollover ? "checked" : ""}
              />
              Rollover sisa budget
            </span>
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("budgetForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const nextBudget = {
        id: existing?.id || createId("budget"),
        name: document.getElementById("budgetName").value.trim(),
        category: document.getElementById("budgetCategory").value,
        limit: Number(document.getElementById("budgetLimit").value),
        currency: document.getElementById("budgetCurrency").value,
        period: document.getElementById("budgetPeriod").value,
        rollover: document.getElementById("budgetRollover").checked,
        rolloverAmount: existing?.rolloverAmount || 0,
        accountId: document.getElementById("budgetAccount").value,
        tag: document.getElementById("budgetTag").value.trim(),
        profileId: document.getElementById("budgetProfile").value,
        alertLevels: [50, 75, 90, 100],
        color: document.getElementById("budgetColor").value
      };

      await commit(
        existing ? "Budget diperbarui" : "Budget ditambahkan",
        nextBudget.name,
        () => {
          if (existing) {
            const index = state.budgets.findIndex(
              (item) => item.id === existing.id
            );

            state.budgets[index] = nextBudget;
          } else {
            state.budgets.push(nextBudget);
          }
        }
      );

      closeModal();
      showToast("Budget berhasil disimpan.", "🎯");
    });
}

function openGoalForm(existing = null) {
  const goal = existing || {
    name: "",
    icon: "🌱",
    targetAmount: "",
    currency: state.settings.baseCurrency,
    targetDate: dayOffset(365),
    profileId: activeFinancialUserId() || state.profiles[0]?.id || "",
    color: "#13b888",
    contributions: []
  };

  showModal(
    existing ? "Edit Goal" : "Tambah Goal",
    "Target nominal, tanggal, setoran, dan rekomendasi bulanan.",
    `
      <form id="goalForm">
        <div class="form-grid">
          <label class="field full">
            <span>Nama goal</span>
            <input
              class="input"
              id="goalName"
              value="${escapeHTML(goal.name)}"
              required
            />
          </label>

          <label class="field">
            <span>Ikon</span>
            <select class="input" id="goalIcon">
              ${["🌱", "🛟", "✈️", "🏠", "🎓", "💍", "🚗", "💻"]
                .map(
                  (icon) => `
                    <option value="${icon}" ${icon === goal.icon ? "selected" : ""}>
                      ${icon}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>

          <label class="field">
            <span>Target tanggal</span>
            <input
              class="input"
              id="goalDate"
              type="date"
              value="${goal.targetDate}"
              required
            />
          </label>

          <label class="field">
            <span>Target nominal</span>
            <input
              class="input"
              id="goalAmount"
              type="number"
              min="0.00000001"
              step="any"
              value="${goal.targetAmount}"
              required
            />
          </label>

          <label class="field">
            <span>Mata uang</span>
            <select class="input" id="goalCurrency">
              ${currencyOptions(goal.currency)}
            </select>
          </label>

          <label class="field">
            <span>Profil</span>
            <select class="input" id="goalProfile">
              ${profileOptions(goal.profileId)}
            </select>
          </label>

          <label class="field">
            <span>Warna</span>
            <input
              class="input"
              id="goalColor"
              type="color"
              value="${goal.color}"
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("goalForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const nextGoal = {
        id: existing?.id || createId("goal"),
        name: document.getElementById("goalName").value.trim(),
        icon: document.getElementById("goalIcon").value,
        targetAmount: Number(
          document.getElementById("goalAmount").value
        ),
        currency: document.getElementById("goalCurrency").value,
        targetDate: document.getElementById("goalDate").value,
        profileId: document.getElementById("goalProfile").value,
        color: document.getElementById("goalColor").value,
        contributions: existing?.contributions || []
      };

      await commit(
        existing ? "Goal diperbarui" : "Goal ditambahkan",
        nextGoal.name,
        () => {
          if (existing) {
            const index = state.goals.findIndex(
              (item) => item.id === existing.id
            );

            state.goals[index] = nextGoal;
          } else {
            state.goals.push(nextGoal);
          }
        }
      );

      closeModal();
      showToast("Goal berhasil disimpan.", "🌱");
    });
}

function openContributionForm(goal) {
  showModal(
    "Tambah Setoran",
    goal.name,
    `
      <form id="contributionForm">
        <div class="form-stack">
          <label class="field">
            <span>Nominal</span>
            <input
              class="input"
              id="contributionAmount"
              type="number"
              min="0.00000001"
              step="any"
              required
            />
          </label>

          <label class="field">
            <span>Tanggal</span>
            <input
              class="input"
              id="contributionDate"
              type="date"
              value="${localISO()}"
              required
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Tambahkan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("contributionForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const contribution = {
        id: createId("contribution"),
        amount: Number(
          document.getElementById("contributionAmount").value
        ),
        date: document.getElementById("contributionDate").value
      };

      await commit(
        "Setoran goal ditambahkan",
        goal.name,
        () => {
          goal.contributions.push(contribution);
        }
      );

      closeModal();
      showToast("Setoran berhasil ditambahkan.", "🌱");
    });
}

function openRecurringForm(existing = null) {
  const item = existing || {
    name: "",
    type: "expense",
    accountId: financialItems(state.accounts)[0]?.id || "",
    amount: "",
    currency: state.settings.baseCurrency,
    category: "Tagihan",
    frequency: "monthly",
    nextDate: dayOffset(7),
    endDate: "",
    icon: "🧾",
    color: "#ff5967",
    profileId: activeFinancialUserId() || state.profiles[0]?.id || "",
    active: true
  };

  showModal(
    existing ? "Edit Pembayaran Rutin" : "Pembayaran Rutin",
    "Tagihan, langganan, cicilan, atau pemasukan terjadwal.",
    `
      <form id="recurringForm">
        <div class="form-grid">
          <label class="field full">
            <span>Nama</span>
            <input
              class="input"
              id="recurringName"
              value="${escapeHTML(item.name)}"
              required
            />
          </label>

          <label class="field">
            <span>Jenis</span>
            <select class="input" id="recurringType">
              <option value="expense" ${item.type === "expense" ? "selected" : ""}>Pengeluaran</option>
              <option value="income" ${item.type === "income" ? "selected" : ""}>Pemasukan</option>
            </select>
          </label>

          <label class="field">
            <span>Akun</span>
            <select class="input" id="recurringAccount">
              ${accountOptions(item.accountId)}
            </select>
          </label>

          <label class="field">
            <span>Nominal</span>
            <input
              class="input"
              id="recurringAmount"
              type="number"
              min="0.00000001"
              step="any"
              value="${item.amount}"
              required
            />
          </label>

          <label class="field">
            <span>Kategori</span>
            <select class="input" id="recurringCategory">
              ${categoryOptions(item.type, item.category)}
            </select>
          </label>

          <label class="field">
            <span>Frekuensi</span>
            <select class="input" id="recurringFrequency">
              <option value="weekly" ${item.frequency === "weekly" ? "selected" : ""}>Mingguan</option>
              <option value="monthly" ${item.frequency === "monthly" ? "selected" : ""}>Bulanan</option>
              <option value="yearly" ${item.frequency === "yearly" ? "selected" : ""}>Tahunan</option>
            </select>
          </label>

          <label class="field">
            <span>Tanggal berikutnya</span>
            <input
              class="input"
              id="recurringNextDate"
              type="date"
              value="${item.nextDate}"
              required
            />
          </label>

          <label class="field">
            <span>Tanggal berakhir</span>
            <input
              class="input"
              id="recurringEndDate"
              type="date"
              value="${item.endDate || ""}"
            />
          </label>

          <label class="field">
            <span>Profil</span>
            <select class="input" id="recurringProfile">
              ${profileOptions(item.profileId)}
            </select>
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("recurringType")
    .addEventListener("change", (event) => {
      document.getElementById("recurringCategory").innerHTML =
        categoryOptions(event.target.value);
    });

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("recurringForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const account = state.accounts.find(
        (accountItem) =>
          accountItem.id ===
          document.getElementById("recurringAccount").value
      );

      const nextItem = {
        id: existing?.id || createId("recurring"),
        name: document.getElementById("recurringName").value.trim(),
        type: document.getElementById("recurringType").value,
        accountId: account.id,
        amount: Number(
          document.getElementById("recurringAmount").value
        ),
        currency: account.currency,
        category: document.getElementById("recurringCategory").value,
        frequency:
          document.getElementById("recurringFrequency").value,
        nextDate:
          document.getElementById("recurringNextDate").value,
        endDate:
          document.getElementById("recurringEndDate").value,
        icon: existing?.icon || "🧾",
        color:
          existing?.color ||
          CATEGORIES[
            document.getElementById("recurringCategory").value
          ]?.color ||
          "#7558ff",
        profileId:
          document.getElementById("recurringProfile").value,
        active: existing?.active ?? true
      };

      await commit(
        existing
          ? "Pembayaran rutin diperbarui"
          : "Pembayaran rutin ditambahkan",
        nextItem.name,
        () => {
          if (existing) {
            const index = state.recurring.findIndex(
              (row) => row.id === existing.id
            );

            state.recurring[index] = nextItem;
          } else {
            state.recurring.push(nextItem);
          }
        }
      );

      closeModal();
      renderCalendar();
      showToast("Pembayaran rutin berhasil disimpan.", "🔁");
    });
}

function openReconciliationForm(account = null) {
  const selectedAccount = account || state.accounts[0];

  showModal(
    "Rekonsiliasi Saldo",
    "Cocokkan saldo aplikasi dengan saldo rekening sebenarnya.",
    `
      <form id="reconciliationForm">
        <div class="form-stack">
          <label class="field">
            <span>Akun</span>
            <select class="input" id="reconcileAccount">
              ${accountOptions(selectedAccount?.id)}
            </select>
          </label>

          <label class="field">
            <span>Saldo aplikasi</span>
            <input
              class="input"
              id="reconcileAppBalance"
              readonly
            />
          </label>

          <label class="field">
            <span>Saldo sebenarnya</span>
            <input
              class="input"
              id="reconcileActualBalance"
              type="number"
              step="any"
              required
            />
          </label>

          <label class="field">
            <span>
              <input id="createAdjustment" type="checkbox" checked />
              Buat transaksi penyesuaian
            </span>
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Rekonsiliasi
          </button>
        </div>
      </form>
    `
  );

  const accountSelect = document.getElementById("reconcileAccount");

  function updateBalance() {
    const activeAccount = state.accounts.find(
      (item) => item.id === accountSelect.value
    );

    document.getElementById("reconcileAppBalance").value =
      formatCurrency(
        accountBalance(activeAccount),
        activeAccount.currency
      );
  }

  accountSelect.addEventListener("change", updateBalance);
  updateBalance();

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("reconciliationForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const activeAccount = state.accounts.find(
        (item) => item.id === accountSelect.value
      );

      const appBalance = accountBalance(activeAccount);
      const actualBalance = Number(
        document.getElementById("reconcileActualBalance").value
      );

      const difference = actualBalance - appBalance;

      await commit(
        "Saldo direkonsiliasi",
        activeAccount.name,
        () => {
          state.reconciliations.unshift({
            id: createId("reconciliation"),
            accountId: activeAccount.id,
            accountName: activeAccount.name,
            date: localISO(),
            appBalance,
            actualBalance,
            difference,
            currency: activeAccount.currency,
            profileId: activeAccount.profileId || activeFinancialUserId()
          });

          state.transactions.forEach((transaction) => {
            if (transaction.accountId === activeAccount.id) {
              transaction.reconciled = true;
            }
          });

          if (
            document.getElementById("createAdjustment").checked &&
            Math.abs(difference) > 0.000001
          ) {
            const historicalRate =
              convertCurrency(
                1,
                activeAccount.currency,
                state.settings.baseCurrency
              ) ?? 0;

            state.transactions.push({
              id: createId("tx"),
              type: difference >= 0 ? "income" : "expense",
              description: "Penyesuaian rekonsiliasi",
              merchant: "",
              date: localISO(),
              accountId: activeAccount.id,
              destinationAccountId: null,
              amount: Math.abs(difference),
              destinationAmount: null,
              fee: 0,
              currency: activeAccount.currency,
              category: "Lainnya",
              splits: [],
              tags: ["rekonsiliasi"],
              notes: "",
              status: "completed",
              deductible: false,
              reconciled: true,
              profileId: activeAccount.profileId,
              baseCurrency: state.settings.baseCurrency,
              historicalRate,
              baseAmount: Math.abs(difference) * historicalRate,
              attachmentIds: [],
              createdAt: new Date().toISOString()
            });
          }
        }
      );

      closeModal();
      showToast("Rekonsiliasi selesai.", "✓");
    });
}

function openRuleForm() {
  showModal(
    "Aturan Otomatis",
    "Atur kategori dan tag berdasarkan kata kunci.",
    `
      <form id="ruleForm">
        <div class="form-stack">
          <label class="field">
            <span>Kata kunci</span>
            <input class="input" id="ruleKeyword" required />
          </label>

          <label class="field">
            <span>Jenis</span>
            <select class="input" id="ruleType">
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </label>

          <label class="field">
            <span>Kategori</span>
            <select class="input" id="ruleCategory">
              ${categoryOptions("expense")}
            </select>
          </label>

          <label class="field">
            <span>Tags</span>
            <input
              class="input"
              id="ruleTags"
              placeholder="kantor, deductible"
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("ruleType")
    .addEventListener("change", (event) => {
      document.getElementById("ruleCategory").innerHTML =
        categoryOptions(event.target.value);
    });

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("ruleForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      await commit(
        "Aturan otomatis ditambahkan",
        document.getElementById("ruleKeyword").value,
        () => {
          state.rules.push({
            id: createId("rule"),
            keyword:
              document.getElementById("ruleKeyword").value.trim(),
            type: document.getElementById("ruleType").value,
            profileId: activeFinancialUserId(),
            category:
              document.getElementById("ruleCategory").value,
            tags: document
              .getElementById("ruleTags")
              .value.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          });
        }
      );

      closeModal();
      showToast("Aturan otomatis disimpan.", "🤖");
    });
}

function openProfileForm(existing = null) {
  const profile = existing || {
    name: "",
    type: "family",
    members: [],
    color: "#7558ff"
  };

  showModal(
    existing ? "Edit Profil" : "Tambah Profil",
    "Personal, bisnis, keluarga, atau proyek.",
    `
      <form id="profileForm">
        <div class="form-stack">
          <label class="field">
            <span>Nama profil</span>
            <input
              class="input"
              id="profileName"
              value="${escapeHTML(profile.name)}"
              required
            />
          </label>

          <label class="field">
            <span>Jenis</span>
            <select class="input" id="profileType">
              <option value="personal" ${profile.type === "personal" ? "selected" : ""}>Personal</option>
              <option value="business" ${profile.type === "business" ? "selected" : ""}>Bisnis</option>
              <option value="family" ${profile.type === "family" ? "selected" : ""}>Keluarga</option>
              <option value="project" ${profile.type === "project" ? "selected" : ""}>Proyek</option>
            </select>
          </label>

          <label class="field">
            <span>Anggota</span>
            <input
              class="input"
              id="profileMembers"
              value="${escapeHTML((profile.members || []).join(", "))}"
              placeholder="Ani, Budi"
            />
          </label>

          <label class="field">
            <span>Warna</span>
            <input
              class="input"
              id="profileColor"
              type="color"
              value="${profile.color}"
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("profileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const nextProfile = {
        id: existing?.id || createId("profile"),
        name: document.getElementById("profileName").value.trim(),
        type: document.getElementById("profileType").value,
        members: document
          .getElementById("profileMembers")
          .value.split(",")
          .map((member) => member.trim())
          .filter(Boolean),
        color: document.getElementById("profileColor").value
      };

      await commit(
        existing ? "Profil diperbarui" : "Profil ditambahkan",
        nextProfile.name,
        () => {
          if (existing) {
            const index = state.profiles.findIndex(
              (item) => item.id === existing.id
            );

            state.profiles[index] = nextProfile;
          } else {
            state.profiles.push(nextProfile);
          }
        }
      );

      closeModal();
      showToast("Profil berhasil disimpan.", "👥");
    });
}

function openCategoryDrilldown(category) {
  const transactions = financialItems(state.transactions).filter(
    (transaction) =>
      transaction.category === category ||
      transaction.splits?.some(
        (split) => split.category === category
      )
  );

  showModal(
    `Kategori ${category}`,
    `${transactions.length} transaksi ditemukan.`,
    `
      <div class="simple-list">
        ${transactions
          .map(
            (transaction) => `
              <div class="simple-item">
                <span>
                  <strong>${escapeHTML(transaction.description)}</strong>
                  ${formatDate(transaction.date)}
                </span>

                <strong class="money">
                  ${formatCurrency(
                    transaction.amount,
                    transaction.currency
                  )}
                </strong>
              </div>
            `
          )
          .join("")}
      </div>
    `
  );
}

async function saveEncryptedAttachment(file) {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const payload = await encryptBytes(buffer);

  const record = {
    id: createId("attachment"),
    name: file.name,
    type: file.type,
    size: file.size,
    payload,
    createdAt: new Date().toISOString()
  };

  const database = await openAttachmentDatabase();

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(
      "attachments",
      "readwrite"
    );

    transaction.objectStore("attachments").put(record);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  return record.id;
}

function openAttachmentDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ATTACHMENT_DB, 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("attachments")) {
        database.createObjectStore("attachments", {
          keyPath: "id"
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function parseCsv(file) {
  const text = await file.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV tidak berisi data.");
  }

  const delimiter =
    lines[0].split(";").length > lines[0].split(",").length
      ? ";"
      : ",";

  const headers = splitCsvLine(lines[0], delimiter).map((header) =>
    header.trim().toLowerCase()
  );

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line, delimiter);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || "";
    });

    return row;
  });
}

function splitCsvLine(line, delimiter) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function normalizeImportedRows(rows) {
  return rows.map((row) => ({
    date:
      row.date ||
      row.tanggal ||
      row.transaction_date ||
      localISO(),
    description:
      row.description ||
      row.keterangan ||
      row.name ||
      row.merchant ||
      "Transaksi import",
    merchant: row.merchant || row.toko || "",
    amount: Number(
      String(
        row.amount ||
          row.nominal ||
          row.value ||
          0
      )
        .replaceAll(".", "")
        .replace(",", ".")
    ),
    type:
      String(row.type || row.jenis || "expense").toLowerCase() ===
      "income"
        ? "income"
        : "expense",
    category: row.category || row.kategori || "Lainnya",
    tags: String(row.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  }));
}

function showImportPreview(rows) {
  showModal(
    "Preview Import",
    `${rows.length} baris ditemukan. Pilih akun tujuan.`,
    `
      <form id="importPreviewForm">
        <label class="field">
          <span>Akun tujuan</span>
          <select class="input" id="importAccount">
            ${accountOptions()}
          </select>
        </label>

        <div class="table-wrapper" style="margin-top:16px">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Jenis</th>
                <th>Nominal</th>
              </tr>
            </thead>

            <tbody>
              ${rows
                .slice(0, 12)
                .map(
                  (row) => `
                    <tr>
                      <td>${escapeHTML(row.date)}</td>
                      <td>${escapeHTML(row.description)}</td>
                      <td>${escapeHTML(row.type)}</td>
                      <td>${row.amount}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="form-actions">
          <button class="button secondary" id="cancelModalButton" type="button">
            Batal
          </button>

          <button class="button primary" type="submit">
            Import
          </button>
        </div>
      </form>
    `
  );

  document
    .getElementById("cancelModalButton")
    .addEventListener("click", closeModal);

  document
    .getElementById("importPreviewForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const account = state.accounts.find(
        (item) =>
          item.id === document.getElementById("importAccount").value
      );

      const existingKeys = new Set(
        state.transactions.map(
          (transaction) =>
            `${transaction.date}|${transaction.amount}|${transaction.description.toLowerCase()}|${transaction.accountId}`
        )
      );

      let importedCount = 0;

      await commit(
        "Transaksi diimpor",
        `${rows.length} baris diproses`,
        () => {
          rows.forEach((row) => {
            const key =
              `${row.date}|${row.amount}|` +
              `${row.description.toLowerCase()}|${account.id}`;

            if (existingKeys.has(key) || row.amount <= 0) {
              return;
            }

            const historicalRate =
              convertCurrency(
                1,
                account.currency,
                state.settings.baseCurrency
              ) ?? 0;

            const transaction = applyAutomationRules({
              id: createId("tx"),
              type: row.type,
              description: row.description,
              merchant: row.merchant,
              date: row.date,
              accountId: account.id,
              destinationAccountId: null,
              amount: row.amount,
              destinationAmount: null,
              fee: 0,
              currency: account.currency,
              category:
                CATEGORIES[row.category]?.type
                  ? row.category
                  : "Lainnya",
              splits: [],
              tags: row.tags,
              notes: "Diimpor dari file.",
              status: "completed",
              deductible: false,
              reconciled: false,
              profileId: account.profileId,
              baseCurrency: state.settings.baseCurrency,
              historicalRate,
              baseAmount: row.amount * historicalRate,
              attachmentIds: [],
              createdAt: new Date().toISOString()
            });

            state.transactions.push(transaction);
            existingKeys.add(key);
            importedCount += 1;
          });
        }
      );

      closeModal();
      showToast(
        `${importedCount} transaksi berhasil diimpor.`,
        "📥"
      );
    });
}

async function processExcel(file) {
  if (typeof XLSX === "undefined") {
    throw new Error("Library Excel belum tersedia.");
  }

  const workbook = XLSX.read(await file.arrayBuffer());
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: ""
  });

  showImportPreview(normalizeImportedRows(rows));
}

async function processReceipt(file) {
  pendingAttachmentFile = file;

  showToast("OCR sedang membaca struk...", "📷");

  if (typeof Tesseract === "undefined") {
    openTransactionForm(null, {
      description: "Transaksi dari struk"
    });

    return;
  }

  try {
    const result = await Tesseract.recognize(file, "eng+ind", {
      workerPath: "./vendor/worker.min.js",
      corePath: "./vendor/tesseract-core-lstm.wasm.js",
      langPath: "./ocr"
    });
    const text = result.data.text;

    const amounts = Array.from(
      text.matchAll(
        /(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{2})?)/gi
      )
    )
      .map((match) =>
        Number(
          match[1]
            .replace(/\.(?=\d{3}(?:\D|$))/g, "")
            .replace(",", ".")
        )
      )
      .filter(Number.isFinite);

    const amount = amounts.length ? Math.max(...amounts) : "";

    const dateMatch = text.match(
      /\b(\d{2})[\/.-](\d{2})[\/.-](\d{2,4})\b/
    );

    let date = localISO();

    if (dateMatch) {
      const year =
        dateMatch[3].length === 2
          ? `20${dateMatch[3]}`
          : dateMatch[3];

      date = `${year}-${dateMatch[2]}-${dateMatch[1]}`;
    }

    const firstLine =
      text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.length > 3) || "Transaksi dari struk";

    openTransactionForm(null, {
      description: firstLine.slice(0, 70),
      amount,
      date,
      notes: text.slice(0, 1000)
    });
  } catch (error) {
    console.error(error);

    openTransactionForm(null, {
      description: "Transaksi dari struk"
    });
  }
}

async function processQr(file) {
  if (!("BarcodeDetector" in window)) {
    showToast(
      "Browser tidak mendukung pemindaian QR. Gunakan browser Chromium terbaru.",
      "⚠️"
    );
    return;
  }

  try {
    const detector = new BarcodeDetector({
      formats: ["qr_code"]
    });

    const bitmap = await createImageBitmap(file);
    const results = await detector.detect(bitmap);

    if (!results.length) {
      showToast("QR tidak ditemukan.", "❗");
      return;
    }

    const rawValue = results[0].rawValue;
    const amountMatch = rawValue.match(/54\d{2}(\d+)/);

    openTransactionForm(null, {
      description: "Pembayaran QR",
      amount: amountMatch ? Number(amountMatch[1]) / 100 : "",
      notes: rawValue
    });
  } catch (error) {
    console.error(error);
    showToast("QR gagal dipindai.", "❗");
  }
}

async function exportEncryptedBackup() {
  await encryptState();

  const blob = new Blob(
    [
      JSON.stringify(
        {
          application: "CHARISNA Money Management",
          version: 3,
          exportedAt: new Date().toISOString(),
          vault
        },
        null,
        2
      )
    ],
    { type: "application/json" }
  );

  downloadBlob(
    blob,
    `charisna-money-management-encrypted-${localISO()}.json`
  );
}

async function restoreEncryptedBackup(file) {
  const parsed = JSON.parse(await file.text());

  if (!parsed.vault?.payload || !parsed.vault?.salt) {
    throw new Error("Backup tidak valid.");
  }

  const confirmed = window.confirm(
    "Backup akan mengganti seluruh data saat ini. Lanjutkan?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(parsed.vault)
  );

  location.reload();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function exportExcel() {
  if (typeof XLSX === "undefined") {
    showToast("Library Excel belum tersedia.", "❗");
    return;
  }

  const workbook = XLSX.utils.book_new();

  const activeProfile = window.CharisnaUsers?.active?.();
  const activeAccounts = financialItems(state.accounts);
  const activeTransactions = financialItems(state.transactions);
  const transactionRows = activeTransactions.map((transaction) => ({
    Date: transaction.date,
    Type: transaction.type,
    Description: transaction.description,
    Merchant: transaction.merchant,
    Account:
      activeAccounts.find(
        (account) => account.id === transaction.accountId
      )?.name || "",
    Category: transaction.category,
    Amount: transaction.amount,
    Currency: transaction.currency,
    Tags: (transaction.tags || []).join(", "),
    Status: transaction.status,
    Reconciled: transaction.reconciled,
    Deductible: transaction.deductible
  }));

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(transactionRows),
    "Transactions"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      activeAccounts.map((account) => ({
        Name: account.name,
        Type: account.type,
        Currency: account.currency,
        Balance: accountBalance(account),
        Liability: account.liability
      }))
    ),
    "Accounts"
  );

  XLSX.writeFile(
    workbook,
    `charisna-${(activeProfile?.name || "akun").toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "akun"}-report-${localISO()}.xlsx`
  );
}

function exportPdf() {
  if (!window.jspdf?.jsPDF) {
    showToast("Library PDF belum tersedia.", "❗");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const totals = periodTotals();

  pdf.setFontSize(20);
  const activeProfile = window.CharisnaUsers?.active?.();
  pdf.text("CHARISNA Money Management Financial Report", 15, 20);

  pdf.setFontSize(11);
  pdf.text(`Akun Keuangan: ${activeProfile?.name || "Aktif"}`, 15, 30);
  pdf.text(`Tanggal: ${formatDate(localISO())}`, 15, 38);
  pdf.text(`Net Worth: ${formatCurrency(netWorth())}`, 15, 50);
  pdf.text(`Pemasukan: ${formatCurrency(totals.income)}`, 15, 58);
  pdf.text(`Pengeluaran: ${formatCurrency(totals.expense)}`, 15, 66);

  let y = 80;

  pdf.setFontSize(14);
  pdf.text("Top Categories", 15, y);
  y += 9;

  pdf.setFontSize(10);

  categoryTotals()
    .slice(0, 10)
    .forEach((item) => {
      pdf.text(
        `${item.category}: ${formatCurrency(item.amount)}`,
        15,
        y
      );

      y += 7;
    });

  pdf.save(`charisna-${(activeProfile?.name || "akun").toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "akun"}-report-${localISO()}.pdf`);
}

async function syncRates() {
  const button = document.getElementById("syncRatesButton");
  button.disabled = true;
  button.textContent = "Menyinkronkan...";

  try {
    const response = await fetch(RATE_ENDPOINT, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();

    if (payload.result !== "success" || !payload.rates) {
      throw new Error("Respons kurs tidak valid.");
    }

    await commit(
      "Kurs diperbarui",
      `${Object.keys(payload.rates).length} mata uang`,
      () => {
        state.rateHistory.unshift({
          date: new Date().toISOString(),
          rates: deepClone(state.rates)
        });

        state.rateHistory = state.rateHistory.slice(0, 30);

        state.rates = {
          ...state.rates,
          ...payload.rates,
          USD: 1
        };

        state.lastRateUpdate = new Date().toISOString();
      }
    );

    showToast("Kurs berhasil diperbarui.", "💱");
  } catch (error) {
    console.error(error);
    showToast("Sinkronisasi kurs gagal.", "❗");
  } finally {
    button.disabled = false;
    button.textContent = "↻ Sinkronkan";
  }
}

async function requestNotifications() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission !== "granted") {
    return;
  }

  state.settings.notificationsEnabled = true;
  await encryptState();

  const dueSoon = upcomingRecurring().filter((item) => {
    const difference =
      new Date(`${item.nextDate}T00:00:00`) -
      new Date(`${localISO()}T00:00:00`);

    return difference >= 0 && difference <= 3 * 86400000;
  });

  dueSoon.forEach((item) => {
    new Notification(`Pembayaran: ${item.name}`, {
      body: `${formatCurrency(item.amount, item.currency)} jatuh tempo ${formatDate(item.nextDate)}.`,
      icon: "./icons/icon-192.png"
    });
  });
}

async function registerPasskey() {
  if (!navigator.credentials?.create) {
    showToast("WebAuthn tidak didukung browser ini.", "❗");
    return;
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "CHARISNA Money Management"
        },
        user: {
          id: userId,
          name: state.settings.userName,
          displayName: state.settings.userName
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ],
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      }
    });

    vault.passkeyCredentialId = bytesToBase64(
      new Uint8Array(credential.rawId)
    );

    sessionStorage.setItem(
      SESSION_KEY,
      bytesToBase64(currentKeyBytes)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
    renderSettings();

    showToast("Passkey berhasil didaftarkan.", "🔑");
  } catch (error) {
    console.error(error);
    showToast("Pendaftaran passkey dibatalkan.", "❗");
  }
}

async function quickUnlock() {
  const sessionKey = sessionStorage.getItem(SESSION_KEY);

  if (!vault.passkeyCredentialId || !sessionKey) {
    showToast("Quick unlock tidak tersedia.", "❗");
    return;
  }

  try {
    await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            type: "public-key",
            id: base64ToBytes(vault.passkeyCredentialId)
          }
        ],
        userVerification: "required",
        timeout: 60000
      }
    });

    currentKeyBytes = base64ToBytes(sessionKey);
    currentKey = await importAesKey(currentKeyBytes);
    state = await decryptState(currentKey);

    unlockApplication();
  } catch (error) {
    console.error(error);
    showToast("Quick unlock gagal.", "❗");
  }
}

function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = createId("device");
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

function setCloudMessage(message, tone = "online") {
  cloudLastMessage = message;
  cloudLastTone = tone;
  renderCloudStatus();
}

function renderCloudStatus() {
  const accountElement = document.getElementById("cloudAccountStatus");
  const statusElement = document.getElementById("cloudSyncStatus");
  const dotElement = document.getElementById("cloudStatusDot");
  const strip = document.getElementById("cloudAccountStrip");
  const stripText = document.getElementById("cloudAccountStripText");

  if (accountElement) {
    accountElement.textContent = cloudSession?.user?.email
      ? `Tersambung sebagai ${cloudSession.user.email}`
      : "Belum masuk ke akun cloud";
  }

  if (statusElement) {
    statusElement.textContent = cloudLastMessage;
  }

  if (dotElement) {
    dotElement.className = "cloud-status-dot";
    if (cloudLastTone !== "offline") {
      dotElement.classList.add(cloudLastTone);
    }
  }

  if (strip && stripText) {
    strip.hidden = !cloudSession?.user?.email;
    stripText.textContent = cloudSession?.user?.email
      ? `Cloud: ${cloudSession.user.email}`
      : "Cloud belum tersambung";
  }

  const pushButton = document.getElementById("cloudPushButton");
  const pullButton = document.getElementById("cloudPullButton");
  const logoutButton = document.getElementById("cloudLogoutButton");

  [pushButton, pullButton, logoutButton].forEach((button) => {
    if (button) {
      button.disabled = !cloudSession?.user;
    }
  });
}

function showCloudGate() {
  document.getElementById("cloudAuthPanel").hidden = false;
  document.getElementById("cloudEmailPanel").hidden = true;
  document.getElementById("setupPanel").hidden = true;
  document.getElementById("loginPanel").hidden = true;
  document.getElementById("cloudAccountStrip").hidden = true;
  document.getElementById("appShell").hidden = true;
  document.getElementById("authScreen").hidden = false;
  document.body.classList.add("locked");
}

function showVaultGate(message = "") {
  vault = loadVault();
  document.getElementById("cloudAuthPanel").hidden = true;
  document.getElementById("cloudEmailPanel").hidden = true;
  document.getElementById("setupPanel").hidden = Boolean(vault);
  document.getElementById("loginPanel").hidden = !vault;
  document.getElementById("loginError").textContent = message;
  document.getElementById("quickUnlockButton").hidden =
    !vault?.passkeyCredentialId ||
    !sessionStorage.getItem(SESSION_KEY);
  configureCredentialUI();
  renderCloudStatus();
}

function setCloudAuthMode(mode) {
  cloudAuthMode = mode;
  const isSignup = mode === "signup";

  document.getElementById("cloudLoginTab").classList.toggle("active", !isSignup);
  document.getElementById("cloudSignupTab").classList.toggle("active", isSignup);
  document.getElementById("cloudAuthSubmitButton").textContent =
    isSignup ? "Daftar Akun Cloud" : "Masuk ke Cloud";
  document.getElementById("cloudPasswordLabel").textContent =
    isSignup ? "Buat sandi akun cloud" : "Sandi akun cloud";
  document.getElementById("cloudPassword").autocomplete =
    isSignup ? "new-password" : "current-password";
  document.getElementById("cloudAuthError").textContent = "";
}

function cloudVaultPayload() {
  if (!vault) {
    return null;
  }

  const payload = deepClone(vault);
  delete payload.cloud;
  return payload;
}

async function sha256Base64(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(JSON.stringify(value))
  );

  return bytesToBase64(new Uint8Array(digest));
}

async function fetchRemoteVault() {
  if (!supabaseClient || !cloudSession?.user) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from(CLOUD_TABLE)
    .select("encrypted_vault, version, device_id, checksum, updated_at")
    .eq("user_id", cloudSession.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

function saveRemoteVaultLocally(remote) {
  const remoteVault = remote?.encrypted_vault;

  if (!remoteVault?.payload || !remoteVault?.salt) {
    throw new Error("Brankas cloud tidak valid.");
  }

  vault = deepClone(remoteVault);
  vault.cloud = {
    userId: cloudSession.user.id,
    version: Number(remote.version) || 0,
    updatedAt: remote.updated_at || null,
    deviceId: remote.device_id || null,
    checksum: remote.checksum || null
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  cloudConflict = null;
  configureCredentialUI();
}

async function adoptNewestCloudVault(
  remote,
  { notify = false, reason = "Cloud terbaru dipakai otomatis" } = {}
) {
  if (!remote?.encrypted_vault) {
    return false;
  }

  const wasUnlocked = Boolean(state && currentKey);
  saveEncryptedCloudRecovery(reason);
  saveRemoteVaultLocally(remote);
  cloudConflict = null;

  if (wasUnlocked) {
    try {
      state = await decryptState(currentKey);
      renderAll();
      setCloudMessage(
        `Cloud terbaru aktif otomatis · versi ${Number(remote.version) || 0}.`,
        "online"
      );
      if (notify) {
        showToast(`Cloud terbaru v${Number(remote.version) || 0} sudah dipakai.`, "☁️");
      }
      return true;
    } catch (error) {
      console.warn("PIN perangkat ini berbeda dari brankas cloud terbaru:", error);
      lockApplication(
        "Cloud terbaru sudah diunduh. Masukkan PIN terbaru yang digunakan di perangkat lain."
      );
      return true;
    }
  }

  setCloudMessage(
    `Cloud terbaru siap · versi ${Number(remote.version) || 0}.`,
    "online"
  );
  return true;
}

async function prepareVaultAfterCloudLogin() {
  vault = loadVault();
  setCloudMessage("Memeriksa brankas cloud...", "syncing");

  try {
    const remote = await fetchRemoteVault();

    if (
      vault?.cloud?.userId &&
      vault.cloud.userId !== cloudSession.user.id
    ) {
      setCloudMessage(
        "Brankas lokal terhubung ke akun cloud lain. Masuk menggunakan akun sebelumnya atau reset data lokal.",
        "conflict"
      );
      await supabaseClient.auth.signOut();
      cloudSession = null;
      showCloudGate();
      document.getElementById("cloudAuthError").textContent =
        "Data lokal ini terhubung ke akun cloud yang berbeda. Gunakan email cloud sebelumnya.";
      return;
    }

    if (!vault && remote) {
      await adoptNewestCloudVault(remote, {
        reason: "Login pada perangkat baru"
      });
      setCloudMessage(
        `Cloud terbaru versi ${remote.version} dipakai otomatis.`,
        "online"
      );
      showVaultGate(
        vaultUsesPin()
          ? `Masukkan PIN ${vault.pinLength || 6} angka dari perangkat sebelumnya.`
          : "Masukkan sandi brankas lama. Setelah terbuka, sandi akan dimigrasikan menjadi PIN angka."
      );
      return;
    }

    if (vault && !remote) {
      await cloudPush({ force: true, silent: true });
      showVaultGate();
      return;
    }

    if (!vault && !remote) {
      setCloudMessage("Akun cloud siap. Buat brankas pertama kamu.", "online");
      showVaultGate();
      return;
    }

    const localPayload = cloudVaultPayload();
    const localChecksum = await sha256Base64(localPayload);

    if (remote.checksum && remote.checksum === localChecksum) {
      vault.cloud = {
        userId: cloudSession.user.id,
        version: Number(remote.version) || 0,
        updatedAt: remote.updated_at || null,
        deviceId: remote.device_id || null,
        checksum: remote.checksum
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
      cloudConflict = null;
      setCloudMessage(`Cloud sudah sinkron · versi ${remote.version}.`, "online");
      showVaultGate();
      return;
    }

    const knownVersion =
      vault.cloud?.userId === cloudSession.user.id
        ? Number(vault.cloud.version || 0)
        : 0;
    const remoteVersion = Number(remote.version || 0);

    if (knownVersion === 0 || remoteVersion > knownVersion) {
      await adoptNewestCloudVault(remote, {
        reason: `Sebelum memakai cloud terbaru v${remoteVersion}`
      });
      showVaultGate();
      return;
    }

    if (knownVersion > remoteVersion) {
      await cloudPush({ force: true, silent: true });
      showVaultGate();
      return;
    }

    const localUpdatedAt = new Date(
      vault.localUpdatedAt || vault.cloud?.updatedAt || 0
    ).getTime();
    const remoteUpdatedAt = new Date(remote.updated_at || 0).getTime();

    if (localUpdatedAt > remoteUpdatedAt) {
      await cloudPush({ force: true, silent: true });
    } else {
      await adoptNewestCloudVault(remote, {
        reason: `Sebelum menyamakan cloud v${remoteVersion}`
      });
    }
    showVaultGate();
  } catch (error) {
    console.error(error);
    setCloudMessage(`Cloud gagal diperiksa: ${error.message}`, "error");
    showVaultGate(
      "Cloud sedang tidak tersedia. Data lokal tetap dapat dibuka di perangkat ini."
    );
  }
}

function scheduleCloudSync() {
  clearTimeout(cloudSyncTimer);

  if (!cloudSession?.user || !vault) {
    return;
  }

  cloudSyncTimer = window.setTimeout(() => {
    cloudPush({ silent: true }).catch((error) => {
      console.error(error);
      setCloudMessage(`Sinkronisasi otomatis gagal: ${error.message}`, "error");
    });
  }, 500);
}

async function waitForCloudIdle(timeout = 10000) {
  const startedAt = Date.now();

  while (cloudSyncBusy && Date.now() - startedAt < timeout) {
    await new Promise((resolve) => window.setTimeout(resolve, 40));
  }
}

async function flushCloudAutosave({ silent = true } = {}) {
  clearTimeout(cloudSyncTimer);

  try {
    await latestEncryptionPromise;
  } catch (error) {
    console.warn("Enkripsi terakhir belum selesai:", error);
  }

  if (!vault || !cloudSession?.user || !navigator.onLine) {
    return false;
  }

  await waitForCloudIdle();
  return cloudPush({ silent });
}

async function cloudPush({ force = false, silent = false } = {}) {
  if (!supabaseClient || !cloudSession?.user) {
    if (!silent) {
      showToast("Masuk ke akun cloud terlebih dahulu.", "❗");
    }
    return false;
  }

  if (!vault) {
    return false;
  }

  if (cloudSyncBusy) {
    cloudSyncQueued = true;
    return false;
  }

  cloudSyncBusy = true;
  setCloudMessage("Mengunggah brankas terenkripsi...", "syncing");

  try {
    const remote = await fetchRemoteVault();
    const knownVersion =
      vault.cloud?.userId === cloudSession.user.id
        ? Number(vault.cloud.version || 0)
        : 0;

    if (remote && Number(remote.version) > knownVersion) {
      await adoptNewestCloudVault(remote, {
        notify: !silent,
        reason: `Perubahan dari perangkat lain · cloud v${remote.version}`
      });
      return "pulled";
    }

    const encryptedVault = cloudVaultPayload();
    const checksum = await sha256Base64(encryptedVault);

    if (
      remote &&
      Number(remote.version) === knownVersion &&
      remote.checksum &&
      remote.checksum !== checksum &&
      remote.device_id !== getDeviceId()
    ) {
      const localUpdatedAt = new Date(
        vault.localUpdatedAt || vault.cloud?.updatedAt || 0
      ).getTime();
      const remoteUpdatedAt = new Date(remote.updated_at || 0).getTime();

      if (remoteUpdatedAt >= localUpdatedAt) {
        await adoptNewestCloudVault(remote, {
          notify: !silent,
          reason: `Cloud v${remote.version} lebih baru berdasarkan waktu simpan`
        });
        return "pulled";
      }
    }

    if (remote?.checksum && remote.checksum === checksum) {
      vault.cloud = {
        userId: cloudSession.user.id,
        version: Number(remote.version) || 0,
        updatedAt: remote.updated_at || null,
        deviceId: remote.device_id || null,
        checksum
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
      cloudConflict = null;
      setCloudMessage(`Cloud sudah sinkron · versi ${remote.version}.`, "online");
      if (state) { renderWarnings(); }
      return true;
    }

    const nextVersion = remote ? Number(remote.version) + 1 : 1;
    const now = new Date().toISOString();

    const { data, error } = await supabaseClient
      .from(CLOUD_TABLE)
      .upsert(
        {
          user_id: cloudSession.user.id,
          encrypted_vault: encryptedVault,
          version: nextVersion,
          device_id: getDeviceId(),
          checksum,
          updated_at: now
        },
        { onConflict: "user_id" }
      )
      .select("version, device_id, checksum, updated_at")
      .single();

    if (error) {
      throw error;
    }

    vault.cloud = {
      userId: cloudSession.user.id,
      version: Number(data.version),
      updatedAt: data.updated_at,
      deviceId: data.device_id,
      checksum: data.checksum
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
    cloudConflict = null;
    setCloudMessage(
      `Tersinkron otomatis · versi ${data.version} · ${formatDateTime(data.updated_at)}.`,
      "online"
    );
    if (state) { renderWarnings(); }

    if (!silent) {
      showToast("Brankas terenkripsi berhasil diunggah.", "☁️");
    }

    return true;
  } finally {
    cloudSyncBusy = false;
    if (cloudSyncQueued) {
      cloudSyncQueued = false;
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = window.setTimeout(() => {
        cloudPush({ silent: true }).catch((error) => {
          console.error(error);
          setCloudMessage(`Sinkronisasi lanjutan gagal: ${error.message}`, "error");
        });
      }, 80);
    }
  }
}

async function cloudPull() {
  if (!supabaseClient || !cloudSession?.user) {
    showToast("Masuk ke akun cloud terlebih dahulu.", "❗");
    return;
  }

  setCloudMessage("Mengunduh brankas cloud...", "syncing");
  const remote = await fetchRemoteVault();

  if (!remote) {
    setCloudMessage("Belum ada brankas di cloud.", "online");
    showToast("Belum ada data cloud untuk diunduh.", "☁️");
    return;
  }

  await adoptNewestCloudVault(remote, {
    notify: true,
    reason: `Download manual cloud v${remote.version}`
  });
  setCloudMessage(`Cloud terbaru versi ${remote.version} sudah aktif.`, "online");
}

async function deleteCloudVaultIfAvailable() {
  if (!supabaseClient || !cloudSession?.user) {
    return;
  }

  const { error } = await supabaseClient
    .from(CLOUD_TABLE)
    .delete()
    .eq("user_id", cloudSession.user.id);

  if (error) {
    throw error;
  }
}

async function cloudLogout() {
  if (!supabaseClient) {
    return;
  }

  try {
    if (vault) {
      await flushCloudAutosave({ silent: true });
    }
  } catch (error) {
    console.warn(error);
  }

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    throw error;
  }

  cloudSession = null;
  sessionStorage.removeItem(SESSION_KEY);
  lockApplication();
  setCloudMessage("Akun cloud telah keluar.", "offline");
  showCloudGate();
}

async function syncBankFeed() {
  const endpoint = document
    .getElementById("bankFeedEndpoint")
    .value.trim();

  const token = document
    .getElementById("bankFeedToken")
    .value.trim();

  if (!endpoint) {
    showToast("Isi endpoint bank feed.", "❗");
    return;
  }

  await saveIntegrationSettings();

  const response = await fetch(endpoint, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();
  const rows = Array.isArray(payload)
    ? payload
    : payload.transactions;

  if (!Array.isArray(rows)) {
    throw new Error("Respons bank feed tidak valid.");
  }

  showImportPreview(normalizeImportedRows(rows));
}

async function saveIntegrationSettings() {
  state.settings.bankFeedEndpoint =
    document.getElementById("bankFeedEndpoint").value.trim();

  state.settings.bankFeedToken =
    document.getElementById("bankFeedToken").value.trim();

  state.settings.webhookUrl =
    document.getElementById("webhookUrl").value.trim();

  await encryptState();
}

async function sendWebhook(eventName) {
  if (
    !state?.settings?.webhookUrl ||
    eventName === "webhook.test"
  ) {
    return;
  }

  try {
    await fetch(state.settings.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        encryptedVault: vault
      })
    });
  } catch (error) {
    console.warn("Webhook gagal:", error);
  }
}

async function testWebhook() {
  await saveIntegrationSettings();

  if (!state.settings.webhookUrl) {
    showToast("Isi webhook URL.", "❗");
    return;
  }

  const response = await fetch(state.settings.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event: "webhook.test",
      timestamp: new Date().toISOString(),
      message: "CHARISNA Money Management webhook test"
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  showToast("Webhook berhasil dipanggil.", "🔗");
}

function openCommandPalette() {
  document.getElementById("commandOverlay").hidden = false;
  document.getElementById("commandInput").value = "";
  renderCommandResults("");
  document.getElementById("commandInput").focus();
}

function closeCommandPalette() {
  document.getElementById("commandOverlay").hidden = true;
}

function renderCommandResults(query) {
  const normalized = query.trim().toLowerCase();

  const transactionResults = financialItems(state.transactions)
    .filter((transaction) =>
      [
        transaction.description,
        transaction.merchant,
        transaction.category,
        ...(transaction.tags || [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .slice(0, 8)
    .map((transaction) => ({
      icon: "↔️",
      title: transaction.description,
      subtitle: `${transaction.category} · ${formatCurrency(
        transaction.amount,
        transaction.currency
      )}`,
      action: `transaction:${transaction.id}`
    }));

  const accountResults = financialItems(state.accounts)
    .filter((account) =>
      account.name.toLowerCase().includes(normalized)
    )
    .slice(0, 6)
    .map((account) => ({
      icon: account.icon,
      title: account.name,
      subtitle: `${ACCOUNT_TYPES[account.type].label} · ${formatCurrency(
        accountBalance(account),
        account.currency
      )}`,
      action: `account:${account.id}`
    }));

  const goalResults = financialItems(state.goals)
    .filter((goal) =>
      goal.name.toLowerCase().includes(normalized)
    )
    .slice(0, 4)
    .map((goal) => ({
      icon: goal.icon,
      title: goal.name,
      subtitle: `Goal · ${formatCurrency(
        goalSaved(goal),
        goal.currency
      )}`,
      action: `goal:${goal.id}`
    }));

  const navigationResults = Object.entries(SECTION_COPY)
    .filter(([, copy]) =>
      copy.join(" ").toLowerCase().includes(normalized)
    )
    .map(([section, copy]) => ({
      icon: "📂",
      title: copy[0],
      subtitle: copy[1],
      action: `section:${section}`
    }));

  const results = [
    ...navigationResults,
    ...transactionResults,
    ...accountResults,
    ...goalResults
  ].slice(0, 20);

  document.getElementById("commandResults").innerHTML =
    results.length
      ? results
          .map(
            (result) => `
              <button
                class="command-result"
                data-command-action="${result.action}"
                type="button"
              >
                <span>${result.icon}</span>

                <span>
                  <strong>${escapeHTML(result.title)}</strong>
                  <small>${escapeHTML(result.subtitle)}</small>
                </span>
              </button>
            `
          )
          .join("")
      : emptyState("🔎", "Tidak ada hasil.");
}

function lockApplication(message = "") {
  if (vault && cloudSession?.user && navigator.onLine) {
    flushCloudAutosave({ silent: true }).catch((error) => {
      console.warn("Sinkronisasi saat lock tertunda:", error);
    });
  }

  currentKey = null;
  currentKeyBytes = null;
  state = null;
  undoStack = [];
  redoStack = [];

  document.getElementById("appShell").hidden = true;
  document.getElementById("authScreen").hidden = false;
  document.body.classList.add("locked");

  document.getElementById("setupPanel").hidden = true;
  document.getElementById("loginPanel").hidden = false;
  document.getElementById("loginError").textContent = message;

  document.getElementById("quickUnlockButton").hidden =
    !vault?.passkeyCredentialId ||
    !sessionStorage.getItem(SESSION_KEY);

  configureCredentialUI();
  renderCloudStatus();
}

function unlockApplication() {
  document.getElementById("authScreen").hidden = true;
  document.getElementById("appShell").hidden = false;
  document.body.classList.remove("locked");

  lastActivity = Date.now();
  startAutoLock();
  renderAll();
  requestNotifications();

  if (
    navigator.onLine &&
    (!state.lastRateUpdate ||
      Date.now() - new Date(state.lastRateUpdate).getTime() >
        12 * 60 * 60 * 1000)
  ) {
    syncRates();
  }
}

function startAutoLock() {
  clearInterval(autoLockTimer);

  autoLockTimer = window.setInterval(() => {
    if (!state) {
      return;
    }

    const timeout =
      Number(state.settings.autoLockMinutes || 5) * 60 * 1000;

    if (Date.now() - lastActivity >= timeout) {
      lockApplication(
        "Aplikasi dikunci otomatis karena tidak ada aktivitas."
      );
    }
  }, 15000);
}

function recordActivity() {
  if (state) {
    lastActivity = Date.now();
  }
}

async function initialize() {
  vault = loadVault();
  registerServiceWorker();

  if (!window.supabase?.createClient) {
    setCloudMessage(
      "Library cloud tidak dapat dimuat. Data lokal tetap dapat digunakan.",
      "error"
    );
    showVaultGate(
      "Cloud tidak tersedia. Periksa internet jika ingin melakukan sinkronisasi."
    );
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error(error);
    setCloudMessage(`Login cloud gagal diperiksa: ${error.message}`, "error");
    showCloudGate();
    return;
  }

  cloudSession = data.session;

  supabaseClient.auth.onAuthStateChange((event, session) => {
    cloudSession = session;
    renderCloudStatus();

    if (event === "SIGNED_OUT") {
      showCloudGate();
    }
  });

  if (!cloudSession) {
    if (!navigator.onLine && vault) {
      setCloudMessage("Offline · menggunakan data lokal.", "offline");
      showVaultGate("Mode offline: cloud akan tersambung kembali saat login tersedia.");
    } else {
      showCloudGate();
    }
    return;
  }

  await prepareVaultAfterCloudLogin();
}

async function registerServiceWorker() {
  if (window.CHARISNA_NATIVE || window.CharisnaDesktop?.isDesktop) {
    return;
  }

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./service-worker.js?v=13-cute-complete");
    } catch (error) {
      console.warn("Service worker gagal:", error);
    }
  }
}

document
  .getElementById("cloudLoginTab")
  .addEventListener("click", () => setCloudAuthMode("login"));

document
  .getElementById("cloudSignupTab")
  .addEventListener("click", () => setCloudAuthMode("signup"));

document
  .getElementById("backToCloudLoginButton")
  .addEventListener("click", () => {
    document.getElementById("cloudEmailPanel").hidden = true;
    document.getElementById("cloudAuthPanel").hidden = false;
    setCloudAuthMode("login");
  });

document
  .getElementById("cloudAuthForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("cloudEmail").value.trim();
    const password = document.getElementById("cloudPassword").value;
    const errorElement = document.getElementById("cloudAuthError");
    const submitButton = document.getElementById("cloudAuthSubmitButton");

    errorElement.textContent = "";

    if (password.length < 8) {
      errorElement.textContent = "Sandi akun cloud minimal 8 karakter.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = cloudAuthMode === "signup"
      ? "Mendaftarkan..."
      : "Memproses...";

    try {
      if (cloudAuthMode === "signup") {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.CharisnaDesktop?.isDesktop
              ? "https://charisna-money.netlify.app"
              : window.location.origin
          }
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          document.getElementById("cloudAuthPanel").hidden = true;
          document.getElementById("cloudEmailPanel").hidden = false;
          document.getElementById("cloudEmailMessage").textContent =
            `Tautan verifikasi telah dikirim ke ${email}. Buka email pada komputer ini, klik tautannya, lalu CHARISNA Money Management akan terbuka kembali.`;
          return;
        }

        cloudSession = data.session;
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }

        cloudSession = data.session;
      }

      await prepareVaultAfterCloudLogin();
    } catch (error) {
      console.error(error);
      errorElement.textContent =
        error.message === "Email not confirmed"
          ? "Email belum diverifikasi. Buka email verifikasi dari Supabase terlebih dahulu."
          : error.message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = cloudAuthMode === "signup"
        ? "Daftar Akun Cloud"
        : "Masuk ke Cloud";
    }
  });

document
  .getElementById("setupForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name =
      document.getElementById("setupName").value.trim();

    const password =
      document.getElementById("setupPassword").value;

    const confirmation =
      document.getElementById("setupPasswordConfirm").value;
    const pinLength = selectedPinLength("setupPinLength");

    const errorElement =
      document.getElementById("setupError");

    errorElement.textContent = "";

    if (!isValidPin(password, pinLength)) {
      errorElement.textContent =
        `PIN harus tepat ${pinLength} angka.`;
      return;
    }

    if (password !== confirmation) {
      errorElement.textContent =
        "Konfirmasi PIN tidak sama.";
      return;
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));

    currentKeyBytes = await deriveKeyBytes(
      password,
      salt,
      PIN_PBKDF2_ITERATIONS
    );
    currentKey = await importAesKey(currentKeyBytes);

    state = createDefaultState(name);

    vault = {
      version: 3,
      salt: bytesToBase64(salt),
      payload: null,
      passkeyCredentialId: null,
      credentialType: "pin",
      pinLength,
      kdfIterations: PIN_PBKDF2_ITERATIONS
    };

    await encryptState();

    sessionStorage.setItem(
      SESSION_KEY,
      bytesToBase64(currentKeyBytes)
    );

    unlockApplication();
    showToast("PIN aktif dan autosave cloud dinyalakan.", "🔐");
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    if (loginAttemptInProgress) return;

    const input = document.getElementById("loginPassword");
    const password = input.value;
    const errorElement = document.getElementById("loginError");

    errorElement.textContent = "";

    if (vaultUsesPin() && !isValidPin(password, Number(vault.pinLength || 6))) {
      errorElement.textContent = `PIN harus tepat ${Number(vault.pinLength || 6)} angka.`;
      return;
    }

    setLoginAttemptBusy(true);

    try {
      const salt = base64ToBytes(vault.salt);

      currentKeyBytes = await deriveKeyBytes(
        password,
        salt,
        vaultCredentialIterations()
      );
      currentKey = await importAesKey(currentKeyBytes);
      state = await decryptState(currentKey);

      sessionStorage.setItem(
        SESSION_KEY,
        bytesToBase64(currentKeyBytes)
      );

      unlockApplication();
      if (!vaultUsesPin()) {
        window.setTimeout(showPinMigrationModal, 350);
      }
    } catch (error) {
      console.error(error);

      currentKey = null;
      currentKeyBytes = null;
      state = null;

      errorElement.textContent = vaultUsesPin()
        ? "PIN salah. Silakan masukkan kembali."
        : "Sandi lama salah atau data rusak.";

      if (vaultUsesPin()) {
        input.value = "";
        window.setTimeout(() => input.focus(), 0);
      }
    } finally {
      setLoginAttemptBusy(false);
    }
  });

document
  .getElementById("forgotPasswordButton")
  .addEventListener("click", async () => {
    const answer = prompt(
      'Sandi brankas tidak dapat dipulihkan. Reset akan menghapus brankas lokal dan salinan cloud. Ketik "RESET" untuk melanjutkan.'
    );

    if (answer !== "RESET") {
      return;
    }

    try {
      await deleteCloudVaultIfAvailable();
    } catch (error) {
      console.error(error);
      showToast("Brankas cloud gagal dihapus. Reset dibatalkan.", "❗");
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    const request = indexedDB.deleteDatabase(ATTACHMENT_DB);
    request.onsuccess = () => location.reload();
    request.onerror = () => location.reload();
  });

document
  .getElementById("quickUnlockButton")
  .addEventListener("click", quickUnlock);

document
  .querySelectorAll("[data-password-toggle]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(
        button.dataset.passwordToggle
      );

      input.type =
        input.type === "password" ? "text" : "password";

      button.textContent =
        input.type === "password" ? "👁️" : "🙈";
    });
  });

document.addEventListener("click", async (event) => {
  const navButton = event.target.closest("[data-section]");

  if (navButton) {
    changeSection(navButton.dataset.section);
  }

  const editTransaction = event.target.closest(
    "[data-edit-transaction]"
  );

  if (editTransaction) {
    openTransactionForm(
      state.transactions.find(
        (transaction) =>
          transaction.id === editTransaction.dataset.editTransaction
      )
    );
  }

  const deleteTransaction = event.target.closest(
    "[data-delete-transaction]"
  );

  if (deleteTransaction) {
    const transaction = state.transactions.find(
      (item) =>
        item.id === deleteTransaction.dataset.deleteTransaction
    );

    if (
      transaction &&
      confirm(`Hapus "${transaction.description}"?`)
    ) {
      await commit(
        "Transaksi dihapus",
        transaction.description,
        () => {
          state.transactions = state.transactions.filter(
            (item) => item.id !== transaction.id
          );
        }
      );
    }
  }

  const editAccount = event.target.closest("[data-edit-account]");

  if (editAccount) {
    openAccountForm(
      state.accounts.find(
        (account) =>
          account.id === editAccount.dataset.editAccount
      )
    );
  }

  const reconcileAccount = event.target.closest(
    "[data-reconcile-account]"
  );

  if (reconcileAccount) {
    openReconciliationForm(
      state.accounts.find(
        (account) =>
          account.id === reconcileAccount.dataset.reconcileAccount
      )
    );
  }

  const editBudget = event.target.closest("[data-edit-budget]");

  if (editBudget) {
    openBudgetForm(
      state.budgets.find(
        (budget) => budget.id === editBudget.dataset.editBudget
      )
    );
  }

  const editGoal = event.target.closest("[data-edit-goal]");

  if (editGoal) {
    openGoalForm(
      state.goals.find(
        (goal) => goal.id === editGoal.dataset.editGoal
      )
    );
  }

  const contributeGoal = event.target.closest(
    "[data-contribute-goal]"
  );

  if (contributeGoal) {
    openContributionForm(
      state.goals.find(
        (goal) =>
          goal.id === contributeGoal.dataset.contributeGoal
      )
    );
  }

  const deleteRule = event.target.closest("[data-delete-rule]");

  if (deleteRule) {
    await commit(
      "Aturan otomatis dihapus",
      deleteRule.dataset.deleteRule,
      () => {
        state.rules = state.rules.filter(
          (rule) => rule.id !== deleteRule.dataset.deleteRule
        );
      }
    );
  }

  const editProfile = event.target.closest("[data-edit-profile]");

  if (editProfile) {
    openProfileForm(
      state.profiles.find(
        (profile) =>
          profile.id === editProfile.dataset.editProfile
      )
    );
  }

  const categoryDrill = event.target.closest(
    "[data-drill-category]"
  );

  if (categoryDrill) {
    openCategoryDrilldown(categoryDrill.dataset.drillCategory);
  }

  const widgetToggle = event.target.closest(
    "[data-widget-enabled]"
  );

  if (widgetToggle) {
    const widget = state.settings.dashboardWidgets.find(
      (item) => item.id === widgetToggle.dataset.widgetEnabled
    );

    widget.enabled = widgetToggle.checked;
    await encryptState();
    renderDashboard();
  }

  const widgetUp = event.target.closest("[data-widget-up]");

  if (widgetUp) {
    const index = Number(widgetUp.dataset.widgetUp);

    if (index > 0) {
      const widgets = state.settings.dashboardWidgets;
      [widgets[index - 1], widgets[index]] = [
        widgets[index],
        widgets[index - 1]
      ];

      await encryptState();
      renderAll();
    }
  }

  const widgetDown = event.target.closest("[data-widget-down]");

  if (widgetDown) {
    const index = Number(widgetDown.dataset.widgetDown);
    const widgets = state.settings.dashboardWidgets;

    if (index < widgets.length - 1) {
      [widgets[index + 1], widgets[index]] = [
        widgets[index],
        widgets[index + 1]
      ];

      await encryptState();
      renderAll();
    }
  }

  const favoriteCurrency = event.target.closest(
    "[data-toggle-favorite-currency]"
  );

  if (favoriteCurrency) {
    state.settings.favoriteCurrencies =
      state.settings.favoriteCurrencies.filter(
        (currency) =>
          currency !== favoriteCurrency.dataset.toggleFavoriteCurrency
      );

    await encryptState();
    renderSettings();
  }

  const commandAction = event.target.closest(
    "[data-command-action]"
  );

  if (commandAction) {
    const [type, id] =
      commandAction.dataset.commandAction.split(":");

    closeCommandPalette();

    if (type === "section") {
      changeSection(id);
    } else if (type === "transaction") {
      openTransactionForm(
        state.transactions.find(
          (transaction) => transaction.id === id
        )
      );
    } else if (type === "account") {
      changeSection("accounts");
    } else if (type === "goal") {
      changeSection("goals");
    }
  }
});

document
  .getElementById("closeModalButton")
  .addEventListener("click", closeModal);

document
  .getElementById("modalBackdrop")
  .addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") {
      closeModal();
    }
  });

document
  .getElementById("addTransactionButton")
  .addEventListener("click", () => openTransactionForm());

document
  .getElementById("addAccountButton")
  .addEventListener("click", () => openAccountForm());

document
  .getElementById("addBudgetButton")
  .addEventListener("click", () => openBudgetForm());

document
  .getElementById("addGoalButton")
  .addEventListener("click", () => openGoalForm());

document
  .getElementById("addRecurringButton")
  .addEventListener("click", () => openRecurringForm());

document
  .getElementById("reconciliationButton")
  .addEventListener("click", () => openReconciliationForm());

document
  .getElementById("addRuleButton")
  .addEventListener("click", openRuleForm);

document
  .getElementById("addProfileButton")
  .addEventListener("click", () => openProfileForm());

document
  .getElementById("transactionSearch")
  .addEventListener("input", renderTransactions);

document
  .getElementById("transactionTypeFilter")
  .addEventListener("change", renderTransactions);

document
  .getElementById("previousMonthButton")
  .addEventListener("click", () => {
    calendarCursor.setMonth(calendarCursor.getMonth() - 1);
    renderCalendar();
  });

document
  .getElementById("nextMonthButton")
  .addEventListener("click", () => {
    calendarCursor.setMonth(calendarCursor.getMonth() + 1);
    renderCalendar();
  });

document
  .getElementById("themeButton")
  .addEventListener("click", async () => {
    state.settings.darkMode = !state.settings.darkMode;
    await encryptState();
    applyTheme();
    renderDashboard();
    renderReportCharts();
  });

document
  .getElementById("privacyButton")
  .addEventListener("click", async () => {
    state.settings.privacyMode = !state.settings.privacyMode;
    await encryptState();
    applyTheme();
  });

document
  .getElementById("commandButton")
  .addEventListener("click", openCommandPalette);

document
  .getElementById("commandOverlay")
  .addEventListener("click", (event) => {
    if (event.target.id === "commandOverlay") {
      closeCommandPalette();
    }
  });

document
  .getElementById("commandInput")
  .addEventListener("input", (event) => {
    renderCommandResults(event.target.value);
  });

document.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();
    openCommandPalette();
  }

  if (event.key === "Escape") {
    closeModal();
    closeCommandPalette();
  }
});

document
  .getElementById("preferenceForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    await commit(
      "Preferensi diperbarui",
      "Nama, mata uang, tema, dan auto-lock",
      () => {
        state.settings.userName =
          document.getElementById("settingsUserName").value.trim();

        state.settings.baseCurrency =
          document.getElementById("baseCurrencySelect").value;

        state.settings.darkMode =
          document.getElementById("themeSelect").value === "dark";

        state.settings.autoLockMinutes = Number(
          document.getElementById("autoLockSelect").value
        );
      }
    );

    showToast("Preferensi berhasil disimpan.", "⚙️");
  });

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const oldPassword =
      document.getElementById("oldPassword").value;

    const newPassword =
      document.getElementById("newPassword").value;

    const confirmation =
      document.getElementById("newPasswordConfirm").value;
    const pinLength = selectedPinLength("newPinLength");

    if (!isValidPin(newPassword, pinLength) || newPassword !== confirmation) {
      showToast(
        `PIN baru harus sama dan tepat ${pinLength} angka.`,
        "❗"
      );
      return;
    }

    try {
      const oldBytes = await deriveKeyBytes(
        oldPassword,
        base64ToBytes(vault.salt),
        vaultCredentialIterations()
      );

      const oldKey = await importAesKey(oldBytes);
      await decryptState(oldKey);
    } catch {
      showToast(vaultUsesPin() ? "PIN lama salah." : "Sandi lama salah.", "❗");
      return;
    }

    await setNewVaultPin(newPassword, pinLength);
    addAudit("PIN brankas diubah", `PIN ${pinLength} angka aktif di seluruh perangkat.`);
    await encryptState();

    form.reset();
    updatePinFieldLengths("newPinLength", ["newPassword", "newPasswordConfirm"]);
    showToast("PIN berhasil diubah dan disinkronkan.", "🔐");
  });

document
  .getElementById("manualRateCurrency")
  .addEventListener("change", (event) => {
    document.getElementById("manualRateValue").value =
      state.rates[event.target.value] || "";
  });

document
  .getElementById("manualRateForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const currency =
      document.getElementById("manualRateCurrency").value;

    const value = Number(
      document.getElementById("manualRateValue").value
    );

    if (!Number.isFinite(value) || value <= 0) {
      showToast("Nilai kurs tidak valid.", "❗");
      return;
    }

    await commit(
      "Kurs manual diperbarui",
      `${currency} = ${value} per USD`,
      () => {
        state.rates[currency] = currency === "USD" ? 1 : value;
      }
    );

    showToast("Kurs manual berhasil disimpan.", "💱");
  });

document
  .getElementById("syncRatesButton")
  .addEventListener("click", syncRates);

document
  .getElementById("registerPasskeyButton")
  .addEventListener("click", registerPasskey);

document
  .getElementById("removePasskeyButton")
  .addEventListener("click", async () => {
    vault.passkeyCredentialId = null;
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
    renderSettings();
    showToast("Passkey dihapus.", "🔑");
  });

document
  .getElementById("lockButton")
  .addEventListener("click", () => {
    lockApplication("Aplikasi dikunci secara manual.");
  });

document
  .getElementById("undoButton")
  .addEventListener("click", undo);

document
  .getElementById("redoButton")
  .addEventListener("click", redo);

document
  .getElementById("importCsvButton")
  .addEventListener("click", () => {
    document.getElementById("csvFileInput").click();
  });

document
  .getElementById("importExcelButton")
  .addEventListener("click", () => {
    document.getElementById("excelFileInput").click();
  });

document
  .getElementById("exportBackupButton")
  .addEventListener("click", exportEncryptedBackup);

document
  .getElementById("restoreBackupButton")
  .addEventListener("click", () => {
    document.getElementById("backupFileInput").click();
  });

document
  .getElementById("ocrReceiptButton")
  .addEventListener("click", () => {
    document.getElementById("receiptFileInput").click();
  });

document
  .getElementById("scanQrButton")
  .addEventListener("click", () => {
    document.getElementById("qrFileInput").click();
  });

document
  .getElementById("csvFileInput")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (file) {
      try {
        showImportPreview(
          normalizeImportedRows(await parseCsv(file))
        );
      } catch (error) {
        console.error(error);
        showToast("CSV gagal dibaca.", "❗");
      }
    }

    event.target.value = "";
  });

document
  .getElementById("excelFileInput")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (file) {
      try {
        await processExcel(file);
      } catch (error) {
        console.error(error);
        showToast("Excel gagal dibaca.", "❗");
      }
    }

    event.target.value = "";
  });

document
  .getElementById("backupFileInput")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (file) {
      try {
        await restoreEncryptedBackup(file);
      } catch (error) {
        console.error(error);
        showToast("Backup tidak valid.", "❗");
      }
    }

    event.target.value = "";
  });

document
  .getElementById("receiptFileInput")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (file) {
      await processReceipt(file);
    }

    event.target.value = "";
  });

document
  .getElementById("qrFileInput")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (file) {
      await processQr(file);
    }

    event.target.value = "";
  });

document
  .getElementById("exportPdfButton")
  .addEventListener("click", exportPdf);

document
  .getElementById("exportExcelButton")
  .addEventListener("click", exportExcel);

document
  .getElementById("cloudPushButton")
  .addEventListener("click", async () => {
    try {
      await cloudPush();
    } catch (error) {
      console.error(error);
      setCloudMessage(`Upload cloud gagal: ${error.message}`, "error");
      showToast("Upload cloud gagal.", "❗");
    }
  });

document
  .getElementById("cloudPullButton")
  .addEventListener("click", async () => {
    try {
      await cloudPull();
    } catch (error) {
      console.error(error);
      setCloudMessage(`Download cloud gagal: ${error.message}`, "error");
      showToast("Download cloud gagal.", "❗");
    }
  });

document
  .getElementById("cloudLogoutButton")
  .addEventListener("click", async () => {
    try {
      await cloudLogout();
    } catch (error) {
      console.error(error);
      showToast("Gagal keluar dari akun cloud.", "❗");
    }
  });

document
  .getElementById("syncBankFeedButton")
  .addEventListener("click", async () => {
    try {
      await syncBankFeed();
    } catch (error) {
      console.error(error);
      showToast("Sinkronisasi bank feed gagal.", "❗");
    }
  });

document
  .getElementById("testWebhookButton")
  .addEventListener("click", async () => {
    try {
      await testWebhook();
    } catch (error) {
      console.error(error);
      showToast("Webhook gagal.", "❗");
    }
  });

document
  .getElementById("clearFinanceButton")
  .addEventListener("click", async () => {
    const activeProfileId = window.activeFinancialUserId?.()
      || state.settings?.activeFinancialUserId
      || state.settings?.activeBookId
      || state.profiles?.[0]?.id
      || "";
    const activeProfile = state.profiles?.find((profile) => profile.id === activeProfileId);
    const activeProfileName = activeProfile?.name || "akun aktif";
    const confirmationText = `HAPUS ${activeProfileName}`;
    const linkedTransferIds = new Set(
      (state.transactions || [])
        .filter((transaction) =>
          transaction.crossProfileTransferId &&
          (transaction.sourceProfileId === activeProfileId || transaction.destinationProfileId === activeProfileId)
        )
        .map((transaction) => transaction.crossProfileTransferId)
    );
    const linkedTransferWarning = linkedTransferIds.size
      ? `\n\n${linkedTransferIds.size} transfer antar akun yang terhubung juga akan dihapus dari akun pasangannya agar saldo tetap konsisten.`
      : "";
    const answer = prompt(
      `Tindakan ini hanya menghapus seluruh data keuangan milik “${activeProfileName}” dan tidak menghapus akun keuangannya.${linkedTransferWarning}\n\nKetik "${confirmationText}" untuk melanjutkan.`
    );

    if (answer !== confirmationText) {
      return;
    }

    const scopedCollections = [
      "accounts",
      "transactions",
      "budgets",
      "goals",
      "recurring",
      "debts",
      "investments",
      "sharedWallets",
      "reconciliations",
      "rules",
      "transactionTemplates"
    ];

    await commit(
      "Data akun keuangan dihapus",
      `Seluruh data finansial milik ${activeProfileName} dikosongkan.`,
      () => {
        scopedCollections.forEach((collectionName) => {
          if (!Array.isArray(state[collectionName])) return;
          state[collectionName] = state[collectionName].filter((item) => {
            if (collectionName === "transactions" && item.crossProfileTransferId) {
              return !linkedTransferIds.has(item.crossProfileTransferId);
            }
            return item.profileId !== activeProfileId;
          });
        });
      }
    );
  });

document
  .getElementById("resetApplicationButton")
  .addEventListener("click", () => {
    const answer = prompt(
      'Ini hanya menghapus data pada browser ini; salinan cloud tetap aman. Ketik "RESET LOKAL" untuk melanjutkan.'
    );

    if (answer !== "RESET LOKAL") {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    indexedDB.deleteDatabase(ATTACHMENT_DB);
    location.reload();
  });

[
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll"
].forEach((eventName) => {
  document.addEventListener(eventName, recordActivity, {
    passive: true
  });
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});

document.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "hidden" &&
    vault &&
    cloudSession?.user &&
    navigator.onLine
  ) {
    flushCloudAutosave({ silent: true }).catch((error) => {
      console.warn("Autosave saat aplikasi disembunyikan tertunda:", error);
    });
  }
});

window.addEventListener("online", () => {
  if (vault && cloudSession?.user) {
    flushCloudAutosave({ silent: true }).catch((error) => {
      console.warn("Autosave setelah online kembali tertunda:", error);
    });
  }
});

bindPinControls();
initialize();
