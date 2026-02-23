import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight, CheckCircle2, ShieldCheck, BarChart3,
  Clock, Database, FileJson, User, Star, Hash,
  Download, Eye, Copy, ExternalLink, Zap, Lock,
  Scale, Activity, TrendingUp, AlertCircle,
  ArrowLeft, Package, RefreshCw,
} from "lucide-react";

/* ─── theme ─────────────────────────────────────────────────── */
const CYAN   = "#38bdf8";
const GREEN  = "#22c55e";
const PURPLE = "#a855f7";
const AMBER  = "#f59e0b";

/* ─── mock dataset catalogue (keyed by id) ──────────────────── */
const DATASETS: Record<string, DatasetMeta> = {
  "DS-7841": {
    id: "DS-7841",
    title: "Synthetic Patient Records v3.2",
    domain: "Healthcare",
    domainColor: "#ef4444",
    domainBg: "rgba(239,68,68,0.1)",
    type: "Tabular",
    method: "CTGAN",
    description:
      "A high-fidelity synthetic dataset of 2.4 million de-identified patient records generated using conditional tabular GAN (CTGAN) trained on real-world EHR data. The dataset captures demographic distributions, chronic disease prevalence, lab result correlations, and medication co-occurrence patterns while providing strong differential-privacy guarantees (ε = 0.8). Suitable for clinical ML research, healthcare AI benchmarking, and federated learning prototyping.",
    price: 45,
    priceUSD: 1234,
    records: "2.4M",
    sizeMB: 840,
    format: "Parquet / CSV",
    lastUpdated: "Feb 18, 2026",
    columns: 47,
    overallScore: 92,
    scores: [
      { label: "Statistical Fidelity",  value: 95, icon: BarChart3 },
      { label: "Privacy Preservation",  value: 98, icon: Lock      },
      { label: "Bias & Fairness",       value: 91, icon: Scale     },
      { label: "Downstream Utility",    value: 88, icon: TrendingUp },
      { label: "Adversarial Realism",   value: 87, icon: ShieldCheck },
    ],
    validators: 3,
    validationDate: "Feb 20, 2026",
    consensus: 98.2,
    txHash: "0x3fa85f64…5717efee",
    fullHash: "0x3fa85f645c3819950d1234ac2817efee12ab33cde9918f64159ac517f241bd7a",
    miner: {
      address: "5GrwvaEF…8PH3",
      fullAddress: "5GrwvaEFgNrzmAFwgKTtD8f4NsxvEBXxuK8PH3",
      reputation: 4.8,
      totalDatasets: 42,
      joinedEpoch: 187,
    },
    royaltyPct: 10,
    license: "CC BY-NC 4.0",
    downloads: 318,
    views: 2041,
  },
};

const FALLBACK = DATASETS["DS-7841"];

interface ScoreBar { label: string; value: number; icon: typeof BarChart3 }
interface MinerInfo {
  address: string; fullAddress: string; reputation: number;
  totalDatasets: number; joinedEpoch: number;
}
interface DatasetMeta {
  id: string; title: string; domain: string; domainColor: string; domainBg: string;
  type: string; method: string; description: string;
  price: number; priceUSD: number; records: string; sizeMB: number;
  format: string; lastUpdated: string; columns: number;
  overallScore: number; scores: ScoreBar[];
  validators: number; validationDate: string; consensus: number;
  txHash: string; fullHash: string;
  miner: MinerInfo; royaltyPct: number; license: string;
  downloads: number; views: number;
}

/* ─── animated score bar ─────────────────────────────────────── */
function ScoreBarRow({ label, value, icon: Icon, delay }: ScoreBar & { delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(value), delay); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  const color = value >= 95 ? GREEN : value >= 88 ? CYAN : AMBER;

  return (
    <div ref={ref} className="flex items-center gap-4">
      {/* icon + label */}
      <div className="flex items-center gap-2 shrink-0" style={{ width: "180px" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={13} style={{ color }} />
        </div>
        <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{label}</span>
      </div>

      {/* bar */}
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: value >= 95
              ? `linear-gradient(90deg, ${GREEN}, #16a34a)`
              : `linear-gradient(90deg, ${CYAN}, #0ea5e9)`,
            boxShadow: `0 0 12px ${color}60`,
          }}
        />
      </div>

      {/* score */}
      <div className="shrink-0 flex items-center gap-1" style={{ width: "60px", justifyContent: "flex-end" }}>
        <span style={{ color: color, fontSize: "0.86rem", fontWeight: 700 }}>{value}</span>
        <span style={{ color: "#334155", fontSize: "0.75rem" }}>/100</span>
      </div>
    </div>
  );
}

/* ─── copy-to-clipboard chip ─────────────────────────────────── */
function HashChip({ hash, full }: { hash: string; full: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(full).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all hover:opacity-80"
      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      onClick={copy}
    >
      <Hash size={12} style={{ color: "#475569", flexShrink: 0 }} />
      <span style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "monospace", flex: 1 }}>{hash}</span>
      {copied
        ? <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0 }} />
        : <Copy size={12} style={{ color: "#334155", flexShrink: 0 }} />
      }
    </div>
  );
}

/* ─── purchase button pulse ──────────────────────────────────── */
function PurchaseButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${CYAN} 0%, #0ea5e9 100%)`,
        color: "#0a1628",
        fontSize: "0.95rem",
        fontWeight: 800,
        boxShadow: hover ? "0 0 40px rgba(56,189,248,0.55)" : "0 0 24px rgba(56,189,248,0.35)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {/* shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2.2s ease-in-out infinite",
        }}
      />
      <Zap size={17} />
      Purchase Dataset — 45 TAO
    </button>
  );
}

/* ─── main page ──────────────────────────────────────────────── */
export function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ds: DatasetMeta = (id && DATASETS[id]) ? DATASETS[id] : FALLBACK;

  const [purchased, setPurchased] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* ── breadcrumb ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 fade-up">
        <button onClick={() => navigate("/marketplace")} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ArrowLeft size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.78rem" }}>Marketplace</span>
        </button>
        <ChevronRight size={13} style={{ color: "#334155" }} />
        <span style={{ color: "#475569", fontSize: "0.78rem" }}>{ds.domain}</span>
        <ChevronRight size={13} style={{ color: "#334155" }} />
        <span style={{ color: CYAN, fontSize: "0.78rem", fontWeight: 600, fontFamily: "monospace" }}>{ds.id}</span>
      </div>

      {/* ── two-column layout ──────────────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* ════════════════════════════════
            LEFT COLUMN  (60%)
        ════════════════════════════════ */}
        <div style={{ flex: "0 0 60%" }}>

          {/* Header card */}
          <div
            className="rounded-2xl px-7 py-6 mb-5 fade-up"
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(135deg, rgba(56,189,248,0.04) 0%, rgba(30,41,59,1) 50%)",
              animationDelay: "0.05s",
            }}
          >
            {/* Domain banner line */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: ds.domainColor, boxShadow: `0 0 8px ${ds.domainColor}` }} />
              <span style={{ color: ds.domainColor, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                {ds.domain.toUpperCase()} DATASET
              </span>
              <span style={{ color: "#334155", fontSize: "0.72rem" }}>·</span>
              <span style={{ color: "#475569", fontSize: "0.72rem", fontFamily: "monospace" }}>{ds.id}</span>
            </div>

            {/* Title */}
            <h1
              style={{
                color: "white",
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.25,
                marginBottom: "16px",
              }}
            >
              {ds.title}
            </h1>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {/* Domain */}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: ds.domainBg, border: `1px solid ${ds.domainColor}30`, color: ds.domainColor, fontSize: "0.75rem", fontWeight: 600 }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ds.domainColor }} />
                {ds.domain}
              </span>
              {/* Type */}
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(148,163,184,0.1)", border: "1px solid rgba(148,163,184,0.2)", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500 }}>
                {ds.type}
              </span>
              {/* Method */}
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: PURPLE, fontSize: "0.75rem", fontWeight: 600 }}>
                {ds.method}
              </span>
              {/* Verified */}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: GREEN, fontSize: "0.75rem", fontWeight: 700 }}>
                <CheckCircle2 size={12} />
                Verified ✓
              </span>
              {/* License */}
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#475569", fontSize: "0.75rem" }}>
                {ds.license}
              </span>
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-4 gap-3 mb-5 px-1">
              {[
                { icon: Database,   label: "Records",  value: ds.records },
                { icon: Package,    label: "Size",     value: `${ds.sizeMB} MB` },
                { icon: Eye,        label: "Views",    value: ds.views.toLocaleString() },
                { icon: Download,   label: "Downloads",value: ds.downloads.toString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Icon size={14} style={{ color: "#475569", flexShrink: 0 }} />
                  <div>
                    <div style={{ color: "#334155", fontSize: "0.63rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 600 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7 }}>
              {ds.description}
            </p>
          </div>

          {/* ── Quality Score Breakdown ───────────────────── */}
          <div
            className="rounded-2xl px-7 py-6 mb-5 fade-up"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.06) 100%)", border: "1px solid rgba(56,189,248,0.25)" }}>
                  <BarChart3 size={15} style={{ color: CYAN }} />
                </div>
                <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Quality Score Breakdown</h2>
              </div>

              {/* Overall badge */}
              <div className="relative flex items-center justify-center" style={{ width: "72px", height: "72px" }}>
                {/* Radial glow ring */}
                <svg width="72" height="72" style={{ position: "absolute", inset: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={CYAN} />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(ds.overallScore / 100) * 188.5} 188.5`}
                    transform="rotate(-90 36 36)"
                    style={{ filter: `drop-shadow(0 0 6px ${CYAN}80)` }}
                  />
                </svg>
                <div className="flex flex-col items-center" style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ color: CYAN, fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 }}>{ds.overallScore}</span>
                  <span style={{ color: "#334155", fontSize: "0.6rem", fontWeight: 600 }}>/100</span>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="flex flex-col gap-4">
              {ds.scores.map((s, i) => (
                <ScoreBarRow key={s.label} {...s} delay={i * 120} />
              ))}
            </div>

            {/* Score interpretation */}
            <div
              className="mt-5 flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)" }}
            >
              <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0, marginTop: "1px" }} />
              <p style={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.55 }}>
                This dataset achieved an <span style={{ color: GREEN, fontWeight: 700 }}>overall score of {ds.overallScore}/100</span>, placing it in the{" "}
                <span style={{ color: GREEN, fontWeight: 600 }}>top 4%</span> of all Healthcare datasets on the subnet.
                Privacy Preservation scored {ds.scores[1].value}/100, meeting HIPAA and GDPR synthetic data standards.
              </p>
            </div>
          </div>

          {/* ── Validation Details ────────────────────────── */}
          <div
            className="rounded-2xl px-7 py-6 fade-up"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.06) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <ShieldCheck size={15} style={{ color: GREEN }} />
              </div>
              <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Validation Details</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { icon: User,     label: "Validated by",     value: `${ds.validators} independent validators` },
                { icon: Clock,    label: "Validation date",  value: ds.validationDate },
                { icon: Activity, label: "Consensus",        value: `${ds.consensus}% agreement` },
                { icon: FileJson, label: "File format",      value: ds.format },
                { icon: RefreshCw,label: "Last updated",     value: ds.lastUpdated },
                { icon: Database, label: "Columns",          value: `${ds.columns} features` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <Icon size={13} style={{ color: "#475569" }} />
                  </div>
                  <div>
                    <div style={{ color: "#334155", fontSize: "0.63rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{label}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Consensus visual */}
            <div className="px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Validator consensus</span>
                <span style={{ color: GREEN, fontSize: "0.78rem", fontWeight: 700 }}>{ds.consensus}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${ds.consensus}%`, background: `linear-gradient(90deg, ${GREEN}, #16a34a)`, boxShadow: `0 0 10px ${GREEN}60` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                {[1, 2, 3].map(v => (
                  <div key={v} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #16a34a)`, boxShadow: `0 0 8px ${GREEN}60` }}>
                      <CheckCircle2 size={10} style={{ color: "white" }} />
                    </div>
                    <span style={{ color: "#475569", fontSize: "0.68rem" }}>Validator {v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* On-chain hash */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash size={12} style={{ color: "#475569" }} />
                <span style={{ color: "#334155", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  On-Chain Verification Hash
                </span>
              </div>
              <HashChip hash={ds.txHash} full={ds.fullHash} />
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle size={11} style={{ color: "#334155" }} />
                <span style={{ color: "#334155", fontSize: "0.66rem" }}>Click to copy full hash · Verifiable on Bittensor explorer</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            RIGHT COLUMN  (40%)  — sticky
        ════════════════════════════════ */}
        <div style={{ flex: "0 0 40%", position: "sticky", top: "88px" }} className="fade-up">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(56,189,248,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.06)",
            }}
          >
            {/* Price header */}
            <div
              className="px-6 pt-6 pb-5"
              style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.07) 0%, rgba(30,41,59,0) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div style={{ color: "#475569", fontSize: "0.72rem", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Dataset Price</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span style={{ color: CYAN, fontSize: "2.6rem", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, textShadow: `0 0 30px ${CYAN}40` }}>
                  45
                </span>
                <span style={{ color: CYAN, fontSize: "1.3rem", fontWeight: 700 }}>TAO</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: "#475569", fontSize: "0.82rem" }}>≈ ${ds.priceUSD.toLocaleString()} USD</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <TrendingUp size={9} style={{ color: GREEN }} />
                  <span style={{ color: GREEN, fontSize: "0.62rem", fontWeight: 600 }}>+2.4%</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Size",         value: `${ds.sizeMB} MB` },
                  { label: "Records",      value: ds.records },
                  { label: "File Format",  value: ds.format },
                  { label: "Last Updated", value: ds.lastUpdated },
                  { label: "Columns",      value: `${ds.columns} features` },
                  { label: "License",      value: ds.license },
                ].map(({ label, value }) => (
                  <div key={label} className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color: "#334155", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{label}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="px-6 py-5 flex flex-col gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {purchased ? (
                <div
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #16a34a)`, color: "white", fontSize: "0.95rem", fontWeight: 800, boxShadow: `0 0 24px ${GREEN}40` }}
                >
                  <CheckCircle2 size={17} />
                  Purchased! Access Granted
                </div>
              ) : (
                <PurchaseButton onClick={() => setPurchased(true)} />
              )}

              <button
                onClick={() => setPreviewOpen(o => !o)}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid rgba(56,189,248,0.3)`,
                  color: CYAN,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <Eye size={16} />
                Preview Sample (10 rows)
              </button>

              {/* Preview panel */}
              {previewOpen && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: "#0b1628", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600 }}>SAMPLE PREVIEW</span>
                    <span style={{ color: "#334155", fontSize: "0.65rem" }}>10 / 2.4M rows</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["age", "gender", "diagnosis", "bp_sys"].map(col => (
                            <th key={col} style={{ color: "#334155", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", padding: "6px 10px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["47", "F", "T2DM", "128"],
                          ["62", "M", "HTN", "142"],
                          ["34", "F", "None", "115"],
                          ["71", "M", "CHD", "156"],
                          ["55", "F", "CKD", "133"],
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ color: "#64748b", fontSize: "0.72rem", padding: "5px 10px", fontFamily: "monospace" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-2 flex items-center justify-center gap-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <Lock size={11} style={{ color: "#334155" }} />
                    <span style={{ color: "#334155", fontSize: "0.65rem" }}>Full dataset locked — purchase to access</span>
                  </div>
                </div>
              )}
            </div>

            {/* Miner info */}
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ color: "#334155", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Miner / Creator
              </div>
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CYAN}, #0ea5e9)`, boxShadow: `0 0 14px ${CYAN}40` }}
                >
                  <User size={17} style={{ color: "#0a1628" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 500 }}>
                      {ds.miner.address}
                    </span>
                    <button onClick={() => navigator.clipboard.writeText(ds.miner.fullAddress).catch(() => {})}>
                      <ExternalLink size={11} style={{ color: "#334155" }} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={11} style={{ color: AMBER, fill: AMBER }} />
                      <span style={{ color: AMBER, fontSize: "0.74rem", fontWeight: 700 }}>{ds.miner.reputation}</span>
                    </div>
                    <span style={{ color: "#334155", fontSize: "0.68rem" }}>·</span>
                    <span style={{ color: "#475569", fontSize: "0.72rem" }}>{ds.miner.totalDatasets} datasets verified</span>
                  </div>
                </div>
              </div>

              {/* Miner stats strip */}
              <div className="flex items-center gap-2 mt-3">
                {[
                  { label: "Epoch Joined", value: `#${ds.miner.joinedEpoch}` },
                  { label: "Score Avg",    value: "91.2" },
                  { label: "Trust",        value: "0.974" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex-1 px-2.5 py-2 rounded-xl text-center" style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ color: "#334155", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                    <div style={{ color: "#64748b", fontSize: "0.74rem", fontWeight: 600, marginTop: "1px" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Royalty notice */}
            <div className="px-6 py-4">
              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}
              >
                <Zap size={14} style={{ color: AMBER, flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "#64748b", fontSize: "0.74rem", lineHeight: 1.5 }}>
                  <span style={{ color: AMBER, fontWeight: 700 }}>{ds.royaltyPct}% royalty</span> paid automatically to the miner on every resale. Enforced by on-chain smart contract.
                </p>
              </div>

              {/* Verified badge row */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} style={{ color: GREEN }} />
                  <span style={{ color: "#334155", fontSize: "0.68rem" }}>DataVerify Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Hash size={11} style={{ color: "#334155" }} />
                  <span style={{ color: "#334155", fontSize: "0.68rem" }}>On-chain provenance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related datasets teaser */}
          <div
            className="mt-4 rounded-2xl px-5 py-4"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div style={{ color: "#334155", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
              Similar Datasets
            </div>
            {[
              { id: "DS-7820", title: "EHR Diabetes Cohort v2.1",      score: 89, price: 38 },
              { id: "DS-7805", title: "Pediatric Vitals Synthetic Set", score: 91, price: 52 },
              { id: "DS-7791", title: "Cardiology Records WGAN",        score: 86, price: 31 },
            ].map(r => (
              <button
                key={r.id}
                className="w-full flex items-center justify-between py-2.5 transition-all hover:opacity-70 text-left"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Database size={12} style={{ color: "#ef4444" }} />
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "0.76rem", fontWeight: 500 }}>{r.title}</div>
                    <div style={{ color: "#334155", fontSize: "0.66rem", fontFamily: "monospace" }}>{r.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: CYAN, fontSize: "0.72rem", fontWeight: 600 }}>{r.score}/100</span>
                  <span style={{ color: "#475569", fontSize: "0.72rem" }}>{r.price} τ</span>
                  <ChevronRight size={12} style={{ color: "#334155" }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}