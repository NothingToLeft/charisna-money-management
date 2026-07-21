"use strict";

(() => {
  const PATCH_VERSION = 9;
  const PATCH_LABEL = "v9.0 — Subscription Manager & Changelog";
  let subscriptionSearch = "";
  let subscriptionStatus = "all";
  let subscriptionFrequency = "all";
  let subscriptionSort = "due";
  let pendingSubscriptionExtras = null;
  let whatsNewOpening = false;

  const moneyNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const patchId = (prefix) => `${prefix}-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}`;

  function ensureV9State() {
    if (!state) return;
    state.proVersion = Math.max(Number(state.proVersion) || 0, PATCH_VERSION);
    state.settings ||= {};
    if (state.settings.lastSeenChangelogVersion === undefined) state.settings.lastSeenChangelogVersion = 0;
    if (state.settings.subscriptionDefaultView === undefined) state.settings.subscriptionDefaultView = "cards";

    (state.recurring || []).forEach((item) => {
      if (item.serviceType === undefined) item.serviceType = "subscription";
      if (item.provider === undefined) item.provider = "";
      if (item.planName === undefined) item.planName = "";
      if (item.website === undefined) item.website = "";
      if (item.cancellationUrl === undefined) item.cancellationUrl = "";
      if (item.paymentMode === undefined) item.paymentMode = "automatic";
      if (item.subscriptionNotes === undefined) item.subscriptionNotes = "";
      if (item.subscriptionTags === undefined) item.subscriptionTags = [];
      if (item.trialEndDate === undefined) item.trialEndDate = "";
      if (item.createdAt === undefined) item.createdAt = new Date().toISOString();
      if (item.updatedAt === undefined) item.updatedAt = item.createdAt;
    });
  }

  function injectV9UI() {
    SECTION_COPY.subscriptions = ["Langganan", "Kelola pengeluaran rutin, langganan, tagihan, dan riwayat pembayaran."];
    SECTION_COPY.updates = ["Pembaruan", "Detail versi, fitur baru, perbaikan, kompatibilitas, dan riwayat perubahan."];

    const nav = document.querySelector(".navigation");
    const calendarNav = nav?.querySelector('[data-section="calendar"]');
    if (nav && calendarNav && !nav.querySelector('[data-section="subscriptions"]')) {
      calendarNav.insertAdjacentHTML("beforebegin", `
        <button class="nav-button" data-section="subscriptions"><span>🔁</span>Langganan</button>
      `);
    }

    const settingsNav = nav?.querySelector('[data-section="settings"]');
    if (nav && settingsNav && !nav.querySelector('[data-section="updates"]')) {
      settingsNav.insertAdjacentHTML("beforebegin", `
        <button class="nav-button" data-section="updates"><span>📝</span>Pembaruan</button>
      `);
    }

    const calendarSection = document.getElementById("calendar");
    if (calendarSection && !document.getElementById("subscriptions")) {
      calendarSection.insertAdjacentHTML("beforebegin", subscriptionSectionHtml());
    }

    const settingsSection = document.getElementById("settings");
    if (settingsSection && !document.getElementById("updates")) {
      settingsSection.insertAdjacentHTML("beforebegin", updatesSectionHtml());
    }

    const installPanel = Array.from(document.querySelectorAll("#settings .panel")).find((panel) =>
      panel.querySelector("h4")?.textContent?.includes("Instal Aplikasi")
    );
    installPanel?.querySelector(".button-grid")?.insertAdjacentHTML("beforeend", `
      <button class="button secondary" id="v9OpenChangelog" type="button">📝 Changelog</button>
      <a class="button secondary" href="./CHANGELOG.html" target="_blank" rel="noopener">Versi Web</a>
    `);

    bindV9Events();
  }

  function subscriptionSectionHtml() {
    return `
      <section class="section" id="subscriptions">
        <header class="section-header">
          <div>
            <h3>Langganan & Tagihan Rutin</h3>
            <p>iCloud, ChatGPT, Google One, internet, listrik, asuransi, membership, dan pembayaran berkala lainnya.</p>
          </div>
          <div class="toolbar">
            <button class="button secondary" id="v9ExportSubscriptions" type="button">↓ Export CSV</button>
            <button class="button primary" id="v9AddSubscription" type="button">＋ Tambah Langganan</button>
          </div>
        </header>

        <div class="subscription-summary" id="v9SubscriptionSummary"></div>

        <article class="subscription-toolbar panel">
          <label class="subscription-search">
            <span>🔎</span>
            <input id="v9SubscriptionSearch" type="search" placeholder="Cari iCloud, ChatGPT, provider, kategori..." />
          </label>
          <select class="input" id="v9SubscriptionStatus">
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="paused">Dijeda</option>
            <option value="due">Jatuh tempo ≤ 7 hari</option>
            <option value="overdue">Terlambat</option>
          </select>
          <select class="input" id="v9SubscriptionFrequency">
            <option value="all">Semua frekuensi</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
          <select class="input" id="v9SubscriptionSort">
            <option value="due">Jatuh tempo terdekat</option>
            <option value="cost-desc">Biaya tahunan terbesar</option>
            <option value="name">Nama A–Z</option>
            <option value="recent">Terakhir diperbarui</option>
          </select>
        </article>

        <div class="subscription-due-strip" id="v9SubscriptionDueStrip"></div>
        <div class="subscription-grid" id="v9SubscriptionGrid"></div>
      </section>
    `;
  }

  function updatesSectionHtml() {
    return `
      <section class="section" id="updates">
        <header class="section-header">
          <div>
            <h3>Pembaruan & Changelog</h3>
            <p>Catatan lengkap fitur baru, perbaikan, kompatibilitas, dan petunjuk pembaruan.</p>
          </div>
          <div class="toolbar">
            <span class="version-badge">${PATCH_LABEL}</span>
            <a class="button secondary" href="./CHANGELOG.html" target="_blank" rel="noopener">Buka Halaman Publik</a>
          </div>
        </header>
        <div id="v9ChangelogContent"></div>
      </section>
    `;
  }

  function serviceTypeLabel(type) {
    return ({
      subscription: "Langganan digital",
      utility: "Tagihan rumah",
      membership: "Membership",
      insurance: "Asuransi",
      installment: "Cicilan rutin",
      donation: "Donasi rutin",
      other: "Lainnya"
    })[type] || "Langganan";
  }

  function frequencyLabel(value) {
    return ({ weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" })[value] || value;
  }

  function annualNativeCost(item) {
    const amount = moneyNumber(item.amount);
    if (item.frequency === "weekly") return amount * 52;
    if (item.frequency === "yearly") return amount;
    return amount * 12;
  }

  function monthlyNativeCost(item) {
    return annualNativeCost(item) / 12;
  }

  function annualBaseCost(item) {
    return convertCurrency(annualNativeCost(item), item.currency, state.settings.baseCurrency) || 0;
  }

  function daysUntil(dateString) {
    if (!dateString) return Number.POSITIVE_INFINITY;
    const today = new Date(`${localISO()}T00:00:00`);
    const due = new Date(`${dateString}T00:00:00`);
    return Math.round((due - today) / 86400000);
  }

  function dueText(item) {
    const days = daysUntil(item.nextDate);
    if (!Number.isFinite(days)) return "Belum dijadwalkan";
    if (days < 0) return `Terlambat ${Math.abs(days)} hari`;
    if (days === 0) return "Jatuh tempo hari ini";
    if (days === 1) return "Besok";
    return `${days} hari lagi`;
  }

  function dueClass(item) {
    const days = daysUntil(item.nextDate);
    if (days < 0) return "danger";
    if (days <= 3) return "warning";
    if (days <= 7) return "notice";
    return "normal";
  }

  function accountForRecurring(item) {
    return state.accounts.find((account) => account.id === item.accountId) || null;
  }

  function recurringPaymentHistory(item) {
    return (state.transactions || [])
      .filter((tx) => tx.sourceRecurringId === item.id || (
        tx.type === "expense" &&
        String(tx.description || "").toLowerCase() === String(item.name || "").toLowerCase() &&
        tx.accountId === item.accountId
      ))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function filteredSubscriptions() {
    const query = subscriptionSearch.trim().toLowerCase();
    let items = (state.recurring || []).filter((item) => item.type === "expense");

    items = items.filter((item) => {
      const searchable = [item.name, item.provider, item.planName, item.category, item.currency, ...(item.subscriptionTags || [])]
        .join(" ")
        .toLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (subscriptionFrequency !== "all" && item.frequency !== subscriptionFrequency) return false;
      const days = daysUntil(item.nextDate);
      if (subscriptionStatus === "active" && !item.active) return false;
      if (subscriptionStatus === "paused" && item.active) return false;
      if (subscriptionStatus === "due" && (!item.active || days < 0 || days > 7)) return false;
      if (subscriptionStatus === "overdue" && (!item.active || days >= 0)) return false;
      return true;
    });

    return items.sort((a, b) => {
      if (subscriptionSort === "name") return String(a.name).localeCompare(String(b.name), "id");
      if (subscriptionSort === "cost-desc") return annualBaseCost(b) - annualBaseCost(a);
      if (subscriptionSort === "recent") return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      return new Date(`${a.nextDate || "9999-12-31"}T00:00:00`) - new Date(`${b.nextDate || "9999-12-31"}T00:00:00`);
    });
  }

  function renderSubscriptions() {
    if (!state || !document.getElementById("v9SubscriptionGrid")) return;
    ensureV9State();

    const all = (state.recurring || []).filter((item) => item.type === "expense");
    const active = all.filter((item) => item.active);
    const annual = active.reduce((sum, item) => sum + annualBaseCost(item), 0);
    const monthly = annual / 12;
    const due30 = active
      .filter((item) => daysUntil(item.nextDate) >= 0 && daysUntil(item.nextDate) <= 30)
      .reduce((sum, item) => sum + (convertCurrency(item.amount, item.currency, state.settings.baseCurrency) || 0), 0);
    const next = [...active].sort((a, b) => daysUntil(a.nextDate) - daysUntil(b.nextDate))[0];

    document.getElementById("v9SubscriptionSummary").innerHTML = `
      <article class="subscription-stat"><span>Langganan aktif</span><strong>${active.length}</strong><small>${all.length - active.length} dijeda</small></article>
      <article class="subscription-stat"><span>Estimasi bulanan</span><strong class="money">${formatCurrency(monthly)}</strong><small>ekuivalen semua frekuensi</small></article>
      <article class="subscription-stat"><span>Estimasi tahunan</span><strong class="money">${formatCurrency(annual)}</strong><small>potensi biaya 12 bulan</small></article>
      <article class="subscription-stat"><span>Tagihan 30 hari</span><strong class="money">${formatCurrency(due30)}</strong><small>${next ? `Berikutnya: ${escapeHTML(next.name)}` : "Tidak ada jadwal"}</small></article>
    `;

    const dueSoon = active.filter((item) => daysUntil(item.nextDate) <= 7).sort((a, b) => daysUntil(a.nextDate) - daysUntil(b.nextDate));
    document.getElementById("v9SubscriptionDueStrip").innerHTML = dueSoon.length ? `
      <div class="subscription-due-header"><strong>⏰ Perlu perhatian</strong><span>${dueSoon.length} tagihan dalam 7 hari atau terlambat</span></div>
      <div class="subscription-due-items">${dueSoon.slice(0, 6).map((item) => `
        <button type="button" data-v9-action="subscription-detail" data-v9-id="${item.id}" class="subscription-due-pill ${dueClass(item)}">
          <span>${escapeHTML(item.name)}</span><strong>${dueText(item)}</strong>
        </button>
      `).join("")}</div>
    ` : "";

    const items = filteredSubscriptions();
    document.getElementById("v9SubscriptionGrid").innerHTML = items.length
      ? items.map(subscriptionCardHtml).join("")
      : `<div class="subscription-empty"><span>🔁</span><strong>Belum ada langganan yang cocok</strong><p>Tambahkan iCloud, ChatGPT, Google One, internet, atau tagihan rutin lain.</p></div>`;
  }

  function subscriptionCardHtml(item) {
    const account = accountForRecurring(item);
    const history = recurringPaymentHistory(item);
    const reminderDays = Array.isArray(item.reminderDays) && item.reminderDays.length
      ? item.reminderDays
      : (state.settings.billReminderDays || [7, 3, 1, 0]);
    const tags = (item.subscriptionTags || []).slice(0, 3);
    return `
      <article class="subscription-card ${item.active ? "" : "paused"}">
        <header>
          <div class="subscription-logo" style="--subscription-color:${item.color || "#7558ff"}">${item.icon || "🔁"}</div>
          <div class="subscription-card-title">
            <strong>${escapeHTML(item.name)}</strong>
            <span>${escapeHTML(item.provider || serviceTypeLabel(item.serviceType))}${item.planName ? ` · ${escapeHTML(item.planName)}` : ""}</span>
          </div>
          <span class="subscription-status ${item.active ? "active" : "paused"}">${item.active ? "Aktif" : "Dijeda"}</span>
        </header>

        <div class="subscription-price">
          <strong class="money">${formatCurrency(item.amount, item.currency)}</strong>
          <span>/ ${frequencyLabel(item.frequency).toLowerCase()}</span>
        </div>
        <p class="subscription-equivalent money">≈ ${formatCurrency(monthlyNativeCost(item), item.currency)} per bulan · ${formatCurrency(annualNativeCost(item), item.currency)} per tahun</p>

        <div class="subscription-meta-grid">
          <div><span>Jatuh tempo</span><strong class="${dueClass(item)}">${dueText(item)}</strong><small>${item.nextDate ? formatDate(item.nextDate) : "—"}</small></div>
          <div><span>Akun pembayaran</span><strong>${escapeHTML(account?.name || "Akun tidak ditemukan")}</strong><small>${item.paymentMode === "manual" ? "Pembayaran manual" : "Debit otomatis"}</small></div>
          <div><span>Kategori</span><strong>${escapeHTML(item.category || "Lainnya")}</strong><small>${serviceTypeLabel(item.serviceType)}</small></div>
          <div><span>Pengingat</span><strong>${item.reminderEnabled === false ? "Nonaktif" : `${reminderDays.join(", ")} hari`}</strong><small>${history.length} pembayaran tercatat</small></div>
        </div>

        ${tags.length ? `<div class="subscription-tags">${tags.map((tag) => `<span>#${escapeHTML(tag)}</span>`).join("")}</div>` : ""}

        <footer>
          <button class="button primary" data-v9-action="subscription-paid" data-v9-id="${item.id}" type="button" ${item.active ? "" : "disabled"}>✓ Bayar</button>
          <button class="button secondary" data-v9-action="subscription-detail" data-v9-id="${item.id}" type="button">Detail</button>
          <button class="mini-button" data-v9-action="subscription-edit" data-v9-id="${item.id}" type="button" title="Edit">✏️</button>
          <button class="mini-button" data-v9-action="subscription-toggle" data-v9-id="${item.id}" type="button" title="${item.active ? "Jeda" : "Aktifkan"}">${item.active ? "⏸" : "▶"}</button>
          <button class="mini-button" data-v9-action="subscription-duplicate" data-v9-id="${item.id}" type="button" title="Duplikat">⧉</button>
          <button class="mini-button danger-mini" data-v9-action="subscription-delete" data-v9-id="${item.id}" type="button" title="Hapus">🗑️</button>
        </footer>
      </article>
    `;
  }

  function renderChangelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container) return;
    container.innerHTML = `
      <article class="release-hero">
        <div><span class="release-kicker">VERSI TERBARU</span><h3>${PATCH_LABEL}</h3><p>Workspace khusus untuk seluruh pengeluaran rutin dan pusat changelog di dalam aplikasi.</p></div>
        <div class="release-meta"><strong>Build 2026.07.18</strong><span>Tidak memerlukan SQL baru</span><span>Data v8 tetap kompatibel</span></div>
      </article>

      <div class="release-grid">
        ${releaseCard("v9.0", "Subscription Manager & Changelog", "2026-07-18", [
          "Halaman khusus Langganan & Tagihan Rutin.",
          "Edit, hapus, jeda/aktifkan, duplikasi, dan tandai dibayar.",
          "Pencarian, filter status/frekuensi, dan pengurutan.",
          "Estimasi biaya bulanan, tahunan, dan tagihan 30 hari.",
          "Detail provider, paket, website, cara pembayaran, tag, dan catatan.",
          "Riwayat pembayaran per langganan dan ekspor CSV.",
          "Halaman Pembaruan di aplikasi dan CHANGELOG.html publik.",
          "Popup Apa yang Baru tampil satu kali setelah pembaruan."
        ], true)}
        ${releaseCard("v8.0", "Bill Reminder Center", "2026-07-17", [
          "Popup pengingat 7, 3, 1 hari dan hari H.",
          "Pemeriksaan kecukupan saldo akun pembayaran.",
          "Siapkan saldo, tandai dibayar, dan tunda pengingat.",
          "Reminder Center untuk tagihan, cicilan, kartu kredit, dan PayLater."
        ])}
        ${releaseCard("v7.0", "Account Workspace", "2026-07-17", [
          "Akun dipisahkan per kategori.",
          "Urutan kategori dan kartu akun dapat diatur.",
          "Pencarian, filter, tampilan kartu/list, favorit, arsip, dan detail akun."
        ])}
        ${releaseCard("v6.0", "Complete Finance Suite", "2026-07-17", [
          "Cloud Sync v2, antrean offline, konflik, snapshot, dan lampiran.",
          "Utang/cicilan, investasi, shared wallet, backup, recovery key, perangkat.",
          "Dashboard lanjutan, transaksi rutin otomatis, budget pintar, dan PWA."
        ])}
      </div>

      <div class="release-info-grid">
        <article class="panel"><h4>✅ Kompatibilitas</h4><p>Data, sandi brankas, akun Supabase, dan tabel cloud versi sebelumnya tetap digunakan. Tidak perlu membuat akun atau database baru.</p></article>
        <article class="panel"><h4>☁️ Cara Update Netlify</h4><p>Unggah ZIP v9 pada Production deploys, tunggu Published, lalu refresh penuh. Service worker v9 akan mengganti cache lama.</p></article>
        <article class="panel"><h4>🛡️ Sebelum Update</h4><p>Disarankan membuat Backup Terenkripsi dari menu Tools. Patch tidak menghapus transaksi maupun jadwal lama.</p></article>
        <article class="panel"><h4>📄 Dokumen</h4><p>File paket menyertakan CHANGELOG.html dan CHANGELOG-V9.txt untuk catatan offline atau publik.</p></article>
      </div>
      <div class="form-actions"><button class="button primary" id="v9MarkChangelogRead" type="button">Tandai Sudah Dibaca</button></div>
    `;
  }

  function releaseCard(version, title, date, items, latest = false) {
    return `<article class="release-card ${latest ? "latest" : ""}">
      <header><div><span>${escapeHTML(version)}</span><h4>${escapeHTML(title)}</h4></div><time>${escapeHTML(date)}</time></header>
      <ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </article>`;
  }

  function enhanceRecurringV9Form(existing) {
    const form = document.getElementById("recurringForm");
    const grid = form?.querySelector(".form-grid");
    if (!form || !grid || document.getElementById("v9RecurringDetails")) return;
    const item = existing || {};
    grid.insertAdjacentHTML("beforeend", `
      <div class="field full v9-recurring-details" id="v9RecurringDetails">
        <span>📦 Detail langganan / layanan</span>
        <div class="form-grid">
          <label class="field"><span>Jenis layanan</span><select class="input" id="v9ServiceType">
            ${[
              ["subscription", "Langganan digital"], ["utility", "Tagihan rumah"], ["membership", "Membership"],
              ["insurance", "Asuransi"], ["installment", "Cicilan rutin"], ["donation", "Donasi rutin"], ["other", "Lainnya"]
            ].map(([value, label]) => `<option value="${value}" ${item.serviceType === value ? "selected" : ""}>${label}</option>`).join("")}
          </select></label>
          <label class="field"><span>Provider / perusahaan</span><input class="input" id="v9Provider" value="${escapeHTML(item.provider || "")}" placeholder="Apple, OpenAI, Google..." /></label>
          <label class="field"><span>Nama paket</span><input class="input" id="v9PlanName" value="${escapeHTML(item.planName || "")}" placeholder="iCloud+ 200 GB" /></label>
          <label class="field"><span>Cara pembayaran</span><select class="input" id="v9PaymentMode"><option value="automatic" ${item.paymentMode !== "manual" ? "selected" : ""}>Debit otomatis</option><option value="manual" ${item.paymentMode === "manual" ? "selected" : ""}>Bayar manual</option></select></label>
          <label class="field"><span>Website layanan</span><input class="input" id="v9Website" type="url" value="${escapeHTML(item.website || "")}" placeholder="https://..." /></label>
          <label class="field"><span>Halaman pembatalan</span><input class="input" id="v9CancellationUrl" type="url" value="${escapeHTML(item.cancellationUrl || "")}" placeholder="https://..." /></label>
          <label class="field"><span>Akhir masa trial</span><input class="input" id="v9TrialEndDate" type="date" value="${escapeHTML(item.trialEndDate || "")}" /></label>
          <label class="field"><span>Tags</span><input class="input" id="v9SubscriptionTags" value="${escapeHTML((item.subscriptionTags || []).join(", "))}" placeholder="cloud, kerja, keluarga" /></label>
          <label class="field full"><span>Catatan langganan</span><textarea id="v9SubscriptionNotes" placeholder="Nomor pelanggan, detail paket, cara pembatalan...">${escapeHTML(item.subscriptionNotes || "")}</textarea></label>
        </div>
      </div>
    `);

    form.addEventListener("submit", () => {
      pendingSubscriptionExtras = {
        editingId: existing?.id || null,
        serviceType: document.getElementById("v9ServiceType")?.value || "subscription",
        provider: document.getElementById("v9Provider")?.value.trim() || "",
        planName: document.getElementById("v9PlanName")?.value.trim() || "",
        paymentMode: document.getElementById("v9PaymentMode")?.value || "automatic",
        website: document.getElementById("v9Website")?.value.trim() || "",
        cancellationUrl: document.getElementById("v9CancellationUrl")?.value.trim() || "",
        trialEndDate: document.getElementById("v9TrialEndDate")?.value || "",
        subscriptionTags: (document.getElementById("v9SubscriptionTags")?.value || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        subscriptionNotes: document.getElementById("v9SubscriptionNotes")?.value.trim() || ""
      };
    }, { capture: true });
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function openSubscriptionDetail(id) {
    const item = state.recurring.find((row) => row.id === id);
    if (!item) return;
    const account = accountForRecurring(item);
    const history = recurringPaymentHistory(item);
    const website = safeExternalUrl(item.website);
    const cancellation = safeExternalUrl(item.cancellationUrl);
    showModal("Detail Langganan", `${item.name} · ${frequencyLabel(item.frequency)}`, `
      <div class="subscription-detail-head">
        <div class="subscription-logo large" style="--subscription-color:${item.color || "#7558ff"}">${item.icon || "🔁"}</div>
        <div><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.provider || serviceTypeLabel(item.serviceType))}${item.planName ? ` · ${escapeHTML(item.planName)}` : ""}</p></div>
        <span class="subscription-status ${item.active ? "active" : "paused"}">${item.active ? "Aktif" : "Dijeda"}</span>
      </div>
      <div class="subscription-detail-grid">
        <div><span>Nominal</span><strong class="money">${formatCurrency(item.amount, item.currency)}</strong></div>
        <div><span>Bulanan ekuivalen</span><strong class="money">${formatCurrency(monthlyNativeCost(item), item.currency)}</strong></div>
        <div><span>Tahunan</span><strong class="money">${formatCurrency(annualNativeCost(item), item.currency)}</strong></div>
        <div><span>Jatuh tempo</span><strong>${dueText(item)}</strong></div>
        <div><span>Akun</span><strong>${escapeHTML(account?.name || "Tidak ditemukan")}</strong></div>
        <div><span>Pembayaran</span><strong>${item.paymentMode === "manual" ? "Manual" : "Debit otomatis"}</strong></div>
      </div>
      ${(website || cancellation) ? `<div class="button-grid" style="margin:16px 0">${website ? `<a class="button secondary" href="${escapeHTML(website)}" target="_blank" rel="noopener">Buka Website</a>` : ""}${cancellation ? `<a class="button danger" href="${escapeHTML(cancellation)}" target="_blank" rel="noopener">Kelola/Pembatalan</a>` : ""}</div>` : ""}
      ${item.subscriptionNotes ? `<div class="subscription-note"><strong>Catatan</strong><p>${escapeHTML(item.subscriptionNotes)}</p></div>` : ""}
      <h4 style="margin:20px 0 10px">Riwayat Pembayaran</h4>
      <div class="simple-list">${history.length ? history.slice(0, 12).map((tx) => `<div class="simple-item"><span><strong>${formatDate(tx.date)}</strong>${escapeHTML(tx.description)}</span><strong class="money">${formatCurrency(tx.amount, tx.currency)}</strong></div>`).join("") : `<div class="muted">Belum ada pembayaran tercatat.</div>`}</div>
      <div class="form-actions"><button class="button secondary" id="v9CloseSubscriptionDetail" type="button">Tutup</button><button class="button primary" data-v9-action="subscription-edit" data-v9-id="${item.id}" type="button">Edit</button></div>
    `);
    document.getElementById("v9CloseSubscriptionDetail")?.addEventListener("click", closeModal);
  }

  function advanceDate(dateString, frequency) {
    const date = new Date(`${dateString || localISO()}T12:00:00`);
    if (frequency === "weekly") date.setDate(date.getDate() + 7);
    else if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    return localISO(date);
  }

  async function markSubscriptionPaid(id) {
    const item = state.recurring.find((row) => row.id === id);
    if (!item || !item.active) return;
    const account = accountForRecurring(item);
    if (!account) throw new Error("Akun pembayaran tidak ditemukan.");
    const paidDate = localISO();
    const duplicate = state.transactions.some((tx) => tx.sourceRecurringId === item.id && tx.date === paidDate);
    if (duplicate && !confirm("Pembayaran hari ini sudah tercatat. Tambahkan lagi?")) return;
    const rate = convertCurrency(1, account.currency, state.settings.baseCurrency) || 0;
    await commit("Pembayaran rutin dicatat", item.name, () => {
      state.transactions.push({
        id: patchId("tx"), type: "expense", description: item.name, merchant: item.provider || "Pembayaran langganan",
        date: paidDate, accountId: account.id, destinationAccountId: null, amount: moneyNumber(item.amount), destinationAmount: null,
        fee: 0, currency: account.currency, category: item.category || "Tagihan", splits: [], tags: ["rutin", "langganan", ...(item.subscriptionTags || [])],
        notes: item.subscriptionNotes || "", status: "completed", deductible: false, reconciled: false,
        profileId: item.profileId || account.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate,
        baseAmount: moneyNumber(item.amount) * rate, attachmentIds: [], sourceRecurringId: item.id, createdAt: new Date().toISOString()
      });
      item.lastProcessedDate = paidDate;
      item.nextDate = advanceDate(item.nextDate, item.frequency);
      item.updatedAt = new Date().toISOString();
    });
    showToast(`${item.name} ditandai sudah dibayar.`, "✓");
  }

  async function toggleSubscription(id) {
    const item = state.recurring.find((row) => row.id === id);
    if (!item) return;
    await commit(item.active ? "Langganan dijeda" : "Langganan diaktifkan", item.name, () => {
      item.active = !item.active;
      item.updatedAt = new Date().toISOString();
    });
  }

  async function duplicateSubscription(id) {
    const item = state.recurring.find((row) => row.id === id);
    if (!item) return;
    const copy = structuredClone(item);
    copy.id = patchId("recurring");
    copy.name = `${item.name} (Salinan)`;
    copy.active = false;
    copy.lastProcessedDate = null;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = copy.createdAt;
    await commit("Langganan diduplikasi", item.name, () => state.recurring.push(copy));
    showToast("Salinan dibuat dalam status dijeda.", "⧉");
  }

  async function deleteSubscription(id) {
    const item = state.recurring.find((row) => row.id === id);
    if (!item) return;
    const history = recurringPaymentHistory(item).length;
    const confirmed = confirm(`Hapus jadwal “${item.name}”?\n\n${history} transaksi pembayaran lama tetap disimpan.`);
    if (!confirmed) return;
    await commit("Langganan dihapus", item.name, () => {
      state.recurring = state.recurring.filter((row) => row.id !== id);
      if (state.settings.billReminderSnoozes) {
        Object.keys(state.settings.billReminderSnoozes).filter((key) => key.includes(id)).forEach((key) => delete state.settings.billReminderSnoozes[key]);
      }
    });
    showToast("Jadwal langganan dihapus. Riwayat transaksi tetap ada.", "🗑️");
  }

  function exportSubscriptionsCsv() {
    const rows = (state.recurring || []).filter((item) => item.type === "expense").map((item) => ({
      Nama: item.name,
      Provider: item.provider || "",
      Paket: item.planName || "",
      Jenis: serviceTypeLabel(item.serviceType),
      Status: item.active ? "Aktif" : "Dijeda",
      Nominal: item.amount,
      Mata_Uang: item.currency,
      Frekuensi: frequencyLabel(item.frequency),
      Biaya_Tahunan: annualNativeCost(item),
      Jatuh_Tempo_Berikutnya: item.nextDate,
      Akun: accountForRecurring(item)?.name || "",
      Kategori: item.category,
      Pembayaran: item.paymentMode === "manual" ? "Manual" : "Debit otomatis",
      Tags: (item.subscriptionTags || []).join(", ")
    }));
    if (!rows.length) { showToast("Belum ada langganan untuk diekspor.", "❗"); return; }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\r\n");
    downloadBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `charisna-langganan-${localISO()}.csv`);
  }

  async function markChangelogRead() {
    state.settings.lastSeenChangelogVersion = PATCH_VERSION;
    await encryptState();
    showToast("Changelog ditandai sudah dibaca.", "📝");
  }

  function maybeShowWhatsNew() {
    if (!state || whatsNewOpening || Number(state.settings.lastSeenChangelogVersion || 0) >= PATCH_VERSION) return;
    whatsNewOpening = true;
    window.setTimeout(() => {
      showModal("Apa yang Baru di v9", "Subscription Manager & Changelog", `
        <div class="whats-new-list">
          <div><span>🔁</span><p><strong>Halaman Langganan</strong>Edit, hapus, jeda, duplikasi, tandai dibayar, dan lihat riwayat.</p></div>
          <div><span>📊</span><p><strong>Ringkasan biaya</strong>Estimasi bulanan, tahunan, dan tagihan 30 hari.</p></div>
          <div><span>📝</span><p><strong>Changelog di aplikasi</strong>Semua detail pembaruan sekarang terdokumentasi.</p></div>
        </div>
        <div class="form-actions"><button class="button secondary" id="v9WhatsNewLater" type="button">Nanti</button><button class="button primary" id="v9WhatsNewOpen" type="button">Lihat Changelog</button></div>
      `);
      document.getElementById("v9WhatsNewLater")?.addEventListener("click", () => { whatsNewOpening = false; closeModal(); });
      document.getElementById("v9WhatsNewOpen")?.addEventListener("click", async () => {
        state.settings.lastSeenChangelogVersion = PATCH_VERSION;
        await encryptState();
        whatsNewOpening = false;
        closeModal();
        changeSection("updates");
      });
    }, 1100);
  }

  function bindV9Events() {
    document.addEventListener("click", async (event) => {
      const target = event.target.closest("button, [data-v9-action]");
      if (!target) return;
      try {
        if (target.id === "v9AddSubscription") openRecurringForm();
        if (target.id === "v9ExportSubscriptions") exportSubscriptionsCsv();
        if (target.id === "v9OpenChangelog") changeSection("updates");
        if (target.id === "v9MarkChangelogRead") await markChangelogRead();

        const action = target.dataset.v9Action;
        const id = target.dataset.v9Id;
        if (action === "subscription-detail") openSubscriptionDetail(id);
        if (action === "subscription-edit") { closeModal(); openRecurringForm(state.recurring.find((row) => row.id === id)); }
        if (action === "subscription-paid") await markSubscriptionPaid(id);
        if (action === "subscription-toggle") await toggleSubscription(id);
        if (action === "subscription-duplicate") await duplicateSubscription(id);
        if (action === "subscription-delete") await deleteSubscription(id);
      } catch (error) {
        console.error(error);
        showToast(error.message || "Aksi langganan gagal.", "❗");
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id === "v9SubscriptionSearch") {
        subscriptionSearch = event.target.value;
        renderSubscriptions();
        const input = document.getElementById("v9SubscriptionSearch");
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.id === "v9SubscriptionStatus") { subscriptionStatus = event.target.value; renderSubscriptions(); }
      if (event.target.id === "v9SubscriptionFrequency") { subscriptionFrequency = event.target.value; renderSubscriptions(); }
      if (event.target.id === "v9SubscriptionSort") { subscriptionSort = event.target.value; renderSubscriptions(); }
    });
  }

  const previousOpenRecurringForm = openRecurringForm;
  openRecurringForm = function v9OpenRecurringForm(existing = null) {
    previousOpenRecurringForm(existing);
    window.setTimeout(() => enhanceRecurringV9Form(existing), 20);
  };

  const previousCommit = commit;
  commit = async function v9Commit(action, detail, mutator) {
    const extras = pendingSubscriptionExtras;
    pendingSubscriptionExtras = null;
    const beforeIds = new Set((state.recurring || []).map((item) => item.id));
    const wrappedMutator = () => {
      mutator();
      if (extras && /Pembayaran rutin/i.test(action)) {
        const target = extras.editingId
          ? state.recurring.find((item) => item.id === extras.editingId)
          : state.recurring.find((item) => !beforeIds.has(item.id)) || state.recurring.at(-1);
        if (target) {
          Object.assign(target, extras, { updatedAt: new Date().toISOString() });
          delete target.editingId;
          target.createdAt ||= target.updatedAt;
        }
      }
    };
    return previousCommit(action, detail, wrappedMutator);
  };

  const previousRenderAll = renderAll;
  renderAll = function v9RenderAll() {
    if (state) ensureV9State();
    previousRenderAll();
    renderSubscriptions();
    renderChangelog();
  };

  const previousChangeSection = changeSection;
  changeSection = function v9ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    if (sectionId === "subscriptions") renderSubscriptions();
    if (sectionId === "updates") renderChangelog();
  };

  const previousUnlockApplication = unlockApplication;
  unlockApplication = function v9UnlockApplication() {
    ensureV9State();
    previousUnlockApplication();
    maybeShowWhatsNew();
  };

  injectV9UI();
})();
