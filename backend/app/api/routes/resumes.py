from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.api.dependencies import get_current_user
from app.services.resume_service import process_and_save_resume, analyze_resume_match, get_user_resumes, delete_resume
from typing import List

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )
        
    return await process_and_save_resume(db, current_user, file)

@router.post("/{resume_id}/match")
def match_resume_to_role(
    resume_id: int,
    role_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return analyze_resume_match(db, resume_id, role_id, current_user.id)

@router.get("/", response_model=List[ResumeResponse])
def get_user_resumes_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_resumes(db, current_user.id)

@router.delete("/{resume_id}")
def delete_user_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_resume(db, resume_id, current_user.id)
    return {"message": "Resume deleted successfully"}
