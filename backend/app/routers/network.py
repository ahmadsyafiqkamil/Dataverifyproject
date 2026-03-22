from fastapi import APIRouter

from ..models.common import ApiResponse

router = APIRouter(prefix="/api/network", tags=["network"])


@router.get("/status")
def network_status() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "status": "Live",
            "validators": "128",
            "block": "#4,821,093",
        },
    )


@router.get("/miner-status")
def miner_status() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "status": "ONLINE",
            "block": "#4,821,093",
            "emissions": "2.14 τ/epoch",
            "myStake": "450 TAO",
            "subnetUID": "42",
            "miners": "256",
            "myUID": "47",
            "incentive": "0.0041 τ",
        },
    )


@router.get("/validator-status")
def validator_status() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "status": "VALIDATING",
            "block": "#4,821,093",
            "epoch": "29 / 360 blocks",
            "emissions": "3.82 τ/epoch",
            "myStake": "1,200 TAO",
            "subnetUID": "42",
            "validators": "64",
            "myUID": "12",
            "trustScore": "0.974",
            "vtrust": "0.961",
        },
    )
