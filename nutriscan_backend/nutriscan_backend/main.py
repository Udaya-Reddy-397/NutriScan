"""
NutriScan Backend API
--------------------
FastAPI service that loads a trained food classification model (.keras)
and returns dish name + nutrition data in the exact format expected
by the NutriScan frontend.

Endpoints:
  GET  /health
  GET  /classes
  POST /predict   (multipart image upload)

Place your trained files here before starting:
  model/food_model.keras
  model/class_indices.json
"""

from contextlib import asynccontextmanager
import io
import json
import logging
import os
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd

# ----------------------------------------------------------------------
# Logging
# ----------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nutriscan")

# ----------------------------------------------------------------------
# Paths
# ----------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "food_model.keras"
CLASS_INDICES_PATH = BASE_DIR / "model" / "class_indices.json"
NUTRITION_PATH = BASE_DIR / "data" / "nutrition.csv"

IMG_SIZE = (224, 224)   # Must match the size used during training

# ----------------------------------------------------------------------
# Load resources once at startup via lifespan
# ----------------------------------------------------------------------
model = None
idx_to_class = {}
nutrition_df = None


@asynccontextmanager
async def lifespan(app):
    """Load ML model and data on startup, clean up on shutdown."""
    global model, idx_to_class, nutrition_df

    # ---- Model ----
    if not MODEL_PATH.exists():
        logger.warning(
            f"Model file not found at {MODEL_PATH}. "
            "API will start but /predict will return 503 until you place the .keras file."
        )
        model = None
    else:
        try:
            model = tf.keras.models.load_model(str(MODEL_PATH))
            logger.info(f"Model loaded from {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            model = None

    # ---- Class indices ----
    if CLASS_INDICES_PATH.exists():
        with open(CLASS_INDICES_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
        # Support both {"0": "samosa"} and {"samosa": 0} formats
        if all(str(k).isdigit() for k in raw.keys()):
            idx_to_class = {int(k): v for k, v in raw.items()}
        else:
            idx_to_class = {int(v): k for k, v in raw.items()}
        logger.info(f"Loaded {len(idx_to_class)} classes")
    else:
        logger.warning(f"class_indices.json not found at {CLASS_INDICES_PATH}")
        idx_to_class = {}

    # ---- Nutrition table ----
    if NUTRITION_PATH.exists():
        nutrition_df = pd.read_csv(NUTRITION_PATH)
        nutrition_df["class_name"] = (
            nutrition_df["class_name"].astype(str).str.lower().str.strip()
        )
        logger.info(f"Nutrition table loaded ({len(nutrition_df)} rows)")
    else:
        logger.warning(f"nutrition.csv not found at {NUTRITION_PATH}")
        nutrition_df = pd.DataFrame()

    yield  # App runs here

    # Cleanup (if needed)
    logger.info("Shutting down NutriScan API")


# ----------------------------------------------------------------------
# App & CORS
# ----------------------------------------------------------------------
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

app = FastAPI(
    title="NutriScan API",
    description="Food image classification + nutrition lookup for NutriScan frontend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ----------------------------------------------------------------------
# Pydantic response models (exactly what the frontend expects)
# ----------------------------------------------------------------------
class Nutrition(BaseModel):
    calories: float = Field(..., description="Total calories (kcal)")
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    serving_size_g: float


class PredictionItem(BaseModel):
    class_name: str
    confidence: float
    display_name: str


class PredictResponse(BaseModel):
    success: bool
    dish_name: str
    confidence: float
    ingredients: List[str]
    nutrition: Nutrition
    top_3: List[PredictionItem]
    message: Optional[str] = None
    note: str = (
        "Nutrition values are for a typical serving. "
        "Actual calories depend on portion size."
    )


# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Resize to match training size. EfficientNetB0 handles its own normalization internally."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32)   # 0-255 range — EfficientNet normalizes internally
    return np.expand_dims(arr, axis=0)


def get_nutrition(class_name: str) -> dict:
    """Lookup nutrition row. Falls back to 'unknown' if missing."""
    if nutrition_df is None or nutrition_df.empty:
        return {
            "calories": 0.0,
            "protein_g": 0.0,
            "carbs_g": 0.0,
            "fat_g": 0.0,
            "fiber_g": 0.0,
            "serving_size_g": 100.0,
            "ingredients": "unknown",
        }

    key = class_name.lower().strip().replace(" ", "_")
    row = nutrition_df[nutrition_df["class_name"] == key]

    if row.empty:
        # try without underscores
        key2 = key.replace("_", " ")
        row = nutrition_df[nutrition_df["class_name"] == key2]

    if row.empty:
        row = nutrition_df[nutrition_df["class_name"] == "unknown"]

    if row.empty:
        return {
            "calories": 250.0,
            "protein_g": 10.0,
            "carbs_g": 30.0,
            "fat_g": 10.0,
            "fiber_g": 3.0,
            "serving_size_g": 200.0,
            "ingredients": "mixed ingredients",
        }

    r = row.iloc[0]
    return {
        "calories": float(r["calories"]),
        "protein_g": float(r["protein_g"]),
        "carbs_g": float(r["carbs_g"]),
        "fat_g": float(r["fat_g"]),
        "fiber_g": float(r["fiber_g"]),
        "serving_size_g": float(r["serving_size_g"]),
        "ingredients": str(r["ingredients"]),
    }


def make_message(nutrition: dict) -> str:
    """Simple coaching message based on macros (matches UI style)."""
    p = nutrition["protein_g"]
    c = nutrition["calories"]
    f = nutrition["fiber_g"]

    if p >= 25 and c < 500 and f >= 4:
        return "Great fit for your goal — high protein, moderate calories and plenty of fibre."
    if c > 650:
        return "This is a higher-calorie dish. Consider a smaller portion or balance with vegetables."
    if p >= 20:
        return "Good protein content. Pair with some fibre-rich sides for a balanced meal."
    if f >= 6:
        return "Nice fibre content — helps keep you full longer."
    return "Logged successfully. Keep tracking for better insights."


def pretty_name(class_name: str) -> str:
    return class_name.replace("_", " ").title()


# ----------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "classes_loaded": len(idx_to_class),
        "nutrition_rows": 0 if nutrition_df is None else len(nutrition_df),
    }


@app.get("/classes")
def list_classes():
    classes = [pretty_name(v) for v in idx_to_class.values()]
    return {"count": len(classes), "classes": sorted(classes)}


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    # ---- Validation ----
    allowed = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG or WebP images are allowed",
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(contents) > 8 * 1024 * 1024:  # 8 MB
        raise HTTPException(status_code=400, detail="File too large (max 8 MB)")

    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Place food_model.keras in the model/ folder.",
        )

    if not idx_to_class:
        raise HTTPException(
            status_code=503,
            detail="class_indices.json not loaded.",
        )

    # ---- Preprocess + Inference ----
    try:
        x = preprocess_image(contents)
        preds = model.predict(x, verbose=0)[0]
    except Exception as e:
        logger.exception("Inference failed")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    # ---- Top-3 ----
    top_indices = preds.argsort()[-3:][::-1]
    top_3 = []
    for i in top_indices:
        cls = idx_to_class.get(int(i), f"class_{i}")
        top_3.append(
            {
                "class_name": cls,
                "confidence": float(round(preds[i], 4)),
                "display_name": pretty_name(cls),
            }
        )

    best = top_3[0]
    nutri = get_nutrition(best["class_name"])
    ingredients = [
        ing.strip().title()
        for ing in nutri["ingredients"].split(",")
        if ing.strip()
    ]

    return {
        "success": True,
        "dish_name": best["display_name"],
        "confidence": best["confidence"],
        "ingredients": ingredients,
        "nutrition": {
            "calories": nutri["calories"],
            "protein_g": nutri["protein_g"],
            "carbs_g": nutri["carbs_g"],
            "fat_g": nutri["fat_g"],
            "fiber_g": nutri["fiber_g"],
            "serving_size_g": nutri["serving_size_g"],
        },
        "top_3": top_3,
        "message": make_message(nutri),
        "note": (
            "Nutrition values are for a typical serving. "
            "Actual calories depend on portion size."
        ),
    }


# ----------------------------------------------------------------------
# Serve Frontend
# ----------------------------------------------------------------------
FRONTEND_DIST = BASE_DIR.parent.parent / "nutriscan_frontend" / "dist"

if FRONTEND_DIST.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {
            "message": "NutriScan API is running. Frontend build not found.",
            "docs": "/docs",
            "health": "/health",
        }


# ----------------------------------------------------------------------
# Run with: python main.py
# ----------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
