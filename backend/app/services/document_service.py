from PyPDF2 import PdfReader
from PIL import Image
import pytesseract
import io
import re
import openpyxl
from app.utils.summary import generate_summary_and_metadata

class DocumentService:
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF using PyPDF2 and OCR for scanned pages."""
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text and page_text.strip():
                text += page_text + "\n"
            else:
                # OCR for scanned page images (if any)
                try:
                    xObject = page['/Resources']['/XObject'].get_object()
                    for obj in xObject:
                        if xObject[obj]['/Subtype'] == '/Image':
                            data = xObject[obj]._data
                            img = Image.open(io.BytesIO(data))
                            text += pytesseract.image_to_string(img) + "\n"
                except Exception:
                    continue
        return text

    def extract_info(self, text: str) -> dict:
        llm_result = generate_summary_and_metadata(text)
        return {
            "doi": llm_result.get("doi", ""),
            "title": llm_result.get("title", ""),
            "authors": llm_result.get("authors", []),
            "summary": llm_result.get("summary", "")
        }

    def save_to_excel(self, info: dict, excel_path: str):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["DOI/ISN", "Title", "Authors", "Summary"])
        ws.append([
            info.get("doi", ""),
            info.get("title", ""),
            ", ".join(info.get("authors", [])),
            info.get("summary", "")
        ])
        wb.save(excel_path)

    def process_pdf_and_save(self, pdf_path: str, excel_path: str):
        text = self.extract_text_from_pdf(pdf_path)
        info = self.extract_info(text)
        self.save_to_excel(info, excel_path)
        return info