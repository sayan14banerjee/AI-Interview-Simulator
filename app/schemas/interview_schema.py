from pydantic import BaseModel

class InterviewCreate(BaseModel):
    role: str
    difficulty: str
    interview_type: str

class QuestionGenarate(BaseModel):
    session_id: int
