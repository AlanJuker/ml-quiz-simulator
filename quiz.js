// Pure midterm logic: selection, shuffling and scoring. No DOM access, so it runs in Node tests too.

function shuffle(items, rand = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Least-seen questions first, so attempts work through the whole bank before anything repeats. Among
// equally seen questions the previous attempt's go last, so two attempts in a row never share a question,
// even when a new round of the bank starts. Remaining ties are random.
// `seen` maps question id → times shown; `last` lists the previous attempt's question ids.
const freshFirst = (questions, seen, last, rand) =>
  shuffle(questions, rand).sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0) || last.includes(a.id) - last.includes(b.id));

// One attempt: `perSection` questions from each section, in bank order (2 = the full exam, 1 = quick),
// or, when `total` is given, that many questions from anywhere in the bank (1 = super quick).
function buildMidterm(bank, { seen = {}, last = [], perSection = 2, total } = {}, rand = Math.random) {
  const pick = (questions, n) => freshFirst(questions, seen, last, rand).slice(0, n);
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

if (typeof module !== "undefined") module.exports = { shuffle, buildMidterm, suggestPoints, itemScore, grade };
