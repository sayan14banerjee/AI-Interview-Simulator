from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.resume_service import save_resume
from app.utils.dependencies import get_current_user

router = APIRouter()


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

    resume, text = save_resume(db, user.id, file.file, file.filename)

    return {
        "message": "Resume uploaded",
        "resume_id": resume.id,
        "preview": text[:300]
    }