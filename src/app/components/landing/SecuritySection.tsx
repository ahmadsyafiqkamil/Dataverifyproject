import { useState } from "react";

const CARDS = [
  {
    emoji: "🚫",
    title: "No Lazy Evaluation",
    desc: "Validators who skip required tests are cross-validated against consensus — persistent outliers lose stake.",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.18)",
    border: "rgba(56,189,248,0.22)",
  },
  {
    emoji: "🤝",
    title: "No Collusion",
    desc: "Shapley scoring detects coordinated inflation. Validator rotation prevents predictable assignments.",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.18)",
    border: "rgba(34,197,94,0.22)",
  },
  {
    emoji: "☠️",
    title: "No Data Poisoning",
    desc: "All 5 evaluation layers must pass independently. Long-term tracking flags retroactive failures.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
    border: "rgba(245,158,11,0.22)",
  },
  {
    emoji: "👤",
    title: "No Sybil Attacks",
    desc: "TAO staking required for registration. Rate limiting per epoch prevents submission flooding.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.18)",
    border: "rgba(168,85,247,0.22)",
  },
];

function SecurityCard({ card }: { card: typeof CARDS[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1e293b",
        border: `1px solid ${hovered ? card.border : "rgba(255,255,255,0.07)"}`,
        borderLeft: `3px solid ${card.color}`,
        borderRadius: "14px",
        padding: "28px 26px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.28s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 40px rgba(0,0,0,0.4), 0 0 24px ${card.glow}`
          : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle corner glow on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "120px", height: "120px",
            background: `radial-gradient(circle at top left, ${card.glow}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon + title row */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px", height: "48px", borderRadius: "12px",
            backgroundColor: `${card.color}10`,
            border: `1px solid ${card.color}25`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", lineHeight: 1,
            flexShrink: 0,
            boxShadow: hovered ? `0 0 14px ${card.glow}` : "none",
            transition: "box-shadow 0.28s",
          }}
        >
          {card.emoji}
        </div>
        <h3
          style={{
            color: "#f1f5f9",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          {card.title}
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          color: "#64748b",
          fontSize: "0.88rem",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {card.desc}
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          height: "1px",
          background: `linear-gradient(90deg, ${card.color}30, transparent)`,
          marginTop: "4px",
        }}
      />

      {/* Status pill */}
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: card.color,
            boxShadow: `0 0 6px ${card.color}`,
          }}
        />
        <span
          style={{
            color: card.color,
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Active Protection
        </span>
      </div>
    </div>
  );
}

export function SecuritySection() {
  return (
    <section
      id="security"
      style={{
        backgroundColor: "#020617",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid texture */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span
            style={{
              color: "#38bdf8",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Network Security
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            textAlign: "center",
            color: "#f1f5f9",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            marginBottom: "12px",
          }}
        >
          Designed to Be{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Manipulation-Proof
          </span>
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "0.98rem",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 52px",
          }}
        >
          Four independent game-theoretic mechanisms guard the network against
          every known attack vector.
        </p>

        {/* 2×2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {CARDS.map(card => (
            <SecurityCard key={card.title} card={card} />
          ))}
        </div>

        {/* Bottom principle callout */}
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "center",
            padding: "24px 32px",
            borderRadius: "14px",
            backgroundColor: "rgba(56,189,248,0.04)",
            border: "1px solid rgba(56,189,248,0.14)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top glow line */}
          <div
            style={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "120px", height: "1px",
              background: "linear-gradient(90deg, transparent, #38bdf8, transparent)",
            }}
          />

          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.98rem",
              lineHeight: 1.75,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            "Every mechanism was designed with one principle:{" "}
            <span style={{ color: "#f1f5f9", fontWeight: 700, fontStyle: "normal" }}>
              the cost of cheating must always exceed the benefit.
            </span>
            "
          </p>
        </div>
      </div>
    </section>
  );
}
