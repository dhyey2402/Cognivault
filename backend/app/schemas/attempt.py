from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.quiz import AttemptStatus
from app.schemas.quiz import QuizResponse, QuestionResponse, OptionResponse

class AnswerBase(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None

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
