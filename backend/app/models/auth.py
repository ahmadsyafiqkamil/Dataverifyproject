from pydantic import BaseModel


class ChallengeRequest(BaseModel):
    address: str


class VerifyRequest(BaseModel):
    address: str
    signature: str
    nonce: str


class AuthResponse(BaseModel):
    token: str
    address: str
    role: str
    is_demo: bool
