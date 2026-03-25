import time

import pytest

from app.services.auth_service import _nonces, create_jwt, generate_nonce


@pytest.mark.asyncio
async def test_challenge_valid_address(client):
    r = await client.post("/api/auth/challenge", json={"address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"})
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert "nonce" in body["data"]
    assert len(body["data"]["nonce"]) > 10  # uuid4 format


@pytest.mark.asyncio
async def test_challenge_missing_address(client):
    r = await client.post("/api/auth/challenge", json={})
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_verify_nonce_not_found(client):
    r = await client.post("/api/auth/verify", json={
        "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "signature": "0xdeadbeef",
        "nonce": "nonexistent-nonce-value",
    })
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_verify_expired_nonce(client):
    address = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
    nonce = generate_nonce(address)
    # Manually expire the nonce
    _nonces[nonce]["expires_at"] = time.time() - 1

    r = await client.post("/api/auth/verify", json={
        "address": address,
        "signature": "0xdeadbeef",
        "nonce": nonce,
    })
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_verify_invalid_signature(client):
    address = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
    # Get a real nonce first
    r = await client.post("/api/auth/challenge", json={"address": address})
    nonce = r.json()["data"]["nonce"]

    # Send invalid signature — should fail verification
    r = await client.post("/api/auth/verify", json={
        "address": address,
        "signature": "0x" + "ab" * 64,  # random 64-byte hex
        "nonce": nonce,
    })
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_demo_success(client):
    r = await client.post("/api/auth/demo")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert "token" in body["data"]
    assert body["data"]["address"] == "demo-user"
    assert body["data"]["is_demo"] is True


@pytest.mark.asyncio
async def test_demo_jwt_structure(client):
    from jose import jwt as jose_jwt
    from app.config import settings

    r = await client.post("/api/auth/demo")
    token = r.json()["data"]["token"]
    payload = jose_jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])

    assert payload["sub"] == "demo-user"
    assert payload["role"] == "all"
    assert payload["is_demo"] is True
    assert "exp" in payload


@pytest.mark.asyncio
async def test_protected_endpoint_without_token(client):
    """Verify that data endpoints return 401 without Authorization header."""
    r = await client.get("/api/buyer/dashboard/stats")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_protected_endpoint_with_token(auth_client):
    """Verify that data endpoints return 200 with valid token."""
    r = await auth_client.get("/api/buyer/dashboard/stats")
    assert r.status_code == 200
