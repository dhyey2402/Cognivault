from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.quiz import CategoryCreate, CategoryUpdate, CategoryResponse
from app.crud import quiz as crud_quiz
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db)):
    return crud_quiz.get_categories(db, skip=skip, limit=limit)

@router.post("/", response_model=CategoryResponse)
def create_category(
    category_in: CategoryCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    return crud_quiz.create_category(db, category_in)

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    category = crud_quiz.update_category(db, category_id=category_id, category=category_in)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    category = crud_quiz.delete_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return None
