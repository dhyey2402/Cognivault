from sqlalchemy import create_engine, text
import random
import string
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

try:
    engine = create_engine(DATABASE_URL)
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE quizzes ADD COLUMN join_code VARCHAR(10)"))
        print("Added join_code column.")
        
        # Update existing quizzes with a code
        quizzes = conn.execute(text("SELECT id FROM quizzes")).fetchall()
        for q in quizzes:
            code = generate_code()
            conn.execute(text("UPDATE quizzes SET join_code = :code WHERE id = :id"), {"code": code, "id": q[0]})
        
        # Add UNIQUE constraint after populating
        conn.execute(text("ALTER TABLE quizzes ADD CONSTRAINT uq_quizzes_join_code UNIQUE (join_code)"))
        print("Updated existing quizzes and added unique constraint.")
except Exception as e:
    print(f"Error: {e}")
