from pydantic import BaseModel
from typing import Optional

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    student_name: str
    average_score: float
    quizzes_completed: int

    class Config:
        from_attributes = True
