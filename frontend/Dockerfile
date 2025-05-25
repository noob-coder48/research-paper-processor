# Use official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend app
COPY backend/ .

# Expose the API port (adjust based on FastAPI or Flask)
EXPOSE 8000

# Run the backend (FastAPI example)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
