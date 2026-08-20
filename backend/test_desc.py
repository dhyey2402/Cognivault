from sqlalchemy import create_engine, desc
try:
    d = desc("average_score")
    print("Success:", d)
except Exception as e:
    print("Error:", e)
