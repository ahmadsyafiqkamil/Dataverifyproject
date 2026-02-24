import { useState } from "react";
import {
  Cpu, Activity, Clock, TrendingUp, ArrowUpRight, DollarSign,
  Zap, Gift, Timer, ExternalLink, Filter,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

/* ── mock data ── */
const earningsChartData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `Feb ${day}`,
    base: +(3 + Math.random() * 7 + (i / 30) * 4).toFixed(1),
    royalty: +(0.5 + Math.random() * 3 + (i / 30) * 2).toFixed(1),
  };
});

const royaltyData = [
  { id: "DS-4821", domain: "Healthcare", sold: 503, royalty: 28.4, lastSale: "Feb 23", status: "Active" },
  { id: "DS-4756", domain: "Finance", sold: 312, royalty: 11.2, lastSale: "Feb 22", status: "Active" },
  { id: "DS-4612", domain: "NLP", sold: 178, royalty: 5.8, lastSale: "Feb 20", status: "Active" },
  { id: "DS-4534", domain: "Comp. Vision", sold: 42, royalty: 1.8, lastSale: "Feb 10", status: "Active" },
  { id: "DS-4287", domain: "Healthcare", sold: 0, royalty: 0.0, lastSale: "—", status: "Rejected" },
];

const pieData = [
  { name: "Base Reward", value: 8.1, color: "#38bdf8" },
  { name: "Quality Bonus", value: 4.2, color: "#22c55e" },
  { name: "Royalties", value: 2.4, color: "#a855f7" },
  { name: "Innovation Premium", value: 0, color: "#334155" },
];

const payoutHistory = [
  { date: "Feb 23", epoch: 247, type: "Quality Bonus", dataset: "DS-4821", amount: 4.2, hash: "0x7f3b…c912" },
  { date: "Feb 23", epoch: 247, type: "Base Reward", dataset: "DS-4821", amount: 8.1, hash: "0x2a1e…f047" },
  { date: "Feb 22", epoch: 246, type: "Royalty", dataset: "DS-4756", amount: 2.1, hash: "0x9d4c…a3b2" },
  { date: "Feb 21", epoch: 245, type: "Base Reward", dataset: "DS-4612", amount: 6.7, hash: "0x5e8f…d621" },
  { date: "Feb 20", epoch: 244, type: "Royalty", dataset: "DS-4821", amount: 3.4, hash: "0xb1a7…8f33" },
];

const typeColors: Record<string, string> = {
  "Quality Bonus": "#22c55e",
  "Base Reward": "#38bdf8",
  Royalty: "#a855f7",
};

/* ── helpers ── */
const cardStyle: React.CSSProperties = {
  backgroundColor: "#1e293b",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "22px",
};

const glowBorder = (color: string, alpha = 0.2) =>
  `0 0 0 1px rgba(${hexToRgb(color)},${alpha}), 0 4px 24px rgba(0,0,0,0.25)`;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)].join(",");
}

/* ── custom tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        border: "1px solid rgba(56,189,248,0.2)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "0.72rem", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2" style={{ marginBottom: 2 }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
            {p.dataKey === "base" ? "Base Rewards" : "Royalties"}:
          </span>
          <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 600 }}>{p.value} τ</span>
        </div>
      ))}
    </div>
  );
}

/* ── page ── */
export function MinerEarnings() {
  const [chartRange, setChartRange] = useState<string>("1M");
  const [royaltyFilter, setRoyaltyFilter] = useState<string>("All");

  const filteredRoyalties =
    royaltyFilter === "All"
      ? royaltyData
      : royaltyFilter === "Active"
        ? royaltyData.filter((r) => r.status === "Active")
        : royaltyData.filter((r) => r.status !== "Active");

  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}
            >
              <DollarSign size={10} style={{ color: "#f97316" }} />
              <span style={{ color: "#f97316", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                EARNINGS TRACKER
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
          <h1
            style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            Earnings &{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Royalties
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Track your TAO earnings, royalties from dataset sales, and payout history
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 24, 2026 · 09:17 UTC</span>
        </div>
      </div>

      {/* ── Row 1 — Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {/* Card 1 */}
        <div style={{ ...cardStyle, boxShadow: glowBorder("#22c55e", 0.12) }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Total Earned (All Time)</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
            >
              <TrendingUp size={15} style={{ color: "#22c55e" }} />
            </div>
          </div>
          <div style={{ color: "#22c55e", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1 }}>1,284.7 τ</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 4 }}>≈ $49,892 USD</div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight size={12} style={{ color: "#22c55e" }} />
            <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 600 }}>+18.4% this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ ...cardStyle, boxShadow: glowBorder("#38bdf8", 0.12) }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>This Epoch</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(56,189,248,0.1)" }}
            >
              <Zap size={15} style={{ color: "#38bdf8" }} />
            </div>
          </div>
          <div style={{ color: "#38bdf8", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1 }}>12.3 τ</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 4 }}>Epoch #247</div>
          <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: 6 }}>
            Base: <span style={{ color: "#38bdf8", fontWeight: 600 }}>8.1τ</span> | Quality bonus:{" "}
            <span style={{ color: "#22c55e", fontWeight: 600 }}>4.2τ</span>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ ...cardStyle, boxShadow: glowBorder("#a855f7", 0.12) }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Royalty Income</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(168,85,247,0.1)" }}
            >
              <Gift size={15} style={{ color: "#a855f7" }} />
            </div>
          </div>
          <div style={{ color: "#a855f7", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1 }}>47.2 τ</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 4 }}>All time from repurchases</div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight size={12} style={{ color: "#a855f7" }} />
            <span style={{ color: "#a855f7", fontSize: "0.72rem", fontWeight: 600 }}>+2.4τ this week</span>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ ...cardStyle, boxShadow: glowBorder("#f59e0b", 0.12) }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Pending Rewards</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
            >
              <Timer size={15} style={{ color: "#f59e0b" }} />
            </div>
          </div>
          <div style={{ color: "#f59e0b", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1 }}>8.9 τ</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 4 }}>2 datasets in review</div>
          <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: 6 }}>Est. release: ~4hrs</div>
        </div>
      </div>

      {/* ── Row 2 — Earnings Chart ── */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Earnings Over Time</h2>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>
              Daily TAO earnings breakdown
            </p>
          </div>
          <div className="flex gap-1">
            {["7D", "1M", "3M", "All Time"].map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: chartRange === r ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${chartRange === r ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)"}`,
                  color: chartRange === r ? "#f97316" : "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: chartRange === r ? 600 : 400,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={earningsChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRoyalty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}τ`}
              />
              <RTooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="base" stroke="#38bdf8" strokeWidth={2} fill="url(#gradBase)" name="Base Rewards" />
              <Area type="monotone" dataKey="royalty" stroke="#a855f7" strokeWidth={2} fill="url(#gradRoyalty)" name="Royalties" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: "#38bdf8" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Base Rewards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: "#a855f7" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Royalties</span>
          </div>
        </div>
      </div>

      {/* ── Row 3 — Royalty Tracker + Breakdown ── */}
      <div className="flex gap-5 items-start mb-5 flex-col xl:flex-row">
        {/* LEFT — Royalty table (60%) */}
        <div className="flex-1 min-w-0 w-full" style={cardStyle}>
          <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
            <div>
              <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Dataset Royalty Income</h2>
              <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>
                Passive income from marketplace repurchases
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={13} style={{ color: "#64748b" }} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 mt-3">
            {["All", "Active", "Completed"].map((t) => (
              <button
                key={t}
                onClick={() => setRoyaltyFilter(t)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: royaltyFilter === t ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${royaltyFilter === t ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: royaltyFilter === t ? "#a855f7" : "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: royaltyFilter === t ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}>
              <thead>
                <tr>
                  {["Dataset", "Domain", "Times Sold", "Total Royalty", "Last Sale", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2"
                      style={{ color: "#475569", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRoyalties.map((r) => (
                  <tr
                    key={r.id}
                    className="group transition-all"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <td className="px-3 py-2.5 rounded-l-lg">
                      <span
                        style={{ color: "#38bdf8", fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace" }}
                      >
                        {r.id}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: "rgba(56,189,248,0.08)",
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                        }}
                      >
                        {r.domain}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{r.sold} sold</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span style={{ color: "#a855f7", fontSize: "0.82rem", fontWeight: 600 }}>{r.royalty}τ</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{r.lastSale}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            r.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: r.status === "Active" ? "#22c55e" : "#ef4444",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          border: `1px solid ${r.status === "Active" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 rounded-r-lg">
                      <span
                        className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#38bdf8", fontSize: "0.72rem", fontWeight: 500, whiteSpace: "nowrap" }}
                      >
                        View Details <ArrowUpRight size={10} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer total */}
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Total royalties:</span>
            <div className="flex items-center gap-3">
              <span style={{ color: "#a855f7", fontSize: "0.92rem", fontWeight: 700 }}>47.2 τ</span>
              <span style={{ color: "#475569", fontSize: "0.78rem" }}>≈ $1,834 USD</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Reward Breakdown (40%) */}
        <div className="xl:w-[380px] w-full shrink-0" style={cardStyle}>
          <div className="mb-1">
            <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>This Epoch Breakdown</h2>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>
              DS-4821 · Epoch #247
            </p>
          </div>

          {/* Donut chart */}
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          padding: "8px 14px",
                        }}
                      >
                        <span style={{ color: d.color, fontSize: "0.78rem", fontWeight: 600 }}>
                          {d.name}: {d.value}τ
                        </span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label (manually positioned) */}
          <div className="flex flex-col items-center -mt-[138px] mb-[80px] pointer-events-none select-none">
            <span style={{ color: "white", fontSize: "1.3rem", fontWeight: 700 }}>14.7τ</span>
            <span style={{ color: "#64748b", fontSize: "0.68rem" }}>this epoch</span>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 mb-5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{d.name}</span>
                </div>
                <span style={{ color: d.value > 0 ? "white" : "#334155", fontSize: "0.82rem", fontWeight: 600 }}>
                  {d.value}τ
                </span>
              </div>
            ))}
          </div>

          {/* Multiplier badges */}
          <div
            className="pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}
            >
              MULTIPLIERS APPLIED
            </span>
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22c55e",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                <Zap size={11} />
                3x Quality Multiplier
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: "rgba(34,197,94,0.15)", fontSize: "0.65rem" }}
                >
                  96/100
                </span>
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  color: "#38bdf8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Healthcare Domain
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4 — Payout History ── */}
      <div style={cardStyle}>
        <div className="mb-4">
          <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Transaction History</h2>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 2 }}>
            Recent on-chain payouts and reward distributions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}>
            <thead>
              <tr>
                {["Date", "Epoch", "Type", "Dataset", "Amount", "Tx Hash"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2"
                    style={{ color: "#475569", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((p, i) => (
                <tr
                  key={i}
                  className="group transition-all"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <td className="px-3 py-2.5 rounded-l-lg">
                    <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{p.date}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>#{p.epoch}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${typeColors[p.type]}15`,
                        color: typeColors[p.type],
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: `1px solid ${typeColors[p.type]}30`,
                      }}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span style={{ color: "#38bdf8", fontSize: "0.82rem", fontFamily: "monospace" }}>
                      {p.dataset}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span style={{ color: typeColors[p.type], fontSize: "0.85rem", fontWeight: 700 }}>
                      +{p.amount}τ
                    </span>
                  </td>
                  <td className="px-3 py-2.5 rounded-r-lg">
                    <a
                      href="#"
                      className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "monospace", textDecoration: "none" }}
                    >
                      {p.hash}
                      <ExternalLink size={10} style={{ color: "#475569" }} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}