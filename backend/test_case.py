from sqlalchemy import create_engine, select, case, func
from sqlalchemy.orm import Session
from app.models.quiz import Attempt, AttemptStatus
from app.db.database import Base

try:
    c = case((Attempt.status == AttemptStatus.PASSED, 1), else_=0)
    print("Case statement created successfully")
except Exception as e:
    print("Error:", e)
