import React, { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Shield, Info } from "lucide-react";

const submissionScores: Record<string, { label: string; score: number; color: string; tip: string }[]> = {
  "DS-4612": [
    { label: "Stat. Fidelity", score: 98, color: "#38bdf8", tip: "Statistical properties closely match real distribution" },
    { label: "Privacy", score: 97, color: "#22c55e", tip: "No PII leakage detected across all privacy tests" },
    { label: "Bias & Fairness", score: 95, color: "#a78bfa", tip: "Minimal demographic and label bias detected" },
    { label: "Downstream Utility", score: 99, color: "#f59e0b", tip: "Excellent ML model training performance" },
    { label: "Adversarial Realism", score: 96, color: "#f472b6", tip: "Resistant to membership inference attacks" },
  ],
  "DS-4821": [
    { label: "Stat. Fidelity", score: 97, color: "#38bdf8", tip: "Marginal distributions closely match clinical data" },
    { label: "Privacy", score: 99, color: "#22c55e", tip: "Zero PII in synthetic records" },
    { label: "Bias & Fairness", score: 91, color: "#a78bfa", tip: "Minor age-group imbalance detected" },
    { label: "Downstream Utility", score: 95, color: "#f59e0b", tip: "High downstream performance on ICD coding task" },
    { label: "Adversarial Realism", score: 96, color: "#f472b6", tip: "Robust against model inversion attacks" },
  ],
  "DS-4756": [
    { label: "Stat. Fidelity", score: 92, color: "#38bdf8", tip: "Autocorrelation and volatility structures preserved" },
    { label: "Privacy", score: 88, color: "#22c55e", tip: "Low linkage attack risk" },
    { label: "Bias & Fairness", score: 84, color: "#a78bfa", tip: "Sector representation slightly skewed" },
    { label: "Downstream Utility", score: 90, color: "#f59e0b", tip: "Good performance on momentum strategy backtests" },
    { label: "Adversarial Realism", score: 87, color: "#f472b6", tip: "Moderate resistance to reverse-engineering" },
  ],
};

const defaultId = "DS-4612";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { label: string; score: number; fullMark: number } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-xl"
      style={{
        backgroundColor: "#0f1f35",
        border: "1px solid rgba(56,189,248,0.25)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: "white", fontSize: "0.8rem", fontWeight: 700 }}>{d.label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span style={{ color: "#38bdf8", fontSize: "1rem", fontWeight: 800 }}>{d.score}</span>
        <span style={{ color: "#475569", fontSize: "0.72rem" }}>/100</span>
      </div>
    </div>
  );
}

function MetricRow({ label, score, color, tip }: { label: string; score: number; color: string; tip: string }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="flex items-center gap-2 relative group">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
      <span style={{ color: "#64748b", fontSize: "0.73rem", width: "100px", flexShrink: 0 }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
      <span style={{ color, fontSize: "0.73rem", fontWeight: 700, width: "28px", textAlign: "right" }}>{score}</span>
      <button
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ color: "#334155" }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <Info size={10} />
      </button>
      {showTip && (
        <div
          className="absolute right-0 bottom-full mb-2 px-2.5 py-1.5 rounded-lg z-20 w-48"
          style={{
            backgroundColor: "#0f1f35",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            color: "#94a3b8",
            fontSize: "0.68rem",
            lineHeight: 1.5,
          }}
        >
          {tip}
        </div>
      )}
    </div>
  );
}

interface ScoreBreakdownProps {
  selectedId?: string;
}

export function ScoreBreakdown({ selectedId }: ScoreBreakdownProps) {
  const id = selectedId && submissionScores[selectedId] ? selectedId : defaultId;
  const metrics = submissionScores[id];
  const radarData = metrics.map(m => ({ label: m.label, score: m.score, fullMark: 100 }));
  const avgScore = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);

  return (
    <div
      className="rounded-2xl flex flex-col"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.06)",
        minWidth: "280px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <Shield size={15} style={{ color: "#38bdf8" }} />
          <h3 style={{ color: "white", fontSize: "0.92rem", fontWeight: 700 }}>Score Breakdown</h3>
        </div>
        <div
          className="px-2 py-0.5 rounded-lg"
          style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}
        >
          <span style={{ color: "#38bdf8", fontSize: "0.7rem", fontWeight: 700, fontFamily: "monospace" }}>{id}</span>
        </div>
      </div>

      {/* Radar chart */}
      <div className="px-3 pt-2 pb-0" style={{ height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid
              stroke="rgba(255,255,255,0.06)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="label"
              tick={{
                fill: "#475569",
                fontSize: 10,
                fontWeight: 500,
              }}
              tickLine={false}
            />
            <Radar
              dataKey="score"
              stroke="#38bdf8"
              fill="rgba(56,189,248,0.15)"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, index } = props;
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="#38bdf8"
                    stroke="none"
                    style={{ filter: "drop-shadow(0 0 4px rgba(56,189,248,0.8))" }}
                  />
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Average score badge */}
      <div className="px-5 pt-1 pb-3">
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.04) 100%)",
            border: "1px solid rgba(56,189,248,0.15)",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Composite Score</span>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#38bdf8", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", textShadow: "0 0 16px rgba(56,189,248,0.6)" }}>
              {avgScore}
            </span>
            <span style={{ color: "#475569", fontSize: "0.72rem" }}>/100</span>
          </div>
        </div>
      </div>

      {/* Individual metric bars */}
      <div
        className="px-5 pb-5 flex flex-col gap-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px" }}
      >
        <div style={{ color: "#334155", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
          Dimension Scores
        </div>
        {metrics.map(m => (
          <MetricRow key={m.label} {...m} />
        ))}
      </div>
    </div>
  );
}