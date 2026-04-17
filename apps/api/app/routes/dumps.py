from fastapi import APIRouter
from pydantic import BaseModel

from app.services.intake_service import parse_brain_dump

router = APIRouter(prefix="/dumps", tags=["dumps"])


class DumpRequest(BaseModel):
    raw_input: str
    input_mode: str = "text"
    energy_level: str | None = None
    available_minutes: int | None = None


@router.post("")
def create_dump(payload: DumpRequest):
    provisional_tasks = parse_brain_dump(payload.raw_input)
    return {
        "brain_dump_id": "stub-dump-id",
        "processing_status": "completed",
        "clarifications_required": False,
        "clarifications": [],
        "provisional_tasks": provisional_tasks,
        "next_action": "create_tasks_then_generate_plan",
    }
