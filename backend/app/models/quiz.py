from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class QuizStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    UNPUBLISHED = "UNPUBLISHED"

class DifficultyLevel(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class AttemptStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    PASSED = "PASSED"
    FAILED = "FAILED"

class ExamIntegrityEventType(str, enum.Enum):
    RIGHT_CLICK_ATTEMPT = "RIGHT_CLICK_ATTEMPT"
    COPY_ATTEMPT = "COPY_ATTEMPT"
    CUT_ATTEMPT = "CUT_ATTEMPT"
    PASTE_ATTEMPT = "PASTE_ATTEMPT"
    PRINT_ATTEMPT = "PRINT_ATTEMPT"
    DEVTOOLS_ATTEMPT = "DEVTOOLS_ATTEMPT"
    TAB_SWITCH = "TAB_SWITCH"
    TAB_RETURN = "TAB_RETURN"
    FOCUS_LOST = "FOCUS_LOST"
    FOCUS_REGAINED = "FOCUS_REGAINED"
    FULLSCREEN_EXIT = "FULLSCREEN_EXIT"
    FULLSCREEN_ENTER = "FULLSCREEN_ENTER"
    KEYBOARD_VIOLATION = "KEYBOARD_VIOLATION"
    DRAG_ATTEMPT = "DRAG_ATTEMPT"
    EXTERNAL_DROP_ATTEMPT = "EXTERNAL_DROP_ATTEMPT"
    NAVIGATION_ATTEMPT = "NAVIGATION_ATTEMPT"

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    quizzes = relationship("Quiz", back_populates="category", cascade="all, delete-orphan")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    join_code = Column(String(10), unique=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"))
    difficulty = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.MEDIUM)
    duration = Column(Integer) # duration in minutes
    passing_score = Column(Float) # percentage
    max_attempts = Column(Integer, default=1)
    status = Column(SQLEnum(QuizStatus), default=QuizStatus.DRAFT)
    is_story_mode = Column(Boolean, default=False)
    is_secure_mode = Column(Boolean, default=False)
    secure_mode_config = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))
    question_text = Column(Text, nullable=False)
    marks = Column(Float, default=1.0)
    explanation = Column(Text)
    difficulty = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.MEDIUM)
    story_context = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    story_consequence = Column(Text, nullable=True)

    question = relationship("Question", back_populates="options")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))
    score = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    correct_answers = Column(Integer, default=0)
    incorrect_answers = Column(Integer, default=0)
    unanswered = Column(Integer, default=0)
    time_taken = Column(Integer, default=0) # time taken in seconds
    status = Column(SQLEnum(AttemptStatus), default=AttemptStatus.IN_PROGRESS)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    quiz = relationship("Quiz", back_populates="attempts")
    answers = relationship("Answer", back_populates="attempt", cascade="all, delete-orphan")
    integrity_events = relationship("ExamIntegrityEvent", back_populates="attempt", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    selected_option_id = Column(Integer, ForeignKey("options.id", ondelete="CASCADE"), nullable=True)
    is_correct = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0)
    answer_changes = Column(Integer, default=0)

    attempt = relationship("Attempt", back_populates="answers")
    question = relationship("Question")
    selected_option = relationship("Option")

class ExamIntegrityEvent(Base):
    __tablename__ = "exam_integrity_events"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id", ondelete="CASCADE"), index=True)
    event_type = Column(SQLEnum(ExamIntegrityEventType), nullable=False)
    occurred_at = Column(DateTime(timezone=True), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    metadata_json = Column(Text, nullable=True)
    severity = Column(String(50), default="INFO")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attempt = relationship("Attempt", back_populates="integrity_events")
    question = relationship("Question")
