from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=True)
    candidate_name = Column(String, nullable=True)
    candidate_email = Column(String, nullable=True)
    candidate_phone = Column(String, nullable=True)
    score = Column(Float, nullable=True)
    role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=True)
    missing_skills = Column(JSONB, nullable=True)
    suggestions = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="resumes")
    role = relationship("JobRole", back_populates="resumes")
