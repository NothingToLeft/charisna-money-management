"use strict";

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromium.executablePath()
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: "block"
  });
  const page = await context.newPage();
  const errors = [];

  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });

  await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof showVaultGate === "function" && typeof vaultUsesPin === "function");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    vault = null;
    showVaultGate();
  });

  await page.fill("#setupName", "Charisna QA");
  await page.selectOption("#setupPinLength", "6");
  await page.fill("#setupPassword", "123456");
  await page.fill("#setupPasswordConfirm", "123456");
  await page.click("#setupForm button[type=submit]");
  await page.waitForFunction(() => !document.getElementById("appShell").hidden);

  const initialVault = await page.evaluate(() => JSON.parse(localStorage.getItem(STORAGE_KEY)));
  if (initialVault.credentialType !== "pin" || initialVault.pinLength !== 6) {
    throw new Error("Vault baru tidak memakai PIN 6 angka.");
  }
  if (initialVault.kdfIterations !== 600000) {
    throw new Error("KDF PIN baru tidak menggunakan iterasi yang diperkuat.");
  }

  await page.evaluate(() => lockApplication("QA lock"));
  await page.waitForFunction(() => !document.getElementById("authScreen").hidden);
  if (await page.locator("#loginPinPad").isHidden()) {
    throw new Error("Panel angka tidak tampil untuk vault PIN.");
  }

  for (const digit of "123456") {
    await page.click(`[data-pin-key="${digit}"]`);
  }
  await page.click("#loginForm button[type=submit]");
  await page.waitForFunction(() => !document.getElementById("appShell").hidden);

  await page.evaluate(() => changeSection("settings"));
  await page.fill("#oldPassword", "123456");
  await page.selectOption("#newPinLength", "4");
  await page.fill("#newPassword", "9876");
  await page.fill("#newPasswordConfirm", "9876");
  await page.click("#changePasswordForm button[type=submit]");
  await page.waitForFunction(() => JSON.parse(localStorage.getItem(STORAGE_KEY)).pinLength === 4);

  await page.evaluate(() => lockApplication("QA relock"));
  await page.fill("#loginPassword", "9876");
  await page.click("#loginForm button[type=submit]");
  await page.waitForFunction(() => !document.getElementById("appShell").hidden);

  const cloudResult = await page.evaluate(async () => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const remoteVault = JSON.parse(JSON.stringify(local));
    delete remoteVault.cloud;
    await adoptNewestCloudVault({
      encrypted_vault: remoteVault,
      version: 42,
      device_id: "qa-device-other",
      checksum: "qa-checksum",
      updated_at: new Date().toISOString()
    }, { reason: "QA cloud terbaru" });
    return {
      version: vault.cloud.version,
      unlocked: Boolean(state),
      recoveries: JSON.parse(localStorage.getItem(CLOUD_RECOVERY_KEY) || "[]").length
    };
  });

  if (cloudResult.version !== 42 || !cloudResult.unlocked || cloudResult.recoveries < 1) {
    throw new Error(`Cloud always-latest gagal: ${JSON.stringify(cloudResult)}`);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: "native/release/QA-v12-desktop.png", fullPage: false });
  await page.setViewportSize({ width: 800, height: 1280 });
  await page.screenshot({ path: "native/release/QA-v12-tablet.png", fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => lockApplication("QA mobile"));
  await page.screenshot({ path: "native/release/QA-v12-mobile-pin.png", fullPage: false });

  const relevantErrors = errors.filter((message) =>
    !/favicon|ERR_CONNECTION|supabase|Failed to fetch|net::ERR/i.test(message)
  );
  if (relevantErrors.length) {
    throw new Error(`Browser errors:\n${relevantErrors.join("\n")}`);
  }

  console.log(JSON.stringify({
    ok: true,
    initialPinLength: initialVault.pinLength,
    changedPinLength: 4,
    cloudVersion: cloudResult.version,
    recoverySnapshots: cloudResult.recoveries,
    capturedErrors: errors.length
  }, null, 2));

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
