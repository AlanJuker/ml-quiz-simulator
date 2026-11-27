/* global QUIZ2, buildQuiz, markDone, suggestPoints, itemScore, grade */
// UI layer for Quiz 2: renders the four screens (setup → quiz → self-grading → results) into #app.

const app = document.getElementById("app");
const HISTORY_KEY = "mlquiz.quiz2.history";
const INSTANT_KEY = "mlquiz.quiz2.feedback"; // remembers the "Instant feedback" choice (on by default)
const SEEN_KEY = "mlquiz.quiz2.seen"; // question id → { n, at }: times completed and when, so attempts walk the bank
const PASS_MARK = 70;
const LETTERS = "ABCD";
// Quiz 2 is 10 multiple choice + 2 short answer on Modules 7 and 8. Quick is the default. No time limit has
// been announced, so the clock shows the time used instead of counting down.
const MC_TOTAL = QUIZ2.filter((q) => q.type === "mc").length;
const FORMATS = {
  quick: { title: "Quick", detail: "5 multiple choice + 1 short answer", mc: 5, open: 1 },
  mc: { title: "Multiple choice", detail: "5 multiple-choice questions", mc: 5, open: 0 },
  open: { title: "Quick open", detail: "1 short-answer question", mc: 0, open: 1 },
  real: { title: "Real Quiz 2", detail: "10 multiple choice + 2 short answer", mc: 10, open: 2 },
  marathon: { title: "Marathon", detail: `All ${MC_TOTAL} multiple-choice questions. Pass it (${PASS_MARK}%+) and you are ready for Quiz 2.`, mc: MC_TOTAL, open: 0 },
};
// Each format has a different number of questions, so an attempt's length tells its format.
const formatName = (total) => Object.values(FORMATS).find((f) => f.mc + f.open === total)?.title ?? `${total} questions`;

let state = null; // { screen, format, instant, items, index, startedAt, finishedAt, timerId, saved }

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const isAnswered = (it) => (it.q.type === "mc" ? it.choice !== null : it.text.trim() !== "");

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode); history and progress are conveniences, so ignore.
  }
}

// ───────────── Setup ─────────────
function renderSetup(format = "quick") {
  state = null;
  const history = load(HISTORY_KEY, []);
  const seen = load(SEEN_KEY, {});
  const seenCount = QUIZ2.filter((q) => seen[q.id]).length;
  const seenPct = Math.round((seenCount / QUIZ2.length) * 100);
  app.innerHTML = `
    <section class="card">
      <h2>Quiz 2 practice</h2>
      <p class="muted">Questions on Module 7 (support vector machines) and Module 8 (dimensionality reduction).
      <strong>Real Quiz 2</strong> has 10 multiple-choice and 2 short-answer questions; <strong>Quick</strong> has 5 + 1.
      Each attempt mixes both modules. About 1 in 5 multiple-choice questions asks you to read code or a model output.
      Every new attempt continues through the bank with questions you have not done yet, so nothing repeats until you
      have done them all. An attempt counts once you submit it; if you leave one unfinished, you get the same questions
      next time. After you submit, you mark your short answers against a model answer and a rubric.</p>
      <fieldset class="modes"><legend>Choose a length</legend>
        ${Object.entries(FORMATS).map(([k, f]) => `
          <label class="mode ${k === "marathon" ? "best" : ""}"><input type="radio" name="format" value="${k}" ${k === format ? "checked" : ""}>
            <span><strong>${f.title}</strong>${k === "quick" ? ' <span class="pill">Default</span>' : ""}${k === "marathon" ? ' <span class="pill good">Exam-ready check</span>' : ""}<br>
            <span class="muted small">${f.detail}</span></span></label>`).join("")}
      </fieldset>
      <label class="mode" style="margin-bottom: 16px"><input type="checkbox" id="instant" ${load(INSTANT_KEY, true) ? "checked" : ""}>
        <span><strong>Instant feedback</strong><br><span class="muted small">See if each answer is right, with the explanation,
        as soon as you pick it (answers lock once chosen). Short answers get a "Show model answer" button.</span></span></label>
      <div class="bar-row" style="margin-bottom: 16px">
        <span>Seen ${seenCount} / ${QUIZ2.length}</span>
        <div class="bar"><span style="width: ${seenPct}%"></span></div>
        <span class="small">${seenPct}%</span>
      </div>
      <button class="primary" data-act="start">Start</button>
      <p class="muted small" style="margin: 14px 0 0">Revise first with the <a href="study.html">Quiz 2 study guide</a>.</p>
    </section>
    ${history.length ? `
    <section class="card">
      <div class="row spread"><h2>Your attempts</h2><button class="link" data-act="clear-history">Clear</button></div>
      <table>
        <thead><tr><th>Date</th><th>Length</th><th class="num">Score</th></tr></thead>
        <tbody>${history.map((h) => `
          <tr><td>${esc(new Date(h.date).toLocaleString())}</td><td>${esc(formatName(h.total))}</td>
          <td class="num">${h.percent}%</td></tr>`).join("")}
        </tbody>
      </table>
    </section>` : ""}
    <details class="legacy"><summary>Legacy practice</summary>
      <p class="small">Earlier material, kept for a future full exam: the <a href="midterm.html">midterm simulator</a>
      (Modules 2–6) and the <a href="study-midterm.html">midterm study guide</a>.</p>
    </details>`;
}

// Questions are recorded only when the attempt is submitted, so an unfinished attempt comes back unchanged.
function startQuiz(format, instant) {
  const f = FORMATS[format];
  const items = buildQuiz(QUIZ2, { mcCount: f.mc, openCount: f.open, seen: load(SEEN_KEY, {}) });
  state = { screen: "quiz", format, instant, items, index: 0, startedAt: Date.now(), saved: false };
  state.timerId = setInterval(tick, 1000);
  renderQuestion();
}

// ───────────── Quiz ─────────────
const timerText = () => `⏱ ${fmt(Math.floor((Date.now() - state.startedAt) / 1000))}`;

function tick() {
  const el = document.getElementById("timer");
  if (el) el.textContent = timerText();
}

function navClass(it, i) {
  return [isAnswered(it) && "answered", it.flagged && "flagged", i === state.index && "current"].filter(Boolean).join(" ");
}

function updateProgress() {
  const { items } = state;
  document.querySelector(".progress > span").style.width = `${(items.filter(isAnswered).length / items.length) * 100}%`;
  document.querySelector(`[data-goto="${state.index}"]`).className = navClass(items[state.index], state.index);
}

function renderQuestion() {
  const { items, index } = state;
  const it = items[index];
  const q = it.q;
  const last = index === items.length - 1;
  const feedback = state.instant && q.type === "mc" && it.choice !== null; // instant mode: answer locked, show the verdict
  app.innerHTML = `
    <div class="topbar">
      <strong>Question ${index + 1} of ${items.length}</strong>
      <span class="timer" id="timer" role="timer">${timerText()}</span>
    </div>
    <div class="progress" aria-hidden="true"><span style="width: ${(items.filter(isAnswered).length / items.length) * 100}%"></span></div>
    <nav class="nav" aria-label="Question navigator">
      ${items.map((x, i) => `<button type="button" data-goto="${i}" class="${navClass(x, i)}"
        aria-label="Question ${i + 1}${isAnswered(x) ? ", answered" : ""}${x.flagged ? ", flagged" : ""}">${i + 1}</button>`).join("")}
    </nav>
    <section class="card">
      <div class="badges">
        <span class="badge">Module ${q.module}</span>
        <span class="badge">${q.type === "mc" ? "Multiple choice" : "Short answer"}</span>
        ${q.kind === "code" ? '<span class="badge code">Code / output</span>' : ""}
      </div>
      <p class="prompt" id="prompt">${esc(q.prompt)}</p>
      ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ""}
      ${q.type === "mc"
        ? `<div class="options" role="radiogroup" aria-labelledby="prompt">
            ${it.order.map((orig, i) => `
              <label class="option ${feedback ? (orig === q.answer ? "right" : it.choice === i ? "wrong" : "") : ""}">
              <input type="radio" name="opt" value="${i}" ${it.choice === i ? "checked" : ""} ${feedback ? "disabled" : ""}>
              <span class="letter">${LETTERS[i]}</span><span>${esc(q.options[orig])}</span></label>`).join("")}
          </div>
          ${feedback ? `<div class="feedback ${it.order[it.choice] === q.answer ? "right" : "wrong"}" role="status">
            <strong>${it.order[it.choice] === q.answer ? "✓ Correct" : `✗ Not quite. The answer is ${LETTERS[it.order.indexOf(q.answer)]}.`}</strong>
            <p>${esc(q.explanation)}</p></div>` : ""}`
        : `<textarea id="open-answer" aria-labelledby="prompt" placeholder="Write your answer as you would in the quiz…">${esc(it.text)}</textarea>
          ${state.instant ? `<details class="feedback"><summary>Show model answer</summary>
            <p>${esc(q.modelAnswer)}</p>
            <ul>${q.keyPoints.map((p) => `<li>${esc(p.text)}</li>`).join("")}</ul></details>` : ""}`}
    </section>
    <div class="row spread">
      <div class="row">
        <button data-act="prev" ${index === 0 ? "disabled" : ""}>← Previous</button>
        <button data-act="flag">${it.flagged ? "Unflag" : "Flag for review"}</button>
      </div>
      <div class="row">
        ${last ? "" : '<button class="primary" data-act="next">Next →</button>'}
        <button data-act="submit" class="${last ? "primary" : ""}">Submit quiz</button>
      </div>
    </div>
    <p class="muted small kbd-hint">Shortcuts outside the answer box: 1–4 or A–D to answer · ← → to move · F to flag</p>`;
}

function go(i) {
  if (i < 0 || i >= state.items.length) return;
  state.index = i;
  renderQuestion();
}

function submit() {
  const missing = state.items.filter((it) => !isAnswered(it)).length;
  if (missing && !confirm(`You have ${missing} unanswered question${missing > 1 ? "s" : ""}. Submit anyway?`)) return;
  clearInterval(state.timerId);
  state.finishedAt = Date.now();
  save(SEEN_KEY, markDone(load(SEEN_KEY, {}), state.items.map((it) => it.q.id)));
  const open = state.items.filter((it) => it.q.type === "open" && it.text.trim());
  open.forEach((it) => (it.points = suggestPoints(it.q, it.text)));
  if (open.length) renderSelfGrade();
  else renderResults();
}

// ───────────── Self-grading of short answers ─────────────
function renderSelfGrade() {
  state.screen = "grade";
  const blocks = state.items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => it.q.type === "open" && it.text.trim())
    .map(({ it, i }) => `
      <section class="card">
        <div class="badges"><span class="badge">Question ${i + 1}</span><span class="badge">Module ${it.q.module}</span></div>
        <p class="prompt">${esc(it.q.prompt)}</p>
        ${it.q.code ? `<pre><code>${esc(it.q.code)}</code></pre>` : ""}
        <h3>Your answer</h3>
        <p class="user-answer">${esc(it.text)}</p>
        <h3>Model answer</h3>
        <p class="model-answer">${esc(it.q.modelAnswer)}</p>
        <h3>Rubric: tick each point your answer covers</h3>
        <ul class="checklist">
          ${it.q.keyPoints.map((p, j) => `
            <li><label><input type="checkbox" data-item="${i}" data-point="${j}" ${it.points[j] ? "checked" : ""}> ${esc(p.text)}</label></li>`).join("")}
        </ul>
      </section>`)
    .join("");
  app.innerHTML = `
    <section class="card">
      <h2>Mark your short answers</h2>
      <p class="muted">Points were pre-ticked by keyword matching. Be honest: untick anything you did not really explain, and tick anything you covered in other words.</p>
    </section>
    ${blocks}
    <div class="row"><button class="primary" data-act="results">See my results</button></div>`;
  window.scrollTo(0, 0);
}

// ───────────── Results ─────────────
function renderResults() {
  state.screen = "results";
  const g = grade(state.items);
  const seconds = Math.round((state.finishedAt - state.startedAt) / 1000);
  if (!state.saved) {
    save(HISTORY_KEY, [{ date: new Date().toISOString(), total: g.total, percent: g.percent }, ...load(HISTORY_KEY, [])].slice(0, 20));
    state.saved = true;
  }
  const pass = g.percent >= PASS_MARK;
  app.innerHTML = `
    <section class="card">
      <div class="row spread">
        <div>
          <div class="score">${g.percent}%</div>
          <div class="verdict ${pass ? "pass" : "fail"}">${pass ? "Pass" : "Below the pass mark"} (${PASS_MARK}%)</div>
        </div>
        <div class="muted small">
          ${FORMATS[state.format].title}<br>
          ${Math.round(g.earned * 10) / 10} / ${g.total} points<br>
          Time used: ${fmt(seconds)}
        </div>
      </div>
      <h3>Breakdown</h3>
      <div class="bars">
        ${Object.entries(g.groups).sort().map(([k, v]) => {
          const pct = Math.round((v.earned / v.total) * 100);
          return `<div class="bar-row"><span>${esc(k)}</span><div class="bar"><span style="width: ${pct}%"></span></div><span class="small">${pct}%</span></div>`;
        }).join("")}
      </div>
      <div class="row" style="margin-top: 18px">
        <button class="primary" data-act="retake">New ${FORMATS[state.format].title.toLowerCase()} attempt</button>
        <button data-act="home">Back to start</button>
      </div>
    </section>
    <div class="row spread">
      <h2>Review</h2>
      <label class="small"><input type="checkbox" id="only-mistakes"> Only show mistakes</label>
    </div>
    <div id="review">${state.items.map(reviewItem).join("")}</div>`;
  window.scrollTo(0, 0);
}

function reviewItem(it, i) {
  const q = it.q;
  const s = itemScore(it);
  const status = s === 1 ? "correct" : s === 0 ? "wrong" : "partial";
  const head = `
    <div class="badges">
      <span class="badge">Q${i + 1}</span><span class="badge">Module ${q.module}</span>
      ${q.kind === "code" ? '<span class="badge code">Code / output</span>' : ""}
      <span class="badge">${q.type === "mc" ? `${s} / 1` : `${Math.round(s * 100)}%`}</span>
    </div>
    <p class="prompt">${esc(q.prompt)}</p>
    ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ""}`;
  if (q.type === "mc") {
    const picked = it.choice === null ? null : it.order[it.choice];
    return `<section class="card review-item ${status}">${head}
      ${picked === null ? '<div class="answer-line bad">You did not answer.</div>'
        : picked !== q.answer ? `<div class="answer-line bad">Your answer: ${esc(q.options[picked])}</div>` : ""}
      <div class="answer-line good">Correct answer: ${esc(q.options[q.answer])}</div>
      <p class="explanation">${esc(q.explanation)}</p>
    </section>`;
  }
  return `<section class="card review-item ${status}">${head}
    <h3>Your answer</h3>
    <p class="user-answer">${it.text.trim() ? esc(it.text) : '<span class="muted">No answer.</span>'}</p>
    <h3>Model answer</h3>
    <p class="model-answer">${esc(q.modelAnswer)}</p>
    <ul class="checklist">${q.keyPoints.map((p, j) => `<li>${it.text.trim() && it.points[j] ? "✅" : "❌"} ${esc(p.text)}</li>`).join("")}</ul>
  </section>`;
}

// ───────────── Events ─────────────
app.addEventListener("click", (e) => {
  const goto = e.target.closest("[data-goto]");
  if (goto) return go(Number(goto.dataset.goto));
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "start") {
    const instant = document.getElementById("instant").checked;
    save(INSTANT_KEY, instant);
    startQuiz(document.querySelector('input[name="format"]:checked')?.value ?? "quick", instant);
  }
  else if (act === "prev") go(state.index - 1);
  else if (act === "next") go(state.index + 1);
  else if (act === "flag") {
    state.items[state.index].flagged = !state.items[state.index].flagged;
    renderQuestion();
  } else if (act === "submit") submit();
  else if (act === "results") renderResults();
  else if (act === "retake") startQuiz(state.format, state.instant);
  else if (act === "home") renderSetup(state.format);
  else if (act === "clear-history" && confirm("Delete all saved attempts?")) {
    save(HISTORY_KEY, []);
    renderSetup();
  }
});

app.addEventListener("change", (e) => {
  const t = e.target;
  if (t.name === "opt") {
    state.items[state.index].choice = Number(t.value);
    if (state.instant) renderQuestion(); // show the verdict and explanation
    else updateProgress();
  } else if (t.dataset.point !== undefined) {
    state.items[Number(t.dataset.item)].points[Number(t.dataset.point)] = t.checked;
  } else if (t.id === "only-mistakes") {
    document.querySelectorAll("#review .review-item.correct").forEach((el) => (el.hidden = t.checked));
  }
});

app.addEventListener("input", (e) => {
  if (e.target.id !== "open-answer") return;
  state.items[state.index].text = e.target.value;
  updateProgress();
});

document.addEventListener("keydown", (e) => {
  if (state?.screen !== "quiz" || e.metaKey || e.ctrlKey || e.altKey || e.target.tagName === "TEXTAREA") return;
  const it = state.items[state.index];
  const key = e.key.toLowerCase();
  const opt = "1234".indexOf(key) >= 0 ? "1234".indexOf(key) : "abcd".indexOf(key);
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    go(state.index + (e.key === "ArrowRight" ? 1 : -1));
  } else if (key === "f") {
    it.flagged = !it.flagged;
    renderQuestion();
  } else if (it.q.type === "mc" && opt >= 0 && !(state.instant && it.choice !== null)) {
    it.choice = opt;
    renderQuestion();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (state?.screen === "quiz") e.preventDefault();
});

renderSetup();
