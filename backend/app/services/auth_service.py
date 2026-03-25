import time
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from ..config import settings

# Module-level nonce storage: { nonce_str: { address, expires_at } }
# Single-worker assumption — acceptable for hackathon demo.
# NOTE: do not save files while auth flow is in progress (--reload flushes this).
_nonces: dict[str, dict] = {}

_bearer = HTTPBearer()


# ---------------------------------------------------------------------------
# Nonce helpers
# ---------------------------------------------------------------------------

def generate_nonce(address: str) -> str:
    nonce = str(uuid.uuid4())
    _nonces[nonce] = {"address": address, "expires_at": time.time() + 300}
    return nonce


def verify_and_consume_nonce(nonce: str, address: str) -> bool:
    """Check nonce exists, matches address, not expired. Deletes on success."""
    entry = _nonces.get(nonce)
    if not entry:
        return False
    if entry["address"] != address:
        return False
    if time.time() > entry["expires_at"]:
        _nonces.pop(nonce, None)
        return False
    _nonces.pop(nonce)
    _cleanup_expired()
    return True


def _cleanup_expired() -> None:
    now = time.time()
    expired = [k for k, v in list(_nonces.items()) if now > v["expires_at"]]
    for k in expired:
        _nonces.pop(k, None)


def clear_nonces_for_testing() -> None:
    """Test helper — clear all nonces between test runs."""
    _nonces.clear()


# ---------------------------------------------------------------------------
# Signature verification
# ---------------------------------------------------------------------------

def verify_signature(address: str, signature: str, nonce: str) -> bool:
    """Verify a Substrate/Bittensor wallet signature."""
    try:
        from substrateinterface import Keypair  # lazy import — heavy dependency
        keypair = Keypair(ss58_address=address)
        sig_bytes = bytes.fromhex(signature.replace("0x", ""))
        return keypair.verify(nonce, sig_bytes)
    except Exception:
        return False


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

def create_jwt(address: str, role: str = "all", is_demo: bool = False) -> str:
    payload = {
        "sub": address,
        "role": role,
        "is_demo": is_demo,
        "exp": datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expiry_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---------------------------------------------------------------------------
# FastAPI dependency — use on protected routers
# ---------------------------------------------------------------------------

def require_auth(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> dict:
    return decode_jwt(credentials.credentials)
