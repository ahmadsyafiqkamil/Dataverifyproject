import { ArrowRight, Upload, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export function SubmitCTA() {
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #0f2744 0%, #0f1f38 40%, #0f172a 100%)",
        border: "1px solid rgba(56,189,248,0.2)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
      onClick={() => navigate("/miner/submit")}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(56,189,248,0.45)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(56,189,248,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(56,189,248,0.2)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)";
      }}
    >
      {/* Animated scan line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-10 right-40 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />

      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.6) 30%, rgba(129,140,248,0.4) 70%, transparent 100%)" }}
      />

      <div className="relative px-7 py-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.08) 100%)",
              border: "1px solid rgba(56,189,248,0.3)",
              boxShadow: "0 0 20px rgba(56,189,248,0.15)",
            }}
          >
            <Upload size={24} style={{ color: "#38bdf8" }} />
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 style={{ color: "white", fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
                Submit a New Dataset
              </h2>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                <Sparkles size={10} style={{ color: "#f59e0b" }} />
                <span style={{ color: "#f59e0b", fontSize: "0.62rem", fontWeight: 700 }}>EARN UP TO 52 TAO</span>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Start earning TAO rewards by generating high-quality synthetic data. Each verified submission earns based on quality score.
            </p>
          </div>
        </div>

        {/* Steps hint */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          {["Generate Data", "Upload & Sign", "Earn Rewards"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                    boxShadow: "0 0 10px rgba(56,189,248,0.4)",
                  }}
                >
                  <span style={{ color: "white", fontSize: "0.62rem", fontWeight: 800 }}>{i + 1}</span>
                </div>
                <span style={{ color: "#64748b", fontSize: "0.68rem", fontWeight: 500, whiteSpace: "nowrap" }}>{step}</span>
              </div>
              {i < 2 && <ChevronRight size={13} style={{ color: "#1e3a5f", marginBottom: "14px" }} />}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl shrink-0 transition-all duration-200 group-hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            color: "#0a1628",
            fontSize: "0.88rem",
            fontWeight: 700,
            boxShadow: "0 0 24px rgba(56,189,248,0.4)",
          }}
        >
          Submit Now
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
