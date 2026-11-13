"use strict";

(() => {
  const VERSION = 10;
  const VERSION_LABEL = "v10.0 — Production Update";
  const PUSH_TABLE = "charisna_push_subscriptions";
  const SCHEDULE_TABLE = "charisna_bill_reminder_schedules";
  const DELIVERY_TABLE = "charisna_push_delivery_log";
  const SYNC_QUEUE_KEY = "charisna-v8-sync-queue";
  let systemTab = "update";
  let latestHealthResults = [];
  let latestQualityReport = null;
  let waitingServiceWorker = null;
  let pendingRecurringV10 = null;
  let controllerReloadBound = false;

  const safeNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const v10Id = (prefix) => `${prefix}-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}`;
  const nowIso = () => new Date().toISOString();

  function ensureV10State() {
    if (!state) return false;
    let changed = false;
    const assign = (object, key, value) => {
      if (object[key] === undefined) {
        object[key] = value;
        changed = true;
      }
    };

    assign(state, "appVersion", VERSION);
    state.appVersion = Math.max(safeNumber(state.appVersion), VERSION);
    state.settings ||= {};
    assign(state.settings, "vapidPublicKey", "");
    assign(state.settings, "pushEnabled", false);
    assign(state.settings, "pushPrivacyMode", "generic");
    assign(state.settings, "pushNotificationTime", "08:00");
    assign(state.settings, "pushTimezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta");
    assign(state.settings, "autoSyncPushSchedules", true);
    assign(state.settings, "lastPushScheduleSync", null);
    assign(state.settings, "lastHealthCheck", null);
    assign(state.settings, "lastDataCleanup", null);
    assign(state.settings, "migrationHistory", []);
    assign(state.settings, "excelIncludeAudit", true);
    assign(state.settings, "excelIncludeRawIds", false);

    if (!state.settings.migrationHistory.some((item) => item.version === VERSION)) {
      state.settings.migrationHistory.unshift({
        version: VERSION,
        label: VERSION_LABEL,
        migratedAt: nowIso(),
        status: "success"
      });
      state.settings.migrationHistory = state.settings.migrationHistory.slice(0, 20);
      changed = true;
    }

    (state.recurring || []).forEach((item) => {
      if (!Array.isArray(item.priceHistory)) {
        item.priceHistory = [{ amount: safeNumber(item.amount), currency: item.currency || state.settings.baseCurrency, effectiveDate: item.createdAt || nowIso(), note: "Harga awal" }];
        changed = true;
      }
      if (item.usageLevel === undefined) { item.usageLevel = "unknown"; changed = true; }
      if (item.cancelCandidate === undefined) { item.cancelCandidate = false; changed = true; }
      if (item.cardExpiry === undefined) { item.cardExpiry = ""; changed = true; }
      if (item.priceNote === undefined) { item.priceNote = ""; changed = true; }
      if (item.lastUsedDate === undefined) { item.lastUsedDate = ""; changed = true; }
    });
    return changed;
  }

  function injectV10UI() {
    SECTION_COPY.system = ["System", "Pembaruan, kesehatan aplikasi, push notification, dan perawatan data."];
    const nav = document.querySelector(".navigation");
    const updatesNav = nav?.querySelector('[data-section="updates"]');
    if (nav && updatesNav && !nav.querySelector('[data-section="system"]')) {
      updatesNav.insertAdjacentHTML("beforebegin", '<button class="nav-button" data-section="system"><span>🛠️</span>System</button>');
    }

    const updatesSection = document.getElementById("updates");
    if (updatesSection && !document.getElementById("system")) {
      updatesSection.insertAdjacentHTML("beforebegin", systemSectionHtml());
    }

    const subscriptionSummary = document.getElementById("v9SubscriptionSummary");
    if (subscriptionSummary && !document.getElementById("v10SubscriptionIntelligence")) {
      subscriptionSummary.insertAdjacentHTML("afterend", '<div class="v10-intelligence" id="v10SubscriptionIntelligence"></div>');
    }

    replaceExcelExportButton();
    bindV10Events();
    monitorServiceWorkerUpdates();
  }

  function systemSectionHtml() {
    return `
      <section class="section" id="system">
        <header class="section-header">
          <div><h3>System & Data Center</h3><p>Kelola pembaruan, notifikasi latar belakang, kesehatan aplikasi, dan kualitas data.</p></div>
          <div class="toolbar"><span class="version-badge">${VERSION_LABEL}</span><button class="button secondary" id="v10RunAllChecks" type="button">⟳ Periksa Semua</button></div>
        </header>

        <article class="v10-hero">
          <span class="v10-kicker">PRODUCTION UPDATE</span>
          <h3>CHARISNA kini lebih siap dipakai setiap hari.</h3>
          <p>Versi ini memusatkan stabilitas PWA, diagnosa sistem, perawatan data, reminder push, analisis langganan, dan laporan Excel profesional.</p>
        </article>

        <div class="v10-tabs" style="margin-top:18px">
          <button class="v10-tab active" data-v10-tab="update" type="button">⬆ Update Center</button>
          <button class="v10-tab" data-v10-tab="health" type="button">🩺 System Health</button>
          <button class="v10-tab" data-v10-tab="push" type="button">🔔 Push Reminder</button>
          <button class="v10-tab" data-v10-tab="cleanup" type="button">🧹 Smart Cleanup</button>
          <button class="v10-tab" data-v10-tab="excel" type="button">📗 Excel Profesional</button>
        </div>

        <div class="v10-tab-panel active" id="v10PanelUpdate"></div>
        <div class="v10-tab-panel" id="v10PanelHealth"></div>
        <div class="v10-tab-panel" id="v10PanelPush"></div>
        <div class="v10-tab-panel" id="v10PanelCleanup"></div>
        <div class="v10-tab-panel" id="v10PanelExcel"></div>
      </section>
    `;
  }

  function replaceExcelExportButton() {
    const oldButton = document.getElementById("exportExcelButton");
    if (!oldButton || oldButton.dataset.v10Professional === "true") return;
    const button = oldButton.cloneNode(true);
    button.dataset.v10Professional = "true";
    button.textContent = "📗 Excel Profesional";
    oldButton.replaceWith(button);
    button.addEventListener("click", () => exportProfessionalExcel().catch(handleV10Error));
  }

  function renderSystemCenter() {
    if (!state || !document.getElementById("system")) return;
    renderUpdateCenter();
    renderHealthCenter();
    renderPushCenter();
    renderCleanupCenter();
    renderExcelCenter();
    setSystemTab(systemTab);
  }

  function renderUpdateCenter() {
    const container = document.getElementById("v10PanelUpdate");
    if (!container) return;
    const migrations = state.settings.migrationHistory || [];
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    const swStatus = waitingServiceWorker ? "Pembaruan siap dipasang" : (navigator.serviceWorker?.controller ? "Service worker aktif" : "Belum dikontrol service worker");
    container.innerHTML = `
      <div class="v10-grid">
        <article class="panel v10-span-8">
          <header class="panel-header"><div><h4>Update Center</h4><p>Pembaruan aman dengan backup sebelum reload dan kontrol cache.</p></div></header>
          <div class="v10-update-banner">
            <div><strong>${waitingServiceWorker ? "Versi baru siap dipasang" : "Aplikasi menggunakan v10"}</strong><p>${swStatus}. Cache: charisna-money-management-v10-production.</p></div>
            <div class="button-grid"><button class="button secondary" id="v10CheckUpdate" type="button">Periksa Update</button><button class="button primary" id="v10InstallUpdate" type="button" ${waitingServiceWorker ? "" : "disabled"}>Backup & Perbarui</button></div>
          </div>
          <div class="button-grid" style="margin-top:15px">
            <button class="button secondary" id="v10BackupNow" type="button">🔐 Backup Sekarang</button>
            <button class="button secondary" id="v10ClearCaches" type="button">🧹 Hapus Cache Lama</button>
            <button class="button secondary" id="v10ReloadApp" type="button">↻ Muat Ulang</button>
          </div>
          <p class="muted" style="margin-top:13px">Rollback kode dilakukan dari Netlify → Deploys → pilih deploy sebelumnya → Publish deploy. Data dapat dipulihkan melalui backup terenkripsi.</p>
        </article>
        <article class="panel v10-span-4">
          <header class="panel-header"><div><h4>Status Versi</h4><p>Ringkasan shell dan data.</p></div></header>
          <div class="v10-stat-grid" style="grid-template-columns:1fr 1fr">
            <div class="v10-stat"><span>Aplikasi</span><strong>v10</strong><small>Production Update</small></div>
            <div class="v10-stat"><span>Data</span><strong>v${safeNumber(state.appVersion)}</strong><small>Migrasi kompatibel</small></div>
            <div class="v10-stat"><span>Cloud queue</span><strong>${queue ? "1" : "0"}</strong><small>${queue ? "menunggu" : "bersih"}</small></div>
            <div class="v10-stat"><span>Mode</span><strong>${location.protocol === "https:" ? "HTTPS" : "LOCAL"}</strong><small>${navigator.onLine ? "online" : "offline"}</small></div>
          </div>
        </article>
        <article class="panel v10-span-12">
          <header class="panel-header"><div><h4>Riwayat Migrasi</h4><p>Perubahan struktur data yang sudah diterapkan.</p></div></header>
          <div class="v10-migration-list">${migrations.length ? migrations.map((item) => `<div class="v10-migration"><span><strong>v${item.version}</strong> · ${escapeHTML(item.label || "Migrasi")}</span><span class="v10-badge good">${formatDateTime(item.migratedAt)}</span></div>`).join("") : '<p class="muted">Belum ada riwayat migrasi.</p>'}</div>
        </article>
      </div>`;
  }

  function renderHealthCenter() {
    const container = document.getElementById("v10PanelHealth");
    if (!container) return;
    container.innerHTML = `
      <div class="v10-grid">
        <article class="panel v10-span-8">
          <header class="panel-header"><div><h4>System Health</h4><p>Memeriksa browser, PWA, cloud, storage, notifikasi, dan integritas data.</p></div><button class="button primary" id="v10RunHealth" type="button">Jalankan Pemeriksaan</button></header>
          <div class="v10-status-list" id="v10HealthResults">${latestHealthResults.length ? healthResultsHtml(latestHealthResults) : '<div class="muted">Tekan “Jalankan Pemeriksaan” untuk memulai diagnosis.</div>'}</div>
        </article>
        <article class="panel v10-span-4">
          <header class="panel-header"><div><h4>Tindakan Cepat</h4><p>Perbaikan yang aman dijalankan.</p></div></header>
          <div class="form-stack">
            <button class="button secondary" id="v10RetrySync" type="button">☁️ Coba Sinkronisasi</button>
            <button class="button secondary" id="v10RequestNotification" type="button">🔔 Periksa Izin Notifikasi</button>
            <button class="button secondary" id="v10OpenCleanup" type="button">🧹 Analisis Data</button>
            <button class="button secondary" id="v10ExportDiagnostic" type="button">↓ Export Diagnostik</button>
          </div>
        </article>
      </div>`;
  }

  function renderPushCenter() {
    const container = document.getElementById("v10PanelPush");
    if (!container) return;
    const configured = Boolean(state.settings.vapidPublicKey);
    const permission = "Notification" in window ? Notification.permission : "unsupported";
    container.innerHTML = `
      <div class="v10-grid">
        <article class="panel v10-span-8">
          <header class="panel-header"><div><h4>Push Reminder Saat Aplikasi Ditutup</h4><p>Pengingat dapat muncul di tablet/HP melalui service worker dan Supabase Edge Function.</p></div><span class="v10-badge ${state.settings.pushEnabled ? "good" : "warn"}">${state.settings.pushEnabled ? "AKTIF" : "BELUM AKTIF"}</span></header>
          <div class="v10-push-banner">
            <div><strong>${permission === "granted" ? "Izin browser sudah diberikan" : "Izin notifikasi perlu diberikan"}</strong><p>Mode default bersifat privat: server hanya menerima jadwal generik. Mode detail dapat menyertakan nama dan nominal tagihan.</p></div>
            <button class="button primary" id="v10EnablePush" type="button">Aktifkan Push</button>
          </div>
          <form class="form-stack" id="v10PushSettings" style="margin-top:17px">
            <label class="field"><span>VAPID public key</span><input class="input" id="v10VapidPublicKey" value="${escapeHTML(state.settings.vapidPublicKey || "")}" placeholder="Salin dari VAPID-KEY-GENERATOR.html" /></label>
            <div class="form-grid">
              <label class="field"><span>Jam notifikasi</span><input class="input" id="v10PushTime" type="time" value="${escapeHTML(state.settings.pushNotificationTime || "08:00")}" /></label>
              <label class="field"><span>Zona waktu</span><input class="input" id="v10PushTimezone" value="${escapeHTML(state.settings.pushTimezone || "Asia/Jakarta")}" /></label>
              <label class="field"><span>Privasi isi notifikasi</span><select class="input" id="v10PushPrivacy"><option value="generic" ${state.settings.pushPrivacyMode === "generic" ? "selected" : ""}>Generik — paling privat</option><option value="detailed" ${state.settings.pushPrivacyMode === "detailed" ? "selected" : ""}>Detail nama & nominal</option></select></label>
              <label class="field"><span>Sinkronisasi jadwal otomatis</span><select class="input" id="v10PushAutoSync"><option value="yes" ${state.settings.autoSyncPushSchedules ? "selected" : ""}>Aktif</option><option value="no" ${!state.settings.autoSyncPushSchedules ? "selected" : ""}>Nonaktif</option></select></label>
            </div>
            <button class="button secondary" type="submit">Simpan Pengaturan</button>
          </form>
          <div class="button-grid" style="margin-top:14px"><button class="button secondary" id="v10SyncPushSchedules" type="button">↻ Sinkronkan Jadwal</button><button class="button secondary" id="v10TestPush" type="button">Kirim Notifikasi Tes</button><button class="button danger" id="v10DisablePush" type="button">Nonaktifkan Perangkat Ini</button></div>
        </article>
        <article class="panel v10-span-4">
          <header class="panel-header"><div><h4>Status Backend</h4><p>Komponen yang diperlukan agar push berjalan.</p></div></header>
          <div class="v10-status-list">
            ${pushRequirementRow("Service worker", "serviceWorker" in navigator, "PWA worker")}
            ${pushRequirementRow("PushManager", "PushManager" in window, "Dukungan browser")}
            ${pushRequirementRow("Izin notifikasi", permission === "granted", permission)}
            ${pushRequirementRow("VAPID key", configured, configured ? "tersimpan" : "belum diisi")}
            ${pushRequirementRow("Login cloud", Boolean(cloudSession?.user), cloudSession?.user?.email || "belum login")}
          </div>
          <p class="v10-form-note" style="margin-top:13px">Jalankan <strong>SUPABASE-SETUP-V10.sql</strong> dan deploy Edge Function di folder <strong>supabase/functions/send-bill-reminders</strong>. Tanpa langkah backend tersebut, popup saat aplikasi dibuka tetap bekerja, tetapi push saat aplikasi tertutup belum dapat dikirim.</p>
        </article>
      </div>`;
  }

  function pushRequirementRow(label, good, detail) {
    return `<div class="v10-status-row ${good ? "good" : "warn"}"><span class="v10-status-icon">${good ? "✓" : "!"}</span><span><strong>${escapeHTML(label)}</strong><p>${escapeHTML(detail)}</p></span><span class="v10-status-chip">${good ? "OK" : "CEK"}</span></div>`;
  }

  function renderCleanupCenter() {
    const container = document.getElementById("v10PanelCleanup");
    if (!container) return;
    container.innerHTML = `
      <div class="v10-grid">
        <article class="panel v10-span-8">
          <header class="panel-header"><div><h4>Smart Cleanup & Data Quality</h4><p>Deteksi duplikat, referensi rusak, split tidak cocok, kurs kosong, dan lampiran yatim.</p></div><button class="button primary" id="v10AnalyzeData" type="button">Analisis Sekarang</button></header>
          <div id="v10CleanupResults">${latestQualityReport ? cleanupReportHtml(latestQualityReport) : '<div class="muted">Belum ada hasil analisis.</div>'}</div>
        </article>
        <article class="panel v10-span-4">
          <header class="panel-header"><div><h4>Prinsip Perbaikan</h4><p>Tidak ada data yang dihapus diam-diam.</p></div></header>
          <div class="simple-list">
            <div class="insight-item"><strong>1. Preview dahulu</strong>Jumlah dan jenis masalah selalu ditampilkan.</div>
            <div class="insight-item"><strong>2. Backup otomatis</strong>Perbaikan berisiko memicu unduhan backup terenkripsi.</div>
            <div class="insight-item"><strong>3. Konfirmasi pengguna</strong>Duplikat dan lampiran yatim hanya dihapus setelah persetujuan.</div>
            <div class="insight-item"><strong>4. Audit log</strong>Perubahan tersimpan dalam riwayat aktivitas.</div>
          </div>
        </article>
      </div>`;
  }

  function renderExcelCenter() {
    const container = document.getElementById("v10PanelExcel");
    if (!container) return;
    container.innerHTML = `
      <div class="v10-grid">
        <article class="panel v10-span-8">
          <header class="panel-header"><div><h4>Excel Profesional</h4><p>Workbook siap dibaca dengan dashboard, header berformat, filter, freeze pane, dan nomor keuangan.</p></div><button class="button primary" id="v10ExportExcel" type="button">📗 Buat Excel</button></header>
          <div class="v10-excel-preview">
            ${excelSheetPreview("Dashboard", "KPI, arus kas 6 bulan, top kategori, metadata laporan")}
            ${excelSheetPreview("Transaksi", "Filter tabel, status, kategori, akun, nilai dasar")}
            ${excelSheetPreview("Akun", "Saldo asli, saldo mata uang utama, aset/kewajiban")}
            ${excelSheetPreview("Budget & Goals", "Progress, sisa budget, target dan kebutuhan bulanan")}
            ${excelSheetPreview("Langganan", "Biaya bulanan/tahunan, trial, penggunaan, riwayat harga")}
            ${excelSheetPreview("Utang & Investasi", "Sisa kewajiban, bunga, nilai portofolio, return")}
          </div>
        </article>
        <article class="panel v10-span-4">
          <header class="panel-header"><div><h4>Opsi Ekspor</h4><p>Pilih detail yang disertakan.</p></div></header>
          <form class="form-stack" id="v10ExcelSettings">
            <label class="simple-item"><span>Sertakan audit log</span><input id="v10ExcelAudit" type="checkbox" ${state.settings.excelIncludeAudit ? "checked" : ""} /></label>
            <label class="simple-item"><span>Sertakan ID teknis</span><input id="v10ExcelRawIds" type="checkbox" ${state.settings.excelIncludeRawIds ? "checked" : ""} /></label>
            <button class="button secondary" type="submit">Simpan Opsi</button>
          </form>
          <p class="muted" style="margin-top:13px">File dibuat sepenuhnya di browser. Data tidak dikirim ke layanan Excel eksternal.</p>
        </article>
      </div>`;
  }

  function excelSheetPreview(name, description) {
    return `<div class="v10-excel-sheet"><strong>📄 ${escapeHTML(name)}</strong>${escapeHTML(description)}</div>`;
  }

  function setSystemTab(tab) {
    systemTab = tab;
    document.querySelectorAll("[data-v10-tab]").forEach((button) => button.classList.toggle("active", button.dataset.v10Tab === tab));
    const map = { update: "v10PanelUpdate", health: "v10PanelHealth", push: "v10PanelPush", cleanup: "v10PanelCleanup", excel: "v10PanelExcel" };
    Object.entries(map).forEach(([key, id]) => document.getElementById(id)?.classList.toggle("active", key === tab));
  }

  async function runHealthChecks() {
    const results = [];
    const add = (label, status, detail, icon = "•") => results.push({ label, status, detail, icon });
    add("Koneksi internet", navigator.onLine ? "good" : "bad", navigator.onLine ? "Perangkat online" : "Perangkat offline", "🌐");
    add("Secure context", window.isSecureContext ? "good" : "warn", window.isSecureContext ? "HTTPS/localhost aktif" : "Beberapa fitur keamanan dibatasi", "🔒");
    add("Service worker", navigator.serviceWorker?.controller ? "good" : "warn", navigator.serviceWorker?.controller ? "Aplikasi dikontrol PWA worker" : "Reload mungkin diperlukan", "⚙️");
    add("Brankas lokal", localStorage.getItem(STORAGE_KEY) ? "good" : "bad", localStorage.getItem(STORAGE_KEY) ? "Vault terenkripsi ditemukan" : "Vault lokal tidak ditemukan", "🗄️");
    add("Notifikasi", "Notification" in window && Notification.permission === "granted" ? "good" : "warn", "Notification" in window ? Notification.permission : "Tidak didukung", "🔔");
    add("Push background", "PushManager" in window ? "good" : "warn", "PushManager" in window ? "Browser mendukung Web Push" : "Browser tidak mendukung Web Push", "📨");
    add("Cloud session", cloudSession?.user ? "good" : "warn", cloudSession?.user?.email || "Belum login cloud", "☁️");
    add("Antrean sinkronisasi", localStorage.getItem(SYNC_QUEUE_KEY) ? "warn" : "good", localStorage.getItem(SYNC_QUEUE_KEY) ? "Ada perubahan yang menunggu" : "Tidak ada antrean", "↻");

    try {
      const db = await openAttachmentDatabase();
      db.close();
      add("Database lampiran", "good", "IndexedDB dapat dibuka", "📎");
    } catch (error) {
      add("Database lampiran", "bad", error.message || "Gagal membuka IndexedDB", "📎");
    }

    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      const used = safeNumber(estimate.usage);
      const quota = safeNumber(estimate.quota);
      const percent = quota ? used / quota * 100 : 0;
      add("Penyimpanan browser", percent < 80 ? "good" : "warn", `${formatBytes(used)} dari ${formatBytes(quota)} (${percent.toFixed(1)}%)`, "💾");
    }

    if (cloudSession?.user && supabaseClient && navigator.onLine) {
      try {
        const { error } = await supabaseClient.from(CLOUD_TABLE).select("version").eq("user_id", cloudSession.user.id).limit(1);
        add("Supabase & RLS", error ? "bad" : "good", error ? error.message : "Akses vault milik sendiri berhasil", "🛡️");
      } catch (error) {
        add("Supabase & RLS", "bad", error.message || "Tes cloud gagal", "🛡️");
      }
    }

    const report = await analyzeDataQuality(false);
    add("Integritas data", report.total === 0 ? "good" : (report.critical > 0 ? "bad" : "warn"), report.total === 0 ? "Tidak ditemukan masalah" : `${report.total} temuan (${report.critical} kritis)`, "🧩");
    latestHealthResults = results;
    state.settings.lastHealthCheck = nowIso();
    await encryptState();
    renderHealthCenter();
    return results;
  }

  function healthResultsHtml(results) {
    return results.map((item) => `<div class="v10-status-row ${item.status}"><span class="v10-status-icon">${item.icon}</span><span><strong>${escapeHTML(item.label)}</strong><p>${escapeHTML(item.detail)}</p></span><span class="v10-status-chip">${item.status === "good" ? "OK" : item.status === "bad" ? "GAGAL" : "CEK"}</span></div>`).join("");
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  async function analyzeDataQuality(updateUi = true) {
    const issues = [];
    const transactions = financialItems(state.transactions || []);
    const accounts = financialItems(state.accounts || []);
    const accountIds = new Set(accounts.map((item) => item.id));

    const duplicateMap = new Map();
    transactions.forEach((tx) => {
      const key = [tx.date, tx.accountId, tx.type, safeNumber(tx.amount).toFixed(4), String(tx.description || "").trim().toLowerCase()].join("|");
      if (!duplicateMap.has(key)) duplicateMap.set(key, []);
      duplicateMap.get(key).push(tx.id);
    });
    const duplicateIds = Array.from(duplicateMap.values()).flatMap((ids) => ids.slice(1));
    if (duplicateIds.length) issues.push(issue("duplicates", "Transaksi duplikat", duplicateIds.length, "warn", "Baris dengan tanggal, akun, jenis, nominal, dan nama yang sama.", duplicateIds));

    const orphanTx = transactions.filter((tx) => tx.accountId && !accountIds.has(tx.accountId)).map((tx) => tx.id);
    if (orphanTx.length) issues.push(issue("orphan-transactions", "Transaksi tanpa akun", orphanTx.length, "bad", "Referensi akun sudah tidak ditemukan.", orphanTx));

    const splitMismatch = transactions.filter((tx) => tx.splits?.length && Math.abs(tx.splits.reduce((sum, row) => sum + safeNumber(row.amount), 0) - safeNumber(tx.amount)) > 0.01).map((tx) => tx.id);
    if (splitMismatch.length) issues.push(issue("split-mismatch", "Split tidak seimbang", splitMismatch.length, "bad", "Jumlah split berbeda dari nominal transaksi.", splitMismatch));

    const overdue = financialItems(state.recurring || []).filter((item) => item.active && item.nextDate && new Date(`${item.nextDate}T00:00:00`) < new Date(`${localISO()}T00:00:00`)).map((item) => item.id);
    if (overdue.length) issues.push(issue("overdue-recurring", "Jadwal rutin terlambat", overdue.length, "warn", "Tanggal berikutnya sudah lewat dan belum diproses.", overdue));

    const currencies = new Set([state.settings.baseCurrency, ...accounts.map((item) => item.currency), ...financialItems(state.recurring || []).map((item) => item.currency)]);
    const missingRates = Array.from(currencies).filter((currency) => !rateFor(currency));
    if (missingRates.length) issues.push(issue("missing-rates", "Kurs belum tersedia", missingRates.length, "warn", missingRates.join(", "), missingRates));

    const subscriptionGroups = new Map();
    financialItems(state.recurring || []).filter((item) => item.type === "expense").forEach((item) => {
      const key = `${String(item.name || "").trim().toLowerCase()}|${String(item.provider || "").trim().toLowerCase()}`;
      if (!subscriptionGroups.has(key)) subscriptionGroups.set(key, []);
      subscriptionGroups.get(key).push(item.id);
    });
    const duplicateSubscriptions = Array.from(subscriptionGroups.values()).flatMap((ids) => ids.slice(1));
    if (duplicateSubscriptions.length) issues.push(issue("duplicate-subscriptions", "Langganan mirip", duplicateSubscriptions.length, "warn", "Nama dan provider yang sama ditemukan lebih dari sekali.", duplicateSubscriptions));

    const tagVariants = countTagVariants(transactions);
    if (tagVariants.count) issues.push(issue("tag-variants", "Tag tidak konsisten", tagVariants.count, "warn", tagVariants.detail, tagVariants.groups));

    const orphanAttachments = await findOrphanAttachmentIds();
    if (orphanAttachments.length) issues.push(issue("orphan-attachments", "Lampiran yatim", orphanAttachments.length, "warn", "File tidak lagi terhubung ke transaksi mana pun.", orphanAttachments));

    const report = {
      generatedAt: nowIso(),
      issues,
      total: issues.reduce((sum, item) => sum + item.count, 0),
      critical: issues.filter((item) => item.severity === "bad").reduce((sum, item) => sum + item.count, 0)
    };
    latestQualityReport = report;
    if (updateUi) renderCleanupCenter();
    return report;
  }

  function issue(type, title, count, severity, description, ids) {
    return { type, title, count, severity, description, ids };
  }

  function countTagVariants(transactions) {
    const canonical = new Map();
    const groups = new Map();
    transactions.forEach((tx) => (tx.tags || []).forEach((tag) => {
      const clean = String(tag).trim();
      const lower = clean.toLowerCase();
      if (!groups.has(lower)) groups.set(lower, new Set());
      groups.get(lower).add(clean);
      if (!canonical.has(lower)) canonical.set(lower, clean);
    }));
    const variants = Array.from(groups.entries()).filter(([, values]) => values.size > 1);
    return { count: variants.reduce((sum, [, values]) => sum + values.size - 1, 0), detail: variants.map(([key, values]) => `${key}: ${Array.from(values).join(" / ")}`).join("; ").slice(0, 240), groups: variants.map(([key]) => key) };
  }

  async function findOrphanAttachmentIds() {
    try {
      const db = await openAttachmentDatabase();
      const records = await new Promise((resolve, reject) => {
        const tx = db.transaction("attachments", "readonly");
        const request = tx.objectStore("attachments").getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
      db.close();
      const used = new Set((state.transactions || []).flatMap((tx) => tx.attachmentIds || []));
      return records.filter((record) => !used.has(record.id)).map((record) => record.id);
    } catch {
      return [];
    }
  }

  function cleanupReportHtml(report) {
    if (!report.issues.length) return '<div class="v10-alert" style="background:var(--green-soft);color:var(--green)">✓ Data bersih. Tidak ditemukan masalah yang perlu ditangani.</div>';
    return report.issues.map((item) => `<div class="v10-cleanup-card"><span class="v10-cleanup-count">${item.count}</span><span><h5>${escapeHTML(item.title)}</h5><p>${escapeHTML(item.description)}</p></span><button class="button ${item.severity === "bad" ? "danger" : "secondary"}" data-v10-fix="${item.type}" type="button">${cleanupActionLabel(item.type)}</button></div>`).join("");
  }

  function cleanupActionLabel(type) {
    return ({ duplicates: "Tinjau & Hapus", "orphan-transactions": "Pulihkan Akun", "split-mismatch": "Seimbangkan", "overdue-recurring": "Buka Langganan", "missing-rates": "Sinkronkan Kurs", "duplicate-subscriptions": "Jeda Salinan", "tag-variants": "Rapikan Tag", "orphan-attachments": "Hapus File" })[type] || "Perbaiki";
  }

  async function fixQualityIssue(type) {
    if (!latestQualityReport) await analyzeDataQuality(false);
    const item = latestQualityReport.issues.find((row) => row.type === type);
    if (!item) return;
    if (type === "overdue-recurring") { changeSection("subscriptions"); return; }
    if (type === "missing-rates") { await syncRates(); return; }

    const confirmed = confirm(`Perbaiki “${item.title}” (${item.count} temuan)?\n\nBackup terenkripsi akan diunduh terlebih dahulu.`);
    if (!confirmed) return;
    await exportEncryptedBackup();

    if (type === "duplicates") {
      await commit("Smart Cleanup", `${item.count} transaksi duplikat dihapus`, () => { const ids = new Set(item.ids); state.transactions = state.transactions.filter((tx) => !ids.has(tx.id)); });
    } else if (type === "orphan-transactions") {
      await commit("Smart Cleanup", `${item.count} transaksi dipulihkan`, () => {
        const ids = new Set(item.ids);
        const byCurrency = new Map();
        state.transactions.filter((tx) => ids.has(tx.id)).forEach((tx) => {
          const currency = tx.currency || state.settings.baseCurrency;
          if (!byCurrency.has(currency)) {
            let account = state.accounts.find((row) => row.profileId === activeFinancialUserId() && row.recoveryAccount && row.currency === currency);
            if (!account) {
              account = { id: v10Id("account-recovery"), name: `Akun Pemulihan ${currency}`, type: "cash", liability: false, currency, openingBalance: 0, openingRate: convertCurrency(1, currency, state.settings.baseCurrency) || 1, icon: "🛟", color: "#ff9f43", profileId: activeFinancialUserId() || state.profiles[0]?.id || "", sharedWith: [], recoveryAccount: true };
              state.accounts.push(account);
            }
            byCurrency.set(currency, account.id);
          }
          tx.accountId = byCurrency.get(currency);
        });
      });
    } else if (type === "split-mismatch") {
      await commit("Smart Cleanup", `${item.count} split diseimbangkan`, () => {
        const ids = new Set(item.ids);
        state.transactions.filter((tx) => ids.has(tx.id) && tx.splits?.length).forEach((tx) => {
          const beforeLast = tx.splits.slice(0, -1).reduce((sum, row) => sum + safeNumber(row.amount), 0);
          tx.splits[tx.splits.length - 1].amount = Math.max(0, safeNumber(tx.amount) - beforeLast);
        });
      });
    } else if (type === "duplicate-subscriptions") {
      await commit("Smart Cleanup", `${item.count} langganan salinan dijeda`, () => { const ids = new Set(item.ids); state.recurring.filter((row) => ids.has(row.id)).forEach((row) => { row.active = false; row.updatedAt = nowIso(); }); });
    } else if (type === "tag-variants") {
      await commit("Smart Cleanup", "Tag dinormalisasi", () => {
        financialItems(state.transactions).forEach((tx) => {
          const seen = new Set();
          tx.tags = (tx.tags || []).map((tag) => String(tag).trim().toLowerCase()).filter((tag) => tag && !seen.has(tag) && seen.add(tag));
        });
      });
    } else if (type === "orphan-attachments") {
      await deleteOrphanAttachments(item.ids);
      addAudit("Smart Cleanup", `${item.count} lampiran yatim dihapus.`);
      state.settings.lastDataCleanup = nowIso();
      await encryptState();
      renderAll();
    }
    state.settings.lastDataCleanup = nowIso();
    await analyzeDataQuality(true);
    showToast("Perbaikan selesai.", "🧹");
  }

  async function deleteOrphanAttachments(ids) {
    const db = await openAttachmentDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("attachments", "readwrite");
      const store = tx.objectStore("attachments");
      ids.forEach((id) => store.delete(id));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  function subscriptionIntelligenceData() {
    const active = financialItems(state.recurring || []).filter((item) => item.active && item.type === "expense");
    const monthly = active.reduce((sum, item) => sum + (convertCurrency(subscriptionMonthlyNative(item), item.currency, state.settings.baseCurrency) || 0), 0);
    const annual = monthly * 12;
    const lowUsage = active.filter((item) => item.usageLevel === "rarely" || item.cancelCandidate);
    const savings = lowUsage.reduce((sum, item) => sum + (convertCurrency(subscriptionMonthlyNative(item), item.currency, state.settings.baseCurrency) || 0), 0);
    const trials = active.filter((item) => item.trialEndDate && daysBetween(localISO(), item.trialEndDate) >= 0 && daysBetween(localISO(), item.trialEndDate) <= 30);
    const expiringCards = active.filter((item) => item.cardExpiry && monthDistance(localISO().slice(0, 7), item.cardExpiry) >= 0 && monthDistance(localISO().slice(0, 7), item.cardExpiry) <= 2);
    const priceIncreases = active.filter((item) => Array.isArray(item.priceHistory) && item.priceHistory.some((row) => row.from !== undefined && safeNumber(row.to) > safeNumber(row.from)));
    const foreign = active.filter((item) => item.currency && item.currency !== state.settings.baseCurrency);
    return { active, monthly, annual, lowUsage, savings, trials, expiringCards, priceIncreases, foreign };
  }

  function subscriptionMonthlyNative(item) {
    if (item.frequency === "weekly") return safeNumber(item.amount) * 52 / 12;
    if (item.frequency === "yearly") return safeNumber(item.amount) / 12;
    return safeNumber(item.amount);
  }

  function daysBetween(from, to) {
    return Math.round((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000);
  }

  function monthDistance(from, to) {
    const [fy, fm] = from.split("-").map(Number); const [ty, tm] = to.split("-").map(Number);
    return (ty - fy) * 12 + (tm - fm);
  }

  function renderSubscriptionIntelligence() {
    const container = document.getElementById("v10SubscriptionIntelligence");
    if (!container || !state) return;
    const data = subscriptionIntelligenceData();
    const savingPercent = data.monthly ? Math.min(100, data.savings / data.monthly * 100) : 0;
    container.innerHTML = `
      <article class="panel">
        <header class="panel-header"><div><h4>Subscription Intelligence</h4><p>Analisis biaya, trial, perubahan harga, penggunaan, dan peluang penghematan.</p></div><button class="button secondary" id="v10SavingsSimulator" type="button">Simulasi Penghematan</button></header>
        <div class="v10-intelligence-grid">
          <div class="v10-insight"><strong>💳 Biaya aktif</strong><span class="money">${formatCurrency(data.monthly)}</span><p>${formatCurrency(data.annual)} per tahun.</p></div>
          <div class="v10-insight"><strong>✂️ Potensi hemat</strong><span class="money positive">${formatCurrency(data.savings)}</span><p>${data.lowUsage.length} layanan jarang dipakai/kandidat berhenti.</p><div class="v10-progress"><span style="width:${savingPercent}%"></span></div></div>
          <div class="v10-insight"><strong>🆓 Trial berakhir</strong><span class="money">${data.trials.length}</span><p>${data.trials.length ? data.trials.map((item) => escapeHTML(item.name)).slice(0, 3).join(", ") : "Tidak ada trial dalam 30 hari."}</p></div>
          <div class="v10-insight"><strong>📈 Riwayat kenaikan</strong><span class="money">${data.priceIncreases.length}</span><p>Layanan dengan catatan harga naik.</p></div>
          <div class="v10-insight"><strong>💱 Eksposur kurs</strong><span class="money">${data.foreign.length}</span><p>Langganan ditagih dalam mata uang asing.</p></div>
          <div class="v10-insight"><strong>💳 Kartu hampir kedaluwarsa</strong><span class="money">${data.expiringCards.length}</span><p>${data.expiringCards.length ? "Perbarui metode pembayaran sebelum gagal ditagih." : "Tidak ada dalam 2 bulan."}</p></div>
        </div>
      </article>`;
  }

  function showSavingsSimulator() {
    const data = subscriptionIntelligenceData();
    const candidates = data.active.filter((item) => item.usageLevel === "rarely" || item.usageLevel === "sometimes" || item.cancelCandidate);
    showModal("Simulasi Penghematan", "Pilih langganan yang ingin disimulasikan untuk dihentikan.", `
      <form id="v10SavingsForm">
        <div class="simple-list">${candidates.length ? candidates.map((item) => `<label class="simple-item"><span><strong>${escapeHTML(item.name)}</strong>${escapeHTML(item.provider || "")} · ${formatCurrency(subscriptionMonthlyNative(item), item.currency)}/bulan</span><input class="v10-saving-choice" type="checkbox" value="${item.id}" checked /></label>`).join("") : '<div class="muted">Belum ada layanan yang ditandai jarang digunakan.</div>'}</div>
        <div class="v10-alert" id="v10SavingsResult" style="margin-top:15px"></div>
        <div class="form-actions"><button class="button secondary" type="button" id="v10CloseSavings">Tutup</button><button class="button primary" type="submit">Terapkan: Jeda Dipilih</button></div>
      </form>`);
    const update = () => {
      const ids = Array.from(document.querySelectorAll(".v10-saving-choice:checked")).map((box) => box.value);
      const monthly = candidates.filter((item) => ids.includes(item.id)).reduce((sum, item) => sum + (convertCurrency(subscriptionMonthlyNative(item), item.currency, state.settings.baseCurrency) || 0), 0);
      document.getElementById("v10SavingsResult").innerHTML = `<strong>Potensi penghematan:</strong> ${formatCurrency(monthly)} per bulan · ${formatCurrency(monthly * 12)} per tahun.`;
    };
    document.querySelectorAll(".v10-saving-choice").forEach((box) => box.addEventListener("change", update));
    update();
    document.getElementById("v10CloseSavings")?.addEventListener("click", closeModal);
    document.getElementById("v10SavingsForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const ids = new Set(Array.from(document.querySelectorAll(".v10-saving-choice:checked")).map((box) => box.value));
      if (!ids.size) return;
      await commit("Simulasi penghematan diterapkan", `${ids.size} langganan dijeda`, () => state.recurring.filter((item) => ids.has(item.id)).forEach((item) => { item.active = false; item.updatedAt = nowIso(); }));
      closeModal();
      showToast("Langganan terpilih dijeda.", "✂️");
    });
  }

  function enhanceRecurringV10Form(existing) {
    const details = document.getElementById("v9RecurringDetails") || document.querySelector("#recurringForm .form-grid");
    if (!details || document.getElementById("v10RecurringIntelligence")) return;
    const item = existing || {};
    details.insertAdjacentHTML("beforeend", `
      <div class="field full" id="v10RecurringIntelligence">
        <span>Subscription Intelligence</span>
        <div class="form-grid">
          <label class="field"><span>Tingkat penggunaan</span><select class="input" id="v10UsageLevel"><option value="unknown" ${item.usageLevel === "unknown" || !item.usageLevel ? "selected" : ""}>Belum dinilai</option><option value="essential" ${item.usageLevel === "essential" ? "selected" : ""}>Sangat penting</option><option value="often" ${item.usageLevel === "often" ? "selected" : ""}>Sering dipakai</option><option value="sometimes" ${item.usageLevel === "sometimes" ? "selected" : ""}>Kadang dipakai</option><option value="rarely" ${item.usageLevel === "rarely" ? "selected" : ""}>Jarang dipakai</option></select></label>
          <label class="field"><span>Kedaluwarsa kartu (bulan)</span><input class="input" id="v10CardExpiry" type="month" value="${escapeHTML(item.cardExpiry || "")}" /></label>
          <label class="field"><span>Terakhir digunakan</span><input class="input" id="v10LastUsedDate" type="date" value="${escapeHTML(item.lastUsedDate || "")}" /></label>
          <label class="field"><span><input id="v10CancelCandidate" type="checkbox" ${item.cancelCandidate ? "checked" : ""}/> Kandidat dihentikan</span></label>
          <label class="field full"><span>Catatan perubahan harga</span><input class="input" id="v10PriceNote" value="${escapeHTML(item.priceNote || "")}" placeholder="Contoh: Harga naik setelah promo berakhir" /></label>
        </div>
        ${item.priceHistory?.length ? `<div class="v10-price-history">${item.priceHistory.slice(-4).reverse().map((row) => `<div class="v10-price-row"><span>${escapeHTML(row.note || "Perubahan harga")} · ${formatDate(String(row.effectiveDate || "").slice(0,10))}</span><strong class="money">${row.from !== undefined ? `${formatCurrency(row.from, row.currency || item.currency)} → ` : ""}${formatCurrency(row.to ?? row.amount, row.currency || item.currency)}</strong></div>`).join("")}</div>` : ""}
      </div>`);
    const form = document.getElementById("recurringForm");
    form?.addEventListener("submit", () => {
      pendingRecurringV10 = {
        editingId: existing?.id || null,
        usageLevel: document.getElementById("v10UsageLevel")?.value || "unknown",
        cardExpiry: document.getElementById("v10CardExpiry")?.value || "",
        lastUsedDate: document.getElementById("v10LastUsedDate")?.value || "",
        cancelCandidate: Boolean(document.getElementById("v10CancelCandidate")?.checked),
        priceNote: document.getElementById("v10PriceNote")?.value.trim() || ""
      };
    }, { once: true, capture: true });
  }

  async function savePushSettings() {
    state.settings.vapidPublicKey = document.getElementById("v10VapidPublicKey")?.value.trim() || "";
    state.settings.pushNotificationTime = document.getElementById("v10PushTime")?.value || "08:00";
    state.settings.pushTimezone = document.getElementById("v10PushTimezone")?.value.trim() || "Asia/Jakarta";
    state.settings.pushPrivacyMode = document.getElementById("v10PushPrivacy")?.value || "generic";
    state.settings.autoSyncPushSchedules = document.getElementById("v10PushAutoSync")?.value !== "no";
    await encryptState();
    renderPushCenter();
    showToast("Pengaturan push disimpan.", "🔔");
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
  }

  async function enablePush() {
    if (!cloudSession?.user || !supabaseClient) throw new Error("Masuk ke akun cloud terlebih dahulu.");
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) throw new Error("Browser ini belum mendukung Web Push.");
    await savePushSettings();
    if (!state.settings.vapidPublicKey) throw new Error("Isi VAPID public key terlebih dahulu.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Izin notifikasi tidak diberikan.");
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(state.settings.vapidPublicKey) });
    }
    const json = subscription.toJSON();
    const { error } = await supabaseClient.from(PUSH_TABLE).upsert({
      user_id: cloudSession.user.id,
      endpoint: subscription.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
      device_id: localStorage.getItem(DEVICE_ID_KEY) || v10Id("device"),
      user_agent: navigator.userAgent.slice(0, 500),
      timezone: state.settings.pushTimezone,
      enabled: true,
      updated_at: nowIso()
    }, { onConflict: "endpoint" });
    if (error) throw new Error(`Backend push belum siap: ${error.message}`);
    state.settings.pushEnabled = true;
    await syncPushSchedules();
    await encryptState();
    renderPushCenter();
    showToast("Push reminder aktif di perangkat ini.", "🔔");
  }

  async function syncPushSchedules() {
    if (!cloudSession?.user || !supabaseClient) throw new Error("Masuk ke cloud terlebih dahulu.");
    const items = (state.recurring || []).filter((item) => item.active && item.type === "expense" && item.reminderEnabled !== false && item.nextDate);
    const rows = items.map((item) => {
      const profile = state.profiles?.find((row) => row.id === item.profileId);
      return {
      user_id: cloudSession.user.id,
      recurring_id: item.id,
      title: state.settings.pushPrivacyMode === "detailed" ? `${profile?.name ? `${profile.name} · ` : ""}${item.name}` : "Tagihan CHARISNA",
      amount: state.settings.pushPrivacyMode === "detailed" ? safeNumber(item.amount) : null,
      currency: state.settings.pushPrivacyMode === "detailed" ? (item.currency || state.settings.baseCurrency) : null,
      due_date: item.nextDate,
      reminder_days: Array.isArray(item.reminderDays) && item.reminderDays.length ? item.reminderDays : (state.settings.billReminderDays || [7,3,1,0]),
      notification_time: state.settings.pushNotificationTime || "08:00",
      timezone: state.settings.pushTimezone || "Asia/Jakarta",
      privacy_mode: state.settings.pushPrivacyMode || "generic",
      enabled: true,
      updated_at: nowIso()
    };
    });
    if (rows.length) {
      const { error } = await supabaseClient.from(SCHEDULE_TABLE).upsert(rows, { onConflict: "user_id,recurring_id" });
      if (error) throw new Error(`Tabel jadwal push belum siap: ${error.message}`);
    }
    const { data: remote, error: readError } = await supabaseClient.from(SCHEDULE_TABLE).select("recurring_id").eq("user_id", cloudSession.user.id);
    if (readError) throw new Error(`Jadwal push belum dapat dibaca: ${readError.message}`);
    const localIds = new Set(items.map((item) => item.id));
    for (const row of remote || []) {
      if (!localIds.has(row.recurring_id)) await supabaseClient.from(SCHEDULE_TABLE).delete().eq("user_id", cloudSession.user.id).eq("recurring_id", row.recurring_id);
    }
    state.settings.lastPushScheduleSync = nowIso();
    await encryptState();
    renderPushCenter();
    showToast(`${rows.length} jadwal push tersinkron.`, "↻");
  }

  async function testPush() {
    if (!supabaseClient || !cloudSession?.user) throw new Error("Masuk ke cloud terlebih dahulu.");
    const { error } = await supabaseClient.functions.invoke("send-bill-reminders", { body: { test: true } });
    if (error) throw new Error(`Edge Function belum siap: ${error.message}`);
    showToast("Notifikasi tes dikirim.", "📨");
  }

  async function disablePush() {
    const registration = await navigator.serviceWorker?.ready;
    const subscription = await registration?.pushManager?.getSubscription();
    if (subscription && supabaseClient && cloudSession?.user) {
      await supabaseClient.from(PUSH_TABLE).delete().eq("user_id", cloudSession.user.id).eq("endpoint", subscription.endpoint);
      await subscription.unsubscribe();
    }
    state.settings.pushEnabled = false;
    await encryptState();
    renderPushCenter();
    showToast("Push dinonaktifkan pada perangkat ini.", "🔕");
  }

  function monitorServiceWorkerUpdates() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "OPEN_REMINDER_CENTER") {
        document.getElementById("proReminderButton")?.click();
      }
    });
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) return;
      if (registration.waiting) waitingServiceWorker = registration.waiting;
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            waitingServiceWorker = registration.waiting || installing;
            renderUpdateCenter();
            showToast("Pembaruan aplikasi tersedia.", "⬆️");
          }
        });
      });
    });
    if (!controllerReloadBound) {
      controllerReloadBound = true;
      navigator.serviceWorker.addEventListener("controllerchange", () => location.reload());
    }
  }

  async function checkForUpdate() {
    if (window.CharisnaDesktop?.isDesktop || window.CHARISNA_NATIVE || !("serviceWorker" in navigator)) {
      showToast("Aplikasi Desktop/Native v14.1.2 sudah versi terbaru.", "✓");
      return;
    }
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("Service worker belum terdaftar.");
    await registration.update();
    waitingServiceWorker = registration.waiting;
    renderUpdateCenter();
    showToast(waitingServiceWorker ? "Update siap dipasang." : "Aplikasi sudah versi terbaru.", waitingServiceWorker ? "⬆️" : "✓");
  }

  async function installUpdate() {
    if (!waitingServiceWorker) throw new Error("Belum ada update yang menunggu.");
    await exportEncryptedBackup();
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  }

  async function clearOldCaches() {
    if (!("caches" in window)) return;
    const names = await caches.keys();
    await Promise.all(names.filter((name) => !name.includes("v14.1.2")).map((name) => caches.delete(name)));
    showToast("Cache versi lama dihapus.", "🧹");
  }

  async function exportDiagnostic() {
    const report = {
      application: "CHARISNA Money Management",
      version: VERSION_LABEL,
      generatedAt: nowIso(),
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      secureContext: window.isSecureContext,
      notificationPermission: "Notification" in window ? Notification.permission : "unsupported",
      serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller),
      cloudLoggedIn: Boolean(cloudSession?.user),
      health: latestHealthResults,
      dataQuality: latestQualityReport ? { total: latestQualityReport.total, critical: latestQualityReport.critical, issues: latestQualityReport.issues.map(({ type, title, count, severity }) => ({ type, title, count, severity })) } : null
    };
    downloadBlob(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }), `charisna-diagnostic-${localISO()}.json`);
  }

  async function exportProfessionalExcel() {
    if (!window.ExcelJS) throw new Error("Library Excel profesional belum termuat. Pastikan internet aktif lalu muat ulang.");
    const button = document.getElementById("exportExcelButton") || document.getElementById("v10ExportExcel");
    if (button) { button.disabled = true; button.textContent = "Membuat Excel..."; }
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "CHARISNA Money Management";
      workbook.company = "CHARISNA";
      workbook.subject = "Financial Management Report";
      workbook.title = `CHARISNA Financial Report ${localISO()}`;
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.calcProperties.fullCalcOnLoad = true;

      buildDashboardSheet(workbook);
      buildTransactionsSheet(workbook);
      buildAccountsSheet(workbook);
      buildBudgetGoalSheets(workbook);
      buildSubscriptionsSheet(workbook);
      buildDebtInvestmentSheets(workbook);
      buildCategoryTagSheets(workbook);
      if (state.settings.excelIncludeAudit) buildAuditSheet(workbook);
      buildMetadataSheet(workbook);

      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `CHARISNA-Financial-Report-${localISO()}.xlsx`);
      showToast("Excel profesional berhasil dibuat.", "📗");
    } finally {
      if (button) { button.disabled = false; button.textContent = button.id === "exportExcelButton" ? "📗 Excel Profesional" : "📗 Buat Excel"; }
    }
  }

  const XL = {
    purple: "7558FF", dark: "232237", light: "EBE7FF", pink: "FF6DA8", green: "13B888", red: "FF5967", orange: "FF9F43", blue: "398CF5", gray: "78758F", white: "FFFFFF", soft: "F6F6FC"
  };

  function setupSheet(sheet, widths = []) {
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9, margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
    sheet.headerFooter.oddHeader = `&L&10CHARISNA Money Management&C&10${sheet.name}&R&10${localISO()}`;
    sheet.headerFooter.oddFooter = "&LConfidential&CPage &P of &N&RGenerated locally";
    widths.forEach((width, index) => { sheet.getColumn(index + 1).width = width; });
  }

  function titleBlock(sheet, title, subtitle, endColumn = 8) {
    sheet.mergeCells(1, 1, 1, endColumn);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { name: "Aptos Display", size: 20, bold: true, color: { argb: XL.white } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: XL.purple } };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };
    sheet.getRow(1).height = 34;
    sheet.mergeCells(2, 1, 2, endColumn);
    const subtitleCell = sheet.getCell(2, 1);
    subtitleCell.value = subtitle;
    subtitleCell.font = { name: "Aptos", size: 10, color: { argb: XL.gray } };
    sheet.getRow(2).height = 22;
  }

  function styleHeader(row) {
    row.height = 24;
    row.eachCell((cell) => {
      cell.font = { name: "Aptos", bold: true, color: { argb: XL.white } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: XL.dark } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = { bottom: { style: "thin", color: { argb: XL.purple } } };
    });
  }

  function styleDataRows(sheet, startRow, endRow) {
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
      const row = sheet.getRow(rowIndex);
      if (rowIndex % 2 === 0) row.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F4F2FF" } }; });
      row.eachCell((cell) => { cell.font = { name: "Aptos", size: 10, color: { argb: XL.dark } }; cell.alignment = { vertical: "middle" }; cell.border = { bottom: { style: "hair", color: { argb: "DDD9F3" } } }; });
    }
  }

  function addTableSheet(workbook, name, title, subtitle, columns, rows, widths) {
    const sheet = workbook.addWorksheet(name, { properties: { tabColor: { argb: XL.purple } } });
    setupSheet(sheet, widths);
    titleBlock(sheet, title, subtitle, columns.length);
    const headerRowIndex = 4;
    sheet.getRow(headerRowIndex).values = columns.map((column) => column.header);
    styleHeader(sheet.getRow(headerRowIndex));
    rows.forEach((record) => {
      const row = sheet.addRow(columns.map((column) => record[column.key] ?? ""));
      columns.forEach((column, index) => {
        const cell = row.getCell(index + 1);
        if (column.numFmt) cell.numFmt = column.numFmt;
        if (column.type === "date" && cell.value) cell.numFmt = "dd mmm yyyy";
      });
    });
    sheet.autoFilter = { from: { row: headerRowIndex, column: 1 }, to: { row: headerRowIndex, column: columns.length } };
    sheet.views = [{ state: "frozen", ySplit: headerRowIndex }];
    styleDataRows(sheet, headerRowIndex + 1, sheet.rowCount);
    return sheet;
  }

  function buildDashboardSheet(workbook) {
    const sheet = workbook.addWorksheet("Dashboard", { properties: { tabColor: { argb: XL.purple } } });
    setupSheet(sheet, [24,18,18,18,18,18,18,18]);
    titleBlock(sheet, "CHARISNA MONEY MANAGEMENT", `Laporan keuangan profesional · Dibuat ${formatDateTime(nowIso())} · Mata uang utama ${state.settings.baseCurrency}`, 8);
    const totals = periodTotals();
    const kpis = [["Total Aset", totalAssets(), "Total Kewajiban", totalLiabilities()], ["Net Worth", netWorth(), "Pemasukan Bulan Ini", totals.income], ["Pengeluaran Bulan Ini", totals.expense, "Saving Rate", totals.income ? (totals.income - totals.expense) / totals.income : 0]];
    let row = 4;
    kpis.forEach(([a, av, b, bv], index) => {
      sheet.mergeCells(row,1,row,2); sheet.getCell(row,1).value=a; sheet.mergeCells(row,3,row+1,4); sheet.getCell(row,3).value=av;
      sheet.mergeCells(row,5,row,6); sheet.getCell(row,5).value=b; sheet.mergeCells(row,7,row+1,8); sheet.getCell(row,7).value=bv;
      [sheet.getCell(row,1), sheet.getCell(row,5)].forEach((cell) => { cell.font={bold:true,color:{argb:XL.gray}}; cell.fill={type:"pattern",pattern:"solid",fgColor:{argb:XL.soft}}; cell.alignment={vertical:"middle"}; });
      [sheet.getCell(row,3), sheet.getCell(row,7)].forEach((cell) => { cell.font={bold:true,size:15,color:{argb:index===2&&cell===sheet.getCell(row,7)?XL.green:XL.dark}}; cell.fill={type:"pattern",pattern:"solid",fgColor:{argb:XL.light}}; cell.alignment={vertical:"middle",horizontal:"right"}; cell.numFmt=index===2&&cell===sheet.getCell(row,7)?"0.0%":"#,##0.00"; });
      sheet.getRow(row).height=24; sheet.getRow(row+1).height=24; row += 3;
    });
    row += 1;
    sheet.getCell(row,1).value="Arus Kas 6 Bulan"; sheet.getCell(row,1).font={bold:true,size:13,color:{argb:XL.purple}};
    row += 1;
    sheet.getRow(row).values=["Bulan","Pemasukan","Pengeluaran","Arus Bersih"];
    styleHeader(sheet.getRow(row));
    sixMonthData().forEach((item) => { const r=sheet.addRow([item.label,item.income,item.expense,item.income-item.expense]); r.getCell(2).numFmt=r.getCell(3).numFmt=r.getCell(4).numFmt="#,##0.00"; });
    row = sheet.rowCount + 2;
    sheet.getCell(row,1).value="Top Kategori Pengeluaran"; sheet.getCell(row,1).font={bold:true,size:13,color:{argb:XL.purple}}; row += 1;
    sheet.getRow(row).values=["Kategori","Nominal","Porsi"];
    styleHeader(sheet.getRow(row));
    const categories=categoryTotals(); const totalCategory=categories.reduce((s,i)=>s+i.amount,0);
    categories.slice(0,10).forEach((item)=>{const r=sheet.addRow([item.category,item.amount,totalCategory?item.amount/totalCategory:0]);r.getCell(2).numFmt="#,##0.00";r.getCell(3).numFmt="0.0%";});
    styleDataRows(sheet, 5, sheet.rowCount);
  }

  function buildTransactionsSheet(workbook) {
    const accountMap = new Map(financialItems(state.accounts || []).map((item) => [item.id, item.name]));
    const rows = [...financialItems(state.transactions || [])].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((tx) => ({
      date: tx.date ? new Date(`${tx.date}T00:00:00`) : "", type: tx.type, description: tx.description, merchant: tx.merchant || "", account: accountMap.get(tx.accountId) || "Akun tidak ditemukan", destination: accountMap.get(tx.destinationAccountId) || "", category: tx.category, amount: safeNumber(tx.amount), currency: tx.currency, baseAmount: transactionBaseValue(tx), status: tx.status, tags: (tx.tags || []).join(", "), reconciled: tx.reconciled ? "Ya" : "Tidak", deductible: tx.deductible ? "Ya" : "Tidak", id: tx.id
    }));
    const columns=[{key:"date",header:"Tanggal",type:"date"},{key:"type",header:"Jenis"},{key:"description",header:"Deskripsi"},{key:"merchant",header:"Merchant"},{key:"account",header:"Akun"},{key:"destination",header:"Akun Tujuan"},{key:"category",header:"Kategori"},{key:"amount",header:"Nominal",numFmt:"#,##0.00"},{key:"currency",header:"Mata Uang"},{key:"baseAmount",header:`Nilai ${state.settings.baseCurrency}`,numFmt:"#,##0.00"},{key:"status",header:"Status"},{key:"tags",header:"Tags"},{key:"reconciled",header:"Rekonsiliasi"},{key:"deductible",header:"Deductible"}];
    if(state.settings.excelIncludeRawIds) columns.push({key:"id",header:"ID"});
    const sheet=addTableSheet(workbook,"Transaksi","DAFTAR TRANSAKSI",`${rows.length} transaksi · Nilai dasar ${state.settings.baseCurrency}`,columns,rows,[14,12,28,22,22,22,18,16,12,17,14,24,14,14,30]);
    for(let i=5;i<=sheet.rowCount;i++){const type=sheet.getCell(i,2).value;const cell=sheet.getCell(i,8);cell.font={bold:true,color:{argb:type==="income"?XL.green:type==="expense"?XL.red:XL.purple}};}
  }

  function buildAccountsSheet(workbook) {
    const rows=financialItems(state.accounts||[]).map((account)=>({name:account.name,type:ACCOUNT_TYPES[account.type]?.label||account.type,class:account.liability?"Kewajiban":"Aset",currency:account.currency,balance:accountBalance(account),baseValue:accountValueInBase(account),profile:state.profiles.find((p)=>p.id===account.profileId)?.name||"",creditLimit:safeNumber(account.creditLimit),status:account.archived?"Arsip":"Aktif",id:account.id}));
    const columns=[{key:"name",header:"Nama Akun"},{key:"type",header:"Jenis"},{key:"class",header:"Klasifikasi"},{key:"currency",header:"Mata Uang"},{key:"balance",header:"Saldo",numFmt:"#,##0.00"},{key:"baseValue",header:`Nilai ${state.settings.baseCurrency}`,numFmt:"#,##0.00"},{key:"profile",header:"Profil"},{key:"creditLimit",header:"Limit Kredit",numFmt:"#,##0.00"},{key:"status",header:"Status"}];if(state.settings.excelIncludeRawIds)columns.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Akun","AKUN, ASET & KEWAJIBAN",`Total aset ${formatCurrency(totalAssets())} · Kewajiban ${formatCurrency(totalLiabilities())}`,columns,rows,[26,18,16,12,18,18,18,18,14,30]);
  }

  function buildBudgetGoalSheets(workbook) {
    const budgets=financialItems(state.budgets||[]).map((budget)=>{const spent=budgetSpent(budget);const limit=safeNumber(budget.limit)+safeNumber(budget.rollover?budget.rolloverAmount:0);return{name:budget.name,category:budget.category,period:budget.period,currency:budget.currency,limit,spent,remaining:Math.max(limit-spent,0),usage:limit?spent/limit:0,rollover:budget.rollover?"Ya":"Tidak",tag:budget.tag||"",id:budget.id};});
    const bcols=[{key:"name",header:"Budget"},{key:"category",header:"Kategori"},{key:"period",header:"Periode"},{key:"currency",header:"Mata Uang"},{key:"limit",header:"Batas",numFmt:"#,##0.00"},{key:"spent",header:"Terpakai",numFmt:"#,##0.00"},{key:"remaining",header:"Sisa",numFmt:"#,##0.00"},{key:"usage",header:"Pemakaian",numFmt:"0.0%"},{key:"rollover",header:"Rollover"},{key:"tag",header:"Tag"}];if(state.settings.excelIncludeRawIds)bcols.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Budget","BUDGET & ANGGARAN",`${budgets.length} budget aktif`,bcols,budgets,[24,18,14,12,16,16,16,14,12,18,30]);
    const goals=financialItems(state.goals||[]).map((goal)=>{const saved=goalSaved(goal);return{name:goal.name,targetDate:goal.targetDate?new Date(`${goal.targetDate}T00:00:00`):"",currency:goal.currency,target:safeNumber(goal.targetAmount),saved,remaining:Math.max(safeNumber(goal.targetAmount)-saved,0),progress:safeNumber(goal.targetAmount)?saved/safeNumber(goal.targetAmount):0,monthly:goalMonthlyRequirement(goal),id:goal.id};});
    const gcols=[{key:"name",header:"Goal"},{key:"targetDate",header:"Target Tanggal",type:"date"},{key:"currency",header:"Mata Uang"},{key:"target",header:"Target",numFmt:"#,##0.00"},{key:"saved",header:"Terkumpul",numFmt:"#,##0.00"},{key:"remaining",header:"Sisa",numFmt:"#,##0.00"},{key:"progress",header:"Progress",numFmt:"0.0%"},{key:"monthly",header:"Kebutuhan/Bulan",numFmt:"#,##0.00"}];if(state.settings.excelIncludeRawIds)gcols.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Goals","FINANCIAL GOALS",`${goals.length} tujuan keuangan`,gcols,goals,[26,16,12,17,17,17,14,18,30]);
  }

  function buildSubscriptionsSheet(workbook) {
    const rows=financialItems(state.recurring||[]).filter((item)=>item.type==="expense").map((item)=>({name:item.name,provider:item.provider||"",plan:item.planName||"",status:item.active?"Aktif":"Dijeda",frequency:item.frequency,currency:item.currency,amount:safeNumber(item.amount),monthly:subscriptionMonthlyNative(item),annual:subscriptionMonthlyNative(item)*12,nextDate:item.nextDate?new Date(`${item.nextDate}T00:00:00`):"",trialEnd:item.trialEndDate?new Date(`${item.trialEndDate}T00:00:00`):"",usage:item.usageLevel||"unknown",candidate:item.cancelCandidate?"Ya":"Tidak",cardExpiry:item.cardExpiry||"",priceChanges:(item.priceHistory||[]).length-1,tags:(item.subscriptionTags||[]).join(", "),id:item.id}));
    const columns=[{key:"name",header:"Layanan"},{key:"provider",header:"Provider"},{key:"plan",header:"Paket"},{key:"status",header:"Status"},{key:"frequency",header:"Frekuensi"},{key:"currency",header:"Mata Uang"},{key:"amount",header:"Nominal",numFmt:"#,##0.00"},{key:"monthly",header:"Ekuivalen/Bulan",numFmt:"#,##0.00"},{key:"annual",header:"Ekuivalen/Tahun",numFmt:"#,##0.00"},{key:"nextDate",header:"Jatuh Tempo",type:"date"},{key:"trialEnd",header:"Trial Berakhir",type:"date"},{key:"usage",header:"Penggunaan"},{key:"candidate",header:"Kandidat Berhenti"},{key:"cardExpiry",header:"Kartu Exp."},{key:"priceChanges",header:"Perubahan Harga"},{key:"tags",header:"Tags"}];if(state.settings.excelIncludeRawIds)columns.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Langganan","LANGGANAN & TAGIHAN RUTIN",`${rows.length} layanan · Subscription Intelligence`,columns,rows,[25,20,20,12,14,12,16,18,18,16,16,15,16,14,15,22,30]);
  }

  function buildDebtInvestmentSheets(workbook) {
    const debts=financialItems(state.debts||[]).map((debt)=>({name:debt.name||"Utang",type:debt.kind||"debt",lender:debt.lender||"",currency:debt.currency||state.settings.baseCurrency,principal:safeNumber(debt.principal),balance:safeNumber(debt.balance),rate:safeNumber(debt.interestRate)/100,dueDay:safeNumber(debt.dueDay),endDate:debt.endDate?new Date(`${debt.endDate}T00:00:00`):"",minimum:safeNumber(debt.monthlyPayment),status:debt.status||"active",id:debt.id}));
    const dcols=[{key:"name",header:"Utang/Cicilan"},{key:"type",header:"Jenis"},{key:"lender",header:"Pemberi/Peminjam"},{key:"currency",header:"Mata Uang"},{key:"principal",header:"Pokok Awal",numFmt:"#,##0.00"},{key:"balance",header:"Sisa",numFmt:"#,##0.00"},{key:"rate",header:"Bunga",numFmt:"0.00%"},{key:"dueDay",header:"Tanggal Jatuh Tempo"},{key:"endDate",header:"Target Selesai",type:"date"},{key:"minimum",header:"Bayar Bulanan",numFmt:"#,##0.00"},{key:"status",header:"Status"}];if(state.settings.excelIncludeRawIds)dcols.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Utang","UTANG & CICILAN",`${debts.length} kewajiban tercatat`,dcols,debts,[25,16,22,12,18,18,13,17,16,18,14,30]);
    const investments=financialItems(state.investments||[]).map((item)=>({name:item.name||item.symbol||"Investasi",symbol:item.symbol||"",type:item.type||"asset",currency:item.currency||state.settings.baseCurrency,quantity:safeNumber(item.quantity),average:safeNumber(item.avgCost),current:safeNumber(item.currentPrice),cost:safeNumber(item.quantity)*safeNumber(item.avgCost),value:safeNumber(item.quantity)*safeNumber(item.currentPrice),returnPct:(safeNumber(item.quantity)*safeNumber(item.avgCost))?((safeNumber(item.quantity)*safeNumber(item.currentPrice))/(safeNumber(item.quantity)*safeNumber(item.avgCost))-1):0,id:item.id}));
    const icols=[{key:"name",header:"Investasi"},{key:"symbol",header:"Simbol"},{key:"type",header:"Jenis"},{key:"currency",header:"Mata Uang"},{key:"quantity",header:"Jumlah",numFmt:"#,##0.########"},{key:"average",header:"Harga Rata-rata",numFmt:"#,##0.00"},{key:"current",header:"Harga Sekarang",numFmt:"#,##0.00"},{key:"cost",header:"Modal",numFmt:"#,##0.00"},{key:"value",header:"Nilai Saat Ini",numFmt:"#,##0.00"},{key:"returnPct",header:"Return",numFmt:"0.00%"}];if(state.settings.excelIncludeRawIds)icols.push({key:"id",header:"ID"});
    addTableSheet(workbook,"Investasi","INVESTASI & ASET",`${investments.length} posisi investasi`,icols,investments,[25,13,16,12,15,18,18,18,18,14,30]);
  }

  function buildCategoryTagSheets(workbook) {
    const activeProfileId = window.activeFinancialUserId?.()
      || state.settings?.activeFinancialUserId
      || state.settings?.activeBookId
      || state.profiles?.[0]?.id
      || "";
    const scopedCategories = (state.categoryCatalog || []).filter((item) => !item.profileId || item.profileId === activeProfileId);
    const categorySource = scopedCategories.length ? scopedCategories : Object.entries(CATEGORIES).map(([name, meta], index) => ({
      name,
      type: meta.type || "both",
      icon: meta.icon || "✨",
      color: meta.color || "#8c8ca1",
      parent: "",
      archived: false,
      pinned: false,
      order: index,
      builtinKey: name
    }));
    const categoryRows = categorySource.map((item) => {
      const transactionCount = financialItems(state.transactions || []).reduce((count, tx) => count + (tx.category === item.name ? 1 : 0) + (tx.splits || []).filter((split) => split.category === item.name).length, 0);
      const budgetCount = financialItems(state.budgets || []).filter((row) => row.category === item.name).length;
      const recurringCount = financialItems(state.recurring || []).filter((row) => row.category === item.name).length;
      return {
        icon: item.icon || "✨",
        name: item.name,
        parent: item.parent || "",
        type: item.type === "income" ? "Pemasukan" : item.type === "expense" ? "Pengeluaran" : "Keduanya",
        source: item.builtinKey ? "Bawaan" : "Custom",
        status: item.archived ? "Arsip" : "Aktif",
        favorite: item.pinned ? "Ya" : "Tidak",
        transactionCount,
        budgetCount,
        recurringCount,
        totalUsage: transactionCount + budgetCount + recurringCount,
        color: item.color || ""
      };
    });
    const categoryColumns = [
      { key: "icon", header: "Ikon" },
      { key: "name", header: "Kategori" },
      { key: "parent", header: "Induk" },
      { key: "type", header: "Jenis" },
      { key: "source", header: "Sumber" },
      { key: "status", header: "Status" },
      { key: "favorite", header: "Favorit" },
      { key: "transactionCount", header: "Transaksi", numFmt: "0" },
      { key: "budgetCount", header: "Budget", numFmt: "0" },
      { key: "recurringCount", header: "Rutin", numFmt: "0" },
      { key: "totalUsage", header: "Total Pemakaian", numFmt: "0" },
      { key: "color", header: "Warna" }
    ];
    addTableSheet(workbook, "Kategori", "KATEGORI KEUANGAN", `${categoryRows.length} kategori · Kategori custom ikut terenkripsi`, categoryColumns, categoryRows, [9, 24, 20, 16, 13, 12, 12, 12, 11, 11, 15, 13]);

    const tagRows = (state.tagCatalog || []).filter((item) => !item.profileId || item.profileId === activeProfileId).map((item) => {
      const key = String(item.name || "").trim().toLowerCase();
      let usage = 0;
      financialItems(state.transactions || []).forEach((tx) => { usage += (tx.tags || []).filter((tag) => String(tag).trim().toLowerCase() === key).length; });
      financialItems(state.rules || []).forEach((rule) => { usage += (rule.tags || []).filter((tag) => String(tag).trim().toLowerCase() === key).length; });
      financialItems(state.recurring || []).forEach((row) => { usage += (row.subscriptionTags || []).filter((tag) => String(tag).trim().toLowerCase() === key).length; });
      return { name: item.name, status: item.archived ? "Arsip" : "Aktif", usage, color: item.color || "" };
    });
    addTableSheet(workbook, "Tags", "TAG & LABEL", `${tagRows.length} tag tersimpan`, [
      { key: "name", header: "Tag" },
      { key: "status", header: "Status" },
      { key: "usage", header: "Pemakaian", numFmt: "0" },
      { key: "color", header: "Warna" }
    ], tagRows, [28, 14, 14, 16]);
  }

  function buildAuditSheet(workbook) {
    const rows=(state.auditLog||[]).map((item)=>({timestamp:new Date(item.timestamp),action:item.action,detail:item.detail,id:item.id}));
    const columns=[{key:"timestamp",header:"Waktu",type:"date"},{key:"action",header:"Aktivitas"},{key:"detail",header:"Detail"}];if(state.settings.excelIncludeRawIds)columns.push({key:"id",header:"ID"});
    const sheet=addTableSheet(workbook,"Audit Log","AUDIT LOG",`${rows.length} aktivitas terbaru`,columns,rows,[22,28,70,30]);
    for(let i=5;i<=sheet.rowCount;i++) sheet.getCell(i,1).numFmt="dd mmm yyyy hh:mm";
  }

  function buildMetadataSheet(workbook) {
    const sheet=workbook.addWorksheet("Metadata");
    sheet.state="hidden";
    sheet.addRows([["Application","CHARISNA Money Management"],["Version",VERSION_LABEL],["Generated At",nowIso()],["Base Currency",state.settings.baseCurrency],["User",state.settings.userName],["Cloud User",cloudSession?.user?.email||""],["Data Encrypted At Rest","Yes"],["Export Generated Locally","Yes"]]);
  }

  function renderV10Changelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container || document.getElementById("v10ReleaseCard")) return;
    container.insertAdjacentHTML("afterbegin", `
      <article class="release-card latest" id="v10ReleaseCard">
        <div class="release-head"><div><span class="release-kicker">VERSI TERBARU</span><h3>${VERSION_LABEL}</h3><p>Production readiness, push reminder, diagnosa, data quality, subscription intelligence, dan Excel profesional.</p></div><span class="version-badge">v10</span></div>
        <div class="release-feature-grid">
          <div><span>🔔</span><p><strong>Background Push</strong>Client Web Push, sinkronisasi jadwal, mode privasi, Edge Function, dan cron-ready.</p></div>
          <div><span>⬆️</span><p><strong>Update Center</strong>Deteksi update PWA, backup sebelum install, cache cleanup, dan riwayat migrasi.</p></div>
          <div><span>🩺</span><p><strong>System Health</strong>Tes browser, service worker, Supabase/RLS, storage, cloud, notifikasi, dan integritas data.</p></div>
          <div><span>🧠</span><p><strong>Subscription Intelligence</strong>Trial, kenaikan harga, eksposur kurs, penggunaan, kartu kedaluwarsa, dan simulasi hemat.</p></div>
          <div><span>🧹</span><p><strong>Smart Cleanup</strong>Duplikat, akun yatim, split mismatch, kurs kosong, tag, dan lampiran yatim.</p></div>
          <div><span>📗</span><p><strong>Excel Profesional</strong>Dashboard dan banyak sheet dengan filter, freeze pane, format angka, serta layout siap laporan.</p></div>
        </div>
        <div class="release-notes"><span>Kompatibilitas</span><p>Data v9 tetap kompatibel. Push background membutuhkan SQL dan Edge Function v10; fitur lain langsung aktif setelah deploy.</p></div>
      </article>`);
  }

  function bindV10Events() {
    document.addEventListener("click", async (event) => {
      const target = event.target.closest("button,[data-v10-tab],[data-v10-fix]");
      if (!target) return;
      try {
        if (target.dataset.v10Tab) setSystemTab(target.dataset.v10Tab);
        if (target.id === "v10RunAllChecks") { setSystemTab("health"); await runHealthChecks(); await analyzeDataQuality(false); }
        if (target.id === "v10RunHealth") await runHealthChecks();
        if (target.id === "v10AnalyzeData") await analyzeDataQuality(true);
        if (target.dataset.v10Fix) await fixQualityIssue(target.dataset.v10Fix);
        if (target.id === "v10OpenCleanup") { setSystemTab("cleanup"); await analyzeDataQuality(true); }
        if (target.id === "v10ExportDiagnostic") await exportDiagnostic();
        if (target.id === "v10RequestNotification") { if ("Notification" in window) await Notification.requestPermission(); await runHealthChecks(); }
        if (target.id === "v10RetrySync") { if (typeof cloudPush === "function") await cloudPush({ force: false, silent: false }); }
        if (target.id === "v10CheckUpdate") await checkForUpdate();
        if (target.id === "v10InstallUpdate") await installUpdate();
        if (target.id === "v10BackupNow") await exportEncryptedBackup();
        if (target.id === "v10ClearCaches") await clearOldCaches();
        if (target.id === "v10ReloadApp") location.reload();
        if (target.id === "v10EnablePush") await enablePush();
        if (target.id === "v10SyncPushSchedules") await syncPushSchedules();
        if (target.id === "v10TestPush") await testPush();
        if (target.id === "v10DisablePush") await disablePush();
        if (target.id === "v10ExportExcel") await exportProfessionalExcel();
        if (target.id === "v10SavingsSimulator") showSavingsSimulator();
      } catch (error) { handleV10Error(error); }
    });

    document.addEventListener("submit", async (event) => {
      try {
        if (event.target.id === "v10PushSettings") { event.preventDefault(); await savePushSettings(); }
        if (event.target.id === "v10ExcelSettings") {
          event.preventDefault();
          state.settings.excelIncludeAudit = Boolean(document.getElementById("v10ExcelAudit")?.checked);
          state.settings.excelIncludeRawIds = Boolean(document.getElementById("v10ExcelRawIds")?.checked);
          await encryptState();
          showToast("Opsi Excel disimpan.", "📗");
        }
      } catch (error) { handleV10Error(error); }
    });
  }

  function handleV10Error(error) {
    console.error(error);
    showToast(error?.message || "Operasi v10 gagal.", "❗");
  }

  const previousOpenRecurringForm = openRecurringForm;
  openRecurringForm = function v10OpenRecurringForm(existing = null) {
    previousOpenRecurringForm(existing);
    window.setTimeout(() => enhanceRecurringV10Form(existing), 45);
  };

  const previousCommit = commit;
  commit = async function v10Commit(action, detail, mutator) {
    const extras = pendingRecurringV10;
    pendingRecurringV10 = null;
    const beforeAmounts = new Map((state?.recurring || []).map((item) => [item.id, safeNumber(item.amount)]));
    const beforeIds = new Set((state?.recurring || []).map((item) => item.id));
    const wrapped = () => {
      mutator();
      if (extras && /Pembayaran rutin/i.test(action)) {
        const target = extras.editingId ? state.recurring.find((item) => item.id === extras.editingId) : state.recurring.find((item) => !beforeIds.has(item.id)) || state.recurring.at(-1);
        if (target) {
          const previousAmount = beforeAmounts.get(target.id);
          Object.assign(target, extras);
          delete target.editingId;
          target.priceHistory ||= [];
          if (previousAmount !== undefined && Math.abs(previousAmount - safeNumber(target.amount)) > 0.000001) {
            target.priceHistory.push({ from: previousAmount, to: safeNumber(target.amount), currency: target.currency || state.settings.baseCurrency, effectiveDate: nowIso(), note: target.priceNote || "Nominal diperbarui" });
            target.priceHistory = target.priceHistory.slice(-30);
          } else if (!target.priceHistory.length) {
            target.priceHistory.push({ amount: safeNumber(target.amount), currency: target.currency || state.settings.baseCurrency, effectiveDate: nowIso(), note: "Harga awal" });
          }
        }
      }
    };
    const result = await previousCommit(action, detail, wrapped);
    if (state?.settings?.pushEnabled && state.settings.autoSyncPushSchedules && /Transaksi|Pembayaran rutin|Langganan/i.test(action)) {
      window.setTimeout(() => syncPushSchedules().catch(() => {}), 500);
    }
    return result;
  };

  const previousRenderAll = renderAll;
  renderAll = function v10RenderAll() {
    if (state) ensureV10State();
    previousRenderAll();
    replaceExcelExportButton();
    renderSystemCenter();
    renderSubscriptionIntelligence();
    renderV10Changelog();
  };

  const previousChangeSection = changeSection;
  changeSection = function v10ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    if (sectionId === "system") renderSystemCenter();
    if (sectionId === "subscriptions") renderSubscriptionIntelligence();
    if (sectionId === "updates") renderV10Changelog();
  };

  const previousUnlockApplication = unlockApplication;
  unlockApplication = function v10UnlockApplication() {
    const changed = ensureV10State();
    previousUnlockApplication();
    if (changed) encryptState().catch(() => {});
    if (state.settings.pushEnabled && state.settings.autoSyncPushSchedules && navigator.onLine) window.setTimeout(() => syncPushSchedules().catch(() => {}), 1800);
    if (new URLSearchParams(location.search).get("open") === "reminders") {
      window.setTimeout(() => {
        document.getElementById("proReminderButton")?.click();
        const url = new URL(location.href);
        url.searchParams.delete("open");
        history.replaceState(null, "", url);
      }, 1200);
    }
  };

  injectV10UI();
})();
