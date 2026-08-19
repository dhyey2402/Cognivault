from fastapi import APIRouter, Depends, HTTPException, Form, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.crud import user as crud_user
from app.core.security import verify_password, create_access_token
import time

router = APIRouter()

# Simple in-memory rate limiter
# Format: { ip_address: [timestamp1, timestamp2, ...] }
login_attempts = {}
MAX_ATTEMPTS = 5
WINDOW_SECONDS = 60

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    """
    Create new user.
    """
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud_user.create_user(db, user_in)
    return user

from datetime import timedelta

@router.post("/login", response_model=Token)
def login_access_token(
    request: Request,
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
    remember_me: bool = Form(False)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Rate Limiting Logic
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    if client_ip in login_attempts:
        # Remove attempts older than WINDOW_SECONDS
        login_attempts[client_ip] = [t for t in login_attempts[client_ip] if current_time - t < WINDOW_SECONDS]
        if len(login_attempts[client_ip]) >= MAX_ATTEMPTS:
            raise HTTPException(status_code=429, detail="Too many login attempts. Please try again later.")
    else:
        login_attempts[client_ip] = []
        
    login_attempts[client_ip].append(current_time)

    user = crud_user.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.status:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    expires_delta = timedelta(days=30) if remember_me else None
    
    # Successful login, clear attempts
    if client_ip in login_attempts:
        del login_attempts[client_ip]
    
    return {
        "access_token": create_access_token(user.id, expires_delta=expires_delta),
        "token_type": "bearer",
    }
