from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, categories, quizzes, attempts, admin, leaderboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(attempts.router, prefix="/attempts", tags=["attempts"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])
