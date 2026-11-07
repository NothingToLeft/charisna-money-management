"use strict";

(() => {
  const PRO_VERSION = 8;
  const PRO_PREFIX = "charisna-v8";
  const QUEUE_KEY = `${PRO_PREFIX}-sync-queue`;
  const SNAPSHOT_KEY = `${PRO_PREFIX}-vault-snapshots`;
  const LOGIN_GUARD_KEY = `${PRO_PREFIX}-login-guard`;
  const DEVICE_GENERATION_KEY = `${PRO_PREFIX}-device-generation`;
  const ATTACHMENT_BUCKET = "charisna-attachments";
  const VERSION_TABLE = "charisna_vault_versions";
  const INVITE_TABLE = "charisna_wallet_invites";

  let proInitialized = false;
  let proDashboardChart = null;
  let proAccountChart = null;
  let proInvestmentChart = null;
  let proRealtimeChannel = null;
  let proPollTimer = null;
  let proOnlineRetryTimer = null;
  let pendingTransactionExtras = null;
  let pendingRecurringReminderExtras = null;
  let reminderPopupOpening = false;
  let editingTransactionId = null;
  let lastSnapshotAt = 0;
  let lastRemoteCheck = 0;
  let renderCycle = 0;
  let accountArrangeMode = false;
  let accountSearchQuery = "";
  let accountTypeFilter = "all";
  let draggedAccountId = null;
  let draggedAccountType = null;
  let draggedAccountGroup = null;

  const nowIso = () => new Date().toISOString();
  const safeNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function proId(prefix) {
    return `${prefix}-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}`;
  }

  function currentDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = proId("device");
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  function deviceName() {
    const platform = navigator.userAgentData?.platform || navigator.platform || "Perangkat";
    const mobile = navigator.userAgentData?.mobile ? "Mobile" : "Desktop";
    return `${platform} · ${mobile}`;
  }

  function ensureProState() {
    if (!state) return false;
    let changed = false;

    const assign = (object, key, value) => {
      if (object[key] === undefined) {
        object[key] = value;
        changed = true;
      }
    };

    assign(state, "proVersion", PRO_VERSION);
    assign(state, "debts", []);
    assign(state, "investments", []);
    assign(state, "transactionTemplates", []);
    assign(state, "sharedWallets", []);
    assign(state, "cloudSyncLog", []);
    assign(state, "securityEvents", []);
    assign(state, "errorLog", []);
    assign(state, "notificationLog", []);

    state.settings ||= {};
    assign(state.settings, "dashboardRange", "30d");
    assign(state.settings, "autoPostRecurring", true);
    assign(state.settings, "smartBudgetAlerts", true);
    assign(state.settings, "cloudAutoSync", true);
    assign(state.settings, "cloudPollMinutes", 1);
    assign(state.settings, "syncAttachments", true);
    assign(state.settings, "autoBackup", true);
    assign(state.settings, "onboardingDismissed", false);
    assign(state.settings, "mobileCards", true);
    assign(state.settings, "defaultDebtStrategy", "avalanche");
    assign(state.settings, "monthlyEssentialExpense", 0);
    assign(state.settings, "accountCategoryOrder", Object.keys(ACCOUNT_TYPES));
    assign(state.settings, "accountOrder", []);
    assign(state.settings, "accountLayout", "comfortable");
    assign(state.settings, "accountSort", "manual");
    assign(state.settings, "accountShowZero", true);
    assign(state.settings, "accountShowArchived", false);
    assign(state.settings, "accountCollapsedGroups", {});
    assign(state.settings, "billReminderEnabled", true);
    assign(state.settings, "billReminderDays", [7, 3, 1, 0]);
    assign(state.settings, "billReminderPopup", true);
    assign(state.settings, "billReminderLowBalance", true);
    assign(state.settings, "billReminderIncludeDebts", true);
    assign(state.settings, "billReminderIncludeCredit", true);
    assign(state.settings, "billReminderSnoozes", {});
    assign(state.settings, "lastBillReminderPopupDate", null);
    assign(state.settings, "billReminderTopUpBufferPercent", 0);

    const validAccountTypes = Object.keys(ACCOUNT_TYPES);
    state.settings.accountCategoryOrder = Array.from(new Set([
      ...(state.settings.accountCategoryOrder || []).filter((type) => validAccountTypes.includes(type)),
      ...validAccountTypes
    ]));

    const validAccountIds = new Set((state.accounts || []).map((account) => account.id));
    state.settings.accountOrder = Array.from(new Set([
      ...(state.settings.accountOrder || []).filter((id) => validAccountIds.has(id)),
      ...(state.accounts || []).map((account) => account.id)
    ]));

    (state.accounts || []).forEach((account) => {
      if (account.pinned === undefined) { account.pinned = false; changed = true; }
      if (account.archived === undefined) { account.archived = false; changed = true; }
    });

    state.security ||= {};
    assign(state.security, "sessionGeneration", 1);
    assign(state.security, "recoveryKeyCreatedAt", null);
    assign(state.security, "lastPasswordChangeAt", null);
    assign(state.security, "devices", []);

    const deviceId = currentDeviceId();
    const device = state.security.devices.find((item) => item.id === deviceId);
    if (!device) {
      state.security.devices.push({
        id: deviceId,
        name: deviceName(),
        userAgent: navigator.userAgent.slice(0, 300),
        createdAt: nowIso(),
        lastSeenAt: nowIso(),
        revoked: false,
        generation: state.security.sessionGeneration
      });
      changed = true;
    } else {
      device.lastSeenAt = nowIso();
      device.name = deviceName();
    }

    if (!state.sharedWallets.length) {
      state.sharedWallets.push({
        id: "wallet-family-default",
        name: "Dompet Keluarga",
        profileId: activeFinancialUserId() || state.profiles?.[0]?.id || "",
        currency: state.settings.baseCurrency || "IDR",
        members: [{
          id: proId("member"),
          name: state.settings.userName || "Pemilik",
          email: cloudSession?.user?.email || "",
          role: "owner",
          status: "active",
          joinedAt: nowIso()
        }],
        approvalThreshold: 0,
        requireApproval: false,
        createdAt: nowIso()
      });
      changed = true;
    }

    (state.transactions || []).forEach((tx) => {
      if (tx.location === undefined) { tx.location = ""; changed = true; }
      if (tx.refundOf === undefined) { tx.refundOf = null; changed = true; }
      if (tx.sourceRecurringId === undefined) { tx.sourceRecurringId = null; changed = true; }
      if (tx.installmentId === undefined) { tx.installmentId = null; changed = true; }
      if (tx.templateId === undefined) { tx.templateId = null; changed = true; }
    });

    (state.recurring || []).forEach((item) => {
      if (item.autoPost === undefined) { item.autoPost = true; changed = true; }
      if (item.lastProcessedDate === undefined) { item.lastProcessedDate = null; changed = true; }
      if (item.reminderEnabled === undefined) { item.reminderEnabled = true; changed = true; }
      if (item.reminderDays === undefined) { item.reminderDays = null; changed = true; }
      if (item.lowBalanceReminder === undefined) { item.lowBalanceReminder = true; changed = true; }
      if (item.snoozedUntil === undefined) { item.snoozedUntil = null; changed = true; }
    });

    if (changed && currentKey) {
      window.setTimeout(() => {
        if (currentKey && state) encryptState().catch(console.error);
      }, 80);
    }
    return changed;
  }

  function injectProUI() {
    if (proInitialized) return;
    proInitialized = true;

    SECTION_COPY.debts = ["Utang & Cicilan", "Kelola utang, piutang, cicilan, bunga, dan strategi pelunasan."];
    SECTION_COPY.investments = ["Investasi & Aset", "Pantau portofolio, aset, dividen, dan performa."];
    SECTION_COPY.shared = ["Shared Wallet", "Dompet keluarga, bisnis, anggota, peran, dan persetujuan."];

    const nav = document.querySelector(".navigation");
    const calendarNav = nav?.querySelector('[data-section="calendar"]');
    if (nav && calendarNav) {
      calendarNav.insertAdjacentHTML("beforebegin", `
        <button class="nav-button" data-section="debts"><span>🧮</span>Utang</button>
        <button class="nav-button" data-section="investments"><span>📈</span>Investasi</button>
        <button class="nav-button" data-section="shared"><span>👥</span>Shared</button>
      `);
    }

    const calendarSection = document.getElementById("calendar");
    calendarSection?.insertAdjacentHTML("beforebegin", debtSectionHtml() + investmentSectionHtml() + sharedSectionHtml());

    const dashboard = document.getElementById("dashboard");
    dashboard?.insertAdjacentHTML("afterbegin", `
      <div class="pro-dashboard-tools" id="proDashboardTools">
        <div>
          <strong>📅 Periode Analisis</strong>
          <p class="muted">Semua metrik lanjutan menyesuaikan periode ini.</p>
        </div>
        <select class="input" id="proDashboardRange" aria-label="Periode dashboard">
          <option value="7d">7 hari</option>
          <option value="30d">30 hari</option>
          <option value="90d">3 bulan</option>
          <option value="180d">6 bulan</option>
          <option value="365d">1 tahun</option>
          <option value="all">Semua waktu</option>
        </select>
      </div>
      <div id="proDashboardAnalytics"></div>
    `);

    const accountGrid = document.getElementById("accountGrid");
    accountGrid?.insertAdjacentHTML("beforebegin", `
      <article class="account-workspace-toolbar" id="proAccountToolbar">
        <div class="account-toolbar-primary">
          <label class="account-search-field">
            <span>🔎</span>
            <input id="proAccountSearch" type="search" placeholder="Cari nama akun, mata uang, atau profil..." />
          </label>
          <select class="input" id="proAccountTypeFilter" aria-label="Filter kategori akun">
            <option value="all">Semua kategori</option>
            ${Object.entries(ACCOUNT_TYPES).map(([key, value]) => `<option value="${key}">${value.icon} ${value.label}</option>`).join("")}
          </select>
          <select class="input" id="proAccountSort" aria-label="Urutkan akun">
            <option value="manual">Urutan manual</option>
            <option value="name">Nama A–Z</option>
            <option value="balance-desc">Saldo terbesar</option>
            <option value="balance-asc">Saldo terkecil</option>
            <option value="recent">Aktivitas terbaru</option>
          </select>
          <select class="input" id="proAccountLayout" aria-label="Tampilan akun">
            <option value="comfortable">Kartu nyaman</option>
            <option value="compact">Kartu ringkas</option>
            <option value="list">Daftar</option>
          </select>
        </div>
        <div class="account-toolbar-secondary">
          <label class="account-toolbar-check"><input id="proAccountShowZero" type="checkbox" /> Tampilkan saldo nol</label>
          <label class="account-toolbar-check"><input id="proAccountShowArchived" type="checkbox" /> Tampilkan arsip</label>
          <button class="button secondary" id="proToggleAccountArrange" type="button">↕ Atur Peletakan</button>
          <button class="button secondary" id="proResetAccountLayout" type="button">Reset Urutan</button>
        </div>
        <div class="account-toolbar-summary" id="proAccountSummary"></div>
      </article>
    `);

    const transactionPanel = document.querySelector("#transactions .panel");
    transactionPanel?.insertAdjacentHTML("beforebegin", `
      <div class="pro-bulk-bar" id="proTransactionBulkBar">
        <strong id="proSelectedCount">0 dipilih</strong>
        <select class="input" id="proBulkCategory">
          <option value="">Ubah kategori...</option>
          ${categoryOptions("expense")}
        </select>
        <button class="button secondary" id="proBulkApplyCategory" type="button">Terapkan</button>
        <button class="button secondary" id="proCreateTemplate" type="button">☆ Simpan Template</button>
        <button class="button secondary" id="proOpenTemplates" type="button">⚡ Template Cepat</button>
        <button class="button danger" id="proBulkDelete" type="button">Hapus Terpilih</button>
      </div>
      <div class="pro-mobile-transactions" id="proMobileTransactions"></div>
    `);

    const transactionHeaderToolbar = document.querySelector("#transactions .section-header .toolbar");
    transactionHeaderToolbar?.insertAdjacentHTML("beforeend", `
      <button class="button secondary" id="proDuplicateLatest" type="button">⧉ Duplikat Terakhir</button>
    `);

    const budgetHeader = document.querySelector("#budgets .section-header");
    budgetHeader?.querySelector("button")?.insertAdjacentHTML("beforebegin", `
      <button class="button secondary" id="proSuggestBudgets" type="button">✨ Saran Budget</button>
    `);

    const topActions = document.querySelector(".topbar-actions");
    topActions?.insertAdjacentHTML("afterbegin", `
      <button class="pro-reminder-button" id="proReminderButton" type="button" title="Pengingat tagihan" aria-label="Buka pengingat tagihan">
        <span>🔔</span><strong id="proReminderBadge" hidden>0</strong>
      </button>
      <span class="pro-status-pill" id="proConnectionStatus">Offline</span>
    `);

    const toolsGrid = document.querySelector("#tools .cards-grid");
    toolsGrid?.insertAdjacentHTML("beforeend", toolsPanelsHtml());

    const settingsGrid = document.querySelector("#settings .cards-grid");
    settingsGrid?.insertAdjacentHTML("beforeend", settingsPanelsHtml());

    const loginPanel = document.getElementById("loginPanel");
    loginPanel?.querySelector(".text-button")?.insertAdjacentHTML("beforebegin", `
      <button class="button secondary wide" id="proRecoveryUnlockButton" type="button" style="margin-top:12px">
        🛟 Buka dengan Recovery Key
      </button>
      <p class="muted" id="proLoginGuardStatus" style="margin-top:9px"></p>
    `);

    const cloudAuthPanel = document.getElementById("cloudAuthPanel");
    cloudAuthPanel?.querySelector(".security-note")?.insertAdjacentHTML("beforebegin", `
      <button class="text-button" id="proResetCloudPassword" type="button">
        Lupa sandi akun cloud?
      </button>
    `);

    document.body.insertAdjacentHTML("beforeend", `
      <button class="pro-fab" id="proFab" type="button" aria-label="Tambah transaksi">＋</button>
      <div class="pro-onboarding" id="proOnboarding" hidden></div>
      <input id="proFullBackupInput" type="file" accept=".zip,application/zip" hidden />
      <input id="proPartialBackupInput" type="file" accept=".json,application/json" hidden />
    `);

    bindProEvents();
    document.getElementById('proCloudPasswordForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      await changeCloudPassword();
    });
    installGlobalErrorCapture();
    updateOnlineStatus();
  }

  function debtSectionHtml() {
    return `
      <section class="section" id="debts">
        <header class="section-header">
          <div><h3>Utang, Piutang & Cicilan</h3><p>Jadwal pembayaran, bunga, tenor, snowball, avalanche, dan simulasi pelunasan.</p></div>
          <div class="toolbar">
            <button class="button secondary" id="proDebtSimulator" type="button">🧠 Simulator</button>
            <button class="button primary" id="proAddDebt" type="button">＋ Tambah</button>
          </div>
        </header>
        <div id="proDebtSummary"></div>
        <div class="pro-section-grid" id="proDebtGrid"></div>
        <div class="report-layout" style="margin-top:18px">
          <article class="panel"><header class="panel-header"><div><h4>Strategi Pelunasan</h4><p>Urutan prioritas berdasarkan metode pilihan.</p></div></header><div id="proDebtStrategy"></div></article>
          <article class="panel"><header class="panel-header"><div><h4>Jatuh Tempo Terdekat</h4><p>Pembayaran yang perlu disiapkan.</p></div></header><div id="proDebtDueList"></div></article>
        </div>
      </section>
    `;
  }

  function investmentSectionHtml() {
    return `
      <section class="section" id="investments">
        <header class="section-header">
          <div><h3>Investasi & Aset</h3><p>Saham, emas, reksa dana, deposito, kripto, properti, kendaraan, dan aset usaha.</p></div>
          <div class="toolbar">
            <button class="button secondary" id="proRecordDividend" type="button">💵 Dividen</button>
            <button class="button primary" id="proAddInvestment" type="button">＋ Tambah Aset</button>
          </div>
        </header>
        <div id="proInvestmentSummary"></div>
        <div class="report-layout">
          <article class="panel pro-chart-wrap"><header class="panel-header"><div><h4>Alokasi Portofolio</h4><p>Berdasarkan nilai saat ini.</p></div></header><canvas id="proInvestmentChart"></canvas></article>
          <article class="panel"><header class="panel-header"><div><h4>Ringkasan Performa</h4><p>Modal, nilai, return, dan pendapatan pasif.</p></div></header><div id="proInvestmentPerformance"></div></article>
        </div>
        <div class="pro-section-grid" id="proInvestmentGrid"></div>
      </section>
    `;
  }

  function sharedSectionHtml() {
    return `
      <section class="section" id="shared">
        <header class="section-header">
          <div><h3>Shared Wallet</h3><p>Dompet personal, pasangan, keluarga, bisnis, peran anggota, dan persetujuan transaksi.</p></div>
          <button class="button primary" id="proAddSharedWallet" type="button">＋ Dompet Bersama</button>
        </header>
        <div class="pro-warning-box" style="margin-bottom:18px">
          Undangan email dan sinkronisasi anggota memerlukan menjalankan file <strong>SUPABASE-SETUP-V6.sql</strong>. Tanpa itu, pengaturan tetap tersimpan terenkripsi di brankas utama.
        </div>
        <div class="pro-section-grid" id="proSharedWalletGrid"></div>
        <article class="panel" style="margin-top:18px"><header class="panel-header"><div><h4>Persetujuan Transaksi</h4><p>Transaksi besar yang menunggu keputusan anggota.</p></div></header><div id="proApprovalList"></div></article>
      </section>
    `;
  }

  function toolsPanelsHtml() {
    return `
      <article class="panel">
        <header class="panel-header"><div><h4>Backup Lengkap</h4><p>ZIP terenkripsi berisi brankas dan semua lampiran.</p></div></header>
        <div class="button-grid">
          <button class="button primary" id="proExportFullBackup" type="button">⬇ Full Backup ZIP</button>
          <button class="button secondary" id="proRestoreFullBackup" type="button">⬆ Restore Full ZIP</button>
          <button class="button secondary" id="proPartialRestore" type="button">◫ Restore Sebagian</button>
        </div>
        <div class="pro-version-list" id="proLocalBackupList" style="margin-top:14px"></div>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Sinkronisasi Lampiran</h4><p>Struk, gambar, dan PDF terenkripsi ke Supabase Storage.</p></div></header>
        <div class="button-grid">
          <button class="button primary" id="proSyncAttachments" type="button">☁️ Sinkronkan Lampiran</button>
          <button class="button secondary" id="proDownloadAttachments" type="button">↓ Ambil Lampiran</button>
        </div>
        <p class="muted" id="proAttachmentStatus" style="margin-top:12px">Belum diperiksa.</p>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Diagnostik & Error Monitor</h4><p>Log error lokal, status browser, storage, dan koneksi.</p></div></header>
        <div class="button-grid">
          <button class="button secondary" id="proExportDiagnostics" type="button">Ekspor Diagnostik</button>
          <button class="button danger" id="proClearErrors" type="button">Bersihkan Error</button>
        </div>
        <div class="pro-error-list" id="proErrorList" style="margin-top:14px"></div>
      </article>
    `;
  }

  function settingsPanelsHtml() {
    return `
      <article class="panel">
        <header class="panel-header"><div><h4>Cloud Always-Latest</h4><p>Autosave setiap perubahan, realtime antar-device, dan pemulihan terenkripsi.</p></div><span class="pro-chip good">WAJIB AKTIF</span></header>
        <div class="pro-metric-row"><span>Status antrean</span><strong id="proQueueStatus">Kosong</strong></div>
        <div class="pro-metric-row"><span>Versi lokal/cloud</span><strong id="proVersionStatus">-</strong></div>
        <div class="button-grid" style="margin-top:14px">
          <button class="button primary" id="proForceSync" type="button">↻ Sinkronkan Sekarang</button>
          <button class="button secondary" id="proCheckRemote" type="button">Periksa Cloud</button>
        </div>
        <div id="proConflictCenter"><div class="pro-success-box" style="margin-top:12px">Versi cloud terbaru selalu dipakai otomatis.</div></div>
        <h5 style="margin:18px 0 10px">Riwayat sinkronisasi</h5>
        <div class="pro-sync-log" id="proSyncLog"></div>
        <div class="panel-header" style="margin:18px 0 10px"><div><h5>Versi Cloud</h5><p>Pulihkan snapshot terenkripsi terdahulu.</p></div><button class="mini-button" id="proLoadCloudVersions" type="button">↻</button></div>
        <div class="pro-version-list" id="proCloudVersionList"><div class="muted">Klik ↻ untuk memuat versi.</div></div>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Recovery & Pemulihan</h4><p>Recovery key dapat membuka data saat sandi brankas terlupa.</p></div></header>
        <div class="pro-warning-box">Simpan recovery key di tempat terpisah. Siapa pun yang memilikinya dapat membuka brankas.</div>
        <div class="button-grid" style="margin-top:14px">
          <button class="button primary" id="proGenerateRecovery" type="button">Buat Recovery Key</button>
          <button class="button secondary" id="proCopyRecovery" type="button">Salin Key</button>
        </div>
        <p class="muted" id="proRecoveryStatus" style="margin-top:12px"></p>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Perangkat & Sesi</h4><p>Daftar perangkat yang pernah membuka brankas.</p></div></header>
        <div class="pro-device-list" id="proDeviceList"></div>
        <button class="button danger" id="proLogoutAllDevices" type="button" style="margin-top:14px">Keluar dari Semua Perangkat</button>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Akun Cloud</h4><p>Ubah password login, kirim reset email, atau ubah email akun Supabase.</p></div></header>
        <form class="form-stack" id="proCloudAccountForm">
          <label class="field"><span>Email baru</span><input class="input" id="proCloudNewEmail" type="email" placeholder="email-baru@example.com" /></label>
          <div class="button-grid">
            <button class="button secondary" id="proChangeCloudEmail" type="button">Ubah Email</button>
            <button class="button secondary" id="proSendPasswordReset" type="button">Kirim Reset Sandi</button>
          </div>
        </form>
        <form class="form-stack" id="proCloudPasswordForm" style="margin-top:18px">
          <label class="field"><span>Password cloud baru</span><input class="input" id="proCloudNewPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" required /></label>
          <label class="field"><span>Ulangi password baru</span><input class="input" id="proCloudConfirmPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" required /></label>
          <button class="button primary" id="proChangeCloudPassword" type="submit">Ubah Password Cloud</button>
          <p class="muted" id="proCloudPasswordStatus" role="status" aria-live="polite"></p>
        </form>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Otomatisasi & Notifikasi</h4><p>Posting rutin, budget alert, jatuh tempo, dan backup otomatis.</p></div></header>
        <div class="form-stack">
          <label class="simple-item"><span>Posting transaksi rutin otomatis</span><input id="proAutoRecurring" type="checkbox" /></label>
          <label class="simple-item"><span>Notifikasi budget pintar</span><input id="proBudgetAlerts" type="checkbox" /></label>
          <label class="simple-item"><span>Pengingat tagihan aktif</span><input id="proBillReminderEnabled" type="checkbox" /></label>
          <label class="simple-item"><span>Popup saat aplikasi dibuka</span><input id="proBillReminderPopup" type="checkbox" /></label>
          <label class="simple-item"><span>Peringatkan jika saldo kurang</span><input id="proBillReminderLowBalance" type="checkbox" /></label>
          <label class="simple-item"><span>Sertakan cicilan/utang</span><input id="proBillReminderDebts" type="checkbox" /></label>
          <label class="simple-item"><span>Sertakan kartu kredit/PayLater</span><input id="proBillReminderCredit" type="checkbox" /></label>
          <label class="field"><span>Ingatkan berapa hari sebelum jatuh tempo</span><input class="input" id="proBillReminderDays" placeholder="Contoh: 14, 7, 3, 1, 0" /></label>
          <label class="field"><span>Tambahan buffer isi saldo (%)</span><input class="input" id="proBillReminderBuffer" type="number" min="0" max="100" step="1" value="0" /></label>
          <label class="simple-item"><span>Sinkronisasi lampiran</span><input id="proAttachmentAutoSync" type="checkbox" /></label>
          <label class="simple-item"><span>Backup lokal otomatis</span><input id="proAutoBackup" type="checkbox" /></label>
          <div class="button-grid">
            <button class="button primary" id="proEnableNotifications" type="button">🔔 Aktifkan Notifikasi</button>
            <button class="button secondary" id="proOpenReminderCenter" type="button">Lihat Pengingat</button>
          </div>
          <p class="muted">Popup tampil saat aplikasi dibuka atau aktif. Notifikasi ketika aplikasi benar-benar tertutup memerlukan layanan push server terpisah.</p>
        </div>
      </article>

      <article class="panel">
        <header class="panel-header"><div><h4>Instal Aplikasi</h4><p>Pasang ke home screen tablet, HP, atau desktop.</p></div></header>
        <div class="button-grid">
          <button class="button primary" id="proInstallApp" type="button">＋ Instal PWA</button>
          <button class="button secondary" id="proCheckUpdate" type="button">↻ Periksa Update</button>
          <a class="button secondary" href="./PRIVACY-POLICY.html" target="_blank" rel="noopener">Privasi</a>
        </div>
        <p class="muted" id="proInstallStatus" style="margin-top:12px"></p>
      </article>
    `;
  }

  function bindProEvents() {
    document.addEventListener("click", async (event) => {
      const target = event.target.closest("button, [data-pro-action]");
      if (!target) return;

      try {
        if (target.id === "proFab") openTransactionForm();
        if (target.id === "proAddDebt") openDebtForm();
        if (target.id === "proDebtSimulator") openDebtSimulator();
        if (target.id === "proAddInvestment") openInvestmentForm();
        if (target.id === "proRecordDividend") openDividendForm();
        if (target.id === "proAddSharedWallet") openSharedWalletForm();
        if (target.id === "proSuggestBudgets") await suggestBudgets();
        if (target.id === "proDuplicateLatest") await duplicateLatestTransaction();
        if (target.id === "proBulkApplyCategory") await applyBulkCategory();
        if (target.id === "proBulkDelete") await deleteBulkTransactions();
        if (target.id === "proCreateTemplate") openCreateTemplateForm();
        if (target.id === "proOpenTemplates") openTemplatePicker();
        if (target.id === "proForceSync") await forceProSync();
        if (target.id === "proCheckRemote") await checkRemoteVersion(true);
        if (target.id === "proLoadCloudVersions") await loadCloudVersions();
        if (target.id === "proUseCloud") await cloudPull({ confirmOverwrite: false });
        if (target.id === "proMergeCloud") await mergeCloudConflict();
        if (target.id === "proUseLocal") await cloudPush({ force: true });
        if (target.id === "proGenerateRecovery") await generateRecoveryKey(true);
        if (target.id === "proCopyRecovery") await copyRecoveryKey();
        if (target.id === "proRecoveryUnlockButton") openRecoveryUnlockForm();
        if (target.id === "proResetCloudPassword") await sendCloudPasswordResetFromLogin();
        if (target.id === "proChangeCloudEmail") await changeCloudEmail();
        if (target.id === "proSendPasswordReset") await sendCloudPasswordReset();
        if (target.id === "proLogoutAllDevices") await logoutAllDevices();
        if (target.id === "proEnableNotifications") await enableProNotifications();
        if (target.id === "proReminderButton" || target.id === "proOpenReminderCenter") await openReminderCenter(true);
        if (target.id === "proInstallApp") await installProApp();
        if (target.id === "proCheckUpdate") await checkPwaUpdate();
        if (target.id === "proExportFullBackup") await exportFullBackup();
        if (target.id === "proRestoreFullBackup") document.getElementById("proFullBackupInput").click();
        if (target.id === "proPartialRestore") document.getElementById("proPartialBackupInput").click();
        if (target.id === "proSyncAttachments") await syncAttachmentsToCloud(false);
        if (target.id === "proDownloadAttachments") await syncAttachmentsFromCloud(false);
        if (target.id === "proExportDiagnostics") exportDiagnostics();
        if (target.id === "proClearErrors") await clearErrorLog();
        if (target.id === "proDismissOnboarding") dismissOnboarding();
        if (target.id === "proToggleAccountArrange") { accountArrangeMode = !accountArrangeMode; renderAccountWorkspace(); }
        if (target.id === "proResetAccountLayout") await resetAccountLayout();

        const action = target.dataset.proAction;
        const id = target.dataset.proId;
        if (action === "edit-debt") openDebtForm(state.debts.find((item) => item.id === id));
        if (action === "pay-debt") openDebtPaymentForm(state.debts.find((item) => item.id === id));
        if (action === "delete-debt") await deleteDebt(id);
        if (action === "edit-investment") openInvestmentForm(state.investments.find((item) => item.id === id));
        if (action === "delete-investment") await deleteInvestment(id);
        if (action === "edit-wallet") openSharedWalletForm(state.sharedWallets.find((item) => item.id === id));
        if (action === "invite-wallet") openInviteMemberForm(state.sharedWallets.find((item) => item.id === id));
        if (action === "delete-wallet") await deleteSharedWallet(id);
        if (action === "duplicate-tx") await duplicateTransaction(id);
        if (action === "refund-tx") openRefundForm(id);
        if (action === "restore-snapshot") restoreSnapshot(Number(target.dataset.proIndex));
        if (action === "restore-cloud-version") await restoreCloudVersion(safeNumber(target.dataset.proVersion));
        if (action === "revoke-device") await revokeDevice(id);
        if (action === "use-template") useTransactionTemplate(id);
        if (action === "delete-template") await deleteTransactionTemplate(id);
        if (action === "approve-transaction") await approveSharedTransaction(id, true);
        if (action === "reject-transaction") await approveSharedTransaction(id, false);
        if (action === "account-toggle-group") await toggleAccountGroup(target.dataset.accountType);
        if (action === "account-group-up") await moveAccountGroup(target.dataset.accountType, -1);
        if (action === "account-group-down") await moveAccountGroup(target.dataset.accountType, 1);
        if (action === "account-pin") await toggleAccountPin(id);
        if (action === "account-archive") await toggleAccountArchive(id);
        if (action === "account-up") await moveAccountWithinGroup(id, -1);
        if (action === "account-down") await moveAccountWithinGroup(id, 1);
        if (action === "account-details") openAccountDetails(id);
        if (action === "account-duplicate") await duplicateAccountConfiguration(id);
        if (action === "account-export") exportAccountTransactions(id);
        if (action === "reminder-snooze") await snoozeBillReminder(target.dataset.reminderKey, Number(target.dataset.days || 1));
        if (action === "reminder-topup") openReminderTopUp(target.dataset.reminderKey);
        if (action === "reminder-paid") await markReminderPaid(target.dataset.reminderKey);
        if (action === "reminder-edit") editReminderSource(target.dataset.reminderKey);
      } catch (error) {
        recordProError(error, "click-action");
        showToast(error.message || "Aksi gagal dijalankan.", "❗");
      }
    });

    document.addEventListener("change", async (event) => {
      if (!state) return;
      if (event.target.id === "proDashboardRange") {
        state.settings.dashboardRange = event.target.value;
        await encryptState();
        renderProDashboard();
      }
      if (event.target.matches(".pro-tx-select")) updateBulkSelectionCount();
      if (event.target.id === "proSelectAllTransactions") {
        document.querySelectorAll(".pro-tx-select").forEach((box) => { box.checked = event.target.checked; });
        updateBulkSelectionCount();
      }
      if (event.target.id === "proAccountTypeFilter") { accountTypeFilter = event.target.value; renderAccountWorkspace(); }
      if (event.target.id === "proAccountSort") { state.settings.accountSort = event.target.value; await encryptState(); renderAccountWorkspace(); }
      if (event.target.id === "proAccountLayout") { state.settings.accountLayout = event.target.value; await encryptState(); renderAccountWorkspace(); }
      if (event.target.id === "proAccountShowZero") { state.settings.accountShowZero = event.target.checked; await encryptState(); renderAccountWorkspace(); }
      if (event.target.id === "proAccountShowArchived") { state.settings.accountShowArchived = event.target.checked; await encryptState(); renderAccountWorkspace(); }

      const settingMap = {
        proAutoRecurring: "autoPostRecurring",
        proBudgetAlerts: "smartBudgetAlerts",
        proBillReminderEnabled: "billReminderEnabled",
        proBillReminderPopup: "billReminderPopup",
        proBillReminderLowBalance: "billReminderLowBalance",
        proBillReminderDebts: "billReminderIncludeDebts",
        proBillReminderCredit: "billReminderIncludeCredit",
        proAttachmentAutoSync: "syncAttachments",
        proAutoBackup: "autoBackup"
      };
      if (settingMap[event.target.id]) {
        state.settings[settingMap[event.target.id]] = event.target.checked;
        await encryptState();
        renderProSettings();
        updateReminderBadge();
      }
      if (event.target.id === "proBillReminderDays") {
        const days = parseReminderDays(event.target.value);
        if (!days.length) { showToast("Masukkan minimal satu angka hari.", "❗"); renderProSettings(); return; }
        state.settings.billReminderDays = days;
        await encryptState();
        updateReminderBadge();
      }
      if (event.target.id === "proBillReminderBuffer") {
        state.settings.billReminderTopUpBufferPercent = clamp(safeNumber(event.target.value), 0, 100);
        await encryptState();
        updateReminderBadge();
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id === "proAccountSearch") {
        accountSearchQuery = event.target.value.trim().toLowerCase();
        renderAccountWorkspace(false);
        const search = document.getElementById("proAccountSearch");
        if (search) { search.focus(); search.setSelectionRange(search.value.length, search.value.length); }
      }
    });

    document.getElementById("proFullBackupInput")?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (file) await restoreFullBackup(file);
      event.target.value = "";
    });

    document.getElementById("proPartialBackupInput")?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (file) await showPartialRestore(file);
      event.target.value = "";
    });

    window.addEventListener("online", () => {
      updateOnlineStatus();
      retryQueuedSync();
    });
    window.addEventListener("offline", updateOnlineStatus);

    const loginForm = document.getElementById("loginForm");
    loginForm?.addEventListener("submit", (event) => {
      const guard = loadLoginGuard();
      if (guard.lockUntil > Date.now()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const seconds = Math.ceil((guard.lockUntil - Date.now()) / 1000);
        document.getElementById("loginError").textContent = `Terlalu banyak percobaan. Coba lagi dalam ${seconds} detik.`;
        return;
      }
      const evaluateLoginResult = () => {
        if (loginAttemptInProgress) {
          window.setTimeout(evaluateLoginResult, 150);
          return;
        }

        const failed = !state && document.getElementById("loginError")?.textContent;
        if (failed) registerFailedLogin();
        else clearLoginGuard();
        renderLoginGuard();
      };

      window.setTimeout(evaluateLoginResult, 150);
    }, true);
  }

  function installGlobalErrorCapture() {
    window.addEventListener("error", (event) => {
      recordProError(event.error || new Error(event.message), "window.error");
    });
    window.addEventListener("unhandledrejection", (event) => {
      recordProError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), "unhandledrejection");
    });
  }

  function recordProError(error, context = "unknown") {
    if (!state) return;
    state.errorLog ||= [];
    state.errorLog.unshift({
      id: proId("error"),
      message: String(error?.message || error || "Error"),
      stack: String(error?.stack || "").slice(0, 2500),
      context,
      timestamp: nowIso(),
      url: location.href
    });
    state.errorLog = state.errorLog.slice(0, 100);
    window.setTimeout(() => currentKey && encryptState().catch(console.error), 100);
  }

  function renderProAll() {
    if (!state) return;
    renderCycle += 1;
    ensureProState();
    renderProDashboard();
    renderDebts();
    renderInvestments();
    renderSharedWallets();
    renderProTransactions();
    renderDashboardDragAndDrop();
    renderAccountWorkspace();
    renderSmartBudgets();
    renderProCloud();
    renderProSettings();
    renderLocalSnapshots();
    renderErrors();
    renderOnboarding();
    renderLoginGuard();
    updateOnlineStatus();
    checkSecurityGeneration();
  }

  function dateRangeStart(range) {
    if (range === "all") return new Date("2000-01-01T00:00:00");
    const days = ({ "7d": 7, "30d": 30, "90d": 90, "180d": 180, "365d": 365 })[range] || 30;
    const date = new Date();
    date.setDate(date.getDate() - days + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function rangedTransactions(range = state.settings.dashboardRange) {
    const start = dateRangeStart(range);
    return financialItems(state.transactions).filter((tx) => tx.status !== "cancelled" && new Date(`${tx.date}T00:00:00`) >= start);
  }

  function rangeDays(range) {
    if (range === "all") {
      const dates = financialItems(state.transactions).map((tx) => new Date(`${tx.date}T00:00:00`).getTime()).filter(Number.isFinite);
      if (!dates.length) return 1;
      return Math.max(1, Math.ceil((Date.now() - Math.min(...dates)) / 86400000));
    }
    return ({ "7d": 7, "30d": 30, "90d": 90, "180d": 180, "365d": 365 })[range] || 30;
  }

  function proTotals() {
    return rangedTransactions().reduce((result, tx) => {
      if (tx.type === "transfer") return result;
      const value = transactionBaseValue(tx);
      if (tx.type === "income") result.income += value;
      if (tx.type === "expense") result.expense += value;
      return result;
    }, { income: 0, expense: 0 });
  }

  function investmentValueInBase(item) {
    const native = safeNumber(item.quantity) * safeNumber(item.currentPrice);
    return convertCurrency(native, item.currency, state.settings.baseCurrency) ?? 0;
  }

  function investmentCostInBase(item) {
    const native = safeNumber(item.quantity) * safeNumber(item.avgCost);
    return convertCurrency(native, item.currency, state.settings.baseCurrency) ?? 0;
  }

  function totalInvestmentValue() {
    return financialItems(state.investments).filter((item) => item.includeInNetWorth !== false).reduce((sum, item) => sum + investmentValueInBase(item), 0);
  }

  function renderProDashboard() {
    const container = document.getElementById("proDashboardAnalytics");
    if (!container || !state) return;
    const rangeSelect = document.getElementById("proDashboardRange");
    if (rangeSelect) rangeSelect.value = state.settings.dashboardRange || "30d";

    const totals = proTotals();
    const days = rangeDays(state.settings.dashboardRange);
    const savingRate = totals.income > 0 ? ((totals.income - totals.expense) / totals.income) * 100 : 0;
    const burnRate = totals.expense / Math.max(days, 1);
    const liquidAssets = financialItems(state.accounts).filter((account) => !account.liability && ["bank", "cash", "ewallet"].includes(account.type)).reduce((sum, account) => sum + accountValueInBase(account), 0);
    const runway = burnRate > 0 ? liquidAssets / burnRate : 0;
    const proNetWorth = netWorth();
    const investmentGain = financialItems(state.investments).reduce((sum, item) => sum + investmentValueInBase(item) - investmentCostInBase(item), 0);

    container.innerHTML = `
      <div class="pro-kpi-grid">
        ${proKpi("Saving Rate", `${savingRate.toFixed(1)}%`, savingRate >= 20 ? "Sehat: ≥20%" : "Targetkan minimal 20%", savingRate >= 20 ? "positive" : "negative")}
        ${proKpi("Burn Rate Harian", formatCurrency(burnRate), `Rata-rata ${days} hari`, "")}
        ${proKpi("Cash Runway", `${runway.toFixed(0)} hari`, "Likuiditas ÷ pengeluaran harian", runway >= 90 ? "positive" : "negative")}
        ${proKpi("Net Worth Lengkap", formatCurrency(proNetWorth), `Investasi: ${formatCurrency(totalInvestmentValue())}`, proNetWorth >= 0 ? "positive" : "negative")}
      </div>
      <div class="pro-chart-grid">
        <article class="panel pro-chart-wrap">
          <header class="panel-header"><div><h4>Perjalanan Net Worth</h4><p>Estimasi 12 bulan berdasarkan arus kas historis.</p></div></header>
          <canvas id="proNetWorthChart"></canvas>
        </article>
        <article class="panel pro-chart-wrap">
          <header class="panel-header"><div><h4>Saldo per Akun</h4><p>Nilai akun dalam mata uang utama.</p></div></header>
          <canvas id="proAccountChart"></canvas>
        </article>
      </div>
      <div class="report-layout" style="margin-top:18px">
        <article class="panel"><header class="panel-header"><div><h4>Health Check</h4><p>Indikator keuangan cepat.</p></div></header>
          <div class="pro-metric-row"><span>Surplus periode</span><strong class="${totals.income - totals.expense >= 0 ? "positive" : "negative"}">${formatCurrency(totals.income - totals.expense)}</strong></div>
          <div class="pro-metric-row"><span>Rasio utang terhadap aset</span><strong>${totalAssets() > 0 ? ((totalLiabilities() / totalAssets()) * 100).toFixed(1) : "0"}%</strong></div>
          <div class="pro-metric-row"><span>Untung/rugi investasi</span><strong class="${investmentGain >= 0 ? "positive" : "negative"}">${formatCurrency(investmentGain)}</strong></div>
          <div class="pro-metric-row"><span>Budget berisiko</span><strong>${financialItems(state.budgets).filter((budget) => budgetSpent(budget) >= safeNumber(budget.limit) * .9).length}</strong></div>
        </article>
        <article class="panel"><header class="panel-header"><div><h4>Top Merchant</h4><p>Tujuan pengeluaran terbesar pada periode.</p></div></header>${renderTopMerchants()}</article>
      </div>
    `;
    requestAnimationFrame(renderProDashboardCharts);
  }

  function proKpi(label, value, detail, className) {
    return `<article class="pro-kpi"><span>${escapeHTML(label)}</span><strong class="money ${className}">${value}</strong><small>${escapeHTML(detail)}</small></article>`;
  }

  function renderTopMerchants() {
    const map = new Map();
    rangedTransactions().filter((tx) => tx.type === "expense").forEach((tx) => {
      const key = tx.merchant || tx.description || "Lainnya";
      map.set(key, (map.get(key) || 0) + transactionBaseValue(tx));
    });
    const items = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!items.length) return `<div class="pro-empty"><div><strong>Belum ada data</strong>Merchant akan muncul setelah transaksi dicatat.</div></div>`;
    return `<div class="simple-list">${items.map(([name, amount]) => `<div class="simple-item"><span>${escapeHTML(name)}</span><strong class="money">${formatCurrency(amount)}</strong></div>`).join("")}</div>`;
  }

  function estimatedMonthlyNetWorth() {
    const points = [];
    let value = netWorth();
    for (let offset = 0; offset > -12; offset -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() + offset);
      points.unshift({
        label: new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit" }).format(date),
        value
      });
      const totals = periodTotals(offset);
      value -= totals.income - totals.expense;
    }
    return points;
  }

  function renderProDashboardCharts() {
    if (!state || typeof Chart === "undefined") return;
    proDashboardChart?.destroy();
    proAccountChart?.destroy();
    const netCanvas = document.getElementById("proNetWorthChart");
    const accountCanvas = document.getElementById("proAccountChart");
    if (netCanvas) {
      const points = estimatedMonthlyNetWorth();
      proDashboardChart = new Chart(netCanvas, {
        type: "line",
        data: { labels: points.map((p) => p.label), datasets: [{ label: "Net Worth", data: points.map((p) => p.value), borderColor: "#7558ff", backgroundColor: "rgba(117,88,255,.15)", fill: true, tension: .35 }] },
        options: chartOptions()
      });
    }
    if (accountCanvas) {
      const accounts = financialItems(state.accounts).slice().sort((a, b) => accountValueInBase(b) - accountValueInBase(a)).slice(0, 10);
      proAccountChart = new Chart(accountCanvas, {
        type: "bar",
        data: { labels: accounts.map((item) => item.name), datasets: [{ label: "Saldo", data: accounts.map(accountValueInBase), backgroundColor: accounts.map((item) => item.color || "#7558ff"), borderWidth: 0 }] },
        options: chartOptions()
      });
    }
  }

  function debtPaid(debt) {
    return (debt.payments || []).reduce((sum, payment) => sum + safeNumber(payment.principalAmount ?? payment.amount), 0);
  }

  function debtBalance(debt) {
    if (debt.balance !== undefined && debt.balance !== null) return Math.max(0, safeNumber(debt.balance));
    return Math.max(0, safeNumber(debt.principal) - debtPaid(debt));
  }

  function debtMonthlyInterest(debt) {
    return debtBalance(debt) * (safeNumber(debt.interestRate) / 100 / 12);
  }

  function estimatePayoffMonths(debt, extra = 0) {
    let balance = debtBalance(debt);
    const rate = safeNumber(debt.interestRate) / 100 / 12;
    const payment = safeNumber(debt.monthlyPayment) + safeNumber(extra);
    if (balance <= 0) return 0;
    if (payment <= balance * rate) return Infinity;
    let months = 0;
    while (balance > 0.01 && months < 1200) {
      balance += balance * rate;
      balance -= payment;
      months += 1;
    }
    return months;
  }

  function nextDueDate(debt) {
    const today = new Date();
    const day = clamp(safeNumber(debt.dueDay) || 1, 1, 28);
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) date.setMonth(date.getMonth() + 1);
    return date;
  }

  function renderDebts() {
    const grid = document.getElementById("proDebtGrid");
    if (!grid || !state) return;
    const debts = financialItems(state.debts || []);
    const payable = debts.filter((item) => item.kind !== "receivable" && item.status !== "paid");
    const receivable = debts.filter((item) => item.kind === "receivable" && item.status !== "paid");
    const totalDebt = payable.reduce((sum, item) => sum + (convertCurrency(debtBalance(item), item.currency, state.settings.baseCurrency) ?? 0), 0);
    const totalReceivable = receivable.reduce((sum, item) => sum + (convertCurrency(debtBalance(item), item.currency, state.settings.baseCurrency) ?? 0), 0);
    const monthly = payable.reduce((sum, item) => sum + (convertCurrency(item.monthlyPayment || 0, item.currency, state.settings.baseCurrency) ?? 0), 0);

    document.getElementById("proDebtSummary").innerHTML = `<div class="pro-kpi-grid" style="margin:0 0 18px">
      ${proKpi("Total Utang", formatCurrency(totalDebt), `${payable.length} kewajiban aktif`, totalDebt > 0 ? "negative" : "positive")}
      ${proKpi("Total Piutang", formatCurrency(totalReceivable), `${receivable.length} piutang aktif`, "positive")}
      ${proKpi("Bayar per Bulan", formatCurrency(monthly), "Minimum pembayaran terjadwal", "")}
      ${proKpi("Debt Ratio", `${totalAssets() > 0 ? ((totalDebt / totalAssets()) * 100).toFixed(1) : "0"}%`, "Utang ÷ total aset", totalDebt / Math.max(totalAssets(), 1) < .3 ? "positive" : "negative")}
    </div>`;

    grid.innerHTML = debts.length ? debts.map((debt) => {
      const balance = debtBalance(debt);
      const principal = Math.max(safeNumber(debt.principal), balance);
      const progress = principal > 0 ? ((principal - balance) / principal) * 100 : 100;
      const payoff = estimatePayoffMonths(debt);
      return `<article class="pro-card" style="--pro-card-color:${debt.color || "#ff5967"}">
        <div class="pro-card-title"><div><span class="badge">${debt.kind === "receivable" ? "Piutang" : debt.kind === "installment" ? "Cicilan" : "Utang"}</span><h4 style="margin-top:10px">${escapeHTML(debt.name)}</h4></div><span>${debt.kind === "receivable" ? "📗" : "📕"}</span></div>
        <strong class="pro-card-value money ${debt.kind === "receivable" ? "positive" : "negative"}">${formatCurrency(balance, debt.currency)}</strong>
        <p class="muted">${escapeHTML(debt.lender || debt.borrower || "")} · Bunga ${safeNumber(debt.interestRate).toFixed(2)}%/tahun</p>
        <div class="progress-track" style="margin-top:15px"><div class="progress-bar" style="width:${clamp(progress, 0, 100)}%;background:${debt.color || "#ff5967"}"></div></div>
        <div class="progress-meta"><span>${progress.toFixed(1)}% lunas</span><span>${Number.isFinite(payoff) ? `${payoff} bulan` : "Pembayaran terlalu kecil"}</span></div>
        <div class="pro-chip-row"><span class="pro-chip">Jatuh tempo tgl ${debt.dueDay || "-"}</span><span class="pro-chip">${formatCurrency(debt.monthlyPayment || 0, debt.currency)}/bln</span></div>
        <div class="pro-card-actions">
          <button class="button primary" data-pro-action="pay-debt" data-pro-id="${debt.id}" type="button">Bayar</button>
          <button class="button secondary" data-pro-action="edit-debt" data-pro-id="${debt.id}" type="button">Edit</button>
          <button class="mini-button" data-pro-action="delete-debt" data-pro-id="${debt.id}" type="button">🗑️</button>
        </div>
      </article>`;
    }).join("") : `<div class="pro-empty" style="grid-column:1/-1"><div><strong>Belum ada utang atau piutang</strong>Tambahkan cicilan, pinjaman, utang, atau piutang untuk memantau pelunasannya.</div></div>`;

    renderDebtStrategy();
    renderDebtDueList();
  }

  function sortedDebtStrategy(strategy = state.settings.defaultDebtStrategy || "avalanche") {
    const items = financialItems(state.debts).filter((item) => item.kind !== "receivable" && debtBalance(item) > 0);
    return items.sort((a, b) => strategy === "snowball" ? debtBalance(a) - debtBalance(b) : safeNumber(b.interestRate) - safeNumber(a.interestRate));
  }

  function renderDebtStrategy() {
    const container = document.getElementById("proDebtStrategy");
    if (!container) return;
    const strategy = state.settings.defaultDebtStrategy || "avalanche";
    const items = sortedDebtStrategy(strategy);
    container.innerHTML = `
      <div class="pro-tabs">
        <button class="pro-tab ${strategy === "avalanche" ? "active" : ""}" data-pro-action="strategy-avalanche" type="button">Avalanche</button>
        <button class="pro-tab ${strategy === "snowball" ? "active" : ""}" data-pro-action="strategy-snowball" type="button">Snowball</button>
      </div>
      ${items.length
        ? `<div class="pro-strategy-list">${items.map((item, index) => `<div class="pro-strategy-item"><span class="pro-rank">${index + 1}</span><span><strong>${escapeHTML(item.name)}</strong><small>${safeNumber(item.interestRate).toFixed(2)}% · ${formatCurrency(debtBalance(item), item.currency)}</small></span><strong>${formatCurrency(item.monthlyPayment || 0, item.currency)}</strong></div>`).join("")}</div>`
        : `<div class="pro-empty"><div><strong>Tidak ada utang aktif</strong>Strategi akan muncul setelah utang ditambahkan.</div></div>`}
    `;
    container.querySelector('[data-pro-action="strategy-avalanche"]')?.addEventListener("click", async () => { state.settings.defaultDebtStrategy = "avalanche"; await encryptState(); renderDebtStrategy(); });
    container.querySelector('[data-pro-action="strategy-snowball"]')?.addEventListener("click", async () => { state.settings.defaultDebtStrategy = "snowball"; await encryptState(); renderDebtStrategy(); });
  }

  function renderDebtDueList() {
    const container = document.getElementById("proDebtDueList");
    if (!container) return;
    const items = financialItems(state.debts).filter((item) => debtBalance(item) > 0).map((item) => ({ ...item, due: nextDueDate(item) })).sort((a, b) => a.due - b.due).slice(0, 8);
    container.innerHTML = items.length ? `<div class="simple-list">${items.map((item) => `<div class="simple-item"><span><strong>${escapeHTML(item.name)}</strong>${new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(item.due)}</span><strong class="money">${formatCurrency(item.monthlyPayment || 0, item.currency)}</strong></div>`).join("")}</div>` : `<div class="pro-empty"><div><strong>Tidak ada jatuh tempo</strong>Semua kewajiban sudah selesai.</div></div>`;
  }

  function openDebtForm(existing = null) {
    const debt = existing || { name: "", kind: "debt", lender: "", principal: "", balance: "", currency: state.settings.baseCurrency, interestRate: 0, monthlyPayment: "", dueDay: 1, startDate: localISO(), endDate: "", accountId: financialItems(state.accounts)[0]?.id || "", profileId: activeFinancialUserId(), color: "#ff5967", notes: "", payments: [], status: "active" };
    showModal(existing ? "Edit Utang/Piutang" : "Tambah Utang/Piutang", "Lengkapi nominal, bunga, cicilan, dan jatuh tempo.", `
      <form id="proDebtForm"><div class="form-grid">
        <label class="field full"><span>Nama</span><input class="input" id="proDebtName" value="${escapeHTML(debt.name)}" required /></label>
        <label class="field"><span>Jenis</span><select class="input" id="proDebtKind"><option value="debt" ${debt.kind === "debt" ? "selected" : ""}>Utang</option><option value="installment" ${debt.kind === "installment" ? "selected" : ""}>Cicilan</option><option value="receivable" ${debt.kind === "receivable" ? "selected" : ""}>Piutang</option></select></label>
        <label class="field"><span>Pemberi/peminjam</span><input class="input" id="proDebtLender" value="${escapeHTML(debt.lender || debt.borrower || "")}" /></label>
        <label class="field"><span>Pokok awal</span><input class="input" id="proDebtPrincipal" type="number" min="0" step="any" value="${debt.principal}" required /></label>
        <label class="field"><span>Sisa sekarang</span><input class="input" id="proDebtBalance" type="number" min="0" step="any" value="${debtBalance(debt)}" required /></label>
        <label class="field"><span>Mata uang</span><select class="input" id="proDebtCurrency">${currencyOptions(debt.currency)}</select></label>
        <label class="field"><span>Bunga per tahun (%)</span><input class="input" id="proDebtInterest" type="number" min="0" step="0.01" value="${debt.interestRate || 0}" /></label>
        <label class="field"><span>Pembayaran bulanan</span><input class="input" id="proDebtMonthly" type="number" min="0" step="any" value="${debt.monthlyPayment || 0}" /></label>
        <label class="field"><span>Tanggal jatuh tempo</span><input class="input" id="proDebtDueDay" type="number" min="1" max="28" value="${debt.dueDay || 1}" /></label>
        <label class="field"><span>Akun pembayaran</span><select class="input" id="proDebtAccount"><option value="">Tidak ditautkan</option>${accountOptions(debt.accountId)}</select></label>
        <label class="field"><span>Tanggal mulai</span><input class="input" id="proDebtStart" type="date" value="${debt.startDate || localISO()}" /></label>
        <label class="field"><span>Target selesai</span><input class="input" id="proDebtEnd" type="date" value="${debt.endDate || ""}" /></label>
        <label class="field"><span>Warna</span><input class="input" id="proDebtColor" type="color" value="${debt.color || "#ff5967"}" /></label>
        <label class="field full"><span>Catatan</span><textarea id="proDebtNotes">${escapeHTML(debt.notes || "")}</textarea></label>
      </div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proDebtForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const next = {
        id: existing?.id || proId("debt"), name: document.getElementById("proDebtName").value.trim(), kind: document.getElementById("proDebtKind").value,
        lender: document.getElementById("proDebtLender").value.trim(), principal: safeNumber(document.getElementById("proDebtPrincipal").value), balance: safeNumber(document.getElementById("proDebtBalance").value),
        currency: document.getElementById("proDebtCurrency").value, interestRate: safeNumber(document.getElementById("proDebtInterest").value), monthlyPayment: safeNumber(document.getElementById("proDebtMonthly").value),
        dueDay: safeNumber(document.getElementById("proDebtDueDay").value), accountId: document.getElementById("proDebtAccount").value, startDate: document.getElementById("proDebtStart").value,
        endDate: document.getElementById("proDebtEnd").value, color: document.getElementById("proDebtColor").value, notes: document.getElementById("proDebtNotes").value.trim(), payments: existing?.payments || [],
        status: safeNumber(document.getElementById("proDebtBalance").value) <= 0 ? "paid" : "active", profileId: state.accounts.find((account) => account.id === document.getElementById("proDebtAccount").value)?.profileId || existing?.profileId || activeFinancialUserId(), updatedAt: nowIso(), createdAt: existing?.createdAt || nowIso()
      };
      await commit(existing ? "Utang diperbarui" : "Utang ditambahkan", next.name, () => {
        if (existing) state.debts[state.debts.findIndex((item) => item.id === existing.id)] = next; else state.debts.push(next);
      });
      closeModal(); showToast("Data utang berhasil disimpan.", "🧮");
    });
  }

  function openDebtPaymentForm(debt) {
    if (!debt) return;
    showModal("Catat Pembayaran", debt.name, `<form id="proDebtPaymentForm"><div class="form-stack">
      <label class="field"><span>Nominal pembayaran</span><input class="input" id="proDebtPayAmount" type="number" min="0.00000001" step="any" value="${debt.monthlyPayment || ""}" required /></label>
      <label class="field"><span>Tanggal</span><input class="input" id="proDebtPayDate" type="date" value="${localISO()}" required /></label>
      <label class="field"><span>Akun</span><select class="input" id="proDebtPayAccount"><option value="">Tanpa transaksi akun</option>${accountOptions(debt.accountId)}</select></label>
      <label class="field"><span>Catatan</span><input class="input" id="proDebtPayNotes" /></label>
    </div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Bayar</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proDebtPaymentForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const amount = safeNumber(document.getElementById("proDebtPayAmount").value);
      const accountId = document.getElementById("proDebtPayAccount").value;
      const account = state.accounts.find((item) => item.id === accountId);
      const date = document.getElementById("proDebtPayDate").value;
      await commit("Pembayaran utang", debt.name, () => {
        debt.payments ||= [];
        debt.payments.push({ id: proId("payment"), amount, principalAmount: Math.max(0, amount - debtMonthlyInterest(debt)), interestAmount: Math.min(amount, debtMonthlyInterest(debt)), date, notes: document.getElementById("proDebtPayNotes").value.trim(), accountId });
        debt.balance = Math.max(0, debtBalance(debt) - Math.max(0, amount - debtMonthlyInterest(debt)));
        debt.status = debt.balance <= 0 ? "paid" : "active";
        if (account) {
          const rate = convertCurrency(1, account.currency, state.settings.baseCurrency) ?? 0;
          state.transactions.push({ id: proId("tx"), type: debt.kind === "receivable" ? "income" : "expense", description: `${debt.kind === "receivable" ? "Pembayaran piutang" : "Pembayaran utang"}: ${debt.name}`, merchant: debt.lender || "", date, accountId, destinationAccountId: null, amount, destinationAmount: null, fee: 0, currency: account.currency, category: debt.kind === "receivable" ? "Lainnya" : "Tagihan", splits: [], tags: ["utang", "cicilan"], notes: "Dibuat dari modul utang.", status: "completed", deductible: false, reconciled: false, profileId: account.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate, baseAmount: amount * rate, attachmentIds: [], installmentId: debt.id, createdAt: nowIso() });
        }
      });
      closeModal(); showToast("Pembayaran berhasil dicatat.", "✅");
    });
  }

  async function deleteDebt(id) {
    const debt = state.debts.find((item) => item.id === id);
    if (!debt || !confirm(`Hapus "${debt.name}"?`)) return;
    await commit("Utang dihapus", debt.name, () => { state.debts = state.debts.filter((item) => item.id !== id); });
  }

  function openDebtSimulator() {
    const total = sortedDebtStrategy().reduce((sum, item) => sum + debtBalance(item), 0);
    showModal("Simulator Pelunasan", "Bandingkan snowball dan avalanche dengan tambahan pembayaran bulanan.", `<form id="proDebtSimulatorForm"><div class="form-stack"><label class="field"><span>Tambahan pembayaran per bulan</span><input class="input" id="proDebtExtra" type="number" min="0" step="any" value="0" /></label><label class="field"><span>Metode</span><select class="input" id="proDebtSimStrategy"><option value="avalanche">Avalanche — bunga tertinggi dahulu</option><option value="snowball">Snowball — saldo terkecil dahulu</option></select></label></div><div id="proDebtSimulationResult" style="margin-top:16px"></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Tutup</button><button class="button primary" type="submit">Hitung</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    const form = document.getElementById("proDebtSimulatorForm");
    form.addEventListener("submit", (event) => { event.preventDefault(); renderDebtSimulation(total); });
    renderDebtSimulation(total);
  }

  function renderDebtSimulation(total) {
    const extra = safeNumber(document.getElementById("proDebtExtra")?.value);
    const strategy = document.getElementById("proDebtSimStrategy")?.value || "avalanche";
    const debts = sortedDebtStrategy(strategy);
    let months = 0;
    let balances = debts.map((item) => ({ ...item, simBalance: debtBalance(item) }));
    let totalInterest = 0;
    while (balances.some((item) => item.simBalance > .01) && months < 1200) {
      let extraPool = extra;
      balances.forEach((item) => {
        if (item.simBalance <= 0) return;
        const interest = item.simBalance * safeNumber(item.interestRate) / 100 / 12;
        totalInterest += interest;
        item.simBalance += interest;
        const basePay = Math.min(item.simBalance, safeNumber(item.monthlyPayment));
        item.simBalance -= basePay;
      });
      for (const item of balances) {
        if (item.simBalance <= 0 || extraPool <= 0) continue;
        const pay = Math.min(item.simBalance, extraPool);
        item.simBalance -= pay;
        extraPool -= pay;
      }
      months += 1;
    }
    const result = document.getElementById("proDebtSimulationResult");
    if (result) result.innerHTML = `<div class="pro-success-box"><strong>Estimasi selesai dalam ${months >= 1200 ? ">100 tahun" : `${months} bulan`}</strong><br>Total saldo awal ${formatCurrency(total)} · estimasi bunga ${formatCurrency(totalInterest)}.</div>`;
  }

  function investmentDividendTotal(item) {
    return (item.dividends || []).reduce((sum, row) => sum + (convertCurrency(row.amount, item.currency, state.settings.baseCurrency) ?? 0), 0);
  }

  function renderInvestments() {
    const grid = document.getElementById("proInvestmentGrid");
    if (!grid || !state) return;
    const value = totalInvestmentValue();
    const cost = financialItems(state.investments).reduce((sum, item) => sum + investmentCostInBase(item), 0);
    const gain = value - cost;
    const dividends = financialItems(state.investments).reduce((sum, item) => sum + investmentDividendTotal(item), 0);
    const returnPct = cost > 0 ? (gain / cost) * 100 : 0;

    document.getElementById("proInvestmentSummary").innerHTML = `<div class="pro-kpi-grid" style="margin:0 0 18px">
      ${proKpi("Nilai Portofolio", formatCurrency(value), `${financialItems(state.investments).length} aset`, "")}
      ${proKpi("Modal", formatCurrency(cost), "Harga rata-rata × jumlah", "")}
      ${proKpi("Untung / Rugi", formatCurrency(gain), `${returnPct.toFixed(2)}% return`, gain >= 0 ? "positive" : "negative")}
      ${proKpi("Pendapatan Pasif", formatCurrency(dividends), "Dividen, kupon, dan sewa", "positive")}
    </div>`;

    document.getElementById("proInvestmentPerformance").innerHTML = `<div class="pro-metric-row"><span>Total nilai</span><strong>${formatCurrency(value)}</strong></div><div class="pro-metric-row"><span>Total modal</span><strong>${formatCurrency(cost)}</strong></div><div class="pro-metric-row"><span>Capital gain</span><strong class="${gain >= 0 ? "positive" : "negative"}">${formatCurrency(gain)}</strong></div><div class="pro-metric-row"><span>Income yield</span><strong>${cost > 0 ? ((dividends / cost) * 100).toFixed(2) : "0"}%</strong></div>`;

    grid.innerHTML = financialItems(state.investments).length ? financialItems(state.investments).map((item) => {
      const nativeValue = safeNumber(item.quantity) * safeNumber(item.currentPrice);
      const nativeCost = safeNumber(item.quantity) * safeNumber(item.avgCost);
      const nativeGain = nativeValue - nativeCost;
      const pct = nativeCost > 0 ? nativeGain / nativeCost * 100 : 0;
      return `<article class="pro-card" style="--pro-card-color:${item.color || "#13b888"}">
        <div class="pro-card-title"><div><span class="badge">${escapeHTML(item.type)}</span><h4 style="margin-top:10px">${escapeHTML(item.name)} ${item.symbol ? `<small>(${escapeHTML(item.symbol)})</small>` : ""}</h4></div><span>${investmentIcon(item.type)}</span></div>
        <strong class="pro-card-value money">${formatCurrency(nativeValue, item.currency)}</strong>
        <p class="muted">${safeNumber(item.quantity).toLocaleString("id-ID")} unit × ${formatCurrency(item.currentPrice, item.currency)}</p>
        <div class="pro-chip-row"><span class="pro-chip ${nativeGain >= 0 ? "good" : "bad"}">${nativeGain >= 0 ? "+" : ""}${formatCurrency(nativeGain, item.currency)} · ${pct.toFixed(2)}%</span><span class="pro-chip">Dividen ${formatCurrency((item.dividends || []).reduce((sum, row) => sum + safeNumber(row.amount), 0), item.currency)}</span></div>
        <div class="pro-card-actions"><button class="button secondary" data-pro-action="edit-investment" data-pro-id="${item.id}" type="button">Edit</button><button class="mini-button" data-pro-action="delete-investment" data-pro-id="${item.id}" type="button">🗑️</button></div>
      </article>`;
    }).join("") : `<div class="pro-empty" style="grid-column:1/-1"><div><strong>Belum ada investasi atau aset</strong>Tambahkan saham, emas, properti, kendaraan, deposito, atau aset usaha.</div></div>`;

    requestAnimationFrame(renderInvestmentChart);
  }

  function investmentIcon(type) {
    return ({ saham: "📊", emas: "🪙", reksadana: "📈", deposito: "🏦", kripto: "₿", properti: "🏠", kendaraan: "🚗", bisnis: "🏪", lainnya: "💎" })[type] || "💎";
  }

  function renderInvestmentChart() {
    if (!state || typeof Chart === "undefined") return;
    proInvestmentChart?.destroy();
    const canvas = document.getElementById("proInvestmentChart");
    if (!canvas) return;
    const items = financialItems(state.investments).filter((item) => investmentValueInBase(item) > 0);
    proInvestmentChart = new Chart(canvas, {
      type: "doughnut",
      data: { labels: items.map((item) => item.name), datasets: [{ data: items.map(investmentValueInBase), backgroundColor: items.map((item) => item.color || "#7558ff"), borderWidth: 0 }] },
      options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() } } } }
    });
  }

  function openInvestmentForm(existing = null) {
    const item = existing || { name: "", symbol: "", type: "saham", quantity: "", avgCost: "", currentPrice: "", currency: state.settings.baseCurrency, accountId: "", profileId: activeFinancialUserId(), includeInNetWorth: true, color: "#13b888", notes: "", dividends: [] };
    showModal(existing ? "Edit Investasi/Aset" : "Tambah Investasi/Aset", "Nilai dapat diperbarui manual kapan pun.", `<form id="proInvestmentForm"><div class="form-grid">
      <label class="field full"><span>Nama aset</span><input class="input" id="proInvestmentName" value="${escapeHTML(item.name)}" required /></label>
      <label class="field"><span>Simbol/kode</span><input class="input" id="proInvestmentSymbol" value="${escapeHTML(item.symbol || "")}" /></label>
      <label class="field"><span>Jenis</span><select class="input" id="proInvestmentType">${["saham","emas","reksadana","deposito","kripto","properti","kendaraan","bisnis","lainnya"].map((type) => `<option value="${type}" ${item.type === type ? "selected" : ""}>${investmentIcon(type)} ${type}</option>`).join("")}</select></label>
      <label class="field"><span>Jumlah/unit</span><input class="input" id="proInvestmentQuantity" type="number" min="0" step="any" value="${item.quantity}" required /></label>
      <label class="field"><span>Harga rata-rata</span><input class="input" id="proInvestmentAvg" type="number" min="0" step="any" value="${item.avgCost}" required /></label>
      <label class="field"><span>Harga/nilai sekarang</span><input class="input" id="proInvestmentCurrent" type="number" min="0" step="any" value="${item.currentPrice}" required /></label>
      <label class="field"><span>Mata uang</span><select class="input" id="proInvestmentCurrency">${currencyOptions(item.currency)}</select></label>
      <label class="field"><span>Akun pendanaan</span><select class="input" id="proInvestmentAccount"><option value="">Tidak ditautkan</option>${accountOptions(item.accountId)}</select></label>
      <label class="field"><span>Warna</span><input class="input" id="proInvestmentColor" type="color" value="${item.color || "#13b888"}" /></label>
      <label class="field full"><span><input id="proInvestmentNetWorth" type="checkbox" ${item.includeInNetWorth !== false ? "checked" : ""} /> Masukkan ke perhitungan net worth</span></label>
      <label class="field full"><span>Catatan</span><textarea id="proInvestmentNotes">${escapeHTML(item.notes || "")}</textarea></label>
    </div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proInvestmentForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const next = { id: existing?.id || proId("investment"), name: document.getElementById("proInvestmentName").value.trim(), symbol: document.getElementById("proInvestmentSymbol").value.trim(), type: document.getElementById("proInvestmentType").value, quantity: safeNumber(document.getElementById("proInvestmentQuantity").value), avgCost: safeNumber(document.getElementById("proInvestmentAvg").value), currentPrice: safeNumber(document.getElementById("proInvestmentCurrent").value), currency: document.getElementById("proInvestmentCurrency").value, accountId: document.getElementById("proInvestmentAccount").value, includeInNetWorth: document.getElementById("proInvestmentNetWorth").checked, color: document.getElementById("proInvestmentColor").value, notes: document.getElementById("proInvestmentNotes").value.trim(), dividends: existing?.dividends || [], profileId: state.accounts.find((account) => account.id === document.getElementById("proInvestmentAccount").value)?.profileId || existing?.profileId || activeFinancialUserId(), updatedAt: nowIso(), createdAt: existing?.createdAt || nowIso() };
      await commit(existing ? "Investasi diperbarui" : "Investasi ditambahkan", next.name, () => { if (existing) state.investments[state.investments.findIndex((row) => row.id === existing.id)] = next; else state.investments.push(next); });
      closeModal(); showToast("Investasi berhasil disimpan.", "📈");
    });
  }

  function openDividendForm() {
    if (!financialItems(state.investments).length) { showToast("Tambahkan investasi terlebih dahulu.", "❗"); return; }
    showModal("Catat Dividen/Kupon/Sewa", "Pendapatan pasif dari aset.", `<form id="proDividendForm"><div class="form-stack"><label class="field"><span>Aset</span><select class="input" id="proDividendInvestment">${financialItems(state.investments).map((item) => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join("")}</select></label><label class="field"><span>Nominal</span><input class="input" id="proDividendAmount" type="number" min="0.00000001" step="any" required /></label><label class="field"><span>Tanggal</span><input class="input" id="proDividendDate" type="date" value="${localISO()}" required /></label><label class="field"><span>Akun penerima</span><select class="input" id="proDividendAccount"><option value="">Tanpa transaksi akun</option>${accountOptions()}</select></label></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proDividendForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const investment = state.investments.find((item) => item.id === document.getElementById("proDividendInvestment").value);
      const amount = safeNumber(document.getElementById("proDividendAmount").value);
      const account = state.accounts.find((item) => item.id === document.getElementById("proDividendAccount").value);
      const date = document.getElementById("proDividendDate").value;
      await commit("Pendapatan investasi", investment.name, () => {
        investment.dividends ||= [];
        investment.dividends.push({ id: proId("dividend"), amount, date, accountId: account?.id || "" });
        if (account) {
          const rate = convertCurrency(1, account.currency, state.settings.baseCurrency) ?? 0;
          state.transactions.push({ id: proId("tx"), type: "income", description: `Pendapatan ${investment.name}`, merchant: investment.symbol || investment.name, date, accountId: account.id, destinationAccountId: null, amount, destinationAmount: null, fee: 0, currency: account.currency, category: "Investasi", splits: [], tags: ["investasi", "dividen"], notes: "Dibuat dari modul investasi.", status: "completed", deductible: false, reconciled: false, profileId: account.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate, baseAmount: amount * rate, attachmentIds: [], createdAt: nowIso() });
        }
      });
      closeModal(); showToast("Pendapatan investasi dicatat.", "💵");
    });
  }

  async function deleteInvestment(id) {
    const item = state.investments.find((row) => row.id === id);
    if (!item || !confirm(`Hapus "${item.name}"?`)) return;
    await commit("Investasi dihapus", item.name, () => { state.investments = state.investments.filter((row) => row.id !== id); });
  }

  function renderSharedWallets() {
    const grid = document.getElementById("proSharedWalletGrid");
    if (!grid || !state) return;
    grid.innerHTML = financialItems(state.sharedWallets).length ? financialItems(state.sharedWallets).map((wallet) => {
      const profile = state.profiles.find((item) => item.id === wallet.profileId);
      return `<article class="pro-card" style="--pro-card-color:${profile?.color || "#7558ff"}"><div class="pro-card-title"><div><span class="badge">${escapeHTML(profile?.type || "shared")}</span><h4 style="margin-top:10px">${escapeHTML(wallet.name)}</h4></div><span>👥</span></div><strong class="pro-card-value">${wallet.members.length} anggota</strong><p class="muted">${escapeHTML(profile?.name || "Tanpa profil")} · ${wallet.currency}</p><div class="pro-chip-row">${wallet.members.slice(0,5).map((member) => `<span class="pro-chip ${member.status === "active" ? "good" : "warn"}">${escapeHTML(member.name || member.email)} · ${escapeHTML(member.role)}</span>`).join("")}</div><div class="pro-metric-row" style="margin-top:12px"><span>Persetujuan transaksi</span><strong>${wallet.requireApproval ? `≥ ${formatCurrency(wallet.approvalThreshold, wallet.currency)}` : "Tidak aktif"}</strong></div><div class="pro-card-actions"><button class="button primary" data-pro-action="invite-wallet" data-pro-id="${wallet.id}" type="button">Undang</button><button class="button secondary" data-pro-action="edit-wallet" data-pro-id="${wallet.id}" type="button">Kelola</button>${wallet.id !== "wallet-family-default" ? `<button class="mini-button" data-pro-action="delete-wallet" data-pro-id="${wallet.id}" type="button">🗑️</button>` : ""}</div></article>`;
    }).join("") : `<div class="pro-empty" style="grid-column:1/-1"><div><strong>Belum ada shared wallet</strong>Buat dompet keluarga, pasangan, atau bisnis.</div></div>`;
    renderSharedApprovals();
  }


  function renderSharedApprovals() {
    const container = document.getElementById("proApprovalList");
    if (!container) return;
    const pending = financialItems(state.transactions).filter((tx) => tx.approvalRequired && tx.status === "pending");
    container.innerHTML = pending.length ? `<div class="simple-list">${pending.map((tx) => `<div class="simple-item"><span><strong>${escapeHTML(tx.description)}</strong>${formatDate(tx.date)} · ${formatCurrency(tx.amount, tx.currency)}</span><div class="table-actions"><button class="button success" data-pro-action="approve-transaction" data-pro-id="${tx.id}" type="button">Setujui</button><button class="button danger" data-pro-action="reject-transaction" data-pro-id="${tx.id}" type="button">Tolak</button></div></div>`).join("")}</div>` : `<div class="pro-success-box">Tidak ada transaksi yang menunggu persetujuan.</div>`;
  }

  function applySharedApproval(transaction) {
    if (!transaction || transaction.type !== "expense") return;
    const wallet = state.sharedWallets.find((item) => item.profileId && item.profileId === transaction.profileId && item.requireApproval);
    if (!wallet) return;
    const value = convertCurrency(transaction.amount, transaction.currency, wallet.currency) ?? transaction.amount;
    if (value >= safeNumber(wallet.approvalThreshold)) {
      transaction.status = "pending";
      transaction.approvalRequired = true;
      transaction.approvalWalletId = wallet.id;
      transaction.approvalHistory ||= [];
      transaction.approvalHistory.push({ action: "requested", by: state.settings.userName, at: nowIso() });
    }
  }

  async function approveSharedTransaction(id, approved) {
    const tx = state.transactions.find((item) => item.id === id);
    if (!tx) return;
    await commit(approved ? "Transaksi disetujui" : "Transaksi ditolak", tx.description, () => {
      tx.status = approved ? "completed" : "cancelled";
      tx.approvalRequired = false;
      tx.approvalHistory ||= [];
      tx.approvalHistory.push({ action: approved ? "approved" : "rejected", by: cloudSession?.user?.email || state.settings.userName, at: nowIso() });
    });
  }

  function openSharedWalletForm(existing = null) {
    const wallet = existing || { name: "", profileId: activeFinancialUserId() || state.profiles[0]?.id || "", currency: state.settings.baseCurrency, members: [], requireApproval: false, approvalThreshold: 0 };
    showModal(existing ? "Kelola Shared Wallet" : "Buat Shared Wallet", "Atur profil, mata uang, anggota, dan persetujuan.", `<form id="proSharedWalletForm"><div class="form-grid"><label class="field full"><span>Nama dompet</span><input class="input" id="proSharedName" value="${escapeHTML(wallet.name)}" required /></label><label class="field"><span>Profil</span><select class="input" id="proSharedProfile">${profileOptions(wallet.profileId)}</select></label><label class="field"><span>Mata uang</span><select class="input" id="proSharedCurrency">${currencyOptions(wallet.currency)}</select></label><label class="field full"><span><input id="proSharedApproval" type="checkbox" ${wallet.requireApproval ? "checked" : ""} /> Minta persetujuan untuk transaksi besar</span></label><label class="field full"><span>Ambang persetujuan</span><input class="input" id="proSharedThreshold" type="number" min="0" step="any" value="${wallet.approvalThreshold || 0}" /></label></div><h4 style="margin:18px 0 10px">Anggota</h4><div class="simple-list">${(wallet.members || []).map((member) => `<div class="simple-item"><span><strong>${escapeHTML(member.name || member.email)}</strong>${escapeHTML(member.email || "")} · ${escapeHTML(member.role)}</span><span class="badge">${escapeHTML(member.status)}</span></div>`).join("") || `<div class="muted">Belum ada anggota.</div>`}</div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proSharedWalletForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const next = { id: existing?.id || proId("wallet"), name: document.getElementById("proSharedName").value.trim(), profileId: document.getElementById("proSharedProfile").value, currency: document.getElementById("proSharedCurrency").value, requireApproval: document.getElementById("proSharedApproval").checked, approvalThreshold: safeNumber(document.getElementById("proSharedThreshold").value), members: existing?.members || [{ id: proId("member"), name: state.settings.userName, email: cloudSession?.user?.email || "", role: "owner", status: "active", joinedAt: nowIso() }], updatedAt: nowIso(), createdAt: existing?.createdAt || nowIso() };
      await commit(existing ? "Shared wallet diperbarui" : "Shared wallet dibuat", next.name, () => { if (existing) state.sharedWallets[state.sharedWallets.findIndex((row) => row.id === existing.id)] = next; else state.sharedWallets.push(next); });
      closeModal(); showToast("Shared wallet berhasil disimpan.", "👥");
    });
  }

  function openInviteMemberForm(wallet) {
    if (!wallet) return;
    showModal("Undang Anggota", wallet.name, `<form id="proInviteForm"><div class="form-stack"><label class="field"><span>Nama</span><input class="input" id="proInviteName" required /></label><label class="field"><span>Email</span><input class="input" id="proInviteEmail" type="email" required /></label><label class="field"><span>Peran</span><select class="input" id="proInviteRole"><option value="editor">Editor</option><option value="viewer">Hanya lihat</option><option value="approver">Penyetuju</option><option value="admin">Admin</option></select></label></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Kirim Undangan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proInviteForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const member = { id: proId("member"), name: document.getElementById("proInviteName").value.trim(), email: document.getElementById("proInviteEmail").value.trim().toLowerCase(), role: document.getElementById("proInviteRole").value, status: "invited", invitedAt: nowIso() };
      await commit("Anggota diundang", `${member.email} ke ${wallet.name}`, () => { wallet.members.push(member); });
      let cloudMessage = "Undangan tersimpan di brankas.";
      if (supabaseClient && cloudSession?.user) {
        const { error } = await supabaseClient.from(INVITE_TABLE).insert({ wallet_id: wallet.id, wallet_name: wallet.name, inviter_user_id: cloudSession.user.id, invited_email: member.email, role: member.role, status: "pending", metadata: { memberName: member.name } });
        if (!error) cloudMessage = "Undangan juga dikirim ke antrean cloud.";
        else if (!String(error.message).includes("does not exist")) recordProError(error, "shared-invite");
      }
      closeModal(); showToast(cloudMessage, "✉️");
    });
  }

  async function deleteSharedWallet(id) {
    const wallet = state.sharedWallets.find((item) => item.id === id);
    if (!wallet || !confirm(`Hapus shared wallet "${wallet.name}"?`)) return;
    await commit("Shared wallet dihapus", wallet.name, () => { state.sharedWallets = state.sharedWallets.filter((item) => item.id !== id); });
  }

  function renderProTransactions() {
    if (!state) return;
    const table = document.getElementById("transactionTable");
    if (table) {
      const headerRow = document.querySelector("#transactions thead tr");
      if (headerRow && !headerRow.querySelector("#proSelectAllTransactions")) {
        headerRow.insertAdjacentHTML("afterbegin", `<th class="pro-select-cell"><input id="proSelectAllTransactions" type="checkbox" aria-label="Pilih semua" /></th>`);
      }
      table.querySelectorAll("tr").forEach((row) => {
        const edit = row.querySelector("[data-edit-transaction]");
        if (!edit) return;
        const id = edit.dataset.editTransaction;
        if (!row.querySelector(".pro-tx-select")) row.insertAdjacentHTML("afterbegin", `<td class="pro-select-cell"><input class="pro-tx-select" type="checkbox" value="${id}" aria-label="Pilih transaksi" /></td>`);
        const actions = row.querySelector(".table-actions");
        if (actions && !actions.querySelector('[data-pro-action="duplicate-tx"]')) {
          actions.insertAdjacentHTML("afterbegin", `<button class="mini-button" data-pro-action="duplicate-tx" data-pro-id="${id}" type="button" title="Duplikat">⧉</button><button class="mini-button" data-pro-action="refund-tx" data-pro-id="${id}" type="button" title="Refund">↩</button>`);
        }
      });
    }

    const mobile = document.getElementById("proMobileTransactions");
    if (mobile) {
      const query = document.getElementById("transactionSearch")?.value.trim().toLowerCase() || "";
      const type = document.getElementById("transactionTypeFilter")?.value || "";
      const items = financialItems(state.transactions).filter((tx) => (!type || tx.type === type) && (!query || [tx.description, tx.merchant, tx.category, ...(tx.tags || [])].join(" ").toLowerCase().includes(query))).sort((a,b) => new Date(b.date) - new Date(a.date));
      mobile.innerHTML = items.map((tx) => `<article class="pro-mobile-transaction-card"><div class="card-top"><label style="display:flex;align-items:center;gap:9px"><input class="pro-tx-select" type="checkbox" value="${tx.id}" /><span><strong>${escapeHTML(tx.description)}</strong><small style="display:block;color:var(--muted);margin-top:3px">${formatDate(tx.date)} · ${escapeHTML(tx.category)}</small></span></label><strong class="money ${tx.type === "income" ? "positive" : tx.type === "expense" ? "negative" : ""}">${tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}${formatCurrency(tx.amount, tx.currency)}</strong></div><div class="pro-chip-row"><span class="pro-chip">${escapeHTML(tx.merchant || "Tanpa merchant")}</span>${tx.location ? `<span class="pro-chip">📍 ${escapeHTML(tx.location)}</span>` : ""}${tx.refundOf ? `<span class="pro-chip good">Refund</span>` : ""}</div><div class="pro-card-actions"><button class="button secondary" data-edit-transaction="${tx.id}" type="button">Edit</button><button class="mini-button" data-pro-action="duplicate-tx" data-pro-id="${tx.id}" type="button">⧉</button><button class="mini-button" data-pro-action="refund-tx" data-pro-id="${tx.id}" type="button">↩</button></div></article>`).join("") || `<div class="pro-empty"><div><strong>Tidak ada transaksi</strong>Gunakan tombol + untuk menambahkan.</div></div>`;
    }
    updateBulkSelectionCount();
  }

  function selectedTransactionIds() {
    return Array.from(document.querySelectorAll(".pro-tx-select:checked")).map((box) => box.value).filter((value, index, array) => array.indexOf(value) === index);
  }

  function updateBulkSelectionCount() {
    const element = document.getElementById("proSelectedCount");
    if (element) element.textContent = `${selectedTransactionIds().length} dipilih`;
  }

  async function applyBulkCategory() {
    const ids = selectedTransactionIds();
    const category = document.getElementById("proBulkCategory")?.value;
    if (!ids.length || !category) { showToast("Pilih transaksi dan kategori.", "❗"); return; }
    await commit("Kategori massal diperbarui", `${ids.length} transaksi`, () => {
      state.transactions.forEach((tx) => { if (ids.includes(tx.id) && tx.type !== "transfer") { tx.category = category; tx.splits = []; } });
    });
    showToast(`${ids.length} transaksi diperbarui.`, "✅");
  }

  async function deleteBulkTransactions() {
    const ids = selectedTransactionIds();
    if (!ids.length || !confirm(`Hapus ${ids.length} transaksi terpilih? Transfer antar akun akan dihapus dari kedua akun keuangan.`)) return;
    const linkedTransferIds = new Set(
      state.transactions
        .filter((tx) => ids.includes(tx.id) && tx.crossProfileTransferId)
        .map((tx) => tx.crossProfileTransferId)
    );
    await commit("Transaksi massal dihapus", `${ids.length} transaksi`, () => {
      state.transactions = state.transactions.filter(
        (tx) => !ids.includes(tx.id) && !linkedTransferIds.has(tx.crossProfileTransferId)
      );
    });
  }

  async function duplicateTransaction(id) {
    const original = state.transactions.find((tx) => tx.id === id);
    if (!original) return;
    if (original.crossProfileTransferId) {
      showToast("Transfer antar akun tidak dapat diduplikat sebagian. Buat transfer baru agar kedua buku tetap konsisten.", "⇄");
      return;
    }
    const copy = deepClone(original);
    copy.id = proId("tx");
    copy.description = `${original.description} (salinan)`;
    copy.date = localISO();
    copy.createdAt = nowIso();
    copy.updatedAt = nowIso();
    copy.attachmentIds = [];
    copy.refundOf = null;
    await commit("Transaksi diduplikat", original.description, () => state.transactions.push(copy));
    showToast("Transaksi berhasil diduplikat.", "⧉");
  }

  async function duplicateLatestTransaction() {
    const latest = [...financialItems(state.transactions)]
      .filter((tx) => !tx.crossProfileTransferId)
      .sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))[0];
    if (!latest) { showToast("Belum ada transaksi.", "❗"); return; }
    await duplicateTransaction(latest.id);
  }

  function openRefundForm(id) {
    const original = state.transactions.find((tx) => tx.id === id);
    if (!original || original.type === "transfer") { showToast("Transfer tidak dapat dibuat refund otomatis.", "❗"); return; }
    showModal("Buat Refund", original.description, `<form id="proRefundForm"><div class="form-stack"><label class="field"><span>Nominal refund</span><input class="input" id="proRefundAmount" type="number" min="0.00000001" max="${original.amount}" step="any" value="${original.amount}" required /></label><label class="field"><span>Tanggal</span><input class="input" id="proRefundDate" type="date" value="${localISO()}" required /></label><label class="field"><span>Catatan</span><input class="input" id="proRefundNotes" value="Refund untuk ${escapeHTML(original.description)}" /></label></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan Refund</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proRefundForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const refund = deepClone(original);
      refund.id = proId("tx");
      refund.type = original.type === "expense" ? "income" : "expense";
      refund.description = `Refund: ${original.description}`;
      refund.amount = safeNumber(document.getElementById("proRefundAmount").value);
      refund.date = document.getElementById("proRefundDate").value;
      refund.notes = document.getElementById("proRefundNotes").value.trim();
      refund.refundOf = original.id;
      refund.attachmentIds = [];
      refund.createdAt = nowIso();
      refund.updatedAt = nowIso();
      refund.baseAmount = refund.amount * safeNumber(refund.historicalRate);
      await commit("Refund ditambahkan", original.description, () => state.transactions.push(refund));
      closeModal(); showToast("Refund berhasil dicatat.", "↩");
    });
  }

  function enhanceTransactionForm(existing = null) {
    const form = document.getElementById("transactionForm");
    if (!form || form.dataset.proEnhanced) return;
    form.dataset.proEnhanced = "true";
    const grid = form.querySelector(".form-grid");
    const notesField = document.getElementById("txNotes")?.closest("label");
    notesField?.insertAdjacentHTML("beforebegin", `<label class="field"><span>Lokasi transaksi</span><input class="input" id="proTxLocation" value="${escapeHTML(existing?.location || "")}" placeholder="Surabaya, toko, atau alamat" /></label><label class="field"><span>Template</span><select class="input" id="proTxTemplate"><option value="">Tanpa template</option>${financialItems(state.transactionTemplates).map((item) => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join("")}</select></label>`);
    const attachment = document.getElementById("txAttachment");
    if (attachment) { attachment.multiple = true; attachment.setAttribute("accept", "image/*,.pdf"); }
    form.addEventListener("submit", () => {
      pendingTransactionExtras = {
        editingId: existing?.id || null,
        location: document.getElementById("proTxLocation")?.value.trim() || "",
        templateId: document.getElementById("proTxTemplate")?.value || null,
        extraFiles: attachment ? Array.from(attachment.files).slice(1) : []
      };
    }, true);
    document.getElementById("proTxTemplate")?.addEventListener("change", (event) => {
      const template = state.transactionTemplates.find((item) => item.id === event.target.value);
      if (!template) return;
      document.getElementById("txDescription").value = template.description || "";
      document.getElementById("txMerchant").value = template.merchant || "";
      document.getElementById("txAmount").value = template.amount || "";
      document.getElementById("txTags").value = (template.tags || []).join(", ");
    });
  }

  function openCreateTemplateForm() {
    const ids = selectedTransactionIds();
    const source = ids.length === 1 ? state.transactions.find((tx) => tx.id === ids[0]) : null;
    showModal("Simpan Template Transaksi", "Buat transaksi favorit untuk input satu klik.", `<form id="proTemplateForm"><div class="form-stack"><label class="field"><span>Nama template</span><input class="input" id="proTemplateName" value="${escapeHTML(source?.description || "")}" required /></label><label class="field"><span>Deskripsi</span><input class="input" id="proTemplateDescription" value="${escapeHTML(source?.description || "")}" required /></label><label class="field"><span>Merchant</span><input class="input" id="proTemplateMerchant" value="${escapeHTML(source?.merchant || "")}" /></label><label class="field"><span>Jenis</span><select class="input" id="proTemplateType"><option value="expense" ${source?.type === "expense" ? "selected" : ""}>Pengeluaran</option><option value="income" ${source?.type === "income" ? "selected" : ""}>Pemasukan</option></select></label><label class="field"><span>Nominal default</span><input class="input" id="proTemplateAmount" type="number" min="0" step="any" value="${source?.amount || ""}" /></label><label class="field"><span>Kategori</span><select class="input" id="proTemplateCategory">${categoryOptions(source?.type === "income" ? "income" : "expense", source?.category)}</select></label><label class="field"><span>Tags</span><input class="input" id="proTemplateTags" value="${escapeHTML((source?.tags || []).join(", "))}" /></label></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Simpan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proTemplateType").addEventListener("change", (event) => { document.getElementById("proTemplateCategory").innerHTML = categoryOptions(event.target.value); });
    document.getElementById("proTemplateForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const template = { id: proId("template"), name: document.getElementById("proTemplateName").value.trim(), description: document.getElementById("proTemplateDescription").value.trim(), merchant: document.getElementById("proTemplateMerchant").value.trim(), type: document.getElementById("proTemplateType").value, amount: safeNumber(document.getElementById("proTemplateAmount").value), category: document.getElementById("proTemplateCategory").value, tags: document.getElementById("proTemplateTags").value.split(",").map((tag) => tag.trim()).filter(Boolean), profileId: activeFinancialUserId(), createdAt: nowIso() };
      await commit("Template transaksi dibuat", template.name, () => state.transactionTemplates.push(template));
      closeModal(); showToast("Template berhasil dibuat.", "⚡");
    });
  }

  function openTemplatePicker() {
    showModal("Template Cepat", "Pilih template untuk membuat transaksi baru.", financialItems(state.transactionTemplates).length ? `<div class="simple-list">${financialItems(state.transactionTemplates).map((item) => `<div class="simple-item"><span><strong>${escapeHTML(item.name)}</strong>${escapeHTML(item.category)} · ${formatCurrency(item.amount || 0)}</span><div class="table-actions"><button class="button primary" data-pro-action="use-template" data-pro-id="${item.id}" type="button">Gunakan</button><button class="mini-button" data-pro-action="delete-template" data-pro-id="${item.id}" type="button">🗑️</button></div></div>`).join("")}</div>` : `<div class="pro-empty"><div><strong>Belum ada template</strong>Buat dari transaksi yang dipilih.</div></div>`);
  }

  function useTransactionTemplate(id) {
    const template = state.transactionTemplates.find((item) => item.id === id);
    if (!template) return;
    closeModal();
    openTransactionForm(null, { type: template.type, description: template.description, merchant: template.merchant, amount: template.amount, category: template.category });
    window.setTimeout(() => { const tags = document.getElementById("txTags"); if (tags) tags.value = (template.tags || []).join(", "); }, 50);
  }

  async function deleteTransactionTemplate(id) {
    const template = state.transactionTemplates.find((item) => item.id === id);
    if (!template) return;
    await commit("Template transaksi dihapus", template.name, () => { state.transactionTemplates = state.transactionTemplates.filter((item) => item.id !== id); });
    closeModal();
  }


  function renderDashboardDragAndDrop() {
    const enabled = state.settings.dashboardWidgets.filter((item) => item.enabled);
    const widgets = Array.from(document.querySelectorAll("#dashboardWidgets > .widget"));
    widgets.forEach((element, index) => {
      const widget = enabled[index];
      if (!widget) return;
      element.draggable = true;
      element.dataset.proWidgetId = widget.id;
      element.title = "Seret untuk mengubah urutan widget";
    });
  }

  let draggedWidgetId = null;
  document.addEventListener("dragstart", (event) => {
    const widget = event.target.closest("[data-pro-widget-id]");
    if (!widget) return;
    draggedWidgetId = widget.dataset.proWidgetId;
    event.dataTransfer.effectAllowed = "move";
  });
  document.addEventListener("dragover", (event) => {
    if (event.target.closest("[data-pro-widget-id]")) event.preventDefault();
  });
  document.addEventListener("drop", async (event) => {
    const target = event.target.closest("[data-pro-widget-id]");
    if (!target || !draggedWidgetId || target.dataset.proWidgetId === draggedWidgetId) return;
    event.preventDefault();
    const widgets = state.settings.dashboardWidgets;
    const from = widgets.findIndex((item) => item.id === draggedWidgetId);
    const to = widgets.findIndex((item) => item.id === target.dataset.proWidgetId);
    if (from < 0 || to < 0) return;
    const [moved] = widgets.splice(from, 1);
    widgets.splice(to, 0, moved);
    draggedWidgetId = null;
    await encryptState();
    renderAll();
  });

  function renderSmartBudgets() {
    const activeBudgets = financialItems(state.budgets);
    document.querySelectorAll("#budgetGrid .budget-card").forEach((card, index) => {
      const budget = activeBudgets[index];
      if (!budget || card.querySelector(".pro-budget-forecast")) return;
      const spent = budgetSpent(budget);
      const start = budgetPeriodStart(budget.period);
      const elapsedDays = Math.max(1, Math.ceil((Date.now() - start.getTime()) / 86400000));
      const totalDays = budget.period === "weekly" ? 7 : budget.period === "yearly" ? 365 : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const projected = spent / elapsedDays * totalDays;
      const limit = safeNumber(budget.limit) + (budget.rollover ? safeNumber(budget.rolloverAmount) : 0);
      const exhaustedDay = spent > 0 ? Math.ceil(limit / (spent / elapsedDays)) : Infinity;
      card.insertAdjacentHTML("beforeend", `<div class="pro-budget-forecast" style="margin-top:14px"><div class="pro-metric-row"><span>Proyeksi akhir periode</span><strong class="${projected > limit ? "negative" : "positive"}">${formatCurrency(projected, budget.currency)}</strong></div><div class="pro-metric-row"><span>Perkiraan habis</span><strong>${Number.isFinite(exhaustedDay) && exhaustedDay < totalDays ? `Hari ke-${exhaustedDay}` : "Aman sampai akhir"}</strong></div></div>`);
    });
  }

  async function suggestBudgets() {
    const months = [-1, -2, -3];
    const totals = {};
    months.forEach((offset) => categoryTotals(offset).forEach((item) => { totals[item.category] = (totals[item.category] || 0) + item.amount / 3; }));
    const suggestions = Object.entries(totals).filter(([, amount]) => amount > 0).sort((a,b) => b[1] - a[1]).slice(0, 8);
    if (!suggestions.length) { showToast("Belum cukup data untuk membuat saran.", "❗"); return; }
    showModal("Saran Budget Otomatis", "Berdasarkan rata-rata tiga bulan, ditambah buffer 10%.", `<form id="proBudgetSuggestionForm"><div class="simple-list">${suggestions.map(([category, amount]) => `<label class="simple-item"><span><input class="pro-budget-suggestion" type="checkbox" value="${escapeHTML(category)}" checked /> ${CATEGORIES[category]?.icon || "✨"} <strong>${escapeHTML(category)}</strong></span><strong class="money">${formatCurrency(amount * 1.1)}</strong></label>`).join("")}</div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Buat Budget</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proBudgetSuggestionForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const selected = Array.from(document.querySelectorAll(".pro-budget-suggestion:checked")).map((box) => box.value);
      await commit("Budget pintar dibuat", `${selected.length} kategori`, () => {
        selected.forEach((category) => {
          const amount = (totals[category] || 0) * 1.1;
          const existing = financialItems(state.budgets).find((budget) => budget.category === category && budget.period === "monthly");
          if (existing) existing.limit = Math.round(amount); else state.budgets.push({ id: proId("budget"), name: category, category, limit: Math.round(amount), currency: state.settings.baseCurrency, period: "monthly", rollover: true, rolloverAmount: 0, accountId: "", tag: "", profileId: activeFinancialUserId() || state.profiles[0]?.id || "", alertLevels: [50,75,90,100], color: CATEGORIES[category]?.color || "#7558ff" });
        });
      });
      closeModal(); showToast("Saran budget diterapkan.", "✨");
    });
  }

  function pushSyncLog(message, tone = "online") {
    if (!state) return;
    state.cloudSyncLog ||= [];
    state.cloudSyncLog.unshift({ id: proId("sync"), message, tone, timestamp: nowIso(), deviceId: currentDeviceId() });
    state.cloudSyncLog = state.cloudSyncLog.slice(0, 80);
  }

  function queueSync(reason = "Perubahan menunggu internet") {
    localStorage.setItem(QUEUE_KEY, JSON.stringify({ pending: true, reason, queuedAt: nowIso() }));
    pushSyncLog(reason, "offline");
    renderProCloud();
  }

  function clearSyncQueue() {
    localStorage.removeItem(QUEUE_KEY);
    renderProCloud();
  }

  function loadSyncQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "null"); } catch { return null; }
  }

  async function retryQueuedSync() {
    if (!loadSyncQueue() || !cloudSession?.user || !state) return;
    clearTimeout(proOnlineRetryTimer);
    proOnlineRetryTimer = window.setTimeout(async () => {
      try {
        pushSyncLog("Internet kembali. Mencoba sinkronisasi antrean...", "syncing");
        await checkRemoteVersion(false);
        await cloudPush({ silent: true });
        clearSyncQueue();
        showToast("Antrean offline berhasil disinkronkan.", "☁️");
      } catch (error) {
        queueSync(`Retry gagal: ${error.message}`);
      }
    }, 1000);
  }

  async function forceProSync() {
    if (!navigator.onLine) { queueSync("Sinkronisasi manual menunggu internet."); showToast("Perangkat sedang offline.", "⚠️"); return; }
    await cloudPush({ force: false, silent: false });
    if (state.settings.syncAttachments) await syncAttachmentsToCloud(true);
    clearSyncQueue();
  }

  async function checkRemoteVersion(showResult = false) {
    if (!cloudSession?.user || !supabaseClient || !vault) {
      if (showResult) showToast("Masuk ke cloud terlebih dahulu.", "❗");
      return null;
    }
    if (!navigator.onLine) return null;
    lastRemoteCheck = Date.now();
    const remote = await fetchRemoteVault();
    const localVersion = safeNumber(vault.cloud?.version);
    const remoteVersion = safeNumber(remote?.version);
    const localUpdatedAt = new Date(vault.cloud?.updatedAt || 0).getTime();
    const remoteUpdatedAt = new Date(remote?.updated_at || 0).getTime();
    const sameVersionReplacement = Boolean(
      remote &&
      remoteVersion === localVersion &&
      remote.device_id !== currentDeviceId() &&
      remote.checksum &&
      remote.checksum !== vault.cloud?.checksum &&
      remoteUpdatedAt >= localUpdatedAt
    );
    if (remote && (remoteVersion > localVersion || sameVersionReplacement)) {
      await adoptNewestCloudVault(remote, {
        notify: showResult,
        reason: `Pemeriksaan otomatis menemukan cloud v${remoteVersion}`
      });
      cloudConflict = null;
      setCloudMessage(`Cloud terbaru v${remoteVersion} dipakai otomatis.`, "online");
      pushSyncLog(`Cloud v${remoteVersion} diterapkan otomatis dari perangkat lain.`, "online");
      renderProCloud();
      if (showResult) showToast("Cloud terbaru sudah diterapkan otomatis.", "☁️");
    } else if (showResult) {
      showToast(`Cloud aman. Lokal v${localVersion}, cloud v${remoteVersion}.`, "☁️");
    }
    return remote;
  }

  function renderProCloud() {
    if (!state) return;
    const queue = loadSyncQueue();
    const queueElement = document.getElementById("proQueueStatus");
    if (queueElement) {
      queueElement.textContent = queue ? `Menunggu sejak ${formatDateTime(queue.queuedAt)}` : "Kosong";
      queueElement.className = queue ? "negative" : "positive";
    }
    const versionElement = document.getElementById("proVersionStatus");
    if (versionElement) versionElement.textContent = `Aktif v${safeNumber(vault?.cloud?.version)} · always-latest`;

    const conflict = document.getElementById("proConflictCenter");
    if (conflict) conflict.innerHTML = `<div class="pro-success-box" style="margin-top:12px"><strong>☁️ Always-Latest aktif</strong><p class="muted" style="margin-top:6px">Perangkat ini otomatis memakai versi cloud terbaru. Salinan lokal lama dicadangkan terenkripsi sebelum diganti.</p></div>`;

    const log = document.getElementById("proSyncLog");
    if (log) log.innerHTML = state.cloudSyncLog.length ? state.cloudSyncLog.slice(0, 25).map((item) => `<div class="pro-sync-item"><span><strong>${escapeHTML(item.message)}</strong><small>${formatDateTime(item.timestamp)}</small></span><span class="pro-chip ${item.tone === "error" || item.tone === "conflict" ? "bad" : item.tone === "syncing" ? "warn" : "good"}">${escapeHTML(item.tone)}</span></div>`).join("") : `<div class="muted">Belum ada riwayat sinkronisasi.</div>`;
    startRealtimeSync();
  }

  function startRealtimeSync() {
    if (!supabaseClient || !cloudSession?.user || proRealtimeChannel) return;
    try {
      proRealtimeChannel = supabaseClient.channel(`charisna-vault-${cloudSession.user.id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: CLOUD_TABLE, filter: `user_id=eq.${cloudSession.user.id}` }, async (payload) => {
          try {
            const remoteVersion = safeNumber(payload.new?.version);
            const localVersion = safeNumber(vault?.cloud?.version);
            const localUpdatedAt = new Date(vault?.cloud?.updatedAt || 0).getTime();
            const remoteUpdatedAt = new Date(payload.new?.updated_at || 0).getTime();
            const sameVersionReplacement = Boolean(
              remoteVersion === localVersion &&
              payload.new?.checksum &&
              payload.new.checksum !== vault?.cloud?.checksum &&
              remoteUpdatedAt >= localUpdatedAt
            );
            if (
              payload.new?.device_id !== currentDeviceId() &&
              (remoteVersion > localVersion || sameVersionReplacement)
            ) {
              const remote = payload.new?.encrypted_vault
                ? payload.new
                : await fetchRemoteVault();
              await adoptNewestCloudVault(remote, {
                notify: true,
                reason: `Realtime perangkat lain · cloud v${remoteVersion}`
              });
              cloudConflict = null;
              pushSyncLog(`Realtime menerapkan cloud v${remoteVersion} otomatis.`, "online");
              renderProCloud();
            }
          } catch (error) {
            recordProError(error, "realtime-apply-latest");
          }
        }).subscribe();
    } catch (error) {
      recordProError(error, "realtime-subscribe");
    }
  }

  function stopRealtimeSync() {
    if (proRealtimeChannel && supabaseClient) supabaseClient.removeChannel(proRealtimeChannel).catch(() => {});
    proRealtimeChannel = null;
  }

  function startProPolling() {
    clearInterval(proPollTimer);
    const minutes = Math.max(1, safeNumber(state?.settings?.cloudPollMinutes || 1));
    proPollTimer = window.setInterval(() => {
      if (state && cloudSession?.user && navigator.onLine && Date.now() - lastRemoteCheck > minutes * 60000 - 5000) {
        checkRemoteVersion(false).catch((error) => recordProError(error, "cloud-poll"));
      }
      processDueNotifications().catch(console.error);
    }, 30000);
  }

  function getSnapshots() {
    try { return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "[]"); } catch { return []; }
  }

  function saveSnapshots(items) {
    try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(items.slice(0, 8))); } catch (error) { recordProError(error, "snapshot-save"); }
  }

  function createVaultSnapshot(label = "Snapshot otomatis", force = false) {
    if (!vault || (!force && Date.now() - lastSnapshotAt < 120000)) return;
    lastSnapshotAt = Date.now();
    const items = getSnapshots();
    items.unshift({ label, createdAt: nowIso(), version: safeNumber(vault.cloud?.version), vault: deepClone(vault) });
    saveSnapshots(items);
    renderLocalSnapshots();
  }

  function renderLocalSnapshots() {
    const container = document.getElementById("proLocalBackupList");
    if (!container) return;
    const items = getSnapshots();
    container.innerHTML = items.length ? items.map((item, index) => `<div class="pro-version-item"><span><strong>${escapeHTML(item.label)}</strong><small>${formatDateTime(item.createdAt)} · v${safeNumber(item.version)}</small></span><button class="mini-button" data-pro-action="restore-snapshot" data-pro-index="${index}" type="button">↶</button></div>`).join("") : `<div class="muted">Belum ada snapshot otomatis.</div>`;
  }

  function restoreSnapshot(index) {
    const snapshot = getSnapshots()[index];
    if (!snapshot?.vault || !confirm(`Pulihkan snapshot ${formatDateTime(snapshot.createdAt)}? Data saat ini akan disimpan sebagai snapshot baru.`)) return;
    createVaultSnapshot("Sebelum restore snapshot", true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.vault));
    location.reload();
  }

  async function uploadCloudVersionSnapshot() {
    if (!supabaseClient || !cloudSession?.user || !vault || !navigator.onLine) return;
    const payload = cloudVaultPayload();
    const row = { user_id: cloudSession.user.id, version: safeNumber(vault.cloud?.version), encrypted_vault: payload, checksum: vault.cloud?.checksum || null, device_id: currentDeviceId() };
    const { error } = await supabaseClient.from(VERSION_TABLE).insert(row);
    if (error && !String(error.message).includes("does not exist") && !String(error.message).includes("schema cache")) recordProError(error, "version-snapshot-cloud");
  }



  function mergeCollection(localItems = [], remoteItems = []) {
    const map = new Map();
    [...remoteItems, ...localItems].forEach((item) => {
      const key = item.id || JSON.stringify(item);
      const current = map.get(key);
      if (!current) { map.set(key, deepClone(item)); return; }
      const currentTime = new Date(current.updatedAt || current.createdAt || current.date || 0).getTime();
      const itemTime = new Date(item.updatedAt || item.createdAt || item.date || 0).getTime();
      if (itemTime >= currentTime) map.set(key, deepClone(item));
    });
    return [...map.values()];
  }

  async function mergeCloudConflict() {
    if (!cloudConflict?.encrypted_vault) throw new Error("Tidak ada konflik cloud untuk digabungkan.");
    const remoteVault = cloudConflict.encrypted_vault;
    let remoteState;
    try {
      const bytes = await decryptBytes(remoteVault.payload, currentKey);
      remoteState = JSON.parse(decoder.decode(bytes));
    } catch {
      throw new Error("Brankas cloud memakai kunci berbeda dan tidak dapat digabung otomatis.");
    }
    const collections = ["accounts","transactions","budgets","goals","recurring","profiles","rules","reconciliations","debts","investments","sharedWallets","transactionTemplates"];
    await commit("Konflik cloud digabungkan", `Cloud v${safeNumber(cloudConflict.version)}`, () => {
      collections.forEach((name) => { state[name] = mergeCollection(state[name] || [], remoteState[name] || []); });
      state.auditLog = mergeCollection(state.auditLog || [], remoteState.auditLog || []).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0,200);
      state.settings = { ...remoteState.settings, ...state.settings };
      state.security = { ...remoteState.security, ...state.security, devices: mergeCollection(state.security?.devices || [], remoteState.security?.devices || []) };
      cloudConflict = null;
    });
    await cloudPush({ force: true, silent: false });
    showToast("Data lokal dan cloud berhasil digabungkan.", "🔀");
  }

  async function loadCloudVersions() {
    const container = document.getElementById("proCloudVersionList");
    if (!container) return;
    if (!supabaseClient || !cloudSession?.user) {
      container.innerHTML = `<div class="muted">Masuk ke akun cloud terlebih dahulu.</div>`;
      return;
    }
    container.innerHTML = `<div class="muted">Memuat versi cloud...</div>`;
    const { data, error } = await supabaseClient.from(VERSION_TABLE).select("version, device_id, checksum, created_at").eq("user_id", cloudSession.user.id).order("version", { ascending: false }).limit(20);
    if (error) {
      container.innerHTML = `<div class="pro-warning-box">Riwayat versi belum aktif. Jalankan SUPABASE-SETUP-V6.sql.</div>`;
      return;
    }
    container.innerHTML = data?.length ? data.map((item) => `<div class="pro-version-item"><span><strong>Versi ${safeNumber(item.version)}</strong><small>${formatDateTime(item.created_at)} · ${escapeHTML(item.device_id || "perangkat")}</small></span><button class="mini-button" data-pro-action="restore-cloud-version" data-pro-version="${safeNumber(item.version)}" type="button">↶</button></div>`).join("") : `<div class="muted">Belum ada versi cloud.</div>`;
  }

  async function restoreCloudVersion(version) {
    if (!supabaseClient || !cloudSession?.user) throw new Error("Masuk ke cloud terlebih dahulu.");
    if (!confirm(`Pulihkan versi cloud ${version}? Data lokal sekarang akan disimpan sebagai snapshot.`)) return;
    createVaultSnapshot("Sebelum restore versi cloud", true);
    const { data, error } = await supabaseClient.from(VERSION_TABLE).select("encrypted_vault, version, device_id, checksum, created_at").eq("user_id", cloudSession.user.id).eq("version", version).single();
    if (error) throw error;
    const restored = deepClone(data.encrypted_vault);
    restored.cloud = { userId: cloudSession.user.id, version: safeNumber(data.version), updatedAt: data.created_at, deviceId: data.device_id, checksum: data.checksum };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    location.reload();
  }

  function openAttachmentDatabaseRecords() {
    return openAttachmentDatabase().then((database) => new Promise((resolve, reject) => {
      const tx = database.transaction("attachments", "readonly");
      const request = tx.objectStore("attachments").getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }


  async function clearAttachmentDatabase() {
    const database = await openAttachmentDatabase();
    await new Promise((resolve, reject) => {
      const tx = database.transaction("attachments", "readwrite");
      tx.objectStore("attachments").clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function putAttachmentRecord(record) {
    const database = await openAttachmentDatabase();
    await new Promise((resolve, reject) => {
      const tx = database.transaction("attachments", "readwrite");
      tx.objectStore("attachments").put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function syncAttachmentsToCloud(silent = false) {
    if (!supabaseClient || !cloudSession?.user) throw new Error("Masuk ke cloud terlebih dahulu.");
    if (!navigator.onLine) { queueSync("Lampiran menunggu internet."); return; }
    const status = document.getElementById("proAttachmentStatus");
    const records = await openAttachmentDatabaseRecords();
    if (status) status.textContent = `Mengunggah ${records.length} lampiran...`;
    let uploaded = 0;
    for (const record of records) {
      const path = `${cloudSession.user.id}/${record.id}.json`;
      const blob = new Blob([JSON.stringify(record)], { type: "application/json" });
      const { error } = await supabaseClient.storage.from(ATTACHMENT_BUCKET).upload(path, blob, { contentType: "application/json", upsert: true });
      if (error) {
        if (String(error.message).includes("Bucket not found")) throw new Error("Bucket lampiran belum dibuat. Jalankan SUPABASE-SETUP-V6.sql.");
        throw error;
      }
      uploaded += 1;
      if (status) status.textContent = `Mengunggah ${uploaded}/${records.length} lampiran...`;
    }
    if (status) status.textContent = `${uploaded} lampiran terenkripsi tersinkron.`;
    pushSyncLog(`${uploaded} lampiran diunggah.`, "online");
    if (!silent) showToast(`${uploaded} lampiran tersinkron.`, "📎");
  }

  async function syncAttachmentsFromCloud(silent = false) {
    if (!supabaseClient || !cloudSession?.user) throw new Error("Masuk ke cloud terlebih dahulu.");
    const status = document.getElementById("proAttachmentStatus");
    const { data: files, error } = await supabaseClient.storage.from(ATTACHMENT_BUCKET).list(cloudSession.user.id, { limit: 1000 });
    if (error) {
      if (String(error.message).includes("Bucket not found")) throw new Error("Bucket lampiran belum dibuat. Jalankan SUPABASE-SETUP-V6.sql.");
      throw error;
    }
    let downloaded = 0;
    for (const file of files || []) {
      if (!file.name.endsWith(".json")) continue;
      const { data, error: downloadError } = await supabaseClient.storage.from(ATTACHMENT_BUCKET).download(`${cloudSession.user.id}/${file.name}`);
      if (downloadError) throw downloadError;
      const record = JSON.parse(await data.text());
      await putAttachmentRecord(record);
      downloaded += 1;
      if (status) status.textContent = `Mengunduh ${downloaded}/${files.length} lampiran...`;
    }
    if (status) status.textContent = `${downloaded} lampiran tersedia di perangkat ini.`;
    pushSyncLog(`${downloaded} lampiran diunduh.`, "online");
    if (!silent) showToast(`${downloaded} lampiran diunduh.`, "📎");
  }

  async function exportFullBackup() {
    if (typeof JSZip === "undefined") throw new Error("Library ZIP belum tersedia.");
    await encryptState();
    const zip = new JSZip();
    zip.file("vault.json", JSON.stringify({ application: "CHARISNA Money Management", version: PRO_VERSION, exportedAt: nowIso(), vault }, null, 2));
    const records = await openAttachmentDatabaseRecords();
    const folder = zip.folder("attachments");
    records.forEach((record) => folder.file(`${record.id}.json`, JSON.stringify(record)));
    zip.file("README.txt", "Backup ini terenkripsi. Simpan bersama sandi brankas atau recovery key. Jangan mengubah isi file.");
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    downloadBlob(blob, `charisna-full-backup-${localISO()}.zip`);
    createVaultSnapshot("Full backup dibuat", true);
    showToast(`Full backup dibuat dengan ${records.length} lampiran.`, "🗄️");
  }

  async function restoreFullBackup(file) {
    if (typeof JSZip === "undefined") throw new Error("Library ZIP belum tersedia.");
    const zip = await JSZip.loadAsync(file);
    const vaultFile = zip.file("vault.json");
    if (!vaultFile) throw new Error("vault.json tidak ditemukan dalam ZIP.");
    const parsed = JSON.parse(await vaultFile.async("text"));
    const incomingVault = parsed.vault || parsed;
    if (!incomingVault?.payload || !incomingVault?.salt) throw new Error("Backup tidak valid.");
    if (!confirm("Restore penuh akan mengganti data lokal dan lampiran. Lanjutkan?")) return;
    createVaultSnapshot("Sebelum full restore", true);
    const attachmentFiles = Object.values(zip.files).filter((entry) => entry.name.startsWith("attachments/") && entry.name.endsWith(".json"));
    await clearAttachmentDatabase();
    for (const entry of attachmentFiles) {
      const record = JSON.parse(await entry.async("text"));
      await putAttachmentRecord(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incomingVault));
    location.reload();
  }

  async function showPartialRestore(file) {
    const parsed = JSON.parse(await file.text());
    const incomingVault = parsed.vault || parsed;
    if (!incomingVault?.payload) throw new Error("Backup tidak valid.");
    let incomingState;
    try {
      const bytes = await decryptBytes(incomingVault.payload, currentKey);
      incomingState = JSON.parse(decoder.decode(bytes));
    } catch {
      throw new Error("Backup memakai sandi brankas yang berbeda. Gunakan Full Restore atau buka dengan sandi lama.");
    }
    const parts = ["accounts","transactions","budgets","goals","recurring","debts","investments","sharedWallets","transactionTemplates"];
    showModal("Restore Sebagian", "Pilih kelompok data yang ingin diganti dari backup.", `<form id="proPartialRestoreForm"><div class="simple-list">${parts.map((part) => `<label class="simple-item"><span><input class="pro-partial-option" type="checkbox" value="${part}" /> ${escapeHTML(part)}</span><strong>${Array.isArray(incomingState[part]) ? incomingState[part].length : 0} item</strong></label>`).join("")}</div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Pulihkan</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proPartialRestoreForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const selected = Array.from(document.querySelectorAll(".pro-partial-option:checked")).map((box) => box.value);
      if (!selected.length) { showToast("Pilih minimal satu kelompok data.", "❗"); return; }
      await commit("Restore sebagian", selected.join(", "), () => selected.forEach((part) => { state[part] = deepClone(incomingState[part] || []); }));
      closeModal(); showToast("Data terpilih berhasil dipulihkan.", "↶");
    });
  }

  let lastRecoveryKey = sessionStorage.getItem(`${PRO_PREFIX}-recovery-key`) || "";

  async function generateRecoveryKey(download = false) {
    if (!currentKeyBytes) throw new Error("Brankas harus dibuka terlebih dahulu.");
    const body = bytesToBase64(currentKeyBytes);
    const checksumBytes = await crypto.subtle.digest("SHA-256", currentKeyBytes);
    const checksum = bytesToBase64(new Uint8Array(checksumBytes)).replace(/[^A-Za-z0-9]/g, "").slice(0, 10);
    lastRecoveryKey = `CMM-RK1-${body}.${checksum}`;
    sessionStorage.setItem(`${PRO_PREFIX}-recovery-key`, lastRecoveryKey);
    state.security.recoveryKeyCreatedAt = nowIso();
    state.securityEvents.unshift({ id: proId("security"), action: "Recovery key dibuat", timestamp: nowIso(), deviceId: currentDeviceId() });
    await encryptState();
    if (download) {
      downloadBlob(new Blob([`CHARISNA MONEY MANAGEMENT RECOVERY KEY\n\n${lastRecoveryKey}\n\nDibuat: ${nowIso()}\n\nSimpan offline. Jangan bagikan kepada siapa pun.`], { type: "text/plain" }), `charisna-recovery-key-${localISO()}.txt`);
      showToast("Recovery key dibuat dan diunduh.", "🛟");
    }
    renderProSettings();
    return lastRecoveryKey;
  }

  async function copyRecoveryKey() {
    const key = lastRecoveryKey || await generateRecoveryKey(false);
    await navigator.clipboard.writeText(key);
    showToast("Recovery key disalin.", "📋");
  }

  function parseRecoveryKey(value) {
    const match = String(value).trim().match(/^CMM-RK1-(.+)\.([A-Za-z0-9]{10})$/);
    if (!match) throw new Error("Format recovery key tidak valid.");
    return base64ToBytes(match[1]);
  }

  function openRecoveryUnlockForm() {
    showModal("Buka dengan Recovery Key", "Gunakan key yang pernah diunduh saat brankas masih dapat dibuka.", `<form id="proRecoveryUnlockForm"><div class="form-stack"><label class="field"><span>Recovery key</span><textarea id="proRecoveryInput" placeholder="CMM-RK1-..." required></textarea></label><div class="pro-warning-box">Jangan memasukkan recovery key pada perangkat umum atau milik orang lain.</div></div><div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">Buka Brankas</button></div></form>`);
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);
    document.getElementById("proRecoveryUnlockForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const bytes = parseRecoveryKey(document.getElementById("proRecoveryInput").value);
      try {
        const key = await importAesKey(bytes);
        const decrypted = await decryptState(key);
        currentKeyBytes = bytes;
        currentKey = key;
        state = decrypted;
        sessionStorage.setItem(SESSION_KEY, bytesToBase64(bytes));
        clearLoginGuard();
        closeModal();
        unlockApplication();
        showToast("Brankas dibuka dengan recovery key.", "🛟");
      } catch {
        showToast("Recovery key tidak cocok dengan brankas ini.", "❗");
      }
    });
  }

  function loadLoginGuard() {
    try { return { attempts: 0, lockUntil: 0, ...JSON.parse(localStorage.getItem(LOGIN_GUARD_KEY) || "{}") }; } catch { return { attempts: 0, lockUntil: 0 }; }
  }

  function registerFailedLogin() {
    const guard = loadLoginGuard();
    guard.attempts += 1;
    if (guard.attempts >= 5) {
      const multiplier = Math.min(6, guard.attempts - 4);
      guard.lockUntil = Date.now() + multiplier * 60000;
    }
    localStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(guard));
  }

  function clearLoginGuard() {
    localStorage.removeItem(LOGIN_GUARD_KEY);
  }

  function renderLoginGuard() {
    const element = document.getElementById("proLoginGuardStatus");
    if (!element) return;
    const guard = loadLoginGuard();
    if (guard.lockUntil > Date.now()) element.textContent = `Terkunci sementara sampai ${new Date(guard.lockUntil).toLocaleTimeString("id-ID")}.`;
    else if (guard.attempts) element.textContent = `${guard.attempts}/5 percobaan gagal.`;
    else element.textContent = "Perlindungan brute-force aktif.";
  }

  async function sendCloudPasswordResetFromLogin() {
    const email = document.getElementById("cloudEmail")?.value.trim();
    if (!email) { showToast("Isi email cloud terlebih dahulu.", "❗"); return; }
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
    if (error) throw error;
    showToast("Email reset sandi telah dikirim.", "✉️");
  }

  async function sendCloudPasswordReset() {
    const email = cloudSession?.user?.email;
    if (!email) throw new Error("Akun cloud belum masuk.");
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
    if (error) throw error;
    showToast("Email reset sandi telah dikirim.", "✉️");
  }

  async function changeCloudPassword() {
    const form = document.getElementById("proCloudPasswordForm");
    const status = document.getElementById("proCloudPasswordStatus");
    const button = document.getElementById("proChangeCloudPassword");
    const password = document.getElementById("proCloudNewPassword").value;
    const confirmation = document.getElementById("proCloudConfirmPassword").value;
    status.textContent = "";
    if (!cloudSession?.user) { status.textContent = "Masuk ke akun cloud terlebih dahulu."; return; }
    if (password.length < 8) { status.textContent = "Password baru minimal 8 karakter."; return; }
    if (password !== confirmation) { status.textContent = "Dua password baru belum sama."; return; }
    button.disabled = true;
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        status.textContent = error.code === "reauthentication_needed"
          ? "Supabase meminta verifikasi email. Gunakan Kirim Reset Sandi."
          : error.code === "weak_password"
            ? "Password ditolak. Pilih password yang lebih kuat."
            : "Password cloud belum berubah. Coba lagi.";
        return;
      }
      status.textContent = "Password cloud berhasil diubah. Gunakan password baru saat login berikutnya.";
    } catch {
      status.textContent = "Akun cloud tidak dapat dihubungi. Coba lagi.";
    } finally {
      form.reset();
      button.disabled = false;
    }
  }
  async function changeCloudEmail() {
    const email = document.getElementById("proCloudNewEmail")?.value.trim();
    if (!email) throw new Error("Isi email baru.");
    const { error } = await supabaseClient.auth.updateUser({ email });
    if (error) throw error;
    showToast("Tautan konfirmasi dikirim ke email baru.", "✉️");
  }

  function renderProSettings() {
    if (!state) return;
    const map = {
      proAutoRecurring: state.settings.autoPostRecurring,
      proBudgetAlerts: state.settings.smartBudgetAlerts,
      proBillReminderEnabled: state.settings.billReminderEnabled,
      proBillReminderPopup: state.settings.billReminderPopup,
      proBillReminderLowBalance: state.settings.billReminderLowBalance,
      proBillReminderDebts: state.settings.billReminderIncludeDebts,
      proBillReminderCredit: state.settings.billReminderIncludeCredit,
      proAttachmentAutoSync: state.settings.syncAttachments,
      proAutoBackup: state.settings.autoBackup
    };
    Object.entries(map).forEach(([id, checked]) => { const element = document.getElementById(id); if (element) element.checked = Boolean(checked); });
    const reminderDays = document.getElementById("proBillReminderDays");
    if (reminderDays) reminderDays.value = (state.settings.billReminderDays || [7,3,1,0]).join(", ");
    const reminderBuffer = document.getElementById("proBillReminderBuffer");
    if (reminderBuffer) reminderBuffer.value = String(state.settings.billReminderTopUpBufferPercent || 0);
    const recovery = document.getElementById("proRecoveryStatus");
    if (recovery) recovery.textContent = state.security.recoveryKeyCreatedAt ? `Terakhir dibuat ${formatDateTime(state.security.recoveryKeyCreatedAt)}.` : "Recovery key belum pernah dibuat.";
    const devices = document.getElementById("proDeviceList");
    if (devices) devices.innerHTML = state.security.devices.length ? state.security.devices.slice().sort((a,b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt)).map((device) => `<div class="pro-device-item"><span><strong>${escapeHTML(device.name)} ${device.id === currentDeviceId() ? "· Perangkat ini" : ""}</strong><small>${formatDateTime(device.lastSeenAt)} · ${device.revoked ? "dicabut" : "aktif"}</small></span>${device.id !== currentDeviceId() && !device.revoked ? `<button class="mini-button" data-pro-action="revoke-device" data-pro-id="${device.id}" type="button">✕</button>` : `<span class="pro-chip ${device.revoked ? "bad" : "good"}">${device.revoked ? "revoked" : "active"}</span>`}</div>`).join("") : `<div class="muted">Belum ada perangkat.</div>`;
    const installStatus = document.getElementById("proInstallStatus");
    if (installStatus) installStatus.textContent = window.matchMedia("(display-mode: standalone)").matches ? "Aplikasi sudah berjalan sebagai PWA." : "Gunakan tombol instal atau menu browser → Tambahkan ke layar utama.";
  }

  async function revokeDevice(id) {
    const device = state.security.devices.find((item) => item.id === id);
    if (!device) return;
    await commit("Akses perangkat dicabut", device.name, () => { device.revoked = true; device.revokedAt = nowIso(); });
  }

  async function logoutAllDevices() {
    if (!confirm("Semua perangkat lain akan diminta login ulang setelah sinkronisasi berikutnya. Lanjutkan?")) return;
    await commit("Keluar semua perangkat", "Generasi sesi diperbarui.", () => {
      state.security.sessionGeneration += 1;
      state.security.devices.forEach((device) => { if (device.id !== currentDeviceId()) device.revoked = true; });
      const current = state.security.devices.find((device) => device.id === currentDeviceId());
      if (current) { current.generation = state.security.sessionGeneration; current.revoked = false; }
    });
    localStorage.setItem(DEVICE_GENERATION_KEY, String(state.security.sessionGeneration));
    await cloudPush({ force: true, silent: true });
    showToast("Perintah keluar semua perangkat tersinkron.", "🔐");
  }

  function checkSecurityGeneration() {
    if (!state?.security) return;
    const localGeneration = safeNumber(localStorage.getItem(DEVICE_GENERATION_KEY) || state.security.sessionGeneration);
    const device = state.security.devices.find((item) => item.id === currentDeviceId());
    if ((device?.revoked || localGeneration < state.security.sessionGeneration) && cloudSession?.user) {
      localStorage.setItem(DEVICE_GENERATION_KEY, String(state.security.sessionGeneration));
      supabaseClient.auth.signOut({ scope: "local" }).finally(() => {
        showToast("Sesi perangkat ini telah dicabut.", "🔒");
        lockApplication("Sesi dicabut dari perangkat lain.");
      });
    } else {
      localStorage.setItem(DEVICE_GENERATION_KEY, String(state.security.sessionGeneration));
    }
  }

  async function enableProNotifications() {
    if (!("Notification" in window)) throw new Error("Browser tidak mendukung notifikasi.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Izin notifikasi tidak diberikan.");
    state.settings.notificationsEnabled = true;
    state.settings.billReminderEnabled = true;
    await encryptState();
    await processDueNotifications(true);
    await openReminderCenter(true);
    showToast("Notifikasi dan pengingat tagihan aktif.", "🔔");
  }

  function parseReminderDays(value) {
    const raw = Array.isArray(value) ? value : String(value ?? "").split(/[,;\s]+/);
    return Array.from(new Set(raw.map((item) => Math.trunc(Number(item))).filter((item) => Number.isFinite(item) && item >= 0 && item <= 365))).sort((a, b) => b - a);
  }

  function daysUntilDate(dateString) {
    const today = new Date(`${localISO()}T00:00:00`);
    const due = new Date(`${dateString}T00:00:00`);
    return Math.round((due - today) / 86400000);
  }

  function monthlyDueDate(day) {
    const today = new Date(`${localISO()}T00:00:00`);
    let due = new Date(today.getFullYear(), today.getMonth(), clamp(safeNumber(day) || 1, 1, 28));
    if (due < today) due = new Date(today.getFullYear(), today.getMonth() + 1, clamp(safeNumber(day) || 1, 1, 28));
    return localISO(due);
  }

  function reminderDaysFor(item) {
    const custom = parseReminderDays(item?.reminderDays || []);
    return custom.length ? custom : parseReminderDays(state.settings.billReminderDays || [7, 3, 1, 0]);
  }

  function reminderIsSnoozed(key) {
    const value = state.settings.billReminderSnoozes?.[key];
    return Boolean(value && value >= localISO());
  }

  function collectBillReminders({ upcomingWindow = 45, onlyTriggered = false } = {}) {
    if (!state?.settings?.billReminderEnabled) return [];
    const reminders = [];
    const add = (item) => {
      item.days = daysUntilDate(item.dueDate);
      item.overdue = item.days < 0;
      item.reminderDays = reminderDaysFor(item.source);
      item.triggered = item.overdue || item.reminderDays.includes(item.days);
      item.key = `${item.kind}:${item.id}:${item.dueDate}`;
      if (reminderIsSnoozed(item.key)) return;
      if (onlyTriggered && !item.triggered) return;
      if (!onlyTriggered && (item.days < -31 || item.days > upcomingWindow)) return;
      reminders.push(item);
    };

    financialItems(state.recurring || []).filter((item) => item.active && item.type === "expense" && item.reminderEnabled !== false).forEach((item) => {
      const account = state.accounts.find((row) => row.id === item.accountId);
      const amount = safeNumber(item.amount);
      const balance = account ? Math.max(accountBalance(account), 0) : 0;
      const buffer = amount * clamp(safeNumber(state.settings.billReminderTopUpBufferPercent), 0, 100) / 100;
      const required = amount + buffer;
      add({
        kind: "recurring", id: item.id, title: item.name, amount, currency: item.currency || account?.currency || state.settings.baseCurrency,
        dueDate: item.nextDate, account, balance, required, shortfall: Math.max(required - balance, 0), source: item,
        subtitle: item.category || "Tagihan rutin", icon: item.icon || "🧾"
      });
    });

    if (state.settings.billReminderIncludeDebts) {
      financialItems(state.debts || []).filter((item) => debtBalance(item) > 0 && item.kind !== "receivable").forEach((item) => {
        const account = state.accounts.find((row) => row.id === item.accountId);
        const dueDate = localISO(nextDueDate(item));
        const amount = safeNumber(item.monthlyPayment || Math.min(debtBalance(item), item.balance || item.principal));
        const balance = account ? Math.max(accountBalance(account), 0) : 0;
        const buffer = amount * clamp(safeNumber(state.settings.billReminderTopUpBufferPercent), 0, 100) / 100;
        const required = amount + buffer;
        add({ kind: "debt", id: item.id, title: item.name, amount, currency: item.currency || state.settings.baseCurrency, dueDate,
          account, balance, required, shortfall: Math.max(required - balance, 0), source: item, subtitle: item.lender || "Cicilan/utang", icon: "🧮" });
      });
    }

    if (state.settings.billReminderIncludeCredit) {
      financialItems(state.accounts || []).filter((account) => account.liability && ["credit", "paylater"].includes(account.type) && account.dueDay && accountBalance(account) > 0).forEach((account) => {
        const amount = Math.max(accountBalance(account), 0);
        add({ kind: "credit", id: account.id, title: account.name, amount, currency: account.currency, dueDate: monthlyDueDate(account.dueDay),
          account: null, balance: 0, required: amount, shortfall: 0, source: account, subtitle: ACCOUNT_TYPES[account.type]?.label || "Kewajiban", icon: account.icon || "💳" });
      });
    }

    return reminders.sort((a, b) => a.days - b.days || b.shortfall - a.shortfall);
  }

  function dueLabel(reminder) {
    if (reminder.days < 0) return `Terlambat ${Math.abs(reminder.days)} hari`;
    if (reminder.days === 0) return "Jatuh tempo hari ini";
    return `${reminder.days} hari lagi`;
  }

  function notificationAlreadySent(key) {
    return state.notificationLog.some((item) => item.key === key && Date.now() - new Date(item.timestamp).getTime() < 20 * 60 * 60 * 1000);
  }

  async function sendProNotification(key, title, body, data = {}) {
    if (notificationAlreadySent(key) || !("Notification" in window) || Notification.permission !== "granted") return;
    const options = { body, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: key, renotify: false, data };
    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration) await registration.showNotification(title, options);
      else new Notification(title, options);
    } catch {
      new Notification(title, options);
    }
    state.notificationLog.unshift({ id: proId("notification"), key, title, timestamp: nowIso() });
    state.notificationLog = state.notificationLog.slice(0, 150);
  }

  function updateReminderBadge() {
    const badge = document.getElementById("proReminderBadge");
    const button = document.getElementById("proReminderButton");
    if (!badge || !button || !state) return;
    const items = collectBillReminders({ onlyTriggered: true });
    badge.textContent = String(items.length > 99 ? "99+" : items.length);
    badge.hidden = items.length === 0;
    button.classList.toggle("has-reminders", items.length > 0);
    button.title = items.length ? `${items.length} tagihan perlu perhatian` : "Tidak ada tagihan mendesak";
  }

  function reminderCardHtml(item) {
    const accountText = item.account ? `${item.account.icon || "👛"} ${escapeHTML(item.account.name)} · saldo ${formatCurrency(item.balance, item.account.currency)}` : "Akun pembayaran belum ditentukan";
    const lowBalance = state.settings.billReminderLowBalance && item.source?.lowBalanceReminder !== false && item.shortfall > 0;
    return `<article class="bill-reminder-card ${item.overdue ? "overdue" : lowBalance ? "low-balance" : ""}">
      <div class="bill-reminder-icon">${item.icon}</div>
      <div class="bill-reminder-body">
        <div class="bill-reminder-head"><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle)} · ${formatDate(item.dueDate)}</small></div><span class="pro-chip ${item.overdue ? "bad" : item.days <= 1 ? "warn" : "good"}">${dueLabel(item)}</span></div>
        <div class="bill-reminder-money"><strong class="money">${formatCurrency(item.amount, item.currency)}</strong><span>${accountText}</span></div>
        ${lowBalance ? `<div class="bill-shortfall">⚠️ Saldo diperkirakan kurang <strong class="money">${formatCurrency(item.shortfall, item.account?.currency || item.currency)}</strong>. Isi saldo minimal sebelum jatuh tempo.</div>` : `<div class="bill-ready">✓ Saldo pembayaran diperkirakan cukup.</div>`}
        <div class="bill-reminder-actions">
          ${item.account && item.shortfall > 0 ? `<button class="button primary" data-pro-action="reminder-topup" data-reminder-key="${item.key}" type="button">＋ Siapkan Saldo</button>` : ""}
          ${item.kind === "recurring" ? `<button class="button success" data-pro-action="reminder-paid" data-reminder-key="${item.key}" type="button">✓ Tandai Dibayar</button>` : ""}
          <button class="button secondary" data-pro-action="reminder-snooze" data-reminder-key="${item.key}" data-days="1" type="button">Tunda 1 Hari</button>
          <button class="mini-button" data-pro-action="reminder-edit" data-reminder-key="${item.key}" type="button" title="Edit sumber tagihan">✏️</button>
        </div>
      </div>
    </article>`;
  }

  async function openReminderCenter(force = false) {
    if (!state || reminderPopupOpening) return;
    reminderPopupOpening = true;
    try {
      const items = collectBillReminders({ upcomingWindow: force ? 45 : 14, onlyTriggered: !force });
      if (!items.length) {
        if (force) showToast("Tidak ada tagihan yang perlu diingatkan.", "✅");
        return;
      }
      showModal("🔔 Pengingat Tagihan", `${items.length} pembayaran perlu disiapkan. Saldo dihitung dari akun pembayaran yang terhubung.`, `
        <div class="bill-reminder-summary">
          <div><span>Jatuh tempo/terlambat</span><strong>${items.filter((item) => item.days <= 0).length}</strong></div>
          <div><span>Saldo kurang</span><strong>${items.filter((item) => item.shortfall > 0).length}</strong></div>
          <div><span>Total tagihan</span><strong class="money">${formatCurrency(items.reduce((sum, item) => sum + (convertCurrency(item.amount, item.currency, state.settings.baseCurrency) || 0), 0))}</strong></div>
        </div>
        <div class="bill-reminder-list">${items.map(reminderCardHtml).join("")}</div>
        <div class="form-actions"><button class="button secondary" id="billReminderClose" type="button">Tutup</button></div>
      `);
      document.getElementById("billReminderClose")?.addEventListener("click", closeModal);
      state.settings.lastBillReminderPopupDate = localISO();
      await encryptState();
    } finally {
      reminderPopupOpening = false;
      updateReminderBadge();
    }
  }

  async function maybeShowBillReminderPopup() {
    if (!state?.settings?.billReminderEnabled || !state.settings.billReminderPopup) return;
    if (state.settings.lastBillReminderPopupDate === localISO()) return;
    const items = collectBillReminders({ onlyTriggered: true });
    if (!items.length) return;
    window.setTimeout(() => openReminderCenter(false).catch(console.error), 700);
  }

  function findReminderByKey(key) {
    return collectBillReminders({ upcomingWindow: 400, onlyTriggered: false }).find((item) => item.key === key) || null;
  }

  async function snoozeBillReminder(key, days = 1) {
    const reminder = findReminderByKey(key);
    if (!reminder) return;
    const until = new Date(`${localISO()}T00:00:00`);
    until.setDate(until.getDate() + Math.max(1, days));
    state.settings.billReminderSnoozes ||= {};
    state.settings.billReminderSnoozes[key] = localISO(until);
    await encryptState();
    closeModal();
    updateReminderBadge();
    showToast(`${reminder.title} ditunda ${days} hari.`, "⏰");
  }

  function openReminderTopUp(key) {
    const reminder = findReminderByKey(key);
    if (!reminder?.account) throw new Error("Akun pembayaran tidak ditemukan.");
    const target = reminder.account;
    const sources = financialItems(state.accounts).filter((account) => !account.liability && !account.archived && account.id !== target.id);
    showModal("Siapkan Saldo", `Isi saldo ${target.name} untuk membayar ${reminder.title}.`, `
      <form id="billTopUpForm" class="form-stack">
        <label class="field"><span>Sumber dana</span><select class="input" id="billTopUpSource"><option value="external">Dana dari luar aplikasi</option>${sources.map((account) => `<option value="${account.id}">${account.icon} ${escapeHTML(account.name)} · ${formatCurrency(accountBalance(account), account.currency)}</option>`).join("")}</select></label>
        <label class="field"><span>Akun tujuan</span><input class="input" value="${escapeHTML(target.name)} · ${target.currency}" readonly /></label>
        <label class="field"><span>Nominal yang disiapkan</span><input class="input" id="billTopUpAmount" type="number" min="0.00000001" step="any" value="${Math.ceil(reminder.shortfall || reminder.amount)}" required /></label>
        <label class="field"><span>Catatan</span><input class="input" id="billTopUpNote" value="Isi saldo untuk ${escapeHTML(reminder.title)}" /></label>
        <div class="form-actions"><button class="button secondary" id="billTopUpCancel" type="button">Batal</button><button class="button primary" type="submit">Catat Isi Saldo</button></div>
      </form>`);
    document.getElementById("billTopUpCancel")?.addEventListener("click", closeModal);
    document.getElementById("billTopUpForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const sourceId = document.getElementById("billTopUpSource").value;
      const amount = safeNumber(document.getElementById("billTopUpAmount").value);
      const note = document.getElementById("billTopUpNote").value.trim();
      if (amount <= 0) throw new Error("Nominal harus lebih dari nol.");
      const rate = convertCurrency(1, target.currency, state.settings.baseCurrency) ?? 0;
      await commit("Saldo tagihan disiapkan", reminder.title, () => {
        if (sourceId === "external") {
          state.transactions.push({ id: proId("tx"), type: "income", description: note || `Isi saldo ${target.name}`, merchant: "Top up", date: localISO(), accountId: target.id, destinationAccountId: null, amount, destinationAmount: null, fee: 0, currency: target.currency, category: "Lainnya", splits: [], tags: ["topup", "pengingat-tagihan"], notes: `Untuk ${reminder.title}`, status: "completed", deductible: false, reconciled: false, profileId: target.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate, baseAmount: amount * rate, attachmentIds: [], createdAt: nowIso() });
        } else {
          const source = state.accounts.find((account) => account.id === sourceId);
          if (!source) throw new Error("Akun sumber tidak ditemukan.");
          const destinationAmount = convertCurrency(amount, source.currency, target.currency) ?? amount;
          const sourceRate = convertCurrency(1, source.currency, state.settings.baseCurrency) ?? 0;
          state.transactions.push({ id: proId("tx"), type: "transfer", description: note || `Siapkan saldo ${target.name}`, merchant: "", date: localISO(), accountId: source.id, destinationAccountId: target.id, amount, destinationAmount, fee: 0, currency: source.currency, category: "Lainnya", splits: [], tags: ["transfer", "pengingat-tagihan"], notes: `Untuk ${reminder.title}`, status: "completed", deductible: false, reconciled: false, profileId: target.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: sourceRate, baseAmount: amount * sourceRate, attachmentIds: [], createdAt: nowIso() });
        }
      });
      closeModal();
      showToast("Isi saldo berhasil dicatat.", "💰");
      updateReminderBadge();
    });
  }

  async function markReminderPaid(key) {
    const reminder = findReminderByKey(key);
    if (!reminder || reminder.kind !== "recurring") return;
    const item = reminder.source;
    const account = state.accounts.find((row) => row.id === item.accountId);
    if (!account) throw new Error("Akun pembayaran tidak ditemukan.");
    if (!confirm(`Catat ${item.name} sebagai dibayar sebesar ${formatCurrency(item.amount, item.currency)}?`)) return;
    const paidDate = item.nextDate;
    const rate = convertCurrency(1, account.currency, state.settings.baseCurrency) ?? 0;
    await commit("Tagihan ditandai dibayar", item.name, () => {
      const duplicate = state.transactions.some((tx) => tx.sourceRecurringId === item.id && tx.date === paidDate);
      if (!duplicate) state.transactions.push({ id: proId("tx"), type: "expense", description: item.name, merchant: "Pembayaran tagihan", date: localISO(), accountId: account.id, destinationAccountId: null, amount: safeNumber(item.amount), destinationAmount: null, fee: 0, currency: account.currency, category: item.category, splits: [], tags: ["rutin", "dibayar", "pengingat-tagihan"], notes: `Jadwal awal ${paidDate}.`, status: "completed", deductible: false, reconciled: false, profileId: item.profileId || account.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate, baseAmount: safeNumber(item.amount) * rate, attachmentIds: [], sourceRecurringId: item.id, createdAt: nowIso() });
      item.lastProcessedDate = paidDate;
      item.nextDate = advanceRecurringDate(paidDate, item.frequency);
      if (item.endDate && item.nextDate > item.endDate) item.active = false;
    });
    closeModal();
    showToast(`${item.name} ditandai sudah dibayar.`, "✅");
    updateReminderBadge();
  }

  function editReminderSource(key) {
    const reminder = findReminderByKey(key);
    if (!reminder) return;
    closeModal();
    if (reminder.kind === "recurring") openRecurringForm(reminder.source);
    else if (reminder.kind === "debt") openDebtForm(reminder.source);
    else if (reminder.kind === "credit") openAccountForm(reminder.source);
  }

  async function processDueNotifications(force = false) {
    if (!state?.settings?.billReminderEnabled) { updateReminderBadge(); return; }
    const reminders = collectBillReminders({ onlyTriggered: true });
    if (state.settings.notificationsEnabled && ("Notification" in window) && Notification.permission === "granted") {
      for (const item of reminders) {
        const shortfallText = state.settings.billReminderLowBalance && item.shortfall > 0 ? ` Saldo kurang sekitar ${formatCurrency(item.shortfall, item.account?.currency || item.currency)}.` : "";
        await sendProNotification(`bill-${item.key}-d${item.days}`, `${item.icon} ${item.title}`, `${formatCurrency(item.amount, item.currency)} ${dueLabel(item).toLowerCase()}.${shortfallText}`, { reminderKey: item.key });
      }
    }
    if (state.settings.smartBudgetAlerts && state.settings.notificationsEnabled && ("Notification" in window) && Notification.permission === "granted") {
      for (const budget of financialItems(state.budgets)) {
        const limit = safeNumber(budget.limit) + (budget.rollover ? safeNumber(budget.rolloverAmount) : 0);
        const pct = limit > 0 ? budgetSpent(budget) / limit * 100 : 0;
        const threshold = [100,90,75,50].find((value) => pct >= value);
        if (threshold) await sendProNotification(`budget-${budget.id}-${threshold}-${new Date().getMonth()}`, `Budget ${budget.name} mencapai ${pct.toFixed(0)}%`, `${formatCurrency(budgetSpent(budget), budget.currency)} dari ${formatCurrency(limit, budget.currency)}.`);
      }
    }
    updateReminderBadge();
    if (force) await encryptState();
  }

  async function installProApp() {
    if (window.matchMedia("(display-mode: standalone)").matches) { showToast("Aplikasi sudah terinstal.", "✅"); return; }
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      renderProSettings();
      return;
    }
    showToast("Gunakan menu browser → Tambahkan ke layar utama.", "📲");
  }

  async function checkPwaUpdate() {
    if (!("serviceWorker" in navigator)) throw new Error("Service worker tidak tersedia.");
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("Service worker belum terdaftar.");
    await registration.update();
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      location.reload();
    } else showToast("Versi aplikasi sudah terbaru.", "✅");
  }

  function updateOnlineStatus() {
    const pill = document.getElementById("proConnectionStatus");
    if (!pill) return;
    const queue = loadSyncQueue();
    const conflict = Boolean(cloudConflict);
    pill.className = "pro-status-pill";
    if (!navigator.onLine) { pill.textContent = "Offline"; return; }
    if (conflict) { pill.classList.add("conflict"); pill.textContent = "Konflik Cloud"; return; }
    if (queue) { pill.classList.add("syncing"); pill.textContent = "Menunggu Sync"; return; }
    pill.classList.add("online");
    pill.textContent = cloudSession?.user ? "Cloud Online" : "Internet Online";
  }

  function renderErrors() {
    const container = document.getElementById("proErrorList");
    if (!container || !state) return;
    container.innerHTML = state.errorLog.length ? state.errorLog.slice(0, 20).map((item) => `<div class="pro-error-item"><span><strong>${escapeHTML(item.message)}</strong><small>${escapeHTML(item.context)} · ${formatDateTime(item.timestamp)}</small></span><span class="pro-chip bad">error</span></div>`).join("") : `<div class="pro-success-box">Tidak ada error yang tercatat.</div>`;
  }

  function exportDiagnostics() {
    const diagnostics = {
      application: "CHARISNA Money Management",
      version: PRO_VERSION,
      generatedAt: nowIso(),
      online: navigator.onLine,
      userAgent: navigator.userAgent,
      language: navigator.language,
      storage: navigator.storage ? "supported" : "unknown",
      serviceWorker: "serviceWorker" in navigator,
      notificationPermission: "Notification" in window ? Notification.permission : "unsupported",
      cloudUser: cloudSession?.user?.email || null,
      cloudVersion: vault?.cloud?.version || 0,
      queue: loadSyncQueue(),
      activeFinancialUser: window.CharisnaUsers?.active?.()?.name || null,
      counts: state ? {
        active: {
          accounts: financialItems(state.accounts).length,
          transactions: financialItems(state.transactions).length,
          budgets: financialItems(state.budgets).length,
          goals: financialItems(state.goals).length,
          debts: financialItems(state.debts).length,
          investments: financialItems(state.investments).length
        },
        totalVault: {
          accounts: state.accounts.length,
          transactions: state.transactions.length,
          budgets: state.budgets.length,
          goals: state.goals.length,
          debts: state.debts.length,
          investments: state.investments.length
        }
      } : null,
      errors: state?.errorLog || []
    };
    downloadBlob(new Blob([JSON.stringify(diagnostics, null, 2)], { type: "application/json" }), `charisna-diagnostics-${localISO()}.json`);
  }

  async function clearErrorLog() {
    if (!state) return;
    await commit("Error log dibersihkan", "Semua error lokal dihapus.", () => { state.errorLog = []; });
  }

  function renderOnboarding() {
    const panel = document.getElementById("proOnboarding");
    if (!panel || state.settings.onboardingDismissed) { if (panel) panel.hidden = true; return; }
    const checks = [
      { label: "Akun cloud tersambung", done: Boolean(cloudSession?.user) },
      { label: "Minimal satu dompet/rekening pada akun aktif", done: financialItems(state.accounts).length > 0 },
      { label: "Recovery key dibuat", done: Boolean(state.security.recoveryKeyCreatedAt) },
      { label: "Notifikasi diaktifkan", done: state.settings.notificationsEnabled && ("Notification" in window) && Notification.permission === "granted" },
      { label: "Backup lengkap pernah dibuat", done: getSnapshots().some((item) => item.label.includes("backup")) }
    ];
    panel.hidden = false;
    panel.innerHTML = `<h4>🚀 Penyempurnaan Awal</h4><p>Selesaikan checklist agar aplikasi aman digunakan lintas perangkat.</p><div class="pro-checklist">${checks.map((item) => `<div class="pro-check ${item.done ? "done" : ""}">${item.done ? "✓" : "○"} ${escapeHTML(item.label)}</div>`).join("")}</div><button class="button secondary wide" id="proDismissOnboarding" type="button">Tutup Checklist</button>`;
  }

  function dismissOnboarding() {
    state.settings.onboardingDismissed = true;
    encryptState().catch(console.error);
    renderOnboarding();
  }

  function advanceRecurringDate(dateString, frequency) {
    const date = new Date(`${dateString}T00:00:00`);
    if (frequency === "weekly") date.setDate(date.getDate() + 7);
    else if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    return localISO(date);
  }

  async function processRecurringSchedules() {
    if (!state?.settings?.autoPostRecurring || !financialItems(state.recurring).length) return;
    const today = localISO();
    const created = [];
    financialItems(state.recurring).filter((item) => item.active && item.autoPost !== false).forEach((item) => {
      let safety = 0;
      while (item.nextDate && item.nextDate <= today && safety < 36) {
        const duplicate = state.transactions.some((tx) => tx.sourceRecurringId === item.id && tx.date === item.nextDate);
        if (!duplicate) {
          const account = state.accounts.find((row) => row.id === item.accountId);
          if (account) {
            const rate = convertCurrency(1, account.currency, state.settings.baseCurrency) ?? 0;
            const tx = { id: proId("tx"), type: item.type, description: item.name, merchant: "Transaksi rutin", date: item.nextDate, accountId: account.id, destinationAccountId: null, amount: safeNumber(item.amount), destinationAmount: null, fee: 0, currency: account.currency, category: item.category, splits: [], tags: ["rutin", "otomatis"], notes: "Diposting otomatis dari jadwal rutin.", status: "completed", deductible: false, reconciled: false, profileId: item.profileId || account.profileId, baseCurrency: state.settings.baseCurrency, historicalRate: rate, baseAmount: safeNumber(item.amount) * rate, attachmentIds: [], sourceRecurringId: item.id, createdAt: nowIso() };
            state.transactions.push(tx);
            created.push(tx);
          }
        }
        item.lastProcessedDate = item.nextDate;
        item.nextDate = advanceRecurringDate(item.nextDate, item.frequency);
        if (item.endDate && item.nextDate > item.endDate) item.active = false;
        safety += 1;
      }
    });
    if (created.length) {
      addAudit("Transaksi rutin diposting", `${created.length} transaksi otomatis.`);
      await encryptState();
      renderAll();
      showToast(`${created.length} transaksi rutin diposting otomatis.`, "🔁");
    }
  }


  function accountLastActivity(accountId) {
    const dates = (state.transactions || [])
      .filter((tx) => tx.accountId === accountId || tx.destinationAccountId === accountId)
      .map((tx) => new Date(`${tx.date}T00:00:00`).getTime())
      .filter(Number.isFinite);
    return dates.length ? Math.max(...dates) : 0;
  }

  function orderedAccountsForType(type, accounts) {
    const orderIndex = new Map((state.settings.accountOrder || []).map((id, index) => [id, index]));
    const sort = state.settings.accountSort || "manual";
    return [...accounts].sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      if (sort === "name") return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
      if (sort === "balance-desc") return accountValueInBase(b) - accountValueInBase(a);
      if (sort === "balance-asc") return accountValueInBase(a) - accountValueInBase(b);
      if (sort === "recent") return accountLastActivity(b.id) - accountLastActivity(a.id);
      return (orderIndex.get(a.id) ?? 999999) - (orderIndex.get(b.id) ?? 999999);
    });
  }

  function accountMatchesWorkspaceFilters(account) {
    if (!state.settings.accountShowArchived && account.archived) return false;
    if (!state.settings.accountShowZero && Math.abs(accountBalance(account)) < 0.000001) return false;
    if (accountTypeFilter !== "all" && account.type !== accountTypeFilter) return false;
    if (!accountSearchQuery) return true;
    const profile = state.profiles.find((item) => item.id === account.profileId)?.name || "";
    return [account.name, account.currency, ACCOUNT_TYPES[account.type]?.label, profile]
      .join(" ").toLowerCase().includes(accountSearchQuery);
  }

  function accountCardWorkspace(account) {
    const type = ACCOUNT_TYPES[account.type] || ACCOUNT_TYPES.bank;
    const balance = accountBalance(account);
    const converted = accountValueInBase(account);
    const profile = state.profiles.find((item) => item.id === account.profileId)?.name || "Personal";
    const txCount = state.transactions.filter((tx) => tx.accountId === account.id || tx.destinationAccountId === account.id).length;
    const lastActivity = accountLastActivity(account.id);
    const creditPercentage = account.liability && Number(account.creditLimit) > 0
      ? Math.max(0, balance / Number(account.creditLimit) * 100)
      : null;
    return `
      <article class="account-card account-workspace-card ${account.archived ? "is-archived" : ""} ${account.pinned ? "is-pinned" : ""}"
        style="--account-color:${account.color}" data-account-drag-id="${account.id}" data-account-type="${account.type}"
        draggable="${accountArrangeMode && state.settings.accountSort === "manual" ? "true" : "false"}">
        <div class="account-card-drag" title="Seret untuk mengubah urutan">⋮⋮</div>
        <div class="card-top">
          <div class="card-icon">${account.icon || type.icon}</div>
          <div class="account-badge-stack">
            ${account.pinned ? '<span class="badge account-pin-badge">★ Favorit</span>' : ""}
            ${account.archived ? '<span class="badge account-archive-badge">Arsip</span>' : ""}
            <span class="badge">${type.label} · ${account.currency}</span>
          </div>
        </div>
        <h4>${escapeHTML(account.name)}</h4>
        <span class="balance money">${formatCurrency(balance, account.currency)}</span>
        <p class="muted money">≈ ${formatCurrency(converted)}</p>
        ${creditPercentage === null ? "" : `
          <div class="account-credit-mini">
            <div class="progress-track"><div class="progress-bar" style="width:${Math.min(creditPercentage, 100)}%;background:${creditPercentage > 80 ? "#ff5967" : account.color}"></div></div>
            <div class="progress-meta"><span>${creditPercentage.toFixed(0)}% limit</span><span>${formatCurrency(Math.max(Number(account.creditLimit) - balance, 0), account.currency)} tersisa</span></div>
          </div>`}
        <div class="account-card-insights">
          <span>${txCount} transaksi</span>
          <span>${lastActivity ? `Aktif ${formatDate(localISO(new Date(lastActivity)))}` : "Belum ada aktivitas"}</span>
        </div>
        <div class="card-bottom account-card-footer">
          <span>${account.liability ? "Kewajiban" : "Aset"} · ${escapeHTML(profile)}</span>
          <div class="table-actions account-main-actions">
            <button class="mini-button" data-pro-action="account-details" data-pro-id="${account.id}" type="button" title="Detail & analisis">ⓘ</button>
            <button class="mini-button" data-pro-action="account-pin" data-pro-id="${account.id}" type="button" title="${account.pinned ? "Lepas favorit" : "Jadikan favorit"}">${account.pinned ? "★" : "☆"}</button>
            <button class="mini-button" data-reconcile-account="${account.id}" type="button" title="Rekonsiliasi">✓</button>
            <button class="mini-button" data-edit-account="${account.id}" type="button" title="Edit">✏️</button>
            <button class="mini-button" data-pro-action="account-archive" data-pro-id="${account.id}" type="button" title="${account.archived ? "Keluarkan dari arsip" : "Arsipkan"}">${account.archived ? "↩" : "🗄"}</button>
          </div>
        </div>
        <div class="account-position-actions">
          <button class="mini-button" data-pro-action="account-up" data-pro-id="${account.id}" type="button" title="Geser ke atas/kiri">←</button>
          <span>Seret kartu atau gunakan panah</span>
          <button class="mini-button" data-pro-action="account-down" data-pro-id="${account.id}" type="button" title="Geser ke bawah/kanan">→</button>
        </div>
      </article>`;
  }

  function renderAccountWorkspace(syncControls = true) {
    if (!state) return;
    const grid = document.getElementById("accountGrid");
    const toolbar = document.getElementById("proAccountToolbar");
    if (!grid || !toolbar) return;

    if (syncControls) {
      const search = document.getElementById("proAccountSearch");
      if (search && search.value !== accountSearchQuery) search.value = accountSearchQuery;
      const typeFilter = document.getElementById("proAccountTypeFilter");
      if (typeFilter) typeFilter.value = accountTypeFilter;
      const sort = document.getElementById("proAccountSort");
      if (sort) sort.value = state.settings.accountSort || "manual";
      const layout = document.getElementById("proAccountLayout");
      if (layout) layout.value = state.settings.accountLayout || "comfortable";
      const showZero = document.getElementById("proAccountShowZero");
      if (showZero) showZero.checked = state.settings.accountShowZero !== false;
      const showArchived = document.getElementById("proAccountShowArchived");
      if (showArchived) showArchived.checked = Boolean(state.settings.accountShowArchived);
    }

    toolbar.classList.toggle("arrange-active", accountArrangeMode);
    const arrangeButton = document.getElementById("proToggleAccountArrange");
    if (arrangeButton) arrangeButton.textContent = accountArrangeMode ? "✓ Selesai Mengatur" : "↕ Atur Peletakan";

    const visibleAccounts = financialItems(state.accounts).filter(accountMatchesWorkspaceFilters);
    const categoryOrder = state.settings.accountCategoryOrder || Object.keys(ACCOUNT_TYPES);
    const assets = visibleAccounts.filter((account) => !account.liability).reduce((sum, account) => sum + accountValueInBase(account), 0);
    const liabilities = visibleAccounts.filter((account) => account.liability).reduce((sum, account) => sum + accountValueInBase(account), 0);
    const summaryBase = assets - liabilities;
    const summary = document.getElementById("proAccountSummary");
    if (summary) summary.innerHTML = `<span><strong>${visibleAccounts.length}</strong> akun terlihat</span><span>Aset <strong class="positive money">${formatCurrency(assets)}</strong></span><span>Kewajiban <strong class="negative money">${formatCurrency(liabilities)}</strong></span><span>Nilai bersih tampilan <strong class="money">${formatCurrency(summaryBase)}</strong></span>`;

    const sections = categoryOrder.map((type, categoryIndex) => {
      const meta = ACCOUNT_TYPES[type];
      if (!meta) return "";
      const accounts = orderedAccountsForType(type, visibleAccounts.filter((account) => account.type === type));
      if (!accounts.length) return "";
      const collapsed = Boolean(state.settings.accountCollapsedGroups?.[type]);
      const total = accounts.reduce((sum, account) => sum + accountValueInBase(account), 0);
      return `
        <section class="account-category-section ${collapsed ? "is-collapsed" : ""}" data-account-group="${type}">
          <header class="account-category-header" data-account-group-drag="${type}" draggable="${accountArrangeMode ? "true" : "false"}>
            <div class="account-category-title">
              <span class="account-category-drag" title="Seret kategori">⋮⋮</span>
              <span class="account-category-icon">${meta.icon}</span>
              <div><h4>${escapeHTML(meta.label)}</h4><p>${accounts.length} akun · ${meta.liability ? "Kewajiban" : "Aset"}</p></div>
            </div>
            <div class="account-category-meta">
              <strong class="money ${meta.liability ? "negative" : "positive"}">${formatCurrency(total)}</strong>
              <div class="table-actions account-group-position-actions">
                <button class="mini-button" data-pro-action="account-group-up" data-account-type="${type}" type="button" ${categoryIndex === 0 ? "disabled" : ""}>↑</button>
                <button class="mini-button" data-pro-action="account-group-down" data-account-type="${type}" type="button">↓</button>
              </div>
              <button class="mini-button" data-pro-action="account-toggle-group" data-account-type="${type}" type="button" title="Buka/tutup kategori">${collapsed ? "＋" : "−"}</button>
            </div>
          </header>
          <div class="account-category-grid account-layout-${state.settings.accountLayout || "comfortable"}" data-account-group-drop="${type}">
            ${accounts.map(accountCardWorkspace).join("")}
          </div>
        </section>`;
    }).filter(Boolean);

    grid.className = `account-groups ${accountArrangeMode ? "account-arrange-mode" : ""}`;
    grid.innerHTML = sections.length ? sections.join("") : `<div class="pro-empty account-empty-state"><div><strong>Belum ada akun yang cocok</strong>Ubah filter, tampilkan saldo nol/arsip, atau tambahkan akun baru.</div></div>`;
  }

  async function persistAccountWorkspace(action, detail) {
    addAudit(action, detail);
    await encryptState();
    renderAll();
  }

  async function toggleAccountGroup(type) {
    state.settings.accountCollapsedGroups ||= {};
    state.settings.accountCollapsedGroups[type] = !state.settings.accountCollapsedGroups[type];
    await encryptState();
    renderAccountWorkspace();
  }

  async function moveAccountGroup(type, direction) {
    const order = state.settings.accountCategoryOrder;
    const index = order.indexOf(type);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= order.length) return;
    [order[index], order[next]] = [order[next], order[index]];
    await persistAccountWorkspace("Urutan kategori akun diubah", ACCOUNT_TYPES[type]?.label || type);
  }

  async function moveAccountWithinGroup(id, direction) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    state.settings.accountSort = "manual";
    const order = state.settings.accountOrder;
    const sameTypeIds = order.filter((accountId) => state.accounts.find((item) => item.id === accountId)?.type === account.type);
    const localIndex = sameTypeIds.indexOf(id);
    const targetId = sameTypeIds[localIndex + direction];
    if (!targetId) return;
    const globalA = order.indexOf(id);
    const globalB = order.indexOf(targetId);
    [order[globalA], order[globalB]] = [order[globalB], order[globalA]];
    await persistAccountWorkspace("Urutan akun diubah", account.name);
  }

  async function toggleAccountPin(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    await commit(account.pinned ? "Akun dilepas dari favorit" : "Akun dijadikan favorit", account.name, () => { account.pinned = !account.pinned; });
  }

  async function toggleAccountArchive(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    const nextArchived = !account.archived;
    if (nextArchived && !confirm(`Arsipkan akun “${account.name}”? Transaksi lama tetap aman dan akun dapat dipulihkan.`)) return;
    await commit(nextArchived ? "Akun diarsipkan" : "Akun dipulihkan dari arsip", account.name, () => { account.archived = nextArchived; });
  }

  async function resetAccountLayout() {
    if (!confirm("Kembalikan urutan kategori dan akun ke susunan awal?")) return;
    state.settings.accountCategoryOrder = Object.keys(ACCOUNT_TYPES);
    state.settings.accountOrder = financialItems(state.accounts).map((account) => account.id);
    state.settings.accountSort = "manual";
    state.settings.accountCollapsedGroups = {};
    accountTypeFilter = "all";
    accountSearchQuery = "";
    await persistAccountWorkspace("Tata letak akun direset", "Urutan kategori dan akun dikembalikan.");
  }

  async function duplicateAccountConfiguration(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    const copy = deepClone(account);
    copy.id = proId("account");
    copy.name = `${account.name} Salinan`;
    copy.openingBalance = 0;
    copy.pinned = false;
    copy.archived = false;
    await commit("Konfigurasi akun diduplikasi", copy.name, () => {
      state.accounts.push(copy);
      state.settings.accountOrder.push(copy.id);
    });
    showToast("Akun salinan dibuat dengan saldo awal 0.", "⧉");
  }

  function accountPeriodMetrics(account, days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    return state.transactions.reduce((result, tx) => {
      if (tx.status === "cancelled" || new Date(`${tx.date}T00:00:00`) < start) return result;
      if (tx.type === "transfer") {
        if (tx.accountId === account.id) result.out += convertCurrency(safeNumber(tx.amount) + safeNumber(tx.fee), account.currency, state.settings.baseCurrency) ?? 0;
        if (tx.destinationAccountId === account.id) result.in += convertCurrency(safeNumber(tx.destinationAmount || tx.amount), account.currency, state.settings.baseCurrency) ?? 0;
      } else if (tx.accountId === account.id) {
        const value = transactionBaseValue(tx);
        if (tx.type === "income") result.in += value;
        if (tx.type === "expense") result.out += value;
      }
      return result;
    }, { in: 0, out: 0 });
  }

  function openAccountDetails(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    const balance = accountBalance(account);
    const converted = accountValueInBase(account);
    const metrics = accountPeriodMetrics(account);
    const recent = state.transactions
      .filter((tx) => tx.accountId === id || tx.destinationAccountId === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    showModal(`Detail ${account.name}`, `${ACCOUNT_TYPES[account.type]?.label || account.type} · ${account.currency}`, `
      <div class="account-detail-kpis">
        <div class="pro-kpi"><span>Saldo saat ini</span><strong class="money">${formatCurrency(balance, account.currency)}</strong><small>≈ ${formatCurrency(converted)}</small></div>
        <div class="pro-kpi"><span>Masuk 30 hari</span><strong class="positive money">${formatCurrency(metrics.in)}</strong></div>
        <div class="pro-kpi"><span>Keluar 30 hari</span><strong class="negative money">${formatCurrency(metrics.out)}</strong></div>
      </div>
      <div class="account-detail-actions">
        <button class="button primary" data-edit-account="${id}" type="button">✏️ Edit Akun</button>
        <button class="button secondary" data-reconcile-account="${id}" type="button">✓ Rekonsiliasi</button>
        <button class="button secondary" data-pro-action="account-duplicate" data-pro-id="${id}" type="button">⧉ Duplikat Konfigurasi</button>
        <button class="button secondary" data-pro-action="account-export" data-pro-id="${id}" type="button">↓ Ekspor CSV</button>
      </div>
      <h4 style="margin:22px 0 10px">Transaksi Terbaru</h4>
      <div class="simple-list">${recent.length ? recent.map((tx) => `<div class="simple-item"><span><strong>${escapeHTML(tx.description)}</strong>${formatDate(tx.date)} · ${escapeHTML(tx.category)}</span><strong class="money ${tx.type === "income" ? "positive" : tx.type === "expense" ? "negative" : ""}">${tx.type === "income" ? "+" : tx.type === "expense" ? "−" : "↔ "}${formatCurrency(tx.amount, tx.currency)}</strong></div>`).join("") : '<div class="pro-empty"><div><strong>Belum ada transaksi</strong>Transaksi akun ini akan muncul di sini.</div></div>'}</div>`);
  }

  function exportAccountTransactions(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    const rows = state.transactions
      .filter((tx) => tx.accountId === id || tx.destinationAccountId === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [
      ["Tanggal", "Jenis", "Deskripsi", "Merchant", "Kategori", "Nominal", "Mata Uang", "Status", "Tags"].map(quote).join(","),
      ...rows.map((tx) => [tx.date, tx.type, tx.description, tx.merchant, tx.category, tx.amount, tx.currency, tx.status, (tx.tags || []).join("|")].map(quote).join(","))
    ].join("\r\n");
    downloadBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `${account.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "akun"}-${localISO()}.csv`);
    showToast("Riwayat akun diekspor ke CSV.", "↓");
  }

  document.addEventListener("dragstart", (event) => {
    if (!accountArrangeMode) return;
    const card = event.target.closest("[data-account-drag-id]");
    if (card) {
      draggedAccountId = card.dataset.accountDragId;
      draggedAccountType = card.dataset.accountType;
      event.dataTransfer.effectAllowed = "move";
      card.classList.add("is-dragging");
      return;
    }
    const group = event.target.closest("[data-account-group-drag]");
    if (group) {
      draggedAccountGroup = group.dataset.accountGroupDrag;
      event.dataTransfer.effectAllowed = "move";
      group.classList.add("is-dragging");
    }
  });

  document.addEventListener("dragend", () => {
    document.querySelectorAll(".is-dragging").forEach((element) => element.classList.remove("is-dragging"));
  });

  document.addEventListener("dragover", (event) => {
    if (!accountArrangeMode) return;
    if (event.target.closest("[data-account-drag-id], [data-account-group], [data-account-group-drop]")) event.preventDefault();
  });

  document.addEventListener("drop", async (event) => {
    if (!accountArrangeMode) return;
    const targetCard = event.target.closest("[data-account-drag-id]");
    const targetGroup = event.target.closest("[data-account-group]");
    const targetGroupType = targetCard?.dataset.accountType || event.target.closest("[data-account-group-drop]")?.dataset.accountGroupDrop;

    if (draggedAccountId && targetGroupType) {
      event.preventDefault();
      if (targetGroupType !== draggedAccountType) {
        showToast("Untuk memindahkan akun ke kategori lain, gunakan tombol Edit dan ubah Jenis Akun.", "ℹ️");
      } else {
        state.settings.accountSort = "manual";
        const order = state.settings.accountOrder;
        const from = order.indexOf(draggedAccountId);
        let to = targetCard ? order.indexOf(targetCard.dataset.accountDragId) : order.length;
        if (from >= 0 && to >= 0 && from !== to) {
          const [moved] = order.splice(from, 1);
          if (from < to) to -= 1;
          order.splice(to, 0, moved);
          await persistAccountWorkspace("Urutan akun diubah", state.accounts.find((item) => item.id === draggedAccountId)?.name || draggedAccountId);
        }
      }
      draggedAccountId = null;
      draggedAccountType = null;
      return;
    }

    if (draggedAccountGroup && targetGroup) {
      event.preventDefault();
      const targetType = targetGroup.dataset.accountGroup;
      const order = state.settings.accountCategoryOrder;
      const from = order.indexOf(draggedAccountGroup);
      let to = order.indexOf(targetType);
      if (from >= 0 && to >= 0 && from !== to) {
        const [moved] = order.splice(from, 1);
        if (from < to) to -= 1;
        order.splice(to, 0, moved);
        await persistAccountWorkspace("Urutan kategori akun diubah", ACCOUNT_TYPES[draggedAccountGroup]?.label || draggedAccountGroup);
      }
      draggedAccountGroup = null;
    }
  });

  const baseTotalAssets = totalAssets;
  totalAssets = function proTotalAssets() {
    return baseTotalAssets() + (state?.investments ? totalInvestmentValue() : 0);
  };

  const baseRenderAll = renderAll;
  renderAll = function proRenderAllWrapper() {
    if (state) ensureProState();
    baseRenderAll();
    renderProAll();
  };

  const baseRenderTransactions = renderTransactions;
  renderTransactions = function proRenderTransactionsWrapper() {
    baseRenderTransactions();
    renderProTransactions();
  };

  const baseOpenTransactionForm = openTransactionForm;
  openTransactionForm = function proOpenTransactionForm(existing = null, prefill = {}) {
    editingTransactionId = existing?.id || null;
    baseOpenTransactionForm(existing, prefill);
    window.setTimeout(() => enhanceTransactionForm(existing), 0);
  };

  function enhanceRecurringReminderForm(existing) {
    const form = document.getElementById("recurringForm");
    const grid = form?.querySelector(".form-grid");
    if (!form || !grid) return;
    const item = existing || {};
    grid.insertAdjacentHTML("beforeend", `
      <div class="field full recurring-reminder-box">
        <span>🔔 Pengingat tagihan</span>
        <label class="simple-item"><span>Aktifkan pengingat untuk tagihan ini</span><input id="recurringReminderEnabled" type="checkbox" ${item.reminderEnabled !== false ? "checked" : ""} /></label>
        <label class="simple-item"><span>Peringatkan jika saldo akun kurang</span><input id="recurringLowBalanceReminder" type="checkbox" ${item.lowBalanceReminder !== false ? "checked" : ""} /></label>
        <label class="field"><span>Hari pengingat khusus (kosong = mengikuti pengaturan umum)</span><input class="input" id="recurringReminderDays" value="${escapeHTML(Array.isArray(item.reminderDays) ? item.reminderDays.join(", ") : "")}" placeholder="Contoh: 14, 7, 3, 1, 0" /></label>
      </div>`);
    form.addEventListener("submit", () => {
      pendingRecurringReminderExtras = {
        editingId: existing?.id || null,
        reminderEnabled: document.getElementById("recurringReminderEnabled")?.checked !== false,
        lowBalanceReminder: document.getElementById("recurringLowBalanceReminder")?.checked !== false,
        reminderDays: parseReminderDays(document.getElementById("recurringReminderDays")?.value || "")
      };
    }, { capture: true });
  }

  const baseOpenRecurringForm = openRecurringForm;
  openRecurringForm = function proOpenRecurringForm(existing = null) {
    baseOpenRecurringForm(existing);
    window.setTimeout(() => enhanceRecurringReminderForm(existing), 0);
  };

  const baseCommit = commit;
  commit = async function proCommit(action, detail, mutator) {
    const extras = pendingTransactionExtras;
    pendingTransactionExtras = null;
    const recurringExtras = pendingRecurringReminderExtras;
    pendingRecurringReminderExtras = null;
    const beforeIds = new Set(state.transactions.map((tx) => tx.id));
    const beforeRecurringIds = new Set((state.recurring || []).map((item) => item.id));
    let targetTransaction = null;
    const wrappedMutator = () => {
      mutator();
      const newlyCreatedTransactions = state.transactions.filter((tx) => !beforeIds.has(tx.id));
      newlyCreatedTransactions.forEach(applySharedApproval);
      if (recurringExtras && /Pembayaran rutin/i.test(action)) {
        const targetRecurring = recurringExtras.editingId
          ? state.recurring.find((item) => item.id === recurringExtras.editingId)
          : state.recurring.find((item) => !beforeRecurringIds.has(item.id)) || state.recurring.at(-1);
        if (targetRecurring) {
          targetRecurring.reminderEnabled = recurringExtras.reminderEnabled;
          targetRecurring.lowBalanceReminder = recurringExtras.lowBalanceReminder;
          targetRecurring.reminderDays = recurringExtras.reminderDays.length ? recurringExtras.reminderDays : null;
          targetRecurring.snoozedUntil = null;
        }
      }
      if (extras && /Transaksi|Refund|Pembayaran|Pendapatan|rutin/i.test(action)) {
        targetTransaction = extras.editingId
          ? state.transactions.find((tx) => tx.id === extras.editingId)
          : state.transactions.find((tx) => !beforeIds.has(tx.id)) || state.transactions.at(-1);
        if (targetTransaction) {
          targetTransaction.location = extras.location || targetTransaction.location || "";
          targetTransaction.templateId = extras.templateId || targetTransaction.templateId || null;
          applySharedApproval(targetTransaction);
        }
      }
    };
    await baseCommit(action, detail, wrappedMutator);
    if (extras?.extraFiles?.length && targetTransaction) {
      for (const file of extras.extraFiles) {
        const attachmentId = await saveEncryptedAttachment(file);
        targetTransaction.attachmentIds ||= [];
        targetTransaction.attachmentIds.push(attachmentId);
      }
      await encryptState();
      renderAll();
    }
    if (state?.settings?.autoBackup) createVaultSnapshot(`Sebelum/sesudah: ${action}`);
    if (!navigator.onLine && cloudSession?.user) queueSync(`${action} menunggu internet.`);
    processDueNotifications().catch(console.error);
  };

  const baseEncryptState = encryptState;
  encryptState = async function proEncryptStateWrapper() {
    await baseEncryptState();
    if (!navigator.onLine && cloudSession?.user) queueSync("Perubahan lokal menunggu internet.");
  };

  const baseCloudPush = cloudPush;
  cloudPush = async function proCloudPushWrapper(options = {}) {
    if (!navigator.onLine) {
      queueSync("Upload cloud menunggu internet.");
      if (!options.silent) showToast("Offline: perubahan dimasukkan ke antrean.", "⚠️");
      return;
    }
    try {
      pushSyncLog("Mengunggah brankas terenkripsi...", "syncing");
      const result = await baseCloudPush(options);
      if (result === false) {
        renderProCloud();
        return false;
      }
      if (result === "pulled") {
        clearSyncQueue();
        pushSyncLog(`Cloud terbaru v${safeNumber(vault?.cloud?.version)} diterapkan otomatis.`, "online");
        createVaultSnapshot("Setelah memakai cloud terbaru", true);
        renderProCloud();
        return result;
      }
      clearSyncQueue();
      pushSyncLog(`Brankas tersinkron pada versi ${safeNumber(vault?.cloud?.version)}.`, "online");
      createVaultSnapshot("Setelah cloud sync", true);
      await uploadCloudVersionSnapshot();
      if (state?.settings?.syncAttachments && !options.silent) {
        syncAttachmentsToCloud(true).catch((error) => {
          recordProError(error, "attachment-auto-upload");
          const status = document.getElementById("proAttachmentStatus");
          if (status) status.textContent = error.message;
        });
      }
      renderProCloud();
      return result;
    } catch (error) {
      queueSync(`Upload gagal: ${error.message}`);
      pushSyncLog(`Upload gagal: ${error.message}`, "error");
      throw error;
    }
  };

  const baseCloudPull = cloudPull;
  cloudPull = async function proCloudPullWrapper(options = {}) {
    createVaultSnapshot("Sebelum download cloud", true);
    try {
      pushSyncLog("Mengunduh brankas cloud...", "syncing");
      const result = await baseCloudPull(options);
      ensureProState();
      pushSyncLog(`Versi cloud ${safeNumber(vault?.cloud?.version)} digunakan.`, "online");
      if (state?.settings?.syncAttachments) syncAttachmentsFromCloud(true).catch((error) => recordProError(error, "attachment-auto-download"));
      renderAll();
      return result;
    } catch (error) {
      pushSyncLog(`Download gagal: ${error.message}`, "error");
      throw error;
    }
  };

  const baseCloudLogout = cloudLogout;
  cloudLogout = async function proCloudLogoutWrapper() {
    stopRealtimeSync();
    await baseCloudLogout();
    renderProCloud();
    updateOnlineStatus();
  };

  const baseUnlockApplication = unlockApplication;
  unlockApplication = function proUnlockApplicationWrapper() {
    ensureProState();
    baseUnlockApplication();
    const currentDevice = state.security.devices.find((item) => item.id === currentDeviceId());
    if (currentDevice) {
      currentDevice.lastSeenAt = nowIso();
      currentDevice.generation = state.security.sessionGeneration;
      currentDevice.revoked = false;
    }
    startProPolling();
    processRecurringSchedules().catch((error) => recordProError(error, "recurring-auto-post"));
    retryQueuedSync();
    processDueNotifications().catch(console.error);
    maybeShowBillReminderPopup().catch(console.error);
  };

  const baseLockApplication = lockApplication;
  lockApplication = function proLockApplicationWrapper(message = "") {
    clearInterval(proPollTimer);
    stopRealtimeSync();
    baseLockApplication(message);
  };

  const baseRenderSettings = renderSettings;
  renderSettings = function proRenderSettingsWrapper() {
    baseRenderSettings();
    renderProSettings();
    renderProCloud();
    updateReminderBadge();
  };

  const baseChangeSection = changeSection;
  changeSection = function proChangeSectionWrapper(sectionId) {
    baseChangeSection(sectionId);
    if (sectionId === "investments") requestAnimationFrame(renderInvestmentChart);
    if (sectionId === "dashboard") requestAnimationFrame(renderProDashboardCharts);
  };

  injectProUI();
  renderLoginGuard();

  window.setInterval(() => {
    renderLoginGuard();
    updateOnlineStatus();
  }, 1000);
})();
