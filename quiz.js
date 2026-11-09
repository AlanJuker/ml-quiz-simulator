// Pure midterm logic: selection, shuffling and scoring. No DOM access, so it runs in Node tests too.

const PER_SECTION = 2; // each attempt draws 2 written questions from each section's bank

function shuffle(items, rand = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One attempt: PER_SECTION questions from each section, in bank order. Least-seen questions come first,
// so attempts work through the whole bank before anything repeats. Among equally seen questions the
// previous attempt's go last, so two attempts in a row never share a question, even when a new round of
// the bank starts. Remaining ties are random.
// `seen` maps question id → times shown; `last` lists the previous attempt's question ids.
function buildMidterm(bank, { seen = {}, last = [] } = {}, rand = Math.random) {
  const sections = [...new Set(bank.map((q) => q.section))];
  return sections.flatMap((section) =>
    shuffle(bank.filter((q) => q.section === section), rand)
      .sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0) || last.includes(a.id) - last.includes(b.id))
      .slice(0, PER_SECTION)
      .map((q) => ({ q, text: "", points: q.keyPoints.map(() => false), flagged: false })));
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
