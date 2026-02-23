import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

// 30-day synthetic reward data
const rewardData = [
  { day: "Jan 24", tao: 8.2, cumulative: 8.2 },
  { day: "Jan 25", tao: 11.4, cumulative: 19.6 },
  { day: "Jan 26", tao: 9.8, cumulative: 29.4 },
  { day: "Jan 27", tao: 14.2, cumulative: 43.6 },
  { day: "Jan 28", tao: 44.3, cumulative: 87.9 },
  { day: "Jan 29", tao: 12.1, cumulative: 100.0 },
  { day: "Jan 30", tao: 9.7, cumulative: 109.7 },
  { day: "Jan 31", tao: 15.3, cumulative: 125.0 },
  { day: "Feb 01", tao: 18.8, cumulative: 143.8 },
  { day: "Feb 02", tao: 21.4, cumulative: 165.2 },
  { day: "Feb 03", tao: 16.2, cumulative: 181.4 },
  { day: "Feb 04", tao: 19.5, cumulative: 200.9 },
  { day: "Feb 05", tao: 5.2, cumulative: 206.1 },
  { day: "Feb 06", tao: 8.9, cumulative: 215.0 },
  { day: "Feb 07", tao: 22.3, cumulative: 237.3 },
  { day: "Feb 08", tao: 24.1, cumulative: 261.4 },
  { day: "Feb 09", tao: 28.7, cumulative: 290.1 },
  { day: "Feb 10", tao: 32.4, cumulative: 322.5 },
  { day: "Feb 11", tao: 29.8, cumulative: 352.3 },
  { day: "Feb 12", tao: 35.2, cumulative: 387.5 },
  { day: "Feb 13", tao: 31.5, cumulative: 419.0 },
  { day: "Feb 14", tao: 38.9, cumulative: 457.9 },
  { day: "Feb 15", tao: 51.0, cumulative: 508.9 },
  { day: "Feb 16", tao: 42.3, cumulative: 551.2 },
  { day: "Feb 17", tao: 38.7, cumulative: 589.9 },
  { day: "Feb 18", tao: 38.2, cumulative: 628.1 },
  { day: "Feb 19", tao: 44.8, cumulative: 672.9 },
  { day: "Feb 20", tao: 42.5, cumulative: 715.4 },
  { day: "Feb 21", tao: 39.2, cumulative: 754.6 },
  { day: "Feb 22", tao: 47.6, cumulative: 802.2 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3.5 py-3 rounded-xl"
      style={{
        backgroundColor: "#0f1f35",
        border: "1px solid rgba(56,189,248,0.25)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "6px" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-baseline gap-1.5">
          <div
            className="w-2 h-2 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: p.name === "tao" ? "#22c55e" : "#38bdf8" }}
          />
          <span style={{ color: "#64748b", fontSize: "0.72rem" }}>
            {p.name === "tao" ? "Daily" : "Cumulative"}:
          </span>
          <span style={{ color: "white", fontSize: "0.82rem", fontWeight: 700 }}>
            {p.value.toFixed(1)} <span style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 400 }}>TAO</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function RewardHistory() {
  const total30d = rewardData.reduce((a, d) => a + d.tao, 0).toFixed(1);
  const avg = (rewardData.reduce((a, d) => a + d.tao, 0) / rewardData.length).toFixed(1);
  const peak = Math.max(...rewardData.map(d => d.tao));
  const peakDay = rewardData.find(d => d.tao === peak)?.day ?? "";

  return (
    <div
      className="rounded-2xl flex flex-col"
      style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={15} style={{ color: "#22c55e" }} />
          <h3 style={{ color: "white", fontSize: "0.92rem", fontWeight: 700 }}>Reward History</h3>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)" }}
          >
            <Calendar size={10} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#38bdf8", fontSize: "0.65rem", fontWeight: 600 }}>Last 30 Days</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div style={{ color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>30d Total</div>
            <div className="flex items-baseline gap-1">
              <span style={{ color: "#22c55e", fontSize: "0.95rem", fontWeight: 800 }}>{total30d}</span>
              <span style={{ color: "#475569", fontSize: "0.7rem" }}>TAO</span>
            </div>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div className="text-right">
            <div style={{ color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Daily Avg</div>
            <div className="flex items-baseline gap-1">
              <span style={{ color: "#38bdf8", fontSize: "0.95rem", fontWeight: 800 }}>{avg}</span>
              <span style={{ color: "#475569", fontSize: "0.7rem" }}>TAO</span>
            </div>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div className="text-right">
            <div style={{ color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Peak Day</div>
            <div className="flex items-baseline gap-1">
              <span style={{ color: "#f59e0b", fontSize: "0.95rem", fontWeight: 800 }}>{peak}</span>
              <span style={{ color: "#475569", fontSize: "0.7rem" }}>TAO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart toggle */}
      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
            <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Daily Earnings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#38bdf8" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#38bdf8" }} />
            <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Cumulative</span>
          </div>
        </div>
        <span style={{ color: "#334155", fontSize: "0.68rem" }}>Peak: {peak} TAO on {peakDay}</span>
      </div>

      {/* Chart */}
      <div className="px-3 pb-4" style={{ height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rewardData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cumulGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#334155", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />

            <YAxis
              yAxisId="left"
              tick={{ fill: "#334155", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}τ`}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#334155", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}τ`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(56,189,248,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }} />

            <ReferenceLine
              yAxisId="left"
              y={avg}
              stroke="rgba(245,158,11,0.3)"
              strokeDasharray="4 4"
              label={{ value: "avg", fill: "#475569", fontSize: 9, position: "right" }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="tao"
              name="tao"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#dailyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e", stroke: "none", filter: "drop-shadow(0 0 6px rgba(34,197,94,0.8))" }}
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              name="cumulative"
              stroke="#38bdf8"
              strokeWidth={1.5}
              fill="url(#cumulGrad)"
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: "#38bdf8", stroke: "none", filter: "drop-shadow(0 0 6px rgba(56,189,248,0.8))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
