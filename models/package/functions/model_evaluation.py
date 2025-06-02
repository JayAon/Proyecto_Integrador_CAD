import time
import pandas as pd
from sklearn.model_selection import GridSearchCV, cross_val_predict
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, root_mean_squared_error


def evaluate_regression_models(
    models: dict,
    X_train,
    y_train,
    X_test=None,
    y_test=None,
    scoring: str = "neg_root_mean_squared_error",
    cv: int = 5
):
    """
    Evaluate multiple regression models using GridSearchCV and cross-validation metrics.
    Optionally evaluate on test set.

    Parameters:
    - models: dict with structure {model_name: {"model": estimator, "params": grid_params}}
    - X_train: training features
    - y_train: training target
    - X_test: optional, test features
    - y_test: optional, test target
    - scoring: scoring method for GridSearchCV
    - cv: number of cross-validation folds

    Returns:
    - tuned_results: dict with best models and metrics (train CV and test if provided)
    - summary_metrics: DataFrame summarizing metrics for all models
    - all_grid_results: DataFrame with full grid search results
    - best_models: dict with best estimators per model_name
    """

    tuned_results = {}
    all_grid_results = []
    best_models = {}

    for name, config in models.items():
        print(f"Evaluating: {name}")
        start_time = time.time()

        grid = GridSearchCV(
            estimator=config["model"],
            param_grid=config["params"],
            cv=cv,
            scoring=scoring,
            n_jobs=-1
        )

        grid.fit(X_train, y_train)
        best_model = grid.best_estimator_
        training_time = time.time() - start_time

        # CV predictions on training set
        y_pred_cv = cross_val_predict(best_model, X_train, y_train, cv=cv)

        # Metrics on training CV
        rmse_cv = root_mean_squared_error(y_train, y_pred_cv)
        mae_cv = mean_absolute_error(y_train, y_pred_cv)
        r2_cv = r2_score(y_train, y_pred_cv)

        # Metrics on test set (if provided)
        if X_test is not None and y_test is not None:
            y_pred_test = best_model.predict(X_test)
            rmse_test = root_mean_squared_error(y_test, y_pred_test)
            mae_test = mean_absolute_error(y_test, y_pred_test)
            r2_test = r2_score(y_test, y_pred_test)
        else:
            rmse_test = mae_test = r2_test = None

        result_metrics = {
            "Best Model": best_model,
            "Best Params": grid.best_params_,
            "RMSE CV": rmse_cv,
            "MAE CV": mae_cv,
            "R2 CV": r2_cv,
            "RMSE Test": rmse_test,
            "MAE Test": mae_test,
            "R2 Test": r2_test,
            "Training Time (s)": training_time
        }

        tuned_results[name] = result_metrics
        best_models[name] = best_model

        print(pd.Series(result_metrics).drop("Best Model"))
        print("\n" + "=" * 50 + "\n")

        grid_df = pd.DataFrame(grid.cv_results_)
        grid_df["Model"] = name
        all_grid_results.append(grid_df)

    summary_metrics = pd.DataFrame({
        name: {k: v for k, v in res.items() if k != "Best Model"} for name, res in tuned_results.items()
    }).T

    return tuned_results, summary_metrics, pd.concat(all_grid_results, ignore_index=True), best_models