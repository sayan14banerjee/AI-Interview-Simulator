from typing import List

from pydantic import BaseModel


class ResumeBase(BaseModel):
    user_id: int
    file_url: str
    extracted_skills: List[str] = []
    experience_years: int
    parsed_summary: str


class ResumeCreate(ResumeBase):
    pass


class ResumeResponse(ResumeBase):
    id: int

    class Config:
        orm_mode = True
