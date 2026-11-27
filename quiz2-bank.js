// Quiz 2 question bank: Module 7 (Support Vector Machines) and Module 8 (Dimensionality Reduction).
// Schema:
//   mc:   { id, module, type: "mc", kind: "theory"|"code", prompt, code?, options[4], answer (index), explanation }
//   open: { id, module, type: "open", kind, prompt, code?, modelAnswer, keyPoints: [{ text, keywords[] }] }
// kind "code" = reading Python code or a model output (shown in the `code` block), taken from the
// Module 7-8 readings, teaching demos and in-class activities.
// Options are shuffled at runtime, so never write "all/none of the above".

const QUIZ2 = [
  // ───────────────────────── Module 7: Support Vector Machines ─────────────────────────
  {
    id: "q7-01", module: 7, type: "mc", kind: "theory",
    prompt: "What does a Support Vector Machine try to maximize when it chooses a decision boundary?",
    options: ["The margin between the classes", "The number of support vectors", "The training accuracy at any cost", "The number of features used"],
    answer: 0,
    explanation: "Among all boundaries that separate the classes, an SVM picks the one with the widest margin to the nearest points, which tends to generalize better.",
  },
  {
    id: "q7-02", module: 7, type: "mc", kind: "theory",
    prompt: "What are support vectors?",
    options: ["The points nearest the boundary; they define it", "Every point that belongs to the minority class", "The points farthest from the boundary", "New points the model has not seen yet"],
    answer: 0,
    explanation: "Support vectors are the training points on or inside the margin. They fix the position of the boundary; points far away have little influence.",
  },
  {
    id: "q7-03", module: 7, type: "mc", kind: "theory",
    prompt: "You remove a training point that lies far from the boundary (it is not a support vector) and retrain a linear SVM. What happens?",
    options: ["The boundary stays the same", "The margin becomes much wider", "The boundary moves toward that class", "All the support vectors change"],
    answer: 0,
    explanation: "Only support vectors determine the boundary, so removing a distant point does not change it.",
  },
  {
    id: "q7-04", module: 7, type: "mc", kind: "theory",
    prompt: "When is a hard-margin SVM suitable?",
    options: ["Only when the classes separate perfectly", "When the data contain many outliers", "Whenever the classes overlap", "When the features are not scaled"],
    answer: 0,
    explanation: "A hard margin allows no point inside the margin or on the wrong side, so it only works when a straight boundary separates the classes perfectly.",
  },
  {
    id: "q7-05", module: 7, type: "mc", kind: "theory",
    prompt: "Why is hard-margin classification rarely used on real data?",
    options: ["Real data rarely separate perfectly", "It cannot draw a straight boundary", "It only works with the RBF kernel", "It needs more support vectors"],
    answer: 0,
    explanation: "Real data are noisy and overlap, and a single outlier can make a hard margin impossible or push the boundary badly. Soft margins tolerate violations.",
  },
  {
    id: "q7-06", module: 7, type: "mc", kind: "theory",
    prompt: "In a soft-margin SVM, what does the hyperparameter C control?",
    options: ["Margin width vs. margin violations", "How far each point's influence reaches", "The degree of the polynomial kernel", "How many classes the model predicts"],
    answer: 0,
    explanation: "C sets how strongly margin violations are penalized: it balances a wide margin against classifying the training points correctly. Gamma controls the reach of each point.",
  },
  {
    id: "q7-07", module: 7, type: "mc", kind: "theory",
    prompt: "What is the typical effect of a SMALL value of C?",
    options: ["Wider margin, more regularization, may underfit", "Narrower margin and a higher risk of overfitting", "No margin violations are allowed at all", "The kernel automatically becomes linear"],
    answer: 0,
    explanation: "Small C tolerates more violations, so the margin is wider and the model simpler. Large C fits the training data more closely and risks overfitting.",
  },
  {
    id: "q7-08", module: 7, type: "mc", kind: "theory",
    prompt: "Why must features be standardized before training an SVM?",
    options: ["It uses distances; big-unit features would dominate", "SVC only accepts values between 0 and 1 as input", "Scaling removes all the outliers from the data", "Scaling turns a linear kernel into an RBF kernel"],
    answer: 0,
    explanation: "SVMs rely on distances, so a feature in large units (body mass in grams) would outweigh features in millimetres. Standardizing gives every feature mean 0 and SD 1.",
  },
  {
    id: "q7-09", module: 7, type: "mc", kind: "theory",
    prompt: "Why is the StandardScaler placed inside a Pipeline with the SVC when using cross-validation?",
    options: ["Each fold learns its own scaling (no leakage)", "It makes the SVM train faster on the test set", "It lets the scaler also learn from the test data", "Pipelines are required for the RBF kernel"],
    answer: 0,
    explanation: "Inside a pipeline, the scaler is fitted on the training folds only and then applied to the validation fold, so no information leaks from the data used to score the model.",
  },
  {
    id: "q7-10", module: 7, type: "mc", kind: "theory",
    prompt: "What does the kernel trick allow an SVM to do?",
    options: ["Fit curved boundaries without building new features", "Train an SVM without setting any hyperparameters", "Skip feature scaling, even with very different units", "Turn the classifier into a regression model"],
    answer: 0,
    explanation: "A kernel computes similarities as if the data were mapped to a higher-dimensional space, so the SVM learns nonlinear boundaries without creating those features explicitly.",
  },
  {
    id: "q7-11", module: 7, type: "mc", kind: "theory",
    prompt: "Which kernel is a good first choice for high-dimensional data such as text?",
    options: ["Linear", "Gaussian RBF", "Polynomial with degree 5", "Sigmoid"],
    answer: 0,
    explanation: "The linear kernel is fast and works well when the data are (nearly) linearly separable, which is common in high-dimensional data like text.",
  },
  {
    id: "q7-12", module: 7, type: "mc", kind: "theory",
    prompt: "Which kernel is the usual choice for complex nonlinear data?",
    options: ["Gaussian RBF", "Linear", "Sigmoid", "No kernel: SVMs are linear only"],
    answer: 0,
    explanation: "RBF gives highly flexible boundaries and often the best performance on nonlinear problems. Sigmoid is rarely used because it is usually worse than RBF.",
  },
  {
    id: "q7-13", module: 7, type: "mc", kind: "theory",
    prompt: "In an RBF SVM, what does a very LARGE gamma tend to do?",
    options: ["Make a very local, complex boundary that may overfit", "Make a very smooth boundary that may underfit", "Widen the margin and add more violations", "Turn the RBF kernel into a linear kernel"],
    answer: 0,
    explanation: "Large gamma makes each point's influence very local, so the boundary wraps around individual points. Small gamma gives smoother boundaries.",
  },
  {
    id: "q7-14", module: 7, type: "mc", kind: "theory",
    prompt: "What happens when you increase the degree of a polynomial kernel?",
    options: ["More complex boundaries and a risk of overfitting", "Test accuracy always improves as a result", "The boundary turns into a straight line", "Training becomes much faster and simpler"],
    answer: 0,
    explanation: "A higher degree models more complex relationships but costs more computation and is more likely to overfit.",
  },
  {
    id: "q7-15", module: 7, type: "mc", kind: "theory",
    prompt: "How should the kernel, C and gamma be chosen?",
    options: ["Cross-validation on the training data (GridSearchCV)", "Pick the setting with the best test-set accuracy", "Always keep scikit-learn's default values", "Choose the most flexible kernel available"],
    answer: 0,
    explanation: "Hyperparameters are tuned with cross-validation on the development data. The locked test set is used once, at the end, for an honest estimate.",
  },
  {
    id: "q7-16", module: 7, type: "mc", kind: "theory",
    prompt: "How does SVC classify three penguin species (Adelie, Chinstrap, Gentoo)?",
    options: ["One binary classifier per pair of species", "It cannot: SVMs only handle two classes", "One hyperplane that splits all three at once", "It converts the problem to regression"],
    answer: 0,
    explanation: "SVC uses one-versus-one: with 3 classes it trains 3 pairwise classifiers (Adelie vs Chinstrap, Adelie vs Gentoo, Chinstrap vs Gentoo) and combines their votes.",
  },
  {
    id: "q7-17", module: 7, type: "mc", kind: "theory",
    prompt: "In Support Vector Regression (SVR), what is the ε-insensitive tube?",
    options: ["A band where small errors cost nothing", "The margin between two classes", "The number of support vectors kept", "The width of the RBF kernel"],
    answer: 0,
    explanation: "Errors inside the ε-tube around the prediction receive no penalty; only points outside it influence the fitted model, which makes SVR less sensitive to small noise.",
  },
  {
    id: "q7-18", module: 7, type: "mc", kind: "theory",
    prompt: "Which is a strength of SVMs?",
    options: ["They work well in high-dimensional spaces", "They need no feature scaling", "They are fast on millions of rows", "They are easy to interpret with RBF"],
    answer: 0,
    explanation: "SVMs are effective in high-dimensional spaces and on small to medium datasets. They need scaling, are slow on very large data and are hard to interpret with nonlinear kernels.",
  },
  {
    id: "q7-19", module: 7, type: "mc", kind: "theory",
    prompt: "Which is a limitation of SVMs?",
    options: ["Slow on very large datasets", "They cannot use nonlinear kernels", "They only work with two features", "They never generalize well"],
    answer: 0,
    explanation: "Training SVMs is computationally expensive on very large datasets. They also need scaling and tuning and are less interpretable than trees or logistic regression.",
  },
  {
    id: "q7-20", module: 7, type: "mc", kind: "theory",
    prompt: "Why did the class demo score the penguin SVMs with balanced accuracy?",
    options: ["It weighs each species equally (imbalance)", "It is always higher than plain accuracy", "It ignores the smallest class, Chinstrap", "SVC cannot be scored with plain accuracy"],
    answer: 0,
    explanation: "The species are imbalanced (151 Adelie, 123 Gentoo, 68 Chinstrap). Balanced accuracy averages the recall of each class, so the small class counts as much as the large ones.",
  },
  {
    id: "q7-21", module: 7, type: "mc", kind: "theory",
    prompt: "In the demos, why was the locked test set used only once, after GridSearchCV had chosen the model?",
    options: ["So the final score is an honest estimate", "Because the test set is too small to train on", "Because GridSearchCV needs the test set", "Because an SVM cannot be evaluated twice"],
    answer: 0,
    explanation: "If the test set influences tuning, it becomes part of model selection and its score is optimistic. Selecting with CV first keeps the test score honest.",
  },
  {
    id: "q7-c1", module: 7, type: "mc", kind: "code",
    prompt: "Linear SVMs for Adelie vs Chinstrap (class demo). Why does C = 30 use far fewer support vectors than C = 0.03?",
    code: `    C    Train accuracy   CV balanced accuracy   Support vectors
 0.03        0.953               0.929                  72
30.00        0.976               0.945                  13`,
    options: ["A large C narrows the margin, so fewer points touch it", "A large C widens the margin to include more points", "C only changes the kernel, not the support vectors", "Fewer support vectors means the model underfits"],
    answer: 0,
    explanation: "Large C penalizes violations heavily, so the margin narrows and fewer points sit on or inside it. Small C accepts violations, giving a wide margin with many support vectors.",
  },
  {
    id: "q7-c2", module: 7, type: "mc", kind: "code",
    prompt: "Penguin species, 5-fold CV. What explains the low score of the raw-units RBF model?",
    code: `model              CV balanced accuracy
RBF · raw units           0.594
RBF · scaled              0.968
Linear · scaled           0.974`,
    options: ["Body mass in grams dominates the distance calculation", "The RBF kernel cannot classify penguin species", "Scaling adds new features to the data", "Raw units make the model overfit the test set"],
    answer: 0,
    explanation: "RBF compares points by distance. Body mass (thousands of grams) swamps the millimetre measurements unless the features are standardized.",
  },
  {
    id: "q7-c3", module: 7, type: "mc", kind: "code",
    prompt: "Kernels compared on Adelie vs Chinstrap (5-fold CV). What is the most careful conclusion?",
    code: `kernel    CV balanced accuracy   CV SD
rbf              0.949            0.039
linear           0.940            0.023
sigmoid          0.927            0.028
poly             0.876            0.040`,
    options: ["RBF and linear are about tied (within one SD)", "RBF is clearly the best kernel for every dataset", "Polynomial fails because degree 3 is too low", "The most flexible kernel always wins"],
    answer: 0,
    explanation: "The gap between RBF and linear (0.009) is smaller than their standard deviations, so they perform about the same here. The best kernel depends on the data.",
  },
  {
    id: "q7-c4", module: 7, type: "mc", kind: "code",
    prompt: "Why are the parameters written as svc__C and svc__gamma in this code?",
    code: `search = GridSearchCV(
    make_pipeline(StandardScaler(), SVC()),
    param_grid={"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.1, 1]},
    cv=5, scoring="balanced_accuracy")
search.fit(X_dev, y_dev)`,
    options: ["They target the SVC step inside the pipeline", "Double underscores make the values private", "They tell GridSearchCV to scale C and gamma", "They are only needed for the RBF kernel"],
    answer: 0,
    explanation: "In a pipeline, a hyperparameter is named step__parameter. make_pipeline names the SVC step 'svc', so svc__C sets the C of that step.",
  },
  {
    id: "q7-c5", module: 7, type: "mc", kind: "code",
    prompt: "RBF SVMs on two penguin features. Which setting shows the clearest sign of overfitting?",
    code: `   C   gamma   train accuracy   CV balanced accuracy
 0.1    0.01        0.733              0.368
 0.1    5.00        0.947              0.839
10.0    0.01        0.959              0.940
10.0    5.00        0.992              0.934`,
    options: ["C=10, γ=5: top train score, not top CV score", "C=0.1, γ=0.01: lowest train and CV scores", "C=10, γ=0.01: the best CV score", "C=0.1, γ=5: train and CV both high"],
    answer: 0,
    explanation: "C=10, γ=5 fits the training data best (0.992) but generalizes slightly worse than C=10, γ=0.01. C=0.1, γ=0.01 is the underfitting case: both scores are low.",
  },
  {
    id: "q7-c6", module: 7, type: "mc", kind: "code",
    prompt: "Predicting penguin body mass (grams) with 5-fold CV. Which model would you choose?",
    code: `model               CV MAE    CV SD
RBF SVR             280.61    35.65
linear regression   327.60    25.94
linear SVR          331.11    27.98`,
    options: ["RBF SVR: the lowest average error in grams", "Linear SVR: SVMs are always the best choice", "Linear regression: it has the highest MAE", "Any of them: MAE cannot compare models"],
    answer: 0,
    explanation: "For MAE, lower is better. RBF SVR misses by about 281 g on average, roughly 47 g less than the other two. The result depends on this dataset; SVR does not always win.",
  },
  {
    id: "q7-c7", module: 7, type: "mc", kind: "code",
    prompt: "In the Cascade lab, every SVC was created with probability=True. Why?",
    code: `linear_svm = SVC(kernel="linear", C=1, probability=True, random_state=42)
...
prob = model.predict_proba(X_test_scaled)[:, 1]
roc = roc_auc_score(y_test, prob)`,
    options: ["So predict_proba exists, which ROC-AUC needs", "To make the margin wider and smoother", "To force a linear decision boundary", "To make training faster on large data"],
    answer: 0,
    explanation: "By default SVC gives labels and decision scores, not probabilities. probability=True enables predict_proba, which the lab uses to compute ROC-AUC.",
  },
  {
    id: "q7-22", module: 7, type: "mc", kind: "theory",
    prompt: "The reading lists a fourth kernel, sigmoid. What does it say about it?",
    options: ["Rarely used; usually worse than RBF", "The default kernel for text data", "The only kernel that needs no scaling", "Best for perfectly separable classes"],
    answer: 0,
    explanation: "The sigmoid kernel is available in scikit-learn but less common: its results are sensitive to the hyperparameters and are generally worse than RBF. Text data → linear kernel, and no kernel removes the need for scaling.",
  },
  {
    id: "q7-23", module: 7, type: "mc", kind: "theory",
    prompt: "In an RBF SVM, what does a SMALL gamma do?",
    options: ["Each point's influence reaches far: smoother boundary", "Each point only affects its close neighbours", "It narrows the margin and lowers regularization", "It switches the RBF kernel to a linear one"],
    answer: 0,
    explanation: "Gamma sets how far each training point's influence reaches. Small gamma → wide influence → smooth, simple boundary (too small can underfit). Large gamma → very local influence → complex boundary that may overfit.",
  },
  {
    id: "q7-24", module: 7, type: "mc", kind: "theory",
    prompt: "What is the typical effect of a LARGE value of C?",
    options: ["Narrower margin, fewer violations, may overfit", "Wider margin, more regularization, may underfit", "Smoother boundary from each point's wider reach", "No effect once the features are standardized"],
    answer: 0,
    explanation: "A large C punishes margin violations heavily, so the SVM fits the training data closely with a narrow margin and weak regularization, which can overfit. A small C does the opposite.",
  },
  {
    id: "q7-25", module: 7, type: "mc", kind: "theory",
    prompt: "Your team replaces a Random Forest with an SVM on the same data. Which preprocessing step becomes essential?",
    options: ["Standardizing the features", "Removing all correlated features", "One-hot encoding the target", "Balancing the classes by oversampling"],
    answer: 0,
    explanation: "Trees split one feature at a time, so feature scale does not matter to them. SVMs rely on distances, so features in large units would dominate: standardize them (inside a pipeline).",
  },
  {
    id: "q7-26", module: 7, type: "mc", kind: "theory",
    prompt: "A bank must explain each credit decision to its customers. Why might an RBF SVM be a poor fit?",
    options: ["Its decisions are hard to interpret", "It cannot handle two classes", "It needs more data than any tree", "It always overfits small datasets"],
    answer: 0,
    explanation: "The reading lists limited interpretability as an SVM limitation, especially with nonlinear kernels: there is no readable rule like a decision tree's splits or logistic regression's coefficients.",
  },
  {
    id: "q7-27", module: 7, type: "mc", kind: "theory",
    prompt: "The lab compared SVMs by accuracy \"for simplicity\". With strongly imbalanced classes, which metrics does the reading say are often preferred?",
    options: ["F1-score or ROC-AUC", "Training accuracy", "Number of support vectors", "Mean squared error"],
    answer: 0,
    explanation: "With imbalance, a model that always predicts the majority class still gets a high accuracy. F1 balances precision and recall, and ROC-AUC measures how well the model ranks the classes. (The class demos used balanced accuracy for the same reason.)",
  },
  {
    id: "q7-c8", module: 7, type: "mc", kind: "code",
    prompt: "In the lab's scaling step, why is the test set only transformed, never fitted?",
    code: `scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)`,
    options: ["So it is scaled with the training mean and SD (no leakage)", "Because fitting twice would remove the support vectors", "Because the test set is smaller than the training set", "Because transform() also trains the SVM on the test data"],
    answer: 0,
    explanation: "fit learns the mean and standard deviation; transform applies them. Learning them from the test set would leak test information into preprocessing and scale the two sets differently.",
  },
  {
    id: "q7-c9", module: 7, type: "mc", kind: "code",
    prompt: "The lab's grid search prints this. What is the 0.9799?",
    code: `grid = GridSearchCV(SVC(probability=True), param_grid, cv=5, scoring="accuracy")
grid.fit(X_train_scaled, y_train)
print(grid.best_params_)
print(round(grid.best_score_, 4))

{'C': 10, 'degree': 2, 'gamma': 0.01, 'kernel': 'rbf'}
0.9799`,
    options: ["Mean CV accuracy of the best setting on the training data", "Accuracy of the best model on the held-out test set", "Training accuracy of the best model on all its data", "Share of the 144 settings that beat the baseline model"],
    answer: 0,
    explanation: "best_score_ is the mean 5-fold cross-validation accuracy of the best combination, computed on the training data only. The test set is untouched; the lab evaluates best_estimator_ on it afterwards.",
  },
  {
    id: "q7-o1", module: 7, type: "open", kind: "theory",
    prompt: "What are support vectors, and why do they matter?",
    modelAnswer: "Support vectors are the training points closest to the decision boundary, on or inside the margin. They define the position and width of the margin, so they determine the boundary. Points far from the boundary have little or no influence: removing them does not change the model.",
    keyPoints: [
      { text: "The points closest to the boundary (on or inside the margin)", keywords: ["closest", "nearest", "near the boundary", "on or inside", "inside the margin", "on the margin"] },
      { text: "They define the boundary and the margin", keywords: ["define", "determine", "position", "fix"] },
      { text: "Points far away have little or no influence", keywords: ["far", "no influence", "little influence", "do not change", "does not change", "don't change"] },
    ],
  },
  {
    id: "q7-o2", module: 7, type: "open", kind: "theory",
    prompt: "Explain the difference between a hard-margin and a soft-margin SVM, and the role of C.",
    modelAnswer: "A hard-margin SVM allows no margin violations, so it only works when the classes are perfectly linearly separable and is very sensitive to outliers. A soft-margin SVM allows some violations and misclassifications. C controls the trade-off: a small C allows more violations, giving a wider margin and stronger regularization (risk of underfitting), while a large C penalizes violations heavily, giving a narrower margin that fits the training data closely (risk of overfitting).",
    keyPoints: [
      { text: "Hard margin: no violations, needs perfect separation, sensitive to outliers", keywords: ["no violation", "perfectly", "outlier", "no misclassification", "no errors"] },
      { text: "Soft margin: allows some violations", keywords: ["allows", "some violation", "tolerate", "slack"] },
      { text: "Small C: wider margin, more regularization, may underfit", keywords: ["small c", "wider margin", "underfit", "low c"] },
      { text: "Large C: narrower margin, fits training data, may overfit", keywords: ["large c", "narrower", "overfit", "high c"] },
    ],
  },
  {
    id: "q7-o3", module: 7, type: "open", kind: "theory",
    prompt: "Why must features be scaled before training an SVM, and where should the scaler go in the workflow?",
    modelAnswer: "SVMs, especially with the RBF kernel, rely on distances, so a feature measured in large units (such as body mass in grams) dominates the others. StandardScaler gives every feature mean 0 and standard deviation 1 so they contribute equally; in the penguin demo, scaling raised RBF balanced accuracy from 0.594 to 0.968. The scaler should be inside a Pipeline, fitted on the training data (or training folds) only, to avoid data leakage.",
    keyPoints: [
      { text: "SVMs use distances; large-unit features dominate", keywords: ["distance", "dominate", "large units", "grams", "scale"] },
      { text: "Standardize: mean 0, SD 1, so features contribute equally", keywords: ["standardscaler", "mean 0", "mean of 0", "standard deviation 1", "equally", "standardiz"] },
      { text: "Inside a pipeline, fitted on training data only (no leakage)", keywords: ["pipeline", "leakage", "training data only", "training folds", "fit on the training"] },
    ],
  },
  {
    id: "q7-o4", module: 7, type: "open", kind: "theory",
    prompt: "What is the kernel trick, and when would you choose an RBF kernel instead of a linear kernel?",
    modelAnswer: "The kernel trick lets an SVM compute similarities between points as if they had been mapped into a higher-dimensional feature space, without creating those features explicitly. This allows nonlinear decision boundaries at a reasonable computational cost. A linear kernel is a good choice for linearly separable or high-dimensional data such as text; an RBF kernel is preferred when the classes have a complex nonlinear boundary, with C and gamma tuned by cross-validation.",
    keyPoints: [
      { text: "Similarity as if mapped to a higher-dimensional space, without building the features", keywords: ["higher-dimensional", "higher dimensional", "without", "implicit", "similarit"] },
      { text: "Enables nonlinear boundaries efficiently", keywords: ["nonlinear", "non-linear", "curved", "efficient"] },
      { text: "RBF for complex nonlinear data; linear for separable or high-dimensional data", keywords: ["rbf", "linear kernel", "text", "high-dimensional data", "complex"] },
    ],
  },
  {
    id: "q7-o5", module: 7, type: "open", kind: "code",
    prompt: "Interpret this grid search on the penguin development set. Which model would you choose, and what is the next step?",
    code: `GridSearchCV (5-fold CV, balanced accuracy)
kernel    C    gamma    mean CV    SD
linear   10      -       0.985    0.014
rbf      10    scale     0.981    0.025
rbf      10     0.1      0.981    0.025
linear    1      -       0.974    0.031`,
    modelAnswer: "GridSearchCV selects the linear SVM with C = 10, which has the highest mean CV balanced accuracy (0.985). The top models differ by less than one standard deviation, so they are practically tied, and the simpler linear model is a sensible choice. The next step is to evaluate the selected model once on the untouched locked test set, which was not used during tuning.",
    keyPoints: [
      { text: "Chooses the linear SVM with C = 10 (highest mean CV, 0.985)", keywords: ["linear", "c = 10", "c=10", "0.985"] },
      { text: "The top models are within one SD: practically tied, prefer the simpler one", keywords: ["tied", "tie", "standard deviation", "within", "small difference", "simpler"] },
      { text: "Next: evaluate once on the locked test set", keywords: ["test set", "locked", "once", "untouched"] },
    ],
  },
  // ───────────────────────── Module 8: Dimensionality Reduction ─────────────────────────
  {
    id: "q8-01", module: 8, type: "mc", kind: "theory",
    prompt: "What is the curse of dimensionality?",
    options: ["Problems that grow as features are added", "A model trained with too few features", "Missing values spread across many rows", "Classes that are badly imbalanced"],
    answer: 0,
    explanation: "As features increase, data become sparse, distances less informative, computation more expensive and overfitting more likely.",
  },
  {
    id: "q8-02", module: 8, type: "mc", kind: "theory",
    prompt: "Why do k-NN and clustering struggle in very high dimensions?",
    options: ["Distances between points become very similar", "Every distance becomes exactly zero", "There are too few features to compare", "All points crowd into one small region"],
    answer: 0,
    explanation: "In high dimensions points are far apart but their distances are relatively similar, so 'nearest' neighbours are hardly nearer than anyone else.",
  },
  {
    id: "q8-03", module: 8, type: "mc", kind: "theory",
    prompt: "As features are added, the data become sparse. What does that mean?",
    options: ["Points spread thin over a huge space", "Most values become missing", "The dataset gains more rows", "Features become perfectly correlated"],
    answer: 0,
    explanation: "The feature space grows very quickly, so the same number of observations covers it thinly, which makes patterns harder to find.",
  },
  {
    id: "q8-04", module: 8, type: "mc", kind: "theory",
    prompt: "Which is NOT a typical benefit of dimensionality reduction?",
    options: ["It always increases accuracy", "Faster model training", "Lower storage requirements", "Easier visualization"],
    answer: 0,
    explanation: "Reduction speeds training, saves storage, removes noise and helps visualization, but it can lose information. In the MNIST demo, LDA with 2 components dropped accuracy to 0.533.",
  },
  {
    id: "q8-05", module: 8, type: "mc", kind: "theory",
    prompt: "PCA and LDA are examples of:",
    options: ["Feature extraction: they create new features", "Feature selection: they keep some original features", "Data cleaning methods", "Clustering algorithms"],
    answer: 0,
    explanation: "Feature selection keeps a subset of the original features. PCA and LDA build new features as combinations of the originals, so they are feature extraction.",
  },
  {
    id: "q8-06", module: 8, type: "mc", kind: "theory",
    prompt: "What does PCA look for?",
    options: ["Orthogonal directions of maximum variance", "Directions that best separate the classes", "The features most correlated with the target", "Clusters of similar observations"],
    answer: 0,
    explanation: "PCA finds new perpendicular axes ordered by how much of the data's variance they capture. It ignores the class labels.",
  },
  {
    id: "q8-07", module: 8, type: "mc", kind: "theory",
    prompt: "How is the second principal component (PC2) defined?",
    options: ["Most remaining variance, orthogonal to PC1", "The direction with the least variance", "The direction of best class separation", "The same direction as PC1, rescaled"],
    answer: 0,
    explanation: "PC2 captures the largest variance left after PC1 while staying perpendicular to it, so each component adds unique information.",
  },
  {
    id: "q8-08", module: 8, type: "mc", kind: "theory",
    prompt: "Does PCA use the class labels?",
    options: ["No, it is unsupervised", "Yes, it maximizes class separation", "Only during cross-validation", "Only when there are two classes"],
    answer: 0,
    explanation: "PCA only looks at the features. LDA is the supervised method that uses labels.",
  },
  {
    id: "q8-09", module: 8, type: "mc", kind: "theory",
    prompt: "Why should features be standardized before PCA?",
    options: ["Big-unit features would dominate the variance", "PCA only accepts whole numbers as input", "Standardizing creates extra components", "PCA needs the class labels to be scaled"],
    answer: 0,
    explanation: "PCA follows variance, and a feature in large units (body mass in grams) has a huge variance. Standardizing lets every feature count equally.",
  },
  {
    id: "q8-10", module: 8, type: "mc", kind: "theory",
    prompt: "PC1 and PC2 explain 72% and 18% of the variance. What does this mean?",
    options: ["Together they keep 90% of the variance", "Any model using them will be 90% accurate", "90% of the original features were kept", "PC1 is four times more accurate than PC2"],
    answer: 0,
    explanation: "The cumulative explained variance is 72% + 18% = 90% of the total variance (information) in the data. It says nothing directly about accuracy.",
  },
  {
    id: "q8-11", module: 8, type: "mc", kind: "theory",
    prompt: "What does PCA(n_components=0.95) do?",
    options: ["Keeps enough components for 95% of the variance", "Keeps exactly 95 principal components", "Drops 95% of the original input features", "Keeps only components with 95% accuracy"],
    answer: 0,
    explanation: "A value between 0 and 1 tells PCA to keep as many components as needed to preserve that share of the variance: 150 of 784 for MNIST.",
  },
  {
    id: "q8-12", module: 8, type: "mc", kind: "theory",
    prompt: "In a scree plot, what does the elbow suggest?",
    options: ["After it, extra components add little", "The direction of best class separation", "The component with the most noise", "Where the model's accuracy is highest"],
    answer: 0,
    explanation: "The elbow is where the explained variance curve flattens: components after it add little information, so it is a natural cut-off.",
  },
  {
    id: "q8-13", module: 8, type: "mc", kind: "theory",
    prompt: "Why can PCA hurt a classification task?",
    options: ["Max-variance directions may not separate classes", "PCA removes the class labels from the data", "PCA always keeps all of the features", "PCA cannot be combined with an SVM"],
    answer: 0,
    explanation: "PCA ignores the labels. The directions with the most variance (e.g. penguin body size) can miss the differences that separate the classes.",
  },
  {
    id: "q8-14", module: 8, type: "mc", kind: "theory",
    prompt: "Which is a limitation of PCA?",
    options: ["Components mix features, so they are hard to read", "Components are always correlated with each other", "It cannot be computed on large datasets", "It requires labelled training data"],
    answer: 0,
    explanation: "Each component is a combination of many original features, which reduces explainability. PCA also assumes linear structure and ignores labels.",
  },
  {
    id: "q8-15", module: 8, type: "mc", kind: "theory",
    prompt: "What does LDA maximize?",
    options: ["Between-class vs. within-class spread", "The total variance of the data", "The distance between all pairs of points", "The number of output components"],
    answer: 0,
    explanation: "LDA finds directions where the class centres are far apart and each class is tightly grouped, i.e. the ratio of between-class to within-class scatter.",
  },
  {
    id: "q8-16", module: 8, type: "mc", kind: "theory",
    prompt: "A dataset has 3 classes and 30 features. What is the maximum number of LDA components?",
    options: ["2", "3", "29", "30"],
    answer: 0,
    explanation: "LDA gives at most C − 1 components, where C is the number of classes, regardless of the number of features.",
  },
  {
    id: "q8-17", module: 8, type: "mc", kind: "theory",
    prompt: "Why does LDA give only one component for malignant vs benign tumours?",
    options: ["Two classes allow at most C − 1 = 1", "PCA already used the other components", "The other 29 features were removed as noise", "Logistic regression needs exactly one input"],
    answer: 0,
    explanation: "With two classes, one direction is enough to separate their centres, so LDA can produce only one component.",
  },
  {
    id: "q8-18", module: 8, type: "mc", kind: "theory",
    prompt: "LDA works best when:",
    options: ["Classes are roughly normal with similar covariance", "Classes are nonlinear and heavily overlapping", "No class labels are available", "There are more classes than observations"],
    answer: 0,
    explanation: "LDA assumes roughly linear relationships and classes that are approximately normally distributed with similar covariance matrices. It also needs labels.",
  },
  {
    id: "q8-19", module: 8, type: "mc", kind: "theory",
    prompt: "What is t-SNE mainly used for?",
    options: ["Visualizing high-dimensional data in 2D or 3D", "Compressing features before a classifier", "Selecting the most important features", "Replacing cross-validation"],
    answer: 0,
    explanation: "t-SNE is a nonlinear method designed for exploratory visualization, not for building features for a predictive model.",
  },
  {
    id: "q8-20", module: 8, type: "mc", kind: "theory",
    prompt: "What does t-SNE try to preserve?",
    options: ["Local neighbourhoods: close points stay close", "The maximum variance of the data", "Class separation, using the labels", "Exact global distances between clusters"],
    answer: 0,
    explanation: "t-SNE turns distances into neighbourhood probabilities and keeps nearby points together, so clusters emerge. Global distances are not preserved.",
  },
  {
    id: "q8-21", module: 8, type: "mc", kind: "theory",
    prompt: "Two clusters are far apart on a t-SNE plot. What can you conclude?",
    options: ["Little: cluster distances are unreliable", "They are the two most different classes", "PCA would show the same distance", "The two clusters have equal variance"],
    answer: 0,
    explanation: "t-SNE focuses on local structure, so the distance between separated clusters should not be interpreted quantitatively.",
  },
  {
    id: "q8-22", module: 8, type: "mc", kind: "theory",
    prompt: "Why is t-SNE rarely used before a predictive model?",
    options: ["It does not naturally transform new data", "It always loses all of the variance", "It needs the class labels to run", "It only works on image data"],
    answer: 0,
    explanation: "t-SNE builds a map of the data it was given; it has no stable transform for new observations, and it is slow and sensitive to perplexity and the random seed.",
  },
  {
    id: "q8-23", module: 8, type: "mc", kind: "theory",
    prompt: "You need to compress unlabelled sensor data before storing it. Which method fits best?",
    options: ["PCA", "LDA", "t-SNE", "SVC"],
    answer: 0,
    explanation: "PCA is unsupervised and built for compression. LDA needs labels, and t-SNE is for visualization.",
  },
  {
    id: "q8-24", module: 8, type: "mc", kind: "theory",
    prompt: "Why are PCA and LDA placed inside the pipeline, after the scaler and before the model?",
    options: ["So they learn only from the training folds", "So they run after the classifier is trained", "So they can use the labels of the test set", "So GridSearchCV skips them during tuning"],
    answer: 0,
    explanation: "Inside the pipeline they are refitted on each training fold, so no information leaks from the validation fold. This matters most for LDA, which uses labels.",
  },
  {
    id: "q8-c1", module: 8, type: "mc", kind: "code",
    prompt: "PCA on MNIST (784 pixels). What does this output tell you about the 2-D PCA plot?",
    code: `pca_2d = PCA(n_components=2).fit(X_train[:3000])
Explained variance by PC1 and PC2: [0.099 0.073]
Total variance in two components: 0.172`,
    options: ["Only 17% of variance kept: overlap is expected", "It keeps 83% of the information in the images", "The ten digits are perfectly separated", "PCA failed and must be run again"],
    answer: 0,
    explanation: "Two components keep 17.2% of the variance of 784 pixels, so a lot of information is lost and the digit clouds overlap in the plot.",
  },
  {
    id: "q8-c2", module: 8, type: "mc", kind: "code",
    prompt: "Interpret this MNIST output.",
    code: `pca95 = PCA(n_components=0.95)
Original dimensions: 784
PCA dimensions: 150
Retained variance: 0.95`,
    options: ["150 new components keep 95% of the variance", "150 pixels were selected and 634 deleted", "The model is now 95% accurate", "Only 5% of the images were kept"],
    answer: 0,
    explanation: "PCA built 150 new components (combinations of pixels) that preserve 95% of the variance: about a fifth of the dimensions. It is extraction, not selection.",
  },
  {
    id: "q8-c3", module: 8, type: "mc", kind: "code",
    prompt: "Logistic regression on MNIST with three representations. What is the best interpretation?",
    code: `Representation        Dimensions   Test accuracy
Original pixels          784          0.872
PCA (95% variance)       150          0.876
LDA (2 components)         2          0.533`,
    options: ["PCA kept the accuracy with far fewer features", "LDA is best because it uses the labels", "Fewer dimensions always lower accuracy", "The original pixels were useless"],
    answer: 0,
    explanation: "PCA kept the accuracy (0.876 vs 0.872) with 150 instead of 784 features. Two LDA components are good for a plot but throw away too much to separate ten digits.",
  },
  {
    id: "q8-c4", module: 8, type: "mc", kind: "code",
    prompt: "LDA + logistic regression on MNIST (10 digits). Why does the table stop at 9 components?",
    code: `LDA components   Test accuracy
      2              0.533
      4              0.741
      6              0.777
      9              0.816`,
    options: ["Ten classes allow at most nine", "The images only have nine features", "Accuracy would fall below 0.5", "Logistic regression limits it"],
    answer: 0,
    explanation: "LDA produces at most C − 1 components. MNIST has 10 classes, so 9 is the maximum. Accuracy rises with components but the gains shrink.",
  },
  {
    id: "q8-c5", module: 8, type: "mc", kind: "code",
    prompt: "Linear SVM on penguins, 5-fold CV. Why did PCA (2), which keeps 88% of the variance, score lower than LDA (2)?",
    code: `Representation   Dimensions   linear CV
Original             4          0.974
PCA (2)              2          0.872
LDA (2)              2          0.981`,
    options: ["Its variance was mostly size, not species", "LDA keeps more total variance than PCA", "PCA used the test labels by mistake", "LDA uses more dimensions than PCA"],
    answer: 0,
    explanation: "PCA kept the directions of most variance, mostly body size, and Adelie and Chinstrap are similar in size. LDA used the labels to keep the directions that separate species.",
  },
  {
    id: "q8-c6", module: 8, type: "mc", kind: "code",
    prompt: "What does this code do?",
    code: `pipe = make_pipeline(StandardScaler(),
                     LinearDiscriminantAnalysis(n_components=2),
                     SVC(kernel="linear", C=1))
scores = cross_val_score(pipe, X_dev, y_dev, cv=cv, scoring="balanced_accuracy")`,
    options: ["Scales, makes 2 LDA axes, cross-validates an SVM", "Selects 2 of the original features for the SVM", "Fits LDA on the test set before the SVM", "Plots the data in two dimensions with t-SNE"],
    answer: 0,
    explanation: "Each CV fold scales the features, fits LDA on the training part to get 2 new axes, trains the SVM on them and scores it on the held-out part.",
  },
  {
    id: "q8-c7", module: 8, type: "mc", kind: "code",
    prompt: "PCA loadings on the standardized penguin measurements. What does PC1 mostly represent?",
    code: `                     PC1     PC2
bill_length_mm       0.46    0.60
bill_depth_mm       -0.40    0.80
flipper_length_mm    0.58    0.00
body_mass_g          0.55    0.08
Explained variance:  0.690   0.193`,
    options: ["Overall body size", "Bill depth only", "The species label", "Random noise"],
    answer: 0,
    explanation: "PC1 rises with flipper length, body mass and bill length (and falls with bill depth), so it is roughly a body-size axis. PC2 is mostly bill shape.",
  },
  {
    id: "q8-25", module: 8, type: "mc", kind: "theory",
    prompt: "How does feature selection differ from feature extraction?",
    options: ["Selection keeps some original features, with their meaning", "Selection creates new features by combining the old ones", "Selection needs class labels, while extraction never does", "Selection is only used to draw 2-D plots of the data"],
    answer: 0,
    explanation: "Feature selection keeps a subset of the original variables, so they stay interpretable. Feature extraction (PCA, LDA) builds new variables from combinations of the originals.",
  },
  {
    id: "q8-26", module: 8, type: "mc", kind: "theory",
    prompt: "The classes in your data lie on curved, nonlinear structures. Why may PCA miss them?",
    options: ["PCA assumes linear relationships among features", "PCA needs class labels to find the structure", "PCA can only keep a single component", "PCA only works on fewer than 30 features"],
    answer: 0,
    explanation: "PCA builds linear combinations of the features (straight axes), so nonlinear structure can be lost. t-SNE, a nonlinear method, is better at revealing it in a plot.",
  },
  {
    id: "q8-27", module: 8, type: "mc", kind: "theory",
    prompt: "Compared with PCA, which statement about t-SNE is true?",
    options: ["It is nonlinear and slower, and keeps local structure", "It is linear and fast, and keeps global structure", "It uses class labels to separate the groups", "It is the usual preprocessing step before a model"],
    answer: 0,
    explanation: "From the reading's table: PCA is linear, fast, preserves global structure and can transform new data, so it is used before models. t-SNE is nonlinear, computationally expensive, preserves local neighbourhoods and is mainly for visualization.",
  },
  {
    id: "q8-28", module: 8, type: "mc", kind: "theory",
    prompt: "Why may LDA struggle when two classes are separated by a ring-shaped (curved) boundary?",
    options: ["LDA assumes the classes separate roughly linearly", "LDA ignores the class labels when it projects", "LDA can produce only as many axes as features", "LDA needs the features to be left unscaled"],
    answer: 0,
    explanation: "LDA projects onto straight directions that best separate the class centres. With a curved boundary, no linear projection separates the classes well. Its other limits: it needs labels and gives at most C − 1 components.",
  },
  {
    id: "q8-29", module: 8, type: "mc", kind: "theory",
    prompt: "The breast cancer data are reduced from 30 features to 10 PCA components (95% of the variance). What is the main cost?",
    options: ["Some information is lost", "The model can no longer predict", "The target classes are changed", "Training becomes slower"],
    answer: 0,
    explanation: "Dimensionality reduction keeps most of the information (here 95% of the variance) but never all of it. The trade-off is a small loss of information for faster training, less storage and less noise.",
  },
  {
    id: "q8-30", module: 8, type: "mc", kind: "theory",
    prompt: "A dataset has 3 classes and 30 features. What is the maximum number of PCA components?",
    options: ["30", "2", "3", "29"],
    answer: 0,
    explanation: "PCA can build up to as many components as there are original features (30 here), because it ignores the classes. LDA on the same data would give at most C − 1 = 2.",
  },
  {
    id: "q8-c8", module: 8, type: "mc", kind: "code",
    prompt: "In the lab, why does LDA's fit_transform receive y while PCA's does not?",
    code: `pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

lda = LinearDiscriminantAnalysis(n_components=1)
X_lda = lda.fit_transform(X_scaled, y)`,
    options: ["LDA uses the class labels; PCA is unsupervised", "y tells LDA how many components to keep", "PCA reads the labels from X_scaled itself", "LDA needs y only to draw the scatter plot"],
    answer: 0,
    explanation: "LDA is supervised: it needs the labels to find the directions that separate the classes. PCA ignores labels and only looks for maximum variance in X.",
  },
  {
    id: "q8-c9", module: 8, type: "mc", kind: "code",
    prompt: "Why is random_state set in the lab's t-SNE code?",
    code: `tsne = TSNE(n_components=2, random_state=42, perplexity=30)
X_tsne = tsne.fit_transform(X_scaled)`,
    options: ["t-SNE is random; it makes the plot reproducible", "It sets how many neighbours each point considers", "It keeps 42% of the variance in the 2-D plot", "It lets t-SNE transform new data later on"],
    answer: 0,
    explanation: "t-SNE starts from a random layout, so different runs give different-looking plots. Fixing random_state gives the same plot every time. (perplexity, not random_state, relates to the neighbourhood size.)",
  },
  {
    id: "q8-o1", module: 8, type: "open", kind: "theory",
    prompt: "Explain the curse of dimensionality and two problems it causes.",
    modelAnswer: "The curse of dimensionality is the set of problems that appear as the number of features grows. The feature space expands so fast that observations become sparse, which makes patterns hard to find. Distances between points become similar, so distance-based methods such as k-NN and clustering lose power. Computation, memory and the risk of overfitting also increase.",
    keyPoints: [
      { text: "Problems that grow with the number of features; data become sparse", keywords: ["number of features", "sparse", "more features", "high-dimensional"] },
      { text: "Distances become similar: k-NN and clustering suffer", keywords: ["distance", "k-nn", "knn", "cluster"] },
      { text: "More computation/memory and a higher risk of overfitting", keywords: ["computation", "memory", "cost", "overfit", "slow"] },
    ],
  },
  {
    id: "q8-o2", module: 8, type: "open", kind: "theory",
    prompt: "Compare PCA and LDA: what does each maximize, and when would you use each one?",
    modelAnswer: "PCA is unsupervised: it ignores the labels and finds orthogonal directions of maximum variance, so it suits compression, visualization and unlabelled data. LDA is supervised: it uses the class labels to maximize class separation (between-class versus within-class spread) and can produce at most C − 1 components, so it suits preprocessing for classification. High variance does not guarantee class separation, which is why LDA often classifies better with few dimensions.",
    keyPoints: [
      { text: "PCA: unsupervised, maximum variance", keywords: ["unsupervised", "variance", "ignores the labels", "no labels"] },
      { text: "LDA: supervised, uses labels to maximize class separation", keywords: [" supervised", "uses the class labels", "uses the labels", "uses labels", "class separation", "separate the classes"] },
      { text: "LDA gives at most C − 1 components", keywords: ["c − 1", "c - 1", "c-1", "classes minus one", "minus 1"] },
      { text: "Uses: PCA for compression/visualization, LDA for classification", keywords: ["compression", "compress", "visualiz", "classification"] },
    ],
  },
  {
    id: "q8-o3", module: 8, type: "open", kind: "theory",
    prompt: "What is t-SNE used for, and why is it not used as a preprocessing step for a classifier?",
    modelAnswer: "t-SNE is a nonlinear method for visualizing high-dimensional data in 2 or 3 dimensions: it preserves local neighbourhoods, so similar observations stay close and clusters appear. It is not used before a classifier because it does not naturally transform new observations, it is slow and sensitive to perplexity and the random seed, and the distances between clusters are not meaningful.",
    keyPoints: [
      { text: "Visualization in 2D/3D", keywords: ["visualiz", "2d", "two dimensions", "plot"] },
      { text: "Preserves local neighbourhoods (nonlinear)", keywords: ["local", "neighbo", "nonlinear", "close"] },
      { text: "Cannot transform new data / slow / cluster distances not meaningful", keywords: ["new data", "new observations", "slow", "expensive", "distances", "not meaningful"] },
    ],
  },
  {
    id: "q8-o4", module: 8, type: "open", kind: "theory",
    prompt: "How do you decide how many principal components to keep?",
    modelAnswer: "Look at the explained variance ratio of each component and its cumulative sum. A scree plot shows where the curve levels off (the elbow), after which extra components add little. A common rule keeps enough components for about 95% of the variance, e.g. PCA(n_components=0.95). Finally, check the choice with the model's cross-validated performance, because high variance does not guarantee good predictions.",
    keyPoints: [
      { text: "Explained variance ratio / cumulative variance", keywords: ["explained variance", "cumulative"] },
      { text: "Scree plot elbow", keywords: ["scree", "elbow"] },
      { text: "95% variance rule", keywords: ["95"] },
      { text: "Confirm with cross-validated performance", keywords: ["cross-val", "accuracy", "performance", "validation"] },
    ],
  },
  {
    id: "q8-o5", module: 8, type: "open", kind: "code",
    prompt: "Breast cancer (2 classes), 5-fold CV with logistic regression. Why does LDA beat PCA with one dimension, and what does PCA (10) show?",
    code: `Model                          Dimensions   CV accuracy
Original (30 features) + LR        30          0.979
LDA (1) + LR                        1          0.955
PCA (1) + LR                        1          0.915
PCA (10, = 95% variance) + LR      10          0.984`,
    modelAnswer: "With one dimension, LDA (0.955) beats PCA (0.915) because LDA uses the labels to pick the direction that separates malignant from benign tumours, while PCA picks the direction of maximum variance, which still mixes the classes. Two classes allow only one LDA component (C − 1). PCA with 10 components keeps 95% of the variance and matches the original model (0.984 vs 0.979) with a third of the features, so compressing too far loses information but moderate PCA does not.",
    keyPoints: [
      { text: "LDA uses the labels: its one axis separates the classes", keywords: ["labels", " supervised", "separates"] },
      { text: "PCA's one axis is maximum variance, which still mixes the classes", keywords: ["variance", "unsupervised", "overlap", "mix"] },
      { text: "PCA (10) keeps 95% of the variance and matches the original with fewer features", keywords: ["10", "95", "matches", "third", "fewer"] },
    ],
  },
];

if (typeof module !== "undefined") module.exports = QUIZ2;
