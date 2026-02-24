import { useState, useMemo } from "react";
import {
  ClipboardCheck, Clock, Search, ChevronDown, ArrowRight,
  ShieldCheck, CheckCircle2, Loader2, AlertCircle, Activity,
} from "lucide-react";

/* ═══════════ TYPES & DATA ═══════════ */

type Stage = "Screener 1" | "Screener 2" | "Full Validation";
type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface TestLayer {
  name: string;
  status: "done" | "pending";
}

interface EvalCard {
  id: string;
  domain: string;
  domainColor: string;
  dataType: string;
  miner: string;
  submitted: string;
  stage: Stage;
  priority: Priority;
  note: string | null;
  layers: TestLayer[];
}

const stageAccent: Record<Stage, string> = {
  "Screener 1": "#f59e0b",
  "Screener 2": "#a855f7",
  "Full Validation": "#22c55e",
};

const priorityStyles: Record<Priority, { bg: string; color: string; border: string; pulse?: boolean }> = {
  CRITICAL: { bg: "rgba(220,38,38,0.12)", color: "#ef4444", border: "rgba(220,38,38,0.3)", pulse: true },
  HIGH: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.25)" },
  MEDIUM: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  LOW: { bg: "rgba(148,163,184,0.08)", color: "#94a3b8", border: "rgba(148,163,184,0.2)" },
};

const evalQueue: EvalCard[] = [
  {
    id: "DS-4891",
    domain: "Healthcare",
    domainColor: "#14b8a6",
    dataType: "Tabular",
    miner: "5F3xAB...9KL2",
    submitted: "Feb 24, 2026 · 14:20 UTC",
    stage: "Screener 1",
    priority: "HIGH",
    note: null,
    layers: [
      { name: "Statistical Fidelity", status: "pending" },
    ],
  },
  {
    id: "DS-4876",
    domain: "Finance",
    domainColor: "#22c55e",
    dataType: "Time Series",
    miner: "5GrxCD...3MN8",
    submitted: "Feb 24, 2026 · 12:45 UTC",
    stage: "Screener 1",
    priority: "MEDIUM",
    note: null,
    layers: [
      { name: "Statistical Fidelity", status: "pending" },
    ],
  },
  {
    id: "DS-4854",
    domain: "NLP",
    domainColor: "#ec4899",
    dataType: "Text",
    miner: "5HtyEF...7PQ4",
    submitted: "Feb 23, 2026 · 09:30 UTC",
    stage: "Screener 2",
    priority: "HIGH",
    note: null,
    layers: [
      { name: "Statistical Fidelity", status: "done" },
      { name: "Privacy", status: "done" },
      { name: "Bias & Fairness", status: "pending" },
      { name: "Downstream Utility", status: "pending" },
      { name: "Adversarial Realism", status: "pending" },
    ],
  },
  {
    id: "DS-4821",
    domain: "Healthcare",
    domainColor: "#14b8a6",
    dataType: "Tabular",
    miner: "5KmnGH...2RS6",
    submitted: "Feb 22, 2026 · 16:10 UTC",
    stage: "Full Validation",
    priority: "CRITICAL",
    note: "2 of 3 validators completed · Waiting for your score",
    layers: [
      { name: "Statistical Fidelity", status: "pending" },
      { name: "Privacy", status: "pending" },
      { name: "Bias & Fairness", status: "pending" },
      { name: "Downstream Utility", status: "pending" },
      { name: "Adversarial Realism", status: "pending" },
    ],
  },
];

/* ═══════════ HELPERS ═══════════ */

const CARD_BG = "#1a2540";
const CARD_BORDER = "#2a3a5c";

const ctaLabel: Record<Stage, string> = {
  "Screener 1": "Start Evaluation",
  "Screener 2": "Continue Evaluation",
  "Full Validation": "Submit Final Score",
};

/* ═══════════ COMPONENT ═══════════ */

export function ValidatorPendingEvals() {
  const [activeTab, setActiveTab] = useState<"All" | Stage>("All");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Priority");

  const filtered = useMemo(() => {
    let list = evalQueue;
    if (activeTab !== "All") list = list.filter((e) => e.stage === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.id.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search]);

  const screener1Count = evalQueue.filter((e) => e.stage === "Screener 1").length;
  const screener2Count = evalQueue.filter((e) => e.stage === "Screener 2").length;
  const fullCount = evalQueue.filter((e) => e.stage === "Full Validation").length;

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              <ClipboardCheck size={10} style={{ color: "#a855f7" }} />
              <span
                style={{
                  color: "#a855f7",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                EVALUATION QUEUE
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Activity size={10} style={{ color: "#22c55e" }} className="animate-pulse" />
              <span style={{ color: "#22c55e", fontSize: "0.68rem", fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <h1
            style={{
              color: "white",
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Pending{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a855f7 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Evaluations
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Review and score submitted datasets assigned to you
          </p>

          {/* Stat pills */}
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <Pill label="Pending" value={String(evalQueue.length)} color="#f59e0b" />
            <Pill label="In Screener 1" value={String(screener1Count)} color="#38bdf8" />
            <Pill label="In Screener 2" value={String(screener2Count)} color="#a855f7" />
            <Pill label="In Full Validation" value={String(fullCount)} color="#22c55e" />
          </div>
        </div>

        {/* Timestamp */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>
            Feb 24, 2026 · 17:02 UTC
          </span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap mb-5 px-4 py-3 rounded-xl"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {(
            [
              { key: "All", label: `All (${evalQueue.length})` },
              { key: "Screener 1", label: "Screener 1" },
              { key: "Screener 2", label: "Screener 2" },
              { key: "Full Validation", label: "Full Validation" },
            ] as { key: "All" | Stage; label: string }[]
          ).map((t) => {
            const isActive = activeTab === t.key;
            const accent =
              t.key === "All"
                ? "#a855f7"
                : stageAccent[t.key as Stage];
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? `${accent}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? `${accent}40` : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? accent : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Right: search + sort */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <Search size={13} style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dataset ID..."
              className="bg-transparent outline-none"
              style={{ color: "#f1f5f9", fontSize: "0.78rem", width: 150 }}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: `1px solid ${CARD_BORDER}`,
                color: "#94a3b8",
                fontSize: "0.78rem",
              }}
            >
              Sort by: {sortBy}
              <ChevronDown size={12} />
            </button>
            {sortOpen && (
              <div
                className="absolute right-0 top-full mt-1 py-1 rounded-lg z-20"
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  minWidth: 140,
                }}
              >
                {["Priority", "Date", "Stage"].map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setSortBy(o);
                      setSortOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 transition-all hover:bg-white/5"
                    style={{
                      color: sortBy === o ? "#a855f7" : "#94a3b8",
                      fontSize: "0.78rem",
                      fontWeight: sortBy === o ? 600 : 400,
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Evaluation Queue ── */}
      <div className="flex flex-col gap-4 mb-5">
        {filtered.map((card) => (
          <EvalCardComponent key={card.id} card={card} />
        ))}
        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-xl"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <ClipboardCheck size={32} style={{ color: "#334155" }} />
            <p style={{ color: "#475569", fontSize: "0.88rem", marginTop: 10 }}>
              No evaluations match your filter
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom Info Box ── */}
      <div
        className="flex items-start gap-4 p-5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(124,58,237,0.03) 100%)",
          border: "1px solid rgba(168,85,247,0.15)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.06))",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          <ShieldCheck size={18} style={{ color: "#a855f7" }} />
        </div>
        <div>
          <p style={{ color: "#f1f5f9", fontSize: "0.88rem", lineHeight: 1.5 }}>
            Evaluations are assigned randomly. Completing all 5 test layers earns a{" "}
            <span style={{ color: "#a855f7", fontWeight: 700 }}>2x reward bonus</span>.
          </p>
          <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: 4 }}>
            Estimated time per full evaluation: ~45 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ SUB-COMPONENTS ═══════════ */

function Pill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}28`,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{label}:</span>
      <span style={{ color, fontSize: "0.75rem", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function EvalCardComponent({ card }: { card: EvalCard }) {
  const accent = stageAccent[card.stage];
  const ps = priorityStyles[card.priority];
  const ctaColor = card.stage === "Full Validation" ? "#22c55e" : "#7c3aed";
  const ctaBg =
    card.stage === "Full Validation"
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)";

  const doneCount = card.layers.filter((l) => l.status === "done").length;
  const totalLayers = card.layers.length;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div className="flex">
        {/* Left accent bar */}
        <div className="w-1 shrink-0" style={{ backgroundColor: accent }} />

        {/* Card body */}
        <div className="flex-1 p-5">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              {/* ID + domain + type */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span
                  style={{
                    color: "white",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {card.id}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${card.domainColor}12`,
                    color: card.domainColor,
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    border: `1px solid ${card.domainColor}25`,
                  }}
                >
                  {card.domain}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{card.dataType}</span>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#475569", fontSize: "0.75rem" }}>Miner:</span>
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {card.miner}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} style={{ color: "#475569" }} />
                  <span style={{ color: "#475569", fontSize: "0.75rem" }}>{card.submitted}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* Stage badge */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${accent}15`,
                    color: accent,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                  {card.stage}
                </span>

                {/* Priority badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                    ps.pulse ? "animate-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: ps.bg,
                    color: ps.color,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    border: `1px solid ${ps.border}`,
                  }}
                >
                  {ps.pulse && (
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: ps.color, boxShadow: `0 0 6px ${ps.color}` }}
                    />
                  )}
                  {card.priority}
                </span>
              </div>

              {/* Note */}
              {card.note && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <AlertCircle size={12} style={{ color: "#f59e0b" }} />
                  <span style={{ color: "#f59e0b", fontSize: "0.75rem", fontWeight: 500 }}>
                    {card.note}
                  </span>
                </div>
              )}
            </div>

            {/* CTA button */}
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:scale-105 shrink-0 self-center"
              style={{
                background: ctaBg,
                color: "white",
                fontSize: "0.82rem",
                fontWeight: 700,
                boxShadow: `0 0 20px ${ctaColor}35`,
              }}
            >
              {ctaLabel[card.stage]}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* ── Layer progress bar ── */}
          <div
            className="mt-4 pt-3"
            style={{ borderTop: `1px solid ${CARD_BORDER}` }}
          >
            {card.stage === "Screener 1" ? (
              <div className="flex items-center gap-3">
                <span style={{ color: "#475569", fontSize: "0.72rem" }}>
                  Screener 1: Statistical Fidelity only · 10 random slices
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: "0%", backgroundColor: accent }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-wrap">
                {card.layers.map((l, i) => {
                  const isDone = l.status === "done";
                  return (
                    <div key={i} className="flex items-center gap-1">
                      {i > 0 && (
                        <div
                          className="w-3 h-px"
                          style={{
                            backgroundColor: isDone
                              ? "rgba(34,197,94,0.3)"
                              : "rgba(255,255,255,0.06)",
                          }}
                        />
                      )}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: isDone
                            ? "rgba(34,197,94,0.08)"
                            : "rgba(255,255,255,0.02)",
                          border: `1px solid ${
                            isDone ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"
                          }`,
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={11} style={{ color: "#22c55e" }} />
                        ) : (
                          <Loader2
                            size={11}
                            style={{ color: "#f59e0b" }}
                            className={
                              i === doneCount ? "animate-spin" : ""
                            }
                          />
                        )}
                        <span
                          style={{
                            color: isDone ? "#22c55e" : "#64748b",
                            fontSize: "0.68rem",
                            fontWeight: isDone ? 600 : 400,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {l.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
