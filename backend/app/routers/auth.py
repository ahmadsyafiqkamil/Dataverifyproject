from fastapi import APIRouter, HTTPException

from ..config import settings
from ..models.auth import AuthResponse, ChallengeRequest, VerifyRequest
from ..models.common import ApiResponse
from ..services.auth_service import (
    create_jwt,
    generate_nonce,
    verify_and_consume_nonce,
    verify_signature,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/challenge")
def challenge(body: ChallengeRequest) -> ApiResponse:
    """Step 1 of wallet auth: generate a one-time nonce for the given address."""
    nonce = generate_nonce(body.address)
    return ApiResponse(success=True, data={"nonce": nonce})


@router.post("/verify")
def verify(body: VerifyRequest) -> ApiResponse:
    """Step 2: verify wallet signature and return JWT."""
    if not verify_and_consume_nonce(body.nonce, body.address):
        raise HTTPException(status_code=401, detail="Nonce invalid or expired")

    if not verify_signature(body.address, body.signature, body.nonce):
        raise HTTPException(status_code=401, detail="Signature tidak valid")

    token = create_jwt(address=body.address, role="all", is_demo=False)
    return ApiResponse(
        success=True,
        data=AuthResponse(token=token, address=body.address, role="all", is_demo=False).model_dump(),
    )


@router.post("/demo")
def demo_login() -> ApiResponse:
    """Instant demo login — no wallet required. Gated by DEMO_MODE setting."""
    if not settings.demo_mode:
        raise HTTPException(status_code=403, detail="Demo mode is disabled")

    token = create_jwt(address="demo-user", role="all", is_demo=True)
    return ApiResponse(
        success=True,
        data=AuthResponse(token=token, address="demo-user", role="all", is_demo=True).model_dump(),
    )
