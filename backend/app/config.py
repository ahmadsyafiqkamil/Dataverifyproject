from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_port: int = 8000
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    debug: bool = True
    jwt_secret: str = "dev-secret-change-in-production-min-32-chars!!"
    jwt_expiry_hours: int = 24
    demo_mode: bool = True

    model_config = {"env_prefix": "", "env_file": ".env"}


settings = Settings()
