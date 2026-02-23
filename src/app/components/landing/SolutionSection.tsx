import { Building2, Pickaxe, Shield, CheckCircle2, ArrowRight } from "lucide-react";

const STEPS = [
  { num: 1, icon: Building2, emoji: "🏢", label: "Client Requests Data",   color: "#38bdf8" },
  { num: 2, icon: Pickaxe,   emoji: "⛏️",  label: "Miners Generate Dataset", color: "#6366f1" },
  { num: 3, icon: Shield,    emoji: "🛡️",  label: "Validators Evaluate",   color: "#a855f7" },
  { num: 4, icon: CheckCircle2, emoji: "✅", label: "Verified & Delivered", color: "#22c55e" },
];

export function SolutionSection() {
  return (
    <section
      id="solution"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #111827 50%, #0f172a 100%)",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
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
            The Solution
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
          Decentralized Trust, Cryptographic Proof
        </h2>

        {/* 4-step flow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0",
            marginBottom: "48px",
            position: "relative",
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: "flex", alignItems: "center" }}>
              {/* Step card */}
              <div
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "28px 24px",
                  backgroundColor: "#1e293b",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: "16px",
                  width: "160px",
                  textAlign: "center",
                  position: "relative",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = "translateY(-4px)";
                  t.style.boxShadow = `0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px ${step.color}30`;
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = "translateY(0)";
                  t.style.boxShadow = "none";
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    width: "24px", height: "24px", borderRadius: "50%",
                    backgroundColor: step.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 800, color: "#0a1628",
                    boxShadow: `0 0 10px ${step.color}60`,
                  }}
                >
                  {step.num}
                </div>

                {/* Emoji */}
                <div style={{ fontSize: "2.2rem", marginBottom: "12px", lineHeight: 1 }}>
                  {step.emoji}
                </div>

                {/* Label */}
                <span
                  style={{
                    color: "#94a3b8", fontSize: "0.82rem", fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    display: "flex", alignItems: "center",
                    padding: "0 8px",
                    position: "relative",
                  }}
                >
                  {/* Dashed line */}
                  <div
                    style={{
                      width: "48px", height: "2px",
                      backgroundImage: `repeating-linear-gradient(90deg, #38bdf8 0px, #38bdf8 6px, transparent 6px, transparent 14px)`,
                      position: "relative",
                      animation: "dashMove 1.5s linear infinite",
                    }}
                  />
                  <ArrowRight
                    size={14}
                    color="#38bdf8"
                    style={{ marginLeft: "2px", flexShrink: 0 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Callout box */}
        <div
          style={{
            maxWidth: "780px", margin: "0 auto",
            backgroundColor: "rgba(30,41,59,0.7)",
            border: "1px solid rgba(56,189,248,0.15)",
            borderLeft: "4px solid #38bdf8",
            borderRadius: "12px",
            padding: "24px 28px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 32px rgba(56,189,248,0.05)",
          }}
        >
          <p
            style={{
              color: "#94a3b8", fontSize: "0.98rem", lineHeight: 1.75,
              margin: 0,
            }}
          >
            Every dataset passes a{" "}
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>3-stage evaluation funnel</span>
            {" "}— Screener 1, Screener 2, and Full Validation by{" "}
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>3 independent validators</span>
            {" "}— before receiving an on-chain quality certificate.
            Each stage is recorded immutably on the Bittensor blockchain.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes dashMove {
          0%   { background-position: 0 0; }
          100% { background-position: 28px 0; }
        }
      `}</style>
    </section>
  );
}
