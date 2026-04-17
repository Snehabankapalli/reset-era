from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_dump():
    response = client.post("/v1/dumps", json={
        "raw_input": "fix kafka, reply to recruiter, update readme"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["brain_dump_id"]
    assert data["processing_status"] == "completed"
    assert isinstance(data["provisional_tasks"], list)


def test_create_dump_with_options():
    response = client.post("/v1/dumps", json={
        "raw_input": "taxes, clean desk",
        "energy_level": "low",
        "available_minutes": 30
    })
    assert response.status_code == 200


def test_create_dump_missing_input():
    response = client.post("/v1/dumps", json={})
    assert response.status_code == 422
