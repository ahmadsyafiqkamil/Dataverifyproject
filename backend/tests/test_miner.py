import pytest


@pytest.mark.asyncio
async def test_miner_dashboard_stats(auth_client):
    r = await auth_client.get("/api/miner/dashboard/stats")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert "datasetsSubmitted" in body["data"]


@pytest.mark.asyncio
async def test_miner_submissions(auth_client):
    r = await auth_client.get("/api/miner/submissions")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1
    sub = body["data"][0]
    assert "dimensions" in sub
    assert "validators" in sub


@pytest.mark.asyncio
async def test_miner_submit(auth_client):
    payload = {
        "datasetName": "Test Dataset",
        "domain": "Healthcare",
        "dataType": "Tabular",
    }
    r = await auth_client.post("/api/miner/submissions", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["status"] == "Pending"


@pytest.mark.asyncio
async def test_miner_requests(auth_client):
    r = await auth_client.get("/api/miner/requests")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True


@pytest.mark.asyncio
async def test_miner_earnings(auth_client):
    r = await auth_client.get("/api/miner/earnings")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    data = body["data"]
    assert "totalEarned" in data
    assert "royalties" in data
    assert "payouts" in data
