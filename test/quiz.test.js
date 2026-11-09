const test = require("node:test");
const assert = require("node:assert/strict");
const MIDTERM = require("../midterm.js");
const { buildMidterm, suggestPoints, itemScore, grade } = require("../quiz.js");

const SECTIONS = ["Workflow & methodology", "Python code interpretation", "Model output & interpretation"];

// Runs attempts the way the app does: each one counts as seen and becomes `last` as soon as it starts.
// `size` is the mode's options ({ perSection } or { total }), or a function returning them, to mix modes.
const FULL = { perSection: 2 };
const QUICK = { perSection: 1 };
const SINGLE = { total: 1 };
function attempts(n, size = FULL) {
  const seen = {};
  let last = [];
  return Array.from({ length: n }, () => {
    const mode = typeof size === "function" ? size() : size;
    const ids = buildMidterm(MIDTERM, { seen, last, ...mode }).map((it) => it.q.id);
    ids.forEach((id) => (seen[id] = (seen[id] || 0) + 1));
    last = ids;
    return ids;
  });
}

test("midterm bank: 10 written questions per section, one key point per mark", () => {
  const ids = new Set();
  for (const q of MIDTERM) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`);
    ids.add(q.id);
    assert.ok([2, 3, 4, 5, 6].includes(q.module), q.id);
    assert.ok(SECTIONS.includes(q.section), q.id);
    assert.equal(q.marks, q.section === SECTIONS[2] ? 4 : 5, q.id);
    assert.equal(q.keyPoints.length, q.marks, `${q.id}: one key point per mark`);
    assert.ok(q.prompt.length > 10 && q.modelAnswer, q.id);
    if (q.kind === "code" || q.section === SECTIONS[2]) assert.ok(q.code, `${q.id} needs its code or output`);
    for (const p of q.keyPoints) assert.ok(p.text && p.keywords.length, q.id);
    assert.ok(suggestPoints(q, q.modelAnswer).every(Boolean), `${q.id}: the model answer should earn full marks`);
  }
  for (const section of SECTIONS) assert.equal(MIDTERM.filter((q) => q.section === section).length, 10, section);
});

test("full has 2 questions per section, quick 1, in exam order; super quick has 1 question", () => {
  assert.deepEqual(buildMidterm(MIDTERM, FULL).map((it) => it.q.section), SECTIONS.flatMap((s) => [s, s]));
  assert.deepEqual(buildMidterm(MIDTERM, QUICK).map((it) => it.q.section), SECTIONS);
  assert.equal(buildMidterm(MIDTERM, SINGLE).length, 1);
});

test("every 5 full, 10 quick or 30 super quick attempts cover the whole bank once", () => {
  for (const [mode, size] of [[FULL, 5], [QUICK, 10], [SINGLE, 30]]) {
    const runs = attempts(size * 4, mode);
    for (let round = 0; round < 4; round++) {
      const ids = runs.slice(round * size, (round + 1) * size).flat();
      assert.equal(new Set(ids).size, MIDTERM.length, `${size} attempts, round ${round + 1}`);
    }
  }
});

test("two attempts in a row never share a question, even across rounds and when mixing modes", () => {
  for (let trial = 0; trial < 50; trial++) {
    const runs = attempts(40, () => [FULL, QUICK, SINGLE][Math.floor(Math.random() * 3)]);
    for (let i = 1; i < runs.length; i++) {
      assert.ok(!runs[i].some((id) => runs[i - 1].includes(id)), `attempt ${i + 1} repeats attempt ${i}`);
    }
  }
});

test("open answers earn partial credit from the rubric", () => {
  const q = MIDTERM.find((x) => x.id === "mt-o10");
  const text = "Degree 2 is the best choice. Degree 10 overfits.";
  const item = { q, text, points: suggestPoints(q, text) };
  assert.deepEqual(item.points, [true, false, true, false]);
  assert.equal(itemScore(item), 0.5);
  assert.equal(itemScore({ ...item, text: "  " }), 0, "blank answers score zero even if ticked");
});

test("the score is weighted by marks", () => {
  const five = MIDTERM.find((q) => q.marks === 5);
  const four = MIDTERM.find((q) => q.marks === 4);
  const g = grade([
    { q: five, text: "x", points: five.keyPoints.map(() => true) },
    { q: four, text: "x", points: [true, true, false, false] },
  ]);
  assert.equal(g.earned, 7);
  assert.equal(g.total, 9);
  assert.equal(g.percent, 78);
  assert.equal(g.groups[four.section].total, 4);
});
