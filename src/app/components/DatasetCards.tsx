import { ShoppingCart, Shield, ChevronRight, FileText, BarChart2, Heart } from "lucide-react";

const datasets = [
  {
    id: 1,
    name: "MedSynth-7B Clinical Records",
    domain: "Healthcare",
    domainColor: "#f472b6",
    domainBg: "rgba(244,114,182,0.12)",
    score: 94,
    price: "12.5",
    description: "Synthetic EHR data with 7B tokens of de-identified clinical notes, lab results, and diagnostic codes.",
    records: "2.4M",
    icon: Heart,
    tags: ["EHR", "Clinical", "HIPAA-safe"],
    verified: true,
  },
  {
    id: 2,
    name: "FinStream-Market Signals",
    domain: "Finance",
    domainColor: "#fbbf24",
    domainBg: "rgba(251,191,36,0.12)",
    score: 89,
    price: "8.2",
    description: "High-frequency synthetic market data with order book depth, trade signals, and volatility patterns.",
    records: "890K",
    icon: BarChart2,
    tags: ["HFT", "OHLCV", "Risk"],
    verified: true,
  },
  {
    id: 3,
    name: "LegalCorpus-NLP Suite",
    domain: "Legal",
    domainColor: "#a78bfa",
    domainBg: "rgba(167,139,250,0.12)",
    score: 97,
    price: "15.0",
    description: "Curated synthetic legal documents: contracts, case summaries, and regulatory filings for LLM fine-tuning.",
    records: "1.1M",
    icon: FileText,
    tags: ["NLP", "Contracts", "Case Law"],
    verified: true,
  },
];

function QualityRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 54, height: 54 }}>
      <svg width="54" height="54" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="27" cy="27" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="27"
          cy="27"
          r={radius}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: "drop-shadow(0 0 4px rgba(56,189,248,0.7))" }}
        />
      </svg>
      <div className="absolute text-center" style={{ transform: "none" }}>
        <span style={{ color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
}

export function DatasetCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 600 }}>Featured Verified Datasets</h2>
          <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "2px" }}>Curated high-quality synthetic data, verified by subnet validators</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:gap-2.5"
          style={{
            color: "#38bdf8",
            fontSize: "0.82rem",
            fontWeight: 500,
            backgroundColor: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          View All
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {datasets.map((ds) => {
          const DomainIcon = ds.icon;
          return (
            <div
              key={ds.id}
              className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 group hover:translate-y-[-3px]"
              style={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(56,189,248,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              }}
            >
              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                style={{ border: "1px solid rgba(56,189,248,0.3)", boxShadow: "inset 0 0 20px rgba(56,189,248,0.04)" }}
              />

              {/* Grid lines */}
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

              {/* Top row */}
              <div className="relative flex items-start justify-between">
                <div>
                  {/* Domain badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-3"
                    style={{ backgroundColor: ds.domainBg, border: `1px solid ${ds.domainColor}30` }}
                  >
                    <DomainIcon size={11} style={{ color: ds.domainColor }} />
                    <span style={{ color: ds.domainColor, fontSize: "0.72rem", fontWeight: 600 }}>{ds.domain}</span>
                  </div>

                  {/* Name */}
                  <h3
                    style={{ color: "white", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.35, maxWidth: "180px" }}
                  >
                    {ds.name}
                  </h3>
                </div>

                {/* Quality ring */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <QualityRing score={ds.score} />
                  <span style={{ color: "#475569", fontSize: "0.62rem", fontWeight: 500 }}>Quality</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: "#64748b", fontSize: "0.8rem", lineHeight: 1.6 }}>{ds.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {ds.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#64748b",
                      fontSize: "0.7rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div
                className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-center">
                  <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>{ds.records}</div>
                  <div style={{ color: "#475569", fontSize: "0.68rem" }}>Records</div>
                </div>
                <div className="w-px h-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Shield size={11} style={{ color: "#38bdf8" }} />
                    <span style={{ color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600 }}>Verified</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.68rem" }}>By Subnet</div>
                </div>
                <div className="w-px h-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                <div className="text-center">
                  <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>{ds.score}/100</div>
                  <div style={{ color: "#475569", fontSize: "0.68rem" }}>Score</div>
                </div>
              </div>

              {/* Price + Purchase */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span style={{ color: "#475569", fontSize: "0.72rem" }}>Price</span>
                  <div className="flex items-baseline gap-1">
                    <span style={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}>{ds.price}</span>
                    <span style={{ color: "#38bdf8", fontSize: "0.78rem", fontWeight: 600 }}>TAO</span>
                  </div>
                </div>

                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                    color: "#0a1628",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    boxShadow: "0 0 16px rgba(56,189,248,0.35)",
                  }}
                >
                  <ShoppingCart size={14} />
                  Purchase
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
