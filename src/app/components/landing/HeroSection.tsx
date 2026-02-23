import { useNavigate } from "react-router";
import { ParticleBackground } from "./ParticleBackground";
import { ArrowRight, BookOpen, Database, Layers, TrendingUp } from "lucide-react";

const STATS = [
  { icon: Database,   value: "128+",    label: "Verified Datasets" },
  { icon: Layers,     value: "3-Layer", label: "Validation" },
  { icon: TrendingUp, value: "$2.1B",   label: "Market Opportunity" },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        overflow: "hidden",
      }}
    >
      {/* Particle network background */}
      <ParticleBackground />

      {/* Radial glow centre */}
      <div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%", left: "40%",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid texture overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 1,
          maxWidth: "820px", margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        {/* Status pill */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "999px", marginBottom: "28px",
            backgroundColor: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.25)",
          }}
        >
          <div
            style={{
              width: "7px", height: "7px", borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.8)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span style={{ color: "#38bdf8", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.02em" }}>
            ⚡ Built on Bittensor — Now Live on Testnet
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            marginBottom: "22px",
            background: "linear-gradient(135deg, #f1f5f9 30%, #38bdf8 70%, #6366f1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Trustless Verification for Synthetic AI Data
        </h1>

        {/* Subheadline */}
        <p
          style={{
            color: "#94a3b8", fontSize: "1.15rem",
            lineHeight: 1.7, marginBottom: "36px",
            maxWidth: "620px", margin: "0 auto 36px",
          }}
        >
          Replace vendor assumptions with cryptographic proof. DataVerify Subnet is the
          decentralized quality layer that AI teams have been waiting for.
        </p>

        {/* CTA Buttons */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "52px" }}
        >
          <button
            onClick={() => navigate("/marketplace")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "12px",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              color: "#0a1628", fontSize: "1rem", fontWeight: 700,
              border: "none", cursor: "pointer",
              boxShadow: "0 0 32px rgba(56,189,248,0.4)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.boxShadow = "0 0 48px rgba(56,189,248,0.65)"; t.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.boxShadow = "0 0 32px rgba(56,189,248,0.4)"; t.style.transform = "translateY(0)"; }}
          >
            Explore Marketplace
            <ArrowRight size={18} />
          </button>

          <button
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 28px", borderRadius: "12px",
              backgroundColor: "transparent",
              color: "#f1f5f9", fontSize: "1rem", fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.borderColor = "rgba(255,255,255,0.4)"; t.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.borderColor = "rgba(255,255,255,0.2)"; t.style.backgroundColor = "transparent"; }}
          >
            <BookOpen size={17} />
            Read the Proposal
          </button>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            flexWrap: "wrap", gap: "0",
            backgroundColor: "rgba(30,41,59,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <div style={{ width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.08)" }} />
              )}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "18px 32px",
                }}
              >
                <s.icon size={18} color="#38bdf8" />
                <div>
                  <div style={{ color: "#38bdf8", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #0f172a)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
