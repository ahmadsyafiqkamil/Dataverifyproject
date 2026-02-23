import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="cta"
      style={{
        position: "relative",
        padding: "100px 24px",
        overflow: "hidden",
        backgroundColor: "#0f172a",
      }}
    >
      {/* Radial gradient from centre */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
        }}
      />

      {/* Animated ring 1 */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px", height: "500px", borderRadius: "50%",
          border: "1px solid rgba(56,189,248,0.07)",
          animation: "ringExpand1 8s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "700px", borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.05)",
          animation: "ringExpand1 8s linear infinite 2s",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "700px", margin: "0 auto",
          position: "relative", zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Label pill */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", borderRadius: "999px",
            backgroundColor: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)",
            marginBottom: "24px",
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ color: "#38bdf8", fontSize: "0.76rem", fontWeight: 600 }}>Open to All Participants</span>
        </div>

        {/* Headline */}
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 900, letterSpacing: "-0.03em",
            lineHeight: 1.15, marginBottom: "18px",
          }}
        >
          Ready to Build the Future of{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            Verified AI Data?
          </span>
        </h2>

        {/* Sub */}
        <p
          style={{
            color: "#64748b", fontSize: "1.05rem", lineHeight: 1.7,
            marginBottom: "36px",
          }}
        >
          Join as a miner, validator, or client. DataVerify Subnet is open to all —
          permissionless, transparent, and community governed.
        </p>

        {/* CTA buttons */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "28px" }}
        >
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "16px 32px", borderRadius: "13px",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              color: "#0a1628", fontSize: "1rem", fontWeight: 800,
              border: "none", cursor: "pointer",
              boxShadow: hovered ? "0 0 60px rgba(56,189,248,0.65)" : "0 0 36px rgba(56,189,248,0.42)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.25s",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
            <ArrowRight size={18} style={{ position: "relative" }} />
            <span style={{ position: "relative" }}>Launch App →</span>
          </button>

          <button
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "15px 28px", borderRadius: "13px",
              backgroundColor: "transparent",
              color: "#f1f5f9", fontSize: "1rem", fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.borderColor = "rgba(255,255,255,0.36)"; t.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.borderColor = "rgba(255,255,255,0.18)"; t.style.backgroundColor = "transparent"; }}
          >
            <BookOpen size={17} />
            Read the Proposal
          </button>
        </div>

        {/* Footer note */}
        <p style={{ color: "#334155", fontSize: "0.8rem" }}>
          Built on Bittensor &nbsp;•&nbsp; Open Source &nbsp;•&nbsp; Community Governed
        </p>
      </div>

      <style>{`
        @keyframes ringExpand1 {
          0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(0.97); }
          50%  { opacity: 0.2; transform: translate(-50%, -50%) scale(1.02); }
          100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.97); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </section>
  );
}
