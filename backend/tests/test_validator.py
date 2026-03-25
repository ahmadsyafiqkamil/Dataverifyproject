import pytest


@pytest.mark.asyncio
async def test_validator_dashboard_stats(auth_client):
    r = await auth_client.get("/api/validator/dashboard/stats")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) == 4
    assert "sparkline" in body["data"][0]


@pytest.mark.asyncio
async def test_validator_pending(auth_client):
    r = await auth_client.get("/api/validator/pending")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1
    card = body["data"][0]
    assert "layers" in card
    assert "stage" in card


@pytest.mark.asyncio
async def test_validator_evaluate(auth_client):
    r = await auth_client.post("/api/validator/pending/EVAL-4821/evaluate")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["id"] == "EVAL-4821"


@pytest.mark.asyncio
async def test_validator_evaluate_not_found(auth_client):
    r = await auth_client.post("/api/validator/pending/EVAL-9999/evaluate")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is False


@pytest.mark.asyncio
async def test_validator_reviews(auth_client):
    r = await auth_client.get("/api/validator/reviews")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert "reviews" in body["data"]
    assert "dimensionAverages" in body["data"]


@pytest.mark.asyncio
async def test_validator_consensus(auth_client):
    r = await auth_client.get("/api/validator/consensus")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1
    row = body["data"][0]
    assert "shapley" in row
    assert "deviation" in row


@pytest.mark.asyncio
async def test_validator_earnings(auth_client):
    r = await auth_client.get("/api/validator/earnings")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    data = body["data"]
    assert "totalEarned" in data
    assert "transactions" in data
    assert "domainBreakdown" in data


@pytest.mark.asyncio
async def test_network_status(auth_client):
    r = await auth_client.get("/api/network/status")
    assert r.status_code == 200
    body = r.json()
    assert body["data"]["status"] == "Live"


@pytest.mark.asyncio
async def test_miner_network_status(auth_client):
    r = await auth_client.get("/api/network/miner-status")
    assert r.status_code == 200
    body = r.json()
    assert body["data"]["status"] == "ONLINE"


@pytest.mark.asyncio
async def test_validator_network_status(auth_client):
    r = await auth_client.get("/api/network/validator-status")
    assert r.status_code == 200
    body = r.json()
    assert body["data"]["status"] == "VALIDATING"


@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
