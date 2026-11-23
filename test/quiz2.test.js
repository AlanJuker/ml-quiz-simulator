const test = require("node:test");
const assert = require("node:assert/strict");
const QUIZ2 = require("../quiz2-bank.js");
const { buildQuiz, markDone, suggestPoints, itemScore, grade } = require("../quiz2.js");

const REAL = { mcCount: 10, openCount: 2 };
const QUICK = { mcCount: 5, openCount: 1 };
const MC = { mcCount: 5, openCount: 0 };
const OPEN = { mcCount: 0, openCount: 1 };

test("Quiz 2 bank is well formed and every model answer earns full marks", () => {
  const ids = new Set();
  for (const q of QUIZ2) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`);
    ids.add(q.id);
    assert.ok([7, 8].includes(q.module), q.id);
    assert.ok(["theory", "code"].includes(q.kind), q.id);
    assert.ok(q.prompt.length > 10, q.id);
    if (q.kind === "code") assert.ok(q.code, `${q.id} is a code/output question without code`);
    if (q.type === "mc") {
      assert.equal(q.options.length, 4, q.id);
      assert.equal(new Set(q.options).size, 4, `${q.id} has duplicate options`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.id);
      assert.ok(q.explanation, q.id);
      assert.ok(!/(all|none) of the above/i.test(q.options.join(" ")), `${q.id} breaks under option shuffling`);
      const longestWrong = Math.max(...q.options.filter((_, i) => i !== q.answer).map((o) => o.length));
      assert.ok(q.options[q.answer].length <= Math.max(30, longestWrong * 1.2), `${q.id}: correct option is a giveaway by length`);
    } else {
      assert.equal(q.type, "open", q.id);
      assert.ok(q.modelAnswer && q.keyPoints.length >= 3, q.id);
      for (const p of q.keyPoints) assert.ok(p.text && p.keywords.length, q.id);
      assert.ok(suggestPoints(q, q.modelAnswer).every(Boolean), `${q.id}: the model answer should earn full marks`);
    }
  }
});

test("the bank is split about evenly between Module 7 and Module 8", () => {
  for (const type of ["mc", "open"]) {
    const pool = QUIZ2.filter((q) => q.type === type);
    const share7 = pool.filter((q) => q.module === 7).length / pool.length;
    assert.ok(share7 >= 0.4 && share7 <= 0.6, `${type}: Module 7 share ${share7}`);
  }
});

test("real Quiz 2: 10 MC (2 reading code or output) then 2 short answers", () => {
  const quiz = buildQuiz(QUIZ2, REAL);
  assert.equal(quiz.length, 12);
  assert.equal(new Set(quiz.map((it) => it.q.id)).size, 12, "no repeated questions");
  assert.deepEqual(quiz.slice(0, 10).map((it) => it.q.kind), [...Array(8).fill("theory"), "code", "code"]);
  assert.ok(quiz.slice(10).every((it) => it.q.type === "open"));
});

test("quick, multiple-choice-only and short-answer-only lengths", () => {
  assert.deepEqual(buildQuiz(QUIZ2, QUICK).map((it) => it.q.type), ["mc", "mc", "mc", "mc", "mc", "open"]);
  assert.ok(buildQuiz(QUIZ2, MC).every((it) => it.q.type === "mc"));
  assert.equal(buildQuiz(QUIZ2, MC).length, 5);
  assert.deepEqual(buildQuiz(QUIZ2, OPEN).map((it) => it.q.type), ["open"]);
});

test("selection is not random, and an unfinished attempt gives the same questions again", () => {
  const ids = (seen) => buildQuiz(QUIZ2, { ...REAL, seen }).map((it) => it.q.id);
  assert.deepEqual(ids({}), ids({}), "same history, same questions");
  const first = ids({});
  assert.deepEqual(ids({}), first, "nothing recorded (unfinished), so the next start is identical");
  assert.ok(!ids(markDone({}, first, 1)).some((id) => first.includes(id)), "after submitting, all new questions");
});

test("every real attempt mixes both modules", () => {
  for (const ids of attempts(10, REAL)) {
    const m7 = ids.filter((id) => id.startsWith("q7")).length;
    assert.ok(m7 >= 4 && m7 <= 8, `Module 7 questions: ${m7} of 12`);
  }
});

// Runs submitted attempts the way the app does: each one is recorded with markDone when it is submitted.
function attempts(n, size) {
  let seen = {};
  return Array.from({ length: n }, (_, i) => {
    const options = typeof size === "function" ? size() : size;
    const ids = buildQuiz(QUIZ2, { ...options, seen }).map((it) => it.q.id);
    seen = markDone(seen, ids, i + 1);
    return ids;
  });
}

test("attempts walk through the bank: 7 real attempts cover every question", () => {
  const shown = new Set(attempts(7, REAL).flat());
  assert.deepEqual(QUIZ2.filter((q) => !shown.has(q.id)).map((q) => q.id), []);
});

test("two attempts in a row never share a question, even when mixing lengths", () => {
  for (let trial = 0; trial < 20; trial++) {
    const runs = attempts(30, () => [REAL, QUICK, MC, OPEN][Math.floor(Math.random() * 4)]);
    for (let i = 1; i < runs.length; i++) assert.ok(!runs[i].some((id) => runs[i - 1].includes(id)), `attempt ${i + 1} repeats attempt ${i}`);
  }
});

test("shuffled options grade correctly and short answers earn partial credit", () => {
  for (let run = 0; run < 50; run++) {
    const [item] = buildQuiz(QUIZ2, { mcCount: 1, openCount: 0 });
    item.choice = item.order.indexOf(item.q.answer);
    assert.equal(itemScore(item), 1);
    item.choice = (item.choice + 1) % 4;
    assert.equal(itemScore(item), 0);
  }
  const q = QUIZ2.find((x) => x.id === "q8-o2");
  const text = "PCA is unsupervised and keeps the most variance.";
  const item = { q, text, points: suggestPoints(q, text) };
  assert.deepEqual(item.points, [true, false, false, false]);
  assert.equal(itemScore(item), 0.25);
  assert.equal(itemScore({ ...item, text: " " }), 0, "blank answers score zero even if ticked");
  const g = grade([item, { q: QUIZ2[0], order: [0, 1, 2, 3], choice: QUIZ2[0].answer }]);
  assert.equal(g.total, 2);
  assert.equal(g.groups["Module 7"].earned, 1);
  assert.equal(g.percent, 63);
});
