"use strict";

(() => {
  const VERSION = 13;
  const VERSION_LABEL = "v13 — Cute Complete Experience";
  const BOOK_ALL = "all";
  const EXTRA_CATEGORIES = [
    ["Harian", "🪴", "#45b7a7", "expense", "Kebutuhan"],
    ["Komunikasi", "📱", "#6c9cff", "expense", "Kebutuhan"],
    ["Sosial", "🥂", "#b875d6", "expense", "Gaya Hidup"],
    ["Pakaian", "👕", "#ee7aa7", "expense", "Gaya Hidup"],
    ["Kecantikan", "✂️", "#d68adf", "expense", "Gaya Hidup"],
    ["Anak & Bayi", "🍼", "#f1a460", "expense", "Keluarga"],
    ["Hewan", "🐾", "#9478d3", "expense", "Keluarga"],
    ["Hadiah", "🎁", "#ef5d93", "both", "Sosial"],
    ["Asuransi", "🛡️", "#4f95d7", "expense", "Keuangan"],
    ["Langganan", "🔁", "#7d75d9", "expense", "Tagihan"],
    ["Usaha", "🏪", "#20a47c", "income", "Pemasukan"],
    ["Sewa / Kos", "🏘️", "#2f9d8e", "income", "Pemasukan"],
    ["Cashback", "🪙", "#e6a832", "income", "Pemasukan"]
  ];

  const NAV_META = {
    dashboard: ["📖", "Akun"],
    transactions: ["✏️", "Transaksi"],
    accounts: ["👛", "Dompet"],
    budgets: ["🎯", "Anggaran"],
    goals: ["🌱", "Tabungan"],
    debts: ["🧮", "Utang"],
    investments: ["📈", "Investasi"],
    shared: ["👨‍👩‍👧", "Keluarga"],
    calendar: ["🗓️", "Kalender"],
    reports: ["🍩", "Analisis"],
    subscriptions: ["🔔", "Rutin"],
    categories: ["🏷️", "Kategori"],
    tools: ["✨", "Lainnya"],
    system: ["🩺", "Sistem"],
    updates: ["🎀", "Pembaruan"],
    settings: ["⚙️", "Pengaturan"]
  };

  const MORE_FEATURES = [
    ["budgets", "🎯", "Anggaran", "Total dan per kategori"],
    ["goals", "🌱", "Target tabungan", "Pantau progres impian"],
    ["subscriptions", "🔔", "Tagihan berkala", "Jadwal dan pengingat"],
    ["calendar", "🗓️", "Kalender", "Arus uang per tanggal"],
    ["categories", "🏷️", "Kategori & tag", "Ikon, warna, grup"],
    ["debts", "🧮", "Utang & piutang", "Cicilan dan strategi lunas"],
    ["investments", "📈", "Investasi", "Nilai aset dan dividen"],
    ["shared", "👨‍👩‍👧", "Buku keluarga", "Anggota dan persetujuan"],
    ["tools", "📦", "Backup & import", "Excel, CSV, PDF, OCR"],
    ["system", "🩺", "Pusat sistem", "Audit, cleanup, push"],
    ["updates", "🎀", "Catatan versi", "Perubahan terbaru"],
    ["settings", "⚙️", "Pengaturan", "PIN, cloud, tema, kurs"]
  ];

  const safeNumberV13 = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const nowIsoV13 = () => new Date().toISOString();
  const normalizeV13 = (value) => String(value || "").trim().toLocaleLowerCase("id-ID");

  function ensureV13State() {
    if (!state) return false;
    let changed = false;
    state.settings ||= {};
    state.settings.migrationHistory ||= [];

    const defaults = {
      activeBookId: BOOK_ALL,
      cuteAppearance: true,
      compactMobileNavigation: true,
      quickCalculator: true,
      calendarMode: "total",
      searchHistory: [],
      bookOverviewVersion: VERSION
    };
    Object.entries(defaults).forEach(([key, value]) => {
      if (state.settings[key] === undefined) {
        state.settings[key] = value;
        changed = true;
      }
    });
    if (safeNumberV13(state.settings.lastSeenChangelogVersion) < VERSION) {
      state.settings.lastSeenChangelogVersion = VERSION;
      changed = true;
    }

    (state.profiles || []).forEach((profile, index) => {
      if (!profile.icon) {
        profile.icon = profile.type === "business" ? "🏪" : index === 0 ? "🏡" : "📒";
        changed = true;
      }
      if (!profile.baseCurrency) { profile.baseCurrency = state.settings.baseCurrency; changed = true; }
      if (!profile.weekStartsOn) { profile.weekStartsOn = "monday"; changed = true; }
      if (!profile.monthStartsOn) { profile.monthStartsOn = 1; changed = true; }
    });

    (state.budgets || []).forEach((budget) => {
      if (!Array.isArray(budget.categories)) { budget.categories = [budget.category || "Lainnya"]; changed = true; }
      if (!budget.scopeMode) { budget.scopeMode = "include"; changed = true; }
      if (!budget.purpose) { budget.purpose = "control"; changed = true; }
      if (!budget.periodEvery) { budget.periodEvery = 1; changed = true; }
      if (budget.showInOverview === undefined) { budget.showInOverview = true; changed = true; }
      if (budget.notificationsEnabled === undefined) { budget.notificationsEnabled = true; changed = true; }
      if (!budget.rolloverCap) { budget.rolloverCap = 0; changed = true; }
    });

    (state.goals || []).forEach((goal) => {
      if (!Array.isArray(goal.contributions)) { goal.contributions = []; changed = true; }
      if (!goal.planType) { goal.planType = "flexible"; changed = true; }
      if (!goal.frequency) { goal.frequency = "monthly"; changed = true; }
      if (goal.reminderEnabled === undefined) { goal.reminderEnabled = false; changed = true; }
      if (!Array.isArray(goal.reminderDays)) { goal.reminderDays = [7, 1, 0]; changed = true; }
    });

    ACCOUNT_TYPES.virtual ||= { label: "Akun Virtual", icon: "🪙", liability: false };
    ACCOUNT_TYPES.deposit ||= { label: "Deposito", icon: "🏛️", liability: false };
    ACCOUNT_TYPES.crypto ||= { label: "Aset Kripto", icon: "₿", liability: false };

    state.categoryCatalog ||= [];
    const activeProfileId = window.activeFinancialUserId?.()
      || state.settings.activeFinancialUserId
      || state.settings.activeBookId
      || state.profiles?.[0]?.id
      || "";
    const activeCatalog = state.categoryCatalog.filter((item) => !item.profileId || item.profileId === activeProfileId);
    const names = new Set(activeCatalog.map((item) => normalizeV13(item.name)));
    EXTRA_CATEGORIES.forEach(([name, icon, color, type, parent], index) => {
      if (names.has(normalizeV13(name))) return;
      state.categoryCatalog.push({
        id: `v13-category-${index + 1}`,
        builtinKey: null,
        name,
        icon,
        color,
        type,
        parent,
        archived: false,
        pinned: index < 8,
        order: state.categoryCatalog.length,
        createdAt: nowIsoV13(),
        updatedAt: nowIsoV13(),
        profileId: activeProfileId
      });
      CATEGORIES[name] = { icon, color, type };
      names.add(normalizeV13(name));
      changed = true;
    });

    state.appVersion = Math.max(safeNumberV13(state.appVersion), VERSION);
    if (!state.settings.migrationHistory.some((item) => Number(item.version) === VERSION)) {
      state.settings.migrationHistory.unshift({
        version: VERSION,
        label: VERSION_LABEL,
        migratedAt: nowIsoV13(),
        status: "success"
      });
      state.settings.migrationHistory = state.settings.migrationHistory.slice(0, 30);
      changed = true;
    }
    return changed;
  }

  function activeBookId() {
    const selected = state?.settings?.activeBookId || BOOK_ALL;
    return selected === BOOK_ALL || state?.profiles?.some((item) => item.id === selected)
      ? selected
      : BOOK_ALL;
  }

  function activeBook() {
    return state?.profiles?.find((item) => item.id === activeBookId()) || null;
  }

  function belongsToBook(item) {
    const selected = activeBookId();
    if (selected === BOOK_ALL) return true;
    return !item?.profileId || item.profileId === selected;
  }

  function bookTransactions() {
    return (state?.transactions || []).filter(belongsToBook);
  }

  function bookAccounts() {
    return (state?.accounts || []).filter(belongsToBook);
  }

  function isCurrentMonth(dateValue, offset = 0) {
    const target = new Date();
    target.setMonth(target.getMonth() + offset);
    const date = new Date(`${dateValue}T00:00:00`);
    return date.getMonth() === target.getMonth() && date.getFullYear() === target.getFullYear();
  }

  function bookMonthTransactions(offset = 0) {
    return bookTransactions().filter((item) => isCurrentMonth(item.date, offset));
  }

  function bookTotals(offset = 0) {
    return bookMonthTransactions(offset).reduce((result, tx) => {
      if (tx.type === "transfer" || tx.status === "cancelled") return result;
      const value = transactionBaseValue(tx);
      if (tx.type === "income") result.income += value;
      if (tx.type === "expense") result.expense += value;
      return result;
    }, { income: 0, expense: 0 });
  }

  function bookBalance() {
    return bookAccounts().reduce((sum, account) => {
      const value = accountValueInBase(account);
      return sum + (account.liability ? -value : value);
    }, 0);
  }

  function bookCategoryTotals() {
    const totals = new Map();
    bookMonthTransactions().filter((tx) => tx.type === "expense" && tx.status !== "cancelled").forEach((tx) => {
      if (tx.splits?.length) {
        tx.splits.forEach((split) => {
          totals.set(split.category, (totals.get(split.category) || 0) + transactionBaseValue(tx, split.amount));
        });
      } else {
        totals.set(tx.category || "Lainnya", (totals.get(tx.category || "Lainnya") || 0) + transactionBaseValue(tx));
      }
    });
    return [...totals.entries()].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
  }

  function bookBudgetSpent(budget) {
    const { start, end } = budgetPeriodBounds(budget);
    return bookTransactions().reduce((sum, tx) => {
      const txDate = new Date(`${tx.date}T00:00:00`);
      if (tx.type !== "expense" || tx.status === "cancelled" || txDate < start || txDate > end) return sum;
      const accountIds = budget.accountIds?.length ? budget.accountIds : budget.accountId ? [budget.accountId] : [];
      if (accountIds.length && !accountIds.includes(tx.accountId)) return sum;
      if (budget.tag && !tx.tags?.some((tag) => normalizeV13(tag) === normalizeV13(budget.tag))) return sum;
      let amount = 0;
      const categories = budget.categories?.length ? budget.categories : [budget.category || "Lainnya"];
      const categoryMatches = (category) => budget.scopeMode === "exclude" ? !categories.includes(category) : categories.includes(category);
      if (tx.splits?.length) amount = tx.splits.filter((split) => categoryMatches(split.category)).reduce((total, split) => total + safeNumberV13(split.amount), 0);
      else if (categoryMatches(tx.category)) amount = safeNumberV13(tx.amount);
      return sum + (convertCurrency(amount, tx.currency, budget.currency) || 0);
    }, 0);
  }

  function budgetPeriodBounds(budget) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    const every = Math.max(1, safeNumberV13(budget?.periodEvery) || 1);
    if (budget?.period === "custom" && budget.customStart) {
      const customStart = new Date(`${budget.customStart}T00:00:00`);
      const customEnd = budget.customEnd ? new Date(`${budget.customEnd}T23:59:59`) : end;
      return { start: customStart, end: customEnd };
    }
    if (budget?.period === "daily") start.setHours(0, 0, 0, 0);
    else if (budget?.period === "weekly") {
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1 - ((every - 1) * 7));
      start.setHours(0, 0, 0, 0);
    } else if (budget?.period === "yearly") {
      start.setFullYear(start.getFullYear() - every + 1, 0, 1);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setMonth(start.getMonth() - every + 1, 1);
      start.setHours(0, 0, 0, 0);
    }
    return { start, end };
  }

  function monthLabel() {
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date());
  }

  function trendBars() {
    const values = [];
    for (let offset = -5; offset <= 0; offset += 1) {
      const totals = bookTotals(offset);
      values.push({ offset, value: totals.income - totals.expense });
    }
    const max = Math.max(...values.map((item) => Math.abs(item.value)), 1);
    return values.map((item) => {
      const height = Math.max(12, Math.round((Math.abs(item.value) / max) * 62));
      const date = new Date();
      date.setMonth(date.getMonth() + item.offset);
      const label = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date);
      return `<span class="cute-trend-bar ${item.value < 0 ? "negative" : "positive"}" style="--bar-height:${height}px" title="${escapeHTML(label)} · ${escapeHTML(formatCurrency(item.value))}"><i></i><small>${escapeHTML(label)}</small></span>`;
    }).join("");
  }

  function bookRailHtml() {
    const selected = activeBookId();
    const profiles = state?.profiles || [];
    return `
      <div class="cute-book-row" role="tablist" aria-label="Pilih akun keuangan">
        <button class="cute-book ${selected === BOOK_ALL ? "active" : ""}" data-cute-book="${BOOK_ALL}" type="button">
          <span class="cute-illustration">📚</span><b>Semua</b><small>Gabungan</small>
        </button>
        ${profiles.map((book) => `
          <button class="cute-book ${selected === book.id ? "active" : ""}" data-cute-book="${book.id}" type="button">
            <span class="cute-illustration" style="--book-color:${book.color || "#ef5d93"}">${escapeHTML(book.icon || "📒")}</span>
            <b>${escapeHTML(book.name)}</b><small>${(book.members || []).length} anggota</small>
          </button>
        `).join("")}
        <button class="cute-book cute-add-book" data-cute-add-book type="button">
          <span class="cute-illustration">＋</span><b>Akun baru</b><small>Tambah ruang</small>
        </button>
      </div>`;
  }

  function quickActionsHtml() {
    return `
      <div class="cute-quick-actions" aria-label="Aksi cepat">
        <button data-cute-add-type="expense" type="button"><span>🛍️</span><b>Pengeluaran</b></button>
        <button data-cute-add-type="income" type="button"><span>💰</span><b>Pemasukan</b></button>
        <button data-cute-add-type="transfer" type="button"><span>💳</span><b>Transfer</b></button>
        <button data-cute-section="calendar" type="button"><span>🗓️</span><b>Kalender</b></button>
      </div>`;
  }

  function budgetCardHtml() {
    const budgets = (state?.budgets || []).filter(belongsToBook);
    if (!budgets.length) {
      return `<article class="cute-soft-card cute-empty-card"><span>🎯</span><div><b>Belum ada anggaran</b><small>Buat batas belanja agar tetap terkendali.</small></div><button data-cute-section="budgets" type="button">Buat</button></article>`;
    }
    const spent = budgets.reduce((sum, item) => sum + (convertCurrency(bookBudgetSpent(item), item.currency, state.settings.baseCurrency) || 0), 0);
    const limit = budgets.reduce((sum, item) => sum + (convertCurrency(safeNumberV13(item.limit) + (item.rollover ? safeNumberV13(item.rolloverAmount) : 0), item.currency, state.settings.baseCurrency) || 0), 0);
    const percent = limit > 0 ? Math.min((spent / limit) * 100, 160) : 0;
    return `
      <article class="cute-budget-card" data-cute-section="budgets">
        <div class="cute-budget-icon">🍩</div>
        <div class="cute-budget-copy">
          <span><b>Anggaran ${escapeHTML(monthLabel())}</b><em>${percent.toFixed(0)}%</em></span>
          <div class="cute-progress"><i style="width:${Math.min(percent, 100)}%"></i></div>
          <small><strong class="money">${formatCurrency(spent)}</strong> terpakai dari <strong class="money">${formatCurrency(limit)}</strong></small>
        </div>
      </article>`;
  }

  function goalsHtml() {
    const goals = (state?.goals || []).filter(belongsToBook).slice(0, 5);
    if (!goals.length) return `<article class="cute-goal cute-add-goal" data-cute-section="goals"><span>🌱</span><b>Target baru</b><small>Mulai menabung</small></article>`;
    return goals.map((goal) => {
      const saved = goalSaved(goal);
      const percent = safeNumberV13(goal.targetAmount) > 0 ? Math.min((saved / safeNumberV13(goal.targetAmount)) * 100, 100) : 0;
      return `<article class="cute-goal" data-cute-section="goals" style="--goal-color:${goal.color || "#ef5d93"}"><span>${escapeHTML(goal.icon || "🌱")}</span><b>${escapeHTML(goal.name)}</b><small class="money">${formatCurrency(saved, goal.currency)}</small><div class="cute-progress"><i style="width:${percent}%"></i></div><em>${percent.toFixed(0)}%</em></article>`;
    }).join("");
  }

  function recentTransactionsHtml() {
    const items = [...bookTransactions()].sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);
    if (!items.length) return `<div class="cute-empty-list"><span>📝</span><b>Belum ada transaksi</b><small>Ketuk tombol pensil untuk mulai mencatat.</small></div>`;
    return items.map((tx) => {
      const meta = CATEGORIES[tx.category] || CATEGORIES.Lainnya || { icon: "✨", color: "#8c8ca1" };
      const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "−" : "↔";
      const tone = tx.type === "income" ? "positive" : tx.type === "expense" ? "negative" : "transfer";
      const profile = state.profiles.find((item) => item.id === tx.profileId);
      return `<button class="cute-transaction" data-edit-transaction="${tx.id}" type="button"><span class="cute-transaction-icon" style="--tx-color:${meta.color}">${tx.type === "transfer" ? "💳" : meta.icon}</span><span><b>${escapeHTML(tx.description)}</b><small>${escapeHTML(tx.merchant || profile?.name || tx.category || "Transaksi")} ${tx.tags?.length ? `· #${tx.tags.slice(0, 2).map(escapeHTML).join(" #")}` : ""}</small></span><span class="${tone} money"><b>${sign}${formatCurrency(tx.amount, tx.currency)}</b><small>${formatDate(tx.date)}</small></span></button>`;
    }).join("");
  }

  function categoryRingHtml() {
    const categories = bookCategoryTotals().slice(0, 6);
    const total = categories.reduce((sum, item) => sum + item.amount, 0);
    if (!categories.length || total <= 0) return `<div class="cute-empty-list compact"><span>🍩</span><b>Analisis menunggu data</b><small>Kategori akan dirangkum otomatis.</small></div>`;
    let cursor = 0;
    const stops = categories.map((item) => {
      const start = cursor;
      cursor += (item.amount / total) * 100;
      return `${CATEGORIES[item.category]?.color || "#b0a7b5"} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
    });
    return `<div class="cute-category-analysis"><div class="cute-donut" style="background:conic-gradient(${stops.join(",")})"><span><small>Pengeluaran</small><b class="money">${formatCurrency(total)}</b></span></div><div class="cute-category-legend">${categories.slice(0, 4).map((item) => `<button data-cute-section="reports" type="button"><i style="background:${CATEGORIES[item.category]?.color || "#b0a7b5"}"></i><span>${escapeHTML(CATEGORIES[item.category]?.icon || "✨")} ${escapeHTML(item.category)}</span><b>${((item.amount / total) * 100).toFixed(0)}%</b></button>`).join("")}</div></div>`;
  }

  function renderCuteDashboard() {
    const root = document.getElementById("cuteDashboardExperience");
    if (!root || !state) return;
    const book = activeBook();
    const totals = bookTotals();
    const balance = bookBalance();
    root.innerHTML = `
      <section class="cute-home">
        <header class="cute-home-heading"><div><span class="cute-kicker">AKUN KEUANGAN</span><h3>${escapeHTML(book?.name || "Akun Keuangan")}</h3><p>Pilih akun agar uang pribadi, pasangan, keluarga, dan setiap usaha tetap terpisah.</p></div><button class="cute-privacy-button" data-cute-privacy type="button" title="Sembunyikan nominal">👁️</button></header>
        ${bookRailHtml()}
        <div class="cute-dashboard-grid">
          <article class="cute-balance-card">
            <div class="cute-balance-main"><span>Saldo bersih</span><strong class="money">${formatCurrency(balance)}</strong><small>${escapeHTML(monthLabel())} · cloud tersimpan otomatis</small></div>
            <div class="cute-trend" aria-label="Tren surplus enam bulan">${trendBars()}</div>
            <div class="cute-balance-stats"><button data-cute-section="transactions" type="button"><span>Pengeluaran</span><b class="negative money">${formatCurrency(totals.expense)}</b></button><button data-cute-section="transactions" type="button"><span>Pemasukan</span><b class="positive money">${formatCurrency(totals.income)}</b></button><button data-cute-section="reports" type="button"><span>Selisih</span><b class="${totals.income - totals.expense >= 0 ? "positive" : "negative"} money">${formatCurrency(totals.income - totals.expense)}</b></button></div>
          </article>
          <article class="cute-analysis-card"><header><div><span>Ringkasan kategori</span><b>Ke mana uang pergi?</b></div><button data-cute-section="reports" type="button">Lihat detail</button></header>${categoryRingHtml()}</article>
        </div>
        ${quickActionsHtml()}
        ${budgetCardHtml()}
        <div class="cute-section-title"><div><span>🌈</span><b>Target tabungan</b></div><button data-cute-section="goals" type="button">Lihat semua</button></div>
        <div class="cute-goal-row">${goalsHtml()}</div>
        <div class="cute-section-title"><div><span>🧾</span><b>Transaksi terbaru</b></div><button data-cute-section="transactions" type="button">Lihat semua</button></div>
        <div class="cute-transaction-list">${recentTransactionsHtml()}</div>
      </section>`;
  }

  function renderMoreHub() {
    const hub = document.getElementById("cuteMoreHub");
    if (!hub) return;
    hub.innerHTML = `
      <article class="cute-more-intro"><div><span class="cute-kicker">PUSAT FITUR</span><h3>Semua kebutuhan keuangan dalam satu tempat.</h3><p>Fitur Money Cute yang relevan sudah dipadukan dengan keamanan, cloud sync, OCR, utang, investasi, dan otomasi milik CHARISNA.</p></div><span class="cute-more-mascot">✨</span></article>
      <div class="cute-feature-grid">${MORE_FEATURES.map(([section, icon, title, detail]) => `<button data-cute-section="${section}" type="button"><span>${icon}</span><b>${title}</b><small>${detail}</small><i>›</i></button>`).join("")}</div>`;
  }

  function renderAccountSummary() {
    const root = document.getElementById("cuteAccountSummary");
    if (!root || !state) return;
    const scopedAccounts = financialItems(state.accounts);
    const assets = scopedAccounts.filter((item) => !item.liability).reduce((sum, item) => sum + accountValueInBase(item), 0);
    const liabilities = scopedAccounts.filter((item) => item.liability).reduce((sum, item) => sum + accountValueInBase(item), 0);
    root.innerHTML = `<article><span>🌸 Total aset</span><b class="money positive">${formatCurrency(assets)}</b><small>${scopedAccounts.filter((item) => !item.liability).length} akun aset</small></article><article><span>💳 Kewajiban</span><b class="money negative">${formatCurrency(liabilities)}</b><small>${scopedAccounts.filter((item) => item.liability).length} akun kewajiban</small></article><article><span>✨ Kekayaan bersih</span><b class="money">${formatCurrency(assets - liabilities)}</b><small>Khusus akun keuangan aktif</small></article>`;
  }

  function renderAnalysisHero() {
    const root = document.getElementById("cuteAnalysisHero");
    if (!root || !state) return;
    const totals = bookTotals();
    const savingRate = totals.income > 0 ? ((totals.income - totals.expense) / totals.income) * 100 : 0;
    root.innerHTML = `<article><span>🍩 Pengeluaran</span><b class="money negative">${formatCurrency(totals.expense)}</b><small>${bookMonthTransactions().filter((item) => item.type === "expense").length} transaksi</small></article><article><span>🪙 Pemasukan</span><b class="money positive">${formatCurrency(totals.income)}</b><small>${bookMonthTransactions().filter((item) => item.type === "income").length} transaksi</small></article><article><span>🌱 Saving rate</span><b class="${savingRate >= 20 ? "positive" : "negative"}">${savingRate.toFixed(1)}%</b><small>${savingRate >= 20 ? "Sehat dan terjaga" : "Targetkan minimal 20%"}</small></article>`;
  }

  function refreshTopbar() {
    const chip = document.getElementById("cutePeriodChip");
    if (chip) chip.textContent = monthLabel();
    const title = document.getElementById("pageTitle");
    if (title && currentSection === "dashboard") title.textContent = `Halo, ${state?.settings?.userName || "Coco"}!`;
    if (!window.v14SystemStatusPatched) {
      const systemBadge = document.querySelector("#system .section-header .version-badge");
      if (systemBadge) systemBadge.textContent = VERSION_LABEL;
      const bannerStrong = document.querySelector("#v10PanelUpdate .v10-update-banner strong");
      if (bannerStrong && !/baru siap/i.test(bannerStrong.textContent)) bannerStrong.textContent = "Aplikasi menggunakan v13";
      const versionCards = document.querySelectorAll("#v10PanelUpdate .v10-stat strong");
      if (versionCards[0]) versionCards[0].textContent = "v13";
      const versionSmall = versionCards[0]?.parentElement?.querySelector("small");
      if (versionSmall) versionSmall.textContent = "Cute Complete · multi-device";
    }
  }

  function injectV13UI() {
    document.documentElement.classList.add("charisna-cute-v13");
    document.querySelectorAll(".auth-brand p, .sidebar-brand p").forEach((item) => { item.textContent = "Catat ringan, rencana matang"; });
    const brandLogos = document.querySelectorAll(".brand-logo");
    brandLogos.forEach((logo) => { logo.textContent = "✿"; logo.setAttribute("aria-label", "CHARISNA"); });

    SECTION_COPY.dashboard = ["Akun Keuangan", "Ringkasan khusus akun keuangan yang sedang aktif."];
    SECTION_COPY.transactions = ["Catatan Transaksi", "Catat pemasukan, pengeluaran, dan transfer lebih cepat."];
    SECTION_COPY.accounts = ["Dompet & Akun", "Tunai, bank, kartu, akun virtual, aset, dan kewajiban."];
    SECTION_COPY.reports = ["Analisis", "Kategori, tag, tren aset, arus kas, dan insight otomatis."];
    SECTION_COPY.tools = ["Lainnya", "Semua fitur lanjutan, backup, otomasi, dan pengaturan."];

    document.querySelectorAll(".navigation .nav-button").forEach((button) => {
      const meta = NAV_META[button.dataset.section];
      if (!meta) return;
      button.innerHTML = `<span>${meta[0]}</span><b>${meta[1]}</b>`;
      if (["dashboard", "transactions", "accounts", "reports", "tools"].includes(button.dataset.section)) button.dataset.cutePrimary = "true";
    });

    const dashboard = document.getElementById("dashboard");
    if (dashboard && !document.getElementById("cuteDashboardExperience")) {
      dashboard.insertAdjacentHTML("afterbegin", '<div id="cuteDashboardExperience"></div>');
    }

    const toolsHeader = document.querySelector("#tools .section-header");
    if (toolsHeader && !document.getElementById("cuteMoreHub")) toolsHeader.insertAdjacentHTML("afterend", '<div id="cuteMoreHub"></div>');

    const accountHeader = document.querySelector("#accounts .section-header");
    if (accountHeader && !document.getElementById("cuteAccountSummary")) accountHeader.insertAdjacentHTML("afterend", '<div class="cute-summary-strip" id="cuteAccountSummary"></div>');

    const reportHeader = document.querySelector("#reports .section-header");
    if (reportHeader && !document.getElementById("cuteAnalysisHero")) reportHeader.insertAdjacentHTML("afterend", '<div class="cute-summary-strip" id="cuteAnalysisHero"></div>');

    const transactionHeader = document.querySelector("#transactions .section-header");
    if (transactionHeader && !document.getElementById("cuteSearchHelp")) transactionHeader.insertAdjacentHTML("afterend", '<div class="cute-search-help" id="cuteSearchHelp"></div>');

    const calendarPanel = document.querySelector("#calendar .panel");
    if (calendarPanel && !document.getElementById("cuteCalendarModes")) calendarPanel.insertAdjacentHTML("beforebegin", '<div class="cute-calendar-modes" id="cuteCalendarModes"><button data-cute-calendar-mode="expense" type="button">🛍️ Pengeluaran</button><button data-cute-calendar-mode="income" type="button">🪙 Pemasukan</button><button data-cute-calendar-mode="total" type="button">✨ Total</button></div>');

    const topbarActions = document.querySelector(".topbar-actions");
    if (topbarActions && !document.getElementById("cutePeriodChip")) topbarActions.insertAdjacentHTML("afterbegin", '<span class="cute-period-chip" id="cutePeriodChip"></span>');

    const addTransaction = document.getElementById("addTransactionButton");
    if (addTransaction) addTransaction.innerHTML = '<span aria-hidden="true">✏️</span> Catat';
    const fab = document.getElementById("proFab");
    if (fab) fab.textContent = "✏️";
    document.getElementById("transactionSearch")?.addEventListener("input", renderTransactionSearchV13);
    document.getElementById("transactionTypeFilter")?.addEventListener("change", renderTransactionSearchV13);
    document.getElementById("transactionSearch")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const value = event.currentTarget.value.trim();
      if (!value) return;
      state.settings.searchHistory = [value, ...(state.settings.searchHistory || []).filter((item) => item !== value)].slice(0, 5);
      encryptState().catch(console.error);
      renderTransactionSearchV13();
    });
    renderMoreHub();
  }

  function categoryRows(type) {
    const activeProfileId = window.activeFinancialUserId?.()
      || state?.settings?.activeFinancialUserId
      || state?.settings?.activeBookId
      || state?.profiles?.[0]?.id
      || "";
    const scopedCatalog = (state?.categoryCatalog || []).filter((item) => !item.profileId || item.profileId === activeProfileId);
    const catalog = scopedCatalog.length
      ? scopedCatalog
      : Object.entries(CATEGORIES).map(([name, meta]) => ({ name, ...meta }));
    return [...catalog]
      .filter((item) => !item.archived && (item.type === type || item.type === "both"))
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || safeNumberV13(a.order) - safeNumberV13(b.order))
      .slice(0, 16);
  }

  function renderQuickCategories(type) {
    const grid = document.getElementById("cuteCategoryGrid");
    if (!grid) return;
    if (type === "transfer") {
      grid.hidden = true;
      return;
    }
    grid.hidden = false;
    const selected = document.getElementById("txCategory")?.value;
    grid.innerHTML = categoryRows(type).map((item) => `<button class="${item.name === selected ? "active" : ""}" data-cute-category="${escapeHTML(item.name)}" type="button" style="--category-color:${item.color || "#ef5d93"}"><span>${escapeHTML(item.icon || "✨")}</span><b>${escapeHTML(item.name)}</b></button>`).join("");
  }

  function enhanceTransactionFormV13(existing = null) {
    const form = document.getElementById("transactionForm");
    if (!form || form.dataset.cuteV13 === "true") return;
    form.dataset.cuteV13 = "true";
    document.querySelector(".modal:has(#transactionForm)")?.classList.add("cute-transaction-modal");
    const formGrid = form.querySelector(".form-grid");
    if (!formGrid) return;

    formGrid.insertAdjacentHTML("beforebegin", `
      <div class="cute-tx-tabs" role="tablist" aria-label="Jenis transaksi">
        <button data-cute-tx-type="expense" type="button"><span>🛍️</span>Pengeluaran</button>
        <button data-cute-tx-type="income" type="button"><span>💰</span>Pemasukan</button>
        <button data-cute-tx-type="transfer" type="button"><span>💳</span>Transfer</button>
      </div>`);

    const typeField = document.getElementById("txType")?.closest(".field");
    if (typeField) typeField.classList.add("cute-native-type-field");
    const amountField = document.getElementById("txAmount")?.closest(".field");
    amountField?.classList.add("cute-amount-field", "full");
    amountField?.insertAdjacentHTML("afterend", `
      <div class="cute-calculator full" id="cuteCalculator" data-expression="">
        <div class="cute-calculator-display"><span>Hitung cepat</span><b id="cuteCalculatorExpression">Ketuk angka atau operator</b><button data-cute-key="clear" type="button">AC</button></div>
        <div class="cute-calculator-grid">
          ${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","back","+","="].map((key) => `<button data-cute-key="${key}" class="${/[÷×−+=]/.test(key) ? "operator" : ""} ${key === "=" ? "equals" : ""}" type="button">${key === "back" ? "⌫" : key}</button>`).join("")}
        </div>
      </div>`);

    const categoryField = document.getElementById("categoryField");
    categoryField?.classList.add("full", "cute-category-select-field");
    categoryField?.insertAdjacentHTML("afterend", '<div class="cute-category-grid full" id="cuteCategoryGrid"></div>');

    const advancedIds = ["txMerchant", "txStatus", "txProfile", "txTags", "txNotes", "txDeductible", "txReconciled", "splitSection", "txAttachment"];
    const advancedNodes = [];
    advancedIds.forEach((id) => {
      const element = document.getElementById(id);
      const node = id === "splitSection" ? element : element?.closest(".field");
      if (node && !advancedNodes.includes(node)) advancedNodes.push(node);
    });
    if (advancedNodes.length) {
      const details = document.createElement("details");
      details.className = "cute-advanced-fields full";
      details.open = Boolean(existing) || window.innerWidth >= 1000;
      details.innerHTML = '<summary><span>✨ Detail tambahan</span><small>Merchant, profil, tag, catatan, split, dan lampiran</small></summary><div class="cute-advanced-grid"></div>';
      const actions = form.querySelector(".form-actions");
      form.insertBefore(details, actions);
      const inner = details.querySelector(".cute-advanced-grid");
      advancedNodes.forEach((node) => inner.appendChild(node));
    }

    const syncTabs = () => {
      const type = document.getElementById("txType")?.value || "expense";
      form.querySelectorAll("[data-cute-tx-type]").forEach((button) => button.classList.toggle("active", button.dataset.cuteTxType === type));
      renderQuickCategories(type);
    };
    document.getElementById("txType")?.addEventListener("change", () => window.setTimeout(syncTabs, 0));
    document.getElementById("txCategory")?.addEventListener("change", () => renderQuickCategories(document.getElementById("txType")?.value || "expense"));
    syncTabs();
  }

  function evaluateExpression(raw) {
    const cleaned = String(raw || "").replaceAll("×", "*").replaceAll("÷", "/").replaceAll("−", "-").replace(/[^0-9.+\-*/]/g, "");
    const tokens = cleaned.match(/(?:\d+(?:\.\d*)?|\.\d+|[+\-*/])/g) || [];
    if (!tokens.length || /[+\-*/]/.test(tokens[tokens.length - 1])) return null;
    const values = tokens.map((token) => /[+\-*/]/.test(token) ? token : Number(token));
    if (typeof values[0] !== "number") return null;
    for (let index = 1; index < values.length - 1;) {
      const op = values[index];
      if (op === "*" || op === "/") {
        const left = Number(values[index - 1]);
        const right = Number(values[index + 1]);
        if (!Number.isFinite(right) || (op === "/" && right === 0)) return null;
        values.splice(index - 1, 3, op === "*" ? left * right : left / right);
        index = 1;
      } else index += 2;
    }
    let result = Number(values[0]);
    for (let index = 1; index < values.length; index += 2) {
      const right = Number(values[index + 1]);
      result = values[index] === "+" ? result + right : result - right;
    }
    return Number.isFinite(result) ? Math.max(result, 0) : null;
  }

  function handleCalculatorKey(key) {
    const calculator = document.getElementById("cuteCalculator");
    const amountInput = document.getElementById("txAmount");
    const display = document.getElementById("cuteCalculatorExpression");
    if (!calculator || !amountInput || !display) return;
    let expression = calculator.dataset.expression || "";
    if (key === "clear") expression = "";
    else if (key === "back") expression = expression.slice(0, -1);
    else if (key === "=") {
      const result = evaluateExpression(expression || amountInput.value);
      if (result === null) return showToast("Perhitungan belum lengkap.", "🧮");
      amountInput.value = String(Math.round((result + Number.EPSILON) * 100) / 100);
      amountInput.dispatchEvent(new Event("input", { bubbles: true }));
      expression = String(amountInput.value);
    } else {
      const normalizedKey = key === "×" ? "×" : key === "÷" ? "÷" : key === "−" ? "−" : key;
      const isOperator = /[+×÷−]/.test(normalizedKey);
      if (isOperator && (!expression || /[+×÷−.]$/.test(expression))) return;
      if (normalizedKey === "." && expression.split(/[+×÷−]/).at(-1).includes(".")) return;
      expression += normalizedKey;
      const result = evaluateExpression(expression);
      if (result !== null && !/[+×÷−]$/.test(expression)) {
        amountInput.value = String(Math.round((result + Number.EPSILON) * 100) / 100);
        amountInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    calculator.dataset.expression = expression;
    display.textContent = expression || "Ketuk angka atau operator";
  }

  function periodLabel(period) {
    return ({ daily: "Harian", weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan", custom: "Kustom" })[period] || "Bulanan";
  }

  function effectiveBudgetLimit(budget) {
    const rollover = budget.rollover ? safeNumberV13(budget.rolloverAmount) : 0;
    const cap = safeNumberV13(budget.rolloverCap);
    return safeNumberV13(budget.limit) + (cap > 0 ? Math.min(rollover, cap) : rollover);
  }

  function renderAdvancedBudgets() {
    const root = document.getElementById("budgetGrid");
    if (!root || !state) return;
    const budgets = (state.budgets || []).filter(belongsToBook);
    root.innerHTML = budgets.length ? budgets.map((budget) => {
      const spent = bookBudgetSpent(budget);
      const limit = effectiveBudgetLimit(budget);
      const percent = limit > 0 ? (spent / limit) * 100 : 0;
      const left = limit - spent;
      const categories = budget.categories?.length ? budget.categories : [budget.category || "Lainnya"];
      const scope = `${budget.scopeMode === "exclude" ? "Kecuali" : "Kategori"}: ${categories.join(", ")}`;
      return `<article class="budget-card cute-complete-budget ${percent >= 100 ? "over-budget" : ""}" style="--budget-color:${budget.color || "#ee5d92"}">
        <div class="card-top"><div><span class="badge">${periodLabel(budget.period)}${safeNumberV13(budget.periodEvery) > 1 ? ` × ${safeNumberV13(budget.periodEvery)}` : ""}</span><h4>${escapeHTML(budget.name)}</h4></div><strong>${percent.toFixed(0)}%</strong></div>
        <p class="muted">${escapeHTML(scope)}</p>
        <div class="cute-budget-flags"><span>${budget.purpose === "saving" ? "🌱 Target simpan" : "🛡️ Kontrol belanja"}</span>${budget.rollover ? "<span>↻ Rollover</span>" : ""}${budget.notificationsEnabled ? "<span>🔔 Aktif</span>" : ""}</div>
        <div class="progress-track"><div class="progress-bar" style="width:${Math.min(percent, 100)}%;background:${percent >= 100 ? "#ef5c67" : budget.color || "#ee5d92"}"></div></div>
        <div class="progress-meta"><span class="money">${formatCurrency(spent, budget.currency)}</span><span class="money">dari ${formatCurrency(limit, budget.currency)}</span></div>
        <div class="cute-budget-daily"><span>Sisa <b class="money ${left < 0 ? "negative" : ""}">${formatCurrency(left, budget.currency)}</b></span><span>Patokan/hari <b class="money">${formatCurrency(Math.max(left, 0) / Math.max(1, 30 - new Date().getDate() + 1), budget.currency)}</b></span></div>
        <div class="card-bottom"><small>${budget.accountIds?.length || budget.accountId ? "Akun terpilih" : "Semua akun"}${budget.tag ? ` · #${escapeHTML(budget.tag)}` : ""}</small><button class="mini-button" data-edit-budget="${budget.id}" type="button">✏️</button></div>
      </article>`;
    }).join("") : emptyState("🎯", "Belum ada anggaran. Buat batas harian, mingguan, bulanan, tahunan, atau kustom.");
  }

  function renderAdvancedGoals() {
    const root = document.getElementById("goalGrid");
    if (!root || !state) return;
    const goals = (state.goals || []).filter(belongsToBook);
    root.innerHTML = goals.length ? goals.map((goal) => {
      const saved = goalSaved(goal);
      const percentage = safeNumberV13(goal.targetAmount) > 0 ? (saved / safeNumberV13(goal.targetAmount)) * 100 : 0;
      const planLabel = goal.planType === "weekly52" ? "Tantangan 52 minggu" : goal.planType === "recurring" ? `Setoran ${goal.frequency === "weekly" ? "mingguan" : "bulanan"}` : "Setoran fleksibel";
      return `<article class="goal-card cute-complete-goal" style="--goal-color:${goal.color || "#65c6b5"}">
        <div class="card-top"><div class="card-icon">${escapeHTML(goal.icon || "🌱")}</div><span class="badge">${formatDate(goal.targetDate)}</span></div>
        <h4>${escapeHTML(goal.name)}</h4><p class="cute-goal-plan">${escapeHTML(planLabel)} ${goal.reminderEnabled ? "· 🔔" : ""}</p>
        <strong class="money">${formatCurrency(saved, goal.currency)}</strong><p class="muted money">Target ${formatCurrency(goal.targetAmount, goal.currency)}</p>
        <div class="progress-track"><div class="progress-bar" style="width:${Math.min(percentage, 100)}%;background:${goal.color || "#65c6b5"}"></div></div>
        <div class="progress-meta"><span>${percentage.toFixed(1)}%</span><span class="money">${formatCurrency(Math.max(safeNumberV13(goal.targetAmount) - saved, 0), goal.currency)} lagi</span></div>
        <div class="card-bottom"><button class="button secondary" data-contribute-goal="${goal.id}" type="button">＋ Setoran</button><button class="mini-button" data-edit-goal="${goal.id}" type="button">✏️</button></div>
      </article>`;
    }).join("") : emptyState("🌱", "Belum ada target tabungan atau tantangan 52 minggu.");
  }

  function mergeExtrasAfterBaseSave(collectionName, existing, matcher, extras, action) {
    const rows = state?.[collectionName] || [];
    const target = existing ? rows.find((item) => item.id === existing.id) : [...rows].reverse().find(matcher);
    if (!target) return;
    Object.assign(target, extras, { updatedAt: nowIsoV13() });
    addAudit(action, target.name || target.description || "Detail lanjutan");
    window.setTimeout(async () => {
      await encryptState();
      renderAll();
    }, 120);
  }

  function enhanceBudgetFormV13(existing = null) {
    const form = document.getElementById("budgetForm");
    if (!form || form.dataset.cuteV13 === "true") return;
    form.dataset.cuteV13 = "true";
    document.querySelector(".modal:has(#budgetForm)")?.classList.add("cute-feature-modal");
    const period = document.getElementById("budgetPeriod");
    if (period) {
      if (!period.querySelector('[value="daily"]')) period.insertAdjacentHTML("afterbegin", `<option value="daily" ${existing?.period === "daily" ? "selected" : ""}>Harian</option>`);
      if (!period.querySelector('[value="custom"]')) period.insertAdjacentHTML("beforeend", `<option value="custom" ${existing?.period === "custom" ? "selected" : ""}>Tanggal kustom</option>`);
    }
    const grid = form.querySelector(".form-grid");
    const actions = form.querySelector(".form-actions");
    actions?.insertAdjacentHTML("beforebegin", `<details class="cute-advanced-fields full" open><summary><span>✨ Pengaturan anggaran lengkap</span><small>Lingkup, rollover, periode, dan pengingat</small></summary><div class="cute-advanced-grid">
      <label class="field"><span>Setiap berapa periode</span><input class="input" id="budgetPeriodEvery" type="number" min="1" max="24" value="${safeNumberV13(existing?.periodEvery) || 1}"></label>
      <label class="field"><span>Tujuan</span><select class="input" id="budgetPurpose"><option value="control" ${existing?.purpose !== "saving" ? "selected" : ""}>Kontrol pengeluaran</option><option value="saving" ${existing?.purpose === "saving" ? "selected" : ""}>Target menabung</option></select></label>
      <label class="field"><span>Tanggal mulai kustom</span><input class="input" id="budgetCustomStart" type="date" value="${existing?.customStart || localISO()}"></label>
      <label class="field"><span>Tanggal akhir kustom</span><input class="input" id="budgetCustomEnd" type="date" value="${existing?.customEnd || dayOffset(30)}"></label>
      <label class="field"><span>Mode kategori</span><select class="input" id="budgetScopeMode"><option value="include" ${existing?.scopeMode !== "exclude" ? "selected" : ""}>Hanya kategori terpilih</option><option value="exclude" ${existing?.scopeMode === "exclude" ? "selected" : ""}>Semua kecuali terpilih</option></select></label>
      <label class="field"><span>Kategori tambahan (pisahkan koma)</span><input class="input" id="budgetCategories" value="${escapeHTML((existing?.categories || [existing?.category].filter(Boolean)).join(", "))}" placeholder="Makanan, Harian, Transportasi"></label>
      <label class="field"><span>Maksimum rollover (0 = bebas)</span><input class="input" id="budgetRolloverCap" type="number" min="0" step="any" value="${safeNumberV13(existing?.rolloverCap)}"></label>
      <label class="field"><span>Level peringatan (%)</span><input class="input" id="budgetAlertLevels" value="${escapeHTML((existing?.alertLevels || [50,75,90,100]).join(", "))}"></label>
      <label class="simple-item"><span>Tampilkan di ringkasan akun</span><input id="budgetShowOverview" type="checkbox" ${existing?.showInOverview !== false ? "checked" : ""}></label>
      <label class="simple-item"><span>Notifikasi anggaran</span><input id="budgetNotifications" type="checkbox" ${existing?.notificationsEnabled !== false ? "checked" : ""}></label>
    </div></details>`);
    grid?.classList.add("cute-core-fields");
    form.addEventListener("submit", () => {
      const name = document.getElementById("budgetName")?.value.trim();
      const profileId = document.getElementById("budgetProfile")?.value;
      const primary = document.getElementById("budgetCategory")?.value;
      const extraCategories = (document.getElementById("budgetCategories")?.value || "").split(",").map((item) => item.trim()).filter(Boolean);
      const categories = [...new Set([primary, ...extraCategories].filter(Boolean))];
      mergeExtrasAfterBaseSave("budgets", existing, (item) => item.name === name && item.profileId === profileId, {
        periodEvery: Math.max(1, safeNumberV13(document.getElementById("budgetPeriodEvery")?.value) || 1),
        purpose: document.getElementById("budgetPurpose")?.value || "control",
        customStart: document.getElementById("budgetCustomStart")?.value || "",
        customEnd: document.getElementById("budgetCustomEnd")?.value || "",
        scopeMode: document.getElementById("budgetScopeMode")?.value || "include",
        categories,
        rolloverCap: safeNumberV13(document.getElementById("budgetRolloverCap")?.value),
        alertLevels: (document.getElementById("budgetAlertLevels")?.value || "").split(",").map(Number).filter((item) => item > 0 && item <= 200),
        showInOverview: document.getElementById("budgetShowOverview")?.checked !== false,
        notificationsEnabled: document.getElementById("budgetNotifications")?.checked !== false
      }, "Detail anggaran v13 disimpan");
    });
  }

  function enhanceGoalFormV13(existing = null) {
    const form = document.getElementById("goalForm");
    if (!form || form.dataset.cuteV13 === "true") return;
    form.dataset.cuteV13 = "true";
    document.querySelector(".modal:has(#goalForm)")?.classList.add("cute-feature-modal");
    const actions = form.querySelector(".form-actions");
    actions?.insertAdjacentHTML("beforebegin", `<details class="cute-advanced-fields full" open><summary><span>🌈 Rencana menabung</span><small>Fleksibel, rutin, atau tantangan 52 minggu</small></summary><div class="cute-advanced-grid">
      <label class="field"><span>Jenis rencana</span><select class="input" id="goalPlanType"><option value="flexible" ${existing?.planType !== "recurring" && existing?.planType !== "weekly52" ? "selected" : ""}>Fleksibel</option><option value="recurring" ${existing?.planType === "recurring" ? "selected" : ""}>Setoran rutin</option><option value="weekly52" ${existing?.planType === "weekly52" ? "selected" : ""}>Tantangan 52 minggu</option></select></label>
      <label class="field"><span>Frekuensi setoran</span><select class="input" id="goalFrequency"><option value="weekly" ${existing?.frequency === "weekly" ? "selected" : ""}>Mingguan</option><option value="monthly" ${existing?.frequency !== "weekly" ? "selected" : ""}>Bulanan</option></select></label>
      <label class="field"><span>Nominal setoran rencana</span><input class="input" id="goalRecurringAmount" type="number" min="0" step="any" value="${safeNumberV13(existing?.recurringAmount)}"></label>
      <label class="field"><span>Hari pengingat</span><input class="input" id="goalReminderDays" value="${escapeHTML((existing?.reminderDays || [7,1,0]).join(", "))}" placeholder="7, 1, 0"></label>
      <label class="simple-item"><span>Aktifkan pengingat target</span><input id="goalReminderEnabled" type="checkbox" ${existing?.reminderEnabled ? "checked" : ""}></label>
    </div></details>`);
    form.addEventListener("submit", () => {
      const name = document.getElementById("goalName")?.value.trim();
      const profileId = document.getElementById("goalProfile")?.value;
      mergeExtrasAfterBaseSave("goals", existing, (item) => item.name === name && item.profileId === profileId, {
        planType: document.getElementById("goalPlanType")?.value || "flexible",
        frequency: document.getElementById("goalFrequency")?.value || "monthly",
        recurringAmount: safeNumberV13(document.getElementById("goalRecurringAmount")?.value),
        reminderEnabled: Boolean(document.getElementById("goalReminderEnabled")?.checked),
        reminderDays: (document.getElementById("goalReminderDays")?.value || "").split(",").map(Number).filter((item) => item >= 0 && item <= 365)
      }, "Rencana target v13 disimpan");
    });
  }

  function enhanceProfileFormV13(existing = null) {
    const form = document.getElementById("profileForm");
    if (!form || form.dataset.cuteV13 === "true") return;
    form.dataset.cuteV13 = "true";
    const stack = form.querySelector(".form-stack");
    const colorField = document.getElementById("profileColor")?.closest(".field");
    colorField?.insertAdjacentHTML("afterend", `<div class="form-grid cute-book-settings">
      <label class="field"><span>Ikon buku</span><select class="input" id="profileIcon">${["🏡","📒","👨‍👩‍👧","🏪","✈️","🎓","💍","🌱"].map((icon) => `<option value="${icon}" ${existing?.icon === icon ? "selected" : ""}>${icon}</option>`).join("")}</select></label>
      <label class="field"><span>Mata uang dasar buku</span><select class="input" id="profileBaseCurrency">${currencyOptions(existing?.baseCurrency || state.settings.baseCurrency)}</select></label>
      <label class="field"><span>Awal minggu</span><select class="input" id="profileWeekStart"><option value="monday" ${existing?.weekStartsOn !== "sunday" ? "selected" : ""}>Senin</option><option value="sunday" ${existing?.weekStartsOn === "sunday" ? "selected" : ""}>Minggu</option></select></label>
      <label class="field"><span>Tanggal awal bulan buku</span><input class="input" id="profileMonthStart" type="number" min="1" max="28" value="${safeNumberV13(existing?.monthStartsOn) || 1}"></label>
    </div>`);
    stack?.classList.add("cute-book-form");
    form.addEventListener("submit", () => {
      const name = document.getElementById("profileName")?.value.trim();
      mergeExtrasAfterBaseSave("profiles", existing, (item) => item.name === name, {
        icon: document.getElementById("profileIcon")?.value || "📒",
        baseCurrency: document.getElementById("profileBaseCurrency")?.value || state.settings.baseCurrency,
        weekStartsOn: document.getElementById("profileWeekStart")?.value || "monday",
        monthStartsOn: Math.min(28, Math.max(1, safeNumberV13(document.getElementById("profileMonthStart")?.value) || 1))
      }, "Pengaturan buku v13 disimpan");
    });
  }

  function enhanceTransactionExtrasV13(existing = null) {
    const form = document.getElementById("transactionForm");
    const grid = form?.querySelector(".cute-advanced-grid") || form?.querySelector(".form-grid");
    if (!form || !grid || document.getElementById("txTime")) return;
    const profileId = document.getElementById("txProfile")?.value;
    const members = state.profiles.find((item) => item.id === profileId)?.members || [];
    grid.insertAdjacentHTML("beforeend", `<label class="field"><span>Waktu</span><input class="input" id="txTime" type="time" value="${existing?.time || new Date().toTimeString().slice(0,5)}"></label>
      <label class="field"><span>Anggota</span><input class="input" id="txMember" list="cuteMemberList" value="${escapeHTML(existing?.member || "")}" placeholder="Diri sendiri"><datalist id="cuteMemberList">${members.map((member) => `<option value="${escapeHTML(member)}"></option>`).join("")}</datalist></label>
      <label class="field"><span>Kurs sementara transfer</span><input class="input" id="txTemporaryRate" type="number" min="0" step="any" value="${safeNumberV13(existing?.temporaryExchangeRate)}" placeholder="Opsional"></label>`);
    form.addEventListener("submit", () => {
      const description = document.getElementById("txDescription")?.value.trim();
      const date = document.getElementById("txDate")?.value;
      const accountId = document.getElementById("txAccount")?.value;
      mergeExtrasAfterBaseSave("transactions", existing, (item) => item.description === description && item.date === date && item.accountId === accountId, {
        time: document.getElementById("txTime")?.value || "",
        member: document.getElementById("txMember")?.value.trim() || "",
        temporaryExchangeRate: safeNumberV13(document.getElementById("txTemporaryRate")?.value) || null
      }, "Detail transaksi v13 disimpan");
    });
  }

  function renderTransactionSearchV13() {
    const table = document.getElementById("transactionTable");
    const query = document.getElementById("transactionSearch")?.value.trim() || "";
    const type = document.getElementById("transactionTypeFilter")?.value || "";
    if (!table || !state) return;
    const amountMatch = query.match(/^\s*([<>]=?|=)\s*([\d.,]+)\s*$/);
    const dateMatch = query.match(/^tanggal:\s*(\d{4}(?:-\d{2}(?:-\d{2})?)?)$/i);
    const tagMatch = query.match(/^#(.+)$/);
    const normalized = normalizeV13(query);
    const rows = [...bookTransactions()].filter((tx) => {
      if (type && tx.type !== type) return false;
      if (!query) return true;
      if (amountMatch) {
        const threshold = Number(amountMatch[2].replace(/\./g, "").replace(",", "."));
        const amount = safeNumberV13(tx.amount);
        return ({ ">": amount > threshold, ">=": amount >= threshold, "<": amount < threshold, "<=": amount <= threshold, "=": amount === threshold })[amountMatch[1]];
      }
      if (dateMatch) return String(tx.date || "").startsWith(dateMatch[1]);
      if (tagMatch) return tx.tags?.some((tag) => normalizeV13(tag).includes(normalizeV13(tagMatch[1])));
      return normalizeV13([tx.description, tx.merchant, tx.category, tx.member, ...(tx.tags || [])].join(" ")).includes(normalized);
    }).sort((a, b) => `${b.date} ${b.time || ""}`.localeCompare(`${a.date} ${a.time || ""}`));
    table.innerHTML = rows.length ? rows.map(transactionRow).join("") : `<tr><td colspan="7">${emptyState("🔎", "Tidak ada transaksi yang cocok.")}</td></tr>`;
    const help = document.getElementById("cuteSearchHelp");
    if (help) {
      const history = state.settings.searchHistory || [];
      help.innerHTML = `<span>Cari cepat:</span>${[">100000", "tanggal:2026-07", "#tag", ...history].slice(0,6).map((item) => `<button data-cute-search="${escapeHTML(item)}" type="button">${escapeHTML(item)}</button>`).join("")}`;
    }
  }

  function renderCalendarModeV13() {
    const root = document.getElementById("cuteCalendarModes");
    const grid = document.getElementById("calendarGrid");
    if (!root || !grid || !state) return;
    const mode = state.settings.calendarMode || "total";
    root.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.cuteCalendarMode === mode));
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - (first.getDay() || 7) + 1);
    [...grid.querySelectorAll(".calendar-cell")].forEach((cell, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const iso = localISO(date);
      cell.dataset.calendarDate = iso;
      const txs = bookTransactions().filter((tx) => tx.date === iso && tx.status !== "cancelled");
      const income = txs.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + transactionBaseValue(tx), 0);
      const expense = txs.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + transactionBaseValue(tx), 0);
      cell.querySelector(".cute-calendar-total")?.remove();
      const value = mode === "income" ? income : mode === "expense" ? expense : income - expense;
      if (value !== 0) cell.insertAdjacentHTML("beforeend", `<button class="cute-calendar-total ${mode === "income" || (mode === "total" && value >= 0) ? "positive" : "negative"}" data-cute-calendar-date="${iso}" type="button">${mode === "expense" ? "−" : value >= 0 ? "+" : "−"}${formatCurrency(Math.abs(value), state.settings.baseCurrency, true)}</button>`);
      cell.querySelectorAll(".calendar-event").forEach((event) => {
        const color = event.style.getPropertyValue("--event-color").toLowerCase();
        event.hidden = mode === "income" ? !color.includes("13b888") : mode === "expense" ? !color.includes("ff5967") : false;
      });
    });
  }

  function renderV13Changelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container || document.getElementById("v13ReleaseCard")) return;
    container.insertAdjacentHTML("afterbegin", `
      <article class="release-card latest" id="v13ReleaseCard">
        <div class="release-head"><div><span class="release-kicker">VERSI TERBARU</span><h3>${VERSION_LABEL}</h3><p>Desain pastel-cute original, multi-buku, input kalkulator, dan pengalaman responsif baru untuk PC, HP, serta tablet.</p></div><span class="version-badge">v13</span></div>
        <div class="release-feature-grid">
          <div><span>📚</span><p><strong>Multi-buku</strong>Personal, keluarga, usaha, travel, dan buku custom dalam satu brankas.</p></div>
          <div><span>🧮</span><p><strong>Input kilat</strong>Tab transaksi, kategori ikon, kalkulator, tag, split, dan lampiran.</p></div>
          <div><span>🍩</span><p><strong>Ringkasan visual</strong>Saldo, arus kas, kategori, budget, target, dan transaksi terbaru.</p></div>
          <div><span>📱</span><p><strong>Responsif baru</strong>Bottom navigation HP, rail tablet, dan workspace desktop.</p></div>
          <div><span>🏷️</span><p><strong>Katalog lengkap</strong>Kategori baru, tag, akun virtual, deposito, dan aset kripto.</p></div>
          <div><span>☁️</span><p><strong>Tetap aman</strong>PIN, Always-Latest Cloud, autosave, reminder, APK, EXE, dan web dipertahankan.</p></div>
        </div>
      </article>`);
    container.querySelectorAll(".release-card:not(#v13ReleaseCard)").forEach((card) => card.classList.remove("latest"));
  }

  document.addEventListener("click", async (event) => {
    const sectionButton = event.target.closest("[data-cute-section]");
    if (sectionButton) {
      const section = sectionButton.dataset.cuteSection;
      if (document.getElementById(section)) changeSection(section);
      return;
    }

    const addButton = event.target.closest("[data-cute-add-type]");
    if (addButton) {
      openTransactionForm(null, { type: addButton.dataset.cuteAddType });
      return;
    }

    const bookButton = event.target.closest("[data-cute-book]");
    if (bookButton && state) {
      state.settings.activeBookId = bookButton.dataset.cuteBook;
      renderCuteDashboard();
      renderAnalysisHero();
      encryptState().catch(console.error);
      return;
    }

    if (event.target.closest("[data-cute-add-book]")) {
      openProfileForm();
      window.setTimeout(() => {
        const title = document.getElementById("modalTitle");
        const subtitle = document.getElementById("modalSubtitle");
        if (title) title.textContent = "Akun Keuangan Baru";
        if (subtitle) subtitle.textContent = "Pisahkan uang pribadi, pasangan, keluarga, dan setiap usaha.";
      }, 0);
      return;
    }

    if (event.target.closest("[data-cute-privacy]")) {
      document.getElementById("privacyButton")?.click();
      return;
    }

    const typeTab = event.target.closest("[data-cute-tx-type]");
    if (typeTab) {
      const select = document.getElementById("txType");
      if (select) {
        select.value = typeTab.dataset.cuteTxType;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    const categoryButton = event.target.closest("[data-cute-category]");
    if (categoryButton) {
      const select = document.getElementById("txCategory");
      if (select) {
        select.value = categoryButton.dataset.cuteCategory;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    const keyButton = event.target.closest("[data-cute-key]");
    if (keyButton) {
      event.preventDefault();
      handleCalculatorKey(keyButton.dataset.cuteKey);
      return;
    }

    const searchButton = event.target.closest("[data-cute-search]");
    if (searchButton) {
      const input = document.getElementById("transactionSearch");
      if (input) {
        input.value = searchButton.dataset.cuteSearch;
        renderTransactionSearchV13();
      }
      return;
    }

    const calendarMode = event.target.closest("[data-cute-calendar-mode]");
    if (calendarMode && state) {
      state.settings.calendarMode = calendarMode.dataset.cuteCalendarMode;
      renderCalendarModeV13();
      encryptState().catch(console.error);
      return;
    }

    const calendarDate = event.target.closest("[data-cute-calendar-date]")?.dataset.cuteCalendarDate
      || event.target.closest(".calendar-cell")?.dataset.calendarDate;
    if (calendarDate && !event.target.closest(".calendar-event")) {
      openTransactionForm(null, { type: "expense", date: calendarDate });
    }
  });

  const previousOpenTransactionForm = openTransactionForm;
  openTransactionForm = function v13OpenTransactionForm(existing = null, prefill = {}) {
    previousOpenTransactionForm(existing, prefill);
    window.setTimeout(() => {
      enhanceTransactionFormV13(existing);
      enhanceTransactionExtrasV13(existing);
    }, 100);
  };

  const previousOpenBudgetForm = openBudgetForm;
  openBudgetForm = function v13OpenBudgetForm(existing = null) {
    previousOpenBudgetForm(existing);
    enhanceBudgetFormV13(existing);
  };

  const previousOpenGoalForm = openGoalForm;
  openGoalForm = function v13OpenGoalForm(existing = null) {
    previousOpenGoalForm(existing);
    enhanceGoalFormV13(existing);
  };

  const previousOpenProfileForm = openProfileForm;
  openProfileForm = function v13OpenProfileForm(existing = null) {
    previousOpenProfileForm(existing);
    enhanceProfileFormV13(existing);
  };

  budgetSpent = function v13BudgetSpent(budget) {
    const selected = state?.settings?.activeBookId;
    const prior = selected;
    if (budget.profileId && selected !== BOOK_ALL && selected !== budget.profileId) return 0;
    const total = bookBudgetSpent(budget);
    if (prior) state.settings.activeBookId = prior;
    return total;
  };

  const previousRenderBudgets = renderBudgets;
  renderBudgets = function v13RenderBudgets() {
    previousRenderBudgets();
    renderAdvancedBudgets();
  };

  const previousRenderGoals = renderGoals;
  renderGoals = function v13RenderGoals() {
    previousRenderGoals();
    renderAdvancedGoals();
  };

  const previousRenderCalendar = renderCalendar;
  renderCalendar = function v13RenderCalendar() {
    previousRenderCalendar();
    renderCalendarModeV13();
  };

  const previousRenderTransactions = renderTransactions;
  renderTransactions = function v13RenderTransactions() {
    previousRenderTransactions();
    renderTransactionSearchV13();
  };

  const previousRenderAll = renderAll;
  renderAll = function v13RenderAll() {
    const changed = state ? ensureV13State() : false;
    previousRenderAll();
    renderCuteDashboard();
    renderAccountSummary();
    renderAnalysisHero();
    renderAdvancedBudgets();
    renderAdvancedGoals();
    renderCalendarModeV13();
    renderTransactionSearchV13();
    renderMoreHub();
    renderV13Changelog();
    refreshTopbar();
    if (changed) window.setTimeout(() => encryptState().catch(console.error), 80);
  };

  const previousChangeSection = changeSection;
  changeSection = function v13ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    refreshTopbar();
    if (sectionId === "dashboard") renderCuteDashboard();
    if (sectionId === "accounts") renderAccountSummary();
    if (sectionId === "reports") renderAnalysisHero();
    if (sectionId === "budgets") renderAdvancedBudgets();
    if (sectionId === "goals") renderAdvancedGoals();
    if (sectionId === "calendar") renderCalendarModeV13();
    if (sectionId === "transactions") renderTransactionSearchV13();
    if (sectionId === "tools") renderMoreHub();
    if (sectionId === "updates") renderV13Changelog();
  };

  const previousUnlockApplication = unlockApplication;
  unlockApplication = function v13UnlockApplication() {
    const changed = ensureV13State();
    previousUnlockApplication();
    renderCuteDashboard();
    renderAccountSummary();
    renderAnalysisHero();
    renderAdvancedBudgets();
    renderAdvancedGoals();
    renderCalendarModeV13();
    renderTransactionSearchV13();
    renderMoreHub();
    renderV13Changelog();
    refreshTopbar();
    if (changed) encryptState().catch(console.error);
  };

  injectV13UI();
})();
