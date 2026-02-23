const PHASES = [
  {
    phase: "Phase 1",
    period: "Months 1–2",
    title: "Testnet Launch",
    items: ["Tabular data support", "5–10 miners onboarded", "First dataset verifications", "Core scoring pipeline live"],
    status: "active",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
  },
  {
    phase: "Phase 2",
    period: "Months 3–4",
    title: "Multi-Modal Expansion",
    items: ["Image + text data types", "First paying customers", "API v1 release", "Validator incentive launch"],
    status: "upcoming",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    phase: "Phase 3",
    period: "Months 5–6",
    title: "Public Marketplace",
    items: ["Full marketplace launch", "Royalty system live", "$10k MRR milestone", "SDK for data buyers"],
    status: "upcoming",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    phase: "Phase 4",
    period: "Month 6+",
    title: "Enterprise Standard",
    items: ["100+ active miners", "$100k MRR milestone", "Industry certification", "DAO governance launch"],
    status: "future",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.3)",
  },
];

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
      style={{
        backgroundColor: "#020617",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span
            style={{
              color: "#38bdf8", fontSize: "0.72rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
            }}
          >
            Roadmap
          </span>
        </div>

        <h2
          style={{
            textAlign: "center", color: "#f1f5f9",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800, letterSpacing: "-0.025em",
            marginBottom: "60px",
          }}
        >
          From Testnet to Industry Standard
        </h2>

        {/* Horizontal timeline */}
        <div style={{ position: "relative", padding: "0 0 0 0" }}>
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              top: "36px",
              left: "calc(12.5% + 20px)",
              right: "calc(12.5% + 20px)",
              height: "2px",
              background: "linear-gradient(90deg, #38bdf8 25%, rgba(99,102,241,0.4) 50%, rgba(168,85,247,0.3) 75%, rgba(34,197,94,0.2) 100%)",
              borderRadius: "999px",
            }}
          />

          {/* Phases */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {PHASES.map((ph) => (
              <div key={ph.phase} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Node circle */}
                <div
                  style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    backgroundColor: ph.status === "active" ? ph.color : "#1e293b",
                    border: `2px solid ${ph.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "20px",
                    position: "relative", zIndex: 1,
                    boxShadow: ph.status === "active" ? `0 0 28px ${ph.glow}, 0 0 60px ${ph.glow}` : "none",
                    transition: "all 0.3s",
                    flexShrink: 0,
                    animation: ph.status === "active" ? "nodePulse 3s ease-in-out infinite" : "none",
                  }}
                >
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: ph.status === "active" ? "#0a1628" : ph.color }}>
                    {ph.phase.replace("Phase ", "P")}
                  </span>
                </div>

                {/* Card */}
                <div
                  style={{
                    width: "100%",
                    backgroundColor: ph.status === "active" ? "#1a2540" : "#0d1929",
                    border: `1px solid ${ph.status === "active" ? ph.color + "35" : "rgba(255,255,255,0.06)"}`,
                    borderTop: `2px solid ${ph.color}`,
                    borderRadius: "14px",
                    padding: "20px 16px",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.transform = "translateY(-3px)";
                    t.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${ph.glow.replace("0.3", "0.15")}`;
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.transform = "translateY(0)";
                    t.style.boxShadow = "none";
                  }}
                >
                  {/* Status badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#334155", fontSize: "0.65rem", fontFamily: "monospace" }}>{ph.period}</span>
                    {ph.status === "active" && (
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: "4px",
                          padding: "2px 8px", borderRadius: "999px",
                          backgroundColor: `${ph.color}14`, border: `1px solid ${ph.color}30`,
                        }}
                      >
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: ph.color, animation: "pulse-dot 1.8s infinite" }} />
                        <span style={{ color: ph.color, fontSize: "0.6rem", fontWeight: 700 }}>Active</span>
                      </div>
                    )}
                  </div>

                  <h3
                    style={{
                      color: ph.status !== "future" ? "#f1f5f9" : "#475569",
                      fontSize: "0.95rem", fontWeight: 700,
                      marginBottom: "12px", letterSpacing: "-0.01em",
                    }}
                  >
                    {ph.title}
                  </h3>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {ph.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <div
                          style={{
                            width: "4px", height: "4px", borderRadius: "50%",
                            backgroundColor: ph.status !== "future" ? ph.color : "#334155",
                            marginTop: "6px", flexShrink: 0,
                          }}
                        />
                        <span style={{ color: ph.status !== "future" ? "#64748b" : "#334155", fontSize: "0.78rem", lineHeight: 1.45 }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nodePulse {
          0%, 100% { box-shadow: 0 0 28px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.3); }
          50%       { box-shadow: 0 0 40px rgba(56,189,248,0.8), 0 0 90px rgba(56,189,248,0.4); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
