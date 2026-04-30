from app.db.database import SessionLocal, engine, Base
from app.models.job_role import JobRole
import json

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    roles = [
        JobRole(category="Web Development", role_name="React Frontend Developer", required_skills=["html", "css", "javascript", "typescript", "react", "redux", "tailwind", "responsive design", "git", "rest api"]),
        JobRole(category="Web Development", role_name="Python Backend Developer", required_skills=["python", "fastapi", "django", "flask", "postgresql", "sql", "rest api", "jwt", "docker", "git"]),
        JobRole(category="Web Development", role_name="Full Stack Developer", required_skills=["html", "css", "javascript", "react", "node.js", "python", "fastapi", "postgresql", "git", "docker"]),
        JobRole(category="Web Development", role_name="Node.js Developer", required_skills=["javascript", "typescript", "node.js", "express.js", "mongodb", "postgresql", "rest api", "jwt", "docker", "git"]),
        
        JobRole(category="Data & AI", role_name="Data Analyst", required_skills=["python", "sql", "excel", "pandas", "numpy", "power bi", "tableau", "statistics", "data visualization", "reporting"]),
        JobRole(category="Data & AI", role_name="Data Scientist", required_skills=["python", "pandas", "numpy", "scikit-learn", "matplotlib", "statistics", "machine learning", "sql", "data cleaning", "model evaluation"]),
        JobRole(category="Data & AI", role_name="Machine Learning Engineer", required_skills=["python", "tensorflow", "pytorch", "scikit-learn", "feature engineering", "model deployment", "docker", "mlops", "sql", "git"]),
        JobRole(category="Data & AI", role_name="AI Engineer", required_skills=["python", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "opencv", "transformers", "docker", "git"]),
        
        JobRole(category="Cloud & DevOps", role_name="DevOps Engineer", required_skills=["linux", "docker", "kubernetes", "aws", "ci/cd", "jenkins", "terraform", "bash", "monitoring", "git"]),
        
        JobRole(category="Testing", role_name="QA Engineer", required_skills=["manual testing", "automation testing", "selenium", "test cases", "jira", "api testing", "postman", "sql", "bug tracking", "git"]),
    ]
    
    for role in roles:
        existing = db.query(JobRole).filter(JobRole.role_name == role.role_name).first()
        if not existing:
            db.add(role)
    
    db.commit()
    db.close()
    print("Database seeded with job roles!")

if __name__ == "__main__":
    seed()
