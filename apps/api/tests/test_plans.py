from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_generate_plan():
    response = client.post("/v1/plans/generate")
    assert response.status_code == 200
    data = response.json()
    assert len(data["brutal_three"]) == 3
    for item in data["brutal_three"]:
        assert "title" in item
        assert "first_step" in item
        assert "estimated_minutes" in item


def test_get_today_plan():
    response = client.get("/v1/plans/today")
    assert response.status_code == 200
