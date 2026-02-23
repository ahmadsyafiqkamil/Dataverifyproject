import { StatsRow } from "../components/StatsRow";
import { DatasetCards } from "../components/DatasetCards";
import { ActivityTable } from "../components/ActivityTable";
import { ActivityChart, TaoChart } from "../components/MiniChart";
import { Sparkles, ArrowRight } from "lucide-react";

export function DashboardPage() {
  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.25)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }}
              />
              <span style={{ color: "#38bdf8", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}>
                BITTENSOR SUBNET
              </span>
            </div>
          </div>
          <h1 style={{ color: "white", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Welcome back,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ahmad
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.9rem", marginTop: "6px" }}>
            Find verified synthetic datasets for your AI models
          </p>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] group"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(129,140,248,0.08) 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            boxShadow: "0 4px 20px rgba(56,189,248,0.08)",
            minWidth: "260px",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)" }}
          >
            <Sparkles size={18} style={{ color: "white" }} />
          </div>
          <div>
            <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>New: AI Dataset Discovery</div>
            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Let AI find the perfect dataset for you</div>
          </div>
          <ArrowRight
            size={16}
            style={{ color: "#38bdf8", marginLeft: "auto", transition: "transform 0.2s" }}
            className="group-hover:translate-x-1"
          />
        </div>
      </div>

      <div className="mb-6"><StatsRow /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <ActivityChart />
        <TaoChart />
      </div>
      <div className="mb-6"><DatasetCards /></div>
      <div className="mb-6"><ActivityTable /></div>

      <div
        className="flex items-center justify-between py-4 mt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#334155", fontSize: "0.75rem" }}>
          © 2026 DataVerify Subnet • Powered by Bittensor
        </span>
        <div className="flex items-center gap-4">
          {["Docs", "API", "Discord", "Status"].map((link) => (
            <button key={link} style={{ color: "#334155", fontSize: "0.75rem" }} className="hover:text-cyan-400 transition-colors">
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
