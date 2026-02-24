import { useState, useEffect } from "react";
import {
  Inbox,
  Clock,
  Zap,
  TrendingUp,
  ChevronRight,
  Shield,
  Database,
  Tag,
  FileText,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Filter,
  ArrowUpDown,
  Layers,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpenRequest {
  id: string;
  domain: string;
  domainColor: string;
  dataType: string;
  dataTypeIcon: typeof Database;
  description: string;
  records: number;
  privacy: string;
  privacyLevel: "Standard" | "Differential Privacy" | "HIPAA Compliant";
  budget: number;
  deadlineSeconds: number; // seconds from now
  competingMiners: number;
  difficulty: "Easy" | "Medium" | "Hard";
  qualityThreshold: number;
  tags: string[];
}

// ─── Static request data ──────────────────────────────────────────────────────

const REQUESTS: OpenRequest[] = [
  {
    id: "REQ-2841",
    domain: "Healthcare",
    domainColor: "#22c55e",
    dataType: "Tabular",
    dataTypeIcon: Layers,
    description:
      "Synthetic patient vitals dataset with realistic age/condition correlations. Must include blood pressure, heart rate, SpO2, temperature, and glucose readings across 5 demographic groups.",
    records: 80_000,
    privacy: "HIPAA Compliant",
    privacyLevel: "HIPAA Compliant",
    budget: 22.5,
    deadlineSeconds: 19920, // 5h 32m
    competingMiners: 4,
    difficulty: "Hard",
    qualityThreshold: 92,
    tags: ["vitals", "demographics", "longitudinal"],
  },
  {
    id: "REQ-2839",
    domain: "Finance",
    domainColor: "#f59e0b",
    dataType: "Tabular",
    dataTypeIcon: Layers,
    description:
      "Synthetic transaction ledger for fraud detection model training. Requires realistic merchant categories, time-of-day patterns, and labeled anomalous transactions at roughly 2% injection rate.",
    records: 200_000,
    privacy: "Differential Privacy",
    privacyLevel: "Differential Privacy",
    budget: 18.0,
    deadlineSeconds: 7800, // 2h 10m
    competingMiners: 9,
    difficulty: "Medium",
    qualityThreshold: 88,
    tags: ["fraud", "transactions", "labeled"],
  },
  {
    id: "REQ-2835",
    domain: "NLP",
    domainColor: "#a855f7",
    dataType: "Text",
    dataTypeIcon: FileText,
    description:
      "Augmented customer support chat corpus for intent classification. Needs 30+ distinct intents, realistic typos & abbreviations, multi-turn context, and balanced class distribution.",
    records: 45_000,
    privacy: "Standard",
    privacyLevel: "Standard",
    budget: 11.0,
    deadlineSeconds: 3060, // 51m
    competingMiners: 2,
    difficulty: "Easy",
    qualityThreshold: 84,
    tags: ["NLP", "intent", "augmented"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCountdown(sec: number): { text: string; urgent: boolean } {
  if (sec <= 0) return { text: "Expired", urgent: true };
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const urgent = sec < 3600;
  if (h > 0) return { text: `${h}h ${m}m remaining`, urgent };
  if (m > 0) return { text: `${m}m ${s}s remaining`, urgent };
  return { text: `${s}s remaining`, urgent: true };
}

function fmtRecords(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
}

const DIFFICULTY_CONFIG = {
  Easy: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  Hard: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
};

const PRIVACY_CONFIG = {
  Standard: { color: "#38bdf8", icon: Shield },
  "Differential Privacy": { color: "#a855f7", icon: Shield },
  "HIPAA Compliant": { color: "#22c55e", icon: Shield },
};

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [sec, setSec] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return sec;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Inbox;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "12px",
        backgroundColor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.06)",
        flex: "1 1 160px",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "9px",
          backgroundColor: `${color}14`,
          border: `1px solid ${color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div style={{ color: "#f1f5f9", fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "1px" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({ req, index }: { req: OpenRequest; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const sec = useCountdown(req.deadlineSeconds);
  const { text: countdownText, urgent } = fmtCountdown(sec);
  const diff = DIFFICULTY_CONFIG[req.difficulty];
  const priv = PRIVACY_CONFIG[req.privacyLevel];
  const pct = Math.max(0, (sec / req.deadlineSeconds) * 100);

  const handleAccept = () => {
    setAccepting(true);
    setTimeout(() => {
      setAccepting(false);
      setAccepted(true);
    }, 1400);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        border: `1px solid ${hovered ? `${req.domainColor}28` : "rgba(255,255,255,0.06)"}`,
        borderLeft: `3px solid ${req.domainColor}`,
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.35), 0 0 20px ${req.domainColor}0f`
          : "0 2px 8px rgba(0,0,0,0.18)",
        opacity: accepted ? 0.6 : 1,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Deadline progress bar */}
      <div
        style={{
          height: "2px",
          backgroundColor: "rgba(255,255,255,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: urgent
              ? "linear-gradient(90deg, #ef4444, #f97316)"
              : `linear-gradient(90deg, ${req.domainColor}, ${req.domainColor}88)`,
            transition: "width 1s linear",
            boxShadow: urgent ? "0 0 6px rgba(239,68,68,0.5)" : `0 0 6px ${req.domainColor}50`,
          }}
        />
      </div>

      <div style={{ padding: "20px 22px" }}>
        {/* ── Header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: ID + badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                color: "#38bdf8",
                fontSize: "0.9rem",
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "0.04em",
              }}
            >
              {req.id}
            </span>

            {/* Domain badge */}
            <span
              style={{
                padding: "2px 9px",
                borderRadius: "20px",
                backgroundColor: `${req.domainColor}14`,
                border: `1px solid ${req.domainColor}28`,
                color: req.domainColor,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {req.domain}
            </span>

            {/* Data type badge */}
            <span
              style={{
                padding: "2px 9px",
                borderRadius: "20px",
                backgroundColor: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.16)",
                color: "#7dd3fc",
                fontSize: "0.72rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <req.dataTypeIcon size={10} />
              {req.dataType}
            </span>

            {/* Difficulty badge */}
            <span
              style={{
                padding: "2px 9px",
                borderRadius: "20px",
                backgroundColor: diff.bg,
                border: `1px solid ${diff.border}`,
                color: diff.color,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {req.difficulty}
            </span>
          </div>

          {/* Right: countdown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 11px",
              borderRadius: "8px",
              backgroundColor: urgent ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${urgent ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`,
              flexShrink: 0,
            }}
          >
            <Clock
              size={12}
              style={{
                color: urgent ? "#ef4444" : "#94a3b8",
                animation: urgent ? "pulse 1s ease-in-out infinite" : undefined,
              }}
            />
            <span
              style={{
                color: urgent ? "#ef4444" : "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.01em",
              }}
            >
              {countdownText}
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.865rem",
            lineHeight: 1.65,
            margin: "0 0 16px",
          }}
        >
          {req.description}
        </p>

        {/* ── Tags ── */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
          {req.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 8px",
                borderRadius: "5px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#475569",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>

        {/* ── Spec grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px",
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(255,255,255,0.05)",
            marginBottom: "18px",
          }}
        >
          {/* Records */}
          <div>
            <div
              style={{ color: "#475569", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "3px" }}
            >
              Records
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Database size={13} style={{ color: "#38bdf8" }} />
              <span style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700 }}>
                {fmtRecords(req.records)}
              </span>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div
              style={{ color: "#475569", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "3px" }}
            >
              Privacy
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <priv.icon size={13} style={{ color: priv.color }} />
              <span style={{ color: priv.color, fontSize: "0.78rem", fontWeight: 600 }}>
                {req.privacy}
              </span>
            </div>
          </div>

          {/* Quality threshold */}
          <div>
            <div
              style={{ color: "#475569", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "3px" }}
            >
              Min Quality
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <TrendingUp size={13} style={{ color: "#a855f7" }} />
              <span style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700 }}>
                {req.qualityThreshold}%
              </span>
            </div>
          </div>

          {/* Competing miners */}
          <div>
            <div
              style={{ color: "#475569", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "3px" }}
            >
              Competing
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Radio size={13} style={{ color: "#f59e0b" }} />
              <span style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700 }}>
                {req.competingMiners} miners
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer: budget + CTA ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Budget */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <Coins size={15} style={{ color: "#f59e0b", marginBottom: "-1px" }} />
            <span
              style={{
                color: "#f59e0b",
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {req.budget.toFixed(1)}
            </span>
            <span style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 600, opacity: 0.8 }}>
              TAO
            </span>
            <span style={{ color: "#334155", fontSize: "0.75rem", marginLeft: "2px" }}>
              max budget
            </span>
          </div>

          {/* Right: warn if competing high + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {req.competingMiners >= 8 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(245,158,11,0.07)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                <AlertTriangle size={11} style={{ color: "#f59e0b" }} />
                <span style={{ color: "#f59e0b", fontSize: "0.68rem", fontWeight: 600 }}>
                  High competition
                </span>
              </div>
            )}

            <button
              onClick={handleAccept}
              disabled={accepting || accepted}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: accepting || accepted ? "not-allowed" : "pointer",
                background: accepted
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : accepting
                  ? "rgba(56,189,248,0.15)"
                  : "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                color: accepted ? "#fff" : accepting ? "#475569" : "#0f172a",
                fontSize: "0.86rem",
                fontWeight: 800,
                letterSpacing: "0.01em",
                boxShadow: accepted
                  ? "0 4px 14px rgba(34,197,94,0.3)"
                  : accepting
                  ? "none"
                  : "0 4px 14px rgba(56,189,248,0.3)",
                transition: "all 0.22s",
                whiteSpace: "nowrap",
              }}
            >
              {accepted ? (
                <>
                  <CheckCircle2 size={15} />
                  Accepted!
                </>
              ) : accepting ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid #475569",
                      borderTopColor: "#38bdf8",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Locking in…
                </>
              ) : (
                <>
                  Accept Request
                  <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function MinerOpenRequests() {
  const [filter, setFilter] = useState<"All" | "Healthcare" | "Finance" | "NLP">("All");
  const [sort, setSort] = useState<"budget" | "deadline" | "competition">("budget");

  const filtered = REQUESTS.filter(
    (r) => filter === "All" || r.domain === filter
  ).sort((a, b) => {
    if (sort === "budget") return b.budget - a.budget;
    if (sort === "deadline") return a.deadlineSeconds - b.deadlineSeconds;
    return a.competingMiners - b.competingMiners;
  });

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          {/* Portal label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "2px 10px",
              borderRadius: "20px",
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.22)",
            }}
          >
            <Radio size={10} style={{ color: "#f59e0b" }} />
            <span style={{ color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              LIVE BROADCAST
            </span>
          </div>
          {/* Live dot */}
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.8)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        <h1
          style={{
            color: "#f1f5f9",
            fontSize: "1.6rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            margin: "0 0 5px",
          }}
        >
          Open{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Requests
          </span>
        </h1>
        <p style={{ color: "#475569", fontSize: "0.86rem", margin: 0 }}>
          Active client requests broadcast to the miner network — accept to lock in your spot
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >
        <StatPill icon={Inbox} label="Open Requests" value="14" color="#38bdf8" />
        <StatPill icon={Coins} label="Avg Budget" value="18 TAO" color="#f59e0b" />
        <StatPill icon={Clock} label="Shortest Deadline" value="Next 6hrs" color="#ef4444" />
        <StatPill icon={TrendingUp} label="Avg Quality Min" value="88%" color="#a855f7" />
      </div>

      {/* ── Filter + Sort bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Domain filters */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginRight: "4px",
              color: "#475569",
              fontSize: "0.75rem",
            }}
          >
            <Filter size={12} />
            Filter:
          </div>
          {(["All", "Healthcare", "Finance", "NLP"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px",
                borderRadius: "8px",
                border: filter === f ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.06)",
                backgroundColor: filter === f ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.03)",
                color: filter === f ? "#38bdf8" : "#475569",
                fontSize: "0.78rem",
                fontWeight: filter === f ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowUpDown size={12} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#94a3b8",
              fontSize: "0.78rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="budget" style={{ backgroundColor: "#1e293b" }}>Highest Budget</option>
            <option value="deadline" style={{ backgroundColor: "#1e293b" }}>Soonest Deadline</option>
            <option value="competition" style={{ backgroundColor: "#1e293b" }}>Least Competition</option>
          </select>
        </div>
      </div>

      {/* ── Network info banner ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 14px",
          borderRadius: "9px",
          backgroundColor: "rgba(56,189,248,0.05)",
          border: "1px solid rgba(56,189,248,0.12)",
          marginBottom: "18px",
        }}
      >
        <Zap size={13} style={{ color: "#38bdf8", flexShrink: 0 }} />
        <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
          Accepting a request locks it for <strong style={{ color: "#94a3b8" }}>30 minutes</strong>.
          You must submit a dataset passing quality threshold within the deadline or the slot reopens.
          Validator consensus determines payout.
        </p>
      </div>

      {/* ── Request cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              backgroundColor: "#1e293b",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Inbox size={40} style={{ color: "#334155", margin: "0 auto 12px" }} />
            <p style={{ color: "#334155", margin: 0 }}>No open requests match your filter.</p>
          </div>
        ) : (
          filtered.map((req, i) => (
            <RequestCard key={req.id} req={req} index={i} />
          ))
        )}
      </div>

      {/* ── Footer note ── */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          padding: "14px",
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span style={{ color: "#334155", fontSize: "0.76rem" }}>
          Showing {filtered.length} of 14 open requests · Auto-refreshes every 30s
        </span>
      </div>

      <style>{`
        @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
