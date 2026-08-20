from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.attempt import AttemptCreate, AttemptResponse, AttemptDetailResponse, AttemptSubmit, StudentAnalytics, ExamIntegrityEventBatch, ExamIntegrityEventResponse
from app.crud import attempt as crud_attempt
from app.models.user import User

router = APIRouter()

from app.models.quiz import Quiz, Attempt

@router.post("/start", response_model=AttemptResponse)
def start_quiz(
    attempt_in: AttemptCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    quiz = db.query(Quiz).filter(Quiz.id == attempt_in.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    if quiz.max_attempts > 0:
        previous_attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id, Attempt.quiz_id == quiz.id).count()
        if previous_attempts >= quiz.max_attempts:
            raise HTTPException(status_code=400, detail="Maximum attempts reached for this quiz")
            
    return crud_attempt.start_attempt(db, user_id=current_user.id, attempt_in=attempt_in)

@router.post("/{attempt_id}/submit", response_model=AttemptResponse)
def submit_quiz(
    attempt_id: int,
    submission: AttemptSubmit,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    attempt = crud_attempt.submit_attempt(db, attempt_id=attempt_id, answers_in=submission.answers, time_taken=submission.time_taken)
    if not attempt:
        raise HTTPException(status_code=400, detail="Invalid attempt or already submitted")
    return attempt

@router.post("/{attempt_id}/integrity-events/batch", response_model=dict)
def log_integrity_events(
    attempt_id: int,
    batch: ExamIntegrityEventBatch,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    events = crud_attempt.log_integrity_events(db, attempt_id=attempt_id, user_id=current_user.id, events=batch.events)
    if events is None:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return {"status": "success", "logged": len(events)}

@router.get("/{attempt_id}/integrity-events", response_model=List[ExamIntegrityEventResponse])
def get_integrity_events(
    attempt_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    # This might be used by admins, but allowing the student to fetch their own events for now, or just restricting to admin in a separate endpoint
    # Since it's for student's attempt, we use get_attempt_integrity_events which validates user_id
    events = crud_attempt.get_attempt_integrity_events(db, attempt_id=attempt_id, user_id=current_user.id)
    if events is None:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return events


@router.get("/analytics", response_model=StudentAnalytics)
def get_student_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_attempt.get_student_analytics(db, user_id=current_user.id)

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

from app.schemas.attempt import FocusDNA, MemoryHeatmap

@router.get("/{attempt_id}/focus-dna", response_model=FocusDNA)
def read_focus_dna(
    attempt_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    dna = crud_attempt.get_focus_dna(db, attempt_id=attempt_id, user_id=current_user.id)
    if not dna:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return dna

@router.get("/{attempt_id}/memory-heatmap", response_model=MemoryHeatmap)
def read_memory_heatmap(
    attempt_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    heatmap = crud_attempt.get_memory_heatmap(db, attempt_id=attempt_id, user_id=current_user.id)
    if not heatmap:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return heatmap

from app.schemas.attempt import KnowledgeGalaxy

@router.get("/analytics/knowledge-galaxy", response_model=KnowledgeGalaxy)
def read_knowledge_galaxy(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_attempt.get_knowledge_galaxy(db, user_id=current_user.id)
