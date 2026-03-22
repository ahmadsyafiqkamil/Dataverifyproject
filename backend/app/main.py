from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import auth, buyer, miner, network, validator


def create_app() -> FastAPI:
    app = FastAPI(
        title="DataVerify Subnet API",
        version="0.1.0",
        description="Backend API for the DataVerify synthetic data marketplace",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(buyer.router)
    app.include_router(miner.router)
    app.include_router(validator.router)
    app.include_router(network.router)
    app.include_router(auth.router)

    @app.get("/api/health")
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
