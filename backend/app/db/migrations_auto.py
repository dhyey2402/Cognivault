from sqlalchemy import inspect, text
from app.db.database import engine
import logging

logger = logging.getLogger(__name__)

def auto_migrate():
    inspector = inspect(engine)
    
    # Check quizzes table
    if inspector.has_table("quizzes"):
        columns = [col['name'] for col in inspector.get_columns("quizzes")]
        with engine.connect() as conn:
            if 'is_story_mode' not in columns:
                logger.info("Adding is_story_mode to quizzes")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN is_story_mode BOOLEAN DEFAULT FALSE"))
            if 'is_secure_mode' not in columns:
                logger.info("Adding is_secure_mode to quizzes")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN is_secure_mode BOOLEAN DEFAULT FALSE"))
            if 'secure_mode_config' not in columns:
                logger.info("Adding secure_mode_config to quizzes")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN secure_mode_config TEXT"))
            conn.commit()

    # Check questions table
    if inspector.has_table("questions"):
        columns = [col['name'] for col in inspector.get_columns("questions")]
        with engine.connect() as conn:
            if 'story_context' not in columns:
                logger.info("Adding story_context to questions")
                conn.execute(text("ALTER TABLE questions ADD COLUMN story_context TEXT"))
            conn.commit()

    # Check options table
    if inspector.has_table("options"):
        columns = [col['name'] for col in inspector.get_columns("options")]
        with engine.connect() as conn:
            if 'story_consequence' not in columns:
                logger.info("Adding story_consequence to options")
                conn.execute(text("ALTER TABLE options ADD COLUMN story_consequence TEXT"))
            conn.commit()
    
    logger.info("Auto migrations completed successfully.")
