import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services.auth_service import clear_nonces_for_testing, create_jwt


@pytest.fixture
async def client():
    """Unauthenticated client — for auth endpoints and health check."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_client():
    """Authenticated client — for all protected buyer/miner/validator/network endpoints."""
    token = create_jwt(address="test-user", role="all", is_demo=True)
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://test",
        headers={"Authorization": f"Bearer {token}"},
    ) as ac:
        yield ac


@pytest.fixture(autouse=True)
def reset_nonces():
    """Clear nonce dict before each test to prevent cross-test state."""
    clear_nonces_for_testing()
    yield
    clear_nonces_for_testing()
