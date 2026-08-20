from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
response = client.get("/api/v1/leaderboard/")
print("Status Code:", response.status_code)
print("Response:", response.text)
