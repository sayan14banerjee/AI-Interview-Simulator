from sqlalchemy.orm import Session
from app.models.evaluation import Evaluation
from app.models.answer import Answer
from app.models.interview import Question

def generate_report(db: Session, session_id: int):

    evaluations = db.query(Evaluation).join(Answer).join(Question).filter(
        Question.session_id == session_id
    ).all()

    if not evaluations:
        return {}

    total_score = 0
    all_missing = []
    all_suggestions = []

    for e in evaluations:
        total_score += e.final_score

        if e.missing_concepts:
            all_missing.extend(e.missing_concepts)

        if e.improvement_suggestions:
            all_suggestions.extend(e.improvement_suggestions)

    avg_score = round(total_score / len(evaluations), 2)

    # 🔥 Weak areas
    weak_areas = list(set(all_missing))

    # 🔥 Strong areas (reverse logic)
    strong_areas = ["Core Concepts"] if avg_score > 7 else []

    return {
        "overall_score": avg_score,
        "weak_areas": weak_areas,
        "strong_areas": strong_areas,
        "improvement_plan": list(set(all_suggestions)),
        "confidence": round(sum([e.confidence for e in evaluations]) / len(evaluations), 2)
    }