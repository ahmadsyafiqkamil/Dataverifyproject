import { useState } from "react";
import {
  DollarSign, Calendar, Activity, Lock, Clock, Download,
  ChevronLeft, ChevronRight, Info, Coins, Shield, TrendingUp,
  GitMerge,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Cell, PieChart, Pie, Cell as PieCell,
} from "recharts";

/* ═══════ CONSTANTS ═══════ */
const CARD_BG = "#1a2540";
const CARD_BORDER = "#2a3a5c";
const PURPLE = "#7c3aed";
const GREEN = "#10b981";
const ORANGE = "#f59e0b";

/* ═══════ CHART DATA ═══════ */
const dailyEarnings = [
  { date: "Jan 25", value: 28.3 }, { date: "Jan 26", value: 24.1 }, { date: "Jan 27", value: 31.5 },
  { date: "Jan 28", value: 22.8 }, { date: "Jan 29", value: 29.7 }, { date: "Jan 30", value: 26.2 },
  { date: "Jan 31", value: 33.4 }, { date: "Feb 1", value: 25.9 }, { date: "Feb 2", value: 27.6 },
  { date: "Feb 3", value: 30.1 }, { date: "Feb 4", value: 24.8 }, { date: "Feb 5", value: 28.9 },
  { date: "Feb 6", value: 32.1 }, { date: "Feb 7", value: 26.4 }, { date: "Feb 8", value: 29.3 },
  { date: "Feb 9", value: 23.7 }, { date: "Feb 10", value: 27.2 }, { date: "Feb 11", value: 31.8 },
  { date: "Feb 12", value: 25.6 }, { date: "Feb 13", value: 28.4 }, { date: "Feb 14", value: 30.5 },
  { date: "Feb 15", value: 24.3 }, { date: "Feb 16", value: 26.9 }, { date: "Feb 17", value: 33.8 },
  { date: "Feb 18", value: 27.1 }, { date: "Feb 19", value: 25.4 },
  { date: "Feb 20", value: 8.5, outlier: true },
  { date: "Feb 21", value: 51.0, peak: true },
  { date: "Feb 22", value: 32.1 }, { date: "Feb 23", value: 38.5 }, { date: "Feb 24", value: 22.4 },
] as { date: string; value: number; outlier?: boolean; peak?: boolean }[];

const donutData = [
  { name: "Evaluation Accuracy Reward", value: 52, color: PURPLE },
  { name: "Comprehensive Testing Bonus", value: 28, color: "#3b82f6" },
  { name: "Stake Emissions", value: 15, color: "#14b8a6" },
  { name: "Dispute Resolution Bonus", value: 5, color: ORANGE },
];

const domainData = [
  { name: "Healthcare", value: 48.2 },
  { name: "Finance", value: 38.7 },
  { name: "NLP", value: 29.4 },
  { name: "Computer Vision", value: 15.8 },
  { name: "Autonomous", value: 10.7 },
];
const domainMax = 48.2;

/* ═══════ TX LOG ═══════ */
interface TxRow {
  date: string;
  datasetId: string;
  rewardType: string;
  amount: number;
  multiplier: string;
  txHash: string;
  reduced?: boolean;
  note?: string;
}
const txLog: TxRow[] = [
  { date: "Feb 24, 2026", datasetId: "DS-4812", rewardType: "Accuracy Reward", amount: 12.4, multiplier: "2x (comprehensive)", txHash: "0x3f4a...8c2d" },
  { date: "Feb 23, 2026", datasetId: "DS-4798", rewardType: "Accuracy Reward", amount: 9.8, multiplier: "1.5x", txHash: "0x7b2e...1a9f" },
  { date: "Feb 22, 2026", datasetId: "DS-4781", rewardType: "Accuracy + Testing Bonus", amount: 18.2, multiplier: "2x", txHash: "0x9c1d...4e7b" },
  { date: "Feb 21, 2026", datasetId: "DS-4781", rewardType: "Marketplace Royalty Share", amount: 3.2, multiplier: "—", txHash: "0x2a8f...6d3c" },
  { date: "Feb 21, 2026", datasetId: "EPOCH-2847", rewardType: "Stake Emission", amount: 5.1, multiplier: "stake-weighted", txHash: "0x1b3e...9f2a" },
  { date: "Feb 20, 2026", datasetId: "DS-4763", rewardType: "Accuracy Reward (reduced)", amount: 2.1, multiplier: "0.25x (outlier)", txHash: "0x5d7c...3b8e", reduced: true, note: "Reward reduced: score deviated from consensus" },
  { date: "Feb 19, 2026", datasetId: "DS-4744", rewardType: "Evaluation Fee", amount: 1.5, multiplier: "base", txHash: "0x8e2b...7c4f" },
];

/* ═══════ CUSTOM TOOLTIP ═══════ */
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "#0f172a", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <div style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 2 }}>{label}</div>
      <div style={{ color: d.outlier ? ORANGE : d.peak ? GREEN : PURPLE, fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace" }}>
        {d.value.toFixed(1)} τ
      </div>
      {d.outlier && <div style={{ color: ORANGE, fontSize: "0.65rem", marginTop: 2 }}>Outlier — reduced</div>}
      {d.peak && <div style={{ color: GREEN, fontSize: "0.65rem", marginTop: 2 }}>Peak day</div>}
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export function ValidatorEarnings() {
  const [chartMode, setChartMode] = useState<"Daily" | "Cumulative">("Daily");
  const [chartRange, setChartRange] = useState<"7D" | "30D" | "3M">("30D");
  const [page, setPage] = useState(1);
  const totalPages = 21;

  const chartSlice = chartRange === "7D" ? dailyEarnings.slice(-7) : dailyEarnings;

  // Cumulative transform
  const chartData = chartMode === "Cumulative"
    ? chartSlice.reduce<{ date: string; value: number }[]>((acc, d) => {
        const prev = acc.length ? acc[acc.length - 1].value : 0;
        acc.push({ date: d.date, value: +(prev + d.value).toFixed(1) });
        return acc;
      }, [])
    : chartSlice;

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <DollarSign size={10} style={{ color: PURPLE }} />
              <span style={{ color: PURPLE, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>EARNINGS</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <Activity size={10} style={{ color: "#22c55e" }} className="animate-pulse" />
              <span style={{ color: "#22c55e", fontSize: "0.68rem", fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            <span style={{ background: "linear-gradient(90deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Earnings</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Your TAO rewards from evaluations, bonuses, and stake emissions
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0" style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 24, 2026 · 17:10 UTC</span>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={<DollarSign size={16} />} iconColor={ORANGE} label="Total Earned All-Time" value="1,847.3 τ" sub="≈ $71,844 USD" trend="+18.4% this month" />
        <StatCard icon={<Calendar size={16} />} iconColor={PURPLE} label="This Month" value="142.8 τ" sub="≈ $5,559 USD" trend="+12.3% vs last month" />
        <StatCard icon={<Activity size={16} />} iconColor="#38bdf8" label="Daily Average" value="26.7 τ" sub="last 30 days" />
        <StatCard icon={<Lock size={16} />} iconColor="#14b8a6" label="Total Staked" value="1,200 τ" sub="earning 0.0041τ/epoch incentive" />
      </div>

      {/* ── Earnings Chart ── */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Daily Earnings — Last 30 Days</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>TAO earned per day from evaluation rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(["Daily", "Cumulative"] as const).map((m) => (
                <button key={m} onClick={() => setChartMode(m)} className="px-3 py-1.5 rounded-lg transition-all" style={{
                  backgroundColor: chartMode === m ? `${PURPLE}20` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${chartMode === m ? `${PURPLE}40` : "rgba(255,255,255,0.06)"}`,
                  color: chartMode === m ? PURPLE : "#64748b", fontSize: "0.75rem", fontWeight: chartMode === m ? 600 : 400,
                }}>{m}</button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["7D", "30D", "3M"] as const).map((r) => (
                <button key={r} onClick={() => setChartRange(r)} className="px-3 py-1.5 rounded-lg transition-all" style={{
                  backgroundColor: chartRange === r ? `${PURPLE}20` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${chartRange === r ? `${PURPLE}40` : "rgba(255,255,255,0.06)"}`,
                  color: chartRange === r ? PURPLE : "#64748b", fontSize: "0.75rem", fontWeight: chartRange === r ? 600 : 400,
                }}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 300, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} interval={chartRange === "7D" ? 0 : 4} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => `${v}τ`} />
              {chartMode === "Daily" && (
                <ReferenceLine y={26.7} stroke="rgba(255,255,255,0.25)" strokeDasharray="6 4" label={{ value: "Avg 26.7τ", fill: "#94a3b8", fontSize: 11, position: "left" }} />
              )}
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={chartRange === "7D" ? 48 : 18} label={chartMode === "Daily" ? (props: any) => {
                const { x, y, width, payload } = props;
                if (payload && payload.peak) return <text x={x + width / 2} y={y - 8} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={700}>Peak: 51τ</text>;
                return null;
              } : undefined}>
                {chartData.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.outlier ? ORANGE : entry.peak ? GREEN : PURPLE} fillOpacity={entry.outlier ? 0.8 : entry.peak ? 0.9 : 0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 flex-wrap" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          {[
            { label: "30D Total", value: "802.2 τ" },
            { label: "Daily Avg", value: "26.7 τ" },
            { label: "Peak Day", value: "51 τ (Feb 21)" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span style={{ color: "#475569", fontSize: "0.75rem" }}>{s.label}:</span>
              <span style={{ color: "#f1f5f9", fontSize: "0.8rem", fontWeight: 700, fontFamily: "monospace" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Breakdown: Donut + Domain ── */}
      <div className="flex gap-5 flex-col xl:flex-row mb-5">
        {/* Donut */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>Reward Source Breakdown</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 16 }}>Where your earnings come from</p>
          <div className="flex items-center justify-center" style={{ height: 200, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {donutData.map((d, i) => (
                    <PieCell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "#0f172a", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{payload[0].name}</div>
                        <div style={{ color: payload[0].payload.color, fontSize: "0.9rem", fontWeight: 700 }}>{payload[0].value}%</div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 mt-4">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{d.name}</span>
                </div>
                <span style={{ color: d.color, fontSize: "0.82rem", fontWeight: 700, fontFamily: "monospace" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Domain bars */}
        <div className="flex-1 min-w-0 rounded-xl p-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>Earnings by Domain</h3>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginBottom: 20 }}>TAO earned by dataset domain</p>
          <div className="flex flex-col gap-5">
            {domainData.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{d.name}</span>
                  <span style={{ color: PURPLE, fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>{d.value} τ</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.value / domainMax) * 100}%`, background: `linear-gradient(90deg, ${PURPLE}, #a855f7)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transaction Log ── */}
      <div className="rounded-xl overflow-hidden mb-5" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Earnings Log</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>All reward transactions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, color: "#94a3b8", fontSize: "0.78rem" }}>
            <Download size={13} />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                {["DATE", "DATASET ID", "REWARD TYPE", "AMOUNT (TAO)", "MULTIPLIER", "TX HASH"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txLog.map((r, i) => (
                <tr key={i}>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <div
                      className="transition-all cursor-pointer"
                      style={{
                        borderBottom: r.note ? "none" : "1px solid rgba(255,255,255,0.03)",
                        boxShadow: r.reduced ? "inset 3px 0 0 0 #f59e0b" : "none",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <div className="flex items-center" style={{ minHeight: 48 }}>
                        <div className="px-4 py-3" style={{ width: "16%" }}>
                          <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{r.date}</span>
                        </div>
                        <div className="px-4 py-3" style={{ width: "14%" }}>
                          <span style={{ color: "#38bdf8", fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace" }}>{r.datasetId}</span>
                        </div>
                        <div className="px-4 py-3" style={{ width: "24%" }}>
                          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{r.rewardType}</span>
                        </div>
                        <div className="px-4 py-3" style={{ width: "14%" }}>
                          <span style={{ color: r.reduced ? ORANGE : GREEN, fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>
                            +{r.amount} τ
                          </span>
                        </div>
                        <div className="px-4 py-3" style={{ width: "16%" }}>
                          <span className="px-2 py-0.5 rounded-md" style={{
                            backgroundColor: r.multiplier.includes("outlier") ? "rgba(245,158,11,0.1)" : r.multiplier.includes("2x") ? `${PURPLE}12` : "rgba(255,255,255,0.03)",
                            color: r.multiplier.includes("outlier") ? ORANGE : r.multiplier.includes("2x") ? PURPLE : "#64748b",
                            fontSize: "0.7rem", fontWeight: 500,
                            border: `1px solid ${r.multiplier.includes("outlier") ? "rgba(245,158,11,0.2)" : r.multiplier.includes("2x") ? `${PURPLE}25` : "rgba(255,255,255,0.06)"}`,
                          }}>{r.multiplier}</span>
                        </div>
                        <div className="px-4 py-3" style={{ width: "16%" }}>
                          <span style={{ color: "#475569", fontSize: "0.75rem", fontFamily: "monospace" }}>{r.txHash}</span>
                        </div>
                      </div>
                    </div>
                    {r.note && (
                      <div className="px-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", boxShadow: "inset 3px 0 0 0 #f59e0b" }}>
                        <div className="flex items-center gap-2">
                          <Info size={12} style={{ color: ORANGE, flexShrink: 0 }} />
                          <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{r.note}</span>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Showing 7 of 142 transactions</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === 1 ? "#334155" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer" }}>
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: page === p ? `${PURPLE}20` : "rgba(255,255,255,0.02)", border: `1px solid ${page === p ? `${PURPLE}40` : CARD_BORDER}`, color: page === p ? PURPLE : "#64748b", fontSize: "0.78rem", fontWeight: page === p ? 700 : 400 }}>
                {p}
              </button>
            ))}
            <span style={{ color: "#334155", fontSize: "0.78rem" }}>...</span>
            <button onClick={() => setPage(21)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: page === 21 ? `${PURPLE}20` : "rgba(255,255,255,0.02)", border: `1px solid ${page === 21 ? `${PURPLE}40` : CARD_BORDER}`, color: page === 21 ? PURPLE : "#64748b", fontSize: "0.78rem", fontWeight: page === 21 ? 700 : 400 }}>
              21
            </button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${CARD_BORDER}`, color: page === totalPages ? "#334155" : "#94a3b8", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Info Card ── */}
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.02) 100%)", border: "1px solid rgba(124,58,237,0.18)" }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.06))", border: "1px solid rgba(124,58,237,0.25)" }}>
            <Coins size={18} style={{ color: PURPLE }} />
            <Shield size={10} style={{ color: PURPLE, position: "absolute", bottom: 6, right: 6 }} />
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>How Your Rewards Are Calculated</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>Understanding your TAO earning streams</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { title: "Accuracy Reward", desc: "Earn full reward when your score is within ±5pts of Shapley consensus", icon: <TrendingUp size={14} />, color: PURPLE },
            { title: "Testing Bonus", desc: "Run all 5 evaluation layers to earn 2x multiplier", icon: <Shield size={14} />, color: "#3b82f6" },
            { title: "Stake Emissions", desc: "30% of subnet TAO emissions distributed to validators by stake weight", icon: <Lock size={14} />, color: "#14b8a6" },
            { title: "Dispute Bonus", desc: "Earn extra TAO when you successfully defend your score in a miner dispute", icon: <GitMerge size={14} />, color: ORANGE },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div>
                <div style={{ color: "#f1f5f9", fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                <div style={{ color: "#64748b", fontSize: "0.75rem", lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "#334155", fontSize: "0.72rem", textAlign: "center" }}>
          All rewards are distributed automatically via on-chain smart contracts · Fully auditable on Bittensor Explorer
        </p>
      </div>
    </div>
  );
}

/* ═══════ STAT CARD ═══════ */
function StatCard({ icon, iconColor, label, value, sub, trend }: { icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string; trend?: string }) {
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
          <span className="flex items-center gap-1" style={{ color: GREEN, fontSize: "0.68rem", fontWeight: 600 }}>
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}