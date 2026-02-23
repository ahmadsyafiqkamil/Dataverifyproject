import { CheckCircle, Clock, XCircle, RefreshCw, ChevronRight, ArrowUpDown } from "lucide-react";

const activities = [
  {
    id: "DST-0041",
    name: "MedSynth-7B Clinical Records",
    domain: "Healthcare",
    domainColor: "#f472b6",
    score: 94,
    status: "Completed",
    date: "Feb 22, 2026",
    tao: "12.5",
  },
  {
    id: "DST-0038",
    name: "AgriData Crop Yield Predictions",
    domain: "Agriculture",
    domainColor: "#34d399",
    score: 88,
    status: "Processing",
    date: "Feb 21, 2026",
    tao: "6.8",
  },
  {
    id: "DST-0035",
    name: "FinStream-Market Signals",
    domain: "Finance",
    domainColor: "#fbbf24",
    score: 89,
    status: "Completed",
    date: "Feb 20, 2026",
    tao: "8.2",
  },
  {
    id: "DST-0031",
    name: "SocialGraph-Behavior Sim",
    domain: "Social Science",
    domainColor: "#a78bfa",
    score: 76,
    status: "Failed",
    date: "Feb 18, 2026",
    tao: "4.1",
  },
  {
    id: "DST-0028",
    name: "LegalCorpus-NLP Suite",
    domain: "Legal",
    domainColor: "#a78bfa",
    score: 97,
    status: "Completed",
    date: "Feb 17, 2026",
    tao: "15.0",
  },
  {
    id: "DST-0024",
    name: "AutoDrive-Sensor Fusion",
    domain: "Autonomous",
    domainColor: "#38bdf8",
    score: 91,
    status: "Pending",
    date: "Feb 15, 2026",
    tao: "22.4",
  },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Completed: { icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Completed" },
  Processing: { icon: RefreshCw, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", label: "Processing" },
  Failed: { icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Failed" },
  Pending: { icon: Clock, color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#38bdf8" : "#fbbf24";
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ width: "56px", backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}80`,
          }}
        />
      </div>
      <span style={{ color: "white", fontSize: "0.82rem", fontWeight: 600, minWidth: "28px" }}>{score}</span>
    </div>
  );
}

export function ActivityTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 600 }}>Recent Activity</h2>
          <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "2px" }}>Your latest dataset purchases and requests</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:gap-2.5"
          style={{
            color: "#38bdf8",
            fontSize: "0.82rem",
            fontWeight: 500,
            backgroundColor: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          View All
          <ChevronRight size={13} />
        </button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid rgba(56,189,248,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        }}
      >
        {/* Table header */}
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          {["Dataset Name", "Domain", "Score", "Status", "Date"].map((col) => (
            <div key={col} className="flex items-center gap-1.5">
              <span style={{ color: "#475569", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {col}
              </span>
              {col !== "Status" && col !== "Date" && (
                <ArrowUpDown size={10} style={{ color: "#334155" }} />
              )}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {activities.map((row, idx) => {
          const StatusCfg = statusConfig[row.status];
          const StatusIcon = StatusCfg.icon;
          const isLast = idx === activities.length - 1;

          return (
            <div
              key={row.id}
              className="grid px-5 py-4 transition-all duration-150 group cursor-pointer hover:bg-white/[0.02]"
              style={{
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
                borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Dataset name */}
              <div className="flex flex-col justify-center">
                <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 500 }}>{row.name}</span>
                <span style={{ color: "#334155", fontSize: "0.72rem", fontFamily: "monospace", marginTop: "2px" }}>{row.id}</span>
              </div>

              {/* Domain */}
              <div className="flex items-center">
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: `${row.domainColor}14`,
                    color: row.domainColor,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: `1px solid ${row.domainColor}25`,
                  }}
                >
                  {row.domain}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center">
                <ScoreBar score={row.score} />
              </div>

              {/* Status */}
              <div className="flex items-center">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: StatusCfg.bg, border: `1px solid ${StatusCfg.color}25` }}
                >
                  <StatusIcon
                    size={11}
                    style={{
                      color: StatusCfg.color,
                      animation: row.status === "Processing" ? "spin 2s linear infinite" : "none",
                    }}
                  />
                  <span style={{ color: StatusCfg.color, fontSize: "0.75rem", fontWeight: 600 }}>{StatusCfg.label}</span>
                </div>
              </div>

              {/* Date + TAO */}
              <div className="flex flex-col justify-center">
                <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{row.date}</span>
                <span style={{ color: "#38bdf8", fontSize: "0.72rem", fontWeight: 600, marginTop: "2px" }}>{row.tao} TAO</span>
              </div>
            </div>
          );
        })}

        {/* Footer pagination */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.01)" }}
        >
          <span style={{ color: "#334155", fontSize: "0.78rem" }}>Showing 6 of 48 transactions</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 8].map((page, i) => (
              <button
                key={i}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: page === 1 ? "rgba(56,189,248,0.15)" : "transparent",
                  color: page === 1 ? "#38bdf8" : "#475569",
                  fontSize: "0.78rem",
                  fontWeight: page === 1 ? 600 : 400,
                  border: page === 1 ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
