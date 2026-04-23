"""Model loading and inference logic. Swap models here without changing routes."""
import os
import shutil
from pathlib import Path
import numpy as np
from tensorflow.keras.models import load_model
from app.preprocess import preprocess_image

MODEL_FILENAME = "MobileNet_V2.h5"
BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
DEFAULT_MODELS_DIR = BACKEND_DIR / "models"

FOOD_CLASSES = [
    "Baked Potato", "Burger", "Butter Naan", "Chai", "Chapati",
    "Chole Bhature", "Dal Makhani", "Dhokla", "Fried Rice", "Idli",
    "Jalebi", "Kaathi Rolls", "Kadai Paneer", "Kulfi", "Masala Dosa",
    "Momos", "Paani Puri", "Pakode", "Pav Bhaji", "Pizza",
    "Samosa", "Sushi",
]

_model = None


def _discover_model_path() -> Path:
    """Locate the model file. Env var MODEL_PATH overrides auto-discovery."""
    env_path = os.getenv("MODEL_PATH")
    if env_path:
        p = Path(env_path)
        if not p.is_absolute():
            p = (PROJECT_ROOT / p).resolve()
        if p.is_file():
            print(f"Model found at {p} (from MODEL_PATH)")
            return p
        raise FileNotFoundError(
            f"MODEL_PATH is set to '{env_path}' but no file exists there."
        )

    # Search the project for the model file, ignoring noisy directories.
    skip_dirs = {"node_modules", ".git", "dist", "build", ".venv", "venv", "__pycache__"}
    candidates: list[Path] = []
    for root, dirs, files in os.walk(PROJECT_ROOT):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for fname in files:
            if fname == MODEL_FILENAME:
                candidates.append(Path(root) / fname)

    if not candidates:
        # Fallback: any .h5 file in the project.
        for root, dirs, files in os.walk(PROJECT_ROOT):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for fname in files:
                if fname.endswith(".h5"):
                    candidates.append(Path(root) / fname)

    if not candidates:
        raise FileNotFoundError(
            f"{MODEL_FILENAME} not found. Please add the model file anywhere in the project."
        )

    # Prefer one already inside backend/models/.
    preferred = next(
        (c for c in candidates if DEFAULT_MODELS_DIR.resolve() in c.resolve().parents),
        None,
    )
    chosen = preferred or candidates[0]
    print(f"Model found at {chosen.resolve()}")

    # Ensure a copy lives inside backend/models/.
    DEFAULT_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    target = DEFAULT_MODELS_DIR / MODEL_FILENAME
    if chosen.resolve() != target.resolve():
        shutil.copy2(chosen, target)
        print("Model copied to backend/models/")
        return target.resolve()
    return chosen.resolve()


def load_classifier():
    global _model
    model_path = _discover_model_path()
    _model = load_model(str(model_path))
    print(f"Model loaded from {model_path}")
    return _model

def predict(model, image_bytes: bytes) -> list[dict]:
    tensor = preprocess_image(image_bytes)
    preds = model.predict(tensor, verbose=0)[0]
    top_indices = np.argsort(preds)[::-1][:5]
    return [
        {"label": FOOD_CLASSES[i], "confidence": round(float(preds[i]), 4)}
        for i in top_indices
    ]
