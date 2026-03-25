import math

from fastapi import APIRouter, Depends, Query

from ..models.common import ApiResponse
from ..services.auth_service import require_auth
from ..services.mock_data import mock_service

router = APIRouter(prefix="/api/buyer", tags=["buyer"], dependencies=[Depends(require_auth)])


@router.get("/dashboard/stats")
def dashboard_stats() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_buyer_stats())


@router.get("/datasets")
def list_datasets(
    domain: str | None = Query(None),
    search: str | None = Query(None),
    sort_by: str = Query("qualityScore", alias="sortBy"),
    sort_order: str = Query("desc", alias="sortOrder"),
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=50),
) -> ApiResponse:
    items, total = mock_service.get_datasets(
        domain=domain, search=search, sort_by=sort_by,
        sort_order=sort_order, page=page, limit=limit,
    )
    return ApiResponse(
        success=True,
        data=items,
        meta={
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "pages": math.ceil(total / limit) if limit else 1,
            }
        },
    )


@router.get("/datasets/{dataset_id}")
def get_dataset(dataset_id: int) -> ApiResponse:
    ds = mock_service.get_dataset_by_id(dataset_id)
    if ds is None:
        return ApiResponse(success=False, error="Dataset not found")
    return ApiResponse(success=True, data=ds)


@router.post("/datasets/{dataset_id}/purchase")
def purchase_dataset(dataset_id: int) -> ApiResponse:
    ds = mock_service.get_dataset_by_id(dataset_id)
    if ds is None:
        return ApiResponse(success=False, error="Dataset not found")
    return ApiResponse(
        success=True,
        data={
            "orderId": "ORD-0099",
            "datasetId": ds["id"],
            "amount": float(ds["price"]),
            "status": "Processing",
        },
    )


@router.get("/activity")
def get_activity() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_activities())


@router.get("/history")
def get_history() -> ApiResponse:
    data = mock_service.get_purchase_history()
    return ApiResponse(success=True, data=data)


@router.get("/requests")
def get_requests() -> ApiResponse:
    return ApiResponse(success=True, data=mock_service.get_requests_list())
