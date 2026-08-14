from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.user import User
from app.models.quiz import Quiz, Attempt, Question

router = APIRouter()

@router.get("/analytics")
def get_dashboard_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    total_quizzes = db.query(Quiz).count()
    total_questions = db.query(Question).count()
    total_attempts = db.query(Attempt).count()
    
    # Calculate average score
    avg_score = db.query(func.avg(Attempt.percentage)).scalar() or 0.0

    return {
        "total_students": total_students,
        "total_quizzes": total_quizzes,
        "total_questions": total_questions,
        "total_attempts": total_attempts,
        "average_score": round(avg_score, 2)
    }

@router.get("/users")
def get_all_users(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    users = db.query(User).filter(User.role == "STUDENT").all()
    return [{"id": u.id, "name": u.name, "email": u.email, "status": u.status, "created_at": u.created_at} for u in users]

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot toggle your own status")
    
    user.status = not user.status
    db.commit()
    db.refresh(user)
    return {"id": user.id, "status": user.status}
