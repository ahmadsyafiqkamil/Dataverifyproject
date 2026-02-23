import { TrendingUp, TrendingDown, Database, Star, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  change: string;
  changeUp: boolean;
  subtext: string;
  accentColor: string;
  glowColor: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
}

function StatCard({ title, value, unit, change, changeUp, subtext, accentColor, glowColor, icon, bg, border }: StatCardProps) {
  return (
    <div
      className="relative flex-1 rounded-2xl p-5 overflow-hidden transition-all duration-300 group"
      style={{
        backgroundColor: "#1e293b",
        border: `1px solid ${border}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${border}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
      }}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      {/* glow top corner */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <div style={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {title}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: bg, border: `1px solid ${border}` }}
        >
          {icon}
        </div>
      </div>

      <div className="relative flex items-baseline gap-1.5 mb-1.5">
        <span style={{ color: accentColor, fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, textShadow: `0 0 20px ${glowColor}` }}>
          {value}
        </span>
        {unit && (
          <span style={{ color: accentColor, fontSize: "0.9rem", fontWeight: 600, opacity: 0.8 }}>{unit}</span>
        )}
      </div>

      <div className="relative flex items-center justify-between">
        <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{subtext}</span>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: changeUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${changeUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}
        >
          {changeUp ? <TrendingUp size={10} style={{ color: "#22c55e" }} /> : <TrendingDown size={10} style={{ color: "#ef4444" }} />}
          <span style={{ color: changeUp ? "#22c55e" : "#ef4444", fontSize: "0.68rem", fontWeight: 700 }}>
            {change}
          </span>
        </div>
      </div>

      {/* mini progress bar */}
      <div className="relative mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: "72%",
            background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})`,
            boxShadow: `0 0 8px ${glowColor}`,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

export function EarningsOverview() {
  return (
    <div className="flex gap-4">
      <StatCard
        title="Total Earned"
        value="1,284.7"
        unit="TAO"
        change="+18.4% this month"
        changeUp
        subtext="≈ $49,892 USD"
        accentColor="#22c55e"
        glowColor="rgba(34,197,94,0.6)"
        bg="rgba(34,197,94,0.08)"
        border="rgba(34,197,94,0.2)"
        icon={<DollarSign size={18} style={{ color: "#22c55e" }} />}
      />
      <StatCard
        title="Active Submissions"
        value="12"
        change="+3 this week"
        changeUp
        subtext="2 In Review · 10 Verified"
        accentColor="#38bdf8"
        glowColor="rgba(56,189,248,0.6)"
        bg="rgba(56,189,248,0.08)"
        border="rgba(56,189,248,0.2)"
        icon={<Database size={18} style={{ color: "#38bdf8" }} />}
      />
      <StatCard
        title="Avg Quality Score"
        value="91.4"
        unit="/100"
        change="+2.1 vs last month"
        changeUp
        subtext="Top 15% of all miners"
        accentColor="#f59e0b"
        glowColor="rgba(245,158,11,0.6)"
        bg="rgba(245,158,11,0.08)"
        border="rgba(245,158,11,0.2)"
        icon={<Star size={18} style={{ color: "#f59e0b" }} />}
      />
    </div>
  );
}
