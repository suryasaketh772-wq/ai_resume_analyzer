from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, resumes, job_roles
from app.db.database import engine, Base
from app.core.exceptions import (
    UserAlreadyExistsException, 
    InvalidCredentialsException, 
    ResourceNotFoundException, 
    FileProcessingException
)

# Create tables (In a real app, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(UserAlreadyExistsException)
async def user_exists_handler(request: Request, exc: UserAlreadyExistsException):
    return JSONResponse(status_code=400, content={"detail": exc.detail})

@app.exception_handler(InvalidCredentialsException)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(status_code=400, content={"detail": exc.detail})

@app.exception_handler(ResourceNotFoundException)
async def not_found_handler(request: Request, exc: ResourceNotFoundException):
    return JSONResponse(status_code=404, content={"detail": exc.detail})

@app.exception_handler(FileProcessingException)
async def file_processing_handler(request: Request, exc: FileProcessingException):
    return JSONResponse(status_code=500, content={"detail": exc.detail})

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(resumes.router, prefix=f"{settings.API_V1_STR}/resumes", tags=["resumes"])
app.include_router(job_roles.router, prefix=f"{settings.API_V1_STR}/job-roles", tags=["job-roles"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Resume Analyzer API"}
