from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Answer(Base):

    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_text = Column(String(1000))
    response_time_seconds = Column(Integer)