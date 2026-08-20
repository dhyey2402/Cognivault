from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case
from app.api import deps
from app.models.user import User
from app.models.quiz import Quiz, Attempt, Question, Category, QuizStatus, AttemptStatus
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/analytics")
def get_dashboard_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)

    # Student stats
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    active_students = db.query(User).filter(User.role == "STUDENT", User.status == True).count()
    inactive_students = total_students - active_students
    new_students = db.query(User).filter(User.role == "STUDENT", User.created_at >= thirty_days_ago).count()

    # Quiz stats
    total_quizzes = db.query(Quiz).count()
    published_quizzes = db.query(Quiz).filter(Quiz.status == QuizStatus.PUBLISHED).count()
    draft_quizzes = db.query(Quiz).filter(Quiz.status == QuizStatus.DRAFT).count()
    total_categories = db.query(Category).count()
    total_questions = db.query(Question).count()

    # Attempt stats
    total_attempts = db.query(Attempt).count()
    completed_attempts = db.query(Attempt).filter(Attempt.status != AttemptStatus.IN_PROGRESS).count()
    in_progress_attempts = db.query(Attempt).filter(Attempt.status == AttemptStatus.IN_PROGRESS).count()
    
    avg_score = db.query(func.avg(Attempt.percentage)).filter(Attempt.status != AttemptStatus.IN_PROGRESS).scalar() or 0.0
    avg_completion_time = db.query(func.avg(Attempt.time_taken)).filter(Attempt.status != AttemptStatus.IN_PROGRESS).scalar() or 0.0

    # Pass/fail
    total_passed = db.query(Attempt).filter(Attempt.status == AttemptStatus.PASSED).count()
    total_failed = db.query(Attempt).filter(Attempt.status == AttemptStatus.FAILED).count()
    pass_percentage = (total_passed / completed_attempts * 100) if completed_attempts > 0 else 0

    # Popular quizzes
    popular_quizzes_data = db.query(
        Quiz.title,
        func.count(Attempt.id).label('attempt_count')
    ).join(Attempt).group_by(Quiz.id).order_by(desc('attempt_count')).limit(5).all()
    popular_quizzes = [{"name": title, "attempts": count} for title, count in popular_quizzes_data]

    # Attempts over time (last 30 days)
    # Using python to aggregate to be database agnostic (SQLite vs Postgres)
    recent_attempts = db.query(Attempt.started_at).filter(Attempt.started_at >= thirty_days_ago).all()
    attempts_by_date = {}
    for a in recent_attempts:
        date_str = a.started_at.strftime("%Y-%m-%d")
        attempts_by_date[date_str] = attempts_by_date.get(date_str, 0) + 1
    
    # Fill in missing dates
    attempts_over_time = []
    for i in range(29, -1, -1):
        date_obj = now - timedelta(days=i)
        date_str = date_obj.strftime("%Y-%m-%d")
        display_str = date_obj.strftime("%b %d")
        attempts_over_time.append({
            "date": display_str,
            "attempts": attempts_by_date.get(date_str, 0)
        })

    # CATEGORY HEALTH
    category_health_data = db.query(
        Category.name,
        func.avg(Attempt.percentage).label('avg_score'),
        func.count(Attempt.id).label('attempts')
    ).outerjoin(Quiz, Quiz.category_id == Category.id)\
     .outerjoin(Attempt, Attempt.quiz_id == Quiz.id)\
     .group_by(Category.id).all()
     
    category_health = [
        {"name": cat.name, "average_score": round(cat.avg_score, 2) if cat.avg_score else 0, "attempts": cat.attempts}
        for cat in category_health_data
    ]

    # QUIZ INTELLIGENCE
    quiz_intelligence_data = db.query(
        Quiz.title,
        Quiz.status,
        func.count(Attempt.id).label('attempts'),
        func.avg(Attempt.percentage).label('avg_score'),
        func.sum(case((Attempt.status == AttemptStatus.PASSED, 1), else_=0)).label('passed_count')
    ).outerjoin(Attempt, Attempt.quiz_id == Quiz.id)\
     .group_by(Quiz.id).order_by(desc('attempts')).limit(15).all()
     
    quiz_intelligence = []
    for q in quiz_intelligence_data:
        q_pass_rate = (q.passed_count / q.attempts * 100) if q.attempts and q.attempts > 0 else 0
        quiz_intelligence.append({
            "name": q.title,
            "status": q.status.value,
            "attempts": q.attempts,
            "average_score": round(q.avg_score, 2) if q.avg_score else 0,
            "pass_rate": round(q_pass_rate, 2)
        })

    # ATTENTION ITEMS
    draft_quiz_names = [q.title for q in db.query(Quiz).filter(Quiz.status == QuizStatus.DRAFT).limit(5).all()]
    low_score_quizzes = [q["name"] for q in quiz_intelligence if q["attempts"] > 0 and q["average_score"] < 50]
    zero_attempt_quizzes = [q["name"] for q in quiz_intelligence if q["attempts"] == 0 and q["status"] == QuizStatus.PUBLISHED.value]
    
    attention_items = {
        "drafts": draft_quiz_names,
        "low_scores": low_score_quizzes,
        "zero_attempts": zero_attempt_quizzes
    }

    # TOP PERFORMERS
    top_performers_data = db.query(
        User.name,
        func.count(Attempt.id).label('attempts'),
        func.avg(Attempt.percentage).label('avg_score')
    ).join(Attempt).filter(User.role == "STUDENT").group_by(User.id).order_by(desc('avg_score'), desc('attempts')).limit(5).all()
    
    top_performers = [
        {"name": p.name, "attempts": p.attempts, "average_score": round(p.avg_score, 2) if p.avg_score else 0}
        for p in top_performers_data
    ]

    # RECENT ACTIVITY
    recent_attempts_details = db.query(
        Attempt.id,
        Attempt.completed_at,
        Attempt.percentage,
        User.name.label('user_name'),
        Quiz.title.label('quiz_title')
    ).join(User).join(Quiz).filter(Attempt.status != AttemptStatus.IN_PROGRESS).order_by(desc(Attempt.completed_at)).limit(10).all()
    
    recent_activity = [
        {
            "type": "quiz_completed",
            "message": f"{a.user_name} completed '{a.quiz_title}' with {a.percentage}%",
            "timestamp": a.completed_at.isoformat() if a.completed_at else None,
            "attempt_id": a.id
        }
        for a in recent_attempts_details
    ]

    return {
        "student_stats": {
            "total": total_students,
            "active": active_students,
            "inactive": inactive_students,
            "new_30d": new_students
        },
        "quiz_stats": {
            "total": total_quizzes,
            "published": published_quizzes,
            "draft": draft_quizzes,
            "categories": total_categories,
            "questions": total_questions
        },
        "attempt_stats": {
            "total": total_attempts,
            "completed": completed_attempts,
            "in_progress": in_progress_attempts,
            "average_score": round(avg_score, 2),
            "average_completion_time_seconds": round(avg_completion_time, 2)
        },
        "pass_fail_analytics": {
            "passed": total_passed,
            "failed": total_failed,
            "pass_percentage": round(pass_percentage, 2)
        },
        "popular_quizzes": popular_quizzes,
        "attempts_over_time": attempts_over_time,
        "category_health": category_health,
        "quiz_intelligence": quiz_intelligence,
        "attention_items": attention_items,
        "top_performers": top_performers,
        "recent_activity": recent_activity,
        # Legacy fields for backward compatibility with old UI if needed
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
