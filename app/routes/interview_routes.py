from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.resume import Resume
from app.models.interview import InterviewSession
from app.services.interview_service import create_interview, generate_questions_for_session
from app.utils.dependencies import get_current_user, get_db
from app.schemas.interview_schema import InterviewCreate, QuestionGenarate
from app.services.evaluation_service import process_answer
from app.schemas.interview_schema import SubmitAnswer

router = APIRouter(tags=["interview"])


@router.post("/create")
def create_interview_api(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    session = create_interview(
        db,
        user.id,
        data.role,
        data.difficulty,
        data.interview_type
    )

    return {"session_id": session.id}

@router.post("/{session_id}/generate-questions")
def generate_questions_api(

    data: QuestionGenarate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    session = db.query(InterviewSession).filter(
        InterviewSession.id == data.session_id
    ).first()

    resume = db.query(Resume).filter(
        Resume.user_id == user.id
    ).first()

    questions = generate_questions_for_session(
        db,
        session,
        resume.extracted_skills
    )

    return {"questions": questions}

@router.post("/{question_id}/submit-answer")
def submit_answer(
    data: SubmitAnswer,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    evaluation = process_answer(
        db,
        data.question_id,
        data.answer,
        data.response_time
    )

    return {
        "final_score": evaluation.final_score,
        "feedback": evaluation.improvement_suggestions
    }


