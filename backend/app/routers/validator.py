from fastapi import APIRouter, Depends

from ..models.common import ApiResponse
from ..services.auth_service import require_auth
from ..services.mock_data import mock_service

router = APIRouter(prefix="/api/validator", tags=["validator"], dependencies=[Depends(require_auth)])


@router.get("/dashboard/stats")
def dashboard_stats() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_validator_stats())


@router.get("/pending")
def get_pending() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_validator_pending())


@router.post("/pending/{eval_id}/evaluate")
def evaluate(eval_id: str) -> ApiResponse:
    queue = mock_service.get_validator_pending()
    card = next((c for c in queue if c["id"] == eval_id), None)
    if card is None:
        return ApiResponse(success=False, error="Evaluation not found")
    return ApiResponse(
        success=True,
        data={
            "id": eval_id,
            "status": "Evaluation started",
            "estimatedTime": "~2 hours",
        },
    )


@router.get("/reviews")
def get_reviews() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_validator_reviews())


@router.get("/consensus")
def get_consensus() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_validator_consensus())


@router.get("/earnings")
def get_earnings() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_validator_earnings_data())
