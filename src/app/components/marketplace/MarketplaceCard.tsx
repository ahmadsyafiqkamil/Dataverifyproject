import { useState } from "react";
import { ShoppingCart, Shield, Copy, ExternalLink, Heart, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface ScoreBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface Dataset {
  id: number;
  name: string;
  domain: string;
  domainColor: string;
  domainBg: string;
  qualityScore: number;
  description: string;
  records: string;
  size: string;
  minerAddress: string;
  price: string;
  priceUsd: string;
  tags: string[];
  breakdown: ScoreBreakdown[];
  license: string;
  updated: string;
  purchases: number;
}

function QualityScoreBadge({ score }: { score: number }) {
  const radius = 22;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#38bdf8" : score >= 75 ? "#a78bfa" : "#fbbf24";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
      <svg width="60" height="60" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx="30" cy="30" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 5px ${color}90)` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span style={{ color: color, fontSize: "0.82rem", fontWeight: 800, lineHeight: 1 }}>{score}</span>
        <span style={{ color: "#334155", fontSize: "0.52rem", fontWeight: 600, lineHeight: 1, marginTop: "1px" }}>/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: ScoreBreakdown) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "#475569", fontSize: "0.68rem", width: "90px", flexShrink: 0, fontWeight: 500 }}>
        {label}
      </span>
      <div className="flex-1 relative h-1.5 rounded-full overflow-visible" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}70`,
          }}
        />
      </div>
      <span style={{ color: "#64748b", fontSize: "0.68rem", fontWeight: 600, width: "24px", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export function MarketplaceCard({ dataset }: { dataset: Dataset }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();

  const dsId = `DS-${7840 + dataset.id}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurchase = () => {
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      setPurchased(true);
      setTimeout(() => setPurchased(false), 3000);
    }, 1500);
  };

  return (
    <div
      className="rounded-2xl flex flex-col relative overflow-hidden group transition-all duration-300"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(56,189,248,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.2)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(56,189,248,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(56,189,248,0.07)";
      }}
    >
      {/* Subtle grid pattern */}
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

      {/* Hover glow top */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)" }}
      />

      {/* Top section */}
      <div className="relative px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Domain pill */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-2.5"
              style={{
                backgroundColor: dataset.domainBg,
                border: `1px solid ${dataset.domainColor}30`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dataset.domainColor }} />
              <span style={{ color: dataset.domainColor, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                {dataset.domain}
              </span>
            </div>

            {/* Name */}
            <h3
              className="leading-snug pr-2"
              style={{ color: "white", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.3 }}
            >
              {dataset.name}
            </h3>
          </div>

          {/* Quality badge */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <QualityScoreBadge score={dataset.qualityScore} />
            <span style={{ color: "#334155", fontSize: "0.58rem", fontWeight: 500 }}>Quality</span>
          </div>
        </div>

        {/* Description */}
        <p
          className="mt-1.5"
          style={{ color: "#64748b", fontSize: "0.775rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {dataset.description}
        </p>
      </div>

      {/* Score breakdown */}
      <div
        className="relative mx-4 p-3 rounded-xl flex flex-col gap-2"
        style={{
          backgroundColor: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span style={{ color: "#475569", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Score Breakdown
          </span>
          <div className="flex items-center gap-1">
            <Shield size={10} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#38bdf8", fontSize: "0.62rem", fontWeight: 600 }}>Subnet Verified</span>
          </div>
        </div>
        {dataset.breakdown.map((b) => (
          <ScoreBar key={b.label} {...b} />
        ))}
      </div>

      {/* Meta row */}
      <div className="relative px-4 pt-3 pb-2 flex items-center gap-3">
        {/* Dataset stats */}
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "#475569", fontSize: "0.72rem" }}>{dataset.records} records</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "#475569", fontSize: "0.72rem" }}>{dataset.size}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={10} style={{ color: "#fbbf24" }} />
            <span style={{ color: "#475569", fontSize: "0.72rem" }}>{dataset.purchases} bought</span>
          </div>
        </div>
        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
          style={{
            backgroundColor: liked ? "rgba(244,114,182,0.12)" : "rgba(255,255,255,0.04)",
            border: liked ? "1px solid rgba(244,114,182,0.3)" : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Heart
            size={13}
            style={{ color: liked ? "#f472b6" : "#475569", fill: liked ? "#f472b6" : "none" }}
          />
        </button>
      </div>

      {/* Miner address */}
      <div className="relative px-4 py-2.5 mx-4 mb-3 rounded-xl flex items-center justify-between"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex flex-col">
          <span style={{ color: "#334155", fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Miner</span>
          <span style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "monospace" }}>{dataset.minerAddress}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
            style={{ backgroundColor: copied ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)" }}
            title="Copy address"
          >
            <Copy size={11} style={{ color: copied ? "#38bdf8" : "#475569" }} />
          </button>
          <button
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            title="View on explorer"
          >
            <ExternalLink size={11} style={{ color: "#475569" }} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mx-4" style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.04)" }} />

      {/* Price + Buy */}
      <div className="relative px-4 py-3.5 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div style={{ color: "#475569", fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Price</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span style={{ color: "white", fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }}>{dataset.price}</span>
            <span style={{ color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}>TAO</span>
            <span style={{ color: "#334155", fontSize: "0.7rem" }}>≈ ${dataset.priceUsd}</span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={purchasing || purchased}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
          style={{
            background: purchased
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : purchasing
              ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
              : "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            color: "#0a1628",
            fontSize: "0.8rem",
            fontWeight: 700,
            boxShadow: purchased
              ? "0 0 16px rgba(34,197,94,0.35)"
              : "0 0 16px rgba(56,189,248,0.35)",
            opacity: purchasing ? 0.85 : 1,
            minWidth: "110px",
            justifyContent: "center",
          }}
        >
          {purchasing ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#0a1628" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
              </svg>
              Signing...
            </>
          ) : purchased ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#0a1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Purchased!
            </>
          ) : (
            <>
              <ShoppingCart size={13} />
              Buy Dataset
            </>
          )}
        </button>
      </div>

      {/* Tags at very bottom */}
      <div className="relative px-4 pb-3 flex flex-wrap gap-1.5">
        {dataset.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#475569",
              fontSize: "0.65rem",
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
        <span
          className="px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#475569",
            fontSize: "0.65rem",
          }}
        >
          {dataset.license}
        </span>
      </div>

      {/* View details link */}
      <div className="relative px-4 pb-4">
        <button
          onClick={() => navigate(`/marketplace/${dsId}`)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: "rgba(56,189,248,0.05)",
            border: "1px solid rgba(56,189,248,0.15)",
            color: "#38bdf8",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          View Full Details
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}