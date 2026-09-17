# Stage 1: Build the React Frontend
FROM node:18 AS frontend-builder
WORKDIR /app/nutriscan_frontend

# Install dependencies and build
COPY nutriscan_frontend/package*.json ./
RUN npm install
COPY nutriscan_frontend/ ./
RUN npm run build

# Stage 2: Setup the Python Backend
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies required by OpenCV/Pillow if needed
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY nutriscan_backend/nutriscan_backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY nutriscan_backend/ ./nutriscan_backend/

# Copy the built frontend from Stage 1 into the location FastAPI expects
COPY --from=frontend-builder /app/nutriscan_frontend/dist ./nutriscan_frontend/dist

# Expose port 7860 (Required by Hugging Face Spaces)
EXPOSE 7860
ENV PORT=7860

# Run the FastAPI app
WORKDIR /app/nutriscan_backend/nutriscan_backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
