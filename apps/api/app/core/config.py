from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "Reset Era API"
    database_url: str = os.getenv("DATABASE_URL", "")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")


settings = Settings()
