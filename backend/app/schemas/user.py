from pydantic import BaseModel, EmailStr
from app.models.user import RoleEnum
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.STUDENT

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    status: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
