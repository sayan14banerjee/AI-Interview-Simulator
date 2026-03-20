from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Text
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id= Column(Integer, ForeignKey("users.id"))
    file_url = Column(String(255))
    extracted_skills = Column(JSON)
    experience_year = Column(Integer)
    parsed_summary = Column(Text)
