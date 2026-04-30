from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeBase(BaseModel):
    file_path: str
    extracted_text: Optional[str] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    candidate_phone: Optional[str] = None
    score: Optional[float] = None
    role_id: Optional[int] = None

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    detected_skills: list[str] = []
    missing_skills: list[str] = []
    suggestions: list[str] = []

    class Config:
        from_attributes = True
