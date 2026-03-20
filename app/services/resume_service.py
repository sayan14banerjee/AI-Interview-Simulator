import PyPDF2
from sqlalchemy.orm import Session
from app.models.resume import Resume
import os

UPLOAD_FOLDER = "uploads/resumes"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_file(file, filename):

    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as f:
        f.write(file.read())

    return file_path


def extract_text_from_pdf(file):

    pdf_reader = PyPDF2.PdfReader(file)
    text = ""

    for page in pdf_reader.pages:
        text += page.extract_text()

    return text


def save_resume(db: Session, user_id: int, file, filename: str):

    # Save file locally
    file_path = save_file(file, filename)

    # Extract text
    text = extract_text_from_pdf(open(file_path, "rb"))

    resume = Resume(
        user_id=user_id,
        file_url=file_path,
        parsed_summary=text[:500]
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume, text