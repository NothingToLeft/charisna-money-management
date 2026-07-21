"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { webcrypto } = require("node:crypto");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "../www");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, "");

const dom = new JSDOM(html, {
  url: "https://charisna.test/index.html",
  runScripts: "dangerously",
  pretendToBeVisual: true
});
const { window } = dom;

Object.defineProperty(window, "crypto", { value: webcrypto });
window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder;
window.structuredClone = structuredClone;
window.confirm = () => true;
window.prompt = () => null;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.CSS ||= {};
window.CSS.escape ||= (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
window.URL.createObjectURL ||= () => "blob:qa";
window.URL.revokeObjectURL ||= () => {};
window.Notification = class {
  static permission = "denied";
  static requestPermission = async () => "denied";
};
window.fetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({ result: "success", rates: { USD: 1, IDR: 16200, SGD: 1.35, EUR: 0.92, JPY: 157 } })
});
window.Chart = class { destroy() {} };
window.HTMLCanvasElement.prototype.getContext = () => ({});

const errors = [];
window.addEventListener("error", (event) => errors.push(event.error?.stack || event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(event.reason?.stack || String(event.reason)));

function loadScript(filename) {
  const script = window.document.createElement("script");
  script.textContent = `${fs.readFileSync(path.join(root, filename), "utf8")}\n//# sourceURL=${filename}`;
  window.document.body.appendChild(script);
}

function run(code) {
  return window.eval(code);
}

function waitFor(predicate, timeout = 12000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      try {
        if (predicate()) return resolve();
      } catch (error) {
        return reject(error);
      }
      if (Date.now() - started > timeout) return reject(new Error("Timeout QA"));
      setTimeout(check, 25);
    };
    check();
  });
}

function setValue(selector, value) {
  const element = window.document.querySelector(selector);
  element.value = value;
  element.dispatchEvent(new window.Event("input", { bubbles: true }));
  element.dispatchEvent(new window.Event("change", { bubbles: true }));
}

(async () => {
  ["app.js", "app-pro.js", "app-patch-v9.js", "app-patch-v10.js", "app-patch-v11.js", "app-patch-v12.js"].forEach(loadScript);
  await waitFor(() => typeof window.showVaultGate === "function");

  const pinValidation = run(`({
    pin4: isValidPin('1234', 4),
    pin6: isValidPin('123456', 6),
    pin8: isValidPin('12345678', 8),
    pin12: isValidPin('123456789012', 12),
    rejects5: !isValidPin('12345', 4) && !isValidPin('12345', 6),
    rejectsLetters: !isValidPin('12a4', 4)
  })`);
  if (Object.values(pinValidation).some((value) => !value)) {
    throw new Error(`Matriks validasi PIN gagal: ${JSON.stringify(pinValidation)}`);
  }

  run("localStorage.clear(); sessionStorage.clear(); vault = null; showVaultGate();");
  setValue("#setupName", "Charisna QA");
  setValue("#setupPinLength", "6");
  setValue("#setupPassword", "123456");
  setValue("#setupPasswordConfirm", "123456");
  window.document.querySelector("#setupForm button[type=submit]").click();
  await waitFor(() => window.document.getElementById("appShell").hidden === false, 20000);
  await new Promise((resolve) => setTimeout(resolve, 250));

  const initialVault = run("JSON.parse(localStorage.getItem(STORAGE_KEY))");
  if (initialVault.credentialType !== "pin" || initialVault.pinLength !== 6) {
    throw new Error("Vault baru tidak memakai PIN 6 angka.");
  }
  if (initialVault.kdfIterations !== 600000) {
    throw new Error("KDF PIN tidak diperkuat.");
  }

  run("lockApplication('QA lock')");
  if (window.document.getElementById("loginPinPad").hidden) {
    throw new Error("Panel angka tidak muncul.");
  }
  for (const digit of "123456") {
    window.document.querySelector(`[data-pin-key="${digit}"]`).click();
  }
  window.document.querySelector("#loginForm button[type=submit]").click();
  await waitFor(() => window.document.getElementById("appShell").hidden === false, 20000);
  await new Promise((resolve) => setTimeout(resolve, 200));

  run("changeSection('settings')");
  setValue("#oldPassword", "123456");
  setValue("#newPinLength", "4");
  setValue("#newPassword", "9876");
  setValue("#newPasswordConfirm", "9876");
  window.document.querySelector("#changePasswordForm button[type=submit]").click();
  await waitFor(() => run("JSON.parse(localStorage.getItem(STORAGE_KEY)).pinLength") === 4, 20000);

  run("lockApplication('QA relock')");
  setValue("#loginPassword", "9876");
  window.document.querySelector("#loginForm button[type=submit]").click();
  await waitFor(() => window.document.getElementById("appShell").hidden === false, 20000);

  const cloudResult = await run(`(async () => {
    cloudSession = { user: { id: 'qa-user', email: 'qa@charisna.test' } };
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const remoteVault = JSON.parse(JSON.stringify(local));
    delete remoteVault.cloud;
    await adoptNewestCloudVault({ encrypted_vault: remoteVault, version: 42, device_id: 'qa-other', checksum: 'qa', updated_at: new Date().toISOString() }, { reason: 'QA cloud terbaru' });
    return { version: vault.cloud.version, unlocked: Boolean(state), recoveries: JSON.parse(localStorage.getItem(CLOUD_RECOVERY_KEY) || '[]').length };
  })()`);

  if (cloudResult.version !== 42 || !cloudResult.unlocked || cloudResult.recoveries < 1) {
    throw new Error(`Always-latest gagal: ${JSON.stringify(cloudResult)}`);
  }

  await run(`(async () => {
    cloudSession = null;
    const legacySalt = crypto.getRandomValues(new Uint8Array(16));
    currentKeyBytes = await deriveKeyBytes('Legacy-Pass-2026', legacySalt, PBKDF2_ITERATIONS);
    currentKey = await importAesKey(currentKeyBytes);
    vault = { version: 3, salt: bytesToBase64(legacySalt), payload: null, passkeyCredentialId: null };
    await encryptState();
    lockApplication('QA legacy');
  })()`);
  if (!window.document.getElementById("loginPinPad").hidden) {
    throw new Error("Panel angka seharusnya tersembunyi untuk vault legacy.");
  }
  setValue("#loginPassword", "Legacy-Pass-2026");
  window.document.querySelector("#loginForm button[type=submit]").click();
  await waitFor(() => Boolean(window.document.getElementById("pinMigrationForm")), 20000);
  setValue("#migrationPinLength", "8");
  setValue("#migrationPin", "24681357");
  setValue("#migrationPinConfirm", "24681357");
  window.document.querySelector("#pinMigrationForm button[type=submit]").click();
  await waitFor(() => run("JSON.parse(localStorage.getItem(STORAGE_KEY)).pinLength") === 8, 20000);
  const migratedCredential = run("JSON.parse(localStorage.getItem(STORAGE_KEY)).credentialType");
  if (migratedCredential !== "pin") {
    throw new Error("Migrasi sandi lama ke PIN gagal.");
  }

  await new Promise((resolve) => setTimeout(resolve, 1100));
  await run("latestEncryptionPromise.catch(() => false)");

  if (errors.length) {
    throw new Error(`Runtime errors:\n${errors.join("\n")}`);
  }

  console.log(JSON.stringify({
    ok: true,
    newVaultPin: initialVault.pinLength,
    changedPin: 4,
    kdfIterations: initialVault.kdfIterations,
    cloudVersion: cloudResult.version,
    recoverySnapshots: cloudResult.recoveries,
    legacyMigrationPin: 8,
    validPinLengths: [4, 6, 8, 12],
    invalidPinRejected: true
  }, null, 2));
  window.close();
})().catch((error) => {
  console.error(error);
  window.close();
  process.exitCode = 1;
});
