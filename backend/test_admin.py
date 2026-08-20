from app.api.v1.endpoints.admin import get_dashboard_analytics
from app.db.database import SessionLocal
from app.models.user import User

db = SessionLocal()
# user = ... (Not strictly needed if we don't use it, but get_dashboard_analytics doesn't use current_user inside the function!)
try:
    res = get_dashboard_analytics(db=db, current_user=User())
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
