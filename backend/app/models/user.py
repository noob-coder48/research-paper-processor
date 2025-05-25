from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional
import os

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/researchdb")
DB_NAME = MONGO_URI.rsplit("/", 1)[-1]
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    hashed_password: str

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: Optional[str] = None
    email: EmailStr

class UserInDB(BaseModel):
    email: EmailStr
    hashed_password: str

def get_user_by_email(email: str):
    return db.users.find_one({"email": email})

def create_user(email: str, hashed_password: str):
    db.users.insert_one({"email": email, "hashed_password": hashed_password})