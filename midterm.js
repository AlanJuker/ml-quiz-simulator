// Midterm bank (MCAI/CSAI 500, Modules 2-6): three sections of 10 written questions.
// The exam draws 2 questions per section. Each key point is worth one mark, so keyPoints.length === marks.
// Schema: { id, module, type: "open", kind, section, marks, prompt, code?, modelAnswer, keyPoints: [{ text, keywords[] }] }
// Section 3 outputs are copied from the class demos (M3, M5, M6) or produced by running the Module 4 lab code.

const MIDTERM = [
  // ───────────────────────── Section 1: Workflow & methodology (5 marks) ─────────────────────────
  {
    id: "mt-w1", module: 2, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A hospital asks a team to predict which patients will be readmitted within 30 days. Only 6% of patients are readmitted. The team trains a model, reports 94% test accuracy and says it is ready to deploy. Later they find it predicts \"not readmitted\" for almost everyone. Identify the problems in their workflow and explain what they should have done, starting with the first step.",
    modelAnswer: "The first step they skipped is framing the problem: understand the hospital's goal (find patients at risk so they get follow-up care) and choose a performance measure that matches it before training anything. With only 6% positives, accuracy is misleading: a model that always predicts \"not readmitted\" already gets about 94%, so their result is no better than a baseline. They should compare against a baseline (majority class / DummyClassifier), use a stratified train/test split so both sets keep the 6% ratio, and evaluate with recall, precision, F1 and the confusion matrix, giving priority to recall because missing a patient who will be readmitted is the costly error. Then they can handle the imbalance (class_weight=\"balanced\", or a lower decision threshold chosen on validation data) before thinking about deployment.",
    keyPoints: [
      { text: "First step: frame the problem (business goal and success metric) before modelling", keywords: ["frame", "framing", "business", "objective", "goal", "first step", "define the problem"] },
      { text: "Accuracy is misleading because the classes are imbalanced (6% positives)", keywords: ["imbalanc", "misleading", "6%", "minority", "majority"] },
      { text: "Compare with a baseline: always predicting the majority class already gives ~94%", keywords: ["baseline", "dummy", "always predict", "majority class"] },
      { text: "Evaluate with recall / precision / F1 / confusion matrix, prioritising recall", keywords: ["recall", "f1", "confusion matrix", "precision"] },
      { text: "A concrete fix: stratified split, class_weight, threshold tuning or resampling", keywords: ["stratif", "class_weight", "balanced", "threshold", "resampl", "oversampl"] },
    ],
  },
  {
    id: "mt-w2", module: 2, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A student describes their workflow: (1) load the patient dataset; (2) fill missing values with the column mean and apply StandardScaler to the whole dataset; (3) split 80/20 into train and test; (4) try 40 hyperparameter combinations and keep the one with the best test score; (5) report that test score as the expected performance. Identify the problems and give the correct order of steps.",
    modelAnswer: "Steps 2 and 4 cause data leakage. The imputation means and scaling statistics were computed on the whole dataset, so information from the test set leaked into training. The split must come first, and preprocessing must be fitted on the training set only, ideally inside a Pipeline so the same steps are applied in every fold and to the test data. Step 4 uses the test set for tuning, so it is no longer unseen and the score reported in step 5 is optimistically biased. Correct order: split (stratified for classification) → build a pipeline (imputer + scaler + model) → tune hyperparameters with cross-validation (GridSearchCV) on the training set only → evaluate the final model once on the untouched test set and report that score.",
    keyPoints: [
      { text: "Preprocessing the whole dataset before the split leaks test information", keywords: ["leak", "before the split", "whole dataset", "entire dataset"] },
      { text: "Split first; fit the imputer and scaler on the training data only", keywords: ["split first", "training data only", "train only", "training set only", "fit only on", "only on the train"] },
      { text: "Use a Pipeline so preprocessing is applied the same way every time", keywords: ["pipeline"] },
      { text: "Tune with cross-validation or a validation set, never the test set", keywords: ["cross-val", "cross val", "gridsearch", "grid search", "validation set", "k-fold"] },
      { text: "The test set is used once at the end; the reported score is optimistic", keywords: ["optimistic", "biased", "once", "untouched", "overestimat"] },
    ],
  },
  {
    id: "mt-w3", module: 2, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A hospital director gives you a spreadsheet of 20,000 emergency-room visits and says: \"Use machine learning to reduce waiting times.\" A classmate immediately starts training a Random Forest on all the columns. What should the first step be, and what are the main stages of the ML workflow you would follow after it?",
    modelAnswer: "The first step is Problem Definition: talk to the stakeholders to understand the business problem and objective (what decision will the model support, e.g. predicting each patient's waiting time, or flagging patients likely to wait more than 2 hours), decide the task type (regression or classification) and choose a performance measure (MAE/RMSE, or recall for the long-wait class), plus constraints such as interpretability. Then I would follow the rest of the course workflow: (2) Data Collection: check the visits are representative and only use columns available at prediction time; (3) EDA: distributions, correlations, missing values, outliers; (4) Data Preparation: split train/test first, then clean, encode and scale inside a pipeline; (5) Feature Engineering: create and select useful features; (6) Model Training, starting with a simple baseline before models such as a Random Forest; (7) Model Evaluation with suitable metrics and cross-validation; (8) Hyperparameter Tuning with Grid or Randomized Search, then one final evaluation on the test set; (9) Deployment & Monitoring, iterating with feedback and new data.",
    keyPoints: [
      { text: "First step: Problem Definition with stakeholders (objective, how the prediction is used)", keywords: ["problem definition", "frame", "framing", "objective", "business", "stakeholder", "first step"] },
      { text: "Identify the task type and choose a performance measure", keywords: ["regression", "classification", "metric", "performance measure", "mae", "rmse"] },
      { text: "Collect, explore and prepare the data (EDA, cleaning, encoding, scaling, split)", keywords: ["collect", "eda", "explor", "clean", "missing", "encod", "scal"] },
      { text: "Feature engineering, a baseline, then training, evaluation and tuning with cross-validation", keywords: ["feature engineering", "baseline", "cross-val", "tun", "grid", "compare"] },
      { text: "Final test-set evaluation, then deploy and monitor", keywords: ["deploy", "monitor"] },
    ],
  },
  {
    id: "mt-w4", module: 6, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A hospital wants a model that flags patients at high risk of sepsis. Doctors must be able to explain to patients and auditors why each patient was flagged. Your team has two candidates: a Gradient Boosting model with 500 trees (test recall 0.91) and a decision tree with max_depth=4 (test recall 0.88). The team wants to deploy Gradient Boosting because it scores higher. What would you recommend and why?",
    modelAnswer: "Score is not the only requirement here: the hospital needs explanations, so interpretability is part of the problem definition. A depth-4 decision tree can be drawn, and every prediction can be traced from the root to a leaf as a short set of if-then rules that doctors can check and explain. Gradient Boosting adds up 500 trees trained one after another, so it behaves like a black box and is much harder to justify. The recall difference (0.91 vs 0.88) is small and may not be reliable with one test split, so I would check it with cross-validation. Unless boosting is clearly and consistently better, I would recommend the decision tree, possibly with a lower decision threshold to raise its recall, because it meets both the accuracy and the explanation requirements.",
    keyPoints: [
      { text: "Interpretability is a requirement from the problem framing (doctors must explain)", keywords: ["interpret", "explain", "transparen", "requirement"] },
      { text: "A shallow tree's prediction can be traced root → leaf as readable rules", keywords: ["rule", "root", "leaf", "path", "trace"] },
      { text: "Gradient Boosting with 500 trees is a black box / hard to explain", keywords: ["black box", "black-box", "500", "less interpretable", "hard to explain", "harder to explain"] },
      { text: "The recall gap is small; confirm it with cross-validation before deciding", keywords: ["small", "cross-val", "significan", "0.03", "3%"] },
      { text: "Clear recommendation with justification (e.g. the tree, lower threshold for recall)", keywords: ["recommend", "i would choose", "deploy the tree", "lower threshold", "lower the threshold"] },
    ],
  },
  {
    id: "mt-w5", module: 5, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A student trains DecisionTreeClassifier() with default settings on a patient dataset. Training accuracy is 100% and test accuracy is 78%. The student concludes: \"Perfect training accuracy means the tree learned the data perfectly, so it is the best model.\" Identify the problem in this reasoning and describe a correct way to improve and select the model.",
    modelAnswer: "The tree is overfitting. With default settings (max_depth=None) a tree keeps splitting until its leaves are pure, so it memorises the training data, including the noise. The 22-point gap between training (100%) and test (78%) accuracy shows poor generalisation, and performance on unseen data is what matters, not training accuracy. To fix it, regularise the tree: limit max_depth, increase min_samples_leaf or min_samples_split, or limit max_leaf_nodes. These values should be chosen with cross-validation on the training data (e.g. GridSearchCV), not with the test set, and the chosen tree evaluated once on the test set. Another option is an ensemble such as a Random Forest, which reduces the variance of a single tree.",
    keyPoints: [
      { text: "Diagnosis: overfitting (the tree memorised the training data and its noise)", keywords: ["overfit", "memori", "noise"] },
      { text: "Evidence: large train-test gap; generalisation to unseen data is what counts", keywords: ["gap", "unseen", "generali", "78%"] },
      { text: "Cause: default/unrestricted depth grows the tree until the leaves are pure", keywords: ["default", "max_depth=none", "unrestricted", "pure", "no limit", "fully grown"] },
      { text: "Fix: regularisation hyperparameters (max_depth, min_samples_leaf/split, max_leaf_nodes)", keywords: ["max_depth", "min_samples", "max_leaf", "prun", "regulari"] },
      { text: "Choose them with cross-validation (or use an ensemble); test set only at the end", keywords: ["cross-val", "gridsearch", "grid search", "random forest", "bagging", "ensemble"] },
    ],
  },
  {
    id: "mt-w6", module: 4, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A team models how a drug dose relates to recovery time, and the relationship is clearly curved. They fit polynomial regression models with degrees 1 to 15, choose degree 15 because it has the lowest training error, and report its test error. Explain what is wrong with this approach and how you would choose the degree.",
    modelAnswer: "Training error always goes down as the degree increases, because a more flexible model can follow the training points (and their noise) more closely. So the lowest training error points to the most overfit model, not the best one. Degree 1 underfits a curved relationship (high bias), while a very high degree such as 15 overfits (high variance): low training error but large errors on new patients. The degree is a hyperparameter, so it should be chosen by validation error, ideally k-fold cross-validation on the training data, picking the degree with the lowest validation error (often a low degree such as 2 or 3). Learning curves help diagnose overfitting, and Ridge or Lasso regularisation can control complexity. The test set is used only once, at the end.",
    keyPoints: [
      { text: "Training error always decreases with the degree, so it cannot select the model", keywords: ["always decrease", "always go", "always get", "lowest training error", "training error"] },
      { text: "Degree 15 overfits (high variance); degree 1 underfits (high bias)", keywords: ["overfit", "variance", "underfit", "bias"] },
      { text: "Choose the degree by validation / cross-validation error", keywords: ["validation", "cross-val", "k-fold"] },
      { text: "Learning curves or regularisation (Ridge/Lasso) as supporting tools", keywords: ["learning curve", "ridge", "lasso", "regulari"] },
      { text: "The test set is reserved for one final evaluation", keywords: ["final", "once", "unseen", "reserved"] },
    ],
  },
  {
    id: "mt-w7", module: 4, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A student implements Batch Gradient Descent for linear regression on hospital data with features such as age (20-90) and annual income (20,000-200,000). With learning_rate = 0.8 the cost increases after every iteration and becomes huge. With learning_rate = 0.0001 the cost decreases extremely slowly. Explain both problems and what the student should change.",
    modelAnswer: "With 0.8 the learning rate is too large: each update overshoots the minimum of the cost function (MSE), so the parameters jump from side to side and the cost diverges. With 0.0001 the steps are too small, so convergence is extremely slow and training may stop long before reaching the minimum. There is also a scaling problem: income is thousands of times larger than age, so the cost surface is stretched and no single learning rate suits both parameters. The student should standardise the features (StandardScaler fitted on the training data), then try a moderate learning rate (e.g. 0.01 to 0.1) and plot the cost per iteration to check that it falls smoothly. Monitoring validation error with early stopping, or using Stochastic/Mini-batch GD for large data, also helps.",
    keyPoints: [
      { text: "Learning rate too large: overshoots the minimum, cost diverges", keywords: ["overshoot", "diverg", "too large", "too big", "unstable"] },
      { text: "Learning rate too small: very slow convergence", keywords: ["slow", "too small"] },
      { text: "Features on very different scales make Gradient Descent struggle", keywords: ["scale", "scaling", "units"] },
      { text: "Fix: standardise the features (e.g. StandardScaler)", keywords: ["standardi", "standardscaler", "normali"] },
      { text: "Fix: pick a moderate learning rate and monitor the cost / validation curve", keywords: ["moderate", "0.01", "0.1", "plot", "monitor", "early stopping", "mini-batch"] },
    ],
  },
  {
    id: "mt-w8", module: 4, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A logistic regression model screens patients for a serious disease. At the default threshold of 0.5 it has precision 0.95 and recall 0.60. The hospital says that sending a healthy patient for an extra test is cheap, but missing a sick patient can be fatal. What decision would you make about this model, and how would you carry it out correctly?",
    modelAnswer: "Recall of 0.60 means the model misses 40% of sick patients (false negatives), which is the most costly error here, while false positives are cheap. So the model should be tuned for recall rather than precision. Logistic regression outputs probabilities (predict_proba), so I would lower the decision threshold (for example to 0.3) so that more patients are classified as positive: recall goes up and precision goes down (more false alarms), an acceptable trade-off in this case. I would choose the threshold with validation data or cross-validation and a precision-recall or ROC curve, aiming for a minimum recall agreed with the doctors, and confirm it once on the test set. class_weight=\"balanced\" or more positive examples could also help.",
    keyPoints: [
      { text: "Recall 0.60 = 40% of sick patients missed (false negatives), the costly error", keywords: ["40%", "false negative", "miss"] },
      { text: "Prioritise recall over precision because false positives are cheap", keywords: ["prioriti", "more important", "cheap", "false positive"] },
      { text: "Lower the decision threshold using the predicted probabilities", keywords: ["lower the threshold", "lower threshold", "lowering the threshold", "predict_proba", "probabilit"] },
      { text: "Trade-off: recall rises, precision falls (more false alarms)", keywords: ["trade-off", "tradeoff", "trade off", "precision decrease", "precision goes down", "precision will", "false alarm"] },
      { text: "Choose the threshold on validation/CV data (PR or ROC curve), then confirm on test", keywords: ["validation", "cross-val", "precision-recall curve", "pr curve", "roc"] },
    ],
  },
  {
    id: "mt-w9", module: 6, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A clinic has only 600 labelled patient records. When the team retrains a decision tree on slightly different samples of the data, the tree structure and its predictions change a lot. They also say they cannot afford to set aside a separate validation set. Which approach would you recommend and why?",
    modelAnswer: "A single decision tree has high variance: small changes in the training data change the splits and therefore the predictions. I would use a bagging ensemble, preferably a Random Forest. Each tree is trained on a bootstrap sample (drawn with replacement) and, in a Random Forest, only considers a random subset of features at each split, so the trees are diverse and their errors partly cancel out. Voting/averaging over many trees reduces variance and gives more stable, more accurate predictions. Because about 37% of the records are left out of each bootstrap sample, the out-of-bag (OOB) score (oob_score=True) estimates generalisation without a separate validation set. The trade-off is that a forest is less interpretable than one tree, although it still provides feature importances.",
    keyPoints: [
      { text: "A single tree has high variance (unstable to small data changes)", keywords: ["variance", "unstable", "sensitive"] },
      { text: "Recommend bagging / Random Forest", keywords: ["random forest", "bagging", "ensemble"] },
      { text: "Bootstrap samples and random feature subsets make diverse trees; voting reduces variance", keywords: ["bootstrap", "replacement", "random subset", "divers", "averag", "vot"] },
      { text: "OOB evaluation estimates performance without a validation set (~37% left out)", keywords: ["oob", "out-of-bag", "out of bag", "37"] },
      { text: "Trade-off: less interpretable than a single tree (or more computation)", keywords: ["interpretab", "black box", "computation", "slower"] },
    ],
  },
  {
    id: "mt-w10", module: 6, type: "open", kind: "theory", section: "Workflow & methodology", marks: 5,
    prompt: "A team compares five models for predicting hospital readmission. Each model is evaluated on its own random train/test split (no random_state), and they report the model with the highest test accuracy as the winner. Their Random Forest also shows that \"number of previous visits\" has the highest feature importance, so they write: \"More previous visits cause readmission.\" Identify the problems and how to fix them.",
    modelAnswer: "The comparison is unfair and not reproducible: each model is tested on different data, so a difference may come from a lucky or unlucky split rather than from the algorithm. All models should use the same split (fixed random_state, stratified) and preferably the same k-fold cross-validation folds, reporting the mean and standard deviation. Accuracy alone may also mislead if readmissions are rare, so recall and F1 should be reported too. Finally, feature importance only shows that the model used that feature to reduce impurity: it is association, not causation. Patients with many visits may simply be sicker (a confounder), and correlated features share importance. They can say the feature is a strong predictor, but a causal claim would need a controlled study.",
    keyPoints: [
      { text: "Different random splits make the comparison unfair (luck of the split)", keywords: ["different split", "unfair", "lucky", "same split", "same data"] },
      { text: "Fix: same split / random_state and cross-validation, for reproducibility", keywords: ["random_state", "reproduc", "cross-val", "k-fold", "same folds"] },
      { text: "Accuracy alone can mislead for rare readmissions; add recall / F1", keywords: ["recall", "f1", "imbalanc", "accuracy alone"] },
      { text: "Feature importance shows association, not causation", keywords: ["causation", "causal", "association", "correlation"] },
      { text: "Why: confounding (sicker patients) or correlated features; say \"strong predictor\" instead", keywords: ["confound", "correlated", "share", "sicker", "predictor"] },
    ],
  },

  // ───────────────────────── Section 2: Python code interpretation (5 marks) ─────────────────────────
  {
    id: "mt-c1", module: 2, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain the purpose of this code and the role of test_size, random_state and stratify. Why must X_test and y_test not be used while training or tuning the model?",
    code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`,
    modelAnswer: "train_test_split divides the data into a training set, used to fit the model, and a test set kept aside to estimate how the model performs on unseen data (generalisation). test_size=0.2 puts 20% of the rows in the test set and 80% in the training set. random_state=42 fixes the random shuffle, so the same split is produced every time the code runs: results are reproducible and model comparisons are fair. stratify=y keeps the same class proportions in both sets, which matters with imbalanced classes (e.g. few malignant cases). The test set must stay untouched until the final evaluation; using it to train or tune would leak information and give an optimistic, biased estimate.",
    keyPoints: [
      { text: "Purpose: hold out a test set to measure performance on unseen data", keywords: ["unseen", "generali", "held", "new data", "evaluat"] },
      { text: "test_size=0.2 → 20% test, 80% training", keywords: ["20%", "80%", "20 %", "0.2"] },
      { text: "random_state fixes the shuffle → reproducible split", keywords: ["reproduc", "same split", "same result", "every time", "seed"] },
      { text: "stratify=y keeps the class proportions in both sets", keywords: ["proportion", "ratio", "distribution", "imbalanc"] },
      { text: "Using the test set while training/tuning leaks information → optimistic score", keywords: ["leak", "optimistic", "biased", "overestimat", "cheat"] },
    ],
  },
  {
    id: "mt-c2", module: 2, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "What does this code do? Explain the role of the Pipeline, of cv=5 and of scoring=\"recall\", and why the scaler is inside the pipeline instead of being applied to all the data first.",
    code: `pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("lr", LogisticRegression(max_iter=5000))
])
scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring="recall")
print(scores.mean(), scores.std())`,
    modelAnswer: "The Pipeline chains the preprocessing and the model into one estimator: StandardScaler standardises each feature (mean 0, standard deviation 1), then logistic regression is trained on the scaled data; max_iter=5000 gives the solver enough iterations to converge. cross_val_score runs 5-fold cross-validation on the training data: the data are split into 5 folds, the pipeline is trained on 4 folds and evaluated on the remaining one, five times, and the mean and std summarise the performance and how stable it is. scoring=\"recall\" scores each fold with recall, the share of real positives the model finds, which is the right metric when missing a positive case is costly. Because the scaler is inside the pipeline, it is fitted only on the training folds in each round, so the validation fold never influences the scaling: no data leakage.",
    keyPoints: [
      { text: "The Pipeline chains scaling and the model into one estimator", keywords: ["chain", "sequence", "combin", "one object", "together", "steps"] },
      { text: "StandardScaler puts features on the same scale (mean 0, std 1)", keywords: ["standardi", "mean 0", "mean of 0", "zero mean", "same scale"] },
      { text: "cv=5: train on 4 folds, validate on 1, five times; report mean and std", keywords: ["fold", "five times", "5 times"] },
      { text: "scoring=\"recall\": share of real positives detected (missing positives is costly)", keywords: ["recall", "false negative", "real positives", "actual positives"] },
      { text: "Scaler inside the pipeline is fitted only on the training folds → no leakage", keywords: ["leak", "only on the training", "training fold", "each fold"] },
    ],
  },
  {
    id: "mt-c3", module: 5, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain what this code does, the role of max_depth and min_samples_leaf, and what best_params_ and best_score_ contain. Why is the search run on X_train only?",
    code: `param_grid = {
    "max_depth": [2, 3, 4, 5, None],
    "min_samples_leaf": [1, 5, 10],
}
search = GridSearchCV(DecisionTreeClassifier(random_state=42),
                      param_grid, cv=5, scoring="f1")
search.fit(X_train, y_train)
print(search.best_params_, search.best_score_)`,
    modelAnswer: "GridSearchCV tries every combination of the listed hyperparameter values (5 × 3 = 15 trees), evaluates each with 5-fold cross-validation using the F1 score, and then refits the best combination on the whole training set. max_depth limits how deep the tree can grow: None means no limit, which risks overfitting, while very small values may underfit. min_samples_leaf is the minimum number of training samples a leaf must contain; larger values give simpler, more stable trees. Both are regularisation hyperparameters. best_params_ holds the combination with the highest mean cross-validated F1, and best_score_ is that mean CV F1 (it is not a test score). The search uses only the training data so the test set stays unseen for a final, unbiased evaluation; random_state=42 makes the trees reproducible.",
    keyPoints: [
      { text: "Tries every hyperparameter combination, each scored with 5-fold CV on F1", keywords: ["every combination", "all combination", "each combination", "combinations", "exhaustive"] },
      { text: "max_depth limits the depth of the tree (None = no limit → overfitting)", keywords: ["depth", "deep"] },
      { text: "min_samples_leaf = minimum samples per leaf → simpler, regularised tree", keywords: ["minimum", "regulari", "simpler", "per leaf"] },
      { text: "best_params_ = best combination; best_score_ = its mean CV F1", keywords: ["best combination", "best_params", "best_score", "mean"] },
      { text: "Only training data is used so the test set stays unseen (no leakage)", keywords: ["unseen", "leak", "untouched", "final evaluation"] },
    ],
  },
  {
    id: "mt-c4", module: 4, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain what this loop does. What is the role of PolynomialFeatures and of the degree parameter, why is LinearRegression still used, and what would you expect for degrees 1, 2 and 10 if the true relationship is quadratic?",
    code: `for degree in [1, 2, 10]:
    model = Pipeline([
        ("poly", PolynomialFeatures(degree=degree, include_bias=False)),
        ("lin", LinearRegression())
    ])
    model.fit(X_train, y_train)`,
    modelAnswer: "The loop trains three polynomial regression models of increasing complexity. PolynomialFeatures creates new features from the input (x, x², ..., up to x^degree); include_bias=False skips the column of 1s because LinearRegression already fits an intercept. LinearRegression is still used because the model is linear in its parameters: it learns one coefficient for each polynomial feature, and together they draw a curve. The degree controls the model's flexibility. Degree 1 is a straight line and underfits a quadratic relationship (high bias, high errors); degree 2 matches the true shape and should generalise best; degree 10 is very flexible and overfits, with a low training error but a higher validation/test error (high variance). The best degree should be chosen by validation error, not training error.",
    keyPoints: [
      { text: "PolynomialFeatures adds powers of the input (x², ...) so a curve can be fitted", keywords: ["power", "x²", "x^2", "squared", "new features", "curve", "nonlinear", "non-linear"] },
      { text: "Still linear in the parameters, so LinearRegression learns the coefficients", keywords: ["linear in", "coefficient", "parameters", "intercept"] },
      { text: "The degree controls model complexity / flexibility", keywords: ["complex", "flexib"] },
      { text: "Degree 1 underfits, degree 2 fits best, degree 10 overfits", keywords: ["underfit", "overfit"] },
      { text: "Choose the degree with validation (not training) error", keywords: ["validation", "cross-val", "test error", "not training"] },
    ],
  },
  {
    id: "mt-c5", module: 4, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain the purpose of fitting these three models and printing coef_. What is the role of alpha, and how do you expect the Ridge and Lasso coefficients to differ from the Linear Regression ones?",
    code: `lin_reg = LinearRegression().fit(X, y)
ridge_reg = Ridge(alpha=10).fit(X, y)
lasso_reg = Lasso(alpha=0.1).fit(X, y)
print(lin_reg.coef_)
print(ridge_reg.coef_)
print(lasso_reg.coef_)`,
    modelAnswer: "The code compares ordinary linear regression with two regularised versions; coef_ holds the learned weight of each feature. Regularisation adds a penalty on the size of the coefficients to the cost function, which reduces overfitting. alpha is the strength of that penalty: alpha = 0 gives plain linear regression, and larger values shrink the coefficients more (a simpler model with more bias and less variance). Ridge uses an L2 penalty: all coefficients shrink toward zero but none becomes exactly zero, so every feature is kept. Lasso uses an L1 penalty: it can set some coefficients exactly to zero, removing the less important features, so it performs automatic feature selection. Features should be scaled first so the penalty treats them fairly.",
    keyPoints: [
      { text: "coef_ = the learned weight per feature; the code compares plain vs regularised models", keywords: ["coef", "weight", "compar"] },
      { text: "Regularisation adds a penalty to the cost function to reduce overfitting", keywords: ["penalty", "overfit", "regulari"] },
      { text: "alpha = strength of the penalty; larger alpha → more shrinkage", keywords: ["strength", "larger alpha", "higher alpha", "bigger alpha", "more shrink", "stronger"] },
      { text: "Ridge (L2) shrinks every coefficient but keeps all features", keywords: ["l2", "shrink", "keeps all", "keep all", "not exactly zero"] },
      { text: "Lasso (L1) sets some coefficients exactly to zero → feature selection", keywords: ["l1", "exactly zero", "feature selection", "to zero"] },
    ],
  },
  {
    id: "mt-c6", module: 4, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "This loop comes from the Module 4 Gradient Descent demo (X_b is X with a column of 1s added, m is the number of rows). Explain what theta is, what each line inside the loop does, and the role of learning_rate and n_iterations.",
    code: `theta = np.random.randn(2, 1)
for iteration in range(n_iterations):
    gradients = (2 / m) * X_b.T.dot(X_b.dot(theta) - y)
    theta = theta - learning_rate * gradients`,
    modelAnswer: "theta holds the model parameters (the intercept and the slope), initialised randomly. Inside the loop, X_b.dot(theta) computes the predictions, (predictions − y) are the errors, and the first line uses them to compute the gradient of the MSE cost with respect to theta, using all m training examples (Batch Gradient Descent). The gradient points in the direction where the cost increases fastest, so the second line moves theta a small step in the opposite direction, which reduces the cost. learning_rate is the size of that step: too small means slow convergence, too large means overshooting the minimum and diverging. n_iterations is the number of updates; after that many steps theta should be close to the values that minimise the MSE.",
    keyPoints: [
      { text: "theta = the parameters (intercept and slope), randomly initialised", keywords: ["parameter", "intercept", "slope", "coefficient", "weight"] },
      { text: "Line 1 computes the gradient of the MSE cost from the prediction errors", keywords: ["gradient", "mse", "cost", "error"] },
      { text: "Line 2 moves theta in the opposite direction of the gradient (reduces the cost)", keywords: ["opposite", "subtract", "minus", "downhill", "reduce the cost", "minimi"] },
      { text: "learning_rate = step size (too small: slow; too large: overshoot)", keywords: ["step", "too small", "too large", "overshoot"] },
      { text: "n_iterations = number of updates; every update uses all m rows (Batch GD)", keywords: ["number of", "how many", "batch", "all the training", "all m", "all rows"] },
    ],
  },
  {
    id: "mt-c7", module: 4, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain the purpose of this code. What do max_iter=1 and warm_start=True do, why is the validation RMSE recorded after every epoch, and what is best_epoch used for?",
    code: `sgd_reg = SGDRegressor(max_iter=1, tol=None, warm_start=True, random_state=42)
for epoch in range(100):
    sgd_reg.fit(X_train_scaled, y_train)
    val_pred = sgd_reg.predict(X_val_scaled)
    val_rmse.append(np.sqrt(mean_squared_error(y_val, val_pred)))
best_epoch = np.argmin(val_rmse)`,
    modelAnswer: "This implements early stopping. SGDRegressor trains a linear regression with Stochastic Gradient Descent. max_iter=1 makes each call to fit() run a single epoch (one pass over the training data), tol=None stops it from ending on its own, and warm_start=True makes each fit() continue from the previous weights instead of starting again, so the loop trains for 100 epochs one at a time. After each epoch the model is evaluated on the validation set, not the training set, to measure generalisation. Validation RMSE usually falls and then starts to rise when the model begins to overfit, even though training error keeps falling. np.argmin finds the epoch with the lowest validation RMSE; stopping at (or keeping the model from) that epoch gives the best generalisation. The features are scaled because SGD is sensitive to feature scale.",
    keyPoints: [
      { text: "Purpose: early stopping, a form of regularisation", keywords: ["early stopping", "early-stopping", "stop training"] },
      { text: "max_iter=1 → one epoch per fit(); warm_start=True → continue from the previous weights", keywords: ["one epoch", "single epoch", "one pass", "continue", "previous", "warm"] },
      { text: "Validation RMSE each epoch tracks performance on unseen data", keywords: ["validation", "unseen", "generali"] },
      { text: "Validation error starts rising when overfitting begins", keywords: ["overfit", "start to rise", "starts to rise", "increase"] },
      { text: "best_epoch = the epoch with the lowest validation RMSE (where to stop)", keywords: ["lowest", "minimum", "argmin", "best epoch"] },
    ],
  },
  {
    id: "mt-c8", module: 4, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain what predict_proba(X_test)[:, 1] returns and the purpose of the line y_pred = (y_prob >= 0.3).astype(int). How is this different from calling log_reg.predict(X_test), and what effect do you expect on recall and precision?",
    code: `log_reg = LogisticRegression(max_iter=5000, random_state=42)
log_reg.fit(X_train, y_train)
y_prob = log_reg.predict_proba(X_test)[:, 1]
y_pred = (y_prob >= 0.3).astype(int)
print(recall_score(y_test, y_pred), precision_score(y_test, y_pred))`,
    modelAnswer: "predict_proba returns, for each test observation, the probability of each class (produced by the sigmoid function); [:, 1] keeps the column for the positive class (class 1). The next line applies a custom decision threshold: an observation is predicted positive if its probability is at least 0.3, and astype(int) turns True/False into 1/0. predict() would use the default threshold of 0.5. Lowering the threshold to 0.3 labels more observations as positive, so the model finds more of the real positives and recall increases, but it also produces more false positives, so precision usually decreases. This is useful when missing a positive (e.g. a disease) is worse than a false alarm, and the threshold should be chosen on validation data.",
    keyPoints: [
      { text: "predict_proba gives class probabilities; [:, 1] = probability of the positive class", keywords: ["probabilit", "positive class", "class 1"] },
      { text: "The line applies a custom threshold of 0.3 (1 if probability ≥ 0.3)", keywords: ["threshold", "0.3", "cut-off", "cutoff"] },
      { text: "predict() uses the default threshold of 0.5", keywords: ["0.5", "default"] },
      { text: "Lower threshold → more positive predictions → recall increases", keywords: ["recall increase", "higher recall", "recall goes up", "increase recall", "increases recall", "more positive"] },
      { text: "Precision usually drops (more false positives) — a trade-off", keywords: ["precision decrease", "lower precision", "precision drops", "precision goes down", "false positive", "false alarm", "trade-off"] },
    ],
  },
  {
    id: "mt-c9", module: 6, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Explain the role of n_estimators, max_features=\"sqrt\", oob_score=True and n_jobs=-1, and what oob_score_ and feature_importances_ contain.",
    code: `forest = RandomForestClassifier(n_estimators=200, max_features="sqrt",
                                oob_score=True, random_state=42, n_jobs=-1)
forest.fit(X_train, y_train)
print(forest.oob_score_)
importance = pd.Series(forest.feature_importances_, index=X.columns)`,
    modelAnswer: "RandomForestClassifier builds an ensemble of decision trees, each trained on a bootstrap sample of the training data, and predicts by combining the trees. n_estimators=200 is the number of trees: more trees give more stable predictions at a higher computing cost. max_features=\"sqrt\" means each split only considers a random subset of √(number of features) features, which makes the trees different from each other (less correlated) and reduces variance. oob_score=True evaluates each tree on its out-of-bag samples (about 37% of the rows left out of its bootstrap sample); oob_score_ is the resulting accuracy, an estimate of generalisation without a separate validation set. n_jobs=-1 trains the trees in parallel on all CPU cores, possible because the trees are independent. feature_importances_ gives each feature's share of the total impurity reduction across the trees: what the model relies on, not causation.",
    keyPoints: [
      { text: "n_estimators = number of trees in the forest", keywords: ["number of trees", "200 trees", "how many trees"] },
      { text: "max_features=\"sqrt\": random subset of features per split → diverse, less correlated trees", keywords: ["random subset", "square root", "divers", "correlat"] },
      { text: "oob_score_: accuracy on out-of-bag samples, a built-in validation estimate", keywords: ["out-of-bag", "out of bag", "oob", "37"] },
      { text: "n_jobs=-1: trains the trees in parallel on all cores", keywords: ["parallel", "all cores", "all cpu", "all processors"] },
      { text: "feature_importances_: each feature's share of impurity reduction", keywords: ["impurity", "contribut", "relies"] },
    ],
  },
  {
    id: "mt-c10", module: 6, type: "open", kind: "code", section: "Python code interpretation", marks: 5,
    prompt: "Both models are boosting ensembles. Explain what DecisionTreeClassifier(max_depth=1) is and why it is used, the role of n_estimators and learning_rate, and how AdaBoost and Gradient Boosting differ in what each new tree learns.",
    code: `ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    n_estimators=100, learning_rate=0.5, random_state=42)
gb = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.05, max_depth=2, random_state=42)
ada.fit(X_train, y_train)
gb.fit(X_train, y_train)`,
    modelAnswer: "Boosting trains learners sequentially, each one correcting the errors of the ensemble built so far, which mainly reduces bias. DecisionTreeClassifier(max_depth=1) is a decision stump, a tree with a single split. It is a weak learner (only a little better than guessing), and boosting combines many weak learners into a strong one. n_estimators=100 is the number of learners added one after another. learning_rate scales how much each new learner contributes: smaller values make cautious steps and usually need more estimators but generalise better, while too many learners with a high rate can overfit. AdaBoost increases the weights of the misclassified training samples so the next stump focuses on them, and gives more accurate learners a bigger vote. Gradient Boosting instead fits each new tree to the residual errors (negative gradients of the loss) of the current ensemble. Because training is sequential, boosting cannot be fully parallelised, unlike bagging.",
    keyPoints: [
      { text: "max_depth=1 is a decision stump, a weak learner", keywords: ["stump", "weak learner", "one split", "single split"] },
      { text: "Boosting trains learners sequentially, each correcting the previous errors", keywords: ["sequential", "one after another", "correct", "previous"] },
      { text: "n_estimators = number of learners; learning_rate = contribution of each one", keywords: ["learning rate", "learning_rate", "contribution", "shrink"] },
      { text: "AdaBoost increases the weights of misclassified samples", keywords: ["weight", "misclassified"] },
      { text: "Gradient Boosting fits each new tree to the residuals (negative gradients)", keywords: ["residual", "negative gradient"] },
    ],
  },

  // ───────────────────────── Section 3: Model output interpretation & method selection (5 marks) ─────────────────────────
  {
    id: "mt-o1", module: 4, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "A logistic regression model for breast-tumour diagnosis produced this output. Which class does the model predict better, and why might it perform differently on the two classes? Is it acceptable for medical screening, and if not, what would you change? Justify with the numbers.",
    code: `Logistic Regression, test set (positive class = malignant)

              precision    recall  f1-score   support

      benign       0.96      0.99      0.97        72
   malignant       0.97      0.93      0.95        42

    accuracy                           0.96       114
   macro avg       0.97      0.96      0.96       114
weighted avg       0.97      0.96      0.96       114

Confusion matrix (rows = actual, columns = predicted)
                  benign  malignant
actual benign         71          1
actual malignant       3         39`,
    modelAnswer: "Accuracy is 0.96 (110 of 114 correct). The model is better on the benign class: recall 0.99 (71 of 72 benign tumours found, 1 false positive) and F1 0.97, against recall 0.93 (39 of 42 found, 3 false negatives) and F1 0.95 for malignant. One reason is class imbalance: there are more benign examples (72 vs 42 here, 357 vs 212 in the full dataset), so the model sees more benign patterns, and the default 0.5 threshold favours the majority class. Malignant tumours that look like benign ones (borderline probabilities) are also harder to separate. For screening, the 3 missed cancers are the most serious error, so although malignant precision is high (0.97), it is not ready as it is. I would raise malignant recall before using it, for example by lowering the decision threshold (chosen on validation data) or training with class_weight='balanced'.",
    keyPoints: [
      { text: "Benign is predicted better (recall 0.99, F1 0.97 vs 0.93 and 0.95); accuracy 0.96", keywords: ["benign", "0.99", "better"] },
      { text: "Reads the confusion matrix: 3 malignant cases missed (false negatives), 1 false positive", keywords: ["three", "3 false", "3 malignant", "false negative", "missed"] },
      { text: "Explains the difference: class imbalance, default threshold or borderline cases", keywords: ["imbalanc", "more benign", "majority", "fewer malignant", "borderline", "threshold"] },
      { text: "Screening judgement: the 3 missed cancers are the most costly error, so it is not ready as it is", keywords: ["screening", "costly", "dangerous", "serious", "not ready", "not acceptable"] },
      { text: "Method to fix it: lower the threshold (chosen on validation data) or class_weight='balanced' to raise malignant recall", keywords: ["lower the threshold", "lower threshold", "lowering the", "class_weight", "balanced"] },
    ],
  },
  {
    id: "mt-o2", module: 3, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Logistic Regression and Random Forest have the same accuracy on this test set. Which model would you select to detect malignant tumours, and why? Why do the three models perform differently on the same data?",
    code: `Test-set results (positive class = malignant)

                     Accuracy  Precision  Recall     F1  ROC AUC
Logistic Regression     0.965      0.975   0.929  0.951    0.996
Random Forest           0.965      1.000   0.905  0.950    0.995
KNN                     0.956      0.974   0.905  0.938    0.982`,
    modelAnswer: "The same accuracy hides different types of errors. Random Forest has perfect precision (1.000, no false alarms) but the lowest recall (0.905), so it misses more malignant tumours. Logistic Regression has the highest recall (0.929), F1 (0.951) and ROC AUC (0.996). In cancer screening a false negative is the most dangerous error, so I would select Logistic Regression, and confirm the choice with cross-validation because one split of 114 rows can be lucky. The models differ because they learn in different ways: logistic regression learns a linear decision boundary and outputs probabilities, Random Forest combines many trees with axis-aligned splits, and KNN classifies by the nearest neighbours (so it depends on scaling and k). Different assumptions and hyperparameters lead to different mistakes.",
    keyPoints: [
      { text: "Same accuracy hides different error types; look at precision, recall and F1", keywords: ["hide", "same accuracy", "not enough", "error type", "different error", "types of error"] },
      { text: "Selects Logistic Regression for its higher recall/F1 (fewer missed cancers)", keywords: ["0.929", "higher recall", "highest recall", "choose logistic", "select logistic"] },
      { text: "Notes Random Forest's perfect precision but lower recall (more false negatives)", keywords: ["1.000", "perfect precision", "no false positive", "lower recall", "0.905"] },
      { text: "Explains why models differ: linear boundary vs trees vs neighbours", keywords: ["linear", "neighbo", "different algorithm", "learn differently", "boundary", "assumption"] },
      { text: "Confirms the choice with cross-validation: one split of 114 rows can be lucky", keywords: ["cross-val", "lucky", "one split", "114"] },
    ],
  },
  {
    id: "mt-o3", module: 4, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "This table shows the same logistic regression model evaluated with three decision thresholds. Explain what happens to precision and recall as the threshold changes, and which threshold you would choose for cancer screening.",
    code: `Logistic Regression, malignant = positive class

   Threshold  Precision  Recall     F1
0        0.3      0.976   0.976  0.976
1        0.5      0.975   0.929  0.951
2        0.7      1.000   0.905  0.950`,
    modelAnswer: "The threshold is the probability above which a tumour is classified as malignant. Raising it to 0.7 makes the model stricter: it only predicts malignant when it is very confident, so precision rises to 1.000 (no false alarms) but recall falls to 0.905 (more cancers missed). Lowering it to 0.3 flags more tumours as malignant, so recall rises to 0.976 while precision stays almost the same (0.976), giving the best F1. This is the precision-recall trade-off. For screening, missing a cancer is far worse than an extra test, so I would choose 0.3: it gives the highest recall without losing precision here. The threshold should be confirmed with validation data or cross-validation, because tuning it on the test set makes the result optimistic.",
    keyPoints: [
      { text: "The threshold is the probability cut-off for predicting malignant", keywords: ["cut-off", "cutoff", "probability above", "probability"] },
      { text: "Higher threshold (0.7): precision up to 1.000, recall down to 0.905", keywords: ["0.7", "stricter", "precision increases", "higher precision", "1.000"] },
      { text: "Lower threshold (0.3): recall up to 0.976 — the precision-recall trade-off", keywords: ["trade-off", "trade off", "tradeoff", "0.976", "recall increases", "higher recall"] },
      { text: "Chooses 0.3 for screening because false negatives are the worst error", keywords: ["0.3", "screening", "false negative", "miss"] },
      { text: "The threshold must be chosen on validation data or CV, not the test set (otherwise optimistic)", keywords: ["validation", "cross-val", "optimistic"] },
    ],
  },
  {
    id: "mt-o4", module: 5, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Interpret this output. Why is the test accuracy lower than the cross-validation accuracy, which number should be reported as the expected performance, and what do the tied combinations tell you about model selection?",
    code: `Decision tree tuned with GridSearchCV (cv=5, scoring="accuracy") on Iris

Best parameters: {'criterion': 'gini', 'max_depth': 3, 'min_samples_leaf': 1}
Best cross-validation accuracy: 0.938
Test accuracy of selected model: 0.895
Actual depth of selected tree: 3
Number of leaves: 5

Top of cv_results_ (many combinations tie for rank 1):
criterion  max_depth  min_samples_leaf  mean_cv_accuracy  rank
  entropy          4                 5             0.938     1
     gini          5                 5             0.938     1
     gini          3                 1             0.938     1
     gini       None                 2             0.938     1`,
    modelAnswer: "GridSearchCV chose a Gini tree with max_depth=3 (5 leaves) because it had the best mean 5-fold CV accuracy, 0.938. The test accuracy, 0.895, is lower because the best CV score is slightly optimistic (it is the maximum over many combinations, selected on those same folds) and because the test set is small (about 38 flowers, so one error moves accuracy by about 2.6 points). The test accuracy is the number to report, since the test set was not used during tuning and gives the unbiased estimate. Many combinations tie at 0.938, so the data cannot tell them apart; in that case it is sensible to prefer the simplest model (shallow tree, few leaves), which is easier to interpret and less likely to overfit.",
    keyPoints: [
      { text: "Identifies the selected tree (gini, depth 3, 5 leaves) and the CV vs test numbers", keywords: ["0.938", "0.895", "depth 3", "max_depth=3", "5 leaves"] },
      { text: "Explains the gap: the best CV score is optimistic and/or the test set is small", keywords: ["optimistic", "small test", "few samples", "maximum", "38", "small"] },
      { text: "The test accuracy is the unbiased number to report", keywords: ["report", "unbiased", "unseen"] },
      { text: "Ties: the data cannot tell these combinations apart", keywords: ["tie", "cannot tell", "can't tell", "same score", "noise"] },
      { text: "Selection rule: prefer the simplest of the tied models (shallow tree, few leaves)", keywords: ["simpl", "fewer leaves", "few leaves", "shallow"] },
    ],
  },
  {
    id: "mt-o5", module: 5, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Which max_depth would you choose and why? Identify where the model underfits and where it overfits, using the numbers, and say how you would confirm your choice.",
    code: `Decision trees on the moons dataset (noise=0.25)

max_depth            train_accuracy  test_accuracy  leaves
1                             0.843          0.807       2
2                             0.911          0.893       4
4                             0.911          0.893       8
5                             0.974          0.947      10
None (unrestricted)           1.000          0.947      22`,
    modelAnswer: "Depth 1 underfits: with only 2 leaves, both training (0.843) and test (0.807) accuracy are the lowest, because one split cannot follow the curved classes. Depths 2 and 4 improve the test accuracy to 0.893, and depth 4 doubles the leaves without any gain. The unrestricted tree reaches 1.000 training accuracy with 22 leaves, a sign that it memorises the training data (overfitting), and its test accuracy is no better than depth 5 (0.947). I would choose max_depth=5: it ties for the best test accuracy (0.947), has a smaller train-test gap and less than half the leaves of the unrestricted tree (10 vs 22), so it is simpler, easier to interpret and more likely to generalise. Ideally the choice should be confirmed with cross-validation rather than one test split.",
    keyPoints: [
      { text: "Depth 1 underfits (both accuracies lowest, only 2 leaves)", keywords: ["underfit", "depth 1", "too simple", "0.807"] },
      { text: "The unrestricted tree overfits (1.000 training accuracy, 22 leaves)", keywords: ["overfit", "memori", "22 leaves", "unrestricted"] },
      { text: "Chooses depth 5: best test accuracy with fewer leaves", keywords: ["depth 5", "max_depth=5", "max_depth 5", "10 leaves"] },
      { text: "Justifies with simplicity / generalisation (smaller gap, 10 vs 22 leaves)", keywords: ["simpl", "generali", "fewer leaves", "gap", "interpret"] },
      { text: "Confirms the choice with cross-validation rather than one test split", keywords: ["cross-val", "one split", "one test split"] },
    ],
  },
  {
    id: "mt-o6", module: 6, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Interpret these results. Why do the ensembles outperform the single tree, what do the OOB scores tell you, and why is the OOB score NaN for two models? Which model would you select?",
    code: `Breast cancer test set (143 patients)

Model           Test accuracy   OOB accuracy
Extra Trees             0.965            NaN
Random Forest           0.958          0.962
Bagging                 0.951          0.955
Single tree             0.944            NaN`,
    modelAnswer: "All three ensembles beat the single depth-4 tree (0.944): Extra Trees is best (0.965), then Random Forest (0.958) and Bagging (0.951). A single tree has high variance; an ensemble trains many diverse trees and combines their votes, so individual errors partly cancel out and variance falls. Random Forest adds random feature subsets to bagging, and Extra Trees also uses random thresholds, so their trees are even more diverse, which matches the ranking. The OOB accuracies (0.962 and 0.955) are very close to the test accuracies, so the out-of-bag estimate, computed only from training rows left out of each bootstrap sample, is a reliable estimate of generalisation. OOB is NaN for the single tree (no bootstrap samples) and for Extra Trees, which by default trains every tree on the whole training set without bootstrapping, so there are no out-of-bag rows. I would select Extra Trees (best test accuracy) or Random Forest (almost as good, with an OOB estimate that agrees), but the differences are small (1 to 3 errors out of 143), so I would confirm the ranking with cross-validation.",
    keyPoints: [
      { text: "The ensembles beat the single tree; Extra Trees is best", keywords: ["extra trees", "0.965", "outperform", "better than the single"] },
      { text: "Reason: many diverse trees vote, so variance falls", keywords: ["variance", "divers", "average", "vot", "cancel"] },
      { text: "OOB close to test accuracy → reliable estimate without a validation set", keywords: ["close", "similar", "reliable", "out-of-bag", "out of bag"] },
      { text: "NaN: the single tree and Extra Trees (default) use no bootstrap → no OOB rows", keywords: ["nan", "no bootstrap", "without bootstrap", "bootstrap=false", "whole training", "whole dataset", "entire"] },
      { text: "Selects a model, noting the differences are small (1–3 errors of 143) → confirm with CV", keywords: ["select", "choose", "recommend", "small"] },
    ],
  },
  {
    id: "mt-o7", module: 6, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "A hospital asks you to pick one of these models. Which would you recommend, and why might a simple Logistic Regression beat the ensemble methods on this dataset?",
    code: `Breast cancer test set (143 patients)

Model                 Accuracy   Errors
Logistic Regression      0.986        2
Hard Voting              0.986        2
SVM                      0.979        3
Soft Voting              0.972        4
Stacking                 0.972        4
Extra Trees              0.965        5
AdaBoost                 0.965        5
Random Forest            0.958        6
Bagging                  0.951        7
Decision Tree            0.944        8
Gradient Boosting        0.944        8`,
    modelAnswer: "Logistic Regression and Hard Voting tie for the best accuracy (0.986, only 2 errors). I would recommend Logistic Regression: it is as accurate as the voting ensemble but simpler, faster and easier to interpret (each coefficient shows a feature's effect, and its probabilities let the hospital tune the threshold for recall). Ensembles do not always win: in this dataset the two classes are almost linearly separable once the features are scaled, so a linear model already captures the pattern, and the extra flexibility of tree ensembles adds variance without benefit. The differences are also tiny, 2 vs 6 errors on 143 patients, so they could change with another split; I would confirm with cross-validation and check malignant recall, not only accuracy, before deciding.",
    keyPoints: [
      { text: "Recommends Logistic Regression (ties for best: 0.986, 2 errors)", keywords: ["logistic", "0.986", "2 errors"] },
      { text: "Justification: simpler, faster, more interpretable than an ensemble", keywords: ["simpl", "interpret", "faster", "explain"] },
      { text: "Why it can win: data nearly linearly separable; ensembles add complexity without gain", keywords: ["linear", "separable", "not always", "complex"] },
      { text: "Differences are small (2 vs 6 errors) → could change with another split; confirm with CV", keywords: ["small", "cross-val", "few errors", "one split", "another split"] },
      { text: "Checks malignant recall (missed cancers), not only accuracy, before deciding", keywords: ["recall", "false negative", "not only accuracy"] },
    ],
  },
  {
    id: "mt-o8", module: 4, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "These coefficients come from the Module 4 lab (Linear, Ridge and Lasso Regression on California Housing, features not scaled). What did Ridge and Lasso do, which model performed feature selection, and why should you be careful before concluding that Population is unimportant? Which model would you choose for a simpler model, and how would you set alpha?",
    code: `   Feature  Linear  Ridge(alpha=10)  Lasso(alpha=0.1)
    MedInc  0.4367           0.4357            0.3906
  HouseAge  0.0094           0.0095            0.0151
  AveRooms -0.1073          -0.1055           -0.0000
 AveBedrms  0.6451           0.6352            0.0000
Population -0.0000          -0.0000            0.0000
  AveOccup -0.0038          -0.0038           -0.0033
  Latitude -0.4213          -0.4212           -0.1142
 Longitude -0.4345          -0.4342           -0.0992`,
    modelAnswer: "Ridge (L2) shrank the coefficients only slightly (e.g. AveBedrms 0.6451 → 0.6352) and kept every feature; alpha=10 is a weak penalty for about 20,000 rows. Lasso (L1) shrank more strongly and set AveRooms and AveBedrms exactly to 0, so it performed feature selection and produced a simpler model; it also shrank Latitude and Longitude a lot. MedInc stays the largest positive coefficient in all three models, so median income is the strongest positive predictor of house value. Population is about 0 in every model, but the features are not scaled: Population is counted in hundreds or thousands of people, so a tiny coefficient per person can still add up. Coefficients can only be compared fairly after standardising the features, which is also needed for the penalty to treat all features equally. For a simpler model with fewer features I would choose Lasso, and tune alpha with cross-validation (comparing validation RMSE) on the scaled features.",
    keyPoints: [
      { text: "Ridge shrinks the coefficients slightly and keeps all features", keywords: ["slight", "keeps", "keep all", "all features", "l2"] },
      { text: "Lasso sets AveRooms and AveBedrms to zero → feature selection", keywords: ["zero", "feature selection", "l1"] },
      { text: "Reads a key coefficient (MedInc strongest positive; lat/long shrunk by Lasso)", keywords: ["medinc", "income", "latitude", "longitude"] },
      { text: "Unscaled features: a small coefficient ≠ unimportant; standardise before comparing", keywords: ["scale", "standardi", "units", "unscaled"] },
      { text: "Selects Lasso for a simpler model and tunes alpha with cross-validation", keywords: ["choose lasso", "select lasso", "prefer lasso", "tune alpha", "alpha with cross", "cross-val"] },
    ],
  },
  {
    id: "mt-o9", module: 6, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Interpret this feature-importance output from a Random Forest trained to classify breast tumours. What does it tell the doctors, how could you use it to simplify the model, and what are two limitations of drawing conclusions from it?",
    code: `Random Forest feature importances (top 10)

worst perimeter         0.1457
worst area              0.1368
worst concave points    0.1072
mean concave points     0.1039
worst radius            0.0761
mean perimeter          0.0611
mean radius             0.0552
mean concavity          0.0485
mean area               0.0406
worst concavity         0.0294`,
    modelAnswer: "Importance is each feature's share of the total impurity reduction across all trees, so higher values mean the forest relied more on that feature to separate malignant from benign tumours. The top features describe tumour size (worst perimeter 0.146, worst area 0.137, radius) and shape irregularity (concave points); the top four alone account for about half of the importance, so large, irregular tumours drive the predictions. It is also useful for feature selection: the team could train a simpler model on the top features only and keep it if its cross-validated score is as good. Limitation 1: importance shows association, not causation; it says what the model uses, not what causes cancer. Limitation 2: correlated features share importance: perimeter, area and radius all measure size, so the credit is split between them and each one can look less important than size really is. The scores also describe this particular model and dataset.",
    keyPoints: [
      { text: "Meaning: each feature's share of impurity reduction (how much the model relies on it)", keywords: ["impurity", "relies", "contribut", "rely"] },
      { text: "Top features: tumour size (perimeter, area, radius) and concave points", keywords: ["perimeter", "size", "concave"] },
      { text: "Use: feature selection, a simpler model on the top features, compared with CV", keywords: ["feature selection", "simpler model", "top features", "fewer features"] },
      { text: "Limitation: association, not causation", keywords: ["causation", "causal", "association", "cause"] },
      { text: "Limitation: correlated features share or split the importance", keywords: ["correlat", "share", "split", "redundan"] },
    ],
  },
  {
    id: "mt-o10", module: 4, type: "open", kind: "theory", section: "Model output interpretation & method selection", marks: 5,
    prompt: "Polynomial regression was fitted to 40 noisy points from a quadratic curve and evaluated with 5-fold cross-validation. Interpret the results: which degree would you choose, and how do degrees 1 and 10 behave in terms of bias and variance?",
    code: `5-fold cross-validation (RMSE, lower is better)

degree  train_RMSE  validation_RMSE
     1       1.719            1.839
     2       0.744            0.772
    10       0.656            1.148`,
    modelAnswer: "Degree 2 should be chosen: it has the lowest validation RMSE (0.772) and a very small gap to its training RMSE (0.744), so it generalises well; it matches the true quadratic shape. Degree 1 underfits: a straight line cannot follow the curve, so both training (1.719) and validation (1.839) errors are high (high bias, low variance). Degree 10 overfits: it has the lowest training error (0.656) because it bends to fit the noise, but its validation error rises to 1.148, a large gap (low bias, high variance). This is the bias-variance trade-off: as the degree grows, bias falls and variance rises, and degree 2 balances the two. So a lower training error does not mean a better model; the choice must be based on validation (cross-validation) error.",
    keyPoints: [
      { text: "Choose degree 2: lowest validation RMSE and a small gap", keywords: ["degree 2", "0.772", "lowest validation"] },
      { text: "Degree 1 underfits: both errors high (high bias)", keywords: ["underfit", "high bias", "1.839", "too simple"] },
      { text: "Degree 10 overfits: lowest training error, higher validation error (high variance)", keywords: ["overfit", "high variance", "1.148", "0.656"] },
      { text: "Bias-variance trade-off: as the degree grows, bias falls and variance rises", keywords: ["trade-off", "tradeoff", "trade off", "balance"] },
      { text: "Lower training error ≠ better model; decide with validation error", keywords: ["training error", "cross-val", "not mean", "doesn't mean", "does not mean"] },
    ],
  },
];

if (typeof module !== "undefined") module.exports = MIDTERM;
