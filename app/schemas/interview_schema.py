from pydantic import BaseModel

class InterviewCreate(BaseModel):
    role: str
    difficulty: str
    interview_type: str