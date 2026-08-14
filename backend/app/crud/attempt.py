from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.quiz import Attempt, Answer, Question, Option, AttemptStatus
from app.schemas.attempt import AttemptCreate, AnswerCreate
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
            is_correct=is_correct
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
    attempt.time_taken = time_taken
    attempt.status = AttemptStatus.PASSED if passed else AttemptStatus.FAILED
    attempt.completed_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(attempt)
    return attempt

def get_user_attempts(db: Session, user_id: int):
    return db.query(Attempt).filter(Attempt.user_id == user_id).order_by(Attempt.started_at.desc()).all()

def get_attempt_detail(db: Session, attempt_id: int, user_id: int):
    return db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
