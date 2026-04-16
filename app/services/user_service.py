from sqlalchemy.orm import Session
from app.models.user import User
from app.models.interview import InterviewSession, Question
from app.models.answer import Answer
from app.models.evaluation import Evaluation


def get_all_users(db: Session):
    return db.query(User).all()


def get_user_profile(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()

    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == user_id
    ).all()

    session_data = []

    for session in sessions:

        questions = db.query(Question).filter(
            Question.session_id == session.id
        ).all()

        q_list = []

        for q in questions:
            answer = db.query(Answer).filter(
                Answer.question_id == q.id
            ).first()

            evaluation = None
            if answer:
                evaluation = db.query(Evaluation).filter(
                    Evaluation.answer_id == answer.id
                ).first()

            q_list.append({
                "question": q.question_text,
                "answer": answer.answer_text if answer else None,
                "evaluation": {
                    "final_score": evaluation.final_score if evaluation else None,
                    "feedback": evaluation.improvement_suggestions if evaluation else None
                } if evaluation else None
            })

        session_data.append({
            "session_id": session.id,
            "role": session.role_selected,
            "difficulty": session.difficulty,
            "questions": q_list
        })

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "interviews": session_data
    }