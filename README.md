# 🍽️ NutriScan — AI-Powered Food Recognition & Calorie Tracker

### 🌐 [Live Demo → nutriscan-o2ag.onrender.com](https://nutriscan-o2ag.onrender.com)

> Snap a photo of your food, and NutriScan instantly identifies the dish and gives you detailed nutrition information — calories, protein, carbs, fat, and fiber — powered by deep learning.

---

## 📌 Project Description

**NutriScan** is a full-stack web application that uses a deep learning model (EfficientNetB0) to classify food items from images and provide real-time nutritional information. Users can simply upload or capture a photo of their meal, and the app identifies the dish from **20 Indian food categories** and returns a complete nutrition breakdown.

The project was built to make calorie tracking effortless — no manual searching, no guessing. Just point, snap, and know what you're eating.

### 🎯 Problem Statement

Manually tracking calories is tedious and inaccurate. Most people give up on diet tracking because looking up every food item takes too long. NutriScan solves this by automating the entire process with AI — making healthy eating accessible to everyone.

### 💡 Solution

A web app that combines **computer vision** (image classification) with a **nutrition database** to deliver instant, accurate food analysis from a single photo.

---

## 🚀 Features

- 📸 **Image-Based Food Recognition** — Upload or capture a food photo for instant identification
- 🔢 **Nutrition Breakdown** — Calories, protein, carbs, fat, fiber, and serving size
- 🏆 **Top-3 Predictions** — Shows confidence scores for the top 3 most likely dishes
- 💬 **Smart Coaching Messages** — Personalized tips based on the nutritional profile
- 🤖 **AI Chatbot** — Built-in chatbot for food and nutrition queries
- ⚙️ **Settings & Preferences** — Customizable user experience
- 📱 **Responsive Design** — Works seamlessly on mobile and desktop

---

## 🍛 Supported Food Categories (20 Classes)

| | | | |
|---|---|---|---|
| Burger | Butter Naan | Chai | Chapati |
| Chole Bhature | Dal Makhani | Dhokla | Fried Rice |
| Idli | Jalebi | Kaathi Rolls | Kadai Paneer |
| Kulfi | Masala Dosa | Momos | Paani Puri |
| Pakode | Pav Bhaji | Pizza | Samosa |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn |
| **ML Model** | TensorFlow / Keras (EfficientNetB0 — Transfer Learning) |
| **Data** | Pandas, NumPy, Pillow |
| **Nutrition DB** | Custom CSV with 150+ Indian food items (IFCT values) |

---

## 📁 Project Structure

```
nutriscan/
├── nutriscan_backend/
│   └── nutriscan_backend/
│       ├── main.py                 # FastAPI application
│       ├── requirements.txt        # Python dependencies
│       ├── model/
│       │   ├── food_model.keras    # Trained deep learning model
│       │   └── class_indices.json  # Class label mapping
│       └── data/
│           └── nutrition.csv       # Nutrition database (150+ items)
│
├── nutriscan_frontend/
│   ├── src/
│   │   ├── App.jsx                 # Route definitions
│   │   ├── api.js                  # Backend API integration
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing/hero page
│   │   │   ├── Login.jsx           # User login
│   │   │   ├── Register.jsx        # User registration
│   │   │   ├── Home.jsx            # Main scanner page
│   │   │   ├── Chatbot.jsx         # AI nutrition chatbot
│   │   │   └── Settings.jsx        # User preferences
│   │   └── components/
│   │       ├── Navbar.jsx          # Navigation bar
│   │       └── BottomNav.jsx       # Mobile bottom navigation
│   ├── dist/                       # Production build output
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── Procfile                        # Deployment config
└── README.md
```

---

## ⚙️ How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User snaps  │───▶│  Image sent  │───▶│  Model runs  │───▶│  Nutrition   │
│  a food      │    │  to backend  │    │  prediction  │    │  data shown  │
│  photo       │    │  (FastAPI)   │    │  (Keras)     │    │  to user     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

1. **User uploads** a food image via the React frontend
2. **Backend receives** the image and preprocesses it (resize to 224×224)
3. **EfficientNetB0 model** classifies the food into one of 20 categories
4. **Nutrition lookup** matches the prediction against the CSV database
5. **Response returned** with dish name, confidence score, nutrition, and coaching message

---

## 🏃 How to Run Locally

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend
```bash
cd nutriscan_backend/nutriscan_backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python main.py
```
Backend runs at `http://localhost:8000`

### Frontend
```bash
cd nutriscan_frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

> Create a `.env` file in `nutriscan_frontend/` with `VITE_API_BASE=http://localhost:8000` for local development.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if model and data are loaded |
| `GET` | `/classes` | List all 20 supported food classes |
| `POST` | `/predict` | Upload an image → get dish name + nutrition |
| `GET` | `/docs` | Interactive Swagger API documentation |

### Sample Response (`/predict`)
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
    {"class_name": "pakode", "confidence": 0.07, "display_name": "Pakode"},
    {"class_name": "burger", "confidence": 0.03, "display_name": "Burger"}
  ],
  "message": "Logged successfully. Keep tracking for better insights."
}
```

---

## 🚀 Deployment

🔗 **Live URL:** [https://nutriscan-o2ag.onrender.com](https://nutriscan-o2ag.onrender.com)

Deployed on **Render** (free tier). The backend serves the frontend as static files from a single server.

```bash
# Start command
uvicorn nutriscan_backend.nutriscan_backend.main:app --host 0.0.0.0 --port $PORT
```

---

## 📊 Model Details

| Property | Value |
|----------|-------|
| Architecture | EfficientNetB0 (Transfer Learning) |
| Input Size | 224 × 224 × 3 |
| Output | 20 food classes |
| Model Size | ~20 MB (.keras format) |
| Training Data | Indian Food Images Dataset (Kaggle) |

---

## 👥 Team

- **Ankit** — Full Stack Developer & ML Engineer

---

## 📄 License

This project was developed for educational and exhibition purposes.
