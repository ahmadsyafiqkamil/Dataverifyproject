# TODOS

## Phase 3 (Post-Hackathon)

### TODO: Role-Based Access Control (RBAC)
**What:** Wallet address tertentu hanya bisa akses portal yang sesuai berdasarkan on-chain role (Buyer, Miner, Validator)
**Why:** Keamanan dan UX yang benar — saat ini semua wallet dapat `role: "all"` sehingga bisa akses semua portal
**How to start:**
- Tambah endpoint `/api/auth/role-lookup?address=<ss58>` yang query Bittensor subnet untuk role wallet
- Update JWT generation untuk set `role` berdasarkan on-chain data
- Update `AuthGuard` untuk cek role sebelum render portal tertentu
**Depends on:** Phase 2 (Wallet Connect Auth) selesai
**Context:** Design doc `ahmadsyafiqkamil-main-design-20260323-053919.md` section "Role Assignment"

---

### TODO: Frontend Test Setup (Vitest + React Testing Library)
**What:** Setup unit test framework untuk frontend — AuthGuard, LoginPage, WalletConnectButton, AuthContext
**Why:** AuthGuard dan LoginPage punya banyak branching logic yang sekarang hanya bisa ditest manual
**How to start:**
- `npm install -D vitest @testing-library/react @testing-library/user-event jsdom`
- Tambah `test` script di `package.json`
- Buat `src/app/components/auth/AuthGuard.test.tsx` sebagai file pertama
**Depends on:** Phase 2 selesai
**Context:** Saat ini tidak ada test framework di frontend. Backend pakai pytest.

---

### TODO: Subnet-Aware Auth (RBAC v2)
**What:** Add `/api/auth/role-lookup` endpoint that checks if a wallet's hotkey is registered on the DataVerify subnet netuid. Assign roles (miner/validator/buyer) based on on-chain registration instead of `role: "all"`.
**Why:** Without this, any Substrate wallet can pretend to be a miner and submit fake datasets. Current auth doesn't verify subnet registration.
**How to start:**
- Query Bittensor metagraph for registered hotkeys on your netuid
- Check if wallet's hotkey appears in `metagraph.hotkeys`
- Map registration type to role (registered as miner → `role: "miner"`, etc.)
- Update JWT generation to set role from on-chain data
**Depends on:** Phase 2 (subnet exists on testnet) — merges with existing RBAC TODO above
**Context:** Identified by outside voice in eng review (2026-03-25). Design doc `ahmadsyafiqkamil-main-design-20260324-163553.md`

---

### TODO: Metagraph Freshness Check in Validator
**What:** Add a metagraph sync check at the start of each validator `forward()` pass. If metagraph is >1 tempo cycle old, re-sync before processing.
**Why:** Stale metagraph causes validator to score datasets that have already been scored or miss new ones, wasting compute and breaking consensus.
**How to start:**
- Track `last_metagraph_sync` timestamp in validator state
- At start of `forward()`: if `now - last_metagraph_sync > tempo_seconds`, call `metagraph.sync()`
- Log when sync happens for observability
**Depends on:** Phase 4 (validator neuron exists)
**Context:** Identified as critical failure mode gap in eng review (2026-03-25)

---

### TODO: Composite Score Display Differentiation
**What:** In buyer UI, display composite score with a visual indicator of how many scorers contributed. E.g., "70 (1/3 verified)" vs "78 (3/3 verified)" with different badge colors.
**Why:** Prevents buyers from comparing realism-only scores (confidence 0.33) with full 3-scorer scores (confidence 1.0) as if they're equivalent.
**How to start:**
- Read `confidence` field from QualityReport
- Map confidence to verification level: 0.33 = "Partial", 1.0 = "Full"
- Display badge next to composite score showing "1/3", "2/3", or "3/3 verified"
- Use amber for partial, green for full verification
**Depends on:** Phase 5 (frontend integration)
**Context:** Identified by outside voice in eng review (2026-03-25)

---

### TODO: Strengthen Visual Hierarchy Independent of Decoration
**What:** Refactor dashboard layouts so information hierarchy (headings, spacing, contrast, typography weight) communicates structure without relying on glassmorphism, ambient glows, or dot-grid backgrounds.
**Why:** Current UI looks flat if decorative shadows/glows are removed — hierarchy depends on decoration rather than information design. This makes future theme changes risky and fragile.
**How to start:**
- Audit each portal's heading hierarchy: ensure H1 > H2 > section heading > body text uses distinct sizes + weights
- Replace `boxShadow`/`drop-shadow` visual grouping with whitespace and border-based grouping
- Test: temporarily disable all `radial-gradient` and `boxShadow` — layout should still be scannable
**Depends on:** Phase 5 (frontend integration complete)
**Context:** Identified by outside voice in design review (2026-03-25). Not blocking for testnet demo but is design debt.

---

### TODO: Full Accessibility Audit (WCAG 2.1 AA)
**What:** Audit all 3 portals for ARIA landmarks, keyboard navigation, screen reader support, and WCAG 2.1 AA color contrast ratios. Add `role`, `aria-label`, and `tabindex` attributes throughout.
**Why:** Enterprise buyers in healthcare and finance have compliance requirements for accessibility. Score bars currently rely solely on color to convey dimensions — inaccessible to colorblind users.
**How to start:**
- Run Lighthouse accessibility audit on all 3 portals
- Add ARIA landmarks to sidebar nav (`role="navigation"`), main content (`role="main"`), stat sections (`role="region"`)
- Ensure all interactive elements are keyboard-focusable with visible focus rings
- Add `aria-label` to score bars and quality badges
- Verify 4.5:1 contrast ratio for all text on `#0f172a` background
**Depends on:** Phase 5 (frontend integration complete)
**Context:** Identified in design review (2026-03-25). Critical for enterprise adoption but lower priority than testnet demo.
