from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class InterviewSession(Base):

    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role_selected = Column(String(255))
    difficulty = Column(String(255))
    interview_type = Column(String(255))
    status = Column(String(255), default="created")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Question(Base):

    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    question_text = Column(String(1000))
    expected_topics = Column(String(255))
    difficulty_score = Column(String(255))