def get_admin_token(client):
    # Register an admin first if not exists (assuming we can manually create one for tests)
    # Since we can't easily set role to ADMIN via register endpoint, we will mock it in tests.
    pass

def test_unauthorized_admin_access(client):
    # Register a student
    client.post("/api/v1/auth/register", json={
        "email": "student123@example.com",
        "name": "Student",
        "password": "password"
    })
    login_response = client.post("/api/v1/auth/login", data={
        "username": "student123@example.com",
        "password": "password"
    })
    token = login_response.json()["access_token"]
    
    # Try accessing admin analytics
    response = client.get("/api/v1/admin/analytics", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403

def test_rate_limiting_auth(client):
    # Try to login many times with wrong password
    for _ in range(6):
        response = client.post("/api/v1/auth/login", data={
            "username": "student123@example.com",
            "password": "wrongpassword"
        })
    assert response.status_code == 429
