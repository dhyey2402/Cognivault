from app.main import app
from fastapi.testclient import TestClient
from app.db.database import SessionLocal
from app.api import deps
from app.models.user import User, RoleEnum
import time

def override_get_current_admin():
    user = User(id=1, email="admin@test.com", role=RoleEnum.ADMIN, status=True)
    return user

app.dependency_overrides[deps.get_current_admin] = override_get_current_admin

client = TestClient(app)

response = client.get("/api/v1/admin/analytics")
print("Status:", response.status_code)
if response.status_code != 200:
    print("Response:", response.text)
else:
    print("Success")
