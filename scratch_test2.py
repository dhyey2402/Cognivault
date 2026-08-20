import requests
import json

url = "https://quizora-1b3d.onrender.com/api/v1/leaderboard" # no trailing slash

# Test GET without trailing slash
response = requests.get(url, headers={
    "Origin": "https://quizora-mauve-eight.vercel.app"
}, allow_redirects=False)

print("GET Status:", response.status_code)
print("GET Headers:", dict(response.headers))
