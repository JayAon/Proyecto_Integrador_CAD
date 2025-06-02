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
