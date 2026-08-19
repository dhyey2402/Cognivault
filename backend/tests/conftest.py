import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base
from app.api import deps
import os

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_quiz.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[deps.get_db] = override_get_db

@pytest.fixture(scope="session")
def db_engine():
    yield engine
    # Cleanup after all tests
    if os.path.exists("./test_quiz.db"):
        os.remove("./test_quiz.db")

@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
