from sqlalchemy.orm import Session
from app.models.quiz import Category, Quiz, Question, Option
from app.schemas.quiz import CategoryCreate, CategoryUpdate, QuizCreate, QuizUpdate, QuestionCreate, QuestionUpdate

# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: CategoryCreate):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: CategoryUpdate):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        update_data = category.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
    return db_category

# Quiz CRUD
def get_quizzes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Quiz).offset(skip).limit(limit).all()

def get_quiz(db: Session, quiz_id: int):
    return db.query(Quiz).filter(Quiz.id == quiz_id).first()

def get_quiz_by_code(db: Session, join_code: str):
    return db.query(Quiz).filter(Quiz.join_code == join_code).first()

import random
import string

def generate_join_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def create_quiz(db: Session, quiz: QuizCreate):
    quiz_data = quiz.model_dump()
    quiz_data['join_code'] = generate_join_code()
    
    # Ensure it's unique (simplified for prototype)
    while db.query(Quiz).filter(Quiz.join_code == quiz_data['join_code']).first():
        quiz_data['join_code'] = generate_join_code()

    db_quiz = Quiz(**quiz_data)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def update_quiz(db: Session, quiz_id: int, quiz: QuizUpdate):
    db_quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if db_quiz:
        update_data = quiz.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_quiz, key, value)
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
    return db_quiz

def delete_quiz(db: Session, quiz_id: int):
    db_quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if db_quiz:
        db.delete(db_quiz)
        db.commit()
    return db_quiz

# Question CRUD
def create_question_with_options(db: Session, quiz_id: int, question: QuestionCreate):
    db_question = Question(
        quiz_id=quiz_id,
        question_text=question.question_text,
        marks=question.marks,
        explanation=question.explanation,
        difficulty=question.difficulty
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    for opt in question.options:
        db_option = Option(
            question_id=db_question.id,
            option_text=opt.option_text,
            is_correct=opt.is_correct
        )
        db.add(db_option)
    
    db.commit()
    db.refresh(db_question)
    return db_question

def update_question(db: Session, question_id: int, question: QuestionUpdate):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        update_data = question.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_question, key, value)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question

def delete_category(db: Session, category_id: int):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category
