import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const weekData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 51 },
  { day: "Thu", value: 67 },
  { day: "Fri", value: 73 },
  { day: "Sat", value: 61 },
  { day: "Sun", value: 89 },
];

const taoData = [
  { day: "Mon", value: 28 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 52 },
  { day: "Fri", value: 61 },
  { day: "Sat", value: 48 },
  { day: "Sun", value: 72 },
];

export function ActivityChart() {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(56,189,248,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "white", fontSize: "0.95rem", fontWeight: 600 }}>Weekly Activity</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem" }}>Dataset requests this week</p>
          </div>
          <div className="flex gap-2">
            {["1W", "1M", "3M"].map((t, i) => (
              <button
                key={t}
                className="px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: i === 0 ? "rgba(56,189,248,0.15)" : "transparent",
                  color: i === 0 ? "#38bdf8" : "#475569",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  border: i === 0 ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: "100px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="cyangradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(56,189,248,0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.75rem",
                }}
                itemStyle={{ color: "#38bdf8" }}
                cursor={{ stroke: "rgba(56,189,248,0.3)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#cyangradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function TaoChart() {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(56,189,248,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "white", fontSize: "0.95rem", fontWeight: 600 }}>TAO Spending</h3>
            <p style={{ color: "#475569", fontSize: "0.78rem" }}>Token outflow per day</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}
          >
            <span style={{ color: "#fb923c", fontSize: "0.72rem", fontWeight: 600 }}>Ⲧ TAO</span>
          </div>
        </div>

        <div style={{ height: "100px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={taoData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="orangegradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(251,146,60,0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.75rem",
                }}
                itemStyle={{ color: "#fb923c" }}
                cursor={{ stroke: "rgba(251,146,60,0.3)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#fb923c"
                strokeWidth={2}
                fill="url(#orangegradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#fb923c", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
