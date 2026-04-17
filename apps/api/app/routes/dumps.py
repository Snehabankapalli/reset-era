from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DumpRequest(BaseModel):
    raw_input: str
    input_mode: str = "text"
    energy_level: str | None = None
    available_minutes: int | None = None


@router.post("/dumps")
def create_dump(payload: DumpRequest):
    return {
        "brain_dump_id": "stub-dump-id",
        "processing_status": "completed",
        "clarifications_required": False,
        "clarifications": [],
        "provisional_tasks": [
            {
                "title": "Fix Kafka partition skew",
                "category": "do_now"
            },
            {
                "title": "Reply to recruiter",
                "category": "do_today"
            }
        ],
        "next_action": "generate_plan"
    }
