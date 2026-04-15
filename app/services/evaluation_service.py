from fastapi import HTTPException
from app.models.answer import Answer
from app.models.evaluation import Evaluation
from app.models.interview import Question
from app.services.llm_service import evaluate_answer

def calculate_final_score(data, response_time):

    final = (
        data["technical_score"] * 0.35 +
        data["depth_score"] * 0.25 +
        data["clarity_score"] * 0.15 +
        data["completeness_score"] * 0.15 +
        (10 - min(response_time / 10, 10)) * 0.10
    )

    return round(final, 2)

def process_answer(db, question_id, answer_text, response_time):

    # Check if question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    answer = Answer(
        question_id=question_id,
        answer_text=answer_text,
        response_time_seconds=response_time
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    # print (f"Processing answer for Question ID: {question_id}, Answer ID: {answer.id}, question: {question.question_text}, answer: {answer_text}, response_time: {response_time}s")

    # 🔥 LLM evaluation
    eval_data = evaluate_answer(question.question_text, answer_text)

    final_score = calculate_final_score(eval_data, response_time)

    evaluation = Evaluation(
        answer_id=answer.id,
        technical_score=eval_data.get("technical_score"),
        depth_score=eval_data.get("depth_score"),
        clarity_score=eval_data.get("clarity_score"),
        completeness_score=eval_data.get("completeness_score"),
        final_score=final_score,
        missing_concepts=eval_data.get("missing_concepts"),
        improvement_suggestions=eval_data.get("improvement_suggestions"),
        confidence=eval_data.get("confidence_score")
    )

    db.add(evaluation)
    db.commit()

    return evaluation