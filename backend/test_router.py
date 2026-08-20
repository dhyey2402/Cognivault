from fastapi import FastAPI
from fastapi.testclient import TestClient
import uvicorn

app = FastAPI()

@app.get("/{quiz_id}")
def read_quiz(quiz_id: int):
    return {"quiz_id": quiz_id}

@app.post("/{quiz_id}/questions")
def create_question(quiz_id: int):
    return {"status": "ok"}

client = TestClient(app)
try:
    print("GET /4:", client.get("/4").status_code)
    print("GET /4/questions:", client.get("/4/questions").status_code)
except Exception as e:
    print(e)
