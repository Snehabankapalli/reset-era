from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.models import Task
from app.db.session import get_db
from app.services.planning_service import build_brutal_three

router = APIRouter(prefix="/plans", tags=["plans"])


def _task_to_dict(task: Task) -> dict:
    return {
        "id": str(task.id),
        "user_id": str(task.user_id) if task.user_id else None,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "category": task.category,
        "urgency_score": float(task.urgency_score or 0),
        "impact_score": float(task.impact_score or 0),
        "effort_score": float(task.effort_score or 0),
        "priority_score": float(task.priority_score or 0),
        "avoidance_count": int(task.avoidance_count or 0),
        "is_pinned": bool(task.is_pinned),
    }


@router.post("/generate")
def generate_plan(user_id: str = Query(...), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    task_dicts = [_task_to_dict(task) for task in tasks]
    plan = build_brutal_three(task_dicts)
    return {
        "plan_id": "generated-plan-v1",
        **plan,
    }


@router.get("/today")
def get_today_plan():
    return {"plan_id": None, "message": "No plan for today yet. Create a brain dump first."}
