# Use multi-stage build with Alpine for smaller base image
FROM python:3.10-alpine AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    python3-dev \
    build-base

# Set work directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.10-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install only runtime dependencies
RUN apk add --no-cache \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    libstdc++ \
    libgomp \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN adduser -D -s /bin/sh appuser

# Copy Python packages from builder stage to a location accessible by appuser
COPY --from=builder /root/.local /home/appuser/.local
RUN chown -R appuser:appuser /home/appuser/.local

# Set work directory and change ownership
WORKDIR /app
RUN chown appuser:appuser /app

# Switch to non-root user
USER appuser

# Set PATH for the non-root user
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy application files
COPY --chown=appuser:appuser . .

# Remove unnecessary files to keep image clean
RUN rm -rf __pycache__ \
    && find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true \
    && find . -name "*.pyc" -delete \
    && rm -f Dockerfile README.md .env.example

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
