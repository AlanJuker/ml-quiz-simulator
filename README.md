# ML Midterm Simulator

A **midterm simulation** and a **study guide** for Machine Learning (MCAI/CSAI 500), Modules 2–6. Every attempt is self-marked against a model answer and a rubric.

**Live:** https://alanjuker.github.io/ml-quiz-simulator/

**Study guide:** https://alanjuker.github.io/ml-quiz-simulator/study.html. It explains Modules 1–6 in plain English, using the code from the teaching demos and in-class activities. It also shows how to answer each midterm section and includes a code cheat sheet and a last-minute review.

## Midterm simulation

Written questions in the format of the real midterm, drawn from a bank of 30 (10 per section). There are two lengths:

- **Quick midterm (default):** 3 questions, one from each section, 14 marks.
- **Full midterm:** 6 questions, two from each section, 28 marks, like the real exam.

The three sections:

| Section | Marks | What it asks |
| --- | --- | --- |
| Workflow & methodology | 5 each | A scenario (often a hospital) with a flawed ML workflow: find the problems, say what the first step should be, and decide what to do |
| Python code interpretation | 5 each | A short Scikit-Learn snippet: explain its purpose, the role of a function and why a parameter is used |
| Model output & interpretation | 4 each | A classification report, confusion matrix or results table: compare classes or models, select one and explain the differences |

- **Always a different attempt:** questions you have not seen come first, so every 10 quick or 5 full attempts cover all 30. An attempt counts as soon as it starts, and the next one never repeats any question from it, even when the bank starts a new round.
- **During the attempt:** a question navigator, flags, an elapsed-time clock, and `←` `→` / `F` shortcuts.
- **Marking:** after you submit, you see each model answer and a rubric with one key point per mark. Points are pre-ticked by keyword matching, and you confirm or correct them. The score is in marks (out of 14 or 28), against a 70% pass mark, with a breakdown by section and module.
- The outputs in the third section come from the class demos (Modules 3, 5 and 6) or from running the Module 4 lab code.
- Past attempts and the questions you have seen are saved in your browser.

## Run locally

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npm start          # python3 -m http.server 8000 → http://localhost:8000
```

## Tests

```bash
npm test           # node --test (Node 20+)
```

The tests check that the bank is well formed, that every model answer earns full marks under its rubric, that quick and full attempts follow the section order, that every 10 quick or 5 full attempts cover the bank, that consecutive attempts never share a question, and that scores are weighted by marks. CI runs them on every push.

## Project structure

```
index.html        page shell
study.html        study guide (static page)
styles.css        light/dark theme, responsive layout
midterm.js        question bank: 3 sections × 10 written questions
quiz.js           pure logic: selection, scoring in marks
app.js            UI: start → midterm → self-marking → results
test/             node:test suite
```

When you change a script or `styles.css`, bump the `?v=` version on their links in `index.html` (and `study.html` for the stylesheet). GitHub Pages lets browsers cache each file for 10 minutes, so without it a browser can mix a new file with an old one.

### Adding a question

Append an object to `MIDTERM` in `midterm.js`, with one key point per mark:

```js
{
  id: "mt-w11", module: 4, type: "open", kind: "theory",   // kind: "theory" | "code"
  section: "Workflow & methodology", marks: 5,
  prompt: "…", code: "optional snippet or model output",
  modelAnswer: "…",
  keyPoints: [{ text: "What earns the mark", keywords: ["words", "that", "pre-tick", "it"] }, /* … */],
}
```

Run `npm test` to validate the bank.

## Disclaimer

This is an unofficial study aid. The questions are written from the Module 1–6 readings, lab notebooks and class demos, following the format the professor described for the midterm. They are not the actual exam questions.

## License

[MIT](LICENSE)
