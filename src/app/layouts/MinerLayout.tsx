import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Upload, ClipboardList, DollarSign,
  Settings, ChevronRight, Cpu, Wifi, Bell, Zap,
  ExternalLink, BarChart3, Shield, ArrowLeft,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, path: "/miner" },
  { id: "submit", label: "Submit Dataset", icon: Upload, path: "/miner/submit" },
  { id: "submissions", label: "My Submissions", icon: ClipboardList, path: "/miner/submissions" },
  { id: "earnings", label: "Earnings", icon: DollarSign, path: "/miner/earnings" },
  { id: "settings", label: "Settings", icon: Settings, path: "/miner/settings" },
];

export function MinerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const w = collapsed ? 70 : 220;

  const active = (() => {
    if (location.pathname === "/miner") return "overview";
    const match = navItems.find(n => n.path !== "/miner" && location.pathname.startsWith(n.path));
    return match?.id ?? "overview";
  })();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#0f172a",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Dot grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.04) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          zIndex: 0,
        }}
      />
      {/* Amber glow top-left */}
      <div className="fixed pointer-events-none" style={{ top: "5%", left: "15%", width: "500px", height: "400px", background: "radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)", zIndex: 0 }} />
      {/* Cyan glow bottom-right */}
      <div className="fixed pointer-events-none" style={{ bottom: "15%", right: "8%", width: "450px", height: "400px", background: "radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)", zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-16"
        style={{
          backgroundColor: "rgba(13,22,41,0.95)",
          borderBottom: "1px solid rgba(245,158,11,0.15)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 0 16px rgba(245,158,11,0.4)" }}
          >
            <Cpu size={15} style={{ color: "white" }} />
          </div>
          <div>
            <span style={{ color: "white", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
              DataVerify
            </span>
            <span style={{ color: "#f59e0b", fontSize: "0.9rem", fontWeight: 500 }}> — Miner Portal</span>
          </div>
          {/* Back to main */}
          <button
            onClick={() => navigate("/")}
            className="ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#475569", fontSize: "0.72rem" }}
          >
            <ArrowLeft size={11} />
            Main App
          </button>
        </div>

        {/* Center — network status */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }} />
            <span style={{ color: "#22c55e", fontSize: "0.78rem", fontWeight: 600 }}>ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <BarChart3 size={12} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Block:</span>
            <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>#4,821,093</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Zap size={12} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Emissions:</span>
            <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 600 }}>2.14 τ/epoch</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Stake pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.06) 100%)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <Shield size={12} style={{ color: "#22c55e" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>My Stake:</span>
            <span style={{ color: "#22c55e", fontSize: "0.78rem", fontWeight: 700 }}>450 TAO</span>
          </div>

          {/* Bell */}
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(245,158,11,0.12)" }}
          >
            <Bell size={15} style={{ color: "#94a3b8" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.8)" }} />
          </button>

          {/* Wallet pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.2)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.78rem", fontFamily: "monospace" }}>5GrwvaEF…8PH3</span>
            <ExternalLink size={10} style={{ color: "#475569" }} />
          </div>

          {/* Connect button */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#0a1628",
              fontSize: "0.82rem",
              fontWeight: 700,
              boxShadow: "0 0 18px rgba(245,158,11,0.3)",
            }}
          >
            <Wifi size={14} />
            Connected
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <aside
        className="fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300 z-40"
        style={{
          width: `${w}px`,
          backgroundColor: "#0d1b2e",
          borderRight: "1px solid rgba(245,158,11,0.1)",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}
        >
          <ChevronRight size={12} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }} />
        </button>

        {/* Miner badge */}
        {!collapsed && (
          <div
            className="mx-3 mt-4 mb-3 px-3 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.04) 100%)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <Cpu size={12} style={{ color: "white" }} />
              </div>
              <div>
                <div style={{ color: "white", fontSize: "0.78rem", fontWeight: 600 }}>Ahmad</div>
                <div style={{ color: "#f59e0b", fontSize: "0.65rem", fontWeight: 600 }}>Miner · Rank #47</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                style={{
                  backgroundColor: isActive ? "rgba(245,158,11,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(245,158,11,0.22)" : "1px solid transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? label : undefined}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                    style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 8px rgba(245,158,11,0.8)" }}
                  />
                )}
                <Icon
                  size={18}
                  style={{
                    color: isActive ? "#f59e0b" : "#64748b",
                    filter: isActive ? "drop-shadow(0 0 5px rgba(245,158,11,0.6))" : "none",
                    flexShrink: 0,
                  }}
                />
                {!collapsed && (
                  <span style={{ color: isActive ? "#f59e0b" : "#64748b", fontSize: "0.86rem", fontWeight: isActive ? 600 : 400 }}>
                    {label}
                  </span>
                )}
                {id === "submissions" && !collapsed && (
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: "rgba(56,189,248,0.12)", color: "#38bdf8", fontSize: "0.62rem", fontWeight: 700 }}
                  >
                    7
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Network info */}
        <div
          className="p-3 m-3 rounded-xl"
          style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)" }}
        >
          {collapsed ? (
            <div className="flex justify-center"><Zap size={15} style={{ color: "#f59e0b" }} /></div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Zap size={12} style={{ color: "#f59e0b" }} />
                <span style={{ color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>SUBNET STATUS</span>
              </div>
              {[
                { k: "Subnet UID", v: "42" },
                { k: "Miners", v: "256" },
                { k: "My UID", v: "47" },
                { k: "Incentive", v: "0.0041 τ" },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-center justify-between mt-1.5">
                  <span style={{ color: "#475569", fontSize: "0.7rem" }}>{k}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main
        className="relative transition-all duration-300"
        style={{
          marginLeft: `${w}px`,
          marginTop: "64px",
          padding: "26px",
          minHeight: "calc(100vh - 64px)",
          zIndex: 10,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
