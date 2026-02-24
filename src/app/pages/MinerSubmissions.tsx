import { useState, useMemo } from "react";
import {
  ClipboardList, Activity, Clock, Search, SlidersHorizontal,
  ChevronDown, CheckCircle2, AlertCircle, XCircle, Timer,
  ExternalLink, ArrowUpRight, Shield, Eye, Zap, Lock,
  Loader2, ChevronRight,
} from "lucide-react";

/* ═══════ DATA ═══════ */

type SubmissionStatus = "Verified" | "In Review" | "Rejected" | "Pending";

interface Submission {
  id: string;
  domain: string;
  domainColor: string;
  dataType: string;
  score: number | null;
  status: SubmissionStatus;
  reward: number | null;
  bonus: string | null;
  date: string;
  dateISO: string;
  records: string;
  fileSize: string;
  genMethod: string;
  submittedTime: string;
  estimatedCompletion: string | null;
  screener1: "Passed" | "Pending" | "Failed";
  screener2: "Passed" | "Pending" | "Failed";
  fullValidation: "Passed" | "In Progress" | "Pending" | "Failed";
  validationProgress: number;
  dimensions: {
    name: string;
    score: number | null;
    status: "done" | "running" | "locked";
  }[];
  validators: {
    addr: string;
    status: "submitted" | "evaluating" | "waiting";
  }[];
}

const submissions: Submission[] = [
  {
    id: "DS-4821",
    domain: "Healthcare",
    domainColor: "#38bdf8",
    dataType: "Tabular",
    score: 96,
    status: "Verified",
    reward: 42.5,
    bonus: "3x",
    date: "Feb 20, 2026",
    dateISO: "2026-02-20",
    records: "1.2M rows",
    fileSize: "4.7 GB",
    genMethod: "Custom GAN v4.2",
    submittedTime: "Feb 20, 2026 · 09:15 UTC",
    estimatedCompletion: null,
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "Passed",
    validationProgress: 100,
    dimensions: [
      { name: "Stat. Fidelity", score: 98, status: "done" },
      { name: "Privacy", score: 95, status: "done" },
      { name: "Bias & Fairness", score: 94, status: "done" },
      { name: "Utility", score: 97, status: "done" },
      { name: "Realism", score: 96, status: "done" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "submitted" },
      { addr: "5HqUkGZa...mK8Pp", status: "submitted" },
    ],
  },
  {
    id: "DS-4756",
    domain: "Finance",
    domainColor: "#22c55e",
    dataType: "Time Series",
    score: 89,
    status: "Verified",
    reward: 38.2,
    bonus: "2x",
    date: "Feb 18, 2026",
    dateISO: "2026-02-18",
    records: "800K rows",
    fileSize: "2.1 GB",
    genMethod: "TimeGAN",
    submittedTime: "Feb 18, 2026 · 11:42 UTC",
    estimatedCompletion: null,
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "Passed",
    validationProgress: 100,
    dimensions: [
      { name: "Stat. Fidelity", score: 91, status: "done" },
      { name: "Privacy", score: 88, status: "done" },
      { name: "Bias & Fairness", score: 87, status: "done" },
      { name: "Utility", score: 90, status: "done" },
      { name: "Realism", score: 89, status: "done" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "submitted" },
      { addr: "5HqUkGZa...mK8Pp", status: "submitted" },
    ],
  },
  {
    id: "DS-4612",
    domain: "NLP",
    domainColor: "#a855f7",
    dataType: "Text",
    score: 97,
    status: "Verified",
    reward: 51.0,
    bonus: "3x",
    date: "Feb 15, 2026",
    dateISO: "2026-02-15",
    records: "2.4M sentences",
    fileSize: "6.8 GB",
    genMethod: "LLaMA Fine-tuned",
    submittedTime: "Feb 15, 2026 · 16:08 UTC",
    estimatedCompletion: null,
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "Passed",
    validationProgress: 100,
    dimensions: [
      { name: "Stat. Fidelity", score: 98, status: "done" },
      { name: "Privacy", score: 96, status: "done" },
      { name: "Bias & Fairness", score: 95, status: "done" },
      { name: "Utility", score: 99, status: "done" },
      { name: "Realism", score: 97, status: "done" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "submitted" },
      { addr: "5HqUkGZa...mK8Pp", status: "submitted" },
    ],
  },
  {
    id: "DS-4534",
    domain: "Computer Vision",
    domainColor: "#ec4899",
    dataType: "Image",
    score: 74,
    status: "In Review",
    reward: null,
    bonus: null,
    date: "Feb 12, 2026",
    dateISO: "2026-02-12",
    records: "50,000 images",
    fileSize: "18.3 GB",
    genMethod: "Stable Diffusion 3",
    submittedTime: "Feb 12, 2026 · 14:23 UTC",
    estimatedCompletion: "~2 hours remaining",
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "In Progress",
    validationProgress: 65,
    dimensions: [
      { name: "Stat. Fidelity", score: 79, status: "done" },
      { name: "Privacy", score: 83, status: "done" },
      { name: "Bias & Fairness", score: 74, status: "running" },
      { name: "Utility", score: null, status: "locked" },
      { name: "Realism", score: null, status: "locked" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "evaluating" },
      { addr: "5HqUkGZa...mK8Pp", status: "waiting" },
    ],
  },
  {
    id: "DS-4401",
    domain: "Autonomous Vehicles",
    domainColor: "#14b8a6",
    dataType: "Multi-modal",
    score: 82,
    status: "In Review",
    reward: null,
    bonus: null,
    date: "Feb 08, 2026",
    dateISO: "2026-02-08",
    records: "25,000 scenes",
    fileSize: "34.1 GB",
    genMethod: "CARLA Simulator + GAN",
    submittedTime: "Feb 08, 2026 · 10:57 UTC",
    estimatedCompletion: "~5 hours remaining",
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "In Progress",
    validationProgress: 40,
    dimensions: [
      { name: "Stat. Fidelity", score: 85, status: "done" },
      { name: "Privacy", score: 82, status: "running" },
      { name: "Bias & Fairness", score: null, status: "locked" },
      { name: "Utility", score: null, status: "locked" },
      { name: "Realism", score: null, status: "locked" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "evaluating" },
      { addr: "5HqUkGZa...mK8Pp", status: "waiting" },
    ],
  },
  {
    id: "DS-4287",
    domain: "Healthcare",
    domainColor: "#38bdf8",
    dataType: "Tabular",
    score: 45,
    status: "Rejected",
    reward: 0,
    bonus: null,
    date: "Feb 05, 2026",
    dateISO: "2026-02-05",
    records: "300K rows",
    fileSize: "1.2 GB",
    genMethod: "CTGAN",
    submittedTime: "Feb 05, 2026 · 08:31 UTC",
    estimatedCompletion: null,
    screener1: "Passed",
    screener2: "Failed",
    fullValidation: "Failed",
    validationProgress: 100,
    dimensions: [
      { name: "Stat. Fidelity", score: 52, status: "done" },
      { name: "Privacy", score: 38, status: "done" },
      { name: "Bias & Fairness", score: 41, status: "done" },
      { name: "Utility", score: 47, status: "done" },
      { name: "Realism", score: 44, status: "done" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "submitted" },
      { addr: "5HqUkGZa...mK8Pp", status: "submitted" },
    ],
  },
  {
    id: "DS-4102",
    domain: "Finance",
    domainColor: "#22c55e",
    dataType: "Tabular",
    score: 91,
    status: "Verified",
    reward: 44.3,
    bonus: "2x",
    date: "Jan 28, 2026",
    dateISO: "2026-01-28",
    records: "950K rows",
    fileSize: "3.4 GB",
    genMethod: "CTGAN + Post-Processing",
    submittedTime: "Jan 28, 2026 · 13:14 UTC",
    estimatedCompletion: null,
    screener1: "Passed",
    screener2: "Passed",
    fullValidation: "Passed",
    validationProgress: 100,
    dimensions: [
      { name: "Stat. Fidelity", score: 93, status: "done" },
      { name: "Privacy", score: 90, status: "done" },
      { name: "Bias & Fairness", score: 88, status: "done" },
      { name: "Utility", score: 92, status: "done" },
      { name: "Realism", score: 91, status: "done" },
    ],
    validators: [
      { addr: "5GmCcrPH...dW9vR", status: "submitted" },
      { addr: "5F3sa2TJ...nLmYi", status: "submitted" },
      { addr: "5HqUkGZa...mK8Pp", status: "submitted" },
    ],
  },
];

/* ═══════ HELPERS ═══════ */

function scoreColor(score: number | null) {
  if (score === null) return "#334155";
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#38bdf8";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

function statusIcon(s: SubmissionStatus) {
  switch (s) {
    case "Verified": return <CheckCircle2 size={12} />;
    case "In Review": return <Timer size={12} />;
    case "Rejected": return <XCircle size={12} />;
    case "Pending": return <AlertCircle size={12} />;
  }
}

function statusColor(s: SubmissionStatus) {
  switch (s) {
    case "Verified": return "#22c55e";
    case "In Review": return "#f59e0b";
    case "Rejected": return "#ef4444";
    case "Pending": return "#94a3b8";
  }
}

const cardBase: React.CSSProperties = {
  backgroundColor: "#1e293b",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
};

/* ═══════ DETAIL PANEL TAB ═══════ */
type PanelTab = "overview" | "score" | "log";

/* ═══════ COMPONENT ═══════ */
export function MinerSubmissions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | SubmissionStatus>("All");
  const [selectedId, setSelectedId] = useState("DS-4534");
  const [panelTab, setPanelTab] = useState<PanelTab>("overview");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let list = submissions;
    if (filter !== "All") list = list.filter((s) => s.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      sortDesc
        ? b.dateISO.localeCompare(a.dateISO)
        : a.dateISO.localeCompare(b.dateISO)
    );
  }, [filter, search, sortDesc]);

  const selected = submissions.find((s) => s.id === selectedId) ?? submissions[3];
  const verifiedCount = submissions.filter((s) => s.status === "Verified").length;
  const reviewCount = submissions.filter((s) => s.status === "In Review").length;
  const rejectedCount = submissions.filter((s) => s.status === "Rejected").length;
  const totalEarned = submissions.reduce((t, s) => t + (s.reward ?? 0), 0);

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              <ClipboardList size={10} style={{ color: "#f97316" }} />
              <span
                style={{
                  color: "#f97316",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                MY SUBMISSIONS
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
            My{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Submissions
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Track all your submitted datasets and their verification status
          </p>
        </div>

        {/* Right stat pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatPill label="Total" value="7" color="#94a3b8" />
          <StatPill label="Verified" value={`${verifiedCount} ✓`} color="#22c55e" />
          <StatPill label="In Review" value={String(reviewCount)} color="#f59e0b" />
        </div>
      </div>

      {/* ── Filter / Search Bar ── */}
      <div
        className="flex items-center gap-3 flex-wrap mb-5 p-3 rounded-xl"
        style={{ ...cardBase, padding: "12px 16px" }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-lg"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid #334155" }}
        >
          <Search size={14} style={{ color: "#475569" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dataset ID or domain..."
            className="bg-transparent outline-none flex-1"
            style={{ color: "#f1f5f9", fontSize: "0.82rem" }}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 flex-wrap">
          {(["All", "Verified", "In Review", "Rejected", "Pending"] as const).map((f) => {
            const active = filter === f;
            const c =
              f === "All" ? "#94a3b8" :
              f === "Verified" ? "#22c55e" :
              f === "In Review" ? "#f59e0b" :
              f === "Rejected" ? "#ef4444" : "#94a3b8";
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: active ? `${c}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? `${c}40` : "#334155"}`,
                  color: active ? c : "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {f === "Verified" ? "Verified ✓" : f === "Rejected" ? "Rejected ✗" : f}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid #334155",
            color: "#94a3b8",
            fontSize: "0.75rem",
          }}
        >
          <SlidersHorizontal size={12} />
          {sortDesc ? "Latest First" : "Oldest First"}
          <ChevronDown size={12} />
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard label="Verified" value={String(verifiedCount)} color="#22c55e" sub="datasets passed" />
        <SummaryCard label="In Review" value={String(reviewCount)} color="#f59e0b" sub="awaiting evaluation" />
        <SummaryCard label="Rejected" value={String(rejectedCount)} color="#ef4444" sub="failed quality check" />
        <SummaryCard label="Total Earned" value={`${totalEarned.toFixed(1)} τ`} color="#f97316" sub="from verified submissions" />
      </div>

      {/* ── Main: Table + Side Panel ── */}
      <div className="flex gap-5 items-start flex-col xl:flex-row">
        {/* LEFT — Table */}
        <div className="flex-1 min-w-0 w-full overflow-hidden" style={{ ...cardBase, padding: 0 }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 740 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155" }}>
                  {["DATASET ID", "DOMAIN", "DATA TYPE", "SCORE", "STATUS", "REWARD", "DATE"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3"
                      style={{
                        color: "#475569",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const isSelected = selectedId === s.id;
                  const isRejected = s.status === "Rejected";
                  const sc = scoreColor(s.score);
                  const stc = statusColor(s.status);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => {
                        setSelectedId(s.id);
                        setPanelTab("overview");
                      }}
                      className="group transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(249,115,22,0.06)"
                          : "transparent",
                        opacity: isRejected && !isSelected ? 0.65 : 1,
                        boxShadow: isSelected ? "inset 3px 0 0 0 #f97316" : "none",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected)
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {/* ID */}
                      <td className="px-4 py-3">
                        <span
                          style={{
                            color: "#38bdf8",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            fontFamily: "monospace",
                          }}
                        >
                          {s.id}
                        </span>
                      </td>
                      {/* Domain */}
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${s.domainColor}12`,
                            color: s.domainColor,
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            border: `1px solid ${s.domainColor}25`,
                          }}
                        >
                          {s.domain}
                        </span>
                      </td>
                      {/* Data Type */}
                      <td className="px-4 py-3">
                        <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{s.dataType}</span>
                      </td>
                      {/* Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: 60,
                              backgroundColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.score ?? 0}%`,
                                backgroundColor: sc,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: sc,
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              fontFamily: "monospace",
                              minWidth: 22,
                            }}
                          >
                            {s.score ?? "—"}
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                            s.status === "In Review" ? "animate-pulse" : ""
                          }`}
                          style={{
                            backgroundColor: `${stc}12`,
                            color: stc,
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            border: `1px solid ${stc}25`,
                          }}
                        >
                          {statusIcon(s.status)}
                          {s.status}
                        </span>
                      </td>
                      {/* Reward */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            style={{
                              color:
                                s.reward === null
                                  ? "#475569"
                                  : s.reward === 0
                                    ? "#ef4444"
                                    : "#22c55e",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            {s.reward === null ? "— τ" : `${s.reward} τ`}
                          </span>
                          {s.bonus && (
                            <span
                              className="px-1.5 py-0.5 rounded-md"
                              style={{
                                backgroundColor: "rgba(249,115,22,0.12)",
                                color: "#f97316",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                border: "1px solid rgba(249,115,22,0.25)",
                              }}
                            >
                              {s.bonus} bonus
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3">
                        <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{s.date}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid #334155" }}
          >
            <span style={{ color: "#475569", fontSize: "0.75rem" }}>
              Showing {filtered.length} of {submissions.length} submissions
            </span>
          </div>
        </div>

        {/* RIGHT — Detail Panel */}
        <div
          className="xl:w-[380px] w-full shrink-0"
          style={{ ...cardBase, padding: 0, overflow: "hidden" }}
        >
          {/* Panel header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span
                  style={{
                    color: "white",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {selected.id}
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${selected.domainColor}12`,
                      color: selected.domainColor,
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      border: `1px solid ${selected.domainColor}25`,
                    }}
                  >
                    {selected.domain}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${
                  selected.status === "In Review" ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: `${statusColor(selected.status)}12`,
                  color: statusColor(selected.status),
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  border: `1px solid ${statusColor(selected.status)}25`,
                }}
              >
                {statusIcon(selected.status)}
                {selected.status}
              </span>
            </div>
          </div>

          {/* Panel tabs */}
          <div
            className="flex gap-0 px-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {([
              { key: "overview", label: "Overview" },
              { key: "score", label: "Score" },
              { key: "log", label: "Validation Log" },
            ] as { key: PanelTab; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setPanelTab(t.key)}
                className="px-3 py-2.5 transition-all relative"
                style={{
                  color: panelTab === t.key ? "#f97316" : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: panelTab === t.key ? 600 : 400,
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                {t.label}
                {panelTab === t.key && (
                  <div
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: "#f97316" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Panel body */}
          <div className="px-5 py-4" style={{ maxHeight: 520, overflowY: "auto" }}>
            {panelTab === "overview" && <OverviewTab s={selected} />}
            {panelTab === "score" && <ScoreTab s={selected} />}
            {panelTab === "log" && <LogTab s={selected} />}
          </div>

          {/* Panel footer */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "#38bdf8",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              View Full Details <ArrowUpRight size={12} />
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all"
              style={{
                backgroundColor:
                  selected.status === "Verified"
                    ? "rgba(168,85,247,0.08)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  selected.status === "Verified"
                    ? "rgba(168,85,247,0.2)"
                    : "#334155"
                }`,
                color:
                  selected.status === "Verified" ? "#a855f7" : "#334155",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor:
                  selected.status === "Verified" ? "pointer" : "not-allowed",
                opacity: selected.status === "Verified" ? 1 : 0.4,
              }}
              disabled={selected.status !== "Verified"}
            >
              <Shield size={12} /> Challenge Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ SUB-COMPONENTS ═══════ */

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{
        backgroundColor: `${color}08`,
        border: `1px solid ${color}22`,
      }}
    >
      <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{label}:</span>
      <span style={{ color, fontSize: "0.78rem", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <div
      style={{
        ...cardBase,
        padding: "18px 20px",
        boxShadow: `0 0 0 1px ${color}15, 0 4px 20px rgba(0,0,0,0.2)`,
      }}
    >
      <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{label}</span>
      <div style={{ color, fontSize: "1.6rem", fontWeight: 700, marginTop: 4, lineHeight: 1.1 }}>
        {value}
      </div>
      <span style={{ color: "#475569", fontSize: "0.72rem" }}>{sub}</span>
    </div>
  );
}

/* — Overview Tab ��� */
function OverviewTab({ s }: { s: Submission }) {
  const fields = [
    { k: "Domain", v: s.domain },
    { k: "Data Type", v: s.dataType },
    { k: "Records", v: s.records },
    { k: "File Size", v: s.fileSize },
    { k: "Generation Method", v: s.genMethod },
    { k: "Submitted", v: s.submittedTime },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 mb-5">
        {fields.map(({ k, v }) => (
          <div key={k} className="flex items-start justify-between gap-2">
            <span style={{ color: "#475569", fontSize: "0.78rem" }}>{k}</span>
            <span
              style={{
                color: "#f1f5f9",
                fontSize: "0.78rem",
                fontWeight: 500,
                textAlign: "right",
                maxWidth: "60%",
              }}
            >
              {v}
            </span>
          </div>
        ))}
        {s.estimatedCompletion && (
          <div className="flex items-start justify-between gap-2">
            <span style={{ color: "#475569", fontSize: "0.78rem" }}>Estimated completion</span>
            <span style={{ color: "#f59e0b", fontSize: "0.78rem", fontWeight: 600 }}>
              {s.estimatedCompletion}
            </span>
          </div>
        )}
      </div>

      {/* Evaluation progress */}
      <div
        className="p-3 rounded-xl mb-4"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid #334155" }}
      >
        <span
          style={{
            color: "#94a3b8",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          EVALUATION PROGRESS
        </span>
        <div className="flex flex-col gap-2 mt-3">
          <ScreenerRow label="Screener 1" status={s.screener1} />
          <ScreenerRow label="Screener 2" status={s.screener2} />
          <ScreenerRow label="Full Validation" status={s.fullValidation} />
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${s.validationProgress}%`,
                backgroundColor:
                  s.validationProgress === 100
                    ? s.status === "Rejected"
                      ? "#ef4444"
                      : "#22c55e"
                    : "#f59e0b",
              }}
            />
          </div>
          <span style={{ color: "#64748b", fontSize: "0.68rem", marginTop: 3, display: "block" }}>
            {s.validationProgress}% complete
          </span>
        </div>
      </div>

      {/* Mini dimension scores */}
      <div className="flex flex-col gap-2">
        {s.dimensions.map((d) => (
          <DimensionRow key={d.name} dim={d} />
        ))}
      </div>

      {s.status === "In Review" && s.score !== null && (
        <div
          className="mt-4 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>
            Partial score so far: <strong>~{s.score}/100</strong> ({s.dimensions.filter(d => d.status === "locked").length} layers remaining)
          </span>
        </div>
      )}
    </div>
  );
}

/* — Score Tab — */
function ScoreTab({ s }: { s: Submission }) {
  const avg =
    s.dimensions.filter((d) => d.score !== null).length > 0
      ? (
          s.dimensions
            .filter((d) => d.score !== null)
            .reduce((sum, d) => sum + (d.score ?? 0), 0) /
          s.dimensions.filter((d) => d.score !== null).length
        ).toFixed(1)
      : "—";

  return (
    <div>
      {/* Big score */}
      <div className="flex flex-col items-center mb-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2"
          style={{
            backgroundColor: `${scoreColor(s.score)}10`,
            border: `2px solid ${scoreColor(s.score)}30`,
          }}
        >
          <span style={{ color: scoreColor(s.score), fontSize: "1.8rem", fontWeight: 700 }}>
            {s.score ?? "—"}
          </span>
        </div>
        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
          Overall Score • Avg: {avg}
        </span>
        {s.bonus && (
          <span
            className="mt-1.5 px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "rgba(249,115,22,0.12)",
              color: "#f97316",
              fontSize: "0.7rem",
              fontWeight: 700,
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            {s.bonus} Quality Multiplier Applied
          </span>
        )}
      </div>

      {/* All dimensions */}
      <div className="flex flex-col gap-3">
        {s.dimensions.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{d.name}</span>
              <span
                style={{
                  color: d.score !== null ? scoreColor(d.score) : "#334155",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {d.score ?? "—"}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              {d.status !== "locked" ? (
                <div
                  className={`h-full rounded-full ${d.status === "running" ? "animate-pulse" : ""}`}
                  style={{
                    width: `${d.score ?? 0}%`,
                    backgroundColor: scoreColor(d.score),
                    transition: "width 0.5s",
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Lock size={8} style={{ color: "#334155" }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {s.reward !== null && s.reward > 0 && (
        <div
          className="mt-5 p-3 rounded-xl"
          style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Reward Earned</span>
            <span style={{ color: "#22c55e", fontSize: "1rem", fontWeight: 700 }}>{s.reward} τ</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* — Log Tab — */
function LogTab({ s }: { s: Submission }) {
  return (
    <div>
      <span
        style={{
          color: "#94a3b8",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        VALIDATORS RESPONDING
      </span>
      <div className="flex flex-col gap-2.5 mt-3">
        {s.validators.map((v, i) => {
          const ic =
            v.status === "submitted"
              ? "#22c55e"
              : v.status === "evaluating"
                ? "#f59e0b"
                : "#475569";
          const label =
            v.status === "submitted"
              ? "Score submitted"
              : v.status === "evaluating"
                ? "Evaluating..."
                : "Waiting";
          return (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid #334155",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(168,85,247,0.1)",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  <span style={{ color: "#a855f7", fontSize: "0.6rem", fontWeight: 700 }}>
                    V{i + 1}
                  </span>
                </div>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                  }}
                >
                  {v.addr}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {v.status === "submitted" ? (
                  <CheckCircle2 size={12} style={{ color: ic }} />
                ) : v.status === "evaluating" ? (
                  <Loader2 size={12} style={{ color: ic }} className="animate-spin" />
                ) : (
                  <Clock size={12} style={{ color: ic }} />
                )}
                <span style={{ color: ic, fontSize: "0.72rem", fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline-style entries */}
      <div className="mt-5">
        <span
          style={{
            color: "#94a3b8",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          EVENT LOG
        </span>
        <div className="flex flex-col gap-0 mt-3">
          {[
            { time: s.submittedTime.split(" · ")[1] || "—", label: "Dataset submitted", color: "#38bdf8" },
            { time: "+2m", label: "Screener 1 passed", color: "#22c55e" },
            {
              time: "+8m",
              label:
                s.screener2 === "Passed"
                  ? "Screener 2 passed"
                  : s.screener2 === "Failed"
                    ? "Screener 2 failed"
                    : "Screener 2 pending",
              color:
                s.screener2 === "Passed"
                  ? "#22c55e"
                  : s.screener2 === "Failed"
                    ? "#ef4444"
                    : "#475569",
            },
            {
              time: "+15m",
              label: "Full validation started",
              color: s.fullValidation === "Pending" ? "#475569" : "#f59e0b",
            },
            ...(s.fullValidation === "Passed"
              ? [{ time: "+1h", label: "Validation complete ✓", color: "#22c55e" }]
              : s.fullValidation === "Failed"
                ? [{ time: "+45m", label: "Validation failed ✗", color: "#ef4444" }]
                : []),
          ].map((e, i) => (
            <div key={i} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: e.color }}
                />
                {i < 4 && (
                  <div
                    className="w-px flex-1"
                    style={{ backgroundColor: "#334155", minHeight: 20 }}
                  />
                )}
              </div>
              <div className="pb-3">
                <div style={{ color: "#f1f5f9", fontSize: "0.78rem" }}>{e.label}</div>
                <div style={{ color: "#475569", fontSize: "0.68rem" }}>{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenerRow({
  label,
  status,
}: {
  label: string;
  status: "Passed" | "In Progress" | "Pending" | "Failed";
}) {
  const color =
    status === "Passed"
      ? "#22c55e"
      : status === "In Progress"
        ? "#f59e0b"
        : status === "Failed"
          ? "#ef4444"
          : "#475569";
  const icon =
    status === "Passed" ? (
      <CheckCircle2 size={12} />
    ) : status === "In Progress" ? (
      <Loader2 size={12} className="animate-spin" />
    ) : status === "Failed" ? (
      <XCircle size={12} />
    ) : (
      <Clock size={12} />
    );

  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{label}</span>
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>
          {status === "Passed"
            ? "✓ Passed"
            : status === "In Progress"
              ? "◷ In Progress"
              : status === "Failed"
                ? "✗ Failed"
                : "Pending"}
        </span>
      </div>
    </div>
  );
}

function DimensionRow({ dim }: { dim: { name: string; score: number | null; status: string } }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ color: "#94a3b8", fontSize: "0.72rem", width: 90, flexShrink: 0 }}>
        {dim.name}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      >
        {dim.status === "locked" ? (
          <div className="h-full" style={{ backgroundColor: "#1e293b" }} />
        ) : (
          <div
            className={`h-full rounded-full ${dim.status === "running" ? "animate-pulse" : ""}`}
            style={{
              width: `${dim.score ?? 0}%`,
              backgroundColor: scoreColor(dim.score),
            }}
          />
        )}
      </div>
      <span
        style={{
          color:
            dim.status === "locked"
              ? "#334155"
              : scoreColor(dim.score),
          fontSize: "0.72rem",
          fontWeight: 700,
          fontFamily: "monospace",
          minWidth: 22,
          textAlign: "right",
        }}
      >
        {dim.status === "locked" ? "—" : dim.score}
      </span>
      {dim.status === "locked" && <Lock size={9} style={{ color: "#334155" }} />}
      {dim.status === "running" && <Loader2 size={9} style={{ color: "#f59e0b" }} className="animate-spin" />}
    </div>
  );
}
