import pytest


@pytest.mark.asyncio
async def test_dashboard_stats(client):
    r = await client.get("/api/buyer/dashboard/stats")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) == 4


@pytest.mark.asyncio
async def test_list_datasets(client):
    r = await client.get("/api/buyer/datasets")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) == 6  # default limit
    assert body["meta"]["pagination"]["total"] == 12


@pytest.mark.asyncio
async def test_list_datasets_filter_domain(client):
    r = await client.get("/api/buyer/datasets?domain=Healthcare")
    assert r.status_code == 200
    body = r.json()
    for ds in body["data"]:
        assert ds["domain"] == "Healthcare"


@pytest.mark.asyncio
async def test_list_datasets_search(client):
    r = await client.get("/api/buyer/datasets?search=medsyn&limit=20")
    assert r.status_code == 200
    body = r.json()
    assert body["meta"]["pagination"]["total"] >= 1


@pytest.mark.asyncio
async def test_list_datasets_pagination(client):
    r = await client.get("/api/buyer/datasets?page=2&limit=6")
    assert r.status_code == 200
    body = r.json()
    assert body["meta"]["pagination"]["page"] == 2
    assert len(body["data"]) == 6


@pytest.mark.asyncio
async def test_get_dataset_by_id(client):
    r = await client.get("/api/buyer/datasets/1")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["id"] == 1
    assert len(body["data"]["breakdown"]) == 5


@pytest.mark.asyncio
async def test_get_dataset_not_found(client):
    r = await client.get("/api/buyer/datasets/999")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is False
    assert body["error"] == "Dataset not found"


@pytest.mark.asyncio
async def test_purchase_dataset(client):
    r = await client.post("/api/buyer/datasets/1/purchase")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["status"] == "Processing"


@pytest.mark.asyncio
async def test_activity(client):
    r = await client.get("/api/buyer/activity")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1


@pytest.mark.asyncio
async def test_history(client):
    r = await client.get("/api/buyer/history")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert "purchases" in body["data"]
    assert "activeLicenses" in body["data"]


@pytest.mark.asyncio
async def test_requests(client):
    r = await client.get("/api/buyer/requests")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1
