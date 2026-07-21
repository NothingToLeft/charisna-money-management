"use strict";

(() => {
  const VERSION = 11.1;
  const VERSION_LABEL = "v11.1 — Stability & Input Fix";
  const DEFAULT_CATEGORY_SNAPSHOT = Object.entries(CATEGORIES).map(([name, meta], index) => ({
    id: `builtin-${index + 1}`,
    builtinKey: name,
    name,
    type: meta.type || "both",
    icon: meta.icon || "✨",
    color: meta.color || "#8c8ca1",
    parent: "",
    archived: false,
    pinned: false,
    order: index,
    createdAt: null,
    updatedAt: null
  }));

  const MONEY_INPUT_IDS = new Set([
    "txAmount", "txDestinationAmount", "txFee", "accountOpeningBalance",
    "accountOpeningRate", "accountCreditLimit", "budgetLimit", "goalAmount", "contributionAmount",
    "recurringAmount", "reconcileActualBalance", "manualRateValue",
    "proDebtPrincipal", "proDebtBalance", "proDebtMonthly", "proDebtPayAmount",
    "proDebtExtra", "proInvestmentQuantity", "proInvestmentAvg", "proInvestmentCurrent", "proDividendAmount",
    "proSharedThreshold", "proRefundAmount", "proTemplateAmount", "billTopUpAmount",
    "v11ConverterAmount"
  ]);

  let categorySearch = "";
  let categoryTypeFilter = "all";
  let categoryVisibilityFilter = "active";
  let categoryStudioTab = "categories";
  let moneyObserver = null;
  let activeSuggestionBox = null;
  let lastAudit = null;

  const nowIso = () => new Date().toISOString();
  const safeNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const makeId = (prefix) => `${prefix}-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}`;
  const normalizeText = (value) => String(value || "").trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ");

  function inferCategoryType(name) {
    const usedTypes = new Set();
    (state?.transactions || []).forEach((tx) => {
      if (tx.category === name || tx.splits?.some((split) => split.category === name)) {
        if (tx.type === "income" || tx.type === "expense") usedTypes.add(tx.type);
      }
    });
    (state?.recurring || []).forEach((item) => {
      if (item.category === name && (item.type === "income" || item.type === "expense")) usedTypes.add(item.type);
    });
    if (usedTypes.size > 1) return "both";
    return usedTypes.values().next().value || "expense";
  }

  function discoveredCategoryNames() {
    const names = new Set();
    (state?.transactions || []).forEach((tx) => {
      if (tx.category) names.add(tx.category);
      (tx.splits || []).forEach((split) => split.category && names.add(split.category));
    });
    (state?.budgets || []).forEach((item) => item.category && names.add(item.category));
    (state?.recurring || []).forEach((item) => item.category && names.add(item.category));
    (state?.rules || []).forEach((item) => item.category && names.add(item.category));
    (state?.transactionTemplates || []).forEach((item) => item.category && names.add(item.category));
    return Array.from(names);
  }

  function ensureV11State() {
    if (!state) return false;
    let changed = false;
    state.settings ||= {};
    state.settings.migrationHistory ||= [];

    if (!Array.isArray(state.categoryCatalog) || !state.categoryCatalog.length) {
      state.categoryCatalog = DEFAULT_CATEGORY_SNAPSHOT.map((item) => ({ ...item }));
      changed = true;
    }

    const catalogNames = new Set(state.categoryCatalog.map((item) => normalizeText(item.name)));
    discoveredCategoryNames().forEach((name) => {
      if (!catalogNames.has(normalizeText(name))) {
        state.categoryCatalog.push({
          id: makeId("category"),
          builtinKey: null,
          name,
          type: inferCategoryType(name),
          icon: "✨",
          color: "#8c8ca1",
          parent: "",
          archived: false,
          pinned: false,
          order: state.categoryCatalog.length,
          createdAt: nowIso(),
          updatedAt: nowIso()
        });
        catalogNames.add(normalizeText(name));
        changed = true;
      }
    });

    state.categoryCatalog.forEach((item, index) => {
      if (!item.id) { item.id = makeId("category"); changed = true; }
      if (!item.name) { item.name = `Kategori ${index + 1}`; changed = true; }
      if (!item.type) { item.type = "expense"; changed = true; }
      if (!item.icon) { item.icon = "✨"; changed = true; }
      if (!item.color) { item.color = "#8c8ca1"; changed = true; }
      if (item.parent === undefined) { item.parent = ""; changed = true; }
      if (item.archived === undefined) { item.archived = false; changed = true; }
      if (item.pinned === undefined) { item.pinned = false; changed = true; }
      if (!Number.isFinite(Number(item.order))) { item.order = index; changed = true; }
    });

    if (!Array.isArray(state.tagCatalog)) {
      state.tagCatalog = [];
      changed = true;
    }
    collectUsedTags().forEach((name) => {
      if (!state.tagCatalog.some((item) => normalizeText(item.name) === normalizeText(name))) {
        state.tagCatalog.push({ id: makeId("tag"), name, color: "#7558ff", archived: false, createdAt: nowIso() });
        changed = true;
      }
    });

    const defaults = {
      smartNumberFormatting: true,
      smartAutocomplete: true,
      smartCategorySuggestion: true,
      smartDuplicateWarning: true,
      smartTransferConversion: true,
      categoryStudioLastTab: "categories",
      categoryStudioVersion: VERSION
    };
    Object.entries(defaults).forEach(([key, value]) => {
      if (state.settings[key] === undefined) { state.settings[key] = value; changed = true; }
    });

    state.appVersion = Math.max(safeNumber(state.appVersion), VERSION);
    if (!state.settings.migrationHistory.some((item) => item.version === VERSION)) {
      state.settings.migrationHistory.unshift({ version: VERSION, label: VERSION_LABEL, migratedAt: nowIso(), status: "success" });
      state.settings.migrationHistory = state.settings.migrationHistory.slice(0, 30);
      changed = true;
    }

    syncRuntimeCategories();
    return changed;
  }

  function syncRuntimeCategories() {
    if (!state?.categoryCatalog) return;
    Object.keys(CATEGORIES).forEach((key) => delete CATEGORIES[key]);
    state.categoryCatalog.forEach((item) => {
      const meta = { icon: item.icon || "✨", color: item.color || "#8c8ca1", type: item.type || "both" };
      CATEGORIES[item.name] = meta;
      if (item.builtinKey) CATEGORIES[item.builtinKey] = meta;
    });
    CATEGORIES.Lainnya ||= { icon: "✨", color: "#8c8ca1", type: "both" };
  }

  categoryOptions = function v11CategoryOptions(type = "expense", selected = "") {
    const catalog = state?.categoryCatalog?.length ? state.categoryCatalog : DEFAULT_CATEGORY_SNAPSHOT;
    const rows = [...catalog];
    if (selected && !rows.some((item) => item.name === selected)) {
      rows.push({ name: selected, type, icon: "⚠️", color: "#8c8ca1", parent: "", archived: true, pinned: false, order: Number.MAX_SAFE_INTEGER });
    }

    return rows
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || safeNumber(a.order) - safeNumber(b.order) || a.name.localeCompare(b.name, "id"))
      .filter((item) => item.name === selected || !item.archived)
      .filter((item) => item.name === selected || item.type === type || item.type === "both")
      .map((item) => {
        const label = item.parent ? `${item.parent} › ${item.name}` : item.name;
        return `<option value="${escapeHTML(item.name)}" ${item.name === selected ? "selected" : ""}>${item.icon || "✨"} ${escapeHTML(label)}${item.archived ? " · arsip/legacy" : ""}</option>`;
      })
      .join("");
  };

  function injectV11UI() {
    SECTION_COPY.categories = ["Kategori & Tag", "Atur kategori pemasukan, pengeluaran, tag, urutan, dan input pintar."];
    const nav = document.querySelector(".navigation");
    const systemNav = nav?.querySelector('[data-section="system"]') || nav?.querySelector('[data-section="settings"]');
    if (nav && systemNav && !nav.querySelector('[data-section="categories"]')) {
      systemNav.insertAdjacentHTML("beforebegin", '<button class="nav-button" data-section="categories"><span>🏷️</span>Kategori</button>');
    }

    const systemSection = document.getElementById("system") || document.getElementById("settings");
    if (systemSection && !document.getElementById("categories")) {
      systemSection.insertAdjacentHTML("beforebegin", categoryStudioHtml());
    }

    const system = document.getElementById("system");
    if (system && !document.getElementById("v11AuditPanel")) {
      system.insertAdjacentHTML("beforeend", `
        <article class="panel v11-audit-panel" id="v11AuditPanel">
          <header class="panel-header"><div><h4>🧪 Audit v11</h4><p>Pemeriksaan tambahan untuk kategori, nominal, autocomplete, kurs, dan referensi data.</p></div><button class="button secondary" id="v11RunAudit" type="button">Jalankan Audit</button></header>
          <div id="v11AuditResults"><p class="muted">Audit belum dijalankan.</p></div>
        </article>`);
    }

    replaceCurrencySyncButton();
    bindV11Events();
    startMoneyInputObserver();
  }

  function categoryStudioHtml() {
    return `
      <section class="section" id="categories">
        <header class="section-header">
          <div><h3>Kategori, Tag & Smart Input</h3><p>Buat kategori sendiri, termasuk pemasukan kos, serta atur pengalaman input transaksi.</p></div>
          <div class="toolbar"><span class="version-badge">${VERSION_LABEL}</span><button class="button primary" id="v11AddCategory" type="button">＋ Kategori</button></div>
        </header>

        <article class="v11-hero">
          <div><span class="v11-kicker">CATEGORY STUDIO</span><h3>Struktur keuangan yang mengikuti kebutuhanmu.</h3><p>Kategori custom ikut terenkripsi dan tersinkron ke cloud. Kategori lama tetap aman saat diedit, digabung, atau diarsipkan.</p></div>
          <div class="v11-hero-example"><span>Contoh pemasukan</span><strong>🏠 Kos</strong><small>Bulanan · Properti</small></div>
        </article>

        <div class="v11-tabs">
          <button class="v11-tab active" data-v11-studio-tab="categories" type="button">🏷️ Kategori</button>
          <button class="v11-tab" data-v11-studio-tab="tags" type="button"># Tag</button>
          <button class="v11-tab" data-v11-studio-tab="smart" type="button">✨ Smart Input</button>
        </div>

        <div class="v11-studio-panel active" id="v11CategoryPanel">
          <div class="v11-category-summary" id="v11CategorySummary"></div>
          <article class="panel v11-toolbar-panel">
            <div class="v11-toolbar-grid">
              <label class="v11-search"><span>🔎</span><input id="v11CategorySearch" type="search" placeholder="Cari kategori atau induk..." /></label>
              <select class="input" id="v11CategoryTypeFilter"><option value="all">Semua jenis</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option><option value="both">Keduanya</option></select>
              <select class="input" id="v11CategoryVisibility"><option value="active">Aktif</option><option value="all">Aktif + arsip</option><option value="archived">Arsip saja</option></select>
              <button class="button secondary" id="v11MergeCategory" type="button">⇄ Gabungkan</button>
            </div>
          </article>
          <div class="v11-category-groups" id="v11CategoryList"></div>
        </div>

        <div class="v11-studio-panel" id="v11TagPanel">
          <div class="v11-tag-heading"><div><h3>Tag</h3><p class="muted">Gunakan tag untuk proyek, penghuni kos, unit, bisnis, atau kebutuhan laporan.</p></div><button class="button primary" id="v11AddTag" type="button">＋ Tag</button></div>
          <div class="v11-tag-grid" id="v11TagList"></div>
        </div>

        <div class="v11-studio-panel" id="v11SmartPanel">
          <div class="v11-smart-grid" id="v11SmartSettings"></div>
        </div>
      </section>`;
  }

  function renderCategoryStudio() {
    if (!state || !document.getElementById("categories")) return;
    syncRuntimeCategories();
    categoryStudioTab = state.settings.categoryStudioLastTab || categoryStudioTab;
    setStudioTab(categoryStudioTab, false);
    renderCategorySummary();
    renderCategoryList();
    renderTagList();
    renderSmartSettings();
  }

  function renderCategorySummary() {
    const active = state.categoryCatalog.filter((item) => !item.archived);
    const custom = active.filter((item) => !item.builtinKey);
    const income = active.filter((item) => item.type === "income" || item.type === "both").length;
    const expense = active.filter((item) => item.type === "expense" || item.type === "both").length;
    document.getElementById("v11CategorySummary").innerHTML = `
      <div class="v11-summary-card"><span>Aktif</span><strong>${active.length}</strong><small>kategori tersedia</small></div>
      <div class="v11-summary-card"><span>Pemasukan</span><strong>${income}</strong><small>opsi kategori</small></div>
      <div class="v11-summary-card"><span>Pengeluaran</span><strong>${expense}</strong><small>opsi kategori</small></div>
      <div class="v11-summary-card"><span>Custom</span><strong>${custom.length}</strong><small>buatan sendiri</small></div>`;
  }

  function categoryUsage(name) {
    let transactions = 0;
    let budgets = 0;
    let recurring = 0;
    let rules = 0;
    (state.transactions || []).forEach((tx) => {
      if (tx.category === name) transactions += 1;
      transactions += (tx.splits || []).filter((split) => split.category === name).length;
    });
    budgets = (state.budgets || []).filter((item) => item.category === name).length;
    recurring = (state.recurring || []).filter((item) => item.category === name).length;
    rules = (state.rules || []).filter((item) => item.category === name).length;
    return { transactions, budgets, recurring, rules, total: transactions + budgets + recurring + rules };
  }

  function renderCategoryList() {
    const container = document.getElementById("v11CategoryList");
    if (!container) return;
    const query = normalizeText(categorySearch);
    let items = [...state.categoryCatalog]
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || safeNumber(a.order) - safeNumber(b.order) || a.name.localeCompare(b.name, "id"))
      .filter((item) => !query || normalizeText(`${item.name} ${item.parent}`).includes(query))
      .filter((item) => categoryTypeFilter === "all" || item.type === categoryTypeFilter || (categoryTypeFilter !== "both" && item.type === "both"))
      .filter((item) => categoryVisibilityFilter === "all" || (categoryVisibilityFilter === "active" ? !item.archived : item.archived));

    const groups = [
      { key: "income", title: "Pemasukan", icon: "📥", test: (item) => item.type === "income" || item.type === "both" },
      { key: "expense", title: "Pengeluaran", icon: "📤", test: (item) => item.type === "expense" || item.type === "both" }
    ];

    container.innerHTML = groups.map((group) => {
      const rows = items.filter(group.test);
      return `<article class="v11-category-group">
        <header><div><span class="v11-group-icon">${group.icon}</span><div><h4>${group.title}</h4><p>${rows.length} kategori ditampilkan</p></div></div></header>
        <div class="v11-category-list">${rows.length ? rows.map(categoryRowHtml).join("") : '<div class="v11-empty">Tidak ada kategori yang cocok.</div>'}</div>
      </article>`;
    }).join("");
  }

  function categoryRowHtml(item) {
    const usage = categoryUsage(item.name);
    const typeLabel = item.type === "income" ? "Pemasukan" : item.type === "expense" ? "Pengeluaran" : "Keduanya";
    return `<div class="v11-category-row ${item.archived ? "archived" : ""}" data-category-id="${item.id}">
      <div class="v11-category-icon" style="--category-color:${item.color}">${item.icon}</div>
      <div class="v11-category-copy"><strong>${escapeHTML(item.name)} ${item.pinned ? "⭐" : ""}</strong><span>${item.parent ? `${escapeHTML(item.parent)} · ` : ""}${typeLabel} · ${usage.total} pemakaian</span></div>
      <div class="v11-category-usage"><span>${usage.transactions} transaksi</span><span>${usage.budgets} budget</span><span>${usage.recurring} rutin</span></div>
      <div class="v11-row-actions">
        <button class="mini-button" data-v11-category-up="${item.id}" title="Naik">↑</button>
        <button class="mini-button" data-v11-category-down="${item.id}" title="Turun">↓</button>
        <button class="mini-button" data-v11-category-pin="${item.id}" title="Favorit">${item.pinned ? "★" : "☆"}</button>
        <button class="mini-button" data-v11-category-edit="${item.id}" title="Edit">✏️</button>
        <button class="mini-button" data-v11-category-archive="${item.id}" title="${item.archived ? "Aktifkan" : "Arsipkan"}">${item.archived ? "↩" : "🗄️"}</button>
        ${!item.builtinKey && usage.total === 0 ? `<button class="mini-button danger-mini" data-v11-category-delete="${item.id}" title="Hapus">🗑️</button>` : ""}
      </div>
    </div>`;
  }

  function renderTagList() {
    const container = document.getElementById("v11TagList");
    if (!container) return;
    const tags = [...state.tagCatalog].sort((a, b) => a.name.localeCompare(b.name, "id"));
    container.innerHTML = tags.length ? tags.map((item) => {
      const usage = tagUsage(item.name);
      return `<article class="v11-tag-card ${item.archived ? "archived" : ""}">
        <div><span class="v11-tag-dot" style="background:${item.color || "#7558ff"}"></span><strong>#${escapeHTML(item.name)}</strong><small>${usage} pemakaian</small></div>
        <div class="table-actions"><button class="mini-button" data-v11-tag-edit="${item.id}">✏️</button><button class="mini-button" data-v11-tag-archive="${item.id}">${item.archived ? "↩" : "🗄️"}</button><button class="mini-button danger-mini" data-v11-tag-delete="${item.id}">🗑️</button></div>
      </article>`;
    }).join("") : '<div class="v11-empty">Belum ada tag. Tambahkan tag seperti unit-a, penghuni, atau bisnis.</div>';
  }

  function renderSmartSettings() {
    const container = document.getElementById("v11SmartSettings");
    if (!container) return;
    container.innerHTML = `
      <article class="panel"><header class="panel-header"><div><h4>Format Nominal Otomatis</h4><p>Angka 1000 langsung tampil sebagai 1.000 saat diketik.</p></div><input id="v11SmartNumber" type="checkbox" ${state.settings.smartNumberFormatting ? "checked" : ""}></header><div class="v11-demo-input"><span>Rp</span><input value="1.250.000" readonly><small>Nilai tersimpan tetap berupa angka murni.</small></div></article>
      <article class="panel"><header class="panel-header"><div><h4>Autocomplete Transaksi</h4><p>Nama transaksi dan merchant lama muncul setelah beberapa huruf.</p></div><input id="v11SmartAutocomplete" type="checkbox" ${state.settings.smartAutocomplete ? "checked" : ""}></header><div class="v11-demo-suggestion"><span>cha</span><div><strong>ChatGPT Plus</strong><small>OpenAI · Tagihan</small></div></div></article>
      <article class="panel"><header class="panel-header"><div><h4>Saran Kategori</h4><p>Belajar dari merchant dan transaksi sebelumnya tanpa mengubah otomatis.</p></div><input id="v11SmartCategory" type="checkbox" ${state.settings.smartCategorySuggestion ? "checked" : ""}></header><p class="muted">Contoh: merchant “Penyewa Unit A” dapat menyarankan kategori pemasukan “Kos”.</p></article>
      <article class="panel"><header class="panel-header"><div><h4>Peringatan Duplikat</h4><p>Memberi peringatan sebelum transaksi mirip tersimpan dua kali.</p></div><input id="v11SmartDuplicate" type="checkbox" ${state.settings.smartDuplicateWarning ? "checked" : ""}></header><p class="muted">Pemeriksaan menggunakan tanggal, akun, nominal, dan nama transaksi.</p></article>
      <article class="panel"><header class="panel-header"><div><h4>Konversi Transfer</h4><p>Tampilkan estimasi nominal tujuan untuk transfer beda mata uang.</p></div><input id="v11SmartTransfer" type="checkbox" ${state.settings.smartTransferConversion ? "checked" : ""}></header><p class="muted">Kurs tetap dapat disunting manual di Setting → Mata Uang & Kurs.</p></article>
      <article class="panel v11-smart-wide"><header class="panel-header"><div><h4>Kalkulator Kurs Langsung</h4><p>Nominal hasil konversi tampil setelah kurs diperbarui.</p></div><button class="button secondary" id="v11OpenCurrencySettings" type="button">Buka Pengaturan Kurs</button></header><div id="v11SmartCurrencyPreview"></div></article>`;
    renderSmartCurrencyPreview();
  }

  function renderSmartCurrencyPreview() {
    const container = document.getElementById("v11SmartCurrencyPreview");
    if (!container || !state) return;
    const base = state.settings.baseCurrency;
    const favorites = (state.settings.favoriteCurrencies || []).filter((code) => code !== base).slice(0, 5);
    container.innerHTML = `<div class="v11-rate-strip">${favorites.map((code) => `<div><span>1 ${base}</span><strong>${formatRateNumber(convertCurrency(1, base, code))} ${code}</strong></div>`).join("") || '<span class="muted">Tambahkan mata uang favorit di Setting.</span>'}</div>`;
  }

  function setStudioTab(tab, save = true) {
    categoryStudioTab = tab;
    document.querySelectorAll("[data-v11-studio-tab]").forEach((button) => button.classList.toggle("active", button.dataset.v11StudioTab === tab));
    document.getElementById("v11CategoryPanel")?.classList.toggle("active", tab === "categories");
    document.getElementById("v11TagPanel")?.classList.toggle("active", tab === "tags");
    document.getElementById("v11SmartPanel")?.classList.toggle("active", tab === "smart");
    if (save && state) {
      state.settings.categoryStudioLastTab = tab;
      encryptState().catch(() => {});
    }
  }

  function openCategoryForm(existing = null) {
    const item = existing || { name: "", type: "income", icon: "🏠", color: "#13b888", parent: "", pinned: false };
    const parentOptions = Array.from(new Set(state.categoryCatalog.map((row) => row.parent).filter(Boolean))).sort();
    showModal(existing ? "Edit Kategori" : "Tambah Kategori", "Kategori custom tersimpan di brankas terenkripsi dan ikut cloud sync.", `
      <form id="v11CategoryForm"><div class="form-grid">
        <label class="field full"><span>Nama kategori</span><input class="input" id="v11CategoryName" value="${escapeHTML(item.name)}" placeholder="Contoh: Kos" required maxlength="50"></label>
        <label class="field"><span>Jenis</span><select class="input" id="v11CategoryType"><option value="income" ${item.type === "income" ? "selected" : ""}>Pemasukan</option><option value="expense" ${item.type === "expense" ? "selected" : ""}>Pengeluaran</option><option value="both" ${item.type === "both" ? "selected" : ""}>Keduanya</option></select></label>
        <label class="field"><span>Ikon</span><input class="input" id="v11CategoryIcon" value="${escapeHTML(item.icon)}" maxlength="8" placeholder="🏠"></label>
        <label class="field"><span>Warna</span><input class="input" id="v11CategoryColor" type="color" value="${item.color || "#7558ff"}"></label>
        <label class="field"><span>Kategori induk</span><input class="input" id="v11CategoryParent" list="v11ParentOptions" value="${escapeHTML(item.parent || "")}" placeholder="Contoh: Properti"><datalist id="v11ParentOptions">${parentOptions.map((name) => `<option value="${escapeHTML(name)}"></option>`).join("")}</datalist></label>
        <label class="simple-item full"><span>⭐ Tampilkan sebagai kategori favorit</span><input id="v11CategoryPinned" type="checkbox" ${item.pinned ? "checked" : ""}></label>
      </div><div class="v11-category-preview" id="v11CategoryPreview"></div><div class="form-actions"><button class="button secondary" id="v11CancelCategory" type="button">Batal</button><button class="button primary" type="submit">Simpan Kategori</button></div></form>`);
    document.getElementById("v11CancelCategory").addEventListener("click", closeModal);
    const updatePreview = () => {
      const icon = document.getElementById("v11CategoryIcon").value || "✨";
      const name = document.getElementById("v11CategoryName").value || "Nama kategori";
      const color = document.getElementById("v11CategoryColor").value;
      document.getElementById("v11CategoryPreview").innerHTML = `<span style="background:${color}20;color:${color}">${escapeHTML(icon)}</span><div><strong>${escapeHTML(name)}</strong><small>Preview kategori</small></div>`;
    };
    ["v11CategoryIcon", "v11CategoryName", "v11CategoryColor"].forEach((id) => document.getElementById(id).addEventListener("input", updatePreview));
    updatePreview();
    document.getElementById("v11CategoryForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("v11CategoryName").value.trim().replace(/\s+/g, " ");
      const duplicate = state.categoryCatalog.find((row) => row.id !== existing?.id && normalizeText(row.name) === normalizeText(name));
      if (!name) return showToast("Nama kategori wajib diisi.", "❗");
      if (duplicate) return showToast("Nama kategori sudah digunakan.", "❗");
      const next = {
        ...(existing || {}), id: existing?.id || makeId("category"), builtinKey: existing?.builtinKey || null,
        name, type: document.getElementById("v11CategoryType").value,
        icon: document.getElementById("v11CategoryIcon").value.trim() || "✨",
        color: document.getElementById("v11CategoryColor").value,
        parent: document.getElementById("v11CategoryParent").value.trim(),
        pinned: document.getElementById("v11CategoryPinned").checked,
        archived: existing?.archived || false,
        order: existing?.order ?? state.categoryCatalog.length,
        createdAt: existing?.createdAt || nowIso(), updatedAt: nowIso()
      };
      await commit(existing ? "Kategori diperbarui" : "Kategori ditambahkan", name, () => {
        if (existing) {
          const oldName = existing.name;
          const index = state.categoryCatalog.findIndex((row) => row.id === existing.id);
          state.categoryCatalog[index] = next;
          if (oldName !== name) replaceCategoryReferences(oldName, name);
        } else state.categoryCatalog.push(next);
        syncRuntimeCategories();
      });
      closeModal();
      renderCategoryStudio();
      showToast(`Kategori “${name}” berhasil disimpan.`, "🏷️");
    });
  }

  function replaceCategoryReferences(source, target) {
    (state.transactions || []).forEach((tx) => {
      if (tx.category === source) tx.category = target;
      (tx.splits || []).forEach((split) => { if (split.category === source) split.category = target; });
    });
    (state.budgets || []).forEach((item) => { if (item.category === source) item.category = target; });
    (state.recurring || []).forEach((item) => { if (item.category === source) item.category = target; });
    (state.rules || []).forEach((item) => { if (item.category === source) item.category = target; });
    (state.transactionTemplates || []).forEach((item) => { if (item.category === source) item.category = target; });
    (state.categoryCatalog || []).forEach((item) => { if (item.parent === source) item.parent = target; });
  }

  function openMergeCategoryForm(prefillSource = "") {
    const active = state.categoryCatalog.filter((item) => !item.archived);
    if (active.length < 2) return showToast("Minimal diperlukan dua kategori aktif.", "❗");
    const options = active.map((item) => `<option value="${item.id}" ${item.id === prefillSource ? "selected" : ""}>${item.icon} ${escapeHTML(item.name)}</option>`).join("");
    showModal("Gabungkan Kategori", "Semua transaksi, split, budget, langganan, template, dan aturan akan dipindahkan.", `
      <form id="v11MergeCategoryForm"><div class="form-stack"><label class="field"><span>Kategori sumber</span><select class="input" id="v11MergeSource">${options}</select></label><label class="field"><span>Gabungkan ke</span><select class="input" id="v11MergeTarget">${options}</select></label><div class="warning-banner">Kategori sumber akan diarsipkan setelah seluruh referensi dipindahkan. Backup terenkripsi disarankan sebelum perubahan besar.</div></div><div class="form-actions"><button class="button secondary" id="v11CancelMerge" type="button">Batal</button><button class="button primary" type="submit">Gabungkan</button></div></form>`);
    document.getElementById("v11CancelMerge").addEventListener("click", closeModal);
    document.getElementById("v11MergeCategoryForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const source = state.categoryCatalog.find((item) => item.id === document.getElementById("v11MergeSource").value);
      const target = state.categoryCatalog.find((item) => item.id === document.getElementById("v11MergeTarget").value);
      if (!source || !target || source.id === target.id) return showToast("Pilih dua kategori yang berbeda.", "❗");
      if (!confirm(`Gabungkan semua data “${source.name}” ke “${target.name}”?`)) return;
      await commit("Kategori digabungkan", `${source.name} → ${target.name}`, () => {
        replaceCategoryReferences(source.name, target.name);
        source.archived = true;
        source.updatedAt = nowIso();
        syncRuntimeCategories();
      });
      closeModal();
      renderCategoryStudio();
      showToast("Kategori berhasil digabungkan.", "⇄");
    });
  }

  function collectUsedTags() {
    const result = new Set();
    (state?.transactions || []).forEach((tx) => (tx.tags || []).forEach((tag) => tag && result.add(tag)));
    (state?.rules || []).forEach((rule) => (rule.tags || []).forEach((tag) => tag && result.add(tag)));
    (state?.recurring || []).forEach((item) => (item.subscriptionTags || []).forEach((tag) => tag && result.add(tag)));
    (state?.budgets || []).forEach((item) => item.tag && result.add(item.tag));
    return Array.from(result);
  }

  function tagUsage(name) {
    const key = normalizeText(name);
    let count = 0;
    (state.transactions || []).forEach((tx) => count += (tx.tags || []).filter((tag) => normalizeText(tag) === key).length);
    (state.rules || []).forEach((rule) => count += (rule.tags || []).filter((tag) => normalizeText(tag) === key).length);
    (state.recurring || []).forEach((item) => count += (item.subscriptionTags || []).filter((tag) => normalizeText(tag) === key).length);
    (state.budgets || []).forEach((item) => { if (normalizeText(item.tag) === key) count += 1; });
    return count;
  }

  function replaceTagReferences(source, target = null) {
    const sourceKey = normalizeText(source);
    const rewrite = (tags) => Array.from(new Set((tags || []).flatMap((tag) => normalizeText(tag) === sourceKey ? (target ? [target] : []) : [tag])));
    (state.transactions || []).forEach((tx) => { tx.tags = rewrite(tx.tags); });
    (state.rules || []).forEach((rule) => { rule.tags = rewrite(rule.tags); });
    (state.recurring || []).forEach((item) => { item.subscriptionTags = rewrite(item.subscriptionTags); });
    (state.budgets || []).forEach((item) => { if (normalizeText(item.tag) === sourceKey) item.tag = target || ""; });
  }

  function openTagForm(existing = null) {
    const item = existing || { name: "", color: "#7558ff", archived: false };
    showModal(existing ? "Edit Tag" : "Tambah Tag", "Tag dapat digunakan untuk unit kos, penghuni, proyek, atau laporan.", `
      <form id="v11TagForm"><div class="form-stack"><label class="field"><span>Nama tag</span><input class="input" id="v11TagName" value="${escapeHTML(item.name)}" placeholder="Contoh: unit-a" required></label><label class="field"><span>Warna</span><input class="input" id="v11TagColor" type="color" value="${item.color || "#7558ff"}"></label></div><div class="form-actions"><button class="button secondary" id="v11CancelTag" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("v11CancelTag").addEventListener("click", closeModal);
    document.getElementById("v11TagForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("v11TagName").value.trim().replace(/^#/, "").replace(/\s+/g, "-").toLowerCase();
      const duplicate = state.tagCatalog.find((row) => row.id !== existing?.id && normalizeText(row.name) === normalizeText(name));
      if (!name) return showToast("Nama tag wajib diisi.", "❗");
      if (duplicate) return showToast("Tag tersebut sudah tersedia.", "❗");
      await commit(existing ? "Tag diperbarui" : "Tag ditambahkan", name, () => {
        if (existing) {
          const old = existing.name;
          existing.name = name;
          existing.color = document.getElementById("v11TagColor").value;
          if (old !== name) replaceTagReferences(old, name);
        } else state.tagCatalog.push({ id: makeId("tag"), name, color: document.getElementById("v11TagColor").value, archived: false, createdAt: nowIso() });
      });
      closeModal();
      renderTagList();
      showToast("Tag berhasil disimpan.", "#");
    });
  }

  function startMoneyInputObserver() {
    if (moneyObserver) return;

    moneyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (state?.settings?.smartNumberFormatting) enhanceMoneyInputs(node);
      }));
    });

    moneyObserver.observe(document.body, { childList: true, subtree: true });
    if (state?.settings?.smartNumberFormatting) enhanceMoneyInputs(document);
  }

  function isMoneyInput(input) {
    if (!(input instanceof HTMLInputElement)) return false;
    return MONEY_INPUT_IDS.has(input.id) || input.classList.contains("split-amount") || input.dataset.moneyInput === "true";
  }

  function parseLocaleNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : NaN;

    let text = String(value ?? "").trim();
    if (!text || text === "-" || text === "," || text === ".") return NaN;

    const parenthesesNegative = /^\(.*\)$/.test(text);
    const explicitNegative = text.startsWith("-");
    const negative = parenthesesNegative || explicitNegative;

    text = text
      .replace(/[()\s\u00a0]/g, "")
      .replace(/[^0-9,.-]/g, "")
      .replace(/-/g, "");

    if (!text) return NaN;

    const lastComma = text.lastIndexOf(",");
    const lastDot = text.lastIndexOf(".");
    let normalized = text;

    if (lastComma >= 0 && lastDot >= 0) {
      const decimalSeparator = lastComma > lastDot ? "," : ".";
      const groupingSeparator = decimalSeparator === "," ? "." : ",";
      normalized = text.replaceAll(groupingSeparator, "");
      const decimalIndex = normalized.lastIndexOf(decimalSeparator);
      normalized = `${normalized.slice(0, decimalIndex).replaceAll(decimalSeparator, "")}.${normalized.slice(decimalIndex + 1)}`;
    } else if (lastComma >= 0) {
      const pieces = text.split(",");
      normalized = pieces.length === 2
        ? `${pieces[0].replaceAll(".", "")}.${pieces[1]}`
        : `${pieces.slice(0, -1).join("")}.${pieces.at(-1)}`;
    } else if (lastDot >= 0) {
      const pieces = text.split(".");
      if (pieces.length > 2) {
        normalized = pieces.join("");
      } else {
        const [left, right = ""] = pieces;
        const looksLikeThousands = right.length === 3 && left.length >= 1 && left !== "0";
        normalized = looksLikeThousands ? `${left}${right}` : `${left}.${right}`;
      }
    }

    const number = Number(normalized);
    if (!Number.isFinite(number)) return NaN;
    return negative ? -number : number;
  }

  function formatIntegerDigits(digits) {
    const clean = String(digits || "").replace(/\D/g, "").replace(/^0+(?=\d)/, "") || "0";
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function normalizeTypedMoney(value) {
    let text = String(value ?? "");
    const negative = /^\s*-/.test(text);
    text = text.replace(/[^0-9.,]/g, "");

    const commaIndex = text.indexOf(",");
    const hasDecimalSeparator = commaIndex >= 0;
    const hasAnyDigit = /\d/.test(text);
    if (!hasAnyDigit && !hasDecimalSeparator) {
      return { display: negative ? "-" : "", numeric: NaN, numericText: "", hasDecimalSeparator: false, decimalDigits: "" };
    }
    const integerSource = hasDecimalSeparator ? text.slice(0, commaIndex) : text;
    const decimalSource = hasDecimalSeparator ? text.slice(commaIndex + 1) : "";
    const integerDigits = integerSource.replace(/\D/g, "").replace(/^0+(?=\d)/, "") || "0";
    const decimalDigits = decimalSource.replace(/\D/g, "").slice(0, 8);
    const sign = negative ? "-" : "";
    const display = `${sign}${formatIntegerDigits(integerDigits)}${hasDecimalSeparator ? `,${decimalDigits}` : ""}`;
    const numeric = Number(`${sign}${integerDigits}${decimalDigits ? `.${decimalDigits}` : ""}`);

    return {
      display,
      numeric: Number.isFinite(numeric) ? numeric : NaN,
      numericText: Number.isFinite(numeric) ? String(numeric) : "",
      hasDecimalSeparator,
      decimalDigits
    };
  }

  function formatInputNumber(value) {
    const number = typeof value === "number" ? value : parseLocaleNumber(value);
    if (!Number.isFinite(number)) return "";

    const absolute = Math.abs(number);
    const raw = Number.isInteger(absolute)
      ? String(absolute)
      : absolute.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
    const [integerPart, decimalPart = ""] = raw.split(".");
    return `${number < 0 ? "-" : ""}${formatIntegerDigits(integerPart)}${decimalPart ? `,${decimalPart}` : ""}`;
  }

  function caretAfterSameDigits(display, rawBeforeCaret) {
    const commaInRaw = rawBeforeCaret.indexOf(",");

    if (commaInRaw >= 0 && display.includes(",")) {
      const decimalsBeforeCaret = rawBeforeCaret.slice(commaInRaw + 1).replace(/\D/g, "").length;
      return Math.min(display.length, display.indexOf(",") + 1 + decimalsBeforeCaret);
    }

    const digitsBeforeCaret = rawBeforeCaret.replace(/\D/g, "").length;
    if (!digitsBeforeCaret) return display.startsWith("-") ? 1 : 0;

    let seen = 0;
    for (let index = 0; index < display.length; index += 1) {
      if (/\d/.test(display[index])) seen += 1;
      if (seen >= digitsBeforeCaret) return index + 1;
    }
    return display.length;
  }

  function setMoneyInputValue(input, number, displayOverride = null) {
    const valid = Number.isFinite(Number(number));
    const numericText = valid ? String(Number(number)) : "";
    const display = displayOverride ?? (valid ? formatInputNumber(Number(number)) : "");

    input.dataset.numericValue = numericText;
    input.dataset.lastFormattedValue = display;
    input.value = display;
    input.setCustomValidity("");
  }

  function validateEnhancedMoneyInput(input) {
    const value = input.dataset.numericValue;
    const required = input.required;

    if (!value) {
      input.setCustomValidity(required ? "Nominal wajib diisi." : "");
      return !required;
    }

    const number = Number(value);
    if (!Number.isFinite(number)) {
      input.setCustomValidity("Nominal tidak valid.");
      return false;
    }

    const min = input.getAttribute("min");
    const max = input.getAttribute("max");
    if (min !== null && number < Number(min)) {
      input.setCustomValidity(`Nominal minimal ${formatInputNumber(Number(min))}.`);
      return false;
    }
    if (max !== null && number > Number(max)) {
      input.setCustomValidity(`Nominal maksimal ${formatInputNumber(Number(max))}.`);
      return false;
    }

    input.setCustomValidity("");
    return true;
  }

  function handleMoneyInput(event) {
    const input = event.currentTarget;
    let raw = input.value;
    let caret = input.selectionStart ?? raw.length;

    if (event.data === "." && event.inputType?.startsWith("insert")) {
      raw = `${raw.slice(0, Math.max(0, caret - 1))},${raw.slice(caret)}`;
    }

    const normalized = normalizeTypedMoney(raw);

    input.dataset.numericValue = normalized.numericText;
    input.dataset.lastFormattedValue = normalized.display;
    input.value = normalized.display;
    input.setCustomValidity("");

    const nextCaret = caretAfterSameDigits(normalized.display, raw.slice(0, caret));
    try { input.setSelectionRange(nextCaret, nextCaret); } catch {}

    if (input.closest("#transactionForm")) updateTransactionSmartHints();
    if (input.id === "v11ConverterAmount") renderCurrencyConverterResult();
  }

  function handleMoneyPaste(event) {
    const input = event.currentTarget;
    const pasted = event.clipboardData?.getData("text") || "";
    const parsed = parseLocaleNumber(pasted);
    if (!Number.isFinite(parsed)) return;

    event.preventDefault();
    setMoneyInputValue(input, parsed);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function handleMoneyKeydown(event) {
    const input = event.currentTarget;
    if (event.key !== "Backspace" && event.key !== "Delete") return;
    if (input.selectionStart !== input.selectionEnd) return;

    const position = input.selectionStart ?? 0;
    const adjacentIndex = event.key === "Backspace" ? position - 1 : position;
    if (input.value[adjacentIndex] !== ".") return;

    event.preventDefault();
    const digitIndex = event.key === "Backspace" ? adjacentIndex - 1 : adjacentIndex + 1;
    if (digitIndex < 0 || digitIndex >= input.value.length) return;

    const next = `${input.value.slice(0, digitIndex)}${input.value.slice(digitIndex + 1)}`;
    input.value = next;
    input.setSelectionRange(Math.max(0, digitIndex), Math.max(0, digitIndex));
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: event.key === "Backspace" ? "deleteContentBackward" : "deleteContentForward" }));
  }

  function handleMoneyBlur(event) {
    const input = event.currentTarget;
    const raw = input.dataset.numericValue;
    const number = raw === "" || raw === undefined ? NaN : Number(raw);
    setMoneyInputValue(input, Number.isFinite(number) ? number : NaN);
  }

  function enhanceMoneyInputs(root) {
    if (!state?.settings?.smartNumberFormatting) return;
    const candidates = [];
    if (root instanceof HTMLInputElement) candidates.push(root);
    root.querySelectorAll?.("input").forEach((input) => candidates.push(input));
    candidates.filter(isMoneyInput).forEach(enhanceMoneyInput);
  }

  function enhanceMoneyInput(input) {
    if (input.dataset.v11MoneyEnhanced === "true") {
      refreshEnhancedMoneyValue(input);
      return;
    }

    const parsed = parseLocaleNumber(input.value);
    input.dataset.v11MoneyEnhanced = "true";
    input.dataset.originalType = input.type;
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";

    input.addEventListener("input", handleMoneyInput);
    input.addEventListener("paste", handleMoneyPaste);
    input.addEventListener("keydown", handleMoneyKeydown);
    input.addEventListener("blur", handleMoneyBlur);
    setMoneyInputValue(input, parsed);
  }

  function disableMoneyInput(input) {
    if (input.dataset.v11MoneyEnhanced !== "true") return;
    const numeric = input.dataset.numericValue || "";

    input.removeEventListener("input", handleMoneyInput);
    input.removeEventListener("paste", handleMoneyPaste);
    input.removeEventListener("keydown", handleMoneyKeydown);
    input.removeEventListener("blur", handleMoneyBlur);
    input.type = input.dataset.originalType || "number";
    input.value = numeric;
    delete input.dataset.v11MoneyEnhanced;
    delete input.dataset.lastFormattedValue;
    input.setCustomValidity("");
  }

  function applyMoneyFormattingSetting(enabled) {
    document.querySelectorAll('input[data-v11-money-enhanced="true"]').forEach((input) => {
      if (!enabled) disableMoneyInput(input);
    });
    if (enabled) enhanceMoneyInputs(document);
  }

  function refreshEnhancedMoneyValue(input) {
    if (!input || input.dataset.v11MoneyEnhanced !== "true") return;

    const valueWasChangedExternally = input.value !== (input.dataset.lastFormattedValue ?? input.value);
    const stored = input.dataset.numericValue;
    const parsed = valueWasChangedExternally
      ? parseLocaleNumber(input.value)
      : (stored === "" || stored === undefined ? NaN : Number(stored));
    setMoneyInputValue(input, Number.isFinite(parsed) ? parsed : NaN);
  }

  function normalizeMoneyInputsForSubmit(form, event) {
    const inputs = Array.from(form.querySelectorAll('input[data-v11-money-enhanced="true"]'));
    const invalid = inputs.find((input) => !validateEnhancedMoneyInput(input));

    if (invalid) {
      event?.preventDefault();
      event?.stopImmediatePropagation();
      invalid.reportValidity();
      invalid.focus();
      return false;
    }

    inputs.forEach((input) => { input.value = input.dataset.numericValue || ""; });
    window.setTimeout(() => inputs.forEach((input) => {
      if (!input.isConnected || input.dataset.v11MoneyEnhanced !== "true") return;
      const current = input.value;
      const stored = input.dataset.numericValue;
      const number = current !== "" ? Number(current) : (stored === "" || stored === undefined ? NaN : Number(stored));
      setMoneyInputValue(input, Number.isFinite(number) ? number : NaN);
    }), 0);
    return true;
  }

  function enhanceTransactionForm() {
    const form = document.getElementById("transactionForm");
    if (!form || form.dataset.v11Enhanced === "true") return;
    form.dataset.v11Enhanced = "true";
    enhanceMoneyInputs(form);
    if (state.settings.smartAutocomplete) {
      attachSmartSuggestions(document.getElementById("txDescription"), "description");
      attachSmartSuggestions(document.getElementById("txMerchant"), "merchant");
    }
    const categoryField = document.getElementById("categoryField");
    categoryField?.insertAdjacentHTML("beforeend", '<div class="v11-category-suggestion" id="v11CategorySuggestion" hidden></div>');
    const actions = form.querySelector(".form-actions");
    actions?.insertAdjacentHTML("beforebegin", '<div class="v11-transaction-hints" id="v11TransactionHints"></div>');
    ["txDescription", "txMerchant", "txDate", "txAccount", "txType", "txCategory", "txDestinationAccount", "txDestinationAmount"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", updateTransactionSmartHints);
      document.getElementById(id)?.addEventListener("change", updateTransactionSmartHints);
    });

    document.getElementById("proTxTemplate")?.addEventListener("change", () => window.setTimeout(() => {
      const amount = document.getElementById("txAmount");
      if (amount) refreshEnhancedMoneyValue(amount);
      document.getElementById("txDescription")?.dispatchEvent(new Event("input", { bubbles: true }));
      document.getElementById("txMerchant")?.dispatchEvent(new Event("input", { bubbles: true }));
      updateTransactionSmartHints();
    }, 0));

    updateTransactionSmartHints();
  }

  function suggestionSource(kind) {
    const map = new Map();
    const add = (value, detail, category, merchant = "") => {
      const key = normalizeText(value);
      if (!key) return;
      const row = map.get(key) || { value: String(value).trim(), count: 0, detail, category, merchant };
      row.count += 1;
      row.detail = detail || row.detail;
      row.category = category || row.category;
      row.merchant = merchant || row.merchant;
      map.set(key, row);
    };
    (state.transactions || []).forEach((tx) => add(kind === "description" ? tx.description : tx.merchant, `${tx.merchant || tx.description} · ${tx.category}`, tx.category, tx.merchant));
    if (kind === "description") {
      (state.recurring || []).forEach((item) => add(item.name, `${item.provider || "Rutin"} · ${item.category}`, item.category, item.provider || ""));
      (state.transactionTemplates || []).forEach((item) => add(item.description, `${item.merchant || "Template"} · ${item.category}`, item.category, item.merchant || ""));
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "id"));
  }

  function attachSmartSuggestions(input, kind) {
    if (!input || input.dataset.v11SuggestEnhanced === "true") return;
    input.dataset.v11SuggestEnhanced = "true";
    input.parentElement.classList.add("v11-suggest-anchor");

    const box = document.createElement("div");
    box.className = "v11-suggestion-box";
    box.hidden = true;
    box.dataset.activeIndex = "-1";
    input.parentElement.appendChild(box);

    const highlight = (nextIndex) => {
      const buttons = Array.from(box.querySelectorAll(".v11-suggestion-item"));
      if (!buttons.length) return;
      const index = (nextIndex + buttons.length) % buttons.length;
      buttons.forEach((button, rowIndex) => button.classList.toggle("active", rowIndex === index));
      box.dataset.activeIndex = String(index);
      buttons[index].scrollIntoView({ block: "nearest" });
    };

    const render = () => {
      const query = normalizeText(input.value);
      if (query.length < 2) {
        box.hidden = true;
        box.dataset.activeIndex = "-1";
        return;
      }

      const results = suggestionSource(kind)
        .map((item) => {
          const key = normalizeText(item.value);
          const score = key.startsWith(query) ? 0 : key.includes(query) ? 1 : 2;
          return { ...item, score };
        })
        .filter((item) => item.score < 2)
        .sort((a, b) => a.score - b.score || b.count - a.count)
        .slice(0, 7);

      box.innerHTML = results.map((item) => `<button type="button" class="v11-suggestion-item" data-v11-suggestion-kind="${kind}" data-v11-suggestion-value="${escapeHTML(item.value)}" data-v11-suggestion-category="${escapeHTML(item.category || "")}" data-v11-suggestion-merchant="${escapeHTML(item.merchant || "")}"><span>${kind === "description" ? "🧾" : "🏪"}</span><span><strong>${escapeHTML(item.value)}</strong><small>${escapeHTML(item.detail || `${item.count}× digunakan`)}</small></span><em>${item.count}×</em></button>`).join("");
      box.hidden = !results.length;
      box.dataset.activeIndex = "-1";
      activeSuggestionBox = box.hidden ? null : box;
    };

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("blur", () => window.setTimeout(() => { box.hidden = true; }, 160));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        box.hidden = true;
        box.dataset.activeIndex = "-1";
        return;
      }
      if (box.hidden) return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const current = Number(box.dataset.activeIndex || -1);
        highlight(current + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Enter") {
        const active = box.querySelector(".v11-suggestion-item.active");
        if (active) {
          event.preventDefault();
          active.click();
        }
      }
    });
  }

  function suggestedCategory() {
    if (!state.settings.smartCategorySuggestion) return null;
    const type = document.getElementById("txType")?.value;
    if (type === "transfer") return null;
    const merchant = normalizeText(document.getElementById("txMerchant")?.value);
    const description = normalizeText(document.getElementById("txDescription")?.value);
    if (!merchant && description.length < 3) return null;
    const counts = new Map();
    (state.transactions || []).forEach((tx) => {
      if (tx.type !== type || !tx.category) return;
      const merchantMatch = merchant && normalizeText(tx.merchant) === merchant;
      const descriptionMatch = description && normalizeText(tx.description).includes(description.slice(0, Math.min(description.length, 12)));
      if (merchantMatch || descriptionMatch) counts.set(tx.category, (counts.get(tx.category) || 0) + (merchantMatch ? 3 : 1));
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }

  function updateTransactionSmartHints() {
    const form = document.getElementById("transactionForm");
    if (!form) return;
    const suggestion = suggestedCategory();
    const suggestionBox = document.getElementById("v11CategorySuggestion");
    const currentCategory = document.getElementById("txCategory")?.value;
    if (suggestionBox) {
      suggestionBox.hidden = !suggestion || suggestion === currentCategory;
      suggestionBox.innerHTML = suggestion && suggestion !== currentCategory ? `💡 Biasanya dikategorikan sebagai <strong>${escapeHTML(suggestion)}</strong> <button type="button" data-v11-use-category="${escapeHTML(suggestion)}">Gunakan</button>` : "";
    }

    const hints = [];
    if (state.settings.smartDuplicateWarning) {
      const desc = normalizeText(document.getElementById("txDescription")?.value);
      const date = document.getElementById("txDate")?.value;
      const account = document.getElementById("txAccount")?.value;
      const amountInput = document.getElementById("txAmount");
      const amount = Number(amountInput?.dataset.numericValue || amountInput?.value || 0);
      if (desc && date && account && amount > 0) {
        const duplicate = (state.transactions || []).find((tx) => tx.date === date && tx.accountId === account && Math.abs(safeNumber(tx.amount) - amount) < 0.000001 && normalizeText(tx.description) === desc && tx.id !== form.dataset.editingId);
        if (duplicate) hints.push(`<div class="v11-hint warn">⚠️ Transaksi sangat mirip sudah ada: <strong>${escapeHTML(duplicate.description)}</strong> · ${formatCurrency(duplicate.amount, duplicate.currency)}</div>`);
      }
    }

    if (state.settings.smartTransferConversion && document.getElementById("txType")?.value === "transfer") {
      const source = state.accounts.find((item) => item.id === document.getElementById("txAccount")?.value);
      const target = state.accounts.find((item) => item.id === document.getElementById("txDestinationAccount")?.value);
      const amountInput = document.getElementById("txAmount");
      const amount = Number(amountInput?.dataset.numericValue || amountInput?.value || 0);
      if (source && target && source.currency !== target.currency && amount > 0) {
        const converted = convertCurrency(amount, source.currency, target.currency);
        if (converted !== null) hints.push(`<div class="v11-hint info">💱 Estimasi ${formatCurrency(amount, source.currency)} = <strong>${formatCurrency(converted, target.currency)}</strong> <button type="button" data-v11-use-converted="${converted}">Isi nominal tujuan</button></div>`);
      }
    }
    const container = document.getElementById("v11TransactionHints");
    if (container) container.innerHTML = hints.join("");
  }

  function replaceCurrencySyncButton() {
    const old = document.getElementById("syncRatesButton");
    if (!old || old.dataset.v11Currency === "true") return;
    const button = old.cloneNode(true);
    button.dataset.v11Currency = "true";
    old.replaceWith(button);
    button.addEventListener("click", async () => {
      const before = state.lastRateUpdate;
      await syncRates();
      renderCurrencyWorkbench();
      renderSmartCurrencyPreview();
      if (state.lastRateUpdate && state.lastRateUpdate !== before) {
        const base = state.settings.baseCurrency;
        const baseRate = convertCurrency(1, "USD", base);
        showToast(`Kurs diperbarui · 1 USD = ${formatRateNumber(baseRate)} ${base}`, "💱");
      }
    });
  }

  function renderCurrencyWorkbench() {
    if (!state) return;
    const form = document.getElementById("manualRateForm");
    const panel = form?.closest(".panel");
    if (!panel) return;
    let container = document.getElementById("v11CurrencyWorkbench");
    if (!container) {
      container = document.createElement("div");
      container.id = "v11CurrencyWorkbench";
      container.className = "v11-currency-workbench";
      form.insertAdjacentElement("beforebegin", container);
    }
    const base = state.settings.baseCurrency;
    const existingAmount = document.getElementById("v11ConverterAmount")?.dataset.numericValue || "1000000";
    const existingFrom = document.getElementById("v11ConverterFrom")?.value || base;
    const existingTo = document.getElementById("v11ConverterTo")?.value || (base === "USD" ? "IDR" : "USD");
    container.innerHTML = `
      <header><div><h4>💱 Kalkulator Kurs Langsung</h4><p>Nilai konversi tampil langsung dan diperbarui setelah tombol Sinkronkan ditekan.</p></div><span class="v11-rate-time">${state.lastRateUpdate ? formatDateTime(state.lastRateUpdate) : "Kurs bawaan"}</span></header>
      <div class="v11-converter-grid"><label class="field"><span>Nominal</span><input class="input" id="v11ConverterAmount" data-money-input="true" value="${escapeHTML(existingAmount)}"></label><label class="field"><span>Dari</span><select class="input" id="v11ConverterFrom">${currencyOptions(existingFrom)}</select></label><button class="v11-swap-currency" id="v11SwapCurrency" type="button">⇄</button><label class="field"><span>Ke</span><select class="input" id="v11ConverterTo">${currencyOptions(existingTo)}</select></label></div>
      <div class="v11-converter-result" id="v11ConverterResult"></div>
      <div class="v11-live-rates" id="v11LiveRates"></div>`;
    enhanceMoneyInputs(container);
    ["v11ConverterAmount", "v11ConverterFrom", "v11ConverterTo"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", renderCurrencyConverterResult);
      document.getElementById(id)?.addEventListener("change", renderCurrencyConverterResult);
    });
    document.getElementById("v11SwapCurrency")?.addEventListener("click", () => {
      const from = document.getElementById("v11ConverterFrom");
      const to = document.getElementById("v11ConverterTo");
      [from.value, to.value] = [to.value, from.value];
      renderCurrencyConverterResult();
    });
    renderCurrencyConverterResult();
  }

  function renderCurrencyConverterResult() {
    const amountInput = document.getElementById("v11ConverterAmount");
    const from = document.getElementById("v11ConverterFrom")?.value;
    const to = document.getElementById("v11ConverterTo")?.value;
    const result = document.getElementById("v11ConverterResult");
    if (!amountInput || !from || !to || !result) return;
    const amount = Number(amountInput.dataset.numericValue || parseLocaleNumber(amountInput.value));
    const converted = convertCurrency(amount || 0, from, to);
    const unit = convertCurrency(1, from, to);
    result.innerHTML = converted === null ? '<span class="negative">Kurs belum tersedia.</span>' : `<span>${formatCurrency(amount || 0, from)}</span><strong>＝ ${formatCurrency(converted, to)}</strong><small>1 ${from} = ${formatRateNumber(unit)} ${to}</small>`;
    const favorites = Array.from(new Set([state.settings.baseCurrency, ...(state.settings.favoriteCurrencies || [])])).slice(0, 7);
    document.getElementById("v11LiveRates").innerHTML = favorites.filter((code) => code !== from).map((code) => `<div><span>1 ${from}</span><strong>${formatRateNumber(convertCurrency(1, from, code))} ${code}</strong></div>`).join("");
  }

  function formatRateNumber(value) {
    if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) return "—";
    const number = Number(value);
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: Math.abs(number) < 1 ? 6 : 2 }).format(number);
  }

  function runV11Audit() {
    const issues = [];
    const add = (severity, title, detail) => issues.push({ severity, title, detail });
    const ids = new Set();
    ["accounts", "transactions", "budgets", "goals", "recurring", "debts", "investments"].forEach((collection) => {
      (state[collection] || []).forEach((item) => {
        if (!item.id) add("bad", `${collection}: ID kosong`, item.name || item.description || "Data tanpa nama");
        else if (ids.has(item.id)) add("bad", "ID duplikat", `${collection} · ${item.id}`);
        else ids.add(item.id);
      });
    });
    const categoryNames = new Set(state.categoryCatalog.map((item) => normalizeText(item.name)));
    discoveredCategoryNames().forEach((name) => { if (!categoryNames.has(normalizeText(name))) add("warn", "Kategori belum terdaftar", name); });
    (state.transactions || []).forEach((tx) => {
      if (!Number.isFinite(Number(tx.amount)) || Number(tx.amount) < 0) add("bad", "Nominal transaksi tidak valid", tx.description || tx.id);
      if (!state.accounts.some((account) => account.id === tx.accountId)) add("bad", "Transaksi kehilangan akun", tx.description || tx.id);
      if (tx.splits?.length) {
        const split = tx.splits.reduce((sum, item) => sum + safeNumber(item.amount), 0);
        if (Math.abs(split - safeNumber(tx.amount)) > 0.01) add("warn", "Split tidak seimbang", tx.description || tx.id);
      }
    });
    const normalizedNames = new Map();
    state.categoryCatalog.forEach((item) => {
      const key = normalizeText(item.name);
      if (normalizedNames.has(key)) add("warn", "Nama kategori mirip/duplikat", `${normalizedNames.get(key)} dan ${item.name}`);
      else normalizedNames.set(key, item.name);
    });
    if (!rateFor(state.settings.baseCurrency)) add("bad", "Kurs mata uang utama kosong", state.settings.baseCurrency);
    lastAudit = { at: nowIso(), issues };
    renderV11AuditResults();
    return lastAudit;
  }

  function renderV11AuditResults() {
    const container = document.getElementById("v11AuditResults");
    if (!container || !lastAudit) return;
    const bad = lastAudit.issues.filter((item) => item.severity === "bad").length;
    const warn = lastAudit.issues.filter((item) => item.severity === "warn").length;
    container.innerHTML = lastAudit.issues.length ? `<div class="v11-audit-summary"><span class="v10-badge ${bad ? "bad" : "good"}">${bad} kritis</span><span class="v10-badge ${warn ? "warn" : "good"}">${warn} peringatan</span><small>${formatDateTime(lastAudit.at)}</small></div><div class="v11-audit-list">${lastAudit.issues.slice(0, 30).map((item) => `<div class="v11-audit-item ${item.severity}"><span>${item.severity === "bad" ? "❌" : "⚠️"}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.detail)}</small></div></div>`).join("")}</div>` : '<div class="v11-audit-ok">✅ Tidak ditemukan masalah struktural pada pemeriksaan v11.</div>';
  }


  function refreshV11SystemVersion() {
    const versionBadge = document.querySelector("#system .section-header .version-badge");
    if (versionBadge) versionBadge.textContent = VERSION_LABEL;
    const bannerStrong = document.querySelector("#v10PanelUpdate .v10-update-banner strong");
    if (bannerStrong && !/baru siap/i.test(bannerStrong.textContent)) bannerStrong.textContent = "Aplikasi menggunakan v11.1";
    const bannerText = document.querySelector("#v10PanelUpdate .v10-update-banner p");
    if (bannerText) bannerText.textContent = bannerText.textContent.replace(/charisna-money-management-v10-production/g, "charisna-money-management-v11-1-stable");
    const versionCards = document.querySelectorAll("#v10PanelUpdate .v10-stat strong");
    if (versionCards[0]) versionCards[0].textContent = "v11.1";
    const versionSmall = versionCards[0]?.parentElement?.querySelector("small");
    if (versionSmall) versionSmall.textContent = "Stability & Input Fix";
  }

  function renderV11Changelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container || document.getElementById("v11ReleaseCard")) return;
    container.insertAdjacentHTML("afterbegin", `
      <article class="release-card latest" id="v11ReleaseCard">
        <div class="release-head"><div><span class="release-kicker">VERSI TERBARU</span><h3>${VERSION_LABEL}</h3><p>Perbaikan kritis formatter nominal, validasi input, kategori legacy, autocomplete keyboard, kurs kosong, dan stabilitas form.</p></div><span class="version-badge">v11.1</span></div>
        <div class="release-feature-grid">
          <div><span>🏷️</span><p><strong>Category Studio</strong>Tambah kategori pemasukan/pengeluaran, edit ikon dan warna, induk, favorit, arsip, urutan, dan gabungkan.</p></div>
          <div><span>10.000</span><p><strong>Formatter Diperbaiki</strong>Nominal kini dapat terus diketik hingga jutaan/triliunan, mendukung desimal koma, paste, backspace, dan edit posisi kursor.</p></div>
          <div><span>✨</span><p><strong>Autocomplete</strong>Nama transaksi dan merchant lama muncul setelah beberapa huruf.</p></div>
          <div><span>🧠</span><p><strong>Saran Pintar</strong>Saran kategori dari riwayat merchant, peringatan duplikat, dan estimasi transfer beda mata uang.</p></div>
          <div><span>💱</span><p><strong>Currency Workbench</strong>Kalkulator kurs, nominal hasil konversi, nilai kurs favorit, dan pembaruan langsung.</p></div>
          <div><span>📗</span><p><strong>Excel Lebih Lengkap</strong>Sheet kategori dan tag ditambahkan ke workbook profesional.</p></div>
        </div>
        <div class="release-notes"><span>Kompatibilitas</span><p>Data v10 tetap digunakan. Tidak memerlukan SQL Supabase baru.</p></div>
      </article>`);
    const previousLatest = container.querySelector("#v10ReleaseCard");
    previousLatest?.classList.remove("latest");
  }

  function bindV11Events() {
    document.addEventListener("submit", (event) => {
      if (event.target instanceof HTMLFormElement) normalizeMoneyInputsForSubmit(event.target, event);
    }, true);

    document.addEventListener("click", async (event) => {
      const target = event.target.closest("button,[data-v11-studio-tab]");
      if (!target) {
        if (activeSuggestionBox && !event.target.closest(".v11-suggest-anchor")) activeSuggestionBox.hidden = true;
        return;
      }
      try {
        if (target.dataset.v11StudioTab) setStudioTab(target.dataset.v11StudioTab);
        if (target.id === "v11AddCategory") openCategoryForm();
        if (target.id === "v11MergeCategory") openMergeCategoryForm();
        if (target.id === "v11AddTag") openTagForm();
        if (target.id === "v11RunAudit") runV11Audit();
        if (target.id === "v11OpenCurrencySettings") changeSection("settings");
        if (target.dataset.v11CategoryEdit) openCategoryForm(state.categoryCatalog.find((item) => item.id === target.dataset.v11CategoryEdit));
        if (target.dataset.v11CategoryArchive) await toggleCategoryArchive(target.dataset.v11CategoryArchive);
        if (target.dataset.v11CategoryDelete) await deleteUnusedCategory(target.dataset.v11CategoryDelete);
        if (target.dataset.v11CategoryPin) await toggleCategoryPin(target.dataset.v11CategoryPin);
        if (target.dataset.v11CategoryUp) await moveCategory(target.dataset.v11CategoryUp, -1);
        if (target.dataset.v11CategoryDown) await moveCategory(target.dataset.v11CategoryDown, 1);
        if (target.dataset.v11TagEdit) openTagForm(state.tagCatalog.find((item) => item.id === target.dataset.v11TagEdit));
        if (target.dataset.v11TagArchive) await toggleTagArchive(target.dataset.v11TagArchive);
        if (target.dataset.v11TagDelete) await deleteTag(target.dataset.v11TagDelete);
        if (target.dataset.v11SuggestionValue !== undefined) applySuggestion(target);
        if (target.dataset.v11UseCategory) {
          const select = document.getElementById("txCategory");
          if (select) { select.value = target.dataset.v11UseCategory; updateTransactionSmartHints(); }
        }
        if (target.dataset.v11UseConverted) {
          const input = document.getElementById("txDestinationAmount");
          if (input) { input.dataset.numericValue = target.dataset.v11UseConverted; input.value = formatInputNumber(Number(target.dataset.v11UseConverted)); }
        }
      } catch (error) {
        console.error(error);
        showToast(error?.message || "Operasi v11 gagal.", "❗");
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id === "v11CategorySearch") { categorySearch = event.target.value; renderCategoryList(); }
    });
    document.addEventListener("change", async (event) => {
      if (event.target.id === "v11CategoryTypeFilter") { categoryTypeFilter = event.target.value; renderCategoryList(); }
      if (event.target.id === "v11CategoryVisibility") { categoryVisibilityFilter = event.target.value; renderCategoryList(); }
      if (event.target.id === "manualRateCurrency") {
        window.setTimeout(() => refreshEnhancedMoneyValue(document.getElementById("manualRateValue")), 0);
      }
      const settingMap = {
        v11SmartNumber: "smartNumberFormatting",
        v11SmartAutocomplete: "smartAutocomplete",
        v11SmartCategory: "smartCategorySuggestion",
        v11SmartDuplicate: "smartDuplicateWarning",
        v11SmartTransfer: "smartTransferConversion"
      };
      const key = settingMap[event.target.id];
      if (key && state) {
        state.settings[key] = event.target.checked;
        if (key === "smartNumberFormatting") applyMoneyFormattingSetting(event.target.checked);
        await encryptState();
        showToast("Pengaturan Smart Input diperbarui.", "✨");
      }
    });
  }

  function applySuggestion(button) {
    const kind = button.dataset.v11SuggestionKind;
    const input = document.getElementById(kind === "description" ? "txDescription" : "txMerchant");
    if (input) {
      input.value = button.dataset.v11SuggestionValue;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const merchantInput = document.getElementById("txMerchant");
    if (kind === "description" && merchantInput && !merchantInput.value && button.dataset.v11SuggestionMerchant) {
      merchantInput.value = button.dataset.v11SuggestionMerchant;
      merchantInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const category = button.dataset.v11SuggestionCategory;
    if (category && state.settings.smartCategorySuggestion) {
      const box = document.getElementById("v11CategorySuggestion");
      if (box) { box.hidden = false; box.innerHTML = `💡 Gunakan kategori sebelumnya <strong>${escapeHTML(category)}</strong> <button type="button" data-v11-use-category="${escapeHTML(category)}">Gunakan</button>`; }
    }
    button.closest(".v11-suggestion-box")?.setAttribute("hidden", "");
    updateTransactionSmartHints();
  }

  async function toggleCategoryArchive(id) {
    const item = state.categoryCatalog.find((row) => row.id === id);
    if (!item) return;
    await commit(item.archived ? "Kategori diaktifkan" : "Kategori diarsipkan", item.name, () => { item.archived = !item.archived; item.updatedAt = nowIso(); });
    renderCategoryStudio();
  }

  async function deleteUnusedCategory(id) {
    const item = state.categoryCatalog.find((row) => row.id === id);
    if (!item || item.builtinKey || categoryUsage(item.name).total > 0) return showToast("Kategori masih digunakan atau merupakan kategori bawaan.", "❗");
    if (!confirm(`Hapus kategori “${item.name}” secara permanen?`)) return;
    await commit("Kategori dihapus", item.name, () => { state.categoryCatalog = state.categoryCatalog.filter((row) => row.id !== id); syncRuntimeCategories(); });
    renderCategoryStudio();
  }

  async function toggleCategoryPin(id) {
    const item = state.categoryCatalog.find((row) => row.id === id);
    if (!item) return;
    await commit("Favorit kategori diperbarui", item.name, () => { item.pinned = !item.pinned; });
    renderCategoryStudio();
  }

  async function moveCategory(id, direction) {
    const sorted = [...state.categoryCatalog].sort((a, b) => safeNumber(a.order) - safeNumber(b.order));
    const index = sorted.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sorted.length) return;
    await commit("Urutan kategori diperbarui", sorted[index].name, () => {
      const currentOrder = sorted[index].order;
      sorted[index].order = sorted[target].order;
      sorted[target].order = currentOrder;
    });
    renderCategoryStudio();
  }

  async function toggleTagArchive(id) {
    const item = state.tagCatalog.find((row) => row.id === id);
    if (!item) return;
    await commit(item.archived ? "Tag diaktifkan" : "Tag diarsipkan", item.name, () => { item.archived = !item.archived; });
    renderTagList();
  }

  async function deleteTag(id) {
    const item = state.tagCatalog.find((row) => row.id === id);
    if (!item) return;
    const usage = tagUsage(item.name);
    if (!confirm(usage ? `Hapus tag “${item.name}” dari ${usage} data?` : `Hapus tag “${item.name}”?`)) return;
    await commit("Tag dihapus", item.name, () => { replaceTagReferences(item.name, null); state.tagCatalog = state.tagCatalog.filter((row) => row.id !== id); });
    renderTagList();
  }

  const previousOpenTransactionForm = openTransactionForm;
  openTransactionForm = function v11OpenTransactionForm(existing = null, prefill = {}) {
    previousOpenTransactionForm(existing, prefill);
    window.setTimeout(() => {
      const form = document.getElementById("transactionForm");
      if (form && existing?.id) form.dataset.editingId = existing.id;
      enhanceTransactionForm();
    }, 80);
  };

  const previousRenderSettings = renderSettings;
  renderSettings = function v11RenderSettings() {
    previousRenderSettings();
    replaceCurrencySyncButton();
    const manualRate = document.getElementById("manualRateValue");
    if (manualRate) {
      if (manualRate.dataset.v11MoneyEnhanced !== "true") enhanceMoneyInput(manualRate);
      else refreshEnhancedMoneyValue(manualRate);
    }
    renderCurrencyWorkbench();
  };

  const previousRenderAll = renderAll;
  renderAll = function v11RenderAll() {
    if (state) ensureV11State();
    previousRenderAll();
    renderCategoryStudio();
    renderCurrencyWorkbench();
    if (lastAudit) renderV11AuditResults();
    refreshV11SystemVersion();
    renderV11Changelog();
    enhanceMoneyInputs(document);
  };

  const previousChangeSection = changeSection;
  changeSection = function v11ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    if (sectionId === "categories") renderCategoryStudio();
    if (sectionId === "settings") renderCurrencyWorkbench();
    if (sectionId === "system") refreshV11SystemVersion();
    if (sectionId === "updates") renderV11Changelog();
  };

  const previousUnlockApplication = unlockApplication;
  unlockApplication = function v11UnlockApplication() {
    const changed = ensureV11State();
    previousUnlockApplication();
    if (changed) encryptState().catch(console.error);
    window.setTimeout(() => {
      renderCategoryStudio();
      renderCurrencyWorkbench();
      refreshV11SystemVersion();
      renderV11Changelog();
      enhanceMoneyInputs(document);
    }, 250);
  };

  injectV11UI();
})();
