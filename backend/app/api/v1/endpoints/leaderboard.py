from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from app.api import deps
from app.models.user import User
from app.models.quiz import Quiz, Attempt, AttemptStatus
from app.schemas.leaderboard import LeaderboardEntry

router = APIRouter()

@router.get("/", response_model=List[LeaderboardEntry])
def get_leaderboard(
    category_id: Optional[int] = Query(None, description="Filter by category"),
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    # Base query for completed attempts
    query = db.query(
        Attempt.user_id,
        User.name.label("student_name"),
        func.avg(Attempt.percentage).label("average_score"),
        func.count(Attempt.id).label("quizzes_completed")
    ).join(User, Attempt.user_id == User.id)

    # Filter out in-progress attempts
    query = query.filter(Attempt.status != AttemptStatus.IN_PROGRESS)
    # Only include active students
    query = query.filter(User.role == "STUDENT", User.status == True)

    if category_id:
        query = query.join(Quiz, Attempt.quiz_id == Quiz.id)
        query = query.filter(Quiz.category_id == category_id)

    # Group by user
    query = query.group_by(Attempt.user_id, User.name)

    # Deterministic ranking: Avg score DESC, then completed quizzes DESC, then user_id ASC (as tie-breaker)
    query = query.order_by(
        desc("average_score"),
        desc("quizzes_completed"),
        User.id.asc()
    )
    
    results = query.limit(limit).all()

    leaderboard = []
    for rank, row in enumerate(results, start=1):
        avg_score = round(row.average_score, 2) if row.average_score is not None else 0.0
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=row.user_id,
            student_name=row.student_name,
            average_score=avg_score,
            quizzes_completed=row.quizzes_completed
        ))

    return leaderboard
