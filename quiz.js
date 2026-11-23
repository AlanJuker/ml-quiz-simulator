// Pure midterm logic: selection, shuffling and scoring. No DOM access, so it runs in Node tests too.

function shuffle(items, rand = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fixed walk through the bank: round-robin across groups (modules) in bank order, so consecutive questions
// mix the groups evenly.
function walk(questions, group = (q) => q.module) {
  const lists = new Map();
  for (const q of questions) lists.set(group(q), [...(lists.get(group(q)) || []), q]);
  const out = [];
  for (let i = 0; out.length < questions.length; i++) for (const list of lists.values()) if (list[i]) out.push(list[i]);
  return out;
}

// No randomness in selection: questions completed the fewest times come first, then the ones completed longest
// ago, then the fixed walk order. So each attempt continues through the bank, nothing repeats until every
// question has been done, and the previous attempt's questions come last.
// `seen` maps id → { n: times completed, at: when last completed } (older saves stored only the count).
const timesDone = (seen, id) => (typeof seen[id] === "number" ? seen[id] : seen[id]?.n || 0);
const lastDone = (seen, id) => (typeof seen[id] === "object" && seen[id] ? seen[id].at : 0);
const nextUp = (questions, seen, group) =>
  walk(questions, group).map((q, i) => [q, i])
    .sort(([a, i], [b, j]) => timesDone(seen, a.id) - timesDone(seen, b.id) || lastDone(seen, a.id) - lastDone(seen, b.id) || i - j)
    .map(([q]) => q);

// Records a submitted attempt. Unfinished attempts are never recorded, so they come back with the same questions.
function markDone(seen, ids, at = Date.now()) {
  const out = { ...seen };
  for (const id of ids) out[id] = { n: timesDone(seen, id) + 1, at };
  return out;
}

// One attempt: `perSection` questions from each section, in bank order (2 = the full exam, 1 = quick),
// or, when `total` is given, that many questions from anywhere in the bank (1 = super quick).
function buildMidterm(bank, { seen = {}, perSection = 2, total } = {}) {
  const pick = (questions, n) => nextUp(questions, seen).slice(0, n);
  const sections = [...new Set(bank.map((q) => q.section))];
  const chosen = total ? pick(bank, total) : sections.flatMap((section) => pick(bank.filter((q) => q.section === section), perSection));
  return chosen.map((q) => ({ q, text: "", points: q.keyPoints.map(() => false), flagged: false }));
}

// Pre-ticks the key points whose keywords appear in the answer; the student reviews and adjusts.
function suggestPoints(question, text) {
  const t = ` ${text.toLowerCase()} `;
  return question.keyPoints.map((p) => p.keywords.some((k) => t.includes(k.toLowerCase())));
}

// Share of the key points earned, in [0, 1]. A blank answer earns nothing.
function itemScore(item) {
  if (!item.text.trim()) return 0;
  return item.points.filter(Boolean).length / item.points.length;
}

// Totals are in marks: each question is worth q.marks, split evenly across its key points.
function grade(items) {
  const groups = {};
  const add = (key, earned, marks) => {
    groups[key] ??= { earned: 0, total: 0 };
    groups[key].earned += earned;
    groups[key].total += marks;
  };
  let earned = 0;
  let total = 0;
  for (const it of items) {
    const e = itemScore(it) * it.q.marks;
    earned += e;
    total += it.q.marks;
    add(`Module ${it.q.module}`, e, it.q.marks);
    add(it.q.section, e, it.q.marks);
  }
  return { earned, total, percent: total ? Math.round((earned / total) * 100) : 0, groups };
}

if (typeof module !== "undefined") module.exports = { shuffle, buildMidterm, nextUp, markDone, suggestPoints, itemScore, grade };
