"use strict";

(() => {
  const capacitor = window.Capacitor;
  const isNative = Boolean(capacitor?.isNativePlatform?.());

  if (!isNative) {
    return;
  }

  window.CHARISNA_NATIVE = true;
  document.documentElement.classList.add("capacitor-native");

  const plugins = capacitor.Plugins || {};
  const localNotifications = plugins.LocalNotifications;
  const nativeReminder = plugins.NativeReminder;
  const reminderBackendAvailable = Boolean(localNotifications || nativeReminder);

  function cancelNativeReminder(id) {
    if (localNotifications) {
      return localNotifications.cancel({ notifications: [{ id: Number(id) }] });
    }
    return nativeReminder.cancel({ id: Number(id) });
  }

  function scheduleNativeReminder({ id, title, body, at }) {
    if (localNotifications) {
      return localNotifications.schedule({
        notifications: [{
          id: Number(id),
          title: String(title || "CHARISNA Money Management"),
          body: String(body || ""),
          schedule: {
            at: new Date(Number(at)),
            allowWhileIdle: true
          },
          smallIcon: "ic_stat_charisna",
          iconColor: "#4f46e5"
        }]
      });
    }
    return nativeReminder.schedule({ id, title, body, at });
  }

  if (!("Notification" in window) && (localNotifications || nativeReminder)) {
    class NativeNotification {
      static permission = "default";

      static async requestPermission() {
        if (localNotifications) {
          const result = await localNotifications.requestPermissions();
          NativeNotification.permission = result.display === "granted"
            ? "granted"
            : "denied";
        } else {
          await nativeReminder.requestPermissions();
          NativeNotification.permission = "granted";
        }
        return NativeNotification.permission;
      }

      constructor(title, options = {}) {
        if (NativeNotification.permission !== "granted") {
          return;
        }

        const seed = `${title}|${options.body || ""}|${Date.now()}`;
        let id = 0;

        for (let index = 0; index < seed.length; index += 1) {
          id = ((id << 5) - id + seed.charCodeAt(index)) | 0;
        }

        const notificationId = Math.abs(id || Date.now()) % 2147483647;

        if (localNotifications) {
          localNotifications.schedule({
            notifications: [{
              id: notificationId,
              title: String(title || "CHARISNA Money Management"),
              body: String(options.body || ""),
              schedule: { at: new Date(Date.now() + 250) },
              smallIcon: "ic_stat_charisna",
              iconColor: "#4f46e5",
              extra: options.data || {}
            }]
          }).catch(console.warn);
        } else {
          nativeReminder.schedule({
            id: notificationId,
            title: String(title || "CHARISNA Money Management"),
            body: String(options.body || ""),
            at: Date.now() + 250
          }).catch(console.warn);
        }
      }
    }

    window.Notification = NativeNotification;

    if (localNotifications) {
      localNotifications.checkPermissions()
        .then((result) => {
          NativeNotification.permission = result.display === "granted"
            ? "granted"
            : result.display === "denied"
              ? "denied"
              : "default";
        })
        .catch(console.warn);
    } else {
      NativeNotification.permission = "granted";
    }
  }

  const NATIVE_REMINDER_IDS_KEY = "charisna-native-reminder-ids-v12";

  function nativeReminderId(value) {
    let hash = 0;
    const text = String(value || "reminder");
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }
    return Math.max(1, Math.abs(hash) % 2147483000);
  }

  async function syncNativeReminderSchedules() {
    if (
      !reminderBackendAvailable ||
      typeof state === "undefined" ||
      !state
    ) {
      return;
    }

    let previousIds = [];
    try {
      previousIds = JSON.parse(localStorage.getItem(NATIVE_REMINDER_IDS_KEY) || "[]");
    } catch {
      previousIds = [];
    }

    await Promise.allSettled(
      previousIds.map((id) => cancelNativeReminder(id))
    );

    if (!state.settings?.billReminderEnabled) {
      localStorage.setItem(NATIVE_REMINDER_IDS_KEY, "[]");
      return;
    }

    const now = Date.now();
    const defaultDays = Array.isArray(state.settings.billReminderDays)
      ? state.settings.billReminderDays
      : [7, 3, 1, 0];
    const privacy = state.settings.pushPrivacyMode || "generic";
    const nextIds = [];
    const schedules = [];

    (state.recurring || [])
      .filter((item) =>
        item.active &&
        item.type === "expense" &&
        item.reminderEnabled !== false &&
        item.nextDate
      )
      .forEach((item) => {
        const days = Array.isArray(item.reminderDays) && item.reminderDays.length
          ? item.reminderDays
          : defaultDays;

        days.forEach((daysBefore) => {
          const due = new Date(`${item.nextDate}T08:00:00`);
          const at = due.getTime() - Number(daysBefore || 0) * 86400000;
          if (!Number.isFinite(at) || at <= now + 30000 || at > now + 120 * 86400000) return;

          const id = nativeReminderId(`${item.id}|${item.nextDate}|${daysBefore}`);
          const detailed = privacy === "detailed";
          const title = detailed ? `🧾 ${item.name}` : "🧾 Pengingat tagihan CHARISNA";
          const body = detailed
            ? `${Number(daysBefore) === 0 ? "Jatuh tempo hari ini" : `${daysBefore} hari lagi`} · ${item.currency || "IDR"} ${Number(item.amount || 0).toLocaleString("id-ID")}`
            : Number(daysBefore) === 0
              ? "Ada tagihan yang jatuh tempo hari ini."
              : `Ada tagihan yang jatuh tempo ${daysBefore} hari lagi.`;

          nextIds.push(id);
          schedules.push(scheduleNativeReminder({ id, title, body, at }));
        });
      });

    await Promise.allSettled(schedules);
    localStorage.setItem(NATIVE_REMINDER_IDS_KEY, JSON.stringify(nextIds));
  }

  window.CharisnaNativeReminders = {
    sync: syncNativeReminderSchedules,
    available: reminderBackendAvailable
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.readAsDataURL(blob);
    });
  }

  function safeFilename(filename) {
    return String(filename || `charisna-export-${Date.now()}`)
      .replace(/[\\/:*?"<>|]+/g, "-")
      .slice(0, 120);
  }

  async function shareBlobNative(blob, filename) {
    const nativeFile = plugins.NativeFile;
    const filesystem = plugins.Filesystem;
    const share = plugins.Share;
    const cleanName = safeFilename(filename);
    const data = await blobToBase64(blob);

    if (nativeFile?.shareFile) {
      await nativeFile.shareFile({
        base64: data,
        filename: `${Date.now()}-${cleanName}`,
        mimeType: blob.type || "application/octet-stream"
      });
      return;
    }

    if (!filesystem || !share) {
      throw new Error("Fitur penyimpanan Android belum tersedia.");
    }

    const result = await filesystem.writeFile({
      path: `charisna-exports/${Date.now()}-${cleanName}`,
      data,
      directory: "CACHE",
      recursive: true
    });

    await share.share({
      title: cleanName,
      text: "Ekspor dari CHARISNA Money Management",
      url: result.uri,
      dialogTitle: "Simpan atau bagikan file"
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const originalDownloadBlob = window.downloadBlob;

    window.downloadBlob = async (blob, filename) => {
      try {
        await shareBlobNative(blob, filename);
        window.showToast?.("File siap disimpan atau dibagikan.", "📤");
      } catch (error) {
        console.warn(error);
        window.showToast?.("Penyimpanan Android gagal. Menggunakan unduhan biasa.", "⚠️");
        originalDownloadBlob?.(blob, filename);
      }
    };

    if (window.XLSX?.writeFile) {
      window.XLSX.writeFile = (workbook, filename, options = {}) => {
        const bytes = window.XLSX.write(workbook, {
          ...options,
          bookType: options.bookType || "xlsx",
          type: "array"
        });

        return window.downloadBlob(
          new Blob([bytes], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          filename
        );
      };
    }

    const jsPdf = window.jspdf?.jsPDF;

    if (jsPdf?.prototype?.save) {
      jsPdf.prototype.save = function saveNative(filename) {
        return window.downloadBlob(
          this.output("blob"),
          filename || `charisna-report-${Date.now()}.pdf`
        );
      };
    }

    const installButton = document.getElementById("proInstallApp");
    const installStatus = document.getElementById("proInstallStatus");

    if (installButton) {
      installButton.textContent = "✓ Aplikasi Android aktif";
      installButton.disabled = true;
    }

    if (installStatus) {
      installStatus.textContent = "Versi APK native sudah terpasang di perangkat ini.";
    }

    plugins.StatusBar?.setOverlaysWebView({ overlay: false }).catch(console.warn);
    plugins.StatusBar?.setBackgroundColor({ color: "#4f46e5" }).catch(console.warn);
    plugins.StatusBar?.setStyle({ style: "LIGHT" }).catch(console.warn);

    plugins.App?.addListener("backButton", () => {
      const modal = document.getElementById("modalBackdrop");

      if (modal && !modal.hidden) {
        window.closeModal?.();
        return;
      }

      const activeSection = document.querySelector(".content-section.active, .section.active");

      if (activeSection && activeSection.id !== "dashboard") {
        document.querySelector('[data-section="dashboard"]')?.click();
        return;
      }

      plugins.App.minimizeApp().catch(console.warn);
    });
  });
})();
