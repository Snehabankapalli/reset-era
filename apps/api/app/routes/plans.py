from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.models import Task
from app.db.session import get_db
from app.routes.tasks import serialize_task
from app.services.planning_service import build_brutal_three

router = APIRouter(prefix="/plans", tags=["plans"])


@router.post("/generate")
def generate_plan(user_id: str = Query(...), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    task_dicts = [serialize_task(task) for task in tasks]
    plan = build_brutal_three(task_dicts)
    return {
        "plan_id": "generated-plan-v1",
        **plan,
    }


@router.get("/today")
def get_today_plan():
    return {"plan_id": None, "message": "No plan for today yet. Create a brain dump first."}
