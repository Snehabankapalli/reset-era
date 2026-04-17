from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Iterable

from sqlalchemy.orm import Session

from app.db.models import Task


FREEZE_PROTECTED_STATUSES = {"in_progress", "done", "deep_freeze"}
COOLING_MIN_AGE_HOURS = 72
FREEZE_MIN_AGE_HOURS = 120


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def should_move_to_cooling(task: Task, now: datetime) -> bool:
    if task.status != "active":
        return False
    if getattr(task, "is_pinned", False):
        return False
    if task.status in FREEZE_PROTECTED_STATUSES:
        return False
    if float(task.urgency_score or 0) >= 0.5:
        return False
    if float(task.impact_score or 0) >= 0.6 and int(task.avoidance_count or 0) == 0:
        return False

    age_hours = (now - task.updated_at).total_seconds() / 3600 if task.updated_at else 0
    repeatedly_avoided = int(task.avoidance_count or 0) >= 1
    stale_enough = age_hours >= COOLING_MIN_AGE_HOURS

    return stale_enough and (repeatedly_avoided or float(task.impact_score or 0) < 0.6)


def should_move_to_deep_freeze(task: Task, now: datetime) -> bool:
    if task.status != "cooling":
        return False
    if getattr(task, "is_pinned", False):
        return False
    if float(task.urgency_score or 0) >= 0.5:
        return False

    age_hours = (now - task.updated_at).total_seconds() / 3600 if task.updated_at else 0
    return age_hours >= FREEZE_MIN_AGE_HOURS


def run_deep_freeze(db: Session, user_id: str | None = None) -> dict:
    now = utcnow()

    query = db.query(Task)
    if user_id:
        query = query.filter(Task.user_id == user_id)

    tasks: Iterable[Task] = query.all()

    cooled = 0
    frozen = 0

    for task in tasks:
        if should_move_to_cooling(task, now):
            task.status = "cooling"
            task.updated_at = now
            cooled += 1
            continue

        if should_move_to_deep_freeze(task, now):
            task.status = "deep_freeze"
            task.updated_at = now
            frozen += 1

    db.commit()

    return {
        "cooled_count": cooled,
        "frozen_count": frozen,
        "message": "Tasks were gently moved out of the way to keep the list clear.",
    }
