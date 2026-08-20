import requests
import json

url = "https://quizora-1b3d.onrender.com/api/v1/leaderboard/"

# 1. Test without token (should be 401, check CORS)
response = requests.options(url, headers={
    "Origin": "https://quizora-mauve-eight.vercel.app",
    "Access-Control-Request-Method": "GET"
})
print("OPTIONS Status:", response.status_code)
print("OPTIONS Headers:", dict(response.headers))

response = requests.get(url, headers={
    "Origin": "https://quizora-mauve-eight.vercel.app"
})
print("\nGET (no auth) Status:", response.status_code)
print("GET (no auth) Headers:", dict(response.headers))
print("GET (no auth) Body:", response.text)
