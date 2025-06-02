import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

def prepare_regression_data(
    df,
    feature_types: dict,
    target_column: str,
    test_size: float = 0.2,
    random_state: int = 42,
    scale_numeric: bool = True
):
    """
    Prepare data for regression modeling:
    - Split into features and target
    - Encode categorical features with OrdinalEncoder
    - Scale numeric features with StandardScaler (optional)

    Returns:
    - X_train, X_test, y_train, y_test: prepared data splits
    - encoder: fitted OrdinalEncoder or None
    - scaler: fitted StandardScaler or None
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' must be in the DataFrame.")

    if not pd.api.types.is_numeric_dtype(df[target_column]):
        raise ValueError(f"Target column '{target_column}' must be numeric for regression.")

    df_copy = df.copy()

    categorical_features = [feat for feat, ftype in feature_types.items() if ftype == 'categorical']
    numeric_features = [feat for feat, ftype in feature_types.items() if ftype == 'numeric' and feat != target_column]

    X = df_copy[list(feature_types.keys())].copy()
    y = df_copy[target_column].copy()

    # Split dataset first
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    # Encode categorical features
    if categorical_features:
        encoder = OrdinalEncoder()
        X_train[categorical_features] = encoder.fit_transform(X_train[categorical_features])
        X_test[categorical_features] = encoder.transform(X_test[categorical_features])
    else:
        encoder = None

    # Scale numeric features
    if scale_numeric and numeric_features:
        scaler = StandardScaler()
        X_train[numeric_features] = scaler.fit_transform(X_train[numeric_features])
        X_test[numeric_features] = scaler.transform(X_test[numeric_features])
    else:
        scaler = None

    print(f"Data prepared: {X_train.shape[0]} training samples, {X_test.shape[0]} test samples.")
    print(f"Categorical features encoded: {categorical_features}")
    return X_train, X_test, y_train, y_test, encoder, scaler


from sklearn.linear_model import LassoCV
import pandas as pd

def select_features_lasso(X_train, y_train, feature_names=None, X_test=None, y_test=None, alpha_values=None, verbose=True):
    """
    Selects features using Lasso regression (LassoCV with cross-validation).

    Parameters:
    - X_train: training features (DataFrame or array)
    - y_train: training target (Series or array)
    - feature_names: list of feature names (optional if X_train is a DataFrame)
    - X_test, y_test: optional for evaluating R² on test set
    - alpha_values: list of alpha values for LassoCV
    - verbose: whether to print information

    Returns:
    - selected_features: list of selected feature names
    """
    if isinstance(X_train, pd.DataFrame):
        feature_names = X_train.columns.tolist()
    elif feature_names is None:
        raise ValueError("feature_names must be provided if X_train is not a DataFrame.")

    lasso = LassoCV(cv=5, random_state=0, alphas=alpha_values)
    lasso.fit(X_train, y_train)

    coef_series = pd.Series(lasso.coef_, index=feature_names)
    selected_features = coef_series[coef_series != 0].index.tolist()

    if verbose:
        print("Lasso coefficients:")
        print(coef_series)
        print("\nSelected features by Lasso:")
        print(selected_features)
        if X_test is not None and y_test is not None:
            print(f"\nR² on test set: {lasso.score(X_test, y_test):.4f}")

    return selected_features

import statsmodels.api as sm


def select_features_ols(X_train, y_train, feature_names=None, p_threshold=0.05):
    """
    Select significant features based on OLS p-values.

    Parameters:
    - X_train: DataFrame or array of training features
    - y_train: Series or array of target values
    - feature_names: list of feature names (if X_train is array)
    - p_threshold: p-value threshold for significance

    Returns:
    - significant_features: list of features with p-value <= threshold
    - ols_result: statsmodels RegressionResults object
    """
    if not isinstance(X_train, pd.DataFrame):
        if feature_names is None:
            feature_names = [f"var{i}" for i in range(X_train.shape[1])]
        X_train_df = pd.DataFrame(X_train, columns=feature_names)
    else:
        X_train_df = X_train.copy()

    # Reset index for alignment
    X_train_df = X_train_df.reset_index(drop=True)
    y_train_series = pd.Series(y_train).reset_index(drop=True)

    # Add constant term for intercept
    X_train_df = sm.add_constant(X_train_df)

    model = sm.OLS(y_train_series, X_train_df)
    result = model.fit()

    p_values = result.pvalues.drop("const", errors="ignore")
    significant_features = p_values[p_values <= p_threshold].index.tolist()

    print("P-values:")
    print(p_values)
    print("\nSignificant features (p <= {:.2f}):".format(p_threshold))
    print(significant_features)

    return significant_features, result

    """
    Selects features based on OLS p-values.

    Parameters:
    - X_train: training features (DataFrame or array)
    - y_train: training target
    - feature_names: list of feature names (optional if X_train is a DataFrame)
    - p_threshold: significance level threshold (default 0.05)
    - verbose: whether to print information

    Returns:
    - significant_features: list of features with p-value <= threshold
    """
    if isinstance(X_train, pd.DataFrame):
        feature_names = X_train.columns.tolist()
        X_df = X_train.copy()
    elif feature_names is not None:
        X_df = pd.DataFrame(X_train, columns=feature_names)
    else:
        raise ValueError("feature_names must be provided if X_train is not a DataFrame.")

    model = sm.OLS(y_train.reset_index(drop=True), X_df)
    result = model.fit()

    p_values = result.pvalues
    significant_features = p_values[p_values <= p_threshold].index.tolist()

    if verbose:
        print("P-values:")
        print(p_values)
        print(f"\nFeatures with p > {p_threshold}:")
        print(p_values[p_values > p_threshold].index.tolist())
        print(f"\nSignificant features (p <= {p_threshold}):")
        print(significant_features)

    return significant_features
