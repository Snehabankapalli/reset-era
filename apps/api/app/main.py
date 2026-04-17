from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.dumps import router as dumps_router
from app.routes.plans import router as plans_router
from app.routes.tasks import router as tasks_router
from app.routes.reflections import router as reflections_router

app = FastAPI(title="Reset Era API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(dumps_router, prefix="/v1")
app.include_router(plans_router, prefix="/v1")
app.include_router(tasks_router, prefix="/v1")
app.include_router(reflections_router, prefix="/v1")


@app.get("/")
def root():
    return {"name": "Reset Era API", "status": "ok"}
