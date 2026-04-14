from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.resume_service import save_resume
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["resume"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    resume, data = save_resume(db, user.id, file.file, file.filename)

    return {
        "message": "Resume processed successfully",
        "resume_id": resume.id,
        "skills": data.get("skills"),
        "experience": data.get("experience_years"),
        "summary": data.get("summary"),
        "file" : resume.file_url
    }