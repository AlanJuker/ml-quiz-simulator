/* global MIDTERM, buildMidterm, suggestPoints, itemScore, grade */
// UI layer: renders the four screens (start → midterm → self-marking → results) into #app.

const app = document.getElementById("app");
const HISTORY_KEY = "mlquiz.history";
const SEEN_KEY = "mlquiz.midterm.seen"; // question id → times shown, so new attempts prefer unseen ones
const LAST_KEY = "mlquiz.midterm.last"; // the previous attempt's question ids, never repeated straight away
const PASS_MARK = 70;
// Quick is the default; the full exam is the real midterm's length.
const MODES = {
  quick: { title: "Quick midterm", perSection: 1, detail: "3 questions, one from each section · 14 marks" },
  full: { title: "Full midterm", perSection: 2, detail: "6 questions, like the real exam · 28 marks" },
};

let state = null; // { screen, mode, items, index, startedAt, finishedAt, timerId, saved }

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const isAnswered = (it) => it.text.trim() !== "";

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

// Older versions also stored practice-quiz attempts under this key; show only the midterm ones.
const loadHistory = () => load(HISTORY_KEY, []).filter((h) => h.midterm);

// ───────────── Start ─────────────
function renderStart() {
  state = null;
  const history = loadHistory();
  const seen = load(SEEN_KEY, {});
  const seenCount = MIDTERM.filter((q) => seen[q.id]).length;
  const seenPct = Math.round((seenCount / MIDTERM.length) * 100);
  app.innerHTML = `
    <section class="card">
      <h2>Midterm simulation</h2>
      <p class="muted">Written questions from Modules 2–6, in the format of the real midterm: workflow and methodology
      (5 marks), Python code interpretation (5 marks) and model output and interpretation (4 marks). Every new attempt
      gives you different questions: the ones you haven't seen come first. After you submit, you mark your answers
      against a model answer and a rubric worth one mark per key point.</p>
      <fieldset class="modes"><legend>Choose a length</legend>
        ${Object.entries(MODES).map(([k, m]) => `
          <label class="mode"><input type="radio" name="mode" value="${k}" ${k === "quick" ? "checked" : ""}>
            <span><strong>${m.title}</strong>${k === "quick" ? ' <span class="pill">Default</span>' : ""}<br>
            <span class="muted small">${m.detail}</span></span></label>`).join("")}
      </fieldset>
      <div class="bar-row" style="margin-bottom: 16px">
        <span>Seen ${seenCount} / ${MIDTERM.length}</span>
        <div class="bar"><span style="width: ${seenPct}%"></span></div>
        <span class="small">${seenPct}%</span>
      </div>
      <button class="primary" data-act="start">Start</button>
    </section>
    ${history.length ? `
    <section class="card">
      <div class="row spread"><h2>Your attempts</h2><button class="link" data-act="clear-history">Clear</button></div>
      <table>
        <thead><tr><th>Date</th><th>Midterm</th><th class="num">Score</th></tr></thead>
        <tbody>${history.map((h) => `
          <tr><td>${esc(new Date(h.date).toLocaleString())}</td><td>${h.mode === "quick" ? "Quick" : "Full"}</td>
          <td class="num">${h.percent}%</td></tr>`).join("")}
        </tbody>
      </table>
    </section>` : ""}`;
}

// An attempt counts as seen as soon as it starts, so even an abandoned attempt is not repeated next time.
function startMidterm(mode) {
  const seen = load(SEEN_KEY, {});
  const items = buildMidterm(MIDTERM, { seen, last: load(LAST_KEY, []), perSection: MODES[mode].perSection });
  items.forEach((it) => (seen[it.q.id] = (seen[it.q.id] || 0) + 1));
  save(SEEN_KEY, seen);
  save(LAST_KEY, items.map((it) => it.q.id));
  state = { screen: "quiz", mode, items, index: 0, startedAt: Date.now(), saved: false };
  state.timerId = setInterval(tick, 1000);
  renderQuestion();
}

// ───────────── Midterm ─────────────
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
        <span class="badge">${esc(q.section)}</span>
        <span class="badge">${q.marks} marks</span>
        ${q.kind === "code" ? '<span class="badge code">Code</span>' : ""}
      </div>
      <p class="prompt" id="prompt">${esc(q.prompt)}</p>
      ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ""}
      <textarea id="open-answer" aria-labelledby="prompt" placeholder="Write your answer as you would in the exam…">${esc(it.text)}</textarea>
    </section>
    <div class="row spread">
      <div class="row">
        <button data-act="prev" ${index === 0 ? "disabled" : ""}>← Previous</button>
        <button data-act="flag">${it.flagged ? "Unflag" : "Flag for review"}</button>
      </div>
      <div class="row">
        ${last ? "" : '<button class="primary" data-act="next">Next →</button>'}
        <button data-act="submit" class="${last ? "primary" : ""}">Submit midterm</button>
      </div>
    </div>
    <p class="muted small kbd-hint">Shortcuts outside the answer box: ← → to move · F to flag</p>`;
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
  const answered = state.items.filter(isAnswered);
  answered.forEach((it) => (it.points = suggestPoints(it.q, it.text)));
  if (answered.length) renderSelfGrade();
  else renderResults();
}

// ───────────── Self-marking ─────────────
function renderSelfGrade() {
  state.screen = "grade";
  const blocks = state.items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => isAnswered(it))
    .map(({ it, i }) => `
      <section class="card">
        <div class="badges"><span class="badge">Question ${i + 1}</span><span class="badge">Module ${it.q.module}</span>
          <span class="badge">${it.q.marks} marks</span></div>
        <p class="prompt">${esc(it.q.prompt)}</p>
        ${it.q.code ? `<pre><code>${esc(it.q.code)}</code></pre>` : ""}
        <h3>Your answer</h3>
        <p class="user-answer">${esc(it.text)}</p>
        <h3>Model answer</h3>
        <p class="model-answer">${esc(it.q.modelAnswer)}</p>
        <h3>Rubric: tick each point your answer covers (1 mark each)</h3>
        <ul class="checklist">
          ${it.q.keyPoints.map((p, j) => `
            <li><label><input type="checkbox" data-item="${i}" data-point="${j}" ${it.points[j] ? "checked" : ""}> ${esc(p.text)}</label></li>`).join("")}
        </ul>
      </section>`)
    .join("");
  app.innerHTML = `
    <section class="card">
      <h2>Mark your answers</h2>
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
    save(HISTORY_KEY, [{ date: new Date().toISOString(), midterm: true, mode: state.mode, percent: g.percent }, ...loadHistory()].slice(0, 20));
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
          ${MODES[state.mode].title}<br>
          ${Math.round(g.earned * 10) / 10} / ${g.total} marks<br>
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
        <button class="primary" data-act="start">New ${MODES[state.mode].title.toLowerCase()}</button>
        <button data-act="home">Back to start</button>
      </div>
    </section>
    <div class="row spread">
      <h2>Review</h2>
      <label class="small"><input type="checkbox" id="only-mistakes"> Only show answers that lost marks</label>
    </div>
    <div id="review">${state.items.map(reviewItem).join("")}</div>`;
  window.scrollTo(0, 0);
}

function reviewItem(it, i) {
  const q = it.q;
  const s = itemScore(it);
  const status = s === 1 ? "correct" : s === 0 ? "wrong" : "partial";
  return `<section class="card review-item ${status}">
    <div class="badges">
      <span class="badge">Q${i + 1}</span><span class="badge">Module ${q.module}</span>
      ${q.kind === "code" ? '<span class="badge code">Code</span>' : ""}
      <span class="badge">${Math.round(s * q.marks * 10) / 10} / ${q.marks} marks</span>
    </div>
    <p class="prompt">${esc(q.prompt)}</p>
    ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ""}
    <h3>Your answer</h3>
    <p class="user-answer">${isAnswered(it) ? esc(it.text) : '<span class="muted">No answer.</span>'}</p>
    <h3>Model answer</h3>
    <p class="model-answer">${esc(q.modelAnswer)}</p>
    <ul class="checklist">${q.keyPoints.map((p, j) => `<li>${isAnswered(it) && it.points[j] ? "✅" : "❌"} ${esc(p.text)}</li>`).join("")}</ul>
  </section>`;
}

// ───────────── Events ─────────────
app.addEventListener("click", (e) => {
  const goto = e.target.closest("[data-goto]");
  if (goto) return go(Number(goto.dataset.goto));
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "prev") go(state.index - 1);
  else if (act === "next") go(state.index + 1);
  else if (act === "flag") {
    state.items[state.index].flagged = !state.items[state.index].flagged;
    renderQuestion();
  } else if (act === "submit") submit();
  else if (act === "results") renderResults();
  else if (act === "start") startMidterm(document.querySelector('input[name="mode"]:checked')?.value ?? state.mode);
  else if (act === "home") renderStart();
  else if (act === "clear-history" && confirm("Delete all saved attempts?")) {
    save(HISTORY_KEY, []);
    renderStart();
  }
});

app.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.point !== undefined) {
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
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    go(state.index + (e.key === "ArrowRight" ? 1 : -1));
  } else if (e.key.toLowerCase() === "f") {
    state.items[state.index].flagged = !state.items[state.index].flagged;
    renderQuestion();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (state?.screen === "quiz") e.preventDefault();
});

renderStart();
