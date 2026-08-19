from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.quiz import QuizCreate, QuizUpdate, QuizResponse, QuizDetailResponse, StudentQuizDetailResponse, QuestionCreate, QuestionUpdate, QuestionResponse
from app.crud import quiz as crud_quiz
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[QuizResponse])
def read_quizzes(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db)):
    return crud_quiz.get_quizzes(db, skip=skip, limit=limit)

@router.post("/", response_model=QuizResponse)
def create_quiz(
    quiz_in: QuizCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    return crud_quiz.create_quiz(db, quiz_in)

@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(
    quiz_id: int,
    quiz_in: QuizUpdate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return crud_quiz.update_quiz(db, quiz_id=quiz_id, quiz=quiz_in)

from app.models.quiz import Attempt

@router.get("/join/{join_code}", response_model=StudentQuizDetailResponse)
def read_quiz_by_code(
    join_code: str, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    quiz = crud_quiz.get_quiz_by_code(db, join_code=join_code)
    if not quiz:
        raise HTTPException(status_code=404, detail="Invalid join code or quiz not found")
    
    previous_attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id, Attempt.quiz_id == quiz.id).count()
    response = StudentQuizDetailResponse.model_validate(quiz)
    response.previous_attempts_count = previous_attempts
    return response

@router.get("/{quiz_id}")
def read_quiz(
    quiz_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if current_user.role == "ADMIN":
        return QuizDetailResponse.model_validate(quiz)
        
    previous_attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id, Attempt.quiz_id == quiz.id).count()
    response = StudentQuizDetailResponse.model_validate(quiz)
    response.previous_attempts_count = previous_attempts
    return response

@router.delete("/{quiz_id}", status_code=204)
def delete_quiz(
    quiz_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    crud_quiz.delete_quiz(db, quiz_id=quiz_id)
    return None

@router.post("/{quiz_id}/questions", response_model=QuestionResponse)
def create_question(
    quiz_id: int,
    question_in: QuestionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return crud_quiz.create_question_with_options(db, quiz_id=quiz_id, question=question_in)

@router.put("/questions/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    question_in: QuestionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    question = crud_quiz.update_question(db, question_id=question_id, question=question_in)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.delete("/questions/{question_id}", status_code=204)
def delete_question(
    quiz_id: int,
    question_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    question = crud_quiz.delete_question(db, question_id=question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return None
