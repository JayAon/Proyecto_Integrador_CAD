import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler
from sklearn.linear_model import LassoCV
import statsmodels.api as sm
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
    - Add constant: Adds a constant to the dataset (optional)
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
        encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
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
def prepare_classification_data(
    df,
    feature_types: dict,
    target_column: str,
    test_size: float = 0.2,
    random_state: int = 42,
    scale_numeric: bool = True,
    stratify:bool= True
):
    """
    Prepare data for classification modeling:
    - Split into features and target
    - Encode categorical features with OrdinalEncoder
    - Encode target variable with OrdinalEncoder if categorical
    - Scale numeric features with StandardScaler (optional)
    - Stratify bool

    Returns:
    - X_train, X_test, y_train, y_test: prepared data splits (arrays)
    - encoder_X: fitted OrdinalEncoder for X categorical features or None
    - encoder_y: fitted OrdinalEncoder for y or None
    - scaler: fitted StandardScaler or None
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' must be in the DataFrame.")

    df_copy = df.copy()

    categorical_features = [feat for feat, ftype in feature_types.items() if ftype == 'categorical' and feat != target_column]
    numeric_features = [feat for feat, ftype in feature_types.items() if ftype == 'numeric' and feat != target_column]

    X = df_copy[list(feature_types.keys())].copy()
    if target_column in X.columns:
        X = X.drop(columns=[target_column]) # Ensure target is not in features
    y = df_copy[target_column].copy()

    # Split dataset
    if(stratify):
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

    # Encode categorical features in X
    if categorical_features:
        encoder_X = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
        X_train[categorical_features] = encoder_X.fit_transform(X_train[categorical_features])
        X_test[categorical_features] = encoder_X.transform(X_test[categorical_features])
    else:
        encoder_X = None

    # Encode target variable y if categorical (non-numeric)
    if not pd.api.types.is_numeric_dtype(y):
        encoder_y = OrdinalEncoder()
        # OrdinalEncoder expects 2D array for y, reshape:
        y_train_enc = encoder_y.fit_transform(y_train.values.reshape(-1,1)).ravel()
        y_test_enc = encoder_y.transform(y_test.values.reshape(-1,1)).ravel()
    else:
        encoder_y = None
        y_train_enc = y_train.values
        y_test_enc = y_test.values

    # Scale numeric features in X
    if scale_numeric and numeric_features:
        scaler = StandardScaler()
        X_train[numeric_features] = scaler.fit_transform(X_train[numeric_features])
        X_test[numeric_features] = scaler.transform(X_test[numeric_features])
    else:
        scaler = None

    print(f"Data prepared: {X_train.shape[0]} training samples, {X_test.shape[0]} test samples.")
    print(f"Categorical features encoded: {categorical_features}")
    if encoder_y is not None:
        print("Target variable encoded.")

    return X_train, X_test, y_train_enc, y_test_enc, encoder_X, encoder_y, scaler
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
def select_features_ols(X_train, y_train, feature_names=None, p_threshold=0.05,constant = True):
    
    """
    Select significant features based on OLS p-values.

    Parameters:
    - X_train: DataFrame or array of training features
    - y_train: Series or array of target values
    - feature_names: list of feature names (if X_train is array)
    - p_threshold: p-value threshold for significance
    - Constant: bool - Add the constant to the OLS model

    Returns:
    - significant_features: list of features with p-value <= threshold without the const
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
    if(constant):
        X_train_df = sm.add_constant(X_train_df)

    model = sm.OLS(y_train_series, X_train_df)
    result = model.fit()

    p_values = result.pvalues.drop("const", errors='ignore')
    significant_features = p_values[p_values <= p_threshold].index.tolist()

    print("P-values:")
    print(p_values)
    print("\nSignificant features (p <= {:.2f}):".format(p_threshold))
    print(significant_features)

    return significant_features, result
def select_features_logistic(X_train, y_train, feature_names=None, p_threshold=0.05):
    """
    Select significant features based on Logistic Regression p-values.

    Parameters:
    - X_train: array or DataFrame of training features
    - y_train: array or Series of target binary/categorical variable (already codificada numéricamente)
    - feature_names: list of feature names (if X_train is array)
    - p_threshold: p-value threshold for significance

    Returns:
    - significant_features: list of features with p-value <= threshold
    - logit_result: statsmodels LogitResults object
    """
    # Si X_train es array, pasarlo a DataFrame con nombres de columnas
    if not isinstance(X_train, pd.DataFrame):
        if feature_names is None:
            feature_names = [f"var{i}" for i in range(X_train.shape[1])]
        X_train_df = pd.DataFrame(X_train, columns=feature_names)
    else:
        X_train_df = X_train.copy()

    y_train_series = pd.Series(y_train).reset_index(drop=True)
    X_train_df = X_train_df.reset_index(drop=True)

    # Añadir constante para el intercepto
    X_train_df = sm.add_constant(X_train_df)

    # Ajustar modelo logístico
    model = sm.Logit(y_train_series, X_train_df)
    result = model.fit(disp=False)

    # Obtener p-values y filtrar por p_threshold
    p_values = result.pvalues.drop("const", errors="ignore")
    significant_features = p_values[p_values <= p_threshold].index.tolist()

    print("Logistic Regression p-values:")
    print(p_values)
    print(f"\nSignificant features (p <= {p_threshold}):")
    print(significant_features)

    return significant_features, result

def select_features_multinomial_logit(X_train, y_train, feature_names=None, p_threshold=0.05):
    """
    Selecciona variables significativas basado en el test de p-values en MNLogit.

    Parámetros:
    - X_train: DataFrame o array de variables predictoras
    - y_train: Series o array con variable objetivo multiclase
    - feature_names: lista de nombres de columnas (si X_train es array)
    - p_threshold: umbral de p-valor para seleccionar

    Retorna:
    - significant_features: lista de variables con p-value bajo threshold en al menos una clase
    - result: objeto de resultados de MNLogit
    """

    if not isinstance(X_train, pd.DataFrame):
        if feature_names is None:
            feature_names = [f"var{i}" for i in range(X_train.shape[1])]
        X_train_df = pd.DataFrame(X_train, columns=feature_names)
    else:
        X_train_df = X_train.copy()

    y_train_series = pd.Series(y_train).reset_index(drop=True)
    X_train_df = X_train_df.reset_index(drop=True)

    # Añadir constante
    X_train_df = sm.add_constant(X_train_df)

    model = sm.MNLogit(y_train_series, X_train_df)
    result = model.fit(disp=False)

    # pvalues es DataFrame con columnas = clases, filas = variables
    pvalues = result.pvalues.drop("const", errors="ignore")

    # Queremos las variables con p-value <= threshold en al menos una clase
    mask = (pvalues <= p_threshold).any(axis=1)
    significant_features = pvalues.index[mask].tolist()

    print("P-values por variable y clase:")
    print(pvalues)
    print("\nVariables significativas (p <= {:.2f} en al menos una clase):".format(p_threshold))
    print(significant_features)

    return significant_features, result

# Supongamos que tu DataFrame es df y tiene columnas 'maquina', 'turno' y 'duracion_min'

def detectar_anomalias_duracion(df, grouped_columns=['maquina', 'turno'], duration_column_name='duracion_min', low_pct=0.05, high_pct=0.95,anomalies_column='anomalía_duracion'):
    # Calcular percentiles 5 y 95 para cada grupo
    percentiles = df.groupby(grouped_columns)[duration_column_name].quantile([low_pct, high_pct]).unstack(level=-1)
    percentiles.columns = ['pct_low', 'pct_high']
    percentiles = percentiles.reset_index()

    # Unir percentiles al DataFrame original
    df = df.merge(percentiles, on=grouped_columns, how='left')

    # Definir anomalia si duracion < pct_low o > pct_high
    df[anomalies_column] = (df[duration_column_name] < df['pct_low']) | (df[duration_column_name] > df['pct_high'])

    return df






    """
    Select significant features based on logistic regression p-values (Logit).

    Parameters:
    - X_train: DataFrame or array of training features
    - y_train: Series or array of target binary values (0/1)
    - feature_names: list of feature names (if X_train is array)
    - p_threshold: p-value threshold for significance
    - verbose: whether to print info

    Returns:
    - significant_features: list of features with p-value <= threshold
    - logistic_result: statsmodels LogitResults object
    """
    if not isinstance(X_train, pd.DataFrame):
        if feature_names is None:
            feature_names = [f"var{i}" for i in range(X_train.shape[1])]
        X_train_df = pd.DataFrame(X_train, columns=feature_names)
    else:
        X_train_df = X_train.copy()
        feature_names = X_train_df.columns.tolist()

    # Reset index for alignment
    X_train_df = X_train_df.reset_index(drop=True)
    y_train_series = pd.Series(y_train).reset_index(drop=True)

    # Add constant intercept column
    X_train_df = sm.add_constant(X_train_df)

    # Convert to numpy arrays of float64
    X_train_np = X_train_df.to_numpy(dtype=np.float64)
    y_train_np = y_train_series.to_numpy(dtype=np.float64)

    # Fit logistic regression
    model = sm.Logit(y_train_np, X_train_np)
    result = model.fit(disp=0)  # disp=0 to suppress output

    # p-values, dropping intercept
    p_values = pd.Series(result.pvalues, index=['const'] + feature_names).drop('const')

    significant_features = p_values[p_values <= p_threshold].index.tolist()

    if verbose:
        print("P-values:")
        print(p_values)
        print(f"\nSignificant features (p <= {p_threshold}):")
        print(significant_features)

    return significant_features, result

    """
    Select significant features based on logistic regression p-values.

    Parameters:
    - X_train: DataFrame or array of training features
    - y_train: Series or array of binary target values (0/1)
    - feature_names: list of feature names (if X_train is array)
    - p_threshold: p-value threshold for significance

    Returns:
    - significant_features: list of features with p-value <= threshold
    - logistic_result: statsmodels LogitResults object
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

    model = sm.Logit(y_train_series, X_train_df)
    result = model.fit()

    p_values = result.pvalues.drop("const", errors="ignore")
    significant_features = p_values[p_values <= p_threshold].index.tolist()

    print("P-values:")
    print(p_values)
    print("\nSignificant features (p <= {:.2f}):".format(p_threshold))
    print(significant_features)

    return significant_features, result