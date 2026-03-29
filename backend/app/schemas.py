from pydantic import BaseModel

class PredictionItem(BaseModel):
    label: str
    confidence: float

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    top_k: list[PredictionItem]
    inference_time_ms: int
