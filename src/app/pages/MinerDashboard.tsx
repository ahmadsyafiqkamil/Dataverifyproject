import { useState } from "react";
import { EarningsOverview } from "../components/miner/EarningsOverview";
import { SubmitCTA } from "../components/miner/SubmitCTA";
import { SubmissionsTable } from "../components/miner/SubmissionsTable";
import { ScoreBreakdown } from "../components/miner/ScoreBreakdown";
import { RewardHistory } from "../components/miner/RewardHistory";
import { Cpu, Activity, Clock } from "lucide-react";

export function MinerDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<string>("DS-4612");

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <Cpu size={10} style={{ color: "#f59e0b" }} />
              <span style={{ color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                MINER DASHBOARD
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <Activity size={10} style={{ color: "#22c55e" }} className="animate-pulse" />
              <span style={{ color: "#22c55e", fontSize: "0.68rem", fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Miner{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Overview
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.86rem", marginTop: "5px" }}>
            Track your submissions, earnings, and quality scores in real-time
          </p>
        </div>

        {/* Last updated */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Clock size={13} style={{ color: "#475569" }} />
          <span style={{ color: "#475569", fontSize: "0.75rem" }}>Last synced:</span>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>Feb 23, 2026 · 14:32 UTC</span>
        </div>
      </div>

      {/* Row 1: Earnings overview cards */}
      <div className="mb-5">
        <EarningsOverview />
      </div>

      {/* Row 2: Submit CTA */}
      <div className="mb-5">
        <SubmitCTA />
      </div>

      {/* Row 3: Submissions table + Score breakdown side by side */}
      <div className="flex gap-5 items-start mb-5">
        <div className="flex-1 min-w-0">
          <SubmissionsTable onSelectSubmission={setSelectedSubmission} />
        </div>
        <div style={{ width: "300px", flexShrink: 0 }}>
          <ScoreBreakdown selectedId={selectedSubmission} />
        </div>
      </div>

      {/* Row 4: Reward history chart */}
      <div>
        <RewardHistory />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between py-4 mt-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#334155", fontSize: "0.75rem" }}>
          © 2026 DataVerify Subnet · Miner Portal · Powered by Bittensor
        </span>
        <div className="flex items-center gap-4">
          {["Docs", "SDK", "Discord", "Status"].map((link) => (
            <button
              key={link}
              style={{ color: "#334155", fontSize: "0.75rem" }}
              className="hover:text-amber-400 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
