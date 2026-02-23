import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, TrendingUp, CheckCircle2, Activity,
  Clock, Zap, User, Database, ChevronRight,
  Play, Loader2, AlertTriangle, Info,
  BarChart3, Lock, Scale,
  Cpu, ArrowUpRight, Eye, Star,
  XCircle, RefreshCw, GitMerge, Target,
} from "lucide-react";

/* ─────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────── */
const PURPLE = "#a855f7";
const PURPLE_BORDER = "rgba(168,85,247,0.25)";
const CYAN = "#38bdf8";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const STATS = [
  {
    id: "accuracy",
    label: "Accuracy Score",
    value: "97.3%",
    sub: "+0.4% from last epoch",
    icon: Target,
    color: GREEN,
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
    sparkline: [91, 93, 92, 94, 95, 94, 96, 97, 97.3],
    isTao: false,
  },
  {
    id: "completed",
    label: "Evaluations Completed",
    value: "1,847",
    sub: "32 this epoch",
    icon: CheckCircle2,
    color: PURPLE,
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
    sparkline: [1600, 1650, 1680, 1700, 1740, 1770, 1800, 1830, 1847],
    isTao: false,
  },
  {
    id: "consensus",
    label: "Consensus Alignment",
    value: "94.1%",
    sub: "Above 90% threshold ✓",
    icon: Activity,
    color: CYAN,
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    sparkline: [89, 90, 91, 93, 92, 94, 93, 94, 94.1],
    isTao: false,
  },
  {
    id: "earned",
    label: "TAO Earned This Epoch",
    value: "34.8",
    sub: "~$2,810 USD at market",
    icon: Zap,
    color: CYAN,
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    sparkline: [20, 22, 25, 27, 28, 30, 31, 33, 34.8],
    isTao: true,
  },
];

const PENDING = [
  {
    id: "DS-7741",
    domain: "Healthcare",
    domainColor: "#ef4444",
    domainBg: "rgba(239,68,68,0.12)",
    miner: "5GrwvaEF…3mP4",
    submittedAgo: "2 hours ago",
    estTime: "~8 min",
    priority: "High" as const,
    dataType: "Tabular",
    size: "240K records",
    generationMethod: "CTGAN",
    privacyScore: 88,
  },
  {
    id: "DS-7739",
    domain: "Finance",
    domainColor: AMBER,
    domainBg: "rgba(245,158,11,0.12)",
    miner: "5FHneW8…Kf2a",
    submittedAgo: "4 hours ago",
    estTime: "~12 min",
    priority: "Medium" as const,
    dataType: "Time Series",
    size: "85K records",
    generationMethod: "TimeGAN",
    privacyScore: 72,
  },
  {
    id: "DS-7735",
    domain: "NLP",
    domainColor: PURPLE,
    domainBg: "rgba(168,85,247,0.12)",
    miner: "5DAAnrj…8kP3",
    submittedAgo: "6 hours ago",
    estTime: "~6 min",
    priority: "High" as const,
    dataType: "Text",
    size: "12K docs",
    generationMethod: "GPT-4 finetune",
    privacyScore: 95,
  },
  {
    id: "DS-7728",
    domain: "Computer Vision",
    domainColor: GREEN,
    domainBg: "rgba(34,197,94,0.12)",
    miner: "5HGjWAf…7mN8",
    submittedAgo: "12 hours ago",
    estTime: "~20 min",
    priority: "Low" as const,
    dataType: "Image",
    size: "48K images",
    generationMethod: "Diffusion",
    privacyScore: 61,
  },
];

type Priority = "High" | "Medium" | "Low";
const PRIORITY_STYLE: Record<Priority, { bg: string; color: string; border: string }> = {
  High:   { bg: "rgba(245,158,11,0.10)", color: AMBER,    border: "rgba(245,158,11,0.3)" },
  Medium: { bg: "rgba(100,116,139,0.10)", color: "#64748b", border: "rgba(100,116,139,0.25)" },
  Low:    { bg: "rgba(71,85,105,0.08)",   color: "#334155", border: "rgba(71,85,105,0.2)" },
};

/* ─────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 72, H = 28;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - ((v - min) / range) * H,
  ] as [number, number]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${W},${H} L0,${H} Z`;
  const gradId = `sg${color.replace("#", "")}`;
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color}60)` }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

/* ─────────────────────────────────────────
   STAT CARDS ROW
───────────────────────────────────────── */
function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {STATS.map(({ id, label, value, sub, icon: Icon, color, bg, border, sparkline, isTao }) => (
        <div
          key={id}
          className="rounded-2xl px-5 py-4 flex flex-col gap-3 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${bg} 0%, rgba(30,41,59,0.8) 100%)`, border: `1px solid ${border}` }}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
              <Icon size={17} style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
            </div>
            <ArrowUpRight size={13} style={{ color: "#334155" }} />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span style={{ color: "white", fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, textShadow: `0 0 20px ${color}30` }}>
                {value}
              </span>
              {isTao && <span style={{ color, fontSize: "0.9rem", fontWeight: 700 }}>τ</span>}
            </div>
            <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "3px" }}>{label}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} style={{ color: GREEN }} />
              <span style={{ color: "#475569", fontSize: "0.68rem" }}>{sub}</span>
            </div>
            <Sparkline values={sparkline} color={color} />
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PENDING EVALUATIONS LIST
───────────────────────────────────────── */
function PendingEvaluations({ onStart, activeId }: { onStart: (id: string) => void; activeId: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: AMBER, boxShadow: `0 0 8px ${AMBER}` }} />
          <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700 }}>Pending Evaluations</h2>
          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(168,85,247,0.12)", border: `1px solid ${PURPLE_BORDER}`, color: PURPLE, fontSize: "0.68rem", fontWeight: 700 }}>
            4 in queue
          </span>
        </div>
        <button className="flex items-center gap-1.5 transition-colors" style={{ color: "#334155", fontSize: "0.72rem" }}>
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {PENDING.map(ds => {
        const isActive = ds.id === activeId;
        const pStyle = PRIORITY_STYLE[ds.priority];
        return (
          <div
            key={ds.id}
            className="rounded-2xl px-5 py-4 transition-all duration-200"
            style={{
              backgroundColor: isActive ? "rgba(56,189,248,0.04)" : "#1e293b",
              border: isActive ? "1px solid rgba(56,189,248,0.28)" : "1px solid rgba(255,255,255,0.06)",
              boxShadow: isActive ? "0 0 20px rgba(56,189,248,0.07)" : "none",
            }}
          >
            {/* Row 1: ID + domain + priority */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ color: "white", fontSize: "0.82rem", fontWeight: 700, fontFamily: "monospace" }}>{ds.id}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: ds.domainBg, border: `1px solid ${ds.domainColor}30` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ds.domainColor }} />
                  <span style={{ color: ds.domainColor, fontSize: "0.68rem", fontWeight: 600 }}>{ds.domain}</span>
                </div>
                <span style={{ color: "#334155", fontSize: "0.68rem" }}>{ds.dataType}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ backgroundColor: pStyle.bg, border: `1px solid ${pStyle.border}` }}>
                {ds.priority === "High" && <AlertTriangle size={10} style={{ color: pStyle.color }} />}
                <span style={{ color: pStyle.color, fontSize: "0.67rem", fontWeight: 700 }}>{ds.priority}</span>
              </div>
            </div>

            {/* Row 2: metadata */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div style={{ color: "#334155", fontSize: "0.63rem", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Miner</div>
                <div className="flex items-center gap-1.5">
                  <User size={11} style={{ color: "#475569" }} />
                  <span style={{ color: "#64748b", fontSize: "0.73rem", fontFamily: "monospace" }}>{ds.miner}</span>
                </div>
              </div>
              <div>
                <div style={{ color: "#334155", fontSize: "0.63rem", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Submitted</div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} style={{ color: "#475569" }} />
                  <span style={{ color: "#64748b", fontSize: "0.73rem" }}>{ds.submittedAgo}</span>
                </div>
              </div>
              <div>
                <div style={{ color: "#334155", fontSize: "0.63rem", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Size</div>
                <div className="flex items-center gap-1.5">
                  <Database size={11} style={{ color: "#475569" }} />
                  <span style={{ color: "#64748b", fontSize: "0.73rem" }}>{ds.size}</span>
                </div>
              </div>
            </div>

            {/* Row 3: method + est time + privacy + button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1.5">
                  <Cpu size={11} style={{ color: "#334155" }} />
                  <span style={{ color: "#475569", fontSize: "0.71rem" }}>{ds.generationMethod}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} style={{ color: "#334155" }} />
                  <span style={{ color: "#475569", fontSize: "0.71rem" }}>Est. {ds.estTime}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Lock size={10} style={{ color: ds.privacyScore >= 80 ? GREEN : ds.privacyScore >= 65 ? AMBER : "#ef4444" }} />
                  <span style={{ color: ds.privacyScore >= 80 ? GREEN : ds.privacyScore >= 65 ? AMBER : "#ef4444", fontSize: "0.67rem", fontWeight: 600 }}>
                    P{ds.privacyScore}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onStart(ds.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${GREEN}, #16a34a)`
                    : `linear-gradient(135deg, ${CYAN}, #0ea5e9)`,
                  color: "#0a1628",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  boxShadow: isActive ? "0 0 16px rgba(34,197,94,0.35)" : "0 0 16px rgba(56,189,248,0.3)",
                }}
              >
                {isActive ? <><Eye size={14} /> Viewing</> : <><Play size={14} /> Start Evaluation</>}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   ACTIVE EVALUATION PANEL
───────────────────────────────────────── */
type LayerState = "passed" | "running" | "pending" | "failed";

interface EvalLayer {
  id: string;
  label: string;
  state: LayerState;
  progress: number;
  score: number | null;
  detail: string;
}

const INITIAL_LAYERS: EvalLayer[] = [
  { id: "s1", label: "Screener 1 — Format Validation",   state: "passed",  progress: 100, score: 20,   detail: "Schema valid · All required fields present" },
  { id: "s2", label: "Screener 2 — Distribution Check",  state: "passed",  progress: 100, score: 18,   detail: "Marginal distributions within ±5% of reference" },
  { id: "sf", label: "Statistical Fidelity",              state: "running", progress: 73,  score: null, detail: "KL divergence · Wasserstein · Correlation matrix" },
  { id: "pp", label: "Privacy Preservation",              state: "pending", progress: 0,   score: null, detail: "DP audit · MIA resistance · k-anonymity check" },
  { id: "bf", label: "Bias & Fairness",                   state: "pending", progress: 0,   score: null, detail: "Demographic parity · Equalized odds · SHAP analysis" },
];

function LayerRow({ layer }: { layer: EvalLayer }) {
  const stateColor =
    layer.state === "passed"  ? GREEN    :
    layer.state === "running" ? CYAN     :
    layer.state === "failed"  ? "#ef4444":
    "#1e3a5f";

  return (
    <div
      className="rounded-xl px-4 py-3.5 transition-all"
      style={{
        backgroundColor:
          layer.state === "passed"  ? "rgba(34,197,94,0.04)"  :
          layer.state === "running" ? "rgba(56,189,248,0.06)" :
          "rgba(255,255,255,0.015)",
        border:
          layer.state === "passed"  ? "1px solid rgba(34,197,94,0.15)"  :
          layer.state === "running" ? "1px solid rgba(56,189,248,0.22)" :
          "1px solid rgba(255,255,255,0.04)",
        boxShadow: layer.state === "running" ? "0 0 16px rgba(56,189,248,0.06)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                layer.state === "passed"  ? "rgba(34,197,94,0.12)"  :
                layer.state === "running" ? "rgba(56,189,248,0.12)" :
                "rgba(255,255,255,0.04)",
            }}
          >
            {layer.state === "passed"  ? <CheckCircle2 size={14} style={{ color: GREEN }} /> :
             layer.state === "running" ? <Loader2 size={14} style={{ color: CYAN, animation: "spin 1.2s linear infinite" }} /> :
             layer.state === "failed"  ? <XCircle size={14} style={{ color: "#ef4444" }} /> :
             <Scale size={14} style={{ color: "#1e3a5f" }} />}
          </div>
          <div>
            <div style={{ color: layer.state === "pending" ? "#334155" : "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontWeight: 600 }}>
              {layer.label}
            </div>
            <div style={{ color: "#334155", fontSize: "0.63rem", marginTop: "1px" }}>{layer.detail}</div>
          </div>
        </div>
        <div
          className="px-2.5 py-1 rounded-lg shrink-0"
          style={{
            backgroundColor:
              layer.state === "passed"  ? "rgba(34,197,94,0.1)"  :
              layer.state === "running" ? "rgba(56,189,248,0.1)" :
              "rgba(255,255,255,0.03)",
            border: `1px solid ${stateColor}30`,
          }}
        >
          <span style={{ color: stateColor, fontSize: "0.65rem", fontWeight: 700 }}>
            {layer.state === "passed"  ? "✓ PASSED"  :
             layer.state === "running" ? "RUNNING…"  :
             layer.state === "failed"  ? "✗ FAILED"  :
             "PENDING"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {layer.state !== "pending" ? (
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${layer.progress}%`,
              background:
                layer.state === "passed"  ? `linear-gradient(90deg, ${GREEN}, #16a34a)` :
                layer.state === "running" ? `linear-gradient(90deg, ${CYAN}, #0ea5e9)`  :
                "#ef4444",
              boxShadow:
                layer.state === "running" ? `0 0 10px ${CYAN}80` :
                layer.state === "passed"  ? `0 0 8px ${GREEN}50` : "none",
            }}
          />
          {layer.state === "running" && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }}
            />
          )}
        </div>
      ) : (
        <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.05)" }} />
      )}

      {/* Score row */}
      {(layer.state === "passed" || layer.state === "running") && (
        <div className="flex items-center justify-between mt-2">
          <span style={{ color: "#334155", fontSize: "0.65rem" }}>{layer.progress.toFixed(0)}% complete</span>
          {layer.score !== null
            ? <span style={{ color: GREEN, fontSize: "0.68rem", fontWeight: 700 }}>+{layer.score} pts</span>
            : <span style={{ color: "#334155", fontSize: "0.68rem" }}>scoring…</span>
          }
        </div>
      )}
    </div>
  );
}

function ActiveEvaluationPanel({ datasetId }: { datasetId: string }) {
  const [layers, setLayers] = useState<EvalLayer[]>(INITIAL_LAYERS);
  const [elapsed, setElapsed] = useState(184);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset layers when dataset changes
  useEffect(() => {
    setLayers(INITIAL_LAYERS.map(l => ({ ...l })));
    setElapsed(184);
  }, [datasetId]);

  // Elapsed timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [datasetId]);

  // Progress animation
  useEffect(() => {
    progRef.current = setInterval(() => {
      setLayers(prev => {
        let sfJustPassed = false;
        let ppJustPassed = false;

        const next = prev.map(l => {
          if (l.id === "sf" && l.state === "running" && l.progress < 100) {
            const p = Math.min(100, l.progress + 0.35);
            if (p >= 100) { sfJustPassed = true; return { ...l, progress: 100, state: "passed" as LayerState, score: 26 }; }
            return { ...l, progress: p };
          }
          if (l.id === "pp" && l.state === "running" && l.progress < 100) {
            const p = Math.min(100, l.progress + 0.28);
            if (p >= 100) { ppJustPassed = true; return { ...l, progress: 100, state: "passed" as LayerState, score: 22 }; }
            return { ...l, progress: p };
          }
          return l;
        });

        return next.map(l => {
          if (l.id === "pp" && l.state === "pending" && sfJustPassed) return { ...l, state: "running" as LayerState };
          if (l.id === "bf" && l.state === "pending" && ppJustPassed) return { ...l, state: "running" as LayerState };
          return l;
        });
      });
    }, 200);
    return () => { if (progRef.current) clearInterval(progRef.current); };
  }, [datasetId]);

  const passedCount  = layers.filter(l => l.state === "passed").length;
  const totalScore   = layers.reduce((acc, l) => acc + (l.score ?? 0), 0);
  const allComplete  = layers.every(l => l.state === "passed" || l.state === "failed");
  const runningLayer = layers.find(l => l.state === "running");

  const ds = PENDING.find(d => d.id === datasetId) ?? PENDING[0];
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#1e293b",
        border: `1px solid ${PURPLE_BORDER}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(168,85,247,0.06)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.04) 100%)", borderBottom: `1px solid rgba(168,85,247,0.14)` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span style={{ color: CYAN, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em" }}>ACTIVE EVALUATION</span>
            </div>
            <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 800 }}>
              Currently Evaluating:{" "}
              <span style={{ color: PURPLE, fontFamily: "monospace" }}>{datasetId}</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Clock size={11} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.72rem", fontFamily: "monospace" }}>{fmt(elapsed)}</span>
          </div>
        </div>
        {/* meta strip */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: ds.domainBg, border: `1px solid ${ds.domainColor}30` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ds.domainColor }} />
            <span style={{ color: ds.domainColor, fontSize: "0.67rem", fontWeight: 600 }}>{ds.domain}</span>
          </div>
          <span style={{ color: "#334155", fontSize: "0.7rem" }}>{ds.dataType} · {ds.size}</span>
          <span style={{ color: "#1e3a5f" }}>·</span>
          <div className="flex items-center gap-1.5">
            <User size={10} style={{ color: "#334155" }} />
            <span style={{ color: "#334155", fontSize: "0.7rem", fontFamily: "monospace" }}>{ds.miner}</span>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="px-5 py-3 flex items-center gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", backgroundColor: "rgba(0,0,0,0.1)" }}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ color: "#475569", fontSize: "0.67rem" }}>{passedCount} / {layers.length} layers complete</span>
            <span style={{ color: PURPLE, fontSize: "0.67rem", fontWeight: 700 }}>{Math.round((passedCount / layers.length) * 100)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(passedCount / layers.length) * 100}%`, background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`, boxShadow: `0 0 8px ${PURPLE}60` }}
            />
          </div>
        </div>
        {runningLayer && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Loader2 size={12} style={{ color: CYAN, animation: "spin 1.2s linear infinite" }} />
            <span style={{ color: CYAN, fontSize: "0.68rem", fontWeight: 600 }}>{runningLayer.progress.toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Evaluation layers */}
      <div className="px-5 py-4 flex flex-col gap-2.5 flex-1 overflow-y-auto">
        {layers.map(layer => <LayerRow key={layer.id} layer={layer} />)}
      </div>

      {/* Score + submit */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <div>
          <div style={{ color: "#334155", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Score so far</div>
          <div className="flex items-baseline gap-1.5">
            <span style={{
              color: totalScore >= 80 ? GREEN : totalScore >= 60 ? AMBER : "#ef4444",
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: `0 0 30px ${totalScore >= 80 ? GREEN : AMBER}40`,
            }}>
              {totalScore}
            </span>
            <span style={{ color: "#334155", fontSize: "1.1rem", fontWeight: 500 }}>/100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {totalScore >= 80 ? (
              <><Star size={11} style={{ color: GREEN }} /><span style={{ color: GREEN, fontSize: "0.7rem", fontWeight: 600 }}>On track for validation</span></>
            ) : (
              <><Info size={11} style={{ color: AMBER }} /><span style={{ color: AMBER, fontSize: "0.7rem" }}>Evaluation in progress</span></>
            )}
          </div>
        </div>

        <button
          disabled={!allComplete}
          className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300"
          style={{
            background: allComplete ? `linear-gradient(135deg, ${PURPLE}, #7c3aed)` : "rgba(255,255,255,0.04)",
            color: allComplete ? "white" : "#1e3a5f",
            fontSize: "0.86rem",
            fontWeight: 700,
            border: allComplete ? "none" : "1px solid rgba(255,255,255,0.06)",
            boxShadow: allComplete ? "0 0 24px rgba(168,85,247,0.4)" : "none",
            cursor: allComplete ? "pointer" : "not-allowed",
          }}
        >
          <ShieldCheck size={16} />
          {allComplete ? "Submit Score" : "Evaluating…"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RECENT CONSENSUS TABLE
───────────────────────────────────────── */
function RecentConsensus() {
  const rows = [
    { id: "DS-4821", score: 91, consensus: 89, align: true,  reward: "1.2" },
    { id: "DS-4815", score: 78, consensus: 81, align: true,  reward: "0.9" },
    { id: "DS-4809", score: 62, consensus: 70, align: false, reward: "0.0" },
    { id: "DS-4803", score: 95, consensus: 94, align: true,  reward: "1.6" },
  ];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <GitMerge size={14} style={{ color: PURPLE }} />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.84rem", fontWeight: 700 }}>Recent Consensus History</span>
        </div>
        <button className="flex items-center gap-1 transition-colors" style={{ color: "#334155", fontSize: "0.7rem" }}>
          View all <ChevronRight size={10} />
        </button>
      </div>
      <div className="px-5 py-2">
        <div className="grid grid-cols-5 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {["Dataset", "My Score", "Consensus", "Aligned", "Reward"].map(h => (
            <span key={h} style={{ color: "#334155", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ color: "#64748b", fontSize: "0.77rem", fontFamily: "monospace" }}>{r.id}</span>
            <span style={{ color: r.score >= 80 ? GREEN : AMBER, fontSize: "0.77rem", fontWeight: 600 }}>{r.score}</span>
            <span style={{ color: "#64748b", fontSize: "0.77rem" }}>{r.consensus}</span>
            <span style={{ color: r.align ? GREEN : "#ef4444", fontSize: "0.72rem", fontWeight: 600 }}>{r.align ? "✓ Yes" : "✗ No"}</span>
            <span style={{ color: r.reward === "0.0" ? "#334155" : CYAN, fontSize: "0.77rem", fontWeight: 600 }}>{r.reward} τ</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export function ValidatorDashboard() {
  const [activeDatasetId, setActiveDatasetId] = useState("DS-4829");

  return (
    <div>
      {/* Global keyframes */}
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PURPLE, boxShadow: `0 0 8px ${PURPLE}` }} />
            <span style={{ color: PURPLE, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>VALIDATOR PORTAL</span>
          </div>
          <h1 style={{ color: "white", fontSize: "1.55rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Welcome back,{" "}
            <span style={{ background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Ahmad
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.85rem", marginTop: "4px" }}>
            Epoch 362 · DataVerify Subnet UID 42 · 1 active evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)", border: `1px solid ${PURPLE_BORDER}` }}>
            <ShieldCheck size={15} style={{ color: PURPLE }} />
            <div>
              <div style={{ color: PURPLE, fontSize: "0.78rem", fontWeight: 700 }}>Vtrust: 0.961</div>
              <div style={{ color: "#334155", fontSize: "0.65rem" }}>Top 15% · Rank #12</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.04) 100%)", border: "1px solid rgba(56,189,248,0.2)" }}>
            <Activity size={15} style={{ color: CYAN }} />
            <div>
              <div style={{ color: CYAN, fontSize: "0.78rem", fontWeight: 700 }}>Online · Block #4,821,093</div>
              <div style={{ color: "#334155", fontSize: "0.65rem" }}>~6 s / block</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatCards />

      {/* Main split: 58% / 42% */}
      <div className="flex gap-5" style={{ alignItems: "stretch" }}>
        <div className="flex flex-col gap-4" style={{ flex: "0 0 58%" }}>
          <PendingEvaluations onStart={setActiveDatasetId} activeId={activeDatasetId} />
          <RecentConsensus />
        </div>
        <div style={{ flex: "0 0 42%" }}>
          <ActiveEvaluationPanel datasetId={activeDatasetId} />
        </div>
      </div>
    </div>
  );
}
