from fastapi import APIRouter

from ..models.common import ApiResponse
from ..models.miner import SubmitFormData
from ..services.mock_data import mock_service

router = APIRouter(prefix="/api/miner", tags=["miner"])


@router.get("/dashboard/stats")
def dashboard_stats() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_miner_stats())


@router.get("/submissions")
def list_submissions() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_submissions())


@router.post("/submissions")
def create_submission(form: SubmitFormData) -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "id": "DS-9999",
            "status": "Pending",
            "message": "Dataset submitted for validation",
        },
    )


@router.get("/requests")
def get_requests() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_miner_requests())


@router.get("/earnings")
def get_earnings() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_miner_earnings_data())
