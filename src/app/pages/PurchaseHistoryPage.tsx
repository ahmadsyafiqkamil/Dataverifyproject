import { useState } from "react";
import {
  Clock, Download, ShoppingBag, Database, Key, Search,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Star, AlertTriangle, ExternalLink, Info, TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Cell,
} from "recharts";

/* ═══════ CONSTANTS ═══════ */
const CARD_BG = "#1a2540";
const CARD_BORDER = "#2a3a5c";
const CYAN = "#38bdf8";
const GREEN = "#10b981";
const ORANGE = "#f59e0b";
const BLUE = "#3b82f6";

/* ═══════ DOMAIN COLORS ═══════ */
const domainColorMap: Record<string, string> = {
  Healthcare: "#14b8a6",
  Finance: "#22c55e",
  NLP: "#ec4899",
  "Computer Vision": "#3b82f6",
  Autonomous: "#6366f1",
};

/* ═══════ PURCHASE DATA ═══════ */
type Status = "Completed" | "Processing" | "Refunded";

interface PurchaseRow {
  date: string;
  orderId: string;
  datasetId: string;
  domain: string;
  dataType: string;
  qualityScore: number | null;
  amount: number;
  license: string;
  status: Status;
  tag?: string;
  note?: string;
  disputeLink?: boolean;
}

const purchases: PurchaseRow[] = [
  { date: "Feb 23, 2026", orderId: "ORD-0091", datasetId: "DS-4812", domain: "Healthcare", dataType: "Tabular", qualityScore: 94, amount: 42.5, license: "Extended", status: "Completed" },
  { date: "Feb 21, 2026", orderId: "ORD-0088", datasetId: "DS-4781", domain: "NLP", dataType: "Text", qualityScore: 97, amount: 51.0, license: "Commercial", status: "Completed", tag: "Best Value" },
  { date: "Feb 19, 2026", orderId: "ORD-0085", datasetId: "DS-4763", domain: "Computer Vision", dataType: "Image", qualityScore: 85, amount: 38.2, license: "Basic", status: "Completed" },
  { date: "Feb 17, 2026", orderId: "ORD-0081", datasetId: "DS-4744", domain: "Healthcare", dataType: "Tabular", qualityScore: 44, amount: 12.0, license: "Basic", status: "Refunded", note: "Refunded: dataset score below quality threshold after re-evaluation", disputeLink: true },
  { date: "Feb 15, 2026", orderId: "ORD-0079", datasetId: "DS-4710", domain: "Autonomous", dataType: "Multi-modal", qualityScore: 91, amount: 47.8, license: "Extended", status: "Completed" },
  { date: "Feb 13, 2026", orderId: "ORD-0076", datasetId: "DS-4698", domain: "Finance", dataType: "Time Series", qualityScore: 89, amount: 36.5, license: "Commercial", status: "Completed" },
  { date: "Feb 11, 2026", orderId: "ORD-0073", datasetId: "DS-4681", domain: "NLP", dataType: "Text", qualityScore: 92, amount: 39.2, license: "Basic", status: "Completed" },
  { date: "Feb 09, 2026", orderId: "ORD-0070", datasetId: "DS-4659", domain: "Finance", dataType: "Tabular", qualityScore: null, amount: 28.0, license: "Extended", status: "Processing" },
];

/* ═══════ SPENDING CHART DATA ═══════ */
const monthlySpending = [
  { month: "Sep", value: 48.2 },
  { month: "Oct", value: 72.5 },
  { month: "Nov", value: 95.1 },
  { month: "Dec", value: 128.4 },
  { month: "Jan", value: 365.8 },
  { month: "Feb", value: 348.7, down: true },
];

const domainSpendData = [
  { name: "Healthcare", value: 128.4 },
  { name: "Finance", value: 89.2 },
  { name: "NLP", value: 72.6 },
  { name: "Computer Vision", value: 38.9 },
  { name: "Autonomous", value: 19.6 },
];
const domainSpendMax = 128.4;

/* ═══════ LICENSE DATA ═══════ */
const activeLicenses = [
  { datasetId: "DS-4812", domain: "Healthcare", dataType: "Tabular", score: 94, license: "Extended", expires: "Feb 23, 2027", downloads: "3 of unlimited" },
  { datasetId: "DS-4781", domain: "NLP", dataType: "Text", score: 97, license: "Commercial", expires: "Feb 21, 2027", downloads: "1 of unlimited" },
  { datasetId: "DS-4710", domain: "Autonomous", dataType: "Multi-modal", score: 91, license: "Extended", expires: "Feb 15, 2027", downloads: "5 of unlimited" },
  { datasetId: "DS-4698", domain: "Finance", dataType: "Time Series", score: 89, license: "Commercial", expires: "Feb 13, 2027", downloads: "2 of unlimited" },
];

/* ═══════ EXPANDED DETAIL ═══════ */
const expandedDetail = {
  records: "50,000",
  genMethod: "CTGAN",
  qualityBreakdown: [
    { label: "Stat. Fidelity", value: 96 },
    { label: "Privacy", value: 95 },
    { label: "Bias & Fairness", value: 92 },
    { label: "Downstream Utility", value: 94 },
    { label: "Adv. Realism", value: 91 },
  ],
  validUntil: "Feb 23, 2027",
  dlCount: "3/unlimited",
};

/* ═══════ STATUS HELPERS ═══════ */
const statusColors: Record<Status, string> = {
  Completed: GREEN,
  Processing: BLUE,
  Refunded: ORANGE,
};

function StatusBadge({ status }: { status: Status }) {
  const c = statusColors[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: `${c}12`, color: c, fontSize: "0.72rem", fontWeight: 600, border: `1px solid ${c}25` }}>
      {status === "Processing" && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: c }} />}
      {status === "Completed" && "✓ "}
      {status === "Refunded" && "↩ "}
      {status}
    </span>
  );
}

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: "#475569" }}>—</span>;
  const hasStar = score >= 90;
  const hasWarn = score < 70;
  return (
    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", color: hasWarn ? ORANGE : "white" }}>
      {score} {hasStar && <Star size={11} className="inline -mt-0.5" style={{ color: "#fbbf24", fill: "#fbbf24" }} />}
      {hasWarn && <AlertTriangle size={11} className="inline -mt-0.5 ml-0.5" style={{ color: ORANGE }} />}
    </span>
  );
}

/* ═══════ CHART TOOLTIP ═══════ */
function SpendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "#0f172a", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <div style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 2 }}>{label}</div>
      <div style={{ color: d && d.down ? ORANGE : CYAN, fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace" }}>
        {payload[0].value.toFixed(1)} τ
      </div>
    </div>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "processing" | "refunded">("all");
  const [expandedRow, setExpandedRow] = useState<string | null>("ORD-0091");
  const [page, setPage] = useState(1);
  const totalPages = 3;

  const tabCounts = { all: 23, completed: 19, processing: 1, refunded: 3 };

  const filtered = activeTab === "all"
    ? purchases
    : purchases.filter((p) => p.status.toLowerCase() === activeTab);

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)" }}>
              <Clock size={10} style={{ color: CYAN }} />
              <span style={{ color: CYAN, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>HISTORY</span>
            </div>
          </div>
          <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Purchase{" "}
            <span style={{ background: `linear-gradient(90deg,${CYAN},#0ea5e9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              History
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            All your dataset purchases, access logs, and TAO transactions
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Clock size={13} style={{ color: "#475569" }} />
            <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
            <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 24, 2026 · 17:12 UTC</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, color: "#94a3b8", fontSize: "0.78rem" }}>
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={<ShoppingBag size={16} />} iconColor={BLUE} label="Total Purchases" value="23" sub="datasets acquired" />
        <StatCard icon={<DollarIcon />} iconColor={ORANGE} label="Total Spent" value="348.72 τ" sub="≈ $13,559 USD | this month" trend="-4.5% vs last month" trendDown />
        <StatCard icon={<Database size={16} />} iconColor="#14b8a6" label="Total Datasets Available" value="2,847" sub="in marketplace" />
        <StatCard icon={<Key size={16} />} iconColor={GREEN} label="Active Licenses" value="4" sub="datasets in use" />
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-1">
          {([
            { key: "all", label: `All (${tabCounts.all})` },
            { key: "completed", label: "Completed ✓" },
            { key: "processing", label: "Processing ⏳" },
            { key: "refunded", label: "Refunded ↩" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="px-3 py-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === t.key ? `${CYAN}18` : "rgba(255,255,255,0.02)",
                border: `1px solid ${activeTab === t.key ? `${CYAN}35` : "rgba(255,255,255,0.06)"}`,
                color: activeTab === t.key ? CYAN : "#64748b",
                fontSize: "0.78rem",
                fontWeight: activeTab === t.key ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input
            type="text"
            placeholder="Search by Dataset ID, domain, or request..."
            className="w-full pl-9 pr-3 py-2 rounded-lg outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, color: "#94a3b8", fontSize: "0.78rem" }}
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <button className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: "#64748b", fontSize: "0.78rem" }}>
            Filter by Domain ▾
          </button>
          <button className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: "#64748b", fontSize: "0.78rem" }}>
            Date Range ▾
          </button>
        </div>
      </div>

      {/* ── Transaction Table ── */}
      <div className="rounded-xl overflow-hidden mb-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="px-5 pt-5 pb-3">
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Transaction Log</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>All dataset purchase records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 1050 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                {["DATE", "ORDER ID", "DATASET ID", "DOMAIN", "DATA TYPE", "QUALITY", "AMOUNT (TAO)", "LICENSE", "STATUS", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isExpanded = expandedRow === r.orderId;
                const isRefunded = r.status === "Refunded";
                const isProcessing = r.status === "Processing";
                const dc = domainColorMap[r.domain] || "#64748b";

                return (
                  <tr key={r.orderId}>
                    <td colSpan={10} style={{ padding: 0 }}>
                      {/* Main row */}
                      <div
                        className="transition-all cursor-pointer"
                        style={{
                          borderBottom: (r.note || isExpanded) ? "none" : "1px solid rgba(255,255,255,0.03)",
                          boxShadow: isRefunded
                            ? "inset 3px 0 0 0 #f59e0b"
                            : isProcessing
                              ? "inset 3px 0 0 0 #3b82f6"
                              : "none",
                        }}
                        onClick={() => setExpandedRow(isExpanded ? null : r.orderId)}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <div className="flex items-center" style={{ minHeight: 52 }}>
                          <div className="px-4 py-3" style={{ width: "11%" }}>
                            <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{r.date}</span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 600 }}>{r.orderId}</span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "10%" }}>
                            <span style={{ color: CYAN, fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace" }}>{r.datasetId}</span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: `${dc}12`, color: dc, fontSize: "0.72rem", fontWeight: 500, border: `1px solid ${dc}25` }}>
                              {r.domain}
                            </span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "9%" }}>
                            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{r.dataType}</span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "8%" }}>
                            <ScoreDisplay score={r.qualityScore} />
                          </div>
                          <div className="px-4 py-3" style={{ width: "11%" }}>
                            <span style={{ color: isRefunded ? ORANGE : GREEN, fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>
                              {isRefunded ? "" : ""}{r.amount} τ
                            </span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "9%" }}>
                            <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#94a3b8", fontSize: "0.72rem", border: `1px solid rgba(255,255,255,0.06)` }}>
                              {r.license}
                            </span>
                          </div>
                          <div className="px-4 py-3" style={{ width: "14%" }}>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={r.status} />
                              {r.tag && (
                                <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#fbbf24", fontSize: "0.62rem", fontWeight: 700, border: "1px solid rgba(251,191,36,0.25)" }}>
                                  {r.tag}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="px-4 py-3" style={{ width: "6%" }}>
                            {isExpanded ? <ChevronUp size={14} style={{ color: "#64748b" }} /> : <ChevronDown size={14} style={{ color: "#64748b" }} />}
                          </div>
                        </div>
                      </div>

                      {/* Note row for refunded */}
                      {r.note && !isExpanded && (
                        <div className="px-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", boxShadow: "inset 3px 0 0 0 #f59e0b" }}>
                          <div className="flex items-center gap-2">
                            <Info size={12} style={{ color: ORANGE, flexShrink: 0 }} />
                            <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{r.note}</span>
                            {r.disputeLink && (
                              <button style={{ color: "#a855f7", fontSize: "0.72rem", fontWeight: 600, marginLeft: 8 }}>View Dispute →</button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expanded detail panel (only for ORD-0091 data) */}
                      {isExpanded && (
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          {r.note && (
                            <div className="px-4 pb-3" style={{ boxShadow: isRefunded ? "inset 3px 0 0 0 #f59e0b" : "none" }}>
                              <div className="flex items-center gap-2">
                                <Info size={12} style={{ color: ORANGE, flexShrink: 0 }} />
                                <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{r.note}</span>
                                {r.disputeLink && (
                                  <button style={{ color: "#a855f7", fontSize: "0.72rem", fontWeight: 600, marginLeft: 8 }}>View Dispute →</button>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mx-4 mb-4 rounded-xl p-5" style={{ backgroundColor: "#243050", border: `1px solid ${CARD_BORDER}` }}>
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Dataset Info */}
                              <div className="flex-1">
                                <h4 style={{ color: CYAN, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>DATASET INFO</h4>
                                <div className="flex flex-col gap-2.5">
                                  {[
                                    ["Dataset ID", r.datasetId],
                                    ["Domain", r.domain],
                                    ["Data Type", r.dataType],
                                    ["Records", expandedDetail.records],
                                    ["Generation Method", expandedDetail.genMethod],
                                    ["Quality Score", `${r.qualityScore}/100`],
                                  ].map(([l, v]) => (
                                    <div key={l} className="flex items-center justify-between">
                                      <span style={{ color: "#475569", fontSize: "0.78rem" }}>{l}</span>
                                      <span style={{ color: "#f1f5f9", fontSize: "0.78rem", fontWeight: 600, fontFamily: l === "Dataset ID" ? "monospace" : "inherit" }}>{v}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Quality Breakdown */}
                              <div className="flex-1">
                                <h4 style={{ color: CYAN, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>QUALITY BREAKDOWN</h4>
                                <div className="flex flex-wrap gap-2">
                                  {expandedDetail.qualityBreakdown.map((q) => (
                                    <div key={q.label} className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}>
                                      <div style={{ color: "#475569", fontSize: "0.68rem", marginBottom: 2 }}>{q.label}</div>
                                      <div style={{ color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: "monospace" }}>{q.value}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* License & Access */}
                              <div className="flex-1">
                                <h4 style={{ color: CYAN, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>LICENSE & ACCESS</h4>
                                <div className="flex flex-col gap-2.5 mb-4">
                                  {[
                                    ["License Type", r.license],
                                    ["Valid Until", expandedDetail.validUntil],
                                    ["Downloads", expandedDetail.dlCount],
                                  ].map(([l, v]) => (
                                    <div key={l} className="flex items-center justify-between">
                                      <span style={{ color: "#475569", fontSize: "0.78rem" }}>{l}</span>
                                      <span style={{ color: "#f1f5f9", fontSize: "0.78rem", fontWeight: 600 }}>{v}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${CYAN}, #0ea5e9)`, color: "white", fontSize: "0.82rem", fontWeight: 600 }}>
                                    <Download size={14} />
                                    Download Dataset
                                  </button>
                                  <button className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl" style={{ color: "#64748b", fontSize: "0.75rem" }}>
                                    <ExternalLink size={12} />
                                    View on Explorer
                                  </button>
                                </div>
                              </div>
                            </div>
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

        {/* Pagination footer */}
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Showing 8 of 23 transactions</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === 1 ? "#334155" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: page === p ? `${CYAN}18` : "rgba(255,255,255,0.02)", border: `1px solid ${page === p ? `${CYAN}35` : CARD_BORDER}`, color: page === p ? CYAN : "#64748b", fontSize: "0.78rem", fontWeight: page === p ? 700 : 400 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === totalPages ? "#334155" : "#94a3b8", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
                <ChevronRight size={14} />
              </button>
            </div>
            <span className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: "#64748b", fontSize: "0.72rem" }}>
              10 per page
            </span>
          </div>
        </div>
      </div>

      {/* ── Spending Analytics ── */}
      <div className="flex gap-5 flex-col xl:flex-row mb-5">
        {/* Monthly TAO Spending */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>TAO Outflow — Last 6 Months</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 16 }}>Monthly spending trend</p>
          <div style={{ height: 220, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySpending} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => `${v}τ`} />
                <ReferenceLine y={176.5} stroke="rgba(255,255,255,0.2)" strokeDasharray="6 4" label={{ value: "Avg 176.5τ", fill: "#94a3b8", fontSize: 10, position: "left" }} />
                <Tooltip content={<SpendTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {monthlySpending.map((entry, i) => (
                    <Cell key={i} fill={entry.down ? ORANGE : CYAN} fillOpacity={entry.down ? 0.7 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <span style={{ color: "#475569", fontSize: "0.75rem" }}>Total 6-Month Spend: </span>
            <span style={{ color: "#f1f5f9", fontSize: "0.82rem", fontWeight: 700, fontFamily: "monospace" }}>1,058.7 τ</span>
            <span style={{ color: "#475569", fontSize: "0.75rem" }}> ≈ $41,000 USD</span>
          </div>
        </div>

        {/* Spend by Domain */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>TAO Spent by Data Domain</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 20 }}>Breakdown of spending by category</p>
          <div className="flex flex-col gap-5">
            {domainSpendData.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{d.name}</span>
                  <span style={{ color: CYAN, fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>{d.value} τ</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.value / domainSpendMax) * 100}%`, background: `linear-gradient(90deg, ${CYAN}, #0ea5e9)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Licenses ── */}
      <div className="rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="flex items-center gap-2 mb-1">
          <Key size={15} style={{ color: CYAN }} />
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Active Dataset Licenses</h3>
        </div>
        <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 16 }}>Datasets you currently have access to</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeLicenses.map((lic) => {
            const dc = domainColorMap[lic.domain] || "#64748b";
            return (
              <div key={lic.datasetId} className="rounded-xl p-4 transition-all" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${CYAN}35`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span style={{ color: CYAN, fontSize: "0.88rem", fontWeight: 700, fontFamily: "monospace" }}>{lic.datasetId}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: `${dc}12`, color: dc, fontSize: "0.68rem", fontWeight: 500, border: `1px solid ${dc}25` }}>
                        {lic.domain}
                      </span>
                      <span style={{ color: "#64748b", fontSize: "0.72rem" }}>{lic.dataType}</span>
                      <span style={{ color: "white", fontSize: "0.72rem", fontWeight: 600, fontFamily: "monospace" }}>Score: {lic.score}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GREEN, boxShadow: `0 0 6px rgba(16,185,129,0.7)` }} />
                    <span style={{ color: GREEN, fontSize: "0.72rem", fontWeight: 600 }}>Active</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#475569", fontSize: "0.72rem" }}>License</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>{lic.license}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#475569", fontSize: "0.72rem" }}>Expires</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>{lic.expires}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#475569", fontSize: "0.72rem" }}>Downloads used</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>{lic.downloads}</span>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full py-2 rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: "rgba(56,189,248,0.06)", border: `1px solid rgba(56,189,248,0.2)`, color: CYAN, fontSize: "0.78rem", fontWeight: 600 }}>
                  <Download size={13} />
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════ STAT CARD ═══════ */
function StatCard({ icon, iconColor, label, value, sub, trend, trendDown }: { icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string; trend?: string; trendDown?: boolean }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: `0 0 0 1px ${iconColor}10, 0 4px 20px rgba(0,0,0,0.2)` }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}12`, border: `1px solid ${iconColor}25` }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1, fontFamily: "monospace" }}>{value}</div>
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        {sub && <span style={{ color: "#475569", fontSize: "0.72rem" }}>{sub}</span>}
        {trend && (
          <span className="flex items-center gap-1" style={{ color: trendDown ? "#ef4444" : GREEN, fontSize: "0.68rem", fontWeight: 600 }}>
            <TrendingDown size={10} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════ DOLLAR ICON (coin) ═══════ */
function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <path d="M15.5 9.5c0-1.1-1.6-2-3.5-2s-3.5.9-3.5 2 1.6 2 3.5 2 3.5.9 3.5 2-1.6 2-3.5 2-3.5-.9-3.5-2" />
    </svg>
  );
}
