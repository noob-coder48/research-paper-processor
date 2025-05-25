from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, EmailStr
from app.models.paper import Paper
from app.models.user import get_user_by_email, create_user
from app.core.security import get_current_user
from app.services.document_service import DocumentService
from passlib.context import CryptContext
from jose import jwt
from pymongo import MongoClient
from bson import ObjectId
import os
import tempfile

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/researchdb")
DB_NAME = MONGO_URI.rsplit("/", 1)[-1]

router = APIRouter()
document_service = DocumentService()
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def serialize_mongo_doc(doc):
    doc = dict(doc)
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

@router.post("/signup")
def signup(user: UserSignup):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user.password)
    create_user(user.email, hashed)
    # Generate token for immediate login
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.filename.endswith('.pdf'):
        return JSONResponse(content={"error": "File type not supported"}, status_code=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        info = document_service.process_pdf_and_save(tmp_path, tmp_path.replace(".pdf", ".xlsx"))

        # Save to MongoDB
        paper_doc = {
            "doi": info.get("doi", ""),
            "title": info.get("title", ""),
            "authors": info.get("authors", []),
            "summary": info.get("summary", ""),
            "user_email": current_user["email"],
            "deleted": False  # Soft delete flag
        }
        db.papers.insert_one(paper_doc)

        return JSONResponse(
            content={
                "message": "PDF uploaded successfully",
                "paper": serialize_mongo_doc(paper_doc)
            },
            status_code=201
        )
    finally:
        # Clean up temp files
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        xlsx_path = tmp_path.replace(".pdf", ".xlsx")
        if os.path.exists(xlsx_path):
            os.remove(xlsx_path)

@router.get("/papers")
async def get_papers(current_user: dict = Depends(get_current_user)):
    papers = []
    for doc in db.papers.find({"user_email": current_user["email"], "deleted": {"$ne": True}}):
        doc["id"] = str(doc.get("_id", ""))
        doc["doi"] = doc.get("doi") or ""
        doc["title"] = doc.get("title") or ""
        doc["authors"] = doc.get("authors") or []
        doc["summary"] = doc.get("summary") or ""
        papers.append(Paper(**doc))
    return papers

@router.get("/papers/export")
async def export_papers(current_user: dict = Depends(get_current_user)):
    # Only export papers that are not soft deleted
    papers = list(db.papers.find({"user_email": current_user["email"], "deleted": {"$ne": True}}))
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found to export.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        import openpyxl
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["DOI/ISN", "Title", "Authors", "Summary"])
        for paper in papers:
            ws.append([
                paper.get("doi", ""),
                paper.get("title", ""),
                ", ".join(paper.get("authors", [])),
                paper.get("summary", "")
            ])
        wb.save(tmp.name)
        tmp_path = tmp.name

    return FileResponse(tmp_path, filename="extracted_papers.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@router.delete("/papers/{paper_id}")
async def delete_paper(paper_id: str, current_user: dict = Depends(get_current_user)):
    result = db.papers.update_one(
        {"_id": ObjectId(paper_id), "user_email": current_user["email"]},
        {"$set": {"deleted": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"message": "Paper deleted (soft delete)"}