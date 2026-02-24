import { useState, useMemo } from "react";
import {
  FileSearch, Clock, Search, ChevronDown, ChevronLeft, ChevronRight,
  ClipboardList, CheckCircle2, Shield, DollarSign, Activity,
  AlertTriangle, XCircle, ArrowUpRight, Info,
} from "lucide-react";

/* ═══════ CONSTANTS ═══════ */
const CARD_BG = "#1a2540";
const CARD_BORDER = "#2a3a5c";
const PURPLE = "#7c3aed";

/* ═══════ TYPES & DATA ═══════ */
type ReviewStatus = "Verified" | "Rejected" | "Disputed";
type MatchResult = "Match" | "Outlier" | "Disputed";

interface Review {
  id: string;
  domain: string;
  domainColor: string;
  dataType: string;
  myScore: number;
  consensus: number;
  match: MatchResult;
  reward: number;
  rewardNote: string | null;
  date: string;
  status: ReviewStatus;
  note: string | null;
  hasDispute: boolean;
}

const allReviews: Review[] = [
  {
    id: "DS-4812", domain: "Healthcare", domainColor: "#14b8a6", dataType: "Tabular",
    myScore: 94, consensus: 92.4, match: "Match", reward: 38.5, rewardNote: null,
    date: "Feb 23, 2026", status: "Verified", note: null, hasDispute: false,
  },
  {
    id: "DS-4798", domain: "Finance", domainColor: "#22c55e", dataType: "Time Series",
    myScore: 88, consensus: 89.1, match: "Match", reward: 32.1, rewardNote: null,
    date: "Feb 22, 2026", status: "Verified", note: null, hasDispute: false,
  },
  {
    id: "DS-4781", domain: "NLP", domainColor: "#ec4899", dataType: "Text",
    myScore: 97, consensus: 96.8, match: "Match", reward: 51.0, rewardNote: null,
    date: "Feb 21, 2026", status: "Verified", note: null, hasDispute: false,
  },
  {
    id: "DS-4763", domain: "Computer Vision", domainColor: "#3b82f6", dataType: "Image",
    myScore: 71, consensus: 85.2, match: "Outlier", reward: 8.5, rewardNote: "reduced",
    date: "Feb 20, 2026", status: "Verified",
    note: "Your score deviated from consensus by 14.2 pts — weight reduced for this cycle",
    hasDispute: false,
  },
  {
    id: "DS-4744", domain: "Healthcare", domainColor: "#14b8a6", dataType: "Tabular",
    myScore: 42, consensus: 44.1, match: "Match", reward: 0, rewardNote: null,
    date: "Feb 19, 2026", status: "Rejected", note: null, hasDispute: false,
  },
  {
    id: "DS-4729", domain: "Finance", domainColor: "#22c55e", dataType: "Tabular",
    myScore: 89, consensus: 52.3, match: "Disputed", reward: 0, rewardNote: null,
    date: "Feb 18, 2026", status: "Disputed",
    note: "Miner filed dispute · Resolution pending",
    hasDispute: true,
  },
  {
    id: "DS-4710", domain: "Autonomous", domainColor: "#6366f1", dataType: "Multi-modal",
    myScore: 91, consensus: 90.7, match: "Match", reward: 44.3, rewardNote: null,
    date: "Feb 17, 2026", status: "Verified", note: null, hasDispute: false,
  },
];

const statusColors: Record<ReviewStatus, string> = {
  Verified: "#10b981",
  Rejected: "#ef4444",
  Disputed: "#f59e0b",
};

const matchIcons: Record<MatchResult, { icon: React.ReactNode; color: string; label: string }> = {
  Match: { icon: <CheckCircle2 size={13} />, color: "#10b981", label: "Match" },
  Outlier: { icon: <AlertTriangle size={13} />, color: "#f59e0b", label: "Outlier" },
  Disputed: { icon: <XCircle size={13} />, color: "#ef4444", label: "Disputed" },
};

const dimensionData = [
  { name: "Statistical Fidelity", avg: 91.2 },
  { name: "Privacy Preservation", avg: 88.7 },
  { name: "Bias & Fairness", avg: 85.4 },
  { name: "Downstream Utility", avg: 90.1 },
  { name: "Adversarial Realism", avg: 87.6 },
];

const accuracyBands = [
  { label: "Within 5 pts", pct: 78, color: "#10b981" },
  { label: "Within 10 pts", pct: 14, color: "#f59e0b" },
  { label: "Outlier >10 pts", pct: 8, color: "#ef4444" },
];

/* ═══════ COMPONENT ═══════ */
export function ValidatorMyReviews() {
  const [filter, setFilter] = useState<"All" | ReviewStatus>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [domainOpen, setDomainOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = allReviews;
    if (filter !== "All") list = list.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.id.toLowerCase().includes(q) || r.domain.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const totalPages = 4; // mock 28 total / 7-10 per page

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <FileSearch size={10} style={{ color: PURPLE }} />
              <span style={{ color: PURPLE, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                REVIEW HISTORY
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <Activity size={10} style={{ color: "#22c55e" }} className="animate-pulse" />
              <span style={{ color: "#22c55e", fontSize: "0.68rem", fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            My{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a855f7 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Reviews
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            History of all datasets you have evaluated
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 24, 2026 · 17:05 UTC</span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={<ClipboardList size={16} />} iconColor={PURPLE} label="Total Reviews" value="28" />
        <StatCard
          icon={<CheckCircle2 size={16} />} iconColor="#10b981" label="Consensus Accuracy"
          value="94.2%" sub="aligned with majority"
        />
        <StatCard
          icon={<Shield size={16} />} iconColor="#38bdf8" label="Trust Score"
          value="0.974" sub="top 5% of validators"
        />
        <StatCard
          icon={<DollarSign size={16} />} iconColor="#f59e0b" label="Earned This Month"
          value="142.8 τ" sub="+12.3% vs last month"
        />
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap mb-5 px-4 py-3 rounded-xl"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {([
            { key: "All", label: "All (28)" },
            { key: "Verified", label: "Verified ✓" },
            { key: "Rejected", label: "Rejected ✗" },
            { key: "Disputed", label: "Disputed ⚠" },
          ] as { key: "All" | ReviewStatus; label: string }[]).map((t) => {
            const active = filter === t.key;
            const c = t.key === "All" ? PURPLE : statusColors[t.key as ReviewStatus] ?? PURPLE;
            return (
              <button
                key={t.key}
                onClick={() => { setFilter(t.key); setPage(1); }}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: active ? `${c}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? `${c}40` : "rgba(255,255,255,0.06)"}`,
                  color: active ? c : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Search + dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
          >
            <Search size={13} style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Dataset ID or Domain..."
              className="bg-transparent outline-none"
              style={{ color: "#f1f5f9", fontSize: "0.78rem", width: 200 }}
            />
          </div>

          {/* Domain dropdown */}
          <div className="relative">
            <button
              onClick={() => { setDomainOpen(!domainOpen); setDateOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: "#94a3b8", fontSize: "0.78rem" }}
            >
              Filter by Domain <ChevronDown size={12} />
            </button>
            {domainOpen && (
              <DropdownMenu
                items={["All Domains", "Healthcare", "Finance", "NLP", "Computer Vision", "Autonomous"]}
                onSelect={() => setDomainOpen(false)}
              />
            )}
          </div>

          {/* Date dropdown */}
          <div className="relative">
            <button
              onClick={() => { setDateOpen(!dateOpen); setDomainOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: "#94a3b8", fontSize: "0.78rem" }}
            >
              Date Range <ChevronDown size={12} />
            </button>
            {dateOpen && (
              <DropdownMenu
                items={["All Time", "This Week", "This Month", "Last 30 Days", "Last 90 Days"]}
                onSelect={() => setDateOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews Table ── */}
      <div
        className="rounded-xl overflow-hidden mb-5"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                {["DATASET ID", "DOMAIN", "DATA TYPE", "MY SCORE", "CONSENSUS", "MATCH", "REWARD (TAO)", "DATE", "STATUS"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3"
                    style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const m = matchIcons[r.match];
                const sc = statusColors[r.status];
                const isOutlier = r.match === "Outlier";
                const isDisputed = r.match === "Disputed";

                return (
                  <tr key={r.id} className="group">
                    {/* Main row */}
                    <td
                      colSpan={9}
                      style={{ padding: 0 }}
                    >
                      <div
                        className="transition-all cursor-pointer"
                        style={{
                          borderBottom: r.note ? "none" : `1px solid rgba(255,255,255,0.03)`,
                          boxShadow: isOutlier
                            ? "inset 3px 0 0 0 #f59e0b"
                            : isDisputed
                              ? "inset 3px 0 0 0 #ef4444"
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <div className="flex items-center" style={{ minHeight: 52 }}>
                          {/* Dataset ID */}
                          <div className="px-4 py-3" style={{ width: "11%" }}>
                            <span style={{ color: "#38bdf8", fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace" }}>
                              {r.id}
                            </span>
                          </div>
                          {/* Domain */}
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span
                              className="px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: `${r.domainColor}12`,
                                color: r.domainColor,
                                fontSize: "0.72rem",
                                fontWeight: 500,
                                border: `1px solid ${r.domainColor}25`,
                              }}
                            >
                              {r.domain}
                            </span>
                          </div>
                          {/* Data Type */}
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{r.dataType}</span>
                          </div>
                          {/* My Score */}
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>
                              {r.myScore}
                            </span>
                          </div>
                          {/* Consensus */}
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontFamily: "monospace" }}>
                              {r.consensus}
                            </span>
                          </div>
                          {/* Match */}
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span
                              className="inline-flex items-center gap-1.5"
                              style={{ color: m.color, fontSize: "0.75rem", fontWeight: 600 }}
                            >
                              {m.icon}
                              {m.label}
                            </span>
                          </div>
                          {/* Reward */}
                          <div className="px-4 py-3" style={{ width: "13%" }}>
                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  color: r.reward > 0 ? "#10b981" : "#475569",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                }}
                              >
                                {r.reward > 0 ? `+${r.reward}` : "0"} τ
                              </span>
                              {r.rewardNote && (
                                <span
                                  className="px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: "rgba(245,158,11,0.1)",
                                    color: "#f59e0b",
                                    fontSize: "0.58rem",
                                    fontWeight: 600,
                                    border: "1px solid rgba(245,158,11,0.2)",
                                  }}
                                >
                                  {r.rewardNote}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Date */}
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{r.date}</span>
                          </div>
                          {/* Status */}
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: `${sc}12`,
                                color: sc,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                border: `1px solid ${sc}25`,
                              }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc }} />
                              {r.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Note row */}
                      {r.note && (
                        <div
                          className="px-4 pb-3 pt-0 flex items-center gap-2"
                          style={{
                            borderBottom: `1px solid rgba(255,255,255,0.03)`,
                            boxShadow: isOutlier
                              ? "inset 3px 0 0 0 #f59e0b"
                              : isDisputed
                                ? "inset 3px 0 0 0 #ef4444"
                                : "none",
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 pl-0 ml-0">
                            <AlertTriangle
                              size={12}
                              style={{ color: isDisputed ? "#ef4444" : "#f59e0b", flexShrink: 0 }}
                            />
                            <span
                              style={{
                                color: isDisputed ? "#f59e0b" : "#94a3b8",
                                fontSize: "0.72rem",
                              }}
                            >
                              {r.note}
                            </span>
                            {r.hasDispute && (
                              <button
                                className="flex items-center gap-1 ml-2 shrink-0 transition-opacity hover:opacity-80"
                                style={{ color: PURPLE, fontSize: "0.72rem", fontWeight: 600 }}
                              >
                                View Dispute <ArrowUpRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div
          className="px-4 py-3 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: `1px solid ${CARD_BORDER}` }}
        >
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>
            Showing {filtered.length} of 28 reviews
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: `1px solid ${CARD_BORDER}`,
                color: page === 1 ? "#334155" : "#94a3b8",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: page === p ? `${PURPLE}20` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${page === p ? `${PURPLE}40` : CARD_BORDER}`,
                  color: page === p ? PURPLE : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: page === p ? 700 : 400,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: `1px solid ${CARD_BORDER}`,
                color: page === totalPages ? "#334155" : "#94a3b8",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              <ChevronRight size={14} />
            </button>
            <span
              className="ml-2 px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: `1px solid ${CARD_BORDER}`,
                color: "#64748b",
                fontSize: "0.72rem",
              }}
            >
              10 per page
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom: Accuracy + Dimension ── */}
      <div className="flex gap-5 flex-col xl:flex-row">
        {/* LEFT — Scoring Accuracy */}
        <div
          className="flex-1 min-w-0 rounded-xl p-5"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
            My Scoring Accuracy
          </h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 20 }}>
            Score Distribution vs Consensus
          </p>

          <div className="flex flex-col gap-4">
            {accuracyBands.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{b.label}</span>
                  <span style={{ color: b.color, fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>
                    {b.pct}%
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-2 mt-5 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <Info size={13} style={{ color: "#10b981", flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
              Validators within 5pts of consensus earn full reward
            </span>
          </div>
        </div>

        {/* RIGHT — Dimension Performance */}
        <div
          className="flex-1 min-w-0 rounded-xl p-5"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
            Dimension Performance
          </h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 20 }}>
            Avg Score by Evaluation Layer
          </p>

          <div className="flex flex-col gap-5">
            {dimensionData.map((d) => {
              const barColor =
                d.avg >= 90 ? "#10b981" : d.avg >= 85 ? "#38bdf8" : "#f59e0b";
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{d.name}</span>
                    <span
                      style={{
                        color: barColor,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        fontFamily: "monospace",
                      }}
                    >
                      {d.avg}
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${d.avg}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ SUB-COMPONENTS ═══════ */

function StatCard({
  icon, iconColor, label, value, sub,
}: {
  icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: `0 0 0 1px ${iconColor}10, 0 4px 20px rgba(0,0,0,0.2)`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}12`, border: `1px solid ${iconColor}25` }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DropdownMenu({ items, onSelect }: { items: string[]; onSelect: (v: string) => void }) {
  return (
    <div
      className="absolute right-0 top-full mt-1 py-1 rounded-lg z-20"
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 160,
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="w-full text-left px-3 py-1.5 transition-all hover:bg-white/5"
          style={{ color: "#94a3b8", fontSize: "0.78rem" }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
