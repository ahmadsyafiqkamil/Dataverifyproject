import { useState } from "react";
import {
  GitMerge, Clock, ShieldCheck, AlertTriangle, XCircle, Trophy,
  Info, Users, Filter, Link2, ChevronLeft, ChevronRight, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine, ReferenceArea,
  BarChart, Bar, Cell,
} from "recharts";

/* ═══════ CONSTANTS ═══════ */
const CARD_BG = "#1a2540";
const CARD_BORDER = "#2a3a5c";
const PURPLE = "#7c3aed";
const GREEN = "#10b981";
const ORANGE = "#f59e0b";
const RED = "#ef4444";

/* ═══════ CHART DATA ═══════ */
const trendData = [
  { date: "Jan 25", value: 95.1 },
  { date: "Jan 26", value: 94.8 },
  { date: "Jan 27", value: 96.2 },
  { date: "Jan 28", value: 95.5 },
  { date: "Jan 29", value: 93.9 },
  { date: "Jan 30", value: 94.4 },
  { date: "Jan 31", value: 95.7 },
  { date: "Feb 1", value: 96.0 },
  { date: "Feb 2", value: 95.3 },
  { date: "Feb 3", value: 94.9 },
  { date: "Feb 4", value: 95.6 },
  { date: "Feb 5", value: 96.8 },
  { date: "Feb 6", value: 97.1 },
  { date: "Feb 7", value: 96.4 },
  { date: "Feb 8", value: 95.2 },
  { date: "Feb 9", value: 94.7 },
  { date: "Feb 10", value: 95.0 },
  { date: "Feb 11", value: 95.8 },
  { date: "Feb 12", value: 96.3 },
  { date: "Feb 13", value: 95.9 },
  { date: "Feb 14", value: 94.6 },
  { date: "Feb 15", value: 95.4 },
  { date: "Feb 16", value: 96.1 },
  { date: "Feb 17", value: 95.7 },
  { date: "Feb 18", value: 93.2 },
  { date: "Feb 19", value: 92.8 },
  { date: "Feb 20", value: 71.0 },
  { date: "Feb 21", value: 93.5 },
  { date: "Feb 22", value: 94.1 },
  { date: "Feb 23", value: 95.8 },
  { date: "Feb 24", value: 94.2 },
];

/* ═══════ TABLE DATA ═══════ */
type Result = "Aligned" | "Outlier" | "Disputed";

interface ConsensusRow {
  id: string;
  domain: string;
  domainColor: string;
  myScore: number;
  shapley: number;
  deviation: number;
  result: Result;
  weightImpact: string;
  note: string | null;
}

const consensusRows: ConsensusRow[] = [
  { id: "DS-4812", domain: "Healthcare", domainColor: "#14b8a6", myScore: 94, shapley: 92.4, deviation: 1.6, result: "Aligned", weightImpact: "No change", note: null },
  { id: "DS-4798", domain: "Finance", domainColor: "#22c55e", myScore: 88, shapley: 89.1, deviation: -1.1, result: "Aligned", weightImpact: "No change", note: null },
  { id: "DS-4781", domain: "NLP", domainColor: "#ec4899", myScore: 97, shapley: 96.8, deviation: 0.2, result: "Aligned", weightImpact: "No change", note: null },
  { id: "DS-4763", domain: "Computer Vision", domainColor: "#3b82f6", myScore: 71, shapley: 85.2, deviation: -14.2, result: "Outlier", weightImpact: "-0.003 weight", note: "Deviation >10pts reduces your consensus weight for 1 cycle" },
  { id: "DS-4744", domain: "Healthcare", domainColor: "#14b8a6", myScore: 42, shapley: 44.1, deviation: -2.1, result: "Aligned", weightImpact: "No change", note: null },
  { id: "DS-4729", domain: "Finance", domainColor: "#22c55e", myScore: 89, shapley: 52.3, deviation: 36.7, result: "Disputed", weightImpact: "-0.008 weight", note: "Dispute filed by miner · Under review" },
  { id: "DS-4710", domain: "Autonomous", domainColor: "#6366f1", myScore: 91, shapley: 90.7, deviation: 0.3, result: "Aligned", weightImpact: "No change", note: null },
];

const resultStyles: Record<Result, { color: string; label: string; icon: React.ReactNode }> = {
  Aligned: { color: GREEN, label: "✅ Aligned", icon: null },
  Outlier: { color: ORANGE, label: "⚠️ Outlier", icon: null },
  Disputed: { color: RED, label: "❌ Disputed", icon: null },
};

/* ═══════ WEIGHT SPARKLINE DATA ═══════ */
const weightData = [
  { date: "Feb 18", value: 0.974, outlier: false },
  { date: "Feb 19", value: 0.974, outlier: false },
  { date: "Feb 20", value: 0.961, outlier: true },
  { date: "Feb 21", value: 0.961, outlier: false },
  { date: "Feb 22", value: 0.963, outlier: false },
  { date: "Feb 23", value: 0.964, outlier: false },
  { date: "Feb 24", value: 0.961, outlier: false },
];

/* ═══════ CUSTOM TOOLTIP ═══════ */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isLow = val < 80;
  return (
    <div
      className="px-3 py-2 rounded-lg"
      style={{
        backgroundColor: "#0f172a",
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 2 }}>{label}</div>
      <div style={{ color: isLow ? ORANGE : PURPLE, fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace" }}>
        {val.toFixed(1)}%
      </div>
    </div>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export function ValidatorConsensus() {
  const [chartRange, setChartRange] = useState<"7D" | "30D" | "3M">("30D");
  const [page, setPage] = useState(1);
  const [tooltipRow, setTooltipRow] = useState<string | null>(null);
  const totalPages = 4;

  const chartFiltered = chartRange === "7D" ? trendData.slice(-7) : chartRange === "3M" ? trendData : trendData;

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
              <GitMerge size={10} style={{ color: PURPLE }} />
              <span style={{ color: PURPLE, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                CONSENSUS
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
            Consensus{" "}
            <span style={{ background: "linear-gradient(90deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              History
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Track how your scores aligned with the Shapley-weighted network consensus
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 24, 2026 · 17:08 UTC</span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={<ShieldCheck size={16} />} iconColor={GREEN} label="Consensus Accuracy" value="94.2%" sub="last 30 days" />
        <StatCard icon={<AlertTriangle size={16} />} iconColor={ORANGE} label="Outlier Instances" value="3" sub="score deviation >10pts" />
        <StatCard icon={<XCircle size={16} />} iconColor={RED} label="Slash Events" value="0" sub="stake slashing history" />
        <StatCard icon={<Trophy size={16} />} iconColor={PURPLE} label="Validator Rank" value="Rank #12" sub="out of 64 validators" />
      </div>

      {/* ── Accuracy Trend Chart ── */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>30-Day Consensus Accuracy Trend</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>Daily consensus match percentage</p>
          </div>
          <div className="flex gap-1">
            {(["7D", "30D", "3M"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: chartRange === r ? `${PURPLE}20` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${chartRange === r ? `${PURPLE}40` : "rgba(255,255,255,0.06)"}`,
                  color: chartRange === r ? PURPLE : "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: chartRange === r ? 600 : 400,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 300, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartFiltered} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PURPLE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
                interval={chartRange === "7D" ? 0 : 4}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <ReferenceLine y={90} stroke={GREEN} strokeDasharray="6 4" strokeOpacity={0.6} label={{ value: "Target 90%", fill: GREEN, fontSize: 11, position: "left" }} />
              {/* Highlight dip area */}
              <ReferenceArea x1="Feb 19" x2="Feb 21" fill={ORANGE} fillOpacity={0.06} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={PURPLE}
                strokeWidth={2.5}
                fill="url(#purpleGrad)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.value < 80) {
                    return (
                      <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={5} fill={ORANGE} stroke="#1a2540" strokeWidth={2} />
                    );
                  }
                  return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={0} />;
                }}
                activeDot={{ r: 5, fill: PURPLE, stroke: "#1a2540", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Consensus Table ── */}
      <div
        className="rounded-xl overflow-hidden mb-5"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="px-5 pt-5 pb-3">
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Consensus Breakdown by Submission</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>Detailed score comparison with Shapley-weighted consensus</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 920 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                {["DATASET ID", "DOMAIN", "MY SCORE", "SHAPLEY CONSENSUS", "DEVIATION", "RESULT", "WEIGHT IMPACT"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consensusRows.map((r) => {
                const rs = resultStyles[r.result];
                const isOutlier = r.result === "Outlier";
                const isDisputed = r.result === "Disputed";
                const devPositive = r.deviation >= 0;

                return (
                  <tr key={r.id}>
                    <td colSpan={7} style={{ padding: 0 }}>
                      {/* Main row */}
                      <div
                        className="transition-all cursor-pointer"
                        style={{
                          borderBottom: r.note ? "none" : "1px solid rgba(255,255,255,0.03)",
                          boxShadow: isOutlier
                            ? "inset 3px 0 0 0 #f59e0b"
                            : isDisputed
                              ? "inset 3px 0 0 0 #ef4444"
                              : "none",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <div className="flex items-center" style={{ minHeight: 52 }}>
                          {/* Dataset ID */}
                          <div className="px-4 py-3" style={{ width: "14%" }}>
                            <span style={{ color: "#38bdf8", fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace" }}>{r.id}</span>
                          </div>
                          {/* Domain */}
                          <div className="px-4 py-3" style={{ width: "14%" }}>
                            <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: `${r.domainColor}12`, color: r.domainColor, fontSize: "0.72rem", fontWeight: 500, border: `1px solid ${r.domainColor}25` }}>
                              {r.domain}
                            </span>
                          </div>
                          {/* My Score */}
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>{r.myScore}</span>
                          </div>
                          {/* Shapley */}
                          <div className="px-4 py-3" style={{ width: "16%" }}>
                            <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontFamily: "monospace" }}>{r.shapley}</span>
                          </div>
                          {/* Deviation */}
                          <div className="px-4 py-3" style={{ width: "12%" }}>
                            <span style={{
                              color: Math.abs(r.deviation) > 10 ? (isDisputed ? RED : ORANGE) : GREEN,
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              fontFamily: "monospace",
                            }}>
                              {devPositive ? "+" : ""}{r.deviation} pts
                            </span>
                          </div>
                          {/* Result */}
                          <div className="px-4 py-3" style={{ width: "16%" }}>
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: `${rs.color}12`, color: rs.color, fontSize: "0.72rem", fontWeight: 600, border: `1px solid ${rs.color}25` }}
                            >
                              {rs.label}
                            </span>
                          </div>
                          {/* Weight Impact */}
                          <div className="px-4 py-3" style={{ width: "16%" }}>
                            <div className="flex items-center gap-2">
                              <span style={{
                                color: r.weightImpact === "No change" ? "#64748b" : RED,
                                fontSize: "0.78rem",
                                fontWeight: r.weightImpact === "No change" ? 400 : 600,
                                fontFamily: r.weightImpact === "No change" ? "inherit" : "monospace",
                              }}>
                                {r.weightImpact}
                              </span>
                              {r.result === "Outlier" && (
                                <div className="relative">
                                  <button
                                    onMouseEnter={() => setTooltipRow(r.id)}
                                    onMouseLeave={() => setTooltipRow(null)}
                                    className="flex items-center justify-center"
                                  >
                                    <Info size={13} style={{ color: "#64748b", cursor: "help" }} />
                                  </button>
                                  {tooltipRow === r.id && (
                                    <div
                                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap z-30"
                                      style={{ backgroundColor: "#0f172a", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                                    >
                                      <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{r.note}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Note row for disputed */}
                      {r.result === "Disputed" && r.note && (
                        <div
                          className="px-4 pb-3"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            boxShadow: "inset 3px 0 0 0 #ef4444",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={12} style={{ color: RED, flexShrink: 0 }} />
                            <span style={{ color: ORANGE, fontSize: "0.72rem" }}>{r.note}</span>
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

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Showing 7 of 28 records</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === 1 ? "#334155" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer" }}>
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: page === p ? `${PURPLE}20` : "rgba(255,255,255,0.02)", border: `1px solid ${page === p ? `${PURPLE}40` : CARD_BORDER}`, color: page === p ? PURPLE : "#64748b", fontSize: "0.78rem", fontWeight: page === p ? 700 : 400 }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === totalPages ? "#334155" : "#94a3b8", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Two-Column ── */}
      <div className="flex gap-5 flex-col xl:flex-row">
        {/* LEFT — How Consensus Works */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center gap-2 mb-5">
            <Info size={15} style={{ color: PURPLE }} />
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>How Consensus is Calculated</h3>
          </div>

          <div className="flex flex-col gap-5 mb-5">
            {[
              { step: 1, icon: <Users size={16} />, text: "3 independent validators score each dataset" },
              { step: 2, icon: <Filter size={16} />, text: "Shapley weighting removes outlier influence" },
              { step: 3, icon: <Link2 size={16} />, text: "Final score recorded on Bittensor blockchain" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${PURPLE}12`, border: `1px solid ${PURPLE}25` }}
                >
                  <span style={{ color: PURPLE }}>{s.icon}</span>
                </div>
                <div className="flex items-start gap-2 pt-1.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${PURPLE}20`, color: PURPLE, fontSize: "0.68rem", fontWeight: 700 }}
                  >
                    {s.step}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.4 }}>{s.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.02))", border: `1px solid rgba(124,58,237,0.15)` }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                  Validators within <span style={{ color: GREEN, fontWeight: 600 }}>±5pts</span> of consensus earn full reward.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ORANGE }} />
                <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                  Outliers <span style={{ color: ORANGE, fontWeight: 600 }}>({">"} 10pts)</span> receive reduced weight next cycle.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RED }} />
                <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                  Repeated outliers <span style={{ color: RED, fontWeight: 600 }}>risk stake slashing</span>.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Consensus Weight */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Consensus Weight (vtrust)</h3>
          </div>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 16 }}>My vtrust over the last 7 days</p>

          <div className="flex items-end gap-3 mb-6">
            <span style={{ color: PURPLE, fontSize: "2.4rem", fontWeight: 700, fontFamily: "monospace", lineHeight: 1 }}>
              0.961
            </span>
            <span style={{ color: "#475569", fontSize: "0.78rem", paddingBottom: 4 }}>current</span>
          </div>

          <div style={{ height: 160, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <YAxis domain={[0.950, 0.980]} tick={{ fill: "#475569", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "#0f172a", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        <div style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 2 }}>{label}</div>
                        <div style={{ color: payload[0].payload.outlier ? ORANGE : PURPLE, fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace" }}>{payload[0].value.toFixed(3)}</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {weightData.map((entry, i) => (
                    <Cell key={i} fill={entry.outlier ? ORANGE : PURPLE} fillOpacity={entry.outlier ? 0.8 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}
          >
            <Info size={13} style={{ color: PURPLE, flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
              Weight recovers gradually as new aligned scores are submitted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ STAT CARD ═══════ */
function StatCard({ icon, iconColor, label, value, sub }: { icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: `0 0 0 1px ${iconColor}10, 0 4px 20px rgba(0,0,0,0.2)` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}12`, border: `1px solid ${iconColor}25` }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}