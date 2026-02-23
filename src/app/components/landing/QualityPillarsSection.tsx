import { useState } from "react";

const PILLARS = [
  {
    emoji: "📊",
    name: "Statistical Fidelity",
    weight: "25%",
    desc: "KS-test + Chi-square distribution matching across all marginals and joint distributions.",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    emoji: "🔒",
    name: "Privacy Preservation",
    weight: "25%",
    desc: "k-anonymity + differential privacy audit ensuring ε ≤ 1.0 and zero re-identification risk.",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.25)",
  },
  {
    emoji: "⚖️",
    name: "Bias & Fairness",
    weight: "20%",
    desc: "Disparate impact analysis across all protected attributes, aligned with EU AI Act standards.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.25)",
  },
  {
    emoji: "🎯",
    name: "Downstream Utility",
    weight: "20%",
    desc: "Train-on-Synthetic, Test-on-Real (TSTR) pipeline benchmarked against real validation sets.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    emoji: "🎭",
    name: "Adversarial Realism",
    weight: "10%",
    desc: "GAN discriminator fooling test — synthetic samples must be indistinguishable from real ones.",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.25)",
  },
];

function PillarCard({ pillar }: { pillar: typeof PILLARS[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1e293b",
        border: `1px solid ${hovered ? pillar.color + "40" : "rgba(255,255,255,0.07)"}`,
        borderTop: `2px solid ${pillar.color}`,
        borderRadius: "14px",
        padding: "28px 22px",
        display: "flex", flexDirection: "column",
        transition: "all 0.28s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.35), 0 0 24px ${pillar.glow}` : "none",
        cursor: "default",
        flex: "1 1 180px",
        minWidth: "160px",
      }}
    >
      {/* Emoji */}
      <div style={{ fontSize: "2.4rem", marginBottom: "14px", lineHeight: 1 }}>
        {pillar.emoji}
      </div>

      {/* Weight badge */}
      <div
        style={{
          display: "inline-flex", alignItems: "center",
          padding: "3px 10px", borderRadius: "999px",
          backgroundColor: `${pillar.color}14`,
          border: `1px solid ${pillar.color}30`,
          marginBottom: "10px", alignSelf: "flex-start",
        }}
      >
        <span style={{ color: pillar.color, fontSize: "0.7rem", fontWeight: 700 }}>
          Weight: {pillar.weight}
        </span>
      </div>

      {/* Name */}
      <h3
        style={{
          color: "#f1f5f9", fontSize: "1rem", fontWeight: 700,
          letterSpacing: "-0.015em", marginBottom: "10px",
        }}
      >
        {pillar.name}
      </h3>

      {/* Description */}
      <p style={{ color: "#64748b", fontSize: "0.83rem", lineHeight: 1.65, margin: 0 }}>
        {pillar.desc}
      </p>
    </div>
  );
}

export function QualityPillarsSection() {
  return (
    <section
      id="marketplace"
      style={{
        backgroundColor: "#0f172a",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span
            style={{
              color: "#38bdf8", fontSize: "0.72rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
            }}
          >
            Quality Dimensions
          </span>
        </div>

        <h2
          style={{
            textAlign: "center", color: "#f1f5f9",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800, letterSpacing: "-0.025em",
            marginBottom: "12px",
          }}
        >
          Five Independent Layers of Verification
        </h2>

        <p
          style={{
            textAlign: "center", color: "#64748b",
            fontSize: "1rem", lineHeight: 1.7,
            maxWidth: "500px", margin: "0 auto 52px",
          }}
        >
          Each dataset is scored independently across five orthogonal dimensions,
          producing a composite quality certificate.
        </p>

        {/* Cards row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {PILLARS.map(p => (
            <PillarCard key={p.name} pillar={p} />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          style={{
            marginTop: "40px", textAlign: "center",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}
        >
          <div
            style={{
              display: "inline-flex", gap: "4px", padding: "6px 16px",
              backgroundColor: "rgba(56,189,248,0.06)",
              border: "1px solid rgba(56,189,248,0.18)",
              borderRadius: "999px",
            }}
          >
            {PILLARS.map(p => (
              <div
                key={p.name}
                title={p.name}
                style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.glow}`,
                }}
              />
            ))}
            <span style={{ color: "#64748b", fontSize: "0.78rem", marginLeft: "8px" }}>
              Composite score = weighted average of all 5 dimensions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
