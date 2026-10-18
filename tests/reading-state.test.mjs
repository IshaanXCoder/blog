import assert from "node:assert/strict";
import { test } from "node:test";
import { headingId, readingState } from "../assets/reading-state.mjs";

test("progress follows scrolling, clamps overscroll, and handles short pages", () => {
  assert.deepEqual(readingState(0, 2000, 800, [300, 900]), { progress: 0, active: 0 });
  assert.deepEqual(readingState(600, 2000, 800, [300, 900]), { progress: .5, active: 0 });
  assert.deepEqual(readingState(850, 2000, 800, [300, 900]), { progress: 850 / 1200, active: 1 });
  assert.deepEqual(readingState(1400, 2000, 800, [300, 1900]), { progress: 1, active: 0 });
  assert.deepEqual(readingState(-100, 2000, 800, []), { progress: 0, active: -1 });
  assert.deepEqual(readingState(0, 500, 800, []), { progress: 0, active: -1 });
});

test("heading links remain unique and retain non-English text", () => {
  const used = new Set(["the-bpe-rabbit-hole"]);
  assert.equal(headingId("The BPE rabbit hole", used), "the-bpe-rabbit-hole-2");
  assert.equal(headingId("The BPE rabbit hole", used), "the-bpe-rabbit-hole-3");
  assert.equal(headingId("你好 世界", used), "你好-世界");
  assert.equal(headingId("?!", used), "section");
  assert.equal(headingId("?!", used), "section-2");
});

 test("the visible section remains active when multiple final sections fit onscreen", () => {
  assert.deepEqual(readingState(1100, 2429, 1329, [550, 1228, 1900, 2150]), { progress: 1, active: 1 });
});
