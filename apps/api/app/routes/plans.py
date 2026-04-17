from fastapi import APIRouter

router = APIRouter()


@router.post("/plans/generate")
def generate_plan():
    return {
        "plan_id": "stub-plan-id",
        "brutal_three": [
            {
                "title": "Fix Kafka partition skew",
                "why_selected": "Blocking downstream reliability.",
                "first_step": "Open consumer lag dashboard and inspect partition distribution.",
                "estimated_minutes": 25
            },
            {
                "title": "Ship healthcare repo README",
                "why_selected": "Unblocks portfolio clarity.",
                "first_step": "Write architecture bullets for ingestion, validation, storage, and observability.",
                "estimated_minutes": 20
            },
            {
                "title": "Reply to recruiter",
                "why_selected": "Immediate leverage move.",
                "first_step": "Send your available interview windows for next week.",
                "estimated_minutes": 5
            }
        ],
        "reasoning_summary": "High-impact mix of technical, portfolio, and career leverage.",
        "estimated_total_minutes": 50
    }


@router.get("/plans/today")
def get_today_plan():
    return {"plan_id": None, "message": "No plan for today yet. Create a brain dump first."}
