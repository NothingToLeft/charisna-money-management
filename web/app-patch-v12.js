"use strict";

(() => {
  const VERSION = 12;
  const VERSION_LABEL = "v12 — PIN & Always-Latest Cloud";
  let nativeReminderSyncTimer = null;

  function ensureV12State() {
    if (!state) return false;
    let changed = false;
    state.settings ||= {};
    state.settings.migrationHistory ||= [];

    if (Number(state.appVersion || 0) < VERSION) {
      state.appVersion = VERSION;
      changed = true;
    }

    const requiredSettings = {
      cloudAutoSync: true,
      cloudPollMinutes: 1,
      cloudPolicy: "always-latest",
      autosaveOnLock: true,
      autosaveOnLogout: true,
      pinCredentialVersion: 1
    };

    Object.entries(requiredSettings).forEach(([key, value]) => {
      if (state.settings[key] !== value) {
        state.settings[key] = value;
        changed = true;
      }
    });

    if (!state.settings.migrationHistory.some((item) => Number(item.version) === VERSION)) {
      state.settings.migrationHistory.unshift({
        version: VERSION,
        label: VERSION_LABEL,
        migratedAt: new Date().toISOString(),
        status: "success"
      });
      state.settings.migrationHistory = state.settings.migrationHistory.slice(0, 30);
      changed = true;
    }

    return changed;
  }

  function injectV12UI() {
    const strip = document.getElementById("cloudAccountStrip");
    if (strip && !document.getElementById("v12CloudBadge")) {
      strip.insertAdjacentHTML(
        "afterend",
        '<div class="cloud-always-latest-badge" id="v12CloudBadge">☁️ Always-Latest · autosave aktif</div>'
      );
    }

    const securityForm = document.getElementById("changePasswordForm");
    if (securityForm && !document.getElementById("v12PinStatus")) {
      securityForm.insertAdjacentHTML(
        "beforebegin",
        '<div class="pro-success-box" id="v12PinStatus" style="margin-bottom:14px">🔐 PIN angka aktif · 6 angka disarankan</div>'
      );
    }

    if (window.CharisnaDesktop?.isDesktop && !document.getElementById("v12DesktopBadge")) {
      const accountStrip = document.getElementById("v12CloudBadge");
      accountStrip?.insertAdjacentHTML(
        "afterend",
        '<div class="cloud-always-latest-badge" id="v12DesktopBadge">🖥️ Desktop native · update otomatis</div>'
      );
      window.CharisnaDesktop.onUpdateStatus((status) => {
        if (status.state === "available") showToast(`Versi ${status.version} ditemukan dan sedang diunduh.`, "⬇️");
        if (status.state === "downloaded") showToast(`Versi ${status.version} siap dipasang saat aplikasi ditutup.`, "✅");
        if (status.state === "error") console.warn("Desktop updater:", status.message);
      });
    }

    refreshV12UI();
  }

  function refreshV12UI() {
    configureCredentialUI();

    const status = document.getElementById("v12PinStatus");
    if (status) {
      status.innerHTML = vaultUsesPin()
        ? `🔐 PIN angka aktif · ${Number(vault.pinLength || 6)} digit · enkripsi PBKDF2 diperkuat`
        : "⚠️ Brankas lama terdeteksi · migrasikan ke PIN setelah login";
    }

    const systemBadge = document.querySelector("#system .section-header .version-badge");
    if (systemBadge) systemBadge.textContent = VERSION_LABEL;

    const bannerStrong = document.querySelector("#v10PanelUpdate .v10-update-banner strong");
    if (bannerStrong && !/baru siap/i.test(bannerStrong.textContent)) {
      bannerStrong.textContent = "Aplikasi menggunakan v12";
    }

    const versionCards = document.querySelectorAll("#v10PanelUpdate .v10-stat strong");
    if (versionCards[0]) versionCards[0].textContent = "v12";
    const versionSmall = versionCards[0]?.parentElement?.querySelector("small");
    if (versionSmall) versionSmall.textContent = "PIN & Always-Latest Cloud";

    document.querySelectorAll(".version-badge").forEach((badge) => {
      if (/v11\.1.*Stability/i.test(badge.textContent)) {
        badge.textContent = VERSION_LABEL;
      }
    });
  }

  function renderV12Changelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container || document.getElementById("v12ReleaseCard")) return;
    container.insertAdjacentHTML("afterbegin", `
      <article class="release-card latest" id="v12ReleaseCard">
        <div class="release-head"><div><span class="release-kicker">VERSI TERBARU</span><h3>${VERSION_LABEL}</h3><p>PIN angka, cloud terbaru otomatis, autosave menyeluruh, dan pemulihan aman saat berganti perangkat.</p></div><span class="version-badge">v12</span></div>
        <div class="release-feature-grid">
          <div><span>🔢</span><p><strong>PIN Angka</strong>Pilih 4, 6, 8, atau 12 angka. Panel angka tersedia pada HP, tablet, dan PC.</p></div>
          <div><span>☁️</span><p><strong>Always-Latest</strong>Login dari perangkat lain langsung memakai cloud versi terbaru tanpa dialog konflik.</p></div>
          <div><span>💾</span><p><strong>Autosave Menyeluruh</strong>Setiap perubahan, lock, logout, aplikasi disembunyikan, dan koneksi kembali memicu sinkronisasi.</p></div>
          <div><span>🛟</span><p><strong>Recovery Terenkripsi</strong>Versi lokal dicadangkan sebelum cloud yang lebih baru diterapkan.</p></div>
          <div><span>⚡</span><p><strong>Realtime Multi-device</strong>Perubahan dari perangkat lain diterapkan otomatis selama aplikasi terbuka.</p></div>
          <div><span>🛡️</span><p><strong>Kompatibel</strong>Brankas bersandi lama tetap dapat dibuka sekali lalu dimigrasikan ke PIN.</p></div>
        </div>
        <div class="release-notes"><span>Semua platform</span><p>Satu basis data Supabase untuk Web/Netlify, Android, tablet, dan aplikasi PC native desktop.</p></div>
      </article>`);
    container.querySelectorAll(".release-card:not(#v12ReleaseCard)").forEach((card) => card.classList.remove("latest"));
  }

  const previousRenderAll = renderAll;
  renderAll = function v12RenderAll() {
    if (state) ensureV12State();
    previousRenderAll();
    refreshV12UI();
    renderV12Changelog();
  };

  const previousChangeSection = changeSection;
  changeSection = function v12ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    if (sectionId === "settings" || sectionId === "system") refreshV12UI();
    if (sectionId === "updates") renderV12Changelog();
  };

  const previousEncryptState = encryptState;
  encryptState = async function v12EncryptState() {
    const result = await previousEncryptState();
    if (window.CharisnaNativeReminders?.available || window.CharisnaDesktop?.isDesktop) {
      clearTimeout(nativeReminderSyncTimer);
      nativeReminderSyncTimer = window.setTimeout(() => {
        syncPlatformReminders().catch(console.warn);
      }, 700);
    }
    return result;
  };

  function desktopReminderSchedules() {
    if (!state?.settings?.billReminderEnabled) return [];
    const now = Date.now();
    const defaultDays = Array.isArray(state.settings.billReminderDays)
      ? state.settings.billReminderDays
      : [7, 3, 1, 0];
    const detailed = (state.settings.pushPrivacyMode || "generic") === "detailed";
    const items = [];

    (state.recurring || [])
      .filter((item) => item.active && item.type === "expense" && item.reminderEnabled !== false && item.nextDate)
      .forEach((item) => {
        const days = Array.isArray(item.reminderDays) && item.reminderDays.length
          ? item.reminderDays
          : defaultDays;
        days.forEach((daysBefore) => {
          const at = new Date(`${item.nextDate}T08:00:00`).getTime() - Number(daysBefore || 0) * 86400000;
          if (!Number.isFinite(at) || at <= now + 30000 || at > now + 180 * 86400000) return;
          items.push({
            id: `${item.id}|${item.nextDate}|${daysBefore}`,
            at,
            title: detailed ? `🧾 ${item.name}` : "🧾 Pengingat tagihan CHARISNA",
            body: detailed
              ? `${Number(daysBefore) === 0 ? "Jatuh tempo hari ini" : `${daysBefore} hari lagi`} · ${item.currency || "IDR"} ${Number(item.amount || 0).toLocaleString("id-ID")}`
              : Number(daysBefore) === 0
                ? "Ada tagihan yang jatuh tempo hari ini."
                : `Ada tagihan yang jatuh tempo ${daysBefore} hari lagi.`
          });
        });
      });
    return items;
  }

  async function syncPlatformReminders() {
    const tasks = [];
    if (window.CharisnaNativeReminders?.available) {
      tasks.push(window.CharisnaNativeReminders.sync());
    }
    if (window.CharisnaDesktop?.isDesktop) {
      tasks.push(window.CharisnaDesktop.syncReminders(desktopReminderSchedules()));
    }
    await Promise.allSettled(tasks);
  }

  const previousUnlockApplication = unlockApplication;
  unlockApplication = function v12UnlockApplication() {
    const changed = ensureV12State();
    previousUnlockApplication();
    refreshV12UI();
    renderV12Changelog();
    if (window.CharisnaNativeReminders?.available || window.CharisnaDesktop?.isDesktop) {
      window.setTimeout(() => syncPlatformReminders().catch(console.warn), 900);
    }
    if (changed) encryptState().catch(console.error);
  };

  injectV12UI();
})();
