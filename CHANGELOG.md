# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0.0] - 2026-03-26

### Added
- Wallet-based authentication with Substrate SR25519 signature verification (nonce challenge-response flow)
- JWT token generation and validation for API route protection
- Demo login mode for testing without a wallet
- Frontend auth context with persistent JWT in localStorage
- Login page with wallet connect and demo login options
- AuthGuard component for protected route rendering
- Auth API hooks (useChallenge, useVerify, useDemoLogin)
- Backend auth router with `/api/auth/challenge`, `/api/auth/verify`, `/api/auth/demo` endpoints
- Auth service with nonce management, signature verification, and JWT helpers
- 9 new auth tests (challenge, verify, nonce expiry, demo login, JWT structure, protected endpoints)
- Docker infrastructure: multi-stage frontend Dockerfile, nginx reverse proxy, docker-compose with backend + frontend services
- TODOS.md with post-hackathon roadmap (RBAC, frontend tests, subnet-aware auth, metagraph freshness, composite score display, visual hierarchy, accessibility audit)

### Changed
- All API routers now require JWT authentication via `require_auth` dependency
- Existing buyer/miner/validator tests updated with authenticated client fixture
- API client adds Authorization header from stored JWT token
- Dashboard shows wallet address or "Demo User" based on auth state
