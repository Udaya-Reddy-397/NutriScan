# NutriScan Backend

FastAPI backend for the NutriScan food image classification + calorie lookup app.

## What this API returns (matches your frontend)

```json
{
  "success": true,
  "dish_name": "Samosa",
  "confidence": 0.87,
  "ingredients": ["Wheat Flour", "Potato", "Spices", "Oil"],
  "nutrition": {
    "calories": 262,
    "protein_g": 5.2,
    "carbs_g": 32.8,
    "fat_g": 12.8,
    "fiber_g": 2.1,
    "serving_size_g": 100
  },
  "top_3": [
    {"class_name": "samosa", "confidence": 0.87, "display_name": "Samosa"},
    {"class_name": "kachori", "confidence": 0.07, "display_name": "Kachori"},
    {"class_name": "pakora", "confidence": 0.03, "display_name": "Pakora"}
  ],
  "message": "Great fit for your goal — high protein, moderate calories and plenty of fibre.",
  "note": "Nutrition values are for a typical serving. Actual calories depend on portion size."
}
```

## Folder structure

```
nutriscan_backend/
├── main.py
├── requirements.txt
├── README.md
├── model/                  ← put your trained files here
│   ├── food_model.keras
│   └── class_indices.json
└── data/
    └── nutrition.csv
```

## Setup

1. **Install dependencies**
   ```bash
   cd nutriscan_backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS / Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

2. **Add your trained model**
   - After training on Kaggle, download:
     - `food_model.keras`
     - `class_indices.json`
   - Place both files inside the `model/` folder.

3. **Run the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Test**
   - Open browser: http://localhost:8000/docs
   - Or use curl:
     ```bash
     curl -X POST "http://localhost:8000/predict" \
       -H "accept: application/json" \
       -F "file=@/path/to/your/food_photo.jpg"
     ```

## Endpoints

| Method | Path       | Description                          |
|--------|------------|--------------------------------------|
| GET    | /health    | Check if model & data are loaded     |
| GET    | /classes   | List all supported dish classes      |
| POST   | /predict   | Upload image → get dish + nutrition  |
| GET    | /docs      | Interactive Swagger UI               |

## Important notes

- The model must be trained with image size **224×224** and pixels normalized to **0–1**.
- `class_indices.json` can be either `{"0": "samosa", ...}` or `{"samosa": 0, ...}`.
- Nutrition values come from `data/nutrition.csv` (IFCT / common Indian food values).
- Portion size cannot be measured from a single photo — the API always returns a typical serving.

## Dataset used for training (recommendation)

**Indian Food Images Dataset** (Sourav Banerjee)  
Kaggle: `iamsouravbanerjee/indian-food-images-dataset`  
- ~80 classes  
- ~4 000 images  
- Perfect for Indian home / restaurant food

Train with EfficientNetB0 (or ResNet50) transfer learning on Kaggle Notebooks, then download the `.keras` + `class_indices.json` into the `model/` folder.
