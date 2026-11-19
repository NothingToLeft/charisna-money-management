import test from "node:test";
import assert from "node:assert/strict";

const PIN_LENGTHS = [4, 6, 8, 12];

function isValidPin(pin, expectedLength) {
  return (
    PIN_LENGTHS.includes(Number(expectedLength)) &&
    /^\d+$/.test(String(pin || "")) &&
    String(pin).length === Number(expectedLength)
  );
}

function sanitizePinInput(value, maxLength) {
  return String(value || "").replace(/\D/g, "").slice(0, maxLength);
}

function computePinVisualizerState(pinValue, expectedLength) {
  const currentLength = String(pinValue || "").length;
  const dots = [];
  for (let i = 0; i < expectedLength; i++) {
    dots.push({
      index: i,
      filled: i < currentLength,
    });
  }
  return dots;
}

test("isValidPin: correctly validates 4, 6, 8, 12 digits", () => {
  assert.equal(isValidPin("1234", 4), true);
  assert.equal(isValidPin("123456", 6), true);
  assert.equal(isValidPin("12345678", 8), true);
  assert.equal(isValidPin("123456789012", 12), true);

  assert.equal(isValidPin("123", 4), false);
  assert.equal(isValidPin("12345", 6), false);
  assert.equal(isValidPin("12345a", 6), false);
  assert.equal(isValidPin("", 6), false);
  assert.equal(isValidPin(null, 6), false);
});

test("sanitizePinInput: strips non-digits and respects maxLength", () => {
  assert.equal(sanitizePinInput("1a2b3c", 6), "123");
  assert.equal(sanitizePinInput("12345678", 6), "123456");
  assert.equal(sanitizePinInput("999", 6), "999");
});

test("computePinVisualizerState: fills dots incrementally as PIN is typed", () => {
  let state = computePinVisualizerState("", 6);
  assert.equal(state.length, 6);
  assert.equal(state.filter((d) => d.filled).length, 0);

  state = computePinVisualizerState("12", 6);
  assert.equal(state.filter((d) => d.filled).length, 2);
  assert.equal(state[0].filled, true);
  assert.equal(state[1].filled, true);
  assert.equal(state[2].filled, false);

  state = computePinVisualizerState("123456", 6);
  assert.equal(state.filter((d) => d.filled).length, 6);
  assert.equal(state.every((d) => d.filled), true);
});
