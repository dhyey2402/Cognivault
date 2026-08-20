from app.db.database import SessionLocal
from app.models.quiz import Quiz, Question, Option, Attempt, Answer
from app.models.user import User
from app.crud.user import get_user_by_email, create_user
from app.schemas.user import UserCreate

db = SessionLocal()
email = 'admin@quizora.com'
user = get_user_by_email(db, email=email)
if not user:
    user_in = UserCreate(email=email, password='adminpassword', name='System Admin')
    user = create_user(db, user=user_in)
    user.role = 'ADMIN'
    db.commit()
    print('Admin created!')
else:
    user.role = 'ADMIN'
    db.commit()
    print('Existing user made Admin!')
