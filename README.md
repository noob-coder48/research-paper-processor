# Research Paper Processor

This project is a full-stack application designed to process research paper PDFs. It extracts key information such as DOI numbers, titles, authors' names, and provides a brief summary of the papers. The application is built using FastAPI for the backend, React for the frontend, and MongoDB for data storage. It uses OCR, regex/heuristics, and Hugging Face LLMs for extraction and summarization.

## Features

- User signup/login (email & password)
- Upload research paper PDFs (scanned or digital)
- Extract DOI, title, authors, summary (OCR + regex + LLM)
- View all uploaded papers in a dashboard table
- Soft delete: Remove papers from the dashboard (hidden, not deleted from DB)
- Export all non-deleted data to Excel (.xlsx)
- Production-ready with Docker Compose
- Secure, modular, and well-documented

## Tech Stack

- **Frontend:** React (Create React App), Material UI, Axios
- **Backend:** FastAPI, PyPDF2, pytesseract, pdf2image, Hugging Face Inference API, openpyxl
- **Database:** MongoDB
- **Auth:** JWT (python-jose, passlib)
- **Deployment:** Docker Compose

## Setup

1. Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in your values (MongoDB URI, Hugging Face API key, etc).
2. Build and run with Docker Compose:
   ```sh
   docker-compose up --build
   ```
3. Access frontend at [http://localhost:3000](http://localhost:3000)

## External Libraries

- FastAPI, Pydantic, PyMongo, python-dotenv, PyPDF2, pytesseract, pdf2image, openpyxl, passlib, python-jose, transformers, torch
- React, axios, react-router-dom, @mui/material, file-saver

## Notes

- All code is open source and free.
- For development, you can run backend and frontend separately.
- See each folder's README for more details.