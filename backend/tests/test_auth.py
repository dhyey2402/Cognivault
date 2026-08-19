def test_register_success(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "testuser@example.com",
        "name": "Test User",
        "password": "testpassword123"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"

def test_register_duplicate(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "testuser@example.com",
        "name": "Test User",
        "password": "testpassword123"
    })
    assert response.status_code == 400

def test_login_success(client):
    response = client.post("/api/v1/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_password(client):
    response = client.post("/api/v1/auth/login", data={
        "username": "testuser@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 400

def test_login_invalid_email(client):
    response = client.post("/api/v1/auth/login", data={
        "username": "invalid@example.com",
        "password": "testpassword123"
    })
    assert response.status_code == 400

def test_protected_endpoint_without_auth(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
