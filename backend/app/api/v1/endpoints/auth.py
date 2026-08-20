from fastapi import APIRouter, Depends, HTTPException, Form, Request, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token, TokenPayload
from app.crud import user as crud_user
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.config import settings
from jose import jwt, JWTError
import time
from datetime import timedelta

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

@router.post("/login", response_model=Token)
def login_access_token(
    request: Request,
    response: Response,
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
        
    # Successful login, clear attempts
    if client_ip in login_attempts:
        del login_attempts[client_ip]
    
    # Access token is always short-lived
    access_token = create_access_token(user.id)
    
    # Refresh token lives for 60 days if remember_me is true, otherwise 1 day
    refresh_expires_delta = timedelta(days=60) if remember_me else timedelta(days=1)
    refresh_token = create_refresh_token(user.id, expires_delta=refresh_expires_delta)
    
    # Set the refresh token as an HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=int(refresh_expires_delta.total_seconds())
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=Token)
def refresh_token(
    response: Response,
    db: Session = Depends(deps.get_db),
    refresh_token: str | None = Cookie(default=None)
):
    """
    Exchange a valid refresh token for a new access token.
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        if token_data.sub is None or token_data.type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        
    user = crud_user.get_user_by_id(db, id=int(token_data.sub))
    if not user or not user.status:
        raise HTTPException(status_code=401, detail="User not found or inactive")
        
    new_access_token = create_access_token(user.id)
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(response: Response):
    """
    Logout by clearing the refresh token cookie.
    """
    response.delete_cookie("refresh_token", secure=True, samesite="none", httponly=True)
    return {"message": "Successfully logged out"}
