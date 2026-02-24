import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Clock,
  Database,
  User,
  Star,
  Download,
  Eye,
  Copy,
  ExternalLink,
  Zap,
  Lock,
  Scale,
  TrendingUp,
  ArrowLeft,
  Link2,
  Award,
  Cpu,
  PackageCheck,
  Hash,
  AlertCircle,
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  cyan:   "#38bdf8",
  green:  "#22c55e",
  purple: "#a855f7",
  amber:  "#f59e0b",
  pink:   "#ec4899",
  bg:     "#0f172a",
  card:   "#1e293b",
  text:   "#f1f5f9",
  muted:  "#94a3b8",
  border: "rgba(255,255,255,0.07)",
};

// ─── Dataset data ─────────────────────────────────────────────────────────────
const DS = {
  title:       "RxBench Pharmacovigilance",
  domain:      "Healthcare",
  type:        "Tabular",
  method:      "CTGAN",
  description: "Synthetic adverse drug reaction reports, medication interaction signals, and pharmacokinetic profiles for drug safety ML modeling. Generated with conditional GAN trained on anonymised EHR cohorts with ε-differential privacy guarantees.",
  records:     "620K",
  sizeGB:      "9.7 GB",
  purchased:   503,
  added:       "Feb 15, 2026",
  overallScore: 92,
  price:       13.2,
  priceExt:    18.5,
  priceCom:    28.0,
  priceUSD:    512.94,
  scores: [
    { label: "Statistical Fidelity",  value: 93, weight: 0.25, color: C.cyan,   barGrad: `linear-gradient(90deg,${C.cyan},#0ea5e9)` },
    { label: "Privacy Preservation",  value: 98, weight: 0.25, color: C.green,  barGrad: `linear-gradient(90deg,${C.green},#16a34a)` },
    { label: "Bias & Fairness",       value: 88, weight: 0.20, color: C.purple, barGrad: `linear-gradient(90deg,${C.purple},#7c3aed)` },
    { label: "Downstream Utility",    value: 92, weight: 0.20, color: C.amber,  barGrad: `linear-gradient(90deg,${C.amber},#d97706)` },
    { label: "Adversarial Realism",   value: 90, weight: 0.10, color: C.pink,   barGrad: `linear-gradient(90deg,${C.pink},#db2777)` },
  ],
  cert: {
    id:        "CERT-0x7f3a...9c2d",
    block:     "#4,819,204",
    timestamp: "Feb 15, 2026 · 09:42:17 UTC",
    network:   "Bittensor Mainnet",
    subnet:    "#47 DataVerify",
    score:     "92/100",
  },
  validators: [
    { addr: "5GmCcrPH...dW9vR", score: 91 },
    { addr: "5F3sa2TJ...nLmYi", score: 93 },
    { addr: "5HqUkGZa...mK8Pp", score: 92 },
  ],
  shapley: 98.4,
  miner: {
    initials:  "AK",
    address:   "5GrwvaEF…8PH3",
    fullAddr:  "5GrwvaEFgNrzmAFwgKTtD8f4NsxvEBXxuK8PH3",
    rep:       4.9,
    datasets:  47,
    royalty:   10,
  },
  related: [
    { id: "DS-7201", title: "ClinTrials Adverse Events v2", domain: "Healthcare", score: 89, price: "9.4 TAO" },
    { id: "DS-6854", title: "MedNER Synthetic Corpus", domain: "Healthcare", score: 94, price: "11.8 TAO" },
  ],
};

// ─── Animated score bar ───────────────────────────────────────────────────────
function ScoreBar({
  label, value, weight, color, barGrad, delay,
}: {
  label: string; value: number; weight: number;
  color: string; barGrad: string; delay: number;
}) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setW(value), delay); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* Label */}
      <div style={{ width: "170px", flexShrink: 0 }}>
        <span style={{ color: C.muted, fontSize: "0.82rem" }}>{label}</span>
        <span
          style={{
            marginLeft: "6px",
            color: "#334155",
            fontSize: "0.68rem",
            fontWeight: 600,
          }}
        >
          ×{weight}
        </span>
      </div>
      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: "7px",
          borderRadius: "99px",
          backgroundColor: "rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            borderRadius: "99px",
            background: barGrad,
            boxShadow: `0 0 10px ${color}55`,
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      {/* Score */}
      <div style={{ width: "50px", textAlign: "right", flexShrink: 0 }}>
        <span style={{ color, fontSize: "0.88rem", fontWeight: 800 }}>{value}</span>
        <span style={{ color: "#334155", fontSize: "0.72rem" }}>/100</span>
      </div>
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function Card({
  children, style,
}: {
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: C.card,
        borderRadius: "16px",
        border: `1px solid ${C.border}`,
        marginBottom: "16px",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );
}

// ─── License radio option ─────────────────────────────────────────────────────
function LicenseOption({
  label, sublabel, price, selected, onClick,
}: {
  label: string; sublabel: string; price: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "10px",
        border: `1px solid ${selected ? "rgba(56,189,248,0.35)" : "rgba(255,255,255,0.06)"}`,
        backgroundColor: selected ? "rgba(56,189,248,0.07)" : "rgba(255,255,255,0.02)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.18s",
      }}
    >
      {/* Radio */}
      <div
        style={{
          width: "17px",
          height: "17px",
          borderRadius: "50%",
          border: `2px solid ${selected ? C.cyan : "#334155"}`,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "border-color 0.15s",
        }}
      >
        {selected && (
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: C.cyan,
              boxShadow: `0 0 6px ${C.cyan}`,
            }}
          />
        )}
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: selected ? C.text : C.muted, fontSize: "0.84rem", fontWeight: selected ? 700 : 500 }}>
          {label}
        </div>
        <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "1px" }}>{sublabel}</div>
      </div>
      {/* Price */}
      <div style={{ color: selected ? C.cyan : "#64748b", fontSize: "0.86rem", fontWeight: 700, flexShrink: 0 }}>
        {price}
      </div>
    </button>
  );
}

// ─── Purchase button ──────────────────────────────────────────────────────────
function BuyButton({
  label, onClick, purchased,
}: {
  label: string; onClick: () => void; purchased: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "13px",
        borderRadius: "11px",
        border: "none",
        cursor: "pointer",
        background: purchased
          ? `linear-gradient(135deg,${C.green},#16a34a)`
          : `linear-gradient(135deg,${C.cyan},#0ea5e9)`,
        color: "#0a1628",
        fontSize: "0.95rem",
        fontWeight: 800,
        boxShadow: purchased
          ? `0 6px 24px rgba(34,197,94,0.35)`
          : hov
          ? `0 6px 28px rgba(56,189,248,0.55)`
          : `0 4px 18px rgba(56,189,248,0.32)`,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        letterSpacing: "0.01em",
      }}
    >
      {/* shimmer */}
      {!purchased && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      {purchased ? <CheckCircle2 size={17} /> : <Zap size={16} />}
      <span style={{ position: "relative" }}>{label}</span>
    </button>
  );
}

// ─── Related dataset mini card ────────────────────────────────────────────────
function RelatedCard({ ds }: { ds: typeof DS.related[number] }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "13px 14px",
        borderRadius: "11px",
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "border-color 0.18s, background-color 0.18s",
      }}
      onClick={() => navigate(`/marketplace/${ds.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.22)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(56,189,248,0.03)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
        <div>
          <div style={{ color: C.text, fontSize: "0.82rem", fontWeight: 700, marginBottom: "3px" }}>{ds.title}</div>
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "20px",
              backgroundColor: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.2)",
              color: C.cyan,
              fontSize: "0.66rem",
              fontWeight: 600,
            }}
          >
            {ds.domain}
          </span>
        </div>
        <div
          style={{
            padding: "3px 8px",
            borderRadius: "7px",
            backgroundColor: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            color: C.green,
            fontSize: "0.72rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {ds.score}/100
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: C.cyan, fontSize: "0.84rem", fontWeight: 700 }}>{ds.price}</span>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: "4px 10px",
            borderRadius: "7px",
            border: "1px solid rgba(56,189,248,0.25)",
            backgroundColor: "rgba(56,189,248,0.08)",
            color: C.cyan,
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function DatasetDetailPage() {
  const navigate = useNavigate();
  const [license, setLicense] = useState<"basic" | "extended" | "commercial">("extended");
  const [purchased, setPurchased] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePrice =
    license === "basic" ? DS.price :
    license === "extended" ? DS.priceExt :
    DS.priceCom;

  const handleCopy = () => {
    navigator.clipboard.writeText("5GrwvaEFgNrzmAFwgKTtD8f4NsxvEBXxuK8PH3").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formula string
  const formula = `(93×0.25) + (98×0.25) + (88×0.20) + (92×0.20) + (90×0.10) = 92.2`;

  return (
    <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div
        className="fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "22px",
        }}
      >
        <button
          onClick={() => navigate("/marketplace")}
          style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.78rem" }}>Marketplace</span>
        </button>
        <ChevronRight size={12} style={{ color: "#334155" }} />
        <span style={{ color: "#475569", fontSize: "0.78rem" }}>Healthcare</span>
        <ChevronRight size={12} style={{ color: "#334155" }} />
        <span style={{ color: C.cyan, fontSize: "0.78rem", fontWeight: 600 }}>
          {DS.title}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "18px", alignItems: "start" }}>

        {/* ════ LEFT COLUMN ════ */}
        <div>

          {/* ── Section 1: Dataset Header ── */}
          <Card style={{ animationDelay: "0s" }}>
            <div
              style={{
                padding: "26px 28px",
                background: "linear-gradient(135deg, rgba(56,189,248,0.05) 0%, transparent 60%)",
              }}
            >
              {/* Title */}
              <h1
                style={{
                  color: C.text,
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.25,
                  marginBottom: "14px",
                }}
              >
                {DS.title}
              </h1>

              {/* Tag pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "16px" }}>
                {/* Healthcare */}
                <span style={{ padding: "4px 12px", borderRadius: "20px", backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: C.cyan, fontSize: "0.75rem", fontWeight: 700 }}>
                  Healthcare
                </span>
                {/* Tabular */}
                <span style={{ padding: "4px 12px", borderRadius: "20px", backgroundColor: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", color: C.muted, fontSize: "0.75rem", fontWeight: 500 }}>
                  Tabular
                </span>
                {/* CTGAN */}
                <span style={{ padding: "4px 12px", borderRadius: "20px", backgroundColor: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: C.purple, fontSize: "0.75rem", fontWeight: 600 }}>
                  CTGAN
                </span>
                {/* Verified */}
                <span style={{ padding: "4px 12px", borderRadius: "20px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)", color: C.green, fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} />
                  Subnet Verified
                </span>
              </div>

              {/* Description */}
              <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "20px" }}>
                {DS.description}
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { icon: Database, label: "620K records" },
                  { icon: PackageCheck, label: "9.7 GB" },
                  { icon: Download, label: "503 purchased" },
                  { icon: Clock, label: "Added Feb 15, 2026" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon size={13} style={{ color: "#475569" }} />
                    <span style={{ color: C.muted, fontSize: "0.78rem", fontWeight: 500 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ── Section 2: Quality Score Breakdown ── */}
          <Card className="fade-up">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    backgroundColor: "rgba(56,189,248,0.1)",
                    border: "1px solid rgba(56,189,248,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChart3 size={15} style={{ color: C.cyan }} />
                </div>
                <span style={{ color: C.text, fontSize: "0.95rem", fontWeight: 700 }}>
                  Quality Score Breakdown
                </span>
              </div>

              {/* Score circle badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    color: C.green,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ShieldCheck size={11} />
                  Subnet Verified
                </span>

                {/* SVG ring */}
                <div style={{ position: "relative", width: "68px", height: "68px" }}>
                  <svg width="68" height="68" style={{ position: "absolute", inset: 0 }}>
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={C.cyan} />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                    <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle
                      cx="34" cy="34" r="28"
                      fill="none"
                      stroke="url(#cg)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${(DS.overallScore / 100) * 175.9} 175.9`}
                      transform="rotate(-90 34 34)"
                      style={{ filter: `drop-shadow(0 0 5px ${C.cyan}80)` }}
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: C.cyan, fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 }}>
                      {DS.overallScore}
                    </span>
                    <span style={{ color: "#334155", fontSize: "0.58rem", fontWeight: 600 }}>/100</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <div style={{ padding: "22px 24px" }}>
              {/* Score bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                {DS.scores.map((s, i) => (
                  <ScoreBar key={s.label} {...s} delay={i * 100} />
                ))}
              </div>

              {/* Formula */}
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: "14px",
                }}
              >
                <div style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Composite Score Formula
                </div>
                <code style={{ color: C.cyan, fontSize: "0.78rem", fontFamily: "monospace", letterSpacing: "0.02em" }}>
                  {formula}
                </code>
              </div>

              {/* Note */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "9px",
                  backgroundColor: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}
              >
                <CheckCircle2 size={14} style={{ color: C.green, flexShrink: 0, marginTop: "1px" }} />
                <p style={{ margin: 0, color: "#475569", fontSize: "0.78rem", lineHeight: 1.6 }}>
                  Overall score of{" "}
                  <span style={{ color: C.green, fontWeight: 700 }}>92/100</span> places this dataset in the{" "}
                  <span style={{ color: C.green, fontWeight: 600 }}>top 5%</span> of Healthcare datasets on the subnet.
                  Privacy Preservation scored 98/100, meeting HIPAA and GDPR standards.
                </p>
              </div>
            </div>
          </Card>

          {/* ── Section 3: On-Chain Verification Certificate ── */}
          <Card className="fade-up">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    backgroundColor: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Link2 size={15} style={{ color: C.green }} />
                </div>
                <span style={{ color: C.text, fontSize: "0.95rem", fontWeight: 700 }}>
                  🔗 Verification Certificate
                </span>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: C.green,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: C.green,
                    boxShadow: `0 0 5px ${C.green}`,
                    animation: "pulse 2s infinite",
                  }}
                />
                Immutable
              </span>
            </CardHeader>

            <div style={{ padding: "22px 24px" }}>
              {/* Cert grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "22px",
                }}
              >
                {[
                  { label: "Certificate ID",  value: DS.cert.id,        mono: true },
                  { label: "Block Number",     value: DS.cert.block,     mono: true },
                  { label: "Timestamp",        value: DS.cert.timestamp, mono: false },
                  { label: "Network",          value: DS.cert.network,   mono: false },
                  { label: "Subnet",           value: DS.cert.subnet,    mono: false },
                  { label: "Final Score",      value: DS.cert.score,     mono: false },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    style={{
                      padding: "11px 14px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ color: "#475569", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div
                      style={{
                        color: label === "Final Score" ? C.cyan : C.muted,
                        fontSize: "0.82rem",
                        fontWeight: label === "Final Score" ? 800 : 500,
                        fontFamily: mono ? "monospace" : undefined,
                        letterSpacing: mono ? "0.03em" : undefined,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Validators */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldCheck size={12} style={{ color: C.purple }} />
                  Validators who signed (3/3)
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {DS.validators.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "9px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: `linear-gradient(135deg,${C.purple},#7c3aed)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: `0 0 8px ${C.purple}40`,
                        }}
                      >
                        <ShieldCheck size={13} style={{ color: "white" }} />
                      </div>
                      {/* Address */}
                      <code
                        style={{
                          color: "#64748b",
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                          flex: 1,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {v.addr}
                      </code>
                      {/* Score */}
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "5px",
                          backgroundColor: "rgba(56,189,248,0.08)",
                          border: "1px solid rgba(56,189,248,0.16)",
                          color: C.cyan,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        Score: {v.score}
                      </span>
                      {/* Signed badge */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          padding: "2px 8px",
                          borderRadius: "5px",
                          backgroundColor: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.22)",
                          color: C.green,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle2 size={10} />
                        Signed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shapley + Explorer link */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(168,85,247,0.08)",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  <Award size={13} style={{ color: C.purple }} />
                  <span style={{ color: C.muted, fontSize: "0.78rem" }}>Shapley Consensus:</span>
                  <span style={{ color: C.purple, fontSize: "0.82rem", fontWeight: 800 }}>
                    {DS.shapley}% agreement
                  </span>
                </div>

                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(56,189,248,0.2)",
                    backgroundColor: "transparent",
                    color: C.cyan,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                  }}
                >
                  <ExternalLink size={12} />
                  View on Bittensor Explorer →
                </button>
              </div>
            </div>
          </Card>

          {/* ── Section 4: Miner Information ── */}
          <Card className="fade-up">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    backgroundColor: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Cpu size={15} style={{ color: C.amber }} />
                </div>
                <span style={{ color: C.text, fontSize: "0.95rem", fontWeight: 700 }}>
                  Miner Information
                </span>
              </div>
            </CardHeader>

            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 0 14px rgba(245,158,11,0.3)",
                  }}
                >
                  <span style={{ color: "#0a1628", fontSize: "0.88rem", fontWeight: 800 }}>
                    {DS.miner.initials}
                  </span>
                </div>
                {/* Address + copy */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <code style={{ color: C.muted, fontSize: "0.82rem", fontFamily: "monospace" }}>
                      {DS.miner.address}
                    </code>
                    <button
                      onClick={handleCopy}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                        color: copied ? C.green : "#334155",
                      }}
                    >
                      {copied ? <CheckCircle2 size={13} style={{ color: C.green }} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.72rem" }}>
                    Active miner · UID #47
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                {[
                  { label: "Reputation", value: `⭐ ${DS.miner.rep}`, color: C.amber },
                  { label: "Datasets", value: `${DS.miner.datasets} submitted`, color: C.muted },
                  { label: "Ranking", value: "Top 10% miner", color: C.green },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    <span style={{ color: "#475569", fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </span>
                    <span style={{ color, fontSize: "0.8rem", fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Royalty pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(56,189,248,0.06)",
                  border: "1px solid rgba(56,189,248,0.15)",
                }}
              >
                <TrendingUp size={12} style={{ color: C.cyan }} />
                <span style={{ color: "#64748b", fontSize: "0.76rem" }}>
                  Miner receives{" "}
                  <span style={{ color: C.cyan, fontWeight: 700 }}>
                    {DS.miner.royalty}% royalty
                  </span>{" "}
                  on every resale of this dataset
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* ── Purchase Card ── */}
          <div
            style={{
              backgroundColor: C.card,
              borderRadius: "16px",
              border: "1px solid rgba(56,189,248,0.2)",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(56,189,248,0.06)",
            }}
          >
            {/* Price header */}
            <div
              style={{
                padding: "20px 22px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "linear-gradient(135deg, rgba(56,189,248,0.07) 0%, transparent 70%)",
              }}
            >
              <div style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                Purchase Dataset
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
                <span
                  style={{
                    color: C.cyan,
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    textShadow: `0 0 28px ${C.cyan}40`,
                  }}
                >
                  {activePrice.toFixed(1)}
                </span>
                <span style={{ color: C.cyan, fontSize: "1.2rem", fontWeight: 700 }}>TAO</span>
              </div>
              <span style={{ color: "#475569", fontSize: "0.8rem" }}>
                ≈ ${(activePrice * 38.86).toFixed(2)} USD
              </span>
            </div>

            {/* License options */}
            <div
              style={{
                padding: "16px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              <div style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
                License Type
              </div>
              <LicenseOption
                label="Basic Access"
                sublabel="One-time download"
                price={`${DS.price} TAO`}
                selected={license === "basic"}
                onClick={() => setLicense("basic")}
              />
              <LicenseOption
                label="Extended License"
                sublabel="Unlimited internal use"
                price={`${DS.priceExt} TAO`}
                selected={license === "extended"}
                onClick={() => setLicense("extended")}
              />
              <LicenseOption
                label="Commercial License"
                sublabel="Use in products"
                price={`${DS.priceCom} TAO`}
                selected={license === "commercial"}
                onClick={() => setLicense("commercial")}
              />
            </div>

            {/* CTA buttons */}
            <div
              style={{
                padding: "16px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              <BuyButton
                label={purchased ? "Purchase Complete!" : `Buy Dataset → ${activePrice.toFixed(1)} TAO`}
                onClick={() => setPurchased(true)}
                purchased={purchased}
              />

              <button
                onClick={() => setPreviewOpen((o) => !o)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "11px",
                  borderRadius: "10px",
                  border: `1px solid rgba(56,189,248,0.25)`,
                  backgroundColor: "transparent",
                  color: C.cyan,
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                <Eye size={15} />
                Preview Sample (50 rows)
              </button>

              {/* Preview table */}
              {previewOpen && (
                <div
                  style={{
                    borderRadius: "9px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: "#0b1628",
                  }}
                >
                  <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>SAMPLE — 5 rows</span>
                    <span style={{ color: "#334155", fontSize: "0.63rem" }}>50 / 620K</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["drug", "adr_code", "severity", "age_grp"].map((col) => (
                            <th key={col} style={{ color: "#334155", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", padding: "5px 8px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Metformin", "E11.9", "Mild", "55-64"],
                          ["Atorvastatin", "G62.0", "Moderate", "65+"],
                          ["Lisinopril", "R05", "Mild", "45-54"],
                          ["Warfarin", "D68.3", "Severe", "65+"],
                          ["Omeprazole", "K21.0", "Mild", "35-44"],
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.025)" }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ color: "#64748b", fontSize: "0.68rem", padding: "5px 8px", fontFamily: "monospace" }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
                {[
                  { icon: Lock, label: "Privacy Safe" },
                  { icon: Scale, label: "Bias Tested" },
                  { icon: BarChart3, label: "Stat Verified" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={14} style={{ color: C.green }} />
                    </div>
                    <span style={{ color: "#475569", fontSize: "0.64rem", fontWeight: 600, textAlign: "center" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ color: "#334155", fontSize: "0.68rem", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                Secured by Bittensor blockchain.
                Transaction is irreversible.
              </p>
            </div>
          </div>

          {/* ── Related Datasets ── */}
          <div
            style={{
              backgroundColor: C.card,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Hash size={13} style={{ color: "#64748b" }} />
              <span style={{ color: C.text, fontSize: "0.88rem", fontWeight: 700 }}>
                Similar Verified Datasets
              </span>
            </div>
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {DS.related.map((r) => (
                <RelatedCard key={r.id} ds={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
