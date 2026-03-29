"""
FoodAI Backend — FastAPI server for food classification inference.

Deploy to Render / Railway / HuggingFace Spaces.
Set environment variable MODEL_PATH to point to your .h5 model file.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.model import load_classifier, predict as model_predict
from app.schemas import PredictionResponse
import time

classifier = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier
    classifier = load_classifier()
    yield

app = FastAPI(title="FoodAI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": classifier is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported file type. Use JPEG, PNG, or WEBP.")

    image_bytes = await file.read()
    start = time.perf_counter()
    result = model_predict(classifier, image_bytes)
    elapsed_ms = round((time.perf_counter() - start) * 1000)

    return PredictionResponse(
        prediction=result[0]["label"],
        confidence=result[0]["confidence"],
        top_k=result[:3],
        inference_time_ms=elapsed_ms,
    )
