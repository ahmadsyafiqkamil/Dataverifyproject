import { Database, Star, Coins, Activity, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    label: "Total Datasets",
    value: "2,847",
    trend: "+12.4%",
    trendUp: true,
    sub: "across all domains",
    icon: Database,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.2)",
  },
  {
    label: "Avg Quality Score",
    value: "91.3",
    trend: "+2.1%",
    trendUp: true,
    sub: "verified by subnet",
    icon: Star,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.2)",
  },
  {
    label: "TAO Spent",
    value: "348.72",
    trend: "-4.5%",
    trendUp: false,
    sub: "this month",
    icon: Coins,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.2)",
  },
  {
    label: "Active Requests",
    value: "14",
    trend: "+3",
    trendUp: true,
    sub: "pending fulfillment",
    icon: Activity,
    color: "#34d399",
    glow: "rgba(52,211,153,0.2)",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
        return (
          <div
            key={stat.label}
            className="rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(56,189,248,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Background glow blob */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
                transform: "translate(30%, -30%)",
              }}
            />

            {/* Grid lines overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.glow}`, border: `1px solid ${stat.color}30` }}
              >
                <Icon size={18} style={{ color: stat.color }} />
              </div>

              {/* Value */}
              <div style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                {stat.value}
              </div>

              {/* Label */}
              <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>{stat.label}</div>

              {/* Divider */}
              <div className="my-3" style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.05)" }} />

              {/* Trend + Sub */}
              <div className="flex items-center justify-between">
                <span style={{ color: "#475569", fontSize: "0.72rem" }}>{stat.sub}</span>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: stat.trendUp ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    color: stat.trendUp ? "#22c55e" : "#ef4444",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                  }}
                >
                  <TrendIcon size={10} />
                  {stat.trend}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
