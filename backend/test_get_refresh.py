import urllib.request

req = urllib.request.Request(
    'https://quizora-1b3d.onrender.com/api/v1/auth/refresh',
    method='GET',
    headers={'Origin': 'https://quizora-mauve-eight.vercel.app'}
)

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Headers:", e.headers)
except Exception as e:
    print("Error:", e)
