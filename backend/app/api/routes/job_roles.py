from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.job_role import JobRole
from collections import defaultdict

router = APIRouter()

@router.get("/")
def get_job_roles(db: Session = Depends(get_db)):
    roles = db.query(JobRole).all()
    grouped_roles = defaultdict(list)
    
    for r in roles:
        grouped_roles[r.category].append({
            "id": r.id,
            "category": r.category,
            "role_name": r.role_name,
            "required_skills": r.required_skills,
            "created_at": r.created_at
        })
        
    return grouped_roles
