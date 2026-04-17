from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Task

router = APIRouter(prefix="/reflections", tags=["reflections"])


class ReflectionCreateRequest(BaseModel):
    task_id: UUID
    sentiment: Literal["easy", "expected", "grind"]


@router.post("")
def create_reflection(payload: ReflectionCreateRequest, db: Session = Depends(get_db)) -> dict:
    task = db.query(Task).filter(Task.id == payload.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    current_effort = float(task.effort_score or 0.5)

    if payload.sentiment == "easy":
        task.effort_score = max(0.1, round(current_effort - 0.1, 3))
    elif payload.sentiment == "grind":
        task.effort_score = min(1.0, round(current_effort + 0.1, 3))

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)

    return {
        "task_id": str(task.id),
        "sentiment": payload.sentiment,
        "updated_effort_score": float(task.effort_score),
        "message": "Reflection captured.",
    }
