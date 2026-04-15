from sqlalchemy.orm import Session
from app.models.interview import InterviewSession, Question
from app.services.llm_service import generate_interview_questions


def create_interview(db: Session, user_id, role, difficulty, interview_type):

    session = InterviewSession(
        user_id=user_id,
        role_selected=role,
        difficulty=difficulty,
        interview_type=interview_type
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def generate_questions_for_session(db: Session, session, skills):

    questions = generate_interview_questions(
        skills=skills,
        role=session.role_selected,
        difficulty=session.difficulty,
        interview_type=session.interview_type
    )

    generated_questions = []
    for q in questions:
        question = Question(
            session_id=session.id,
            question_text=q.get("question"),
            expected_topics=q.get("topic"),
            difficulty_score=q.get("difficulty")
        )
        db.add(question)
        db.flush()  # Flush to assign ID
        generated_questions.append({
            "id": question.id,
            "question": q.get("question"),
            "topic": q.get("topic"),
            "difficulty": q.get("difficulty")
        })

    db.commit()

    return generated_questions