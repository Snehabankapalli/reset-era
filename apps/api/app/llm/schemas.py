from pydantic import BaseModel


class IntakeTaskCandidate(BaseModel):
    title: str
    description: str | None = None
    domain: str | None = None
    effort_guess: float = 0.5
    emotional_weight: float = 0.5


class BrutalThreeItem(BaseModel):
    title: str
    why_selected: str
    first_step: str
    estimated_minutes: int
