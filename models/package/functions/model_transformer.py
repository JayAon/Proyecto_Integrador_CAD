from sklearn.base import BaseEstimator, TransformerMixin
import numpy as np
import pandas as pd

class CustomPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, encoder, scaler, features):
        self.encoder = encoder
        self.scaler = scaler
        self.features = features
        self.cat_cols = [col for col, t in features.items() if t == 'categorical']
        self.num_cols = [col for col, t in features.items() if t == 'numeric']

    def fit(self, X, y=None):
        # No fit porque los transformadores ya están entrenados
        return self

    def transform(self, X):
        X = pd.DataFrame(X).copy()
        # Asegurarse que las columnas existen y estén en el orden correcto
        X_cat = X[self.cat_cols]
        X_num = X[self.num_cols]

        X_cat_enc = self.encoder.transform(X_cat)
        X_num_scaled = self.scaler.transform(X_num)
        
        
        X_cat_enc_df = pd.DataFrame(X_cat_enc, columns=self.cat_cols, index=X.index)
        X_num_scaled_df = pd.DataFrame(X_num_scaled, columns=self.num_cols, index=X.index)
        
        X_transformed_df = pd.concat([X_cat_enc_df, X_num_scaled_df], axis=1)

        # Reordenar columnas según el orden de features.keys()
        X_transformed = X_transformed_df[list(self.features.keys())].to_numpy()
        return X_transformed
