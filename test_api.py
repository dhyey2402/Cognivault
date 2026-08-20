import requests
import json

def test():
    # Login as admin to get token
    login_data = {
        "username": "admin@cognivault.com",
        "password": "password123"
    }
    r1 = requests.post("https://quizora-1b3d.onrender.com/api/v1/auth/login", data=login_data)
    if r1.status_code != 200:
        print("Login failed", r1.text)
        return
    token = r1.json().get("access_token")
    
    # Fetch quiz 8
    headers = {"Authorization": f"Bearer {token}"}
    r2 = requests.get("https://quizora-1b3d.onrender.com/api/v1/quizzes/8", headers=headers)
    print("Quiz 8 response:", json.dumps(r2.json(), indent=2))

if __name__ == "__main__":
    test()
