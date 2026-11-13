"use strict";

(() => {
  const VERSION = 14;
  const VERSION_LABEL = "v14.1.2 — Multi-User + SuperApp Sync + UI Polish";
  const RELEASE_VERSION = "14.1.2";
  const CROSS_PROFILE_TRANSFER_SCHEMA_VERSION = 1;
  const PRIMARY_COLOR = "#4f46e5";
  const USER_SETTING_KEYS = [
    "baseCurrency",
    "dashboardWidgets",
    "dashboardRange",
    "defaultDebtStrategy",
    "monthlyEssentialExpense",
    "calendarMode",
    "accountCategoryOrder",
    "accountOrder",
    "accountLayout",
    "accountSort",
    "accountShowZero",
    "accountShowArchived",
    "accountCollapsedGroups",
    "autoPostRecurring",
    "smartBudgetAlerts",
    "billReminderEnabled",
    "billReminderDays",
    "billReminderPopup",
    "billReminderLowBalance",
    "billReminderIncludeDebts",
    "billReminderIncludeCredit",
    "billReminderSnoozes",
    "lastBillReminderPopupDate",
    "billReminderTopUpBufferPercent",
    "onboardingDismissed"
  ];
  const PROFILE_SCOPED_COLLECTIONS = [
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
    "transactionTemplates",
    "categoryCatalog",
    "tagCatalog"
  ];
  const PROFILE_CONTENT_COLLECTIONS = PROFILE_SCOPED_COLLECTIONS.filter(
    (collectionName) => !["categoryCatalog", "tagCatalog"].includes(collectionName)
  );
  const PROFILE_TYPES = {
    self: { label: "Saya", icon: "🙋" },
    partner: { label: "Pasangan", icon: "💞" },
    business: { label: "Usaha", icon: "🏪" },
    family: { label: "Keluarga", icon: "👨‍👩‍👧" },
    project: { label: "Proyek", icon: "📋" },
    other: { label: "Lainnya", icon: "📒" }
  };

  let uiInjected = false;
  let migrationSaveQueued = false;

  const nowIsoV14 = () => new Date().toISOString();
  const safeCloneV14 = (value) => {
    try {
      return typeof structuredClone === "function"
        ? structuredClone(value)
        : JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  };

  function normalizeProfileType(type, index = 0) {
    if (PROFILE_TYPES[type]) return type;
    if (type === "personal") return index === 0 ? "self" : "other";
    if (type === "business") return "business";
    if (type === "family") return "family";
    if (type === "project") return "project";
    return index === 0 ? "self" : "other";
  }

  function activeProfiles() {
    return (state?.profiles || []).filter((profile) => !profile.archived);
  }

  function primaryProfile() {
    return (state?.profiles || []).find((profile) => profile.isPrimary)
      || activeProfiles()[0]
      || state?.profiles?.[0]
      || null;
  }

  function activeFinancialUserId() {
    if (!state) return "";
    const candidates = [
      state.settings?.activeFinancialUserId,
      state.settings?.activeBookId
    ];
    const selected = candidates.find((id) =>
      id && id !== "all" && activeProfiles().some((profile) => profile.id === id)
    );
    return selected || primaryProfile()?.id || "";
  }

  function activeFinancialUser() {
    return (state?.profiles || []).find((profile) => profile.id === activeFinancialUserId()) || null;
  }

  function belongsToActiveUser(item) {
    if (!item) return false;
    const activeId = activeFinancialUserId();
    if (!activeId) return true;
    return item.profileId === activeId;
  }

  function financialItems(collection) {
    return Array.isArray(collection) ? collection.filter(belongsToActiveUser) : [];
  }

  function profileTypeMeta(profile) {
    return PROFILE_TYPES[normalizeProfileType(profile?.userType || profile?.type)] || PROFILE_TYPES.other;
  }

  function profileLabel(profile) {
    return profileTypeMeta(profile).label;
  }

  function accountProfileId(accountId) {
    return state?.accounts?.find((account) => account.id === accountId)?.profileId || "";
  }

  function inferProfileId(item, fallbackId) {
    if (item?.profileId && state.profiles.some((profile) => profile.id === item.profileId)) {
      return item.profileId;
    }
    return accountProfileId(item?.accountId)
      || accountProfileId(item?.destinationAccountId)
      || fallbackId;
  }

  function profilePreferencesFromSettings() {
    const preferences = {};
    USER_SETTING_KEYS.forEach((key) => {
      if (state?.settings?.[key] !== undefined) {
        preferences[key] = safeCloneV14(state.settings[key]);
      }
    });
    return preferences;
  }

  function saveActiveProfilePreferences() {
    const profile = activeFinancialUser();
    if (!profile || !state?.settings) return;
    profile.preferences = {
      ...(profile.preferences || {}),
      ...profilePreferencesFromSettings()
    };
    profile.baseCurrency = state.settings.baseCurrency || profile.baseCurrency || "IDR";
    profile.updatedAt = nowIsoV14();
  }

  function loadProfilePreferences(profile) {
    if (!profile || !state?.settings) return;
    const preferences = profile.preferences || {};
    USER_SETTING_KEYS.forEach((key) => {
      if (preferences[key] !== undefined) {
        state.settings[key] = safeCloneV14(preferences[key]);
      }
    });
    state.settings.baseCurrency = profile.baseCurrency || preferences.baseCurrency || state.settings.baseCurrency || "IDR";
  }

  function ensureV14State() {
    if (!state) return false;
    let changed = false;
    state.settings ||= {};
    state.profiles ||= [];

    if (!state.profiles.length) {
      state.profiles.push({
        id: createId("financial-user"),
        name: state.settings.userName || "Saya",
        type: "self",
        userType: "self",
        icon: "🙋",
        color: PRIMARY_COLOR,
        members: [state.settings.userName || "Saya"],
        baseCurrency: state.settings.baseCurrency || "IDR",
        isPrimary: true,
        archived: false,
        notes: "",
        preferences: profilePreferencesFromSettings(),
        createdAt: nowIsoV14(),
        updatedAt: nowIsoV14()
      });
      changed = true;
    }

    let primaryAssigned = false;
    state.profiles.forEach((profile, index) => {
      const normalizedType = normalizeProfileType(profile.userType || profile.type, index);
      if (profile.userType !== normalizedType || profile.type !== normalizedType) {
        profile.userType = normalizedType;
        profile.type = normalizedType;
        changed = true;
      }
      const meta = profileTypeMeta(profile);
      if (!profile.name) { profile.name = index === 0 ? (state.settings.userName || "Saya") : `Akun ${index + 1}`; changed = true; }
      if (!profile.icon) { profile.icon = meta.icon; changed = true; }
      if (!profile.color) { profile.color = PRIMARY_COLOR; changed = true; }
      if (!Array.isArray(profile.members)) { profile.members = [profile.name]; changed = true; }
      if (!profile.members.length) { profile.members = [profile.name]; changed = true; }
      if (!profile.baseCurrency) { profile.baseCurrency = state.settings.baseCurrency || "IDR"; changed = true; }
      if (profile.archived === undefined) { profile.archived = false; changed = true; }
      if (profile.isPrimary && !primaryAssigned) primaryAssigned = true;
      else if (profile.isPrimary && primaryAssigned) { profile.isPrimary = false; changed = true; }
      if (!profile.preferences) {
        profile.preferences = { ...profilePreferencesFromSettings(), baseCurrency: profile.baseCurrency };
        changed = true;
      }
      if (!profile.createdAt) { profile.createdAt = nowIsoV14(); changed = true; }
      if (!profile.updatedAt) { profile.updatedAt = profile.createdAt; changed = true; }
      if (profile.notes === undefined) { profile.notes = ""; changed = true; }
    });

    if (!primaryAssigned) {
      const preferredPrimary = state.profiles.find((profile) => profile.id === "profile-personal") || state.profiles[0];
      if (preferredPrimary) {
        preferredPrimary.isPrimary = true;
        preferredPrimary.archived = false;
        changed = true;
      }
    }

    const fallbackId = activeFinancialUserId() || primaryProfile()?.id || state.profiles[0]?.id || "";
    PROFILE_SCOPED_COLLECTIONS.forEach((collectionName) => {
      state[collectionName] ||= [];
      state[collectionName].forEach((item) => {
        const inferred = inferProfileId(item, fallbackId);
        if (item.profileId !== inferred) {
          item.profileId = inferred;
          changed = true;
        }
      });
    });

    const categorySeed = (state.categoryCatalog || []).filter(
      (item) => item.builtinKey || String(item.id || "").startsWith("v13-category-")
    );
    state.profiles.forEach((profile) => {
      const existingNames = new Set(
        state.categoryCatalog
          .filter((item) => item.profileId === profile.id)
          .map((item) => String(item.name || "").trim().toLocaleLowerCase("id-ID"))
      );
      categorySeed.forEach((item, index) => {
        const key = String(item.name || "").trim().toLocaleLowerCase("id-ID");
        if (!key || existingNames.has(key)) return;
        state.categoryCatalog.push({
          ...safeCloneV14(item),
          id: createId("category"),
          profileId: profile.id,
          order: index,
          createdAt: nowIsoV14(),
          updatedAt: nowIsoV14()
        });
        existingNames.add(key);
        changed = true;
      });
    });

    const activeId = activeFinancialUserId();
    if (state.settings.activeFinancialUserId !== activeId) {
      state.settings.activeFinancialUserId = activeId;
      changed = true;
    }
    if (state.settings.activeBookId !== activeId) {
      state.settings.activeBookId = activeId;
      changed = true;
    }
    if (state.settings.multiUserVersion !== VERSION) {
      state.settings.multiUserVersion = VERSION;
      changed = true;
    }
    if (state.settings.crossProfileTransferVersion !== CROSS_PROFILE_TRANSFER_SCHEMA_VERSION) {
      state.settings.crossProfileTransferVersion = CROSS_PROFILE_TRANSFER_SCHEMA_VERSION;
      changed = true;
    }
    state.settings.migrationHistory ||= [];
    const v14Entry = state.settings.migrationHistory.find((item) => Number(item.version) === VERSION);
    if (!v14Entry) {
      state.settings.migrationHistory.unshift({
        version: VERSION,
        label: VERSION_LABEL,
        migratedAt: nowIsoV14(),
        status: "success"
      });
      state.settings.migrationHistory = state.settings.migrationHistory.slice(0, 30);
      changed = true;
    } else if (v14Entry.label !== VERSION_LABEL) {
      v14Entry.label = VERSION_LABEL;
      v14Entry.migratedAt = nowIsoV14();
      changed = true;
    }
    state.appVersion = Math.max(Number(state.appVersion) || 0, VERSION);
    return changed;
  }

  function queueMigrationSave() {
    if (migrationSaveQueued || !currentKey || !state) return;
    migrationSaveQueued = true;
    window.setTimeout(async () => {
      migrationSaveQueued = false;
      try {
        await encryptState();
      } catch (error) {
        console.error("Gagal menyimpan migrasi multi-user:", error);
      }
    }, 120);
  }

  async function switchFinancialUser(profileId, { persist = true, announce = true } = {}) {
    if (!state) return;
    const target = state.profiles.find((profile) => profile.id === profileId && !profile.archived);
    if (!target || target.id === activeFinancialUserId()) {
      closeUserMenu();
      return;
    }

    saveActiveProfilePreferences();
    state.settings.activeFinancialUserId = target.id;
    state.settings.activeBookId = target.id;
    loadProfilePreferences(target);
    renderAll();
    renderFinancialUserChrome();
    closeUserMenu();

    if (persist && currentKey) await encryptState();
    if (announce) showToast(`Akun keuangan aktif: ${target.name}`, target.icon || "👤");
  }

  function profileDataCounts(profileId) {
    const counts = {};
    let total = 0;
    PROFILE_CONTENT_COLLECTIONS.forEach((collectionName) => {
      const count = (state?.[collectionName] || []).filter((item) => item.profileId === profileId).length;
      counts[collectionName] = count;
      total += count;
    });
    return { counts, total };
  }


  function numericValue(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function profileById(profileId) {
    return (state?.profiles || []).find((profile) => profile.id === profileId) || null;
  }

  function accountById(accountId) {
    return (state?.accounts || []).find((account) => account.id === accountId) || null;
  }

  function activeAccountsForProfile(profileId) {
    return (state?.accounts || []).filter(
      (account) => account.profileId === profileId && !account.archived
    );
  }

  function crossTransferTransactions(transferId) {
    return (state?.transactions || []).filter(
      (transaction) => transaction.crossProfileTransferId === transferId
    );
  }

  function crossTransferDetails(transferOrTransaction) {
    const transferId = typeof transferOrTransaction === "string"
      ? transferOrTransaction
      : transferOrTransaction?.crossProfileTransferId;
    const rows = transferId ? crossTransferTransactions(transferId) : [];
    const outgoing = rows.find((transaction) => transaction.crossProfileRole === "outgoing") || null;
    const incoming = rows.find((transaction) => transaction.crossProfileRole === "incoming") || null;
    const reference = outgoing || incoming || (typeof transferOrTransaction === "object" ? transferOrTransaction : null);
    if (!reference) return null;

    const sourceProfileId = reference.sourceProfileId || outgoing?.profileId || accountProfileId(reference.sourceAccountId);
    const destinationProfileId = reference.destinationProfileId || incoming?.profileId || accountProfileId(reference.targetAccountId);
    const sourceAccountId = reference.sourceAccountId || outgoing?.accountId || incoming?.destinationAccountId;
    const targetAccountId = reference.targetAccountId || incoming?.accountId || outgoing?.destinationAccountId;

    return {
      transferId: transferId || reference.crossProfileTransferId,
      rows,
      outgoing,
      incoming,
      reference,
      sourceProfileId,
      destinationProfileId,
      sourceAccountId,
      targetAccountId,
      sourceProfile: profileById(sourceProfileId),
      destinationProfile: profileById(destinationProfileId),
      sourceAccount: accountById(sourceAccountId),
      targetAccount: accountById(targetAccountId),
      sourceAmount: numericValue(reference.sourceAmount, numericValue(outgoing?.amount, 0)),
      receivedAmount: numericValue(reference.receivedAmount, numericValue(incoming?.amount, numericValue(outgoing?.destinationAmount, 0))),
      fee: numericValue(reference.fee, numericValue(outgoing?.fee, numericValue(incoming?.sourceFee, 0)))
    };
  }

  function crossProfileOptionMarkup(selectedId, excludedId = "") {
    return activeProfiles()
      .filter((profile) => profile.id !== excludedId)
      .map((profile) => `
        <option value="${profile.id}" ${profile.id === selectedId ? "selected" : ""}>
          ${escapeHTML(profile.icon || profileTypeMeta(profile).icon)} ${escapeHTML(profile.name)} · ${escapeHTML(profileLabel(profile))}
        </option>`)
      .join("");
  }

  function crossAccountOptionMarkup(profileId, selectedId = "") {
    const accounts = activeAccountsForProfile(profileId);
    if (!accounts.length) return '<option value="">Belum ada dompet/rekening</option>';
    return accounts.map((account) => `
      <option value="${account.id}" ${account.id === selectedId ? "selected" : ""}>
        ${escapeHTML(account.icon || "👛")} ${escapeHTML(account.name)} · ${escapeHTML(account.currency || "IDR")}
      </option>`).join("");
  }

  function estimatedDestinationAmount(sourceAmount, sourceCurrency, targetCurrency) {
    if (!sourceCurrency || !targetCurrency) return 0;
    if (sourceCurrency === targetCurrency) return numericValue(sourceAmount, 0);
    return numericValue(convertCurrency(numericValue(sourceAmount, 0), sourceCurrency, targetCurrency), 0);
  }

  function openCrossProfileTransferForm(transferOrTransaction = null) {
    if (!state) return;
    const existing = crossTransferDetails(transferOrTransaction);
    const sourceProfile = existing?.sourceProfile || activeFinancialUser();
    const destinationProfile = existing?.destinationProfile
      || activeProfiles().find((profile) => profile.id !== sourceProfile?.id)
      || null;

    if (activeProfiles().length < 2) {
      showToast("Tambahkan minimal dua akun keuangan terlebih dahulu.", "👥");
      openFinancialUserForm();
      return;
    }

    const sourceAccount = existing?.sourceAccount || activeAccountsForProfile(sourceProfile?.id)[0] || null;
    const targetAccount = existing?.targetAccount || activeAccountsForProfile(destinationProfile?.id)[0] || null;
    const sourceAmount = existing?.sourceAmount || "";
    const receivedAmount = existing?.receivedAmount || "";
    const fee = existing?.fee || 0;
    const reference = existing?.reference || {};

    showModal(
      existing ? "Edit Transfer Antar Akun" : "Transfer Antar Akun Keuangan",
      "Pindahkan uang antar buku tanpa mencampur laporan operasional. Saldo dan histori kedua akun diperbarui sebagai satu transfer terhubung.",
      `
        <form id="v14CrossProfileTransferForm">
          <div class="v14-transfer-flow" id="v14TransferFlowPreview"></div>
          <div class="form-grid">
            <label class="field">
              <span>Dari akun keuangan</span>
              <select class="input" id="v14TransferSourceProfile" required>
                ${crossProfileOptionMarkup(sourceProfile?.id || "")}
              </select>
            </label>
            <label class="field">
              <span>Ke akun keuangan</span>
              <select class="input" id="v14TransferDestinationProfile" required>
                ${crossProfileOptionMarkup(destinationProfile?.id || "", sourceProfile?.id || "")}
              </select>
            </label>
            <label class="field">
              <span>Dompet/rekening sumber</span>
              <select class="input" id="v14TransferSourceAccount" required>
                ${crossAccountOptionMarkup(sourceProfile?.id || "", sourceAccount?.id || "")}
              </select>
              <small class="v14-transfer-balance" id="v14TransferSourceBalance"></small>
            </label>
            <label class="field">
              <span>Dompet/rekening tujuan</span>
              <select class="input" id="v14TransferDestinationAccount" required>
                ${crossAccountOptionMarkup(destinationProfile?.id || "", targetAccount?.id || "")}
              </select>
            </label>
            <label class="field">
              <span>Tanggal</span>
              <input class="input" id="v14TransferDate" type="date" value="${escapeHTML(reference.date || localISO())}" required />
            </label>
            <label class="field">
              <span>Status</span>
              <select class="input" id="v14TransferStatus">
                <option value="completed" ${reference.status !== "pending" && reference.status !== "cancelled" ? "selected" : ""}>Selesai</option>
                <option value="pending" ${reference.status === "pending" ? "selected" : ""}>Pending</option>
                <option value="cancelled" ${reference.status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
              </select>
            </label>
            <label class="field full">
              <span>Nama transfer</span>
              <input class="input" id="v14TransferDescription" value="${escapeHTML(reference.description || "")}" placeholder="Contoh: Setoran hasil kos ke personal" />
            </label>
            <label class="field">
              <span>Nominal dari sumber</span>
              <input class="input" id="v14TransferSourceAmount" type="number" min="0.00000001" step="any" value="${sourceAmount}" required />
              <button class="v14-inline-action" id="v14UseAvailableBalance" type="button">Gunakan saldo tersedia</button>
            </label>
            <label class="field">
              <span>Nominal diterima</span>
              <input class="input" id="v14TransferReceivedAmount" type="number" min="0.00000001" step="any" value="${receivedAmount}" required />
              <button class="v14-inline-action" id="v14UseEstimatedRate" type="button">Gunakan estimasi kurs</button>
            </label>
            <label class="field">
              <span>Biaya transfer</span>
              <input class="input" id="v14TransferFee" type="number" min="0" step="any" value="${fee}" />
            </label>
            <div class="field v14-transfer-rate-card">
              <span>Ringkasan kurs</span>
              <strong id="v14TransferRateSummary">—</strong>
              <small>Nominal diterima dapat disesuaikan dengan jumlah nyata dari bank.</small>
            </div>
            <label class="field full">
              <span>Catatan</span>
              <textarea id="v14TransferNotes" placeholder="Catatan opsional">${escapeHTML(reference.notes || "")}</textarea>
            </label>
          </div>
          <aside class="v14-transfer-report-note">
            <span>📊</span>
            <p><strong>Tidak menggandakan omzet</strong><small>Transfer mengubah saldo kedua akun, tetapi dikecualikan dari total pemasukan dan pengeluaran operasional.</small></p>
          </aside>
          <div class="form-actions">
            <button class="button secondary" id="cancelModalButton" type="button">Batal</button>
            <button class="button primary" type="submit">${existing ? "Simpan Perubahan" : "Transfer Sekarang"}</button>
          </div>
        </form>`
    );

    const sourceProfileSelect = document.getElementById("v14TransferSourceProfile");
    const destinationProfileSelect = document.getElementById("v14TransferDestinationProfile");
    const sourceAccountSelect = document.getElementById("v14TransferSourceAccount");
    const destinationAccountSelect = document.getElementById("v14TransferDestinationAccount");
    const sourceAmountInput = document.getElementById("v14TransferSourceAmount");
    const receivedAmountInput = document.getElementById("v14TransferReceivedAmount");
    const feeInput = document.getElementById("v14TransferFee");
    let destinationAmountEdited = Boolean(existing?.receivedAmount);

    function selectedSourceAccount() {
      return accountById(sourceAccountSelect.value);
    }

    function selectedTargetAccount() {
      return accountById(destinationAccountSelect.value);
    }

    function refreshDestinationProfiles() {
      const sourceId = sourceProfileSelect.value;
      const previousDestination = destinationProfileSelect.value;
      destinationProfileSelect.innerHTML = crossProfileOptionMarkup(previousDestination, sourceId);
      if (!destinationProfileSelect.value) {
        destinationProfileSelect.value = activeProfiles().find((profile) => profile.id !== sourceId)?.id || "";
      }
    }

    function refreshAccountOptions({ preserveSource = true, preserveDestination = true } = {}) {
      const sourceSelected = preserveSource ? sourceAccountSelect.value : "";
      const destinationSelected = preserveDestination ? destinationAccountSelect.value : "";
      sourceAccountSelect.innerHTML = crossAccountOptionMarkup(sourceProfileSelect.value, sourceSelected);
      destinationAccountSelect.innerHTML = crossAccountOptionMarkup(destinationProfileSelect.value, destinationSelected);
    }

    function updateTransferSummary({ forceEstimate = false } = {}) {
      const sourceAccountItem = selectedSourceAccount();
      const targetAccountItem = selectedTargetAccount();
      const amount = numericValue(sourceAmountInput.value, 0);
      const sourceCurrency = sourceAccountItem?.currency || "IDR";
      const targetCurrency = targetAccountItem?.currency || "IDR";
      const estimate = estimatedDestinationAmount(amount, sourceCurrency, targetCurrency);

      if (sourceCurrency === targetCurrency || forceEstimate || !destinationAmountEdited || !numericValue(receivedAmountInput.value, 0)) {
        receivedAmountInput.value = estimate ? String(Math.round((estimate + Number.EPSILON) * 1000000) / 1000000) : "";
        destinationAmountEdited = sourceCurrency !== targetCurrency && !forceEstimate ? destinationAmountEdited : false;
      }
      receivedAmountInput.readOnly = sourceCurrency === targetCurrency;
      document.getElementById("v14UseEstimatedRate").hidden = sourceCurrency === targetCurrency;

      const balance = sourceAccountItem ? accountBalance(sourceAccountItem) : 0;
      const feeValue = numericValue(feeInput.value, 0);
      document.getElementById("v14TransferSourceBalance").textContent = sourceAccountItem
        ? `Saldo saat ini: ${formatCurrency(balance, sourceCurrency)} · Total keluar: ${formatCurrency(amount + feeValue, sourceCurrency)}`
        : "Pilih dompet/rekening sumber.";

      const sourceProfileItem = profileById(sourceProfileSelect.value);
      const destinationProfileItem = profileById(destinationProfileSelect.value);
      document.getElementById("v14TransferFlowPreview").innerHTML = `
        <article style="--v14-profile-color:${sourceProfileItem?.color || PRIMARY_COLOR}">
          <span>${escapeHTML(sourceProfileItem?.icon || "📒")}</span><p><strong>${escapeHTML(sourceProfileItem?.name || "Sumber")}</strong><small>${escapeHTML(sourceAccountItem?.name || "Pilih rekening")}</small></p>
        </article>
        <b>→</b>
        <article style="--v14-profile-color:${destinationProfileItem?.color || PRIMARY_COLOR}">
          <span>${escapeHTML(destinationProfileItem?.icon || "📒")}</span><p><strong>${escapeHTML(destinationProfileItem?.name || "Tujuan")}</strong><small>${escapeHTML(targetAccountItem?.name || "Pilih rekening")}</small></p>
        </article>`;

      const received = numericValue(receivedAmountInput.value, 0);
      const rate = amount > 0 ? received / amount : 0;
      document.getElementById("v14TransferRateSummary").textContent = amount > 0 && received > 0
        ? `1 ${sourceCurrency} = ${rate.toLocaleString("id-ID", { maximumFractionDigits: 8 })} ${targetCurrency}`
        : `${sourceCurrency} → ${targetCurrency}`;
    }

    sourceProfileSelect.addEventListener("change", () => {
      refreshDestinationProfiles();
      refreshAccountOptions({ preserveSource: false, preserveDestination: true });
      destinationAmountEdited = false;
      updateTransferSummary({ forceEstimate: true });
    });
    destinationProfileSelect.addEventListener("change", () => {
      refreshAccountOptions({ preserveSource: true, preserveDestination: false });
      destinationAmountEdited = false;
      updateTransferSummary({ forceEstimate: true });
    });
    sourceAccountSelect.addEventListener("change", () => { destinationAmountEdited = false; updateTransferSummary({ forceEstimate: true }); });
    destinationAccountSelect.addEventListener("change", () => { destinationAmountEdited = false; updateTransferSummary({ forceEstimate: true }); });
    sourceAmountInput.addEventListener("input", () => updateTransferSummary());
    receivedAmountInput.addEventListener("input", () => { destinationAmountEdited = true; updateTransferSummary(); });
    feeInput.addEventListener("input", () => updateTransferSummary());
    document.getElementById("v14UseEstimatedRate").addEventListener("click", () => {
      destinationAmountEdited = false;
      updateTransferSummary({ forceEstimate: true });
    });
    document.getElementById("v14UseAvailableBalance").addEventListener("click", () => {
      const sourceAccountItem = selectedSourceAccount();
      if (!sourceAccountItem) return;
      const feeValue = numericValue(feeInput.value, 0);
      sourceAmountInput.value = String(Math.max(accountBalance(sourceAccountItem) - feeValue, 0));
      destinationAmountEdited = false;
      updateTransferSummary({ forceEstimate: true });
    });
    document.getElementById("cancelModalButton").addEventListener("click", closeModal);

    refreshDestinationProfiles();
    refreshAccountOptions();
    updateTransferSummary({ forceEstimate: !existing });

    document.getElementById("v14CrossProfileTransferForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const sourceProfileId = sourceProfileSelect.value;
      const destinationProfileId = destinationProfileSelect.value;
      const sourceAccountItem = selectedSourceAccount();
      const targetAccountItem = selectedTargetAccount();
      const sourceProfileItem = profileById(sourceProfileId);
      const destinationProfileItem = profileById(destinationProfileId);
      const sourceAmountValue = numericValue(sourceAmountInput.value, 0);
      const receivedAmountValue = numericValue(receivedAmountInput.value, 0);
      const feeValue = numericValue(feeInput.value, 0);

      if (!sourceProfileItem || !destinationProfileItem || sourceProfileId === destinationProfileId) {
        showToast("Pilih dua akun keuangan yang berbeda.", "❗");
        return;
      }
      if (!sourceAccountItem || sourceAccountItem.profileId !== sourceProfileId) {
        showToast("Dompet/rekening sumber tidak valid.", "❗");
        return;
      }
      if (!targetAccountItem || targetAccountItem.profileId !== destinationProfileId) {
        showToast("Dompet/rekening tujuan tidak valid.", "❗");
        return;
      }
      if (!(sourceAmountValue > 0) || !(receivedAmountValue > 0) || feeValue < 0) {
        showToast("Nominal transfer harus lebih dari nol dan biaya tidak boleh negatif.", "❗");
        return;
      }

      const transferId = existing?.transferId || createId("cross-transfer");
      const outgoingId = existing?.outgoing?.id || createId("tx");
      const incomingId = existing?.incoming?.id || createId("tx");
      const now = nowIsoV14();
      const createdAt = existing?.reference?.createdAt || now;
      const date = document.getElementById("v14TransferDate").value;
      const status = document.getElementById("v14TransferStatus").value;
      const description = document.getElementById("v14TransferDescription").value.trim()
        || `Transfer ${sourceProfileItem.name} ke ${destinationProfileItem.name}`;
      const notes = document.getElementById("v14TransferNotes").value.trim();
      const sourceRate = numericValue(convertCurrency(1, sourceAccountItem.currency, sourceProfileItem.baseCurrency || state.settings.baseCurrency), 1);
      const targetRate = numericValue(convertCurrency(1, targetAccountItem.currency, destinationProfileItem.baseCurrency || state.settings.baseCurrency), 1);
      const shared = {
        crossProfileTransferId: transferId,
        transferKind: "cross-profile",
        sourceProfileId,
        destinationProfileId,
        sourceAccountId: sourceAccountItem.id,
        targetAccountId: targetAccountItem.id,
        sourceAmount: sourceAmountValue,
        receivedAmount: receivedAmountValue,
        sourceCurrency: sourceAccountItem.currency,
        targetCurrency: targetAccountItem.currency,
        description,
        merchant: `${sourceProfileItem.name} → ${destinationProfileItem.name}`,
        date,
        category: "Transfer Antar Akun",
        tags: ["transfer-antar-akun"],
        notes,
        status,
        deductible: false,
        reconciled: false,
        splits: [],
        attachmentIds: existing?.reference?.attachmentIds || [],
        createdAt,
        updatedAt: now
      };
      const outgoing = {
        ...shared,
        id: outgoingId,
        linkedTransactionId: incomingId,
        crossProfileRole: "outgoing",
        type: "transfer",
        profileId: sourceProfileId,
        accountId: sourceAccountItem.id,
        destinationAccountId: targetAccountItem.id,
        amount: sourceAmountValue,
        destinationAmount: receivedAmountValue,
        fee: feeValue,
        sourceFee: feeValue,
        currency: sourceAccountItem.currency,
        baseCurrency: sourceProfileItem.baseCurrency || state.settings.baseCurrency,
        historicalRate: sourceRate,
        baseAmount: sourceAmountValue * sourceRate
      };
      const incoming = {
        ...shared,
        id: incomingId,
        linkedTransactionId: outgoingId,
        crossProfileRole: "incoming",
        type: "transfer",
        profileId: destinationProfileId,
        accountId: targetAccountItem.id,
        destinationAccountId: sourceAccountItem.id,
        amount: receivedAmountValue,
        destinationAmount: receivedAmountValue,
        fee: 0,
        sourceFee: feeValue,
        currency: targetAccountItem.currency,
        baseCurrency: destinationProfileItem.baseCurrency || state.settings.baseCurrency,
        historicalRate: targetRate,
        baseAmount: receivedAmountValue * targetRate
      };

      await commit(
        existing ? "Transfer antar akun diperbarui" : "Transfer antar akun ditambahkan",
        `${sourceProfileItem.name} → ${destinationProfileItem.name}: ${description}`,
        () => {
          state.transactions = (state.transactions || []).filter(
            (transaction) => transaction.crossProfileTransferId !== transferId
          );
          state.transactions.push(outgoing, incoming);
          state.settings.crossProfileTransferVersion = CROSS_PROFILE_TRANSFER_SCHEMA_VERSION;
        }
      );
      closeModal();
      showToast(
        `${formatCurrency(sourceAmountValue, sourceAccountItem.currency)} dipindahkan dari ${sourceProfileItem.name} ke ${destinationProfileItem.name}.`,
        "⇄"
      );
    });
  }

  async function deleteCrossProfileTransfer(transferId) {
    const details = crossTransferDetails(transferId);
    if (!details) return;
    const label = `${details.sourceProfile?.name || "Sumber"} → ${details.destinationProfile?.name || "Tujuan"}`;
    if (!confirm(`Hapus transfer terhubung “${details.reference.description}” (${label}) dari kedua akun keuangan?`)) return;
    await commit("Transfer antar akun dihapus", `${label}: ${details.reference.description}`, () => {
      state.transactions = (state.transactions || []).filter(
        (transaction) => transaction.crossProfileTransferId !== transferId
      );
    });
    showToast("Transfer dihapus dari kedua akun keuangan.", "🗑️");
  }

  function crossProfileTransactionRow(transaction) {
    const details = crossTransferDetails(transaction);
    if (!details) return "";
    const incoming = transaction.crossProfileRole === "incoming";
    const amount = incoming ? details.receivedAmount : details.sourceAmount;
    const currency = incoming ? details.targetAccount?.currency : details.sourceAccount?.currency;
    const roleLabel = incoming ? "Transfer masuk" : "Transfer keluar";
    const counterparty = incoming ? details.sourceProfile : details.destinationProfile;
    const account = incoming ? details.targetAccount : details.sourceAccount;
    const counterpartyAccount = incoming ? details.sourceAccount : details.targetAccount;
    const feeNote = !incoming && details.fee > 0
      ? `<small>Biaya ${formatCurrency(details.fee, details.sourceAccount?.currency)}</small>`
      : "";

    return `
      <tr data-v14-cross-transfer-row="${transaction.id}" data-v14-transfer-id="${details.transferId}">
        <td>
          <div class="transaction-main">
            <div class="transaction-icon v14-cross-transfer-icon">⇄</div>
            <div><strong>${escapeHTML(transaction.description)}</strong><small>${roleLabel} · ${escapeHTML(counterparty?.name || "Akun lain")}</small></div>
          </div>
        </td>
        <td>
          ${escapeHTML(account?.name || "Akun dihapus")}
          <br><small>${incoming ? "← dari" : "→ ke"} ${escapeHTML(counterpartyAccount?.name || "Akun dihapus")} · ${escapeHTML(counterparty?.name || "Akun lain")}</small>
        </td>
        <td>${formatDate(transaction.date)}</td>
        <td><span class="badge v14-transfer-badge">Antar akun</span></td>
        <td><span class="badge">${escapeHTML(transaction.status)} · terhubung</span></td>
        <td class="money ${incoming ? "positive" : "negative"}"><strong>${incoming ? "+" : "-"} ${formatCurrency(amount, currency)}</strong>${feeNote}</td>
        <td>
          <div class="table-actions">
            <button class="mini-button" data-edit-transaction="${transaction.id}" data-v14-edit-cross-transfer="${details.transferId}" type="button" title="Edit transfer terhubung">✏️</button>
            <button class="mini-button" data-v14-delete-cross-transfer="${details.transferId}" type="button" title="Hapus dari kedua akun">🗑️</button>
          </div>
        </td>
      </tr>`;
  }

  function normalizeRenderedCrossProfileTransfers() {
    document.querySelectorAll("[data-v14-cross-transfer-row]").forEach((row) => {
      const editButton = row.querySelector("[data-v14-edit-cross-transfer]");
      editButton?.removeAttribute("data-edit-transaction");
      row.querySelectorAll('[data-pro-action="duplicate-tx"], [data-pro-action="refund-tx"]').forEach((button) => button.remove());
    });

    document.querySelectorAll("#proMobileTransactions .pro-mobile-transaction-card").forEach((card) => {
      const genericEdit = card.querySelector("[data-edit-transaction]");
      const transaction = genericEdit
        ? state.transactions.find((item) => item.id === genericEdit.dataset.editTransaction)
        : null;
      if (!transaction?.crossProfileTransferId) return;
      const details = crossTransferDetails(transaction);
      if (!details) return;
      const incoming = transaction.crossProfileRole === "incoming";
      card.dataset.v14TransferId = details.transferId;
      genericEdit.removeAttribute("data-edit-transaction");
      genericEdit.dataset.v14EditCrossTransfer = details.transferId;
      genericEdit.textContent = "Edit transfer";
      card.querySelectorAll('[data-pro-action="duplicate-tx"], [data-pro-action="refund-tx"]').forEach((button) => button.remove());
      const actions = card.querySelector(".pro-card-actions");
      if (actions && !actions.querySelector("[data-v14-delete-cross-transfer]")) {
        actions.insertAdjacentHTML("beforeend", `<button class="mini-button" data-v14-delete-cross-transfer="${details.transferId}" type="button">🗑️</button>`);
      }
      const amountElement = card.querySelector(".card-top > .money");
      if (amountElement) {
        amountElement.classList.remove("positive", "negative");
        amountElement.classList.add(incoming ? "positive" : "negative");
        amountElement.textContent = `${incoming ? "+" : "-"}${formatCurrency(incoming ? details.receivedAmount : details.sourceAmount, incoming ? details.targetAccount?.currency : details.sourceAccount?.currency)}`;
      }
      const chipRow = card.querySelector(".pro-chip-row");
      if (chipRow) {
        chipRow.innerHTML = `<span class="pro-chip">⇄ ${incoming ? "Masuk dari" : "Keluar ke"} ${escapeHTML((incoming ? details.sourceProfile : details.destinationProfile)?.name || "Akun lain")}</span>`;
      }
    });
  }

  function injectFinancialUserUI() {
    if (uiInjected) return;
    const topbar = document.querySelector(".topbar");
    const actions = topbar?.querySelector(".topbar-actions");
    if (!topbar || !actions) return;
    uiInjected = true;

    actions.insertAdjacentHTML("beforebegin", `
      <div class="v14-user-switcher" id="v14UserSwitcher">
        <button class="v14-user-trigger" id="v14UserTrigger" type="button" aria-haspopup="menu" aria-expanded="false">
          <span class="v14-user-avatar" id="v14UserAvatar">👤</span>
          <span class="v14-user-copy"><strong id="v14UserName">Akun Keuangan</strong><small id="v14UserType">Memuat...</small></span>
          <span class="v14-user-chevron">⌄</span>
        </button>
        <div class="v14-user-menu" id="v14UserMenu" role="menu" hidden></div>
      </div>
    `);

    const addTransactionButton = document.getElementById("addTransactionButton");
    if (addTransactionButton && !document.getElementById("v14CrossProfileTransferButton")) {
      addTransactionButton.insertAdjacentHTML("beforebegin", `
        <button class="button secondary v14-cross-transfer-button" id="v14CrossProfileTransferButton" data-v14-cross-transfer type="button" title="Pindahkan uang antar akun keuangan">
          <span>⇄</span><span>Antar Akun</span>
        </button>`);
    }
  }

  function renderFinancialUserChrome() {
    if (!state) return;
    injectFinancialUserUI();
    const profile = activeFinancialUser();
    if (!profile) return;

    const avatar = document.getElementById("v14UserAvatar");
    const name = document.getElementById("v14UserName");
    const type = document.getElementById("v14UserType");
    const menu = document.getElementById("v14UserMenu");
    if (avatar) {
      avatar.textContent = profile.icon || profileTypeMeta(profile).icon;
      avatar.style.setProperty("--v14-user-color", profile.color || PRIMARY_COLOR);
    }
    if (name) name.textContent = profile.name;
    if (type) type.textContent = `${profileLabel(profile)} · ${profile.baseCurrency || state.settings.baseCurrency}`;
    if (menu) {
      menu.innerHTML = `
        <div class="v14-menu-heading"><span>Ganti akun keuangan</span><small>Data setiap akun dipisahkan</small></div>
        <div class="v14-user-options">
          ${activeProfiles().map((item) => `
            <button class="v14-user-option ${item.id === profile.id ? "active" : ""}" data-v14-switch-user="${item.id}" role="menuitem" type="button">
              <span class="v14-user-option-avatar" style="--v14-profile-color:${item.color || PRIMARY_COLOR}">${escapeHTML(item.icon || profileTypeMeta(item).icon)}</span>
              <span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(profileLabel(item))} · ${escapeHTML(item.baseCurrency || "IDR")}</small></span>
              ${item.id === profile.id ? "<b>✓</b>" : ""}
            </button>
          `).join("")}
        </div>
        <div class="v14-user-menu-actions">
          <button class="button secondary v14-menu-transfer" data-v14-cross-transfer type="button">⇄ Transfer Antar Akun</button>
          <button class="button primary" data-v14-add-user type="button">＋ Tambah Akun</button>
          <button class="button secondary" data-v14-manage-users type="button">Kelola</button>
        </div>
      `;
    }

    document.documentElement.style.setProperty("--active-financial-user-color", profile.color || PRIMARY_COLOR);
    if (typeof currentSection !== "undefined" && currentSection === "dashboard") {
      const pageTitle = document.getElementById("pageTitle");
      const pageSubtitle = document.getElementById("pageSubtitle");
      if (pageTitle) pageTitle.textContent = `${profile.icon || profileTypeMeta(profile).icon} ${profile.name}`;
      if (pageSubtitle) pageSubtitle.textContent = `Ringkasan khusus ${profileLabel(profile).toLocaleLowerCase("id-ID")} ini. Data akun lain tidak dicampur.`;
    }
    document.body.dataset.financialUser = profile.id;
    document.querySelectorAll("[data-cute-book]").forEach((button) => {
      button.classList.toggle("active", button.dataset.cuteBook === profile.id);
    });

    const settingsPanel = document.getElementById("profileList")?.closest(".panel");
    const settingsHeader = settingsPanel?.querySelector(".panel-header h4");
    if (settingsHeader) settingsHeader.textContent = "Akun Keuangan";
    const settingsDescription = settingsPanel?.querySelector(".panel-header p");
    if (settingsDescription) settingsDescription.textContent = "Pisahkan uang pribadi, pasangan, keluarga, dan setiap usaha dalam satu login.";
    const addButton = document.getElementById("addProfileButton");
    if (addButton) addButton.textContent = "＋ Akun";
    renderFinancialUserSettingsList();
  }

  function renderFinancialUserSettingsList() {
    const container = document.getElementById("profileList");
    if (!container || !state) return;
    const activeId = activeFinancialUserId();
    container.classList.add("v14-financial-user-list");
    container.innerHTML = state.profiles.map((profile) => {
      const data = profileDataCounts(profile.id);
      const accountCount = data.counts.accounts || 0;
      const transactionCount = data.counts.transactions || 0;
      return `
        <article class="v14-financial-user-card ${profile.archived ? "archived" : ""}">
          <span class="v14-financial-user-avatar" style="--v14-profile-color:${profile.color || PRIMARY_COLOR}">${escapeHTML(profile.icon || profileTypeMeta(profile).icon)}</span>
          <span class="v14-financial-user-info">
            <strong>${escapeHTML(profile.name)} ${profile.isPrimary ? '<em class="badge">Utama</em>' : ""} ${profile.id === activeId ? '<em class="badge success">Aktif</em>' : ""}</strong>
            <small>${escapeHTML(profileLabel(profile))} · ${accountCount} dompet · ${transactionCount} transaksi${profile.archived ? " · Diarsipkan" : ""}</small>
          </span>
          <span class="v14-financial-user-actions">
            ${!profile.archived && profile.id !== activeId ? `<button class="mini-button" data-v14-switch-user="${profile.id}" type="button" title="Gunakan">↗</button>` : ""}
            <button class="mini-button" data-v14-edit-user="${profile.id}" type="button" title="Edit">✏️</button>
            <button class="mini-button" data-v14-user-more="${profile.id}" type="button" title="Opsi">•••</button>
          </span>
        </article>
      `;
    }).join("");
  }

  function openFinancialUserForm(existing = null) {
    const isEdit = Boolean(existing);
    const type = normalizeProfileType(existing?.userType || existing?.type, 0);
    const meta = PROFILE_TYPES[type] || PROFILE_TYPES.other;
    const defaultName = type === "self" ? (state.settings.userName || "Saya") : "";
    showModal(
      isEdit ? "Edit Akun Keuangan" : "Tambah Akun Keuangan",
      isEdit ? "Perubahan nama atau tampilan tidak mengubah data di dalamnya." : "Akun baru dimulai kosong dan tidak mencampur data akun lain.",
      `
        <form id="v14FinancialUserForm">
          <div class="form-grid">
            <label class="field full"><span>Nama akun keuangan</span><input class="input" id="v14UserFormName" maxlength="60" value="${escapeHTML(existing?.name || defaultName)}" placeholder="Contoh: Saya, Istri, Toko Bangunan" required /></label>
            <label class="field"><span>Jenis</span><select class="input" id="v14UserFormType">
              ${Object.entries(PROFILE_TYPES).map(([key, item]) => `<option value="${key}" ${key === type ? "selected" : ""}>${item.icon} ${item.label}</option>`).join("")}
            </select></label>
            <label class="field"><span>Ikon</span><select class="input" id="v14UserFormIcon">
              ${["🙋","💞","👩","👨","🏪","🏬","🧱","⚡","💧","👨‍👩‍👧","📒","📋","🌱","✈️","🎓"].map((icon) => `<option value="${icon}" ${icon === (existing?.icon || meta.icon) ? "selected" : ""}>${icon}</option>`).join("")}
            </select></label>
            <label class="field"><span>Warna identitas</span><input class="input" id="v14UserFormColor" type="color" value="${existing?.color || PRIMARY_COLOR}" /></label>
            <label class="field"><span>Mata uang utama</span><select class="input" id="v14UserFormCurrency">${currencyOptions(existing?.baseCurrency || state.settings.baseCurrency || "IDR")}</select></label>
            <label class="field full"><span>Catatan opsional</span><textarea id="v14UserFormNotes" maxlength="300" placeholder="Contoh: Khusus seluruh transaksi usaha toko A">${escapeHTML(existing?.notes || "")}</textarea></label>
            ${!isEdit ? `
              <label class="field full v14-starter-account"><span><input id="v14CreateStarterCash" type="checkbox" checked /> Buat dompet “Tunai” untuk akun ini</span></label>
              <label class="field"><span>Saldo awal tunai</span><input class="input" id="v14StarterBalance" type="number" min="0" step="any" value="0" /></label>
            ` : ""}
          </div>
          <div class="v14-data-isolation-note"><span>🔒</span><p><strong>Terisolasi otomatis</strong>Transaksi, dompet, budget, target, utang, investasi, jadwal rutin, dan laporan hanya tampil pada akun ini.</p></div>
          <div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Batal</button><button class="button primary" type="submit">${isEdit ? "Simpan Perubahan" : "Buat Akun"}</button></div>
        </form>
      `
    );

    document.getElementById("cancelModalButton")?.addEventListener("click", closeModal);
    document.getElementById("v14UserFormType")?.addEventListener("change", (event) => {
      const suggested = PROFILE_TYPES[event.target.value]?.icon;
      const icon = document.getElementById("v14UserFormIcon");
      if (suggested && icon && !isEdit) icon.value = suggested;
    });
    document.getElementById("v14FinancialUserForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("v14UserFormName").value.trim();
      const duplicate = state.profiles.find((profile) => profile.id !== existing?.id && profile.name.trim().toLocaleLowerCase("id-ID") === name.toLocaleLowerCase("id-ID"));
      if (duplicate) {
        showToast("Nama akun keuangan sudah digunakan.", "⚠️");
        return;
      }
      const userType = document.getElementById("v14UserFormType").value;
      const next = {
        ...(existing || {}),
        id: existing?.id || createId("financial-user"),
        name,
        type: userType,
        userType,
        icon: document.getElementById("v14UserFormIcon").value || PROFILE_TYPES[userType]?.icon || "📒",
        color: document.getElementById("v14UserFormColor").value || PRIMARY_COLOR,
        baseCurrency: document.getElementById("v14UserFormCurrency").value || "IDR",
        notes: document.getElementById("v14UserFormNotes").value.trim(),
        members: existing?.members?.length ? existing.members : [name],
        isPrimary: existing?.isPrimary || !state.profiles.length,
        archived: existing?.archived || false,
        preferences: existing?.preferences || {
          ...profilePreferencesFromSettings(),
          baseCurrency: document.getElementById("v14UserFormCurrency").value || "IDR"
        },
        createdAt: existing?.createdAt || nowIsoV14(),
        updatedAt: nowIsoV14()
      };
      next.preferences.baseCurrency = next.baseCurrency;
      const sourceCategorySeed = !isEdit
        ? (state.categoryCatalog || []).filter(
            (item) => item.profileId === activeFinancialUserId()
              && (item.builtinKey || String(item.id || "").startsWith("v13-category-"))
          ).map(safeCloneV14)
        : [];

      await commit(isEdit ? "Akun keuangan diperbarui" : "Akun keuangan ditambahkan", next.name, () => {
        if (existing) {
          const index = state.profiles.findIndex((profile) => profile.id === existing.id);
          if (index >= 0) state.profiles[index] = next;
        } else {
          state.profiles.push(next);
          sourceCategorySeed.forEach((item, index) => {
            state.categoryCatalog.push({
              ...item,
              id: createId("category"),
              profileId: next.id,
              order: index,
              createdAt: nowIsoV14(),
              updatedAt: nowIsoV14()
            });
          });
          if (document.getElementById("v14CreateStarterCash")?.checked) {
            state.accounts.push({
              id: createId("account"),
              name: "Tunai",
              type: "cash",
              liability: false,
              currency: next.baseCurrency,
              openingBalance: Number(document.getElementById("v14StarterBalance")?.value) || 0,
              openingRate: next.baseCurrency === state.settings.baseCurrency ? 1 : (convertCurrency(1, next.baseCurrency, state.settings.baseCurrency) || 1),
              icon: "💵",
              color: next.color,
              profileId: next.id,
              sharedWith: [],
              creditLimit: 0,
              statementDay: null,
              dueDay: null,
              createdAt: nowIsoV14(),
              updatedAt: nowIsoV14()
            });
          }
        }
      });
      closeModal();
      if (!isEdit) await switchFinancialUser(next.id, { persist: true, announce: false });
      else {
        renderAll();
        renderFinancialUserChrome();
      }
      showToast(isEdit ? "Akun keuangan diperbarui." : "Akun keuangan baru siap digunakan.", next.icon);
    });
  }

  function openFinancialUserManager() {
    const activeId = activeFinancialUserId();
    showModal("Kelola Akun Keuangan", "Akun yang diarsipkan tetap tersimpan tetapi tidak muncul di pemilih utama.", `
      <div class="v14-manager-list">
        ${state.profiles.map((profile) => {
          const data = profileDataCounts(profile.id);
          return `<article class="v14-manager-card ${profile.archived ? "archived" : ""}">
            <span class="v14-financial-user-avatar" style="--v14-profile-color:${profile.color || PRIMARY_COLOR}">${escapeHTML(profile.icon || profileTypeMeta(profile).icon)}</span>
            <span><strong>${escapeHTML(profile.name)}</strong><small>${escapeHTML(profileLabel(profile))} · ${data.counts.accounts || 0} dompet · ${data.counts.transactions || 0} transaksi · ${data.counts.budgets || 0} budget</small></span>
            <div class="v14-manager-actions">
              ${!profile.archived && profile.id !== activeId ? `<button class="button secondary" data-v14-switch-user="${profile.id}" type="button">Gunakan</button>` : ""}
              <button class="button secondary" data-v14-edit-user="${profile.id}" type="button">Edit</button>
              ${!profile.isPrimary ? `<button class="button secondary" data-v14-make-primary="${profile.id}" type="button">Jadikan Utama</button>` : ""}
              ${profile.archived ? `<button class="button secondary" data-v14-unarchive-user="${profile.id}" type="button">Pulihkan</button>` : !profile.isPrimary ? `<button class="button secondary" data-v14-archive-user="${profile.id}" type="button">Arsipkan</button>` : ""}
              ${!profile.isPrimary && data.total === 0 ? `<button class="button danger" data-v14-delete-user="${profile.id}" type="button">Hapus</button>` : ""}
            </div>
          </article>`;
        }).join("")}
      </div>
      <div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Tutup</button><button class="button primary" data-v14-add-user type="button">＋ Tambah Akun</button></div>
    `);
    document.getElementById("cancelModalButton")?.addEventListener("click", closeModal);
  }

  async function archiveFinancialUser(profileId, archived) {
    const profile = state.profiles.find((item) => item.id === profileId);
    if (!profile || profile.isPrimary) return;
    if (archived && activeProfiles().length <= 1) {
      showToast("Minimal satu akun keuangan harus tetap aktif.", "⚠️");
      return;
    }
    if (profile.id === activeFinancialUserId()) {
      const fallback = activeProfiles().find((item) => item.id !== profile.id) || primaryProfile();
      if (fallback) await switchFinancialUser(fallback.id, { persist: false, announce: false });
    }
    await commit(archived ? "Akun keuangan diarsipkan" : "Akun keuangan dipulihkan", profile.name, () => {
      profile.archived = archived;
      profile.updatedAt = nowIsoV14();
    });
    closeModal();
    renderFinancialUserChrome();
    showToast(archived ? "Akun diarsipkan tanpa menghapus data." : "Akun kembali aktif.", archived ? "📦" : "✅");
  }

  async function makePrimaryFinancialUser(profileId) {
    const profile = state.profiles.find((item) => item.id === profileId);
    if (!profile) return;
    await commit("Akun utama diubah", profile.name, () => {
      state.profiles.forEach((item) => { item.isPrimary = item.id === profile.id; });
      profile.archived = false;
      profile.updatedAt = nowIsoV14();
    });
    closeModal();
    renderFinancialUserChrome();
    showToast(`${profile.name} sekarang menjadi akun utama.`, "⭐");
  }

  async function deleteEmptyFinancialUser(profileId) {
    const profile = state.profiles.find((item) => item.id === profileId);
    const data = profileDataCounts(profileId);
    if (!profile || profile.isPrimary || data.total > 0) {
      showToast("Akun berisi data tidak dapat dihapus. Arsipkan agar tetap aman.", "🔒");
      return;
    }
    if (!confirm(`Hapus akun keuangan kosong “${profile.name}”?`)) return;
    await commit("Akun keuangan kosong dihapus", profile.name, () => {
      state.profiles = state.profiles.filter((item) => item.id !== profileId);
      state.categoryCatalog = (state.categoryCatalog || []).filter((item) => item.profileId !== profileId);
      state.tagCatalog = (state.tagCatalog || []).filter((item) => item.profileId !== profileId);
    });
    closeModal();
    renderFinancialUserChrome();
    showToast("Akun kosong berhasil dihapus.", "🗑️");
  }

  function openUserMoreMenu(profileId) {
    const profile = state.profiles.find((item) => item.id === profileId);
    if (!profile) return;
    const data = profileDataCounts(profileId);
    showModal("Opsi Akun Keuangan", profile.name, `
      <div class="button-grid">
        <button class="button secondary" data-v14-edit-user="${profile.id}" type="button">✏️ Edit akun</button>
        ${!profile.isPrimary ? `<button class="button secondary" data-v14-make-primary="${profile.id}" type="button">⭐ Jadikan utama</button>` : ""}
        ${profile.archived ? `<button class="button secondary" data-v14-unarchive-user="${profile.id}" type="button">📤 Pulihkan</button>` : !profile.isPrimary ? `<button class="button secondary" data-v14-archive-user="${profile.id}" type="button">📦 Arsipkan</button>` : ""}
        ${!profile.isPrimary && data.total === 0 ? `<button class="button danger" data-v14-delete-user="${profile.id}" type="button">🗑️ Hapus akun kosong</button>` : ""}
      </div>
      ${data.total > 0 ? `<p class="muted" style="margin-top:14px">Akun berisi ${data.total} item keuangan. Demi keamanan, gunakan Arsipkan daripada menghapus.</p>` : ""}
      <div class="form-actions"><button class="button secondary" id="cancelModalButton" type="button">Tutup</button></div>
    `);
    document.getElementById("cancelModalButton")?.addEventListener("click", closeModal);
  }

  function decorateFinancialForm(existing, selectId) {
    const form = document.querySelector("#modalBody form");
    if (!form || form.querySelector(".v14-form-user-context")) return;
    const profileId = existing?.profileId || activeFinancialUserId();
    const profile = state.profiles.find((item) => item.id === profileId) || activeFinancialUser();
    if (!profile) return;
    const select = selectId ? document.getElementById(selectId) : null;
    if (select) {
      select.value = profile.id;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.disabled = true;
      const field = select.closest(".field");
      if (field) field.hidden = true;
    }
    form.insertAdjacentHTML("afterbegin", `
      <div class="v14-form-user-context" style="--v14-profile-color:${profile.color || PRIMARY_COLOR}">
        <span>${escapeHTML(profile.icon || profileTypeMeta(profile).icon)}</span>
        <p><strong>${escapeHTML(profile.name)}</strong><small>Data akan disimpan hanya pada akun keuangan ini.</small></p>
      </div>
    `);
  }


  function installFinancialModalObserver() {
    const modalBody = document.getElementById("modalBody");
    if (!modalBody || modalBody.dataset.v14Observed) return;
    modalBody.dataset.v14Observed = "true";
    const observer = new MutationObserver(() => {
      if (!state || document.getElementById("v14FinancialUserForm")) return;
      if (document.getElementById("proSharedWalletForm")) {
        const select = document.getElementById("proSharedProfile");
        const selectedProfile = state.profiles.find((profile) => profile.id === select?.value) || activeFinancialUser();
        decorateFinancialForm({ profileId: selectedProfile?.id || activeFinancialUserId() }, "proSharedProfile");
      } else if (document.getElementById("proDebtForm") || document.getElementById("proInvestmentForm")) {
        decorateFinancialForm({ profileId: activeFinancialUserId() }, null);
      } else if (document.getElementById("ruleForm") || document.getElementById("reconciliationForm")) {
        decorateFinancialForm({ profileId: activeFinancialUserId() }, null);
      }
    });
    observer.observe(modalBody, { childList: true, subtree: true });
  }


  function renderV14Changelog() {
    const container = document.getElementById("v9ChangelogContent");
    if (!container || document.getElementById("v14ReleaseCard")) return;
    container.insertAdjacentHTML("afterbegin", `
      <article class="release-card latest" id="v14ReleaseCard">
        <div class="release-head"><div><span class="release-kicker">VERSI TERBARU</span><h3>${VERSION_LABEL}</h3><p>Penyelarasan palet indigo bersih, sinkronisasi ringkasan bulanan ke CHARISNA SuperApp, modal konfirmasi universal, dan sinkronisasi lintas platform 100%.</p></div><span class="version-badge">v14.1.2</span></div>
        <div class="release-feature-grid">
          <div><span>🎨</span><p><strong>UI Polish & Palette</strong>Palet indigo coherent (#4f46e5), border-radius lebih lembut, dan visual bersih tanpa blob dekoratif berlebih.</p></div>
          <div><span>📲</span><p><strong>CHARISNA SuperApp</strong>Kirim agregat saldo bersih dan cashflow bulanan otomatis ke SuperApp tanpa membocorkan PIN/transaksi mentah.</p></div>
          <div><span>👥</span><p><strong>Multi-user internal</strong>Kelola akun keuangan terpisah untuk pribadi, keluarga, dan berbagai unit usaha.</p></div>
          <div><span>⇄</span><p><strong>Transfer antar akun</strong>Pindahkan uang antar akun keuangan berbeda dengan saldo dan histori yang selalu konsisten.</p></div>
          <div><span>🛡️</span><p><strong>Universal Modals</strong>Dialog konfirmasi reset brankas dan hapus data bekerja sempurna di Desktop Electron dan Android.</p></div>
          <div><span>⚡</span><p><strong>Auto PIN Unlock</strong>Dashboard terbuka otomatis seketika saat PIN angka yang dimasukkan benar.</p></div>
          <div><span>🔑</span><p><strong>Ubah Password Cloud</strong>Ganti kata sandi login cloud Supabase langsung dari panel pengaturan akun.</p></div>
          <div><span>📱</span><p><strong>Android SDK 34 Ready</strong>Dukungan penuh notifikasi runtime Android 13/14 dan pengerasan keamanan brankas.</p></div>
        </div>
        <div class="release-notes"><span>Kompatibilitas</span><p>Kompatibel penuh dengan seluruh versi brankas cloud sebelumnya. Tersinkronisasi identik di Web, Android, dan Windows Desktop.</p></div>
      </article>`);
    container.querySelectorAll(".release-card:not(#v14ReleaseCard)").forEach((card) => card.classList.remove("latest"));
  }

  function renderV14SystemCenter() {
    window.v14SystemStatusPatched = true;

    // Header toolbar badge
    const systemBadge = document.querySelector("#system .section-header .version-badge");
    if (systemBadge) {
      systemBadge.textContent = "v14.1.2 — Multi-User + SuperApp Sync + UI Polish";
    }

    // System Hero section
    const heroKicker = document.querySelector("#system .v10-hero .v10-kicker");
    if (heroKicker) heroKicker.textContent = "CHARISNA v14.1.2";
    const heroH3 = document.querySelector("#system .v10-hero h3");
    if (heroH3) heroH3.textContent = "Sistem Keuangan Multi-User & Ekosistem Terpadu.";
    const heroP = document.querySelector("#system .v10-hero p");
    if (heroP) heroP.textContent = "Multi-User Financial Spaces, Transfer Antar Akun, sinkronisasi CHARISNA SuperApp, serta modal konfirmasi universal.";

    // Update banner
    const bannerStrong = document.querySelector("#v10PanelUpdate .v10-update-banner strong");
    if (bannerStrong && !/baru siap/i.test(bannerStrong.textContent)) {
      bannerStrong.textContent = "Aplikasi menggunakan v14.1.2";
    }

    const bannerP = document.querySelector("#v10PanelUpdate .v10-update-banner p");
    if (bannerP) {
      const isDesktop = Boolean(window.CharisnaDesktop?.isDesktop);
      const isNative = Boolean(window.CHARISNA_NATIVE);
      const cacheName = "charisna-money-management-v14.1.2-mint-palette";
      if (isDesktop) {
        bannerP.textContent = `Aplikasi Desktop Windows aktif (paket lokal offline). Cache shell: ${cacheName}.`;
      } else if (isNative) {
        bannerP.textContent = `Aplikasi Android Capacitor aktif (paket lokal offline). Cache shell: ${cacheName}.`;
      } else {
        const swStatus = navigator.serviceWorker?.controller ? "Service worker aktif" : "Belum dikontrol service worker";
        bannerP.textContent = `${swStatus}. Cache: ${cacheName}.`;
      }
    }

    // Status Versi stats
    const versionCards = document.querySelectorAll("#v10PanelUpdate .v10-stat");
    if (versionCards[0]) {
      const strong = versionCards[0].querySelector("strong");
      const small = versionCards[0].querySelector("small");
      if (strong) strong.textContent = "v14.1.2";
      if (small) small.textContent = "Multi-User · Transfer · SuperApp";
    }
    if (versionCards[1]) {
      const strong = versionCards[1].querySelector("strong");
      const small = versionCards[1].querySelector("small");
      if (strong) strong.textContent = "v14";
      if (small) small.textContent = "Migrasi kompatibel";
    }

    // Riwayat Migrasi list
    const migrationContainer = document.querySelector("#v10PanelUpdate .v10-migration-list");
    if (migrationContainer && state?.settings?.migrationHistory?.length) {
      migrationContainer.innerHTML = state.settings.migrationHistory.map((item) => `
        <div class="v10-migration">
          <span><strong>v${item.version}</strong> · ${escapeHTML(item.label || "Migrasi")}</span>
          <span class="v10-badge good">${formatDateTime(item.migratedAt)}</span>
        </div>
      `).join("");
    }

    // Safe button handlers for Desktop / Native environment
    const checkBtn = document.getElementById("v10CheckUpdate");
    if (checkBtn && !checkBtn.dataset.v14Safe) {
      checkBtn.dataset.v14Safe = "true";
      checkBtn.addEventListener("click", async (e) => {
        const desktop = window.CharisnaDesktop;
        if (!desktop?.isDesktop && !window.CHARISNA_NATIVE && "serviceWorker" in navigator) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        if (!desktop?.checkForUpdates) {
          showToast("Periksa pembaruan melalui sumber instalasi aplikasi.", "ℹ️");
          return;
        }
        checkBtn.disabled = true;
        try {
          const result = await desktop.checkForUpdates();
          if (result?.error) throw new Error(result.error);
          if (result?.development) showToast("Pembaruan tidak tersedia di mode pengembangan.", "ℹ️");
          else if (result?.enabled === false) showToast("Kanal pembaruan belum aktif atau tidak dapat dijangkau.", "ℹ️");
          else if (result?.available === false) showToast("Aplikasi sudah versi terbaru.", "✓");
          else if (result?.available === true) showToast("Pembaruan ditemukan dan sedang disiapkan.", "⬇️");
          else showToast("Status pembaruan belum tersedia.", "ℹ️");
        } catch (error) {
          showToast(`Pembaruan gagal diperiksa: ${error.message}`, "❗");
        } finally {
          checkBtn.disabled = false;
        }
      }, true);
    }

    const clearCacheBtn = document.getElementById("v10ClearCaches");
    if (clearCacheBtn && !clearCacheBtn.dataset.v14Safe) {
      clearCacheBtn.dataset.v14Safe = "true";
      clearCacheBtn.addEventListener("click", async (e) => {
        if ("caches" in window) {
          e.stopImmediatePropagation();
          e.preventDefault();
          try {
            const names = await caches.keys();
            await Promise.all(
              names
                .filter((name) => name !== "charisna-money-management-v14.1.2-mint-palette")
                .map((name) => caches.delete(name))
            );
            if (typeof showToast === "function") {
              showToast("Cache versi lama berhasil dibersihkan.", "🧹");
            }
          } catch (err) {
            console.warn("Gagal membersihkan cache:", err);
          }
        }
      }, true);
    }
  }

  function installSystemPanelObserver() {
    const updatePanel = document.getElementById("v10PanelUpdate");
    if (!updatePanel || updatePanel.dataset.v14Observed) return;
    updatePanel.dataset.v14Observed = "true";
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderV14SystemCenter();
      }, 50);
    });
    observer.observe(updatePanel, { childList: true, subtree: false });
  }

  function openUserMenu() {
    const menu = document.getElementById("v14UserMenu");
    const trigger = document.getElementById("v14UserTrigger");
    if (!menu || !trigger) return;
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeUserMenu() {
    const menu = document.getElementById("v14UserMenu");
    const trigger = document.getElementById("v14UserTrigger");
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  function toggleUserMenu() {
    const menu = document.getElementById("v14UserMenu");
    if (!menu) return;
    if (menu.hidden) openUserMenu(); else closeUserMenu();
  }

  window.CharisnaUsers = {
    version: VERSION,
    activeId: activeFinancialUserId,
    active: activeFinancialUser,
    belongs: belongsToActiveUser,
    items: financialItems,
    profiles: activeProfiles,
    ensure: ensureV14State,
    switchTo: switchFinancialUser,
    openForm: openFinancialUserForm,
    openManager: openFinancialUserManager,
    counts: profileDataCounts
  };
  window.CharisnaTransfers = {
    version: RELEASE_VERSION,
    openForm: openCrossProfileTransferForm,
    remove: deleteCrossProfileTransfer,
    details: crossTransferDetails,
    rows: crossTransferTransactions
  };
  window.activeFinancialUserId = activeFinancialUserId;
  window.financialItems = financialItems;

  document.addEventListener("click", async (event) => {
    if (event.target.closest("#v14UserTrigger")) {
      event.stopPropagation();
      toggleUserMenu();
      return;
    }
    if (!event.target.closest("#v14UserSwitcher")) closeUserMenu();

    const switchButton = event.target.closest("[data-v14-switch-user]");
    if (switchButton) {
      await switchFinancialUser(switchButton.dataset.v14SwitchUser);
      return;
    }
    if (event.target.closest("[data-v14-cross-transfer]")) {
      closeUserMenu();
      openCrossProfileTransferForm();
      return;
    }
    const editCrossTransfer = event.target.closest("[data-v14-edit-cross-transfer]");
    if (editCrossTransfer) {
      openCrossProfileTransferForm(editCrossTransfer.dataset.v14EditCrossTransfer);
      return;
    }
    const deleteCrossTransfer = event.target.closest("[data-v14-delete-cross-transfer]");
    if (deleteCrossTransfer) {
      await deleteCrossProfileTransfer(deleteCrossTransfer.dataset.v14DeleteCrossTransfer);
      return;
    }
    if (event.target.closest("[data-v14-add-user]")) {
      closeModal();
      openFinancialUserForm();
      return;
    }
    if (event.target.closest("[data-v14-manage-users]")) {
      closeUserMenu();
      openFinancialUserManager();
      return;
    }
    const editButton = event.target.closest("[data-v14-edit-user]");
    if (editButton) {
      const profile = state.profiles.find((item) => item.id === editButton.dataset.v14EditUser);
      closeModal();
      openFinancialUserForm(profile);
      return;
    }
    const moreButton = event.target.closest("[data-v14-user-more]");
    if (moreButton) {
      openUserMoreMenu(moreButton.dataset.v14UserMore);
      return;
    }
    const archiveButton = event.target.closest("[data-v14-archive-user]");
    if (archiveButton) {
      await archiveFinancialUser(archiveButton.dataset.v14ArchiveUser, true);
      return;
    }
    const unarchiveButton = event.target.closest("[data-v14-unarchive-user]");
    if (unarchiveButton) {
      await archiveFinancialUser(unarchiveButton.dataset.v14UnarchiveUser, false);
      return;
    }
    const primaryButton = event.target.closest("[data-v14-make-primary]");
    if (primaryButton) {
      await makePrimaryFinancialUser(primaryButton.dataset.v14MakePrimary);
      return;
    }
    const deleteButton = event.target.closest("[data-v14-delete-user]");
    if (deleteButton) {
      await deleteEmptyFinancialUser(deleteButton.dataset.v14DeleteUser);
      return;
    }
    const oldBookButton = event.target.closest("[data-cute-book]");
    if (oldBookButton && oldBookButton.dataset.cuteBook !== "all") {
      await switchFinancialUser(oldBookButton.dataset.cuteBook);
    }
  });

  const previousOpenProfileForm = openProfileForm;
  openProfileForm = function v14OpenProfileForm(existing = null) {
    return openFinancialUserForm(existing);
  };

  const previousOpenTransactionForm = openTransactionForm;
  openTransactionForm = function v14OpenTransactionForm(existing = null, prefill = {}) {
    if (existing?.crossProfileTransferId) {
      openCrossProfileTransferForm(existing.crossProfileTransferId);
      return;
    }
    previousOpenTransactionForm(existing, prefill);
    window.setTimeout(() => decorateFinancialForm(existing, "txProfile"), 120);
  };

  const previousOpenAccountForm = openAccountForm;
  openAccountForm = function v14OpenAccountForm(existing = null) {
    previousOpenAccountForm(existing);
    window.setTimeout(() => decorateFinancialForm(existing, "accountProfile"), 20);
  };

  const previousOpenBudgetForm = openBudgetForm;
  openBudgetForm = function v14OpenBudgetForm(existing = null) {
    previousOpenBudgetForm(existing);
    window.setTimeout(() => decorateFinancialForm(existing, "budgetProfile"), 20);
  };

  const previousOpenGoalForm = openGoalForm;
  openGoalForm = function v14OpenGoalForm(existing = null) {
    previousOpenGoalForm(existing);
    window.setTimeout(() => decorateFinancialForm(existing, "goalProfile"), 20);
  };

  const previousOpenRecurringForm = openRecurringForm;
  openRecurringForm = function v14OpenRecurringForm(existing = null) {
    previousOpenRecurringForm(existing);
    window.setTimeout(() => decorateFinancialForm(existing, "recurringProfile"), 120);
  };


  const previousAccountBalance = accountBalance;
  accountBalance = function v14AccountBalance(account) {
    let balance = numericValue(account?.openingBalance, 0);
    (state?.transactions || []).forEach((transaction) => {
      if (transaction.status === "cancelled") return;

      if (transaction.crossProfileTransferId) {
        if (transaction.crossProfileRole === "outgoing" && transaction.sourceAccountId === account.id) {
          const debit = numericValue(transaction.sourceAmount, transaction.amount) + numericValue(transaction.fee, 0);
          balance += account.liability ? debit : -debit;
        } else if (transaction.crossProfileRole === "incoming" && transaction.targetAccountId === account.id) {
          const credit = numericValue(transaction.receivedAmount, transaction.amount);
          balance += account.liability ? -credit : credit;
        }
        return;
      }

      if (transaction.type === "transfer") {
        if (transaction.accountId === account.id) {
          balance += account.liability
            ? numericValue(transaction.amount, 0) + numericValue(transaction.fee, 0)
            : -(numericValue(transaction.amount, 0) + numericValue(transaction.fee, 0));
        }
        if (transaction.destinationAccountId === account.id) {
          const destinationAmount = numericValue(transaction.destinationAmount, transaction.amount);
          balance += account.liability ? -destinationAmount : destinationAmount;
        }
        return;
      }

      if (transaction.accountId !== account.id) return;
      const amount = numericValue(transaction.amount, 0);
      if (account.liability) balance += transaction.type === "expense" ? amount : -amount;
      else balance += transaction.type === "income" ? amount : -amount;
    });
    return balance;
  };

  const previousTransactionRow = transactionRow;
  transactionRow = function v14TransactionRow(transaction) {
    return transaction?.crossProfileTransferId
      ? crossProfileTransactionRow(transaction)
      : previousTransactionRow(transaction);
  };

  const previousRenderTransactionsV14 = renderTransactions;
  renderTransactions = function v14RenderTransactionsWithCrossProfileTransfers() {
    previousRenderTransactionsV14();
    normalizeRenderedCrossProfileTransfers();
  };

  const previousRenderAll = renderAll;
  renderAll = function v14RenderAll() {
    const changed = ensureV14State();
    previousRenderAll();
    normalizeRenderedCrossProfileTransfers();
    renderFinancialUserChrome();
    renderV14Changelog();
    renderV14SystemCenter();
    installSystemPanelObserver();
    window.setTimeout(() => {
      normalizeRenderedCrossProfileTransfers();
      renderFinancialUserChrome();
      renderV14Changelog();
      renderV14SystemCenter();
    }, 120);
    if (changed) queueMigrationSave();
  };

  const previousRenderSettings = renderSettings;
  renderSettings = function v14RenderSettings() {
    previousRenderSettings();
    renderFinancialUserChrome();
    renderV14SystemCenter();
  };

  const previousChangeSection = changeSection;
  changeSection = function v14ChangeSection(sectionId) {
    previousChangeSection(sectionId);
    renderFinancialUserChrome();
    if (sectionId === "updates") renderV14Changelog();
    if (sectionId === "system" || sectionId === "tools") {
      renderV14SystemCenter();
      window.setTimeout(renderV14SystemCenter, 60);
    }
  };

  window.addEventListener("beforeunload", saveActiveProfilePreferences);

  document.addEventListener("DOMContentLoaded", () => {
    injectFinancialUserUI();
    installFinancialModalObserver();
    installSystemPanelObserver();
    if (state) {
      const changed = ensureV14State();
      renderFinancialUserChrome();
      renderV14Changelog();
      renderV14SystemCenter();
      if (changed) queueMigrationSave();
    }
  });
})();
