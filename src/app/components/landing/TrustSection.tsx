import { Link2, Shield, Zap } from "lucide-react";

const BADGES = [
  { icon: Link2,  color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.22)", label: "On-Chain Immutability",     sub: "Every score is verifiable on Bittensor" },
  { icon: Shield, color: "#a855f7", bg: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.22)", label: "Shapley Consensus Scoring", sub: "Game-theoretic validator alignment" },
  { icon: Zap,    color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.22)", label: "TAO-Powered Incentives",    sub: "Aligned economics for all participants" },
];

export function TrustSection() {
  return (
    <section
      id="trust"
      style={{
        backgroundColor: "#1e293b",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot texture */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "900px", margin: "0 auto",
          position: "relative", zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Headline */}
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800, letterSpacing: "-0.025em",
            marginBottom: "44px",
          }}
        >
          Built on Bittensor.{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #38bdf8, #6366f1)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            Verified On-Chain.
          </span>
        </h2>

        {/* Trust badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px", marginBottom: "48px",
          }}
        >
          {BADGES.map(b => (
            <div
              key={b.label}
              style={{
                padding: "24px", borderRadius: "14px",
                backgroundColor: b.bg, border: `1px solid ${b.border}`,
                display: "flex", alignItems: "center", gap: "16px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  backgroundColor: b.bg, border: `1px solid ${b.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${b.bg}`,
                }}
              >
                <b.icon size={20} color={b.color} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700, marginBottom: "3px" }}>
                  {b.label}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote card */}
        <div
          style={{
            backgroundColor: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            padding: "36px 40px",
            position: "relative",
            marginBottom: "36px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Decorative quote mark */}
          <div
            style={{
              position: "absolute", top: "16px", left: "24px",
              fontSize: "5rem", lineHeight: 1, color: "rgba(56,189,248,0.1)",
              fontFamily: "Georgia, serif", pointerEvents: "none",
            }}
          >
            "
          </div>

          {/* Top cyan accent line */}
          <div
            style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "80px", height: "2px",
              background: "linear-gradient(90deg, transparent, #38bdf8, transparent)",
              borderRadius: "999px",
            }}
          />

          <p
            style={{
              color: "#e2e8f0", fontSize: "1.15rem",
              lineHeight: 1.75, fontStyle: "italic",
              marginBottom: "20px", position: "relative", zIndex: 1,
            }}
          >
            "The future of AI training data isn't built on vendor promises.
            It's built on decentralized truth."
          </p>

          <div
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px", height: "2px",
                background: "linear-gradient(90deg, transparent, #38bdf8)",
              }}
            />
            <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 500 }}>
              — DataVerify Subnet Vision Statement
            </span>
            <div
              style={{
                width: "32px", height: "2px",
                background: "linear-gradient(90deg, #38bdf8, transparent)",
              }}
            />
          </div>
        </div>

        {/* Ecosystem badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "10px 20px", borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
            }}
          />
          <span style={{ color: "#64748b", fontSize: "0.82rem" }}>
            Part of the Bittensor Ecosystem
          </span>
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>•</span>
          <span
            style={{
              color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            Subnet #47
          </span>
        </div>
      </div>
    </section>
  );
}
