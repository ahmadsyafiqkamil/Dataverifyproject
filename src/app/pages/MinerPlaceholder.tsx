import { Upload, ClipboardList, DollarSign, Settings, Construction } from "lucide-react";
import { useLocation } from "react-router";

const pages: Record<string, { icon: React.ReactNode; title: string; desc: string; color: string }> = {
  "/miner/submit": {
    icon: <Upload size={30} />,
    title: "Submit Dataset",
    desc: "Upload your synthetic dataset for verification and earn TAO rewards",
    color: "#38bdf8",
  },
  "/miner/submissions": {
    icon: <ClipboardList size={30} />,
    title: "My Submissions",
    desc: "Browse and manage all your submitted datasets",
    color: "#a78bfa",
  },
  "/miner/earnings": {
    icon: <DollarSign size={30} />,
    title: "Earnings",
    desc: "Detailed breakdown of your TAO rewards and payment history",
    color: "#22c55e",
  },
  "/miner/settings": {
    icon: <Settings size={30} />,
    title: "Settings",
    desc: "Configure your miner preferences, wallet, and notification settings",
    color: "#f59e0b",
  },
};

export function MinerPlaceholder() {
  const { pathname } = useLocation();
  const page = pages[pathname];

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{
          backgroundColor: page ? `${page.color}12` : "rgba(245,158,11,0.08)",
          border: `1px solid ${page ? page.color : "#f59e0b"}25`,
        }}
      >
        <span style={{ color: page?.color ?? "#f59e0b" }}>
          {page?.icon ?? <Construction size={30} />}
        </span>
      </div>
      <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 700 }}>
        {page?.title ?? "Coming Soon"}
      </h2>
      <p style={{ color: "#475569", fontSize: "0.88rem", marginTop: "8px", maxWidth: "300px", textAlign: "center", lineHeight: 1.6 }}>
        {page?.desc ?? "This section is under construction"}
      </p>
      <div
        className="mt-4 px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 600 }}>Coming in v2.0</span>
      </div>
    </div>
  );
}
