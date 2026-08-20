from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.quiz import Attempt, Answer, Question, Option, AttemptStatus, ExamIntegrityEvent
from app.schemas.attempt import AttemptCreate, AnswerCreate, ExamIntegrityEventCreate
import datetime

def start_attempt(db: Session, user_id: int, attempt_in: AttemptCreate):
    db_attempt = Attempt(
        user_id=user_id,
        quiz_id=attempt_in.quiz_id,
        status=AttemptStatus.IN_PROGRESS
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

def submit_attempt(db: Session, attempt_id: int, answers_in: list[AnswerCreate], time_taken: int):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt or attempt.status != AttemptStatus.IN_PROGRESS:
        return None

    # Calculate real time taken based on server timestamps
    now = datetime.datetime.utcnow()
    # Ensure attempt.started_at is timezone-naive if now is timezone-naive
    time_elapsed = int((now - attempt.started_at).total_seconds())

    # Allow a small grace period for network latency (e.g., 60 seconds)
    duration_minutes = attempt.quiz.duration if attempt.quiz.duration else 120 # Default to 120 if None
    max_allowed_time = (duration_minutes * 60) + 60
    
    # If the user took way too long, cap the time_taken, but we still accept it (or we could reject). 
    # Or we can just use the elapsed time up to the limit. 
    # Let's cap time_taken to the max_allowed_time or use the passed time_taken if it's smaller, 
    # but never trust a time_taken that is wildly smaller than real elapsed if we want to be strict.
    # We will use the server calculated elapsed time:
    real_time_taken = min(time_elapsed, max_allowed_time)
    
    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0
    total_marks_obtained = 0.0
    total_marks_possible = sum(q.marks for q in attempt.quiz.questions)

    for answer_in in answers_in:
        question = db.query(Question).filter(Question.id == answer_in.question_id).first()
        if not question:
            continue
        
        is_correct = False
        if answer_in.selected_option_id:
            option = db.query(Option).filter(Option.id == answer_in.selected_option_id).first()
            if option and option.is_correct:
                is_correct = True
                correct_count += 1
                total_marks_obtained += question.marks
            else:
                incorrect_count += 1
        else:
            unanswered_count += 1
            
        db_answer = Answer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_option_id=answer_in.selected_option_id,
            is_correct=is_correct,
            time_spent_seconds=answer_in.time_spent_seconds,
            answer_changes=answer_in.answer_changes
        )
        db.add(db_answer)

    # Calculate final scores
    percentage = (total_marks_obtained / total_marks_possible * 100) if total_marks_possible > 0 else 0
    passed = percentage >= attempt.quiz.passing_score
    
    attempt.score = total_marks_obtained
    attempt.percentage = percentage
    attempt.correct_answers = correct_count
    attempt.incorrect_answers = incorrect_count
    attempt.unanswered = unanswered_count
    attempt.time_taken = real_time_taken
    attempt.status = AttemptStatus.PASSED if passed else AttemptStatus.FAILED
    attempt.completed_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(attempt)
    return attempt

def get_user_attempts(db: Session, user_id: int):
    return db.query(Attempt).filter(Attempt.user_id == user_id).order_by(Attempt.started_at.desc()).all()

def get_attempt_detail(db: Session, attempt_id: int, user_id: int):
    return db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()

def get_student_analytics(db: Session, user_id: int):
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).order_by(Attempt.started_at.desc()).all()
    
    total_attempts = len(attempts)
    passed_quizzes = sum(1 for a in attempts if a.status == AttemptStatus.PASSED)
    highest_score = max((a.percentage for a in attempts), default=0.0)
    average_score = sum(a.percentage for a in attempts) / total_attempts if total_attempts > 0 else 0.0
    
    recent_attempts = []
    for a in attempts[:5]:
        quiz = a.quiz
        recent_attempts.append({
            "id": a.id,
            "quiz_title": quiz.title if quiz else "Unknown Quiz",
            "percentage": a.percentage,
            "status": a.status,
            "started_at": a.started_at.isoformat(),
            "passing_score": quiz.passing_score if quiz else 50.0
        })
        
    # Sort for performance history (oldest first)
    attempts_asc = sorted(attempts, key=lambda x: x.started_at)
    performance_history = []
    for a in attempts_asc:
        quiz = a.quiz
        performance_history.append({
            "title": quiz.title if quiz else "Quiz",
            "percentage": a.percentage
        })
        
    return {
        "total_attempts": total_attempts,
        "passed_quizzes": passed_quizzes,
        "highest_score": highest_score,
        "average_score": average_score,
        "recent_attempts": recent_attempts,
        "performance_history": performance_history
    }

def get_focus_dna(db: Session, attempt_id: int, user_id: int):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
    if not attempt or not attempt.answers:
        return None
        
    total_time = sum((a.time_spent_seconds or 0) for a in attempt.answers)
    avg_time = total_time / len(attempt.answers) if attempt.answers else 0
    total_changes = sum((a.answer_changes or 0) for a in attempt.answers)
    
    insights = []
    profile = "Balanced Learner"
    
    if total_changes > len(attempt.answers) * 0.5:
        profile = "Deliberative Rethinker"
        insights.append("You frequently reconsider and change your answers during the quiz.")
    elif avg_time < 15 and attempt.percentage > 80:
        profile = "Rapid Expert"
        insights.append("You answer quickly with high accuracy, showing strong confidence.")
    elif avg_time > 45 and attempt.percentage < 50:
        profile = "Methodical Explorer"
        insights.append("You take your time on difficult questions. More practice could help increase speed.")
    elif avg_time < 15 and attempt.percentage < 50:
        profile = "Rushed Performer"
        insights.append("You might be rushing. Taking a bit more time could improve accuracy.")
    else:
        insights.append("You show a balanced approach to pacing and accuracy.")
        
    return {
        "behavioral_profile": profile,
        "insights": insights,
        "average_time_per_question": avg_time,
        "total_answer_changes": total_changes,
        "data_sufficient": len(attempt.answers) > 0
    }

def get_memory_heatmap(db: Session, attempt_id: int, user_id: int):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
    if not attempt:
        return None
        
    questions = []
    summary = {
        "knew_it": 0,
        "guessed": 0,
        "changed": 0,
        "struggled": 0,
        "unanswered": 0
    }
    
    for ans in attempt.answers:
        state = "UNANSWERED"
        if not ans.selected_option_id:
            state = "UNANSWERED"
            summary["unanswered"] += 1
        elif (ans.answer_changes or 0) > 0:
            state = "CHANGED"
            summary["changed"] += 1
        elif ans.is_correct and (ans.time_spent_seconds or 0) < 15:
            state = "KNEW_IT"
            summary["knew_it"] += 1
        elif ans.is_correct and (ans.time_spent_seconds or 0) >= 15:
            state = "GUESSED"
            summary["guessed"] += 1
        elif not ans.is_correct:
            state = "STRUGGLED"
            summary["struggled"] += 1
            
        questions.append({
            "question_id": ans.question_id,
            "question_text": ans.question.question_text if ans.question else "",
            "is_correct": ans.is_correct,
            "time_spent_seconds": ans.time_spent_seconds or 0,
            "answer_changes": ans.answer_changes or 0,
            "state": state
        })
        
    return {
        "attempt_id": attempt.id,
        "questions": questions,
        "summary": summary
    }

def get_knowledge_galaxy(db: Session, user_id: int):
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id, Attempt.status == AttemptStatus.PASSED).all()
    
    categories_data = {}
    total_stars = 0
    
    for a in attempts:
        quiz = a.quiz
        if not quiz or not quiz.category:
            continue
            
        cat = quiz.category
        if cat.id not in categories_data:
            categories_data[cat.id] = {
                "category_id": cat.id,
                "category_name": cat.name,
                "total_attempts": 0,
                "completed_quizzes": set(),
                "sum_percentage": 0.0
            }
            
        categories_data[cat.id]["total_attempts"] += 1
        categories_data[cat.id]["completed_quizzes"].add(quiz.id)
        categories_data[cat.id]["sum_percentage"] += a.percentage
        total_stars += 1
        
    planets = []
    for cat_id, data in categories_data.items():
        avg_percentage = data["sum_percentage"] / data["total_attempts"]
        
        # Mastery score combines percentage and volume (e.g. out of 100 max)
        # Volume weight: up to 5 quizzes adds 20% to the mastery feel
        volume_bonus = min(len(data["completed_quizzes"]) * 4, 20)
        mastery = (avg_percentage * 0.8) + volume_bonus
        
        planets.append({
            "category_id": cat_id,
            "category_name": data["category_name"],
            "mastery_score": min(mastery, 100.0),
            "total_attempts": data["total_attempts"],
            "completed_quizzes": len(data["completed_quizzes"])
        })
        
    return {
        "planets": planets,
        "total_stars": total_stars
    }

def log_integrity_events(db: Session, attempt_id: int, user_id: int, events: list[ExamIntegrityEventCreate]):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
    if not attempt:
        return None

    db_events = []
    for event_in in events:
        db_event = ExamIntegrityEvent(
            attempt_id=attempt.id,
            event_type=event_in.event_type,
            occurred_at=event_in.occurred_at,
            question_id=event_in.question_id,
            metadata_json=event_in.metadata_json,
            severity=event_in.severity
        )
        db_events.append(db_event)
        
    db.add_all(db_events)
    db.commit()
    
    return db_events

def get_attempt_integrity_events(db: Session, attempt_id: int, user_id: int):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
    if not attempt:
        return None
    return db.query(ExamIntegrityEvent).filter(ExamIntegrityEvent.attempt_id == attempt.id).order_by(ExamIntegrityEvent.occurred_at.asc()).all()
