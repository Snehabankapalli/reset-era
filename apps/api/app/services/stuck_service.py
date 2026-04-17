from __future__ import annotations

from typing import Any


def rewrite_stuck_step(
    task_title: str,
    current_first_step: str,
    friction_note: str,
    repo_context: dict[str, Any] | None = None,
) -> tuple[str, str]:
    note = friction_note.lower().strip()
    structure = [item.lower() for item in (repo_context or {}).get("structure", [])]

    if "don't know" in note or "do not know" in note or "where" in note:
        if "dashboard" in note and "dashboards" in structure:
            return (
                "Open the dashboards directory or Grafana first and locate the exact consumer lag dashboard.",
                "Reduced the step to remove the immediate location blocker.",
            )
        return (
            "Open the most likely project folder or tool first and locate the exact place this task starts.",
            "Reduced the step to remove the immediate location blocker.",
        )

    if "docs" in note or "documentation" in note:
        return (
            "Open the relevant documentation or README section before changing anything else.",
            "Reduced the step to unblock missing reference information.",
        )

    if "login" in note or "access" in note or "permission" in note:
        return (
            "Open the required tool or environment and verify access before continuing the task.",
            "Reduced the step to unblock environment access.",
        )

    if "too big" in note or "overwhelming" in note or "confusing" in note:
        return (
            f"Open a note and write the first single check or file to inspect for: {task_title}.",
            "Reduced the step by shrinking the scope before execution.",
        )

    if "not sure" in note:
        return (
            f"Write one sentence defining what done looks like for: {task_title}.",
            "Reduced the step to clarify the immediate target.",
        )

    return (
        f"Break the current step into the smallest visible action and do only that for: {task_title}.",
        "Reduced the step into a smaller executable move.",
    )
