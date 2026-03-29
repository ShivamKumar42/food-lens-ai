"""Model loading and inference logic. Swap models here without changing routes."""
import os
import numpy as np
from tensorflow.keras.models import load_model
from app.preprocess import preprocess_image

MODEL_PATH = os.getenv("MODEL_PATH", "models/MobileNet_V2.h5")

FOOD_CLASSES = [
    "Baked Potato", "Burger", "Butter Naan", "Chai", "Chapati",
    "Chole Bhature", "Dal Makhani", "Dhokla", "Fried Rice", "Idli",
    "Jalebi", "Kaathi Rolls", "Kadai Paneer", "Kulfi", "Masala Dosa",
    "Momos", "Paani Puri", "Pakode", "Pav Bhaji", "Pizza",
    "Samosa", "Sushi",
]

_model = None

def load_classifier():
    global _model
    _model = load_model(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")
    return _model

def predict(model, image_bytes: bytes) -> list[dict]:
    tensor = preprocess_image(image_bytes)
    preds = model.predict(tensor, verbose=0)[0]
    top_indices = np.argsort(preds)[::-1][:5]
    return [
        {"label": FOOD_CLASSES[i], "confidence": round(float(preds[i]), 4)}
        for i in top_indices
    ]
