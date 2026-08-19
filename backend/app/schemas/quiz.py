from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.quiz import QuizStatus, DifficultyLevel

# Option Schemas
class OptionBase(BaseModel):
    option_text: str
    is_correct: bool = False
    story_consequence: Optional[str] = None

class OptionCreate(OptionBase):
    pass

class OptionResponse(OptionBase):
    id: int
    question_id: int
    
    class Config:
        from_attributes = True

class StudentOptionResponse(BaseModel):
    id: int
    option_text: str
    question_id: int
    story_consequence: Optional[str] = None
    
    class Config:
        from_attributes = True

# Question Schemas
class QuestionBase(BaseModel):
    question_text: str
    marks: float = 1.0
    explanation: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    story_context: Optional[str] = None

class QuestionCreate(QuestionBase):
    options: List[OptionCreate]

class QuestionResponse(QuestionBase):
    id: int
    quiz_id: int
    created_at: datetime
    options: List[OptionResponse] = []

    class Config:
        from_attributes = True

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    marks: Optional[float] = None
    explanation: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    story_context: Optional[str] = None

class StudentQuestionResponse(BaseModel):
    id: int
    question_text: str
    marks: float = 1.0
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    quiz_id: int
    created_at: datetime
    story_context: Optional[str] = None
    options: List[StudentOptionResponse] = []

    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

# Quiz Schemas
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    duration: Optional[int] = None
    passing_score: Optional[float] = None
    max_attempts: int = 1
    status: QuizStatus = QuizStatus.DRAFT
    join_code: Optional[str] = None
    is_story_mode: bool = False

class QuizCreate(QuizBase):
    pass

class QuizResponse(QuizBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True

class QuizDetailResponse(QuizResponse):
    questions: List[QuestionResponse] = []

class StudentQuizDetailResponse(QuizResponse):
    questions: List[StudentQuestionResponse] = []
    previous_attempts_count: Optional[int] = 0

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    difficulty: Optional[DifficultyLevel] = None
    duration: Optional[int] = None
    passing_score: Optional[float] = None
    max_attempts: Optional[int] = None
    status: Optional[QuizStatus] = None
    is_story_mode: Optional[bool] = None
