import { CheckCircle2, ArrowRight, TrendingUp, Star, Repeat2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

const BULLETS = [
  "Earn TAO on every valid submission",
  "3x quality multiplier for top-scoring datasets",
  "Royalties every time your dataset is repurchased",
  "Innovation premium for rare or specialized data types",
];

function MinerCard() {
  return (
    <div
      style={{
        backgroundColor: "#0b1426",
        border: "1px solid rgba(56,189,248,0.15)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.08)",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(56,189,248,0.06), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrendingUp size={15} color="#38bdf8" />
          <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 700 }}>Miner Earnings Dashboard</span>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "999px",
            backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ color: "#22c55e", fontSize: "0.68rem", fontWeight: 700 }}>Active</span>
        </div>
      </div>

      {/* Total earned */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
        }}
      >
        {[
          { label: "Total Earned",   value: "284.7 τ", sub: "All time", color: "#38bdf8" },
          { label: "This Epoch",     value: "12.3 τ",  sub: "Epoch #247", color: "#22c55e" },
        ].map(s => (
          <div
            key={s.label}
            style={{
              padding: "14px 16px", borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
              {s.label}
            </div>
            <div style={{ color: s.color, fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: "#334155", fontSize: "0.68rem", marginTop: "2px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ color: "#334155", fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Recent Submissions
        </div>
        {[
          { id: "DS-4612", label: "Healthcare Tabular", score: 98, reward: "8.2 τ", mult: "3x", color: "#38bdf8" },
          { id: "DS-4821", label: "Finance Sequential", score: 96, reward: "4.1 τ", mult: "2x", color: "#6366f1" },
          { id: "DS-4756", label: "NLP Corpus",        score: 91, reward: "2.3 τ", mult: "1x", color: "#94a3b8" },
        ].map(item => (
          <div
            key={item.id}
            style={{
              padding: "12px 14px", borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: item.color, fontSize: "0.72rem", fontWeight: 600, fontFamily: "monospace" }}>
                  {item.id}
                </span>
                <div
                  style={{
                    padding: "1px 6px", borderRadius: "4px",
                    backgroundColor: `${item.color}14`, border: `1px solid ${item.color}25`,
                    color: item.color, fontSize: "0.6rem", fontWeight: 700,
                  }}
                >
                  {item.mult} bonus
                </div>
              </div>
              <div style={{ color: "#475569", fontSize: "0.7rem", marginTop: "2px" }}>{item.label}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#22c55e", fontSize: "0.9rem", fontWeight: 700 }}>{item.reward}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", justifyContent: "flex-end" }}>
                <Star size={9} color="#f59e0b" fill="#f59e0b" />
                <span style={{ color: "#f59e0b", fontSize: "0.66rem", fontWeight: 600 }}>{item.score}/100</span>
              </div>
            </div>
          </div>
        ))}

        {/* Royalties strip */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderRadius: "10px",
            backgroundColor: "rgba(168,85,247,0.06)",
            border: "1px solid rgba(168,85,247,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Repeat2 size={13} color="#a855f7" />
            <span style={{ color: "#94a3b8", fontSize: "0.74rem" }}>Royalties earned this week</span>
          </div>
          <span style={{ color: "#a855f7", fontSize: "0.88rem", fontWeight: 700 }}>2.4 τ</span>
        </div>
      </div>
    </div>
  );
}

export function ForMinersSection() {
  const navigate = useNavigate();

  return (
    <section
      id="miners"
      style={{
        backgroundColor: "#020617",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow left */}
      <div
        style={{
          position: "absolute", top: "30%", left: "-100px",
          width: "500px", height: "500px",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 70%)",
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
          {/* Text column */}
          <div>
            <span
              style={{
                color: "#38bdf8", fontSize: "0.72rem", fontWeight: 800,
                letterSpacing: "0.18em", textTransform: "uppercase",
                display: "block", marginBottom: "16px",
              }}
            >
              For Miners
            </span>

            <h2
              style={{
                color: "#f1f5f9",
                fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)",
                fontWeight: 800, letterSpacing: "-0.025em",
                marginBottom: "24px", lineHeight: 1.2,
              }}
            >
              Turn Your Generative AI Into Passive Income
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {BULLETS.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <CheckCircle2 size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/miner")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "13px 24px", borderRadius: "11px",
                background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                color: "#0a1628", fontSize: "0.95rem", fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 0 24px rgba(56,189,248,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.transform = "translateY(-2px)"; t.style.boxShadow = "0 0 40px rgba(56,189,248,0.55)"; }}
              onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.transform = "translateY(0)"; t.style.boxShadow = "0 0 24px rgba(56,189,248,0.35)"; }}
            >
              <Sparkles size={16} />
              Start Mining →
            </button>
          </div>

          {/* Card mockup */}
          <MinerCard />
        </div>
      </div>
    </section>
  );
}
