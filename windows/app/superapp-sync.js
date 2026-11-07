"use strict";
(() => {
  const ENDPOINT = "https://zen.charisna-superapp.workers.dev/money/push";
  const period = () => {
    const parts = new Intl.DateTimeFormat("en", {timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    return `${parts.find(p=>p.type==="year").value}-${parts.find(p=>p.type==="month").value}`;
  };
  const minor = (value, scale) => {
    const rounded = Math.round(value * 10 ** scale);
    return Number.isFinite(value) && Number.isSafeInteger(rounded) ? String(rounded) : null;
  };
  const convert = (value, from, to) => from === to ? Number(value) : convertCurrency(value, from, to);
  function transactionValue(tx, currency, accountCurrency) {
    const amount = Number(tx.amount);
    if (!Number.isFinite(amount)) return null;
    const historicalRate = Number(tx.historicalRate);
    return historicalRate > 0
      ? convert(amount * historicalRate, tx.baseCurrency || currency, currency)
      : convert(amount, accountCurrency || currency, currency);
  }
  function snapshot() {
    if (!state || !vault) throw Error("Buka brankas terlebih dahulu.");
    const month = period();
    const profiles = (state.profiles || []).filter(p => !p.archived).map(p => {
      const currency = p.baseCurrency || "IDR";
      const scale = new Intl.NumberFormat("en", {style:"currency",currency}).resolvedOptions().maximumFractionDigits;
      const accounts = (state.accounts || []).filter(a => a.profileId === p.id && !a.archived);
      let balance = 0, income = 0, expense = 0, missingBalance = false, missingFlow = false;
      for (const account of accounts) {
        const value = convert(accountBalance(account), account.currency || currency, currency);
        if (!Number.isFinite(value)) missingBalance = true;
        else balance += account.liability ? -value : value;
      }
      for (const tx of state.transactions || []) {
        if (tx.profileId !== p.id || tx.status === "cancelled" || !String(tx.date || "").startsWith(month) || !["income","expense"].includes(tx.type)) continue;
        const account = (state.accounts || []).find(a => a.id === tx.accountId);
        const value = transactionValue(tx, currency, account?.currency);
        if (!Number.isFinite(value)) missingFlow = true;
        else if (tx.type === "income") income += value;
        else expense += value;
      }
      const balance_minor = missingBalance ? null : minor(balance, scale);
      const income_minor = missingFlow ? null : minor(income, scale);
      const expense_minor = missingFlow ? null : minor(expense, scale);
      return {id:String(p.id),name:String(p.name || "Akun"),currency,scale,
        quality:[balance_minor,income_minor,expense_minor].every(v=>v!==null)?"complete":"fx_unavailable",
        balance_minor,income_minor,expense_minor};
    });
    return {schema:1,month,profiles};
  }
  const status = message => {const el=document.getElementById("superAppStatus");if(el)el.textContent=message;};
  let sending = false;
  async function sendSnapshot(pairCode = "") {
    if (sending || !navigator.onLine || !state || !vault || !cloudSession?.user) return null;
    sending = true;
    try {
      const response = await fetch(ENDPOINT, {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({pairCode,syncKey:state.settings.superAppSyncKey || "",snapshot:snapshot()}),cache:"no-store"});
      if (!response.ok) throw Error(response.status === 409 ? "Hubungkan kembali dari SuperApp." : "Ringkasan belum terkirim.");
      status("Ringkasan terkirim ke SuperApp.");
      return await response.json();
    } finally {sending = false;}
  }
  const previousCloudPush = cloudPush;
  cloudPush = async function superAppCloudPush(options) {
    const result = await previousCloudPush(options);
    if ((result === true || result === "pulled") && state?.settings?.superAppSyncKey) {
      sendSnapshot().catch(() => status("Ringkasan SuperApp tertunda. Coba sinkron ulang."));
    }
    return result;
  };
  const cloudPanel = document.getElementById("cloudStatusCard")?.closest(".panel");
  if (!cloudPanel) return;
  const panel = document.createElement("article");panel.className="panel";
  const heading=document.createElement("h4");heading.textContent="CHARISNA SuperApp";
  const guide=document.createElement("p");guide.textContent="Kirim saldo bersih, pemasukan, dan pengeluaran bulan ini dari semua akun. PIN dan transaksi lengkap tetap di brankas.";
  const label=document.createElement("label");label.className="field";label.textContent="Kode dari tab Money Management di SuperApp";
  const code=document.createElement("input");code.id="superAppCode";code.className="input";code.maxLength=24;code.autocomplete="off";label.append(code);
  const button=document.createElement("button");button.className="button primary";button.type="button";button.textContent="Hubungkan dan kirim ringkasan";
  const message=document.createElement("p");message.id="superAppStatus";message.className="muted";message.setAttribute("role","status");message.textContent="Buka brankas dan masuk cloud sebelum menghubungkan.";
  panel.append(heading,guide,label,button,message);cloudPanel.after(panel);
  button.addEventListener("click",async()=>{
    const pairCode=code.value.trim().toUpperCase();code.value="";
    if(!/^[A-Z2-9]{24}$/.test(pairCode)){status("Masukkan kode 24 karakter dari SuperApp.");return;}
    button.disabled=true;
    try{
      const saved=await cloudPush({silent:true});
      if(saved!==true && saved!=="pulled")throw Error("Sinkron cloud belum berhasil.");
      const linked=await sendSnapshot(pairCode);
      if(!linked?.syncKey)throw Error("Ringkasan belum terkirim.");
      state.settings.superAppSyncKey=linked.syncKey;
      await encryptState();
      status("Terhubung. Ringkasan diperbarui setelah sinkron cloud berikutnya.");
    }catch(error){status(error.message || "Koneksi gagal.");}
    finally{button.disabled=false;}
  });
})();
