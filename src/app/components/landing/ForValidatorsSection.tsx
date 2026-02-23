import { CheckCircle2, Shield, ArrowRight, Lock, Clock } from "lucide-react";
import { useNavigate } from "react-router";

const BULLETS = [
  "30% of TAO emissions go to validators",
  "2x bonus for running all 5 evaluation layers",
  "Stake-weighted rewards for long-term commitment",
  "Dispute resolution rewards for successful challenges",
];

const LAYERS = [
  { name: "Statistical Check", score: 98, status: "done",    color: "#38bdf8" },
  { name: "Privacy Audit",     score: 97, status: "done",    color: "#22c55e" },
  { name: "Bias Analysis",     score: 91, status: "done",    color: "#a855f7" },
  { name: "Utility Test",      score: null, status: "active", color: "#f59e0b" },
  { name: "Adversarial Test",  score: null, status: "locked", color: "#475569" },
];

function ValidatorCard() {
  return (
    <div
      style={{
        backgroundColor: "#0b1426",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(99,102,241,0.07), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={15} color="#6366f1" />
          <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 700 }}>Validator Panel</span>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "3px 10px", borderRadius: "999px",
            backgroundColor: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <span style={{ color: "#6366f1", fontSize: "0.68rem", fontFamily: "monospace", fontWeight: 600 }}>DS-4612</span>
        </div>
      </div>

      {/* Layer progress */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ color: "#334155", fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
          Evaluation Layers
        </div>

        {LAYERS.map((layer, i) => (
          <div key={layer.name}>
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {layer.status === "done" && <CheckCircle2 size={13} color={layer.color} />}
                {layer.status === "active" && (
                  <div style={{ width: "13px", height: "13px", borderRadius: "50%", border: `2px solid ${layer.color}`, animation: "spin 1.5s linear infinite" }} />
                )}
                {layer.status === "locked" && <Lock size={12} color={layer.color} />}
                <span style={{ color: layer.status === "locked" ? "#334155" : "#94a3b8", fontSize: "0.78rem" }}>
                  Layer {i + 1}: {layer.name}
                </span>
              </div>
              <span style={{ color: layer.status === "done" ? layer.color : "#334155", fontSize: "0.75rem", fontWeight: 700 }}>
                {layer.status === "done" ? `${layer.score}/100` : layer.status === "active" ? "In Progress" : "Locked"}
              </span>
            </div>
            <div
              style={{
                height: "5px", borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              {layer.status === "done" && (
                <div
                  style={{
                    height: "100%", borderRadius: "999px",
                    width: `${layer.score}%`,
                    backgroundColor: layer.color,
                    boxShadow: `0 0 8px ${layer.color}60`,
                  }}
                />
              )}
              {layer.status === "active" && (
                <div
                  style={{
                    height: "100%", borderRadius: "999px",
                    width: "62%",
                    background: `linear-gradient(90deg, ${layer.color}, ${layer.color}80)`,
                    animation: "progressPulse 1.8s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Consensus bar */}
      <div
        style={{
          margin: "0 20px 16px",
          padding: "14px 16px", borderRadius: "12px",
          backgroundColor: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Validator consensus</span>
          <span style={{ color: "#6366f1", fontSize: "0.78rem", fontWeight: 700 }}>98.2%</span>
        </div>
        <div style={{ height: "4px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "98.2%", borderRadius: "999px", background: "linear-gradient(90deg, #6366f1, #818cf8)", boxShadow: "0 0 8px rgba(99,102,241,0.5)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "8px" }}>
          <Clock size={11} color="#334155" />
          <span style={{ color: "#334155", fontSize: "0.66rem" }}>3 / 3 validators responded · Estimated 2m remaining</span>
        </div>
      </div>

      {/* Reward estimate */}
      <div
        style={{
          margin: "0 20px 20px",
          padding: "12px 16px", borderRadius: "12px",
          backgroundColor: "rgba(34,197,94,0.05)",
          border: "1px solid rgba(34,197,94,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Estimated epoch reward</span>
        <div>
          <span style={{ color: "#22c55e", fontSize: "1rem", fontWeight: 800 }}>4.7 τ</span>
          <span style={{ color: "#22c55e80", fontSize: "0.7rem", marginLeft: "4px" }}>+2x bonus</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progressPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}

export function ForValidatorsSection() {
  const navigate = useNavigate();

  return (
    <section
      id="validators"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #0c1322 100%)",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow right */}
      <div
        style={{
          position: "absolute", top: "30%", right: "-100px",
          width: "500px", height: "500px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "56px", alignItems: "center",
          }}
        >
          {/* Card first (reversed layout) */}
          <ValidatorCard />

          {/* Text column */}
          <div>
            <span
              style={{
                color: "#6366f1", fontSize: "0.72rem", fontWeight: 800,
                letterSpacing: "0.18em", textTransform: "uppercase",
                display: "block", marginBottom: "16px",
              }}
            >
              For Validators
            </span>

            <h2
              style={{
                color: "#f1f5f9",
                fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)",
                fontWeight: 800, letterSpacing: "-0.025em",
                marginBottom: "24px", lineHeight: 1.2,
              }}
            >
              Earn by Ensuring the World's Data Quality
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {BULLETS.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <CheckCircle2 size={18} color="#6366f1" style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/validator")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "13px 24px", borderRadius: "11px",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white", fontSize: "0.95rem", fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 0 24px rgba(99,102,241,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.transform = "translateY(-2px)"; t.style.boxShadow = "0 0 40px rgba(99,102,241,0.55)"; }}
              onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.transform = "translateY(0)"; t.style.boxShadow = "0 0 24px rgba(99,102,241,0.35)"; }}
            >
              <Shield size={16} />
              Become a Validator →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
