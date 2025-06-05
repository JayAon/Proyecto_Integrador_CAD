import os
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

import os
import joblib
from sklearn.pipeline import Pipeline

def save_pipeline_models(preprocessor, best_models: dict, output_dir="model_pipelines"):
    """
    Guarda un pipeline por cada modelo en best_models,
    usando el preprocesador ya armado.

    Parámetros:
    - preprocessor: transformador que incluye encoder + scaler ya configurados y entrenados
    - best_models: dict con estructura {nombre_modelo: modelo_entrenado}
    - output_dir: directorio donde se guardarán los pipelines (.joblib)
    """

    os.makedirs(output_dir, exist_ok=True)

    for name, model in best_models.items():
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])

        path = os.path.join(output_dir, f"{name}_pipeline.joblib")
        joblib.dump(pipeline, path)
        print(f"Guardado pipeline: {path}")


def save_pipeline_models_categorical_y(preprocessor, encoder_y, best_models: dict, output_dir="model_pipelines"):
    """
    Crea y guarda un pipeline por cada modelo en best_models, incluyendo
    un preprocesador completo (encoder + scaler) y el encoder de y (como objeto aparte en el diccionario).

    Parámetros:
    - preprocessor: transformador ya entrenado para features (encoder + scaler integrado)
    - encoder_y: transformador ya entrenado para variable objetivo (por ejemplo OrdinalEncoder)
    - best_models: dict con estructura {nombre_modelo: modelo_entrenado}
    - output_dir: directorio donde se guardarán los pipelines (.joblib)
    """
    os.makedirs(output_dir, exist_ok=True)

    for name, model in best_models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
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
