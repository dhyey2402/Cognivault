import requests

url = "https://quizora-1b3d.onrender.com/api/v1/leaderboard" # no trailing slash

response = requests.options(url, headers={
    "Origin": "https://quizora-mauve-eight.vercel.app",
    "Access-Control-Request-Method": "GET"
}, allow_redirects=False)

print("OPTIONS Status:", response.status_code)
print("OPTIONS Headers:", dict(response.headers))
