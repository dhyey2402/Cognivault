from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.attempt import AttemptCreate, AttemptResponse, AttemptDetailResponse, AnswerCreate
from app.crud import attempt as crud_attempt
from app.models.user import User

router = APIRouter()

@router.post("/start", response_model=AttemptResponse)
def start_quiz(
    attempt_in: AttemptCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_attempt.start_attempt(db, user_id=current_user.id, attempt_in=attempt_in)

@router.post("/{attempt_id}/submit", response_model=AttemptResponse)
def submit_quiz(
    attempt_id: int,
    answers_in: List[AnswerCreate],
    time_taken: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    attempt = crud_attempt.submit_attempt(db, attempt_id=attempt_id, answers_in=answers_in, time_taken=time_taken)
    if not attempt:
        raise HTTPException(status_code=400, detail="Invalid attempt or already submitted")
    return attempt

@router.get("/", response_model=List[AttemptResponse])
def read_user_attempts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_attempt.get_user_attempts(db, user_id=current_user.id)

@router.get("/{attempt_id}", response_model=AttemptDetailResponse)
def read_attempt_detail(
    attempt_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    attempt = crud_attempt.get_attempt_detail(db, attempt_id=attempt_id, user_id=current_user.id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return attempt
