from __future__ import annotations

from typing import Any


STATUS_PRIORITY_ELIGIBLE = {"active", "delayed", "blocked", "in_progress"}


def clamp_score(value: float, min_value: float = 0.0, max_value: float = 1.0) -> float:
    return max(min_value, min(max_value, value))


def compute_priority_score(task: dict[str, Any]) -> float:
    """Simple v1 scoring formula. Evolve later with strategic alignment, blockers, overdue boosts."""
    impact = float(task.get("impact_score", 0.5))
    urgency = float(task.get("urgency_score", 0.5))
    effort = float(task.get("effort_score", 0.5))
    avoidance_count = int(task.get("avoidance_count", 0))

    raw_score = (impact * 0.5) + (urgency * 0.3) - (effort * 0.2) - (avoidance_count * 0.05)
    return round(clamp_score(raw_score, 0.0, 1.5), 3)


def generate_first_step(task: dict[str, Any]) -> str:
    """Deterministic v1 fallback before LLM-generated first steps."""
    title = task.get("title", "this task")
    description = task.get("description") or ""

    normalized = title.lower()

    if "reply" in normalized or "email" in normalized:
        return f"Open your inbox and draft a 2-line response for: {title}."
    if "readme" in normalized or "docs" in normalized:
        return f"Open the repo and write the first 3 bullets for: {title}."
    if "kafka" in normalized:
        return "Open your monitoring dashboard and inspect lag or partition distribution for the affected topic."
    if "spark" in normalized:
        return "Open the latest Spark job logs and identify the slowest stage before changing any code."
    if "dbt" in normalized:
        return "Open the failing dbt model or schema.yml file and isolate the first broken test or model dependency."
    if description:
        return f"Open the task notes and write the first concrete action for: {title}."

    return f"Open a blank note and define the first concrete step for: {title}."


def build_brutal_three(tasks: list[dict[str, Any]]) -> dict[str, Any]:
    eligible_tasks = [task for task in tasks if task.get("status") in STATUS_PRIORITY_ELIGIBLE]

    rescored_tasks: list[dict[str, Any]] = []
    for task in eligible_tasks:
        score = compute_priority_score(task)
        enriched = {
            **task,
            "priority_score": score,
            "first_step": generate_first_step(task),
        }
        rescored_tasks.append(enriched)

    top_three = sorted(
        rescored_tasks,
        key=lambda item: (item["priority_score"], item.get("impact_score", 0)),
        reverse=True,
    )[:3]

    reasoning_summary = "High-impact tasks with the best urgency-to-effort tradeoff for today."
    estimated_total_minutes = sum(20 if task.get("effort_score", 0.5) >= 0.6 else 10 for task in top_three)

    brutal_three = [
        {
            "id": task["id"],
            "title": task["title"],
            "why_selected": f"Priority score {task['priority_score']} based on impact, urgency, and effort.",
            "first_step": task["first_step"],
            "estimated_minutes": 20 if task.get("effort_score", 0.5) >= 0.6 else 10,
            "priority_score": task["priority_score"],
        }
        for task in top_three
    ]

    return {
        "brutal_three": brutal_three,
        "reasoning_summary": reasoning_summary,
        "estimated_total_minutes": estimated_total_minutes,
    }
