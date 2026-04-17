from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models import Task
from app.db.session import get_db
from app.services.stuck_service import rewrite_stuck_step

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskCreateRequest(BaseModel):
    user_id: str
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    status: Literal["active", "cooling", "in_progress", "done", "blocked", "delayed", "deep_freeze"] = "active"
    category: Literal["do_now", "do_today", "schedule_later", "let_go"] | None = None
    urgency_score: float = Field(default=0.5, ge=0, le=1)
    impact_score: float = Field(default=0.5, ge=0, le=1)
    effort_score: float = Field(default=0.5, ge=0, le=1)
    source_brain_dump_id: str | None = None
    is_pinned: bool = False


class TaskUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: Literal["active", "cooling", "in_progress", "done", "blocked", "delayed", "deep_freeze"] | None = None
    category: Literal["do_now", "do_today", "schedule_later", "let_go"] | None = None
    urgency_score: float | None = Field(default=None, ge=0, le=1)
    impact_score: float | None = Field(default=None, ge=0, le=1)
    effort_score: float | None = Field(default=None, ge=0, le=1)
    is_pinned: bool | None = None


class TaskEventRequest(BaseModel):
    event_type: Literal["started", "done", "delayed", "blocked", "restored"]
    metadata: dict = Field(default_factory=dict)


class TaskCompleteRequest(BaseModel):
    sentiment: Literal["easy", "expected", "grind"] | None = None


class RepoContextPayload(BaseModel):
    repo_name: str | None = None
    readme_summary: str | None = None
    structure: list[str] = Field(default_factory=list)


class StuckRequest(BaseModel):
    friction_note: str = Field(..., min_length=1, max_length=300)
    current_first_step: str = Field(..., min_length=1, max_length=500)
    repo_context: RepoContextPayload | None = None


def serialize_task(task: Task) -> dict:
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
        "source_brain_dump_id": str(task.source_brain_dump_id) if task.source_brain_dump_id else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


@router.get("")
def list_tasks(
    user_id: str = Query(...),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(Task).filter(Task.user_id == user_id)
    if status:
        query = query.filter(Task.status == status)

    tasks = query.order_by(Task.updated_at.desc()).all()
    return {"tasks": [serialize_task(task) for task in tasks], "count": len(tasks)}


@router.post("")
def create_task(payload: TaskCreateRequest, db: Session = Depends(get_db)) -> dict:
    task = Task(
        user_id=payload.user_id,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        category=payload.category,
        urgency_score=payload.urgency_score,
        impact_score=payload.impact_score,
        effort_score=payload.effort_score,
        source_brain_dump_id=payload.source_brain_dump_id,
        is_pinned=payload.is_pinned,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return serialize_task(task)


@router.patch("/{task_id}")
def update_task(task_id: UUID, payload: TaskUpdateRequest, db: Session = Depends(get_db)) -> dict:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return serialize_task(task)


@router.post("/{task_id}/events")
def record_task_event(task_id: UUID, payload: TaskEventRequest, db: Session = Depends(get_db)) -> dict:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if payload.event_type == "started":
        task.status = "in_progress"
    elif payload.event_type == "done":
        task.status = "done"
    elif payload.event_type == "delayed":
        task.status = "delayed"
        task.avoidance_count = int(task.avoidance_count or 0) + 1
    elif payload.event_type == "blocked":
        task.status = "blocked"
    elif payload.event_type == "restored":
        task.status = "active"

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)

    return {
        "task_id": str(task_id),
        "event_type": payload.event_type,
        "task": serialize_task(task),
    }


@router.post("/{task_id}/complete")
def complete_task(task_id: UUID, payload: TaskCompleteRequest, db: Session = Depends(get_db)) -> dict:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    current_effort = float(task.effort_score or 0.5)

    if payload.sentiment == "easy":
        task.effort_score = max(0.1, round(current_effort - 0.1, 3))
    elif payload.sentiment == "grind":
        task.effort_score = min(1.0, round(current_effort + 0.1, 3))

    task.status = "done"
    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)

    return {
        "task_id": str(task.id),
        "status": task.status,
        "updated_effort_score": float(task.effort_score),
    }


@router.post("/{task_id}/stuck")
def resolve_stuck_state(task_id: UUID, payload: StuckRequest, db: Session = Depends(get_db)) -> dict:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_first_step, reason = rewrite_stuck_step(
        task_title=task.title,
        current_first_step=payload.current_first_step,
        friction_note=payload.friction_note,
        repo_context=payload.repo_context.model_dump() if payload.repo_context else None,
    )

    return {
        "task_id": str(task.id),
        "updated_first_step": updated_first_step,
        "reason": reason,
    }
