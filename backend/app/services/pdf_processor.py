from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import pytesseract
from app.utils.summary import generate_summary_and_metadata


def extract_pdf_info(pdf_path: str) -> dict:
    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        text = extract_text_with_ocr(pdf_path)
    return generate_summary_and_metadata(text)


def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text


def extract_text_with_ocr(pdf_path: str) -> str:
    pages = convert_from_path(pdf_path)
    text = ""
    for image in pages:
        text += pytesseract.image_to_string(image)
    return text
