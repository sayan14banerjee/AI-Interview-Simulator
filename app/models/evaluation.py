from sqlalchemy import Column, Integer, String, ForeignKey, Float, JSON
from app.database import Base

class Evaluation(Base):

    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True)
    answer_id = Column(Integer, ForeignKey("answers.id"))

    technical_score = Column(Integer)
    depth_score = Column(Integer)
    clarity_score = Column(Integer)
    completeness_score = Column(Integer)

    final_score = Column(Float)

    missing_concepts = Column(JSON)
    improvement_suggestions = Column(JSON)
    confidence = Column(Float)