# Research Paper Processor Backend

This is the backend component of the Research Paper Processor application. It processes research paper PDFs to extract relevant information such as DOI, title, authors, and a brief summary using a combination of OCR, regex, and LLMs (Hugging Face Inference API).

## Features

- User authentication (signup and login) with JWT
- PDF upload for research papers (supports scanned and digital PDFs)
- Extraction of metadata (DOI, title, authors) using regex/heuristics
- Summarization of research papers using Hugging Face LLMs
- Export extracted data to Excel (`.xlsx`)
- **Soft delete:** Users can delete papers from the dashboard; deleted papers are not removed from the database but are hidden from the user interface and excluded from exports

## Technologies Used

- **FastAPI**: Modern Python web framework for APIs
- **MongoDB**: NoSQL database for storing extracted information
- **PyPDF2**: PDF text extraction
- **pytesseract**: OCR for scanned PDFs
- **pdf2image**: Convert PDF pages to images for OCR
- **Hugging Face Inference API**: For LLM-based summarization and extraction
- **openpyxl**: Excel export
- **passlib, python-jose**: Authentication and password hashing
- **Docker**: Containerization

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd research-paper-processor/backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, Hugging Face API key, and other secrets.

5. **Run the application:**
   ```sh
   uvicorn app.main:app --reload
   ```

6. **Access the API documentation:**
   Open your browser and go to `http://localhost:8000/docs` to view the interactive API documentation.

## Docker Setup

To run the application using Docker, ensure you have Docker installed and then run:

```sh
docker-compose up --build
```

This command will build the Docker images and start the services defined in the `docker-compose.yml` file.

## API Endpoints

- `POST /signup`: Register a new user
- `POST /login`: Login and receive JWT token
- `POST /upload`: Upload a PDF for extraction
- `GET /papers`: List all non-deleted papers for the user
- `DELETE /papers/{paper_id}`: Soft delete a paper
- `GET /papers/export`: Export all non-deleted papers to Excel

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.