// Pure quiz logic: selection, shuffling and scoring. No DOM access, so it runs in Node tests too.

const OPEN_SHARE = 0.2; // 80% multiple choice, 20% open
const CODE_SHARE = 0.2; // 80% theory, 20% code interpretation
const MIDTERM_PER_SECTION = 2; // the midterm draws 2 written questions from each section's bank

function shuffle(items, rand = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks n questions of one type, aiming for CODE_SHARE code questions and topping up from
// whatever is left if a bucket runs short.
function pickType(pool, n, rand) {
  const code = shuffle(pool.filter((q) => q.kind === "code"), rand);
  const theory = shuffle(pool.filter((q) => q.kind !== "code"), rand);
  const nCode = Math.min(code.length, Math.round(n * CODE_SHARE));
  const picked = [...code.slice(0, nCode), ...theory.slice(0, n - nCode)];
  const rest = [...theory.slice(n - nCode), ...code.slice(nCode)];
  return [...picked, ...rest.slice(0, n - picked.length)];
}

// Theory before code; sort is stable, so the random order within each kind is kept.
const theoryFirst = (a, b) => (a.kind === "code") - (b.kind === "code");

const openItem = (q) => ({ q, text: "", points: q.keyPoints.map(() => false), flagged: false });

// Returns quiz items in exam order: theory MC, code MC, then open questions (theory, then code).
// MC options are shuffled; `order` maps display index → original index.
function buildQuiz(bank, { modules, total }, rand = Math.random) {
  const pool = bank.filter((q) => modules.includes(q.module));
  const mc = pool.filter((q) => q.type === "mc");
  const open = pool.filter((q) => q.type === "open");
  const nOpen = Math.min(open.length, Math.round(total * OPEN_SHARE));
  const nMc = Math.min(mc.length, total - nOpen);
  return [
    ...shuffle(pickType(mc, nMc, rand), rand).sort(theoryFirst).map((q) => ({ q, order: shuffle([0, 1, 2, 3], rand), choice: null, flagged: false })),
    ...shuffle(pickType(open, nOpen, rand), rand).sort(theoryFirst).map(openItem),
  ];
}

// Midterm: MIDTERM_PER_SECTION questions from each section, in bank order. Least-seen questions come
// first (random among ties), so repeated attempts work through the whole bank before anything repeats.
// `seen` maps question id → times already shown.
function buildMidterm(bank, seen = {}, rand = Math.random) {
  const sections = [...new Set(bank.map((q) => q.section))];
  return sections.flatMap((section) =>
    shuffle(bank.filter((q) => q.section === section), rand)
      .sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0))
      .slice(0, MIDTERM_PER_SECTION)
      .map(openItem));
}

// Pre-ticks the key points whose keywords appear in the answer; the student reviews and adjusts.
function suggestPoints(question, text) {
  const t = ` ${text.toLowerCase()} `;
  return question.keyPoints.map((p) => p.keywords.some((k) => t.includes(k.toLowerCase())));
}

// Score of one item in [0, 1]. Open questions earn partial credit per key point.
function itemScore(item) {
  if (item.q.type === "mc") return item.choice !== null && item.order[item.choice] === item.q.answer ? 1 : 0;
  if (!item.text.trim()) return 0;
  return item.points.filter(Boolean).length / item.points.length;
}

// Totals are in marks: a question is worth q.marks (midterm) or 1 (practice quiz).
function grade(items) {
  const groups = {};
  const add = (key, s, marks) => {
    groups[key] ??= { earned: 0, total: 0 };
    groups[key].earned += s * marks;
    groups[key].total += marks;
  };
  let earned = 0;
  let total = 0;
  for (const it of items) {
    const s = itemScore(it);
    const marks = it.q.marks ?? 1;
    earned += s * marks;
    total += marks;
    add(`Module ${it.q.module}`, s, marks);
    if (it.q.section) add(it.q.section, s, marks);
    else {
      add(it.q.type === "mc" ? "Multiple choice" : "Open answer", s, marks);
      add(it.q.kind === "code" ? "Code interpretation" : "Theory", s, marks);
    }
  }
  return { earned, total, percent: total ? Math.round((earned / total) * 100) : 0, groups };
}

if (typeof module !== "undefined") module.exports = { shuffle, buildQuiz, buildMidterm, suggestPoints, itemScore, grade, OPEN_SHARE, CODE_SHARE };
