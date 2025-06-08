from typing import Any, Dict, Tuple,Type
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, create_model
import pandas as pd
import joblib
import boto3
import json
from io import BytesIO

# Inicializar app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Para modelo de regresión
class RegressionData(BaseModel):
    maquina: str
    seccion: str
    proceso: str
    usuario: str
    fabricadas: int
    turno: str

# Para modelo de clasificación
class ClassificationData(BaseModel):
    fabricadas: int
    referencia: str
    maquina: str
    proceso: str

# Función para leer archivos desde S3
def load_from_s3(bucket: str, key: str):
    s3 = boto3.client("s3")
    response = s3.get_object(Bucket=bucket, Key=key)
    return response["Body"].read()

# Datos del bucket y configuración
BUCKET_NAME = "proyectointegrador2025"
CONFIG_KEY = "models/config/config.json"

regression_model = None
classification_model = None
features_regression: Dict[str, Type] = {}
features_classification: Dict[str, Type] = {}

RegressionData = None
ClassificationData = None

# Mapeo simple de string a tipos de Python/Pydantic
type_mapping = {
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
}

def parse_features(features_dict: Dict[str, str]) -> Dict[str, Tuple[Type[Any], ...]]:
    """
    Convierte el dict {feature_name: 'type_str'} a
    dict {feature_name: (Type, default_value)} para create_model
    """
    parsed = {}
    for feature_name, type_str in features_dict.items():
        pydantic_type = type_mapping.get(type_str.lower(), str)
        parsed[feature_name] = (pydantic_type, ...)
    return parsed

def load_models_and_generate_schemas():
    global regression_model, classification_model
    global features_regression, features_classification
    global RegressionData, ClassificationData

    config_data = json.loads(load_from_s3(BUCKET_NAME, CONFIG_KEY))

    regression_model = joblib.load(BytesIO(load_from_s3(BUCKET_NAME, config_data["regression_model"]["path"])))
    classification_model = joblib.load(BytesIO(load_from_s3(BUCKET_NAME, config_data["classification_model"]["path"])))

    features_regression = config_data["regression_model"]["features"]
    features_classification = config_data["classification_model"]["features"]

    regression_fields = parse_features(features_regression)
    classification_fields = parse_features(features_classification)

    RegressionData = create_model("RegressionData", **regression_fields)
    ClassificationData = create_model("ClassificationData", **classification_fields)

    return RegressionData, ClassificationData

# Initial load
RegressionData, ClassificationData = load_models_and_generate_schemas()

# Endpoint de predicción
@app.post("/predict-regression")
def predict_regression(data: RegressionData):
    df = pd.DataFrame([data.model_dump()])
    prediction = regression_model.predict(df)[0]
    return {"duration_minutes": round(prediction, 2)}

@app.post("/predict-classification")
def predict_classification(data: ClassificationData):
    df = pd.DataFrame([data.model_dump()])
    original_classes = classification_model["target_encoder"]
    pipeline = classification_model["pipeline"]
    predicted_class = pipeline.predict(df)[0]
    if(original_classes is not None):
        decoded_predicted_class = original_classes.inverse_transform(predicted_class.reshape(-1,-1))
    else:
        decoded_predicted_class = predicted_class
    probabilities = max(pipeline.predict_proba(df)[0])
    return {"classification": str(decoded_predicted_class),"probabilty":float(probabilities)}

@app.post("/reload-models")
def reload_models():
    global RegressionData, ClassificationData
    RegressionData, ClassificationData = load_models_and_generate_schemas()
    return {"status": "ok", "message": "Models, schemas and config reloaded successfully."}
