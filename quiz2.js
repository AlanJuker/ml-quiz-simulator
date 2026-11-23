// Quiz 2 logic: selection, shuffling and scoring for multiple-choice and short-answer questions.
// No DOM access, so it runs in Node tests too.

const CODE_SHARE = 0.2; // about 1 in 5 multiple-choice questions reads code or a model output

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

// Picks n multiple-choice questions, aiming for CODE_SHARE code/output questions and topping up from
// whatever is left if a bucket runs short. `order` ranks a list of questions (next up first).
function pickType(pool, n, order) {
  const code = order(pool.filter((q) => q.kind === "code"));
  const theory = order(pool.filter((q) => q.kind !== "code"));
  const nCode = Math.min(code.length, Math.round(n * CODE_SHARE));
  const picked = [...code.slice(0, nCode), ...theory.slice(0, n - nCode)];
  const rest = [...theory.slice(n - nCode), ...code.slice(nCode)];
  return [...picked, ...rest.slice(0, n - picked.length)];
}

// Theory before code; sort is stable, so the selection order within each kind is kept.
const theoryFirst = (a, b) => (a.kind === "code") - (b.kind === "code");

// Returns items in exam order: theory MC, code MC, then short answers. The questions are chosen without
// randomness (see nextUp); only the MC options are shuffled, so the answer is not always in the same place.
// An item's `order` maps display index → original index.
function buildQuiz(bank, { mcCount, openCount, seen = {} }, rand = Math.random) {
  const fresh = (questions) => nextUp(questions, seen);
  const mc = bank.filter((q) => q.type === "mc");
  const open = bank.filter((q) => q.type === "open");
  return [
    ...pickType(mc, Math.min(mc.length, mcCount), fresh).sort(theoryFirst)
      .map((q) => ({ q, order: shuffle([0, 1, 2, 3], rand), choice: null, flagged: false })),
    ...fresh(open).slice(0, Math.min(open.length, openCount)).sort(theoryFirst)
      .map((q) => ({ q, text: "", points: q.keyPoints.map(() => false), flagged: false })),
  ];
}

// Pre-ticks the key points whose keywords appear in the answer; the student reviews and adjusts.
function suggestPoints(question, text) {
  const t = ` ${text.toLowerCase()} `;
  return question.keyPoints.map((p) => p.keywords.some((k) => t.includes(k.toLowerCase())));
}

// Score of one item in [0, 1]. Short answers earn partial credit per key point; blanks earn nothing.
function itemScore(item) {
  if (item.q.type === "mc") return item.choice !== null && item.order[item.choice] === item.q.answer ? 1 : 0;
  if (!item.text.trim()) return 0;
  return item.points.filter(Boolean).length / item.points.length;
}

function grade(items) {
  const groups = {};
  const add = (key, s) => {
    groups[key] ??= { earned: 0, total: 0 };
    groups[key].earned += s;
    groups[key].total += 1;
  };
  let earned = 0;
  for (const it of items) {
    const s = itemScore(it);
    earned += s;
    add(`Module ${it.q.module}`, s);
    add(it.q.type === "mc" ? "Multiple choice" : "Short answer", s);
  }
  return { earned, total: items.length, percent: items.length ? Math.round((earned / items.length) * 100) : 0, groups };
}

if (typeof module !== "undefined") module.exports = { shuffle, buildQuiz, nextUp, markDone, timesDone, suggestPoints, itemScore, grade, CODE_SHARE };
