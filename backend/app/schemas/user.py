from pydantic import BaseModel, EmailStr, Field
from app.models.user import RoleEnum
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: RoleEnum = RoleEnum.STUDENT

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    status: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
