import { useState } from "react";
import { Wifi, ChevronDown, Bell, Search } from "lucide-react";

export function Navbar() {
  const [connected, setConnected] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 border-b"
      style={{
        backgroundColor: "#0d1b2e",
        borderColor: "rgba(56,189,248,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            boxShadow: "0 0 16px rgba(56,189,248,0.4)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 2V16M2 6L16 12M16 6L2 12" stroke="white" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
        <div>
          <span className="text-white tracking-wide" style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.04em" }}>
            DataVerify
          </span>
          <span style={{ color: "#38bdf8", fontSize: "0.65rem", display: "block", letterSpacing: "0.12em", fontWeight: 500, marginTop: "-2px" }}>
            SUBNET
          </span>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.1)", width: "320px" }}>
        <Search size={15} style={{ color: "#64748b" }} />
        <input
          type="text"
          placeholder="Search datasets, domains..."
          className="bg-transparent outline-none w-full text-white placeholder-slate-500"
          style={{ fontSize: "0.85rem" }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.1)" }}
        >
          <Bell size={16} style={{ color: "#94a3b8" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }}
          />
        </button>

        {/* Wallet address pill */}
        {connected && (
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.2)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace" }}>0x3f...a9c2</span>
            <ChevronDown size={12} style={{ color: "#64748b" }} />
          </div>
        )}

        {/* Connect Wallet button */}
        <button
          onClick={() => setConnected(!connected)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            background: connected
              ? "linear-gradient(135deg, #1e293b 0%, #1e293b 100%)"
              : "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            color: connected ? "#38bdf8" : "white",
            border: connected ? "1px solid rgba(56,189,248,0.3)" : "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: connected ? "none" : "0 0 20px rgba(56,189,248,0.35)",
          }}
        >
          <Wifi size={15} />
          {connected ? "Connected" : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
