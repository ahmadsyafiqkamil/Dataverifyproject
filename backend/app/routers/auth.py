from fastapi import APIRouter

from ..models.common import ApiResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/connect")
def connect_wallet() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "address": "5GrwvaEF...8PH3P",
            "role": "buyer",
            "connected": True,
        },
    )


@router.get("/me")
def get_me() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "address": "5GrwvaEF...8PH3P",
            "role": "buyer",
            "balance": "1,247.50",
            "staked": "450.00",
        },
    )
