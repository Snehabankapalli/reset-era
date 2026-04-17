def parse_brain_dump(raw_input: str) -> list[dict]:
    """Temporary stub until LLM parsing is wired in."""
    lines = [line.strip("- ").strip() for line in raw_input.splitlines() if line.strip()]
    if not lines:
        return [{"title": raw_input[:80], "category": "do_today"}]
    return [{"title": line, "category": "do_today"} for line in lines[:5]]
