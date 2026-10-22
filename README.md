# ML Quiz Simulator

A practice quiz for **Machine Learning Modules 1–3**. Each attempt is drawn at random from a bank of 106 questions, it can be timed, it is scored, and every question comes with an explanation.

**Live:** https://alanjuker.github.io/ml-quiz-simulator/

| Module | Topics |
| --- | --- |
| 1 · The ML landscape | Mitchell's T/E/P, supervised vs unsupervised, batch vs online, instance- vs model-based, data quality, overfitting/underfitting, train/validation/test |
| 2 · End-to-end workflow | Problem framing, metrics (precision, recall, RMSE, MAE), EDA, cleaning, encoding, scaling, leakage, pipelines, cross-validation, Grid/Randomized Search |
| 3 · Classification | Confusion matrix, precision/recall/F1/specificity, thresholds, ROC/AUC vs PR curves, stratified k-fold, OvR/OvO, error analysis, multilabel/multioutput |

## How a quiz works

- **Mix:** 80% multiple choice and 20% open answer. About 80% of the questions are theory and 20% ask you to interpret Scikit-Learn code from the labs.
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

The tests check that the question bank is well formed, that each quiz follows the 80/20 mixes, that grading still matches after the options are shuffled, and that open answers get the right partial credit. CI runs them on every push.

## Project structure

```
index.html        page shell
styles.css        light/dark theme, responsive layout
questions.js      question bank (edit here to add questions)
quiz.js           pure logic: selection, shuffling, scoring
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

This is an unofficial study aid. The questions are written from the Module 1–3 readings and lab notebooks, and they are not the professor's actual quiz.

## License

[MIT](LICENSE)
