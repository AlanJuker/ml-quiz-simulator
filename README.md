# ML Quiz Simulator

A **midterm simulation for Modules 2–6** and a practice quiz for **Modules 1–3** of Machine Learning. Every attempt is scored, and every question comes with an explanation or a model answer.

**Live:** https://alanjuker.github.io/ml-quiz-simulator/

| Module | Topics |
| --- | --- |
| 1 · The ML landscape | Mitchell's T/E/P, supervised vs unsupervised, batch vs online, instance- vs model-based, data quality, overfitting/underfitting, train/validation/test |
| 2 · End-to-end workflow | Problem framing, metrics (precision, recall, RMSE, MAE), EDA, cleaning, encoding, scaling, leakage, pipelines, cross-validation, Grid/Randomized Search |
| 3 · Classification | Confusion matrix, precision/recall/F1/specificity, thresholds, ROC/AUC vs PR curves, stratified k-fold, OvR/OvO, error analysis, multilabel/multioutput |

## Midterm simulation

Six written questions in the format of the real midterm, drawn from a bank of 30 (10 per section):

| Section | Questions | Marks | What it asks |
| --- | --- | --- | --- |
| Workflow & methodology | 2 | 5 each | A scenario (often a hospital) with a flawed ML workflow: find the problems, say what the first step should be, and decide what to do |
| Python code interpretation | 2 | 5 each | A short Scikit-Learn snippet: explain its purpose, the role of a function and why a parameter is used |
| Model output & interpretation | 2 | 4 each | A classification report, confusion matrix or results table: compare classes or models, select one and explain the differences |

- The outputs in the third section come from the class demos (Modules 3, 5 and 6) or from running the Module 4 lab code.
- Questions you have not seen yet come first, so five attempts cover the whole bank.
- After you submit, you mark each answer against a model answer and a rubric with one key point per mark, so the score is out of 28.

## Practice quiz (Modules 1–3)

Each attempt is drawn at random from a bank of 167 questions and can be timed.

- **Mix:** 80% multiple choice and 20% open answer. About 80% of the questions are theory and 20% ask you to interpret Scikit-Learn code from the labs. Questions come in this order: theory multiple choice, code multiple choice, then the open questions.
- **Setup:** choose the modules, the length (10, 20 or 30 questions) and an optional timer (60 or 90 s per question).
- **During the quiz:** a question navigator, flags, and keyboard shortcuts (`1`–`4` / `A`–`D` to answer, `←` `→` to move, `F` to flag).
- **Open answers:** after you submit, you see the model answer and a rubric. Points are pre-ticked by keyword matching, and you confirm or correct them. Each open answer earns partial credit.
- **Results:** your score against a 70% pass mark, a breakdown by module, question type and theory vs code, and a full review with explanations. Past attempts are saved in your browser.

Multiple-choice options are shuffled on every attempt. The distractors are based on common misconceptions, and a test checks that the correct option is never noticeably longer than the others.

## Run locally

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npm start          # python3 -m http.server 8000 → http://localhost:8000
```

## Tests

```bash
npm test           # node --test (Node 20+)
```

The tests check that both banks are well formed, that each quiz follows the 80/20 mixes, that grading still matches after the options are shuffled, and that open answers get the right partial credit. For the midterm they also check the 2-2-2 section order, that five attempts cover the bank without repeats, that scores are weighted by marks, and that every model answer earns full marks under the rubric. CI runs them on every push.

## Project structure

```
index.html        page shell
styles.css        light/dark theme, responsive layout
questions.js      practice-quiz bank (edit here to add questions)
midterm.js        midterm bank: 3 sections × 10 written questions
quiz.js           pure logic: selection, shuffling, scoring in marks
app.js            UI: setup → quiz → self-grading → results
test/             node:test suite
```

### Adding a question

Append an object to `QUESTIONS` in `questions.js`:

```js
{
  id: "m3-23", module: 3, type: "mc", kind: "theory",   // kind: "theory" | "code"
  prompt: "…", code: "optional snippet",
  options: ["correct", "distractor", "distractor", "distractor"],
  answer: 0,                                            // index into options
  explanation: "Why the answer is correct.",
}
```

Open questions use `type: "open"` with `modelAnswer` and `keyPoints: [{ text, keywords: [] }]`. Run `npm test` to validate the bank.

## Disclaimer

This is an unofficial study aid. The questions are written from the Module 1–6 readings, lab notebooks and class demos, following the format the professor described for the midterm. They are not the actual exam questions.

## License

[MIT](LICENSE)
