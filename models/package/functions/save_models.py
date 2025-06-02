import os
import joblib
from sklearn.pipeline import Pipeline

def save_pipeline_models(encoder, scaler, best_models: dict, output_dir="model_pipelines"):
    """
    Crea y guarda un pipeline por cada modelo en best_models.

    Parámetros:
    - encoder: transformador ya entrenado (por ejemplo OneHotEncoder)
    - scaler: transformador ya entrenado (por ejemplo StandardScaler)
    - best_models: dict con estructura {nombre_modelo: modelo_entrenado}
    - output_dir: directorio donde se guardarán los pipelines (.joblib)
    """
    os.makedirs(output_dir, exist_ok=True)

    for name, model in best_models.items():
        pipeline = Pipeline(steps=[
            ("encoder", encoder),
            ("scaler", scaler),
            ("regressor", model)
        ])

        path = os.path.join(output_dir, f"{name}_pipeline.joblib")
        joblib.dump(pipeline, path)
        print(f"Guardado: {path}")


import os
import joblib
from sklearn.pipeline import Pipeline

def save_pipeline_models_categorical_y(encoder_X, encoder_y, scaler, best_models: dict, output_dir="model_pipelines"):
    """
    Crea y guarda un pipeline por cada modelo en best_models, incluyendo
    encoder de X, scaler y el encoder de y (como objeto aparte en el diccionario).

    Parámetros:
    - encoder_X: transformador ya entrenado para features (por ejemplo OrdinalEncoder)
    - encoder_y: transformador ya entrenado para variable objetivo (por ejemplo OrdinalEncoder)
    - scaler: transformador ya entrenado para features numéricos (por ejemplo StandardScaler)
    - best_models: dict con estructura {nombre_modelo: modelo_entrenado}
    - output_dir: directorio donde se guardarán los pipelines (.joblib)
    """
    os.makedirs(output_dir, exist_ok=True)

    for name, model in best_models.items():
        pipeline = Pipeline(steps=[
            ("encoder", encoder_X),
            ("scaler", scaler),
            ("regressor", model)
        ])

        # Guardamos pipeline junto con encoder_y en un dict
        pipeline_with_target_encoder = {
            "pipeline": pipeline,
            "target_encoder": encoder_y
        }

        path = os.path.join(output_dir, f"{name}_pipeline.joblib")
        joblib.dump(pipeline_with_target_encoder, path)
        print(f"Guardado: {path}")
