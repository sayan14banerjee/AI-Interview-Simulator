import os
from io import BytesIO

import PyPDF2
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.utils.upload_s3 import upload_file_to_s3
from app.services.llm_service import extract_resume_data


UPLOAD_FOLDER = "uploads/resumes"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# def save_file(file, filename):
#     file_path = os.path.join(UPLOAD_FOLDER, filename)

#     with open(file_path, "wb") as f:
#         f.write(file.read())

#     return file_path


def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""

    for page in pdf_reader.pages:
        page_text = page.extract_text() or ""
        text += page_text
    # print("Extracted text from PDF:", text)  # Print the first 200 characters for debugging

    return text


def save_resume(db: Session, user_id: int, file, filename: str):
    file_bytes = file.read()

    if not file_bytes:
        raise ValueError("Uploaded resume file is empty")

    # Use fresh in-memory streams so upload/parsing do not mutate the same handle.
    file_url = upload_file_to_s3(BytesIO(file_bytes), filename)
    text = extract_text_from_pdf(BytesIO(file_bytes))

    # LLM extraction
    extracted_data = extract_resume_data(text)  # type: ignore
    # print("Final extracted data:", extracted_data)  # Print the final extracted data for debugging
    resume = Resume(
        user_id=user_id,
        file_url=file_url,
        extracted_skills=extracted_data.get("skills"),
        experience_years=extracted_data.get("experience_years"),
        parsed_summary=extracted_data.get("summary"),
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume, extracted_data
