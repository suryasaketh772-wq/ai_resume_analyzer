import os
import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.models.resume import Resume
from app.models.job_role import JobRole
from app.models.user import User
from app.core.exceptions import ResourceNotFoundException, FileProcessingException
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills
from app.services.matcher import calculate_match_score
from app.services.suggester import generate_suggestions

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_uploaded_file(file: UploadFile) -> str:
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise FileProcessingException(f"Could not save file: {str(e)}")
        
    return file_path

async def process_and_save_resume(db: Session, user: User, file: UploadFile) -> dict:
    file_path = await save_uploaded_file(file)
    
    try:
        extracted_text = extract_text_from_pdf(file_path)
    except Exception as e:
        raise FileProcessingException(f"Failed to extract text from PDF: {str(e)}")
        
    db_resume = Resume(
        user_id=user.id,
        file_path=file_path,
        extracted_text=extracted_text,
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    skills = extract_skills(extracted_text)
    
    return {
        "id": db_resume.id,
        "user_id": db_resume.user_id,
        "file_path": db_resume.file_path,
        "extracted_text": db_resume.extracted_text,
        "score": db_resume.score,
        "role_id": db_resume.role_id,
        "created_at": db_resume.created_at,
        "detected_skills": skills
    }

def analyze_resume_match(db: Session, resume_id: int, role_id: int, user_id: int) -> dict:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise ResourceNotFoundException("Resume not found")
        
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise ResourceNotFoundException("Job role not found")
        
    skills = extract_skills(resume.extracted_text)
    required_skills = role.required_skills or []
    
    match_results = calculate_match_score(skills, required_skills)
    
    resume.score = match_results["score"]
    resume.role_id = role.id
    db.commit()
    db.refresh(resume)
    
    suggestions = generate_suggestions(
        missing_skills=match_results["missing_skills"],
        score=match_results["score"],
        extracted_text=resume.extracted_text
    )
    
    return {
        "resume_id": resume.id,
        "role_id": role.id,
        "match_results": match_results,
        "suggestions": suggestions
    }

def get_user_resumes(db: Session, user_id: int):
    return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).all()

def delete_resume(db: Session, resume_id: int, user_id: int) -> bool:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise ResourceNotFoundException("Resume not found")
        
    # Attempt to delete file from disk
    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception as e:
            print(f"Warning: Failed to delete file {resume.file_path}: {e}")
            
    # Delete from DB
    db.delete(resume)
    db.commit()
    return True
