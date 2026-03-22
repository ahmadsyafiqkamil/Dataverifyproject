from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_port: int = 8000
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    debug: bool = True

    model_config = {"env_prefix": "", "env_file": ".env"}


settings = Settings()
