import { AlertTriangle, Eye, Scale } from "lucide-react";

const PROBLEMS = [
  {
    icon: AlertTriangle,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    title: "Garbage In, Garbage Out",
    desc: "Statistical drift degrades model performance without anyone noticing. Without independent verification, every synthetic dataset is a liability disguised as an asset.",
  },
  {
    icon: Eye,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    title: "Hidden Privacy Leaks",
    desc: "'Anonymized' data that still allows re-identification of real individuals. Traditional de-identification methods fail against modern linkage attacks.",
  },
  {
    icon: Scale,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
    title: "Invisible Bias",
    desc: "Demographic imbalances baked into synthetic datasets, creating unfair AI outcomes at scale. The bias is invisible — until your model fails in production.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        backgroundColor: "#020617",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle dot texture */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
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
            The Problem
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            textAlign: "center", color: "#f1f5f9",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800, letterSpacing: "-0.025em",
            marginBottom: "16px",
          }}
        >
          AI's Dirty Secret: No One Verifies the Data
        </h2>

        {/* Subtext */}
        <p
          style={{
            textAlign: "center", color: "#64748b",
            fontSize: "1.05rem", lineHeight: 1.7,
            maxWidth: "560px", margin: "0 auto 56px",
          }}
        >
          The synthetic data market is growing to $2.1B by 2027. Yet there is no
          independent, verifiable quality standard.
        </p>

        {/* Problem cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {PROBLEMS.map(p => (
            <div
              key={p.title}
              style={{
                backgroundColor: "#0b1220",
                border: `1px solid ${p.border}`,
                borderRadius: "16px",
                padding: "32px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={e => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "translateY(-4px)";
                t.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.border}`;
              }}
              onMouseLeave={e => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "translateY(0)";
                t.style.boxShadow = "none";
              }}
            >
              {/* Subtle top gradient */}
              <div
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  backgroundColor: p.bg, border: `1px solid ${p.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <p.icon size={24} color={p.color} />
              </div>

              {/* Title */}
              <h3
                style={{
                  color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700,
                  marginBottom: "12px", letterSpacing: "-0.015em",
                }}
              >
                {p.title}
              </h3>

              {/* Description */}
              <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
