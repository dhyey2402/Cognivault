from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.quiz import AttemptStatus, ExamIntegrityEventType
from app.schemas.quiz import QuizResponse, QuestionResponse, OptionResponse

class AnswerBase(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    time_spent_seconds: int = 0
    answer_changes: int = 0

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    attempt_id: int
    is_correct: bool
    question: Optional[QuestionResponse] = None
    selected_option: Optional[OptionResponse] = None

    class Config:
        from_attributes = True

class AttemptBase(BaseModel):
    quiz_id: int

class AttemptCreate(AttemptBase):
    pass

class AttemptUpdate(BaseModel):
    time_taken: Optional[int] = None
    status: Optional[AttemptStatus] = None

class AttemptSubmit(BaseModel):
    answers: List[AnswerCreate]
    time_taken: int

class StudentAnalytics(BaseModel):
    total_attempts: int
    passed_quizzes: int
    average_score: float
    highest_score: float
    recent_attempts: list
    performance_history: list

class AttemptResponse(AttemptBase):
    id: int
    user_id: int
    score: float
    percentage: float
    correct_answers: int
    incorrect_answers: int
    unanswered: int
    time_taken: int
    status: AttemptStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    quiz: Optional[QuizResponse] = None

    class Config:
        from_attributes = True

class AttemptDetailResponse(AttemptResponse):
    answers: List[AnswerResponse] = []

class FocusDNA(BaseModel):
    behavioral_profile: str
    insights: List[str]
    average_time_per_question: float
    total_answer_changes: int
    data_sufficient: bool

class MemoryHeatmapQuestion(BaseModel):
    question_id: int
    question_text: str
    is_correct: bool
    time_spent_seconds: int
    answer_changes: int
    state: str # 'KNEW_IT', 'GUESSED', 'CHANGED', 'STRUGGLED', 'UNANSWERED'

class MemoryHeatmap(BaseModel):
    attempt_id: int
    questions: List[MemoryHeatmapQuestion]
    summary: dict

class KnowledgeGalaxyCategory(BaseModel):
    category_id: int
    category_name: str
    mastery_score: float # 0 to 100
    total_attempts: int
    completed_quizzes: int

class KnowledgeGalaxy(BaseModel):
    planets: List[KnowledgeGalaxyCategory]
    total_stars: int

class ExamIntegrityEventBase(BaseModel):
    event_type: ExamIntegrityEventType
    occurred_at: datetime
    question_id: Optional[int] = None
    metadata_json: Optional[str] = None
    severity: Optional[str] = "INFO"

class ExamIntegrityEventCreate(ExamIntegrityEventBase):
    pass

class ExamIntegrityEventBatch(BaseModel):
    events: List[ExamIntegrityEventCreate]

class ExamIntegrityEventResponse(ExamIntegrityEventBase):
    id: int
    attempt_id: int
    created_at: datetime

    class Config:
        from_attributes = True
