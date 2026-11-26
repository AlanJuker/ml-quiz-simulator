# ML Quiz 2 Simulator

Practice and a **study guide** for Machine Learning (MCAI/CSAI 500) **Quiz 2**: Module 7 (support vector machines) and Module 8 (dimensionality reduction). The real quiz has **10 multiple-choice and 2 short-answer questions**.

**Live:** https://alanjuker.github.io/ml-quiz-simulator/

**Study guide:** https://alanjuker.github.io/ml-quiz-simulator/study.html

## Quiz 2 practice

Questions come from a bank of 69: 59 multiple choice (28 on Module 7, 31 on Module 8) and 10 short answers (5 per module). The questions are written from the Cascade readings, the teaching demos and the in-class activities, and about 1 in 5 multiple-choice questions asks you to read scikit-learn code or a model output from class (penguins, breast cancer, MNIST).

| Length | Questions |
| --- | --- |
| **Quick** (default) | 5 multiple choice + 1 short answer |
| Multiple choice | 5 multiple choice |
| Quick open | 1 short answer |
| Real Quiz 2 | 10 multiple choice + 2 short answer |

- **Always a different attempt, never random:** each attempt takes the questions you have completed the fewest times, then the ones done longest ago, following a fixed walk through the bank that alternates Module 7 and Module 8. Nothing repeats until you have done every question (7 Real Quiz 2 attempts cover the whole bank), and every attempt mixes both modules. The start screen shows how much of the bank you have seen.
- **Unfinished attempts come back:** an attempt counts only once you submit it, so if you leave one unfinished, the next start gives you the same questions.
- **Instant feedback (optional):** tick it on the start screen to see whether each multiple-choice answer is right, with its explanation, as soon as you pick it (the answer then locks). Short answers get a "Show model answer" button. The choice is remembered.
- **During the attempt:** a question navigator, flags, a clock showing the time used (no time limit has been announced), and shortcuts (`1`–`4` / `A`–`D` to answer, `←` `→` to move, `F` to flag).
- **Marking:** multiple-choice answers are marked automatically, with an explanation for each question. Short answers are self-marked against a model answer and a rubric; points are pre-ticked by keyword matching and you confirm or correct them. You get a score against a 70% pass mark and a breakdown by module and question type.
- Past attempts and the questions you have seen are saved in your browser.

## Study guide

The [study guide](study.html) has a chapter per module, each opening with a key idea and broken into short topic cards, with a contents menu that follows your reading:

- **Module 7:** margin and support vectors, hard vs soft margin and C, feature scaling, kernels and the kernel trick, tuning C, gamma and degree, the scikit-learn workflow (pipeline, GridSearchCV, balanced accuracy, one-versus-one), SVR, strengths and limits.
- **Module 8:** the curse of dimensionality, selection vs extraction, PCA, choosing the number of components, LDA, PCA vs LDA, t-SNE, and reduction inside a pipeline.
- Diagrams (margin and support vectors, small vs large C, the kernel trick, small vs large gamma, PCA axes, the penguin scree plot, PCA vs LDA projections, MNIST accuracy by LDA components), outputs from the class notebooks with "What it means" notes, a method chooser, a code cheat sheet, common traps and a last-minute review.

## Legacy: midterm (Modules 2–6)

Earlier material is kept for a future full exam but is not linked from the main navigation. It is reachable from **Legacy practice** at the bottom of the practice page:

- [Midterm simulator](midterm.html): written questions in the midterm format (workflow and methodology, Python code interpretation, model output interpretation and method selection; 5 marks each), with Super quick, Quick and Full lengths and a countdown.
- [Midterm study guide](study-midterm.html): Modules 1–6.

## Run locally

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npm start          # python3 -m http.server 8000 → http://localhost:8000
```

## Tests

```bash
npm test           # node --test (Node 20+)
```

For Quiz 2, the tests check that the bank is well formed, that every model answer earns full marks under its rubric, that each module is about half of the bank, that each length has the right questions in the right order, that selection is deterministic and an unfinished attempt repeats, that every real attempt mixes both modules, that 7 real attempts cover the bank, that consecutive attempts never share a question, and that scoring and partial credit work. The legacy midterm keeps its own tests. CI runs them on every push.

## Project structure

```
index.html          Quiz 2 practice page
quiz2-bank.js       Quiz 2 question bank (Modules 7–8)
quiz2.js            Quiz 2 logic: selection, shuffling, scoring
quiz2-app.js        Quiz 2 UI: start → quiz → self-marking → results
study.html          Quiz 2 study guide
styles.css          light/dark theme, responsive layout, guide and diagram styles
midterm.html        legacy midterm simulator page
midterm.js          legacy midterm bank (Modules 2–6)
quiz.js, app.js     legacy midterm logic and UI
study-midterm.html  legacy midterm study guide
test/               node:test suite
```

When you change a script or `styles.css`, bump the `?v=` version on their links in the pages that load them. GitHub Pages lets browsers cache each file for 10 minutes, so without it a browser can mix a new file with an old one.

### Adding a Quiz 2 question

Append an object to `QUIZ2` in `quiz2-bank.js`:

```js
{
  id: "q7-22", module: 7, type: "mc", kind: "theory",   // kind: "theory" | "code" (code or a model output)
  prompt: "…", code: "optional snippet or output",
  options: ["correct", "distractor", "distractor", "distractor"],
  answer: 0,                                             // index into options (options are shuffled when shown)
  explanation: "Why the answer is correct.",
}
```

Short answers use `type: "open"` with `modelAnswer` and `keyPoints: [{ text, keywords: [] }]`. Run `npm test` to validate the bank.

## Disclaimer

This is an unofficial study aid. The questions are written from the Module 7–8 readings, teaching demos and in-class activities (and, for the legacy midterm, Modules 1–6). They are not the actual quiz or exam questions.

## License

[MIT](LICENSE)
