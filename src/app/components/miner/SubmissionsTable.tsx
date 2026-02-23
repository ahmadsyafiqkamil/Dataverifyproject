import { useState } from "react";
import {
  CheckCircle2, Clock, XCircle, ExternalLink, ChevronUp, ChevronDown,
  Filter, Download, Eye
} from "lucide-react";

interface Submission {
  id: string;
  domain: string;
  domainColor: string;
  dataType: string;
  score: number;
  status: "verified" | "in_review" | "rejected";
  reward: string | null;
  date: string;
  size: string;
  records: string;
}

const submissions: Submission[] = [
  { id: "DS-4821", domain: "Healthcare", domainColor: "#38bdf8", dataType: "Tabular", score: 96, status: "verified", reward: "42.5", date: "Feb 20, 2026", size: "1.2 GB", records: "240K" },
  { id: "DS-4756", domain: "Finance", domainColor: "#34d399", dataType: "Time Series", score: 89, status: "verified", reward: "38.2", date: "Feb 18, 2026", size: "890 MB", records: "180K" },
  { id: "DS-4612", domain: "NLP", domainColor: "#a78bfa", dataType: "Text", score: 97, status: "verified", reward: "51.0", date: "Feb 15, 2026", size: "3.4 GB", records: "748K" },
  { id: "DS-4534", domain: "Computer Vision", domainColor: "#f472b6", dataType: "Image", score: 74, status: "in_review", reward: null, date: "Feb 12, 2026", size: "28.5 GB", records: "85K" },
  { id: "DS-4401", domain: "Autonomous", domainColor: "#fb923c", dataType: "Multi-modal", score: 82, status: "in_review", reward: null, date: "Feb 08, 2026", size: "14.2 GB", records: "120K" },
  { id: "DS-4287", domain: "Healthcare", domainColor: "#38bdf8", dataType: "Tabular", score: 45, status: "rejected", reward: "0", date: "Feb 05, 2026", size: "540 MB", records: "95K" },
  { id: "DS-4102", domain: "Finance", domainColor: "#34d399", dataType: "Tabular", score: 91, status: "verified", reward: "44.3", date: "Jan 28, 2026", size: "1.1 GB", records: "210K" },
];

function StatusBadge({ status }: { status: Submission["status"] }) {
  if (status === "verified") return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
    >
      <CheckCircle2 size={11} style={{ color: "#22c55e" }} />
      <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 700 }}>Verified</span>
    </div>
  );
  if (status === "in_review") return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
    >
      <Clock size={11} style={{ color: "#f59e0b" }} className="animate-pulse" />
      <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700 }}>In Review</span>
    </div>
  );
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
    >
      <XCircle size={11} style={{ color: "#ef4444" }} />
      <span style={{ color: "#ef4444", fontSize: "0.72rem", fontWeight: 700 }}>Rejected</span>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 90 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";
  const bg = score >= 90 ? "rgba(34,197,94,0.1)" : score >= 70 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}70` }}
        />
      </div>
      <span
        className="px-1.5 py-0.5 rounded-md min-w-[34px] text-center"
        style={{ backgroundColor: bg, color, fontSize: "0.72rem", fontWeight: 700 }}
      >
        {score}
      </span>
    </div>
  );
}

type SortKey = "id" | "score" | "date" | "reward";

export function SubmissionsTable({ onSelectSubmission }: { onSelectSubmission: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "in_review" | "rejected">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...submissions]
    .filter(s => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => {
      let val = 0;
      if (sortKey === "id") val = a.id.localeCompare(b.id);
      else if (sortKey === "score") val = a.score - b.score;
      else if (sortKey === "date") val = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortKey === "reward") val = parseFloat(a.reward ?? "0") - parseFloat(b.reward ?? "0");
      return sortDir === "asc" ? val : -val;
    });

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 inline-flex flex-col gap-0" style={{ opacity: sortKey === k ? 1 : 0.3 }}>
      {sortKey === k && sortDir === "asc"
        ? <ChevronUp size={12} style={{ color: "#f59e0b" }} />
        : <ChevronDown size={12} style={{ color: sortKey === k ? "#f59e0b" : "#475569" }} />
      }
    </span>
  );

  const cols: { label: string; key?: SortKey; width?: string }[] = [
    { label: "Dataset ID", key: "id", width: "110px" },
    { label: "Domain", width: "130px" },
    { label: "Data Type", width: "110px" },
    { label: "Score", key: "score", width: "140px" },
    { label: "Status", width: "120px" },
    { label: "Reward (TAO)", key: "reward", width: "120px" },
    { label: "Date", key: "date", width: "120px" },
    { label: "", width: "60px" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <h3 style={{ color: "white", fontSize: "0.95rem", fontWeight: 700 }}>My Submissions</h3>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", fontSize: "0.7rem", fontWeight: 700 }}
          >
            {submissions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {(["all", "verified", "in_review", "rejected"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className="px-3 py-1.5 transition-all"
                style={{
                  backgroundColor: statusFilter === f ? "rgba(56,189,248,0.12)" : "transparent",
                  color: statusFilter === f ? "#38bdf8" : "#475569",
                  fontSize: "0.72rem",
                  fontWeight: statusFilter === f ? 700 : 400,
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {f === "all" ? "All" : f === "in_review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/8"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Download size={14} style={{ color: "#64748b" }} />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Filter size={14} style={{ color: "#64748b" }} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {cols.map(col => (
                <th
                  key={col.label}
                  className="text-left px-4 py-3"
                  style={{ width: col.width, minWidth: col.width }}
                >
                  {col.key ? (
                    <button
                      className="flex items-center gap-0.5 transition-colors hover:text-white"
                      style={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                      onClick={() => handleSort(col.key!)}
                    >
                      {col.label}
                      <SortIcon k={col.key} />
                    </button>
                  ) : (
                    <span style={{ color: "#334155", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((sub, idx) => {
              const isHovered = hovered === sub.id;
              return (
                <tr
                  key={sub.id}
                  className="transition-all duration-150 cursor-pointer"
                  style={{
                    borderBottom: idx < sorted.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    backgroundColor: isHovered ? "rgba(56,189,248,0.04)" : "transparent",
                  }}
                  onMouseEnter={() => setHovered(sub.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelectSubmission(sub.id)}
                >
                  {/* ID */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-6 rounded-full"
                        style={{
                          backgroundColor: sub.status === "verified" ? "#22c55e" : sub.status === "in_review" ? "#f59e0b" : "#ef4444",
                          opacity: 0.7,
                        }}
                      />
                      <span style={{ color: isHovered ? "#38bdf8" : "#94a3b8", fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace", transition: "color 0.15s" }}>
                        {sub.id}
                      </span>
                    </div>
                  </td>
                  {/* Domain */}
                  <td className="px-4 py-3.5">
                    <div
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${sub.domainColor}14`, border: `1px solid ${sub.domainColor}30` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sub.domainColor }} />
                      <span style={{ color: sub.domainColor, fontSize: "0.72rem", fontWeight: 600 }}>{sub.domain}</span>
                    </div>
                  </td>
                  {/* Data type */}
                  <td className="px-4 py-3.5">
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{sub.dataType}</span>
                  </td>
                  {/* Score */}
                  <td className="px-4 py-3.5">
                    <ScorePill score={sub.score} />
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={sub.status} />
                  </td>
                  {/* Reward */}
                  <td className="px-4 py-3.5">
                    {sub.reward === null ? (
                      <span style={{ color: "#334155", fontSize: "0.8rem" }}>—</span>
                    ) : parseFloat(sub.reward) === 0 ? (
                      <span style={{ color: "#475569", fontSize: "0.8rem" }}>0 TAO</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span style={{ color: "#22c55e", fontSize: "0.88rem", fontWeight: 700 }}>{sub.reward}</span>
                        <span style={{ color: "#475569", fontSize: "0.7rem" }}>TAO</span>
                      </div>
                    )}
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3.5">
                    <span style={{ color: "#475569", fontSize: "0.78rem" }}>{sub.date}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
                        onClick={(e) => { e.stopPropagation(); onSelectSubmission(sub.id); }}
                      >
                        <Eye size={12} style={{ color: "#475569" }} />
                      </button>
                      <button className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:bg-white/10">
                        <ExternalLink size={12} style={{ color: "#475569" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#334155", fontSize: "0.72rem" }}>
          Showing {sorted.length} of {submissions.length} submissions
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
            <span style={{ color: "#475569", fontSize: "0.68rem" }}>4 Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            <span style={{ color: "#475569", fontSize: "0.68rem" }}>2 In Review</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ef4444" }} />
            <span style={{ color: "#475569", fontSize: "0.68rem" }}>1 Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { submissions };