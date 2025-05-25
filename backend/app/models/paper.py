from pydantic import BaseModel
from bson import ObjectId
from typing import List, Optional

class Paper(BaseModel):
    id: Optional[str] = None
    doi: str = ""
    title: str = ""
    authors: List[str]
    summary: str

    class Config:
        json_encoders = {
            ObjectId: str
        }