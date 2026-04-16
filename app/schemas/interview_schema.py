from pydantic import BaseModel

class InterviewCreate(BaseModel):
    role: str
    difficulty: str
    interview_type: str

class QuestionGenarate(BaseModel):
    session_id: int

class SubmitAnswer(BaseModel):
    question_id: int
    answer: str
    response_time: int\

# class Report(BaseModel):
#     session_id: int