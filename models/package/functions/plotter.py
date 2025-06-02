import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

def plot_cv_metric_distribution(all_grid_results, metric_name="rmse", maximize=False):
    """
    Plot distribution of a CV metric per model with annotations of best and worst params,
    only if the model has hyperparameters.

    Parameters:
    - all_grid_results: list of pd.DataFrame
        Each DataFrame is a GridSearchCV cv_results_ with a 'Model' column indicating model name.
    - metric_name: str
        Name of the metric to plot (used for labeling). Must be related to mean_test_score.
    - maximize: bool
        If True, metric is maximized (e.g. R2 score). If False, metric is minimized (e.g. RMSE).

    Returns:
    - cv_scores_df: pd.DataFrame
        Concatenated DataFrame with the metric computed.
    """
    # Concatenate all results
    cv_scores_df = pd.concat(all_grid_results, ignore_index=True)

    # Compute metric values:
    if maximize:
        cv_scores_df[metric_name] = cv_scores_df["mean_test_score"]
    else:
        cv_scores_df[metric_name] = -cv_scores_df["mean_test_score"]

    plt.figure(figsize=(12, 6))
    sns.stripplot(data=cv_scores_df, x=metric_name, y="Model", jitter=True, alpha=0.5)
    plt.xlabel(f"{metric_name.upper()} (Cross-Validation)")
    plt.title(f"Distribution of {metric_name.upper()} by Model")

    for model in cv_scores_df["Model"].unique():
        df_model = cv_scores_df[cv_scores_df["Model"] == model]

        if maximize:
            best_idx = df_model[metric_name].idxmax()
            worst_idx = df_model[metric_name].idxmin()
        else:
            best_idx = df_model[metric_name].idxmin()
            worst_idx = df_model[metric_name].idxmax()

        best_row = df_model.loc[best_idx]
        worst_row = df_model.loc[worst_idx]

        # Check if params exist and are not empty dict
        if best_row["params"] and best_row["params"] != {}:
            plt.annotate(
                f"Best: {best_row['params']}",
                xy=(best_row[metric_name], model),
                textcoords='offset points',
                xytext=(0, 15),
                ha='center',
                fontsize=7,
                color='green',
                arrowprops=dict(arrowstyle="->", color='green', lw=0.8)
            )

        if worst_row["params"] and worst_row["params"] != {}:
            plt.annotate(
                f"Worst: {worst_row['params']}",
                xy=(worst_row[metric_name], model),
                textcoords='offset points',
                xytext=(0, -20),
                ha='center',
                fontsize=7,
                color='red',
                arrowprops=dict(arrowstyle="->", color='red', lw=0.8)
            )

    plt.tight_layout()
    plt.show()

    return cv_scores_df

def plot_best_metric_per_model(all_grid_results, metric='mean_test_score', maximize=False):
    """
    Plot best metric per model from GridSearchCV results.

    Parameters:
    - all_grid_results: list of pd.DataFrame with GridSearchCV cv_results_ and 'Model' column
    - metric: str, metric column to use from cv_results_ (e.g., 'mean_test_score')
    - maximize: bool, True if metric is better when higher, False if lower

    Returns:
    - best_metric_df: pd.DataFrame with best metric row per model
    """

    # Concatenate all results
    cv_scores_df = pd.concat(all_grid_results, ignore_index=True)

    # Adjust metric sign if needed (neg metrics like neg_root_mean_squared_error)
    if not maximize:
        cv_scores_df['metric_val'] = -cv_scores_df[metric]
    else:
        cv_scores_df['metric_val'] = cv_scores_df[metric]

    # Get index of best metric per model
    idx_best = cv_scores_df.groupby('Model')['metric_val'].idxmax() if maximize else cv_scores_df.groupby('Model')['metric_val'].idxmin()

    best_metric_df = cv_scores_df.loc[idx_best].copy()

    plt.figure(figsize=(10, 6))
    sns.barplot(
        data=best_metric_df,
        x='metric_val',
        y='Model',
        hue='Model',  # to avoid seaborn palette warning
        palette='viridis',
        dodge=False,
        errorbar=None,
        legend=False
    )

    plt.xlabel(metric.upper())
    plt.ylabel("Model")
    plt.title(f"Best {metric.upper()} per Model")
    plt.tight_layout()
    plt.show()

    return best_metric_df
