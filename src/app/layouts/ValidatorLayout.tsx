import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, ClipboardCheck, FileSearch,
  GitMerge, DollarSign, ChevronRight,
  ShieldCheck, Wifi, Bell, Zap, ExternalLink,
  BarChart3, ArrowLeft, Activity,
} from "lucide-react";

const PURPLE = "#a855f7";
const PURPLE_DIM = "rgba(168,85,247,0.15)";
const PURPLE_BORDER = "rgba(168,85,247,0.25)";

const navItems = [
  { id: "overview",  label: "Dashboard",           icon: LayoutDashboard, path: "/validator",            badge: null },
  { id: "pending",   label: "Pending Evaluations",  icon: ClipboardCheck,  path: "/validator/pending",    badge: 4   },
  { id: "reviews",   label: "My Reviews",           icon: FileSearch,      path: "/validator/reviews",    badge: null },
  { id: "consensus", label: "Consensus History",    icon: GitMerge,        path: "/validator/consensus",  badge: null },
  { id: "earnings",  label: "Earnings",             icon: DollarSign,      path: "/validator/earnings",   badge: null },
];

export function ValidatorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const w = collapsed ? 70 : 228;

  const active = (() => {
    if (location.pathname === "/validator") return "overview";
    const match = navItems.find(n => n.path !== "/validator" && location.pathname.startsWith(n.path));
    return match?.id ?? "overview";
  })();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0f172a", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Purple dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(168,85,247,0.045) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          zIndex: 0,
        }}
      />
      {/* Ambient glows */}
      <div className="fixed pointer-events-none" style={{ top: "5%", left: "18%", width: "560px", height: "420px", background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 68%)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "10%", right: "6%", width: "480px", height: "380px", background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 68%)", zIndex: 0 }} />

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-16"
        style={{
          backgroundColor: "rgba(10,16,34,0.96)",
          borderBottom: `1px solid ${PURPLE_BORDER}`,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", boxShadow: "0 0 18px rgba(168,85,247,0.45)" }}
          >
            <ShieldCheck size={15} style={{ color: "white" }} />
          </div>
          <div>
            <span style={{ color: "white", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em" }}>DataVerify</span>
            <span style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 500 }}> — Validator Portal</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#475569", fontSize: "0.72rem" }}
          >
            <ArrowLeft size={11} />
            Main App
          </button>
        </div>

        {/* Center — live stats */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.9)" }} />
            <span style={{ color: "#22c55e", fontSize: "0.76rem", fontWeight: 600 }}>VALIDATING</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <BarChart3 size={11} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.71rem" }}>Block:</span>
            <span style={{ color: "#94a3b8", fontSize: "0.71rem", fontWeight: 600 }}>#4,821,093</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Activity size={11} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.71rem" }}>Epoch:</span>
            <span style={{ color: PURPLE, fontSize: "0.71rem", fontWeight: 600 }}>29 / 360 blocks</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Zap size={11} style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b", fontSize: "0.71rem" }}>Emissions:</span>
            <span style={{ color: "#38bdf8", fontSize: "0.71rem", fontWeight: 600 }}>3.82 τ/epoch</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Stake pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.06) 100%)", border: `1px solid ${PURPLE_BORDER}` }}
          >
            <ShieldCheck size={12} style={{ color: PURPLE }} />
            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>My Stake:</span>
            <span style={{ color: PURPLE, fontSize: "0.78rem", fontWeight: 700 }}>1,200 TAO</span>
          </div>

          {/* Bell */}
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#1e293b", border: `1px solid ${PURPLE_BORDER}` }}
          >
            <Bell size={15} style={{ color: "#94a3b8" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: PURPLE, boxShadow: "0 0 6px rgba(168,85,247,0.9)" }} />
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

          {/* Connected */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, #7c3aed 100%)`, color: "white", fontSize: "0.82rem", fontWeight: 700, boxShadow: "0 0 18px rgba(168,85,247,0.35)" }}
          >
            <Wifi size={14} />
            Connected
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300 z-40"
        style={{ width: `${w}px`, backgroundColor: "#0a1020", borderRight: `1px solid rgba(168,85,247,0.12)` }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#1e293b", border: `1px solid ${PURPLE_BORDER}`, color: PURPLE }}
        >
          <ChevronRight size={12} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }} />
        </button>

        {/* Validator badge */}
        {!collapsed && (
          <div
            className="mx-3 mt-4 mb-3 px-3 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.04) 100%)", border: `1px solid ${PURPLE_BORDER}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 10px rgba(168,85,247,0.4)" }}>
                <ShieldCheck size={13} style={{ color: "white" }} />
              </div>
              <div>
                <div style={{ color: "white", fontSize: "0.78rem", fontWeight: 600 }}>Ahmad</div>
                <div style={{ color: PURPLE, fontSize: "0.63rem", fontWeight: 600 }}>Validator · Rank #12</div>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map(({ id, label, icon: Icon, path, badge }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                style={{
                  backgroundColor: isActive ? PURPLE_DIM : "transparent",
                  border: isActive ? `1px solid ${PURPLE_BORDER}` : "1px solid transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? label : undefined}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                    style={{ backgroundColor: PURPLE, boxShadow: "0 0 8px rgba(168,85,247,0.8)" }}
                  />
                )}
                <Icon
                  size={17}
                  style={{ color: isActive ? PURPLE : "#475569", filter: isActive ? "drop-shadow(0 0 5px rgba(168,85,247,0.6))" : "none", flexShrink: 0 }}
                />
                {!collapsed && (
                  <span style={{ color: isActive ? PURPLE : "#475569", fontSize: "0.85rem", fontWeight: isActive ? 600 : 400 }}>
                    {label}
                  </span>
                )}
                {badge !== null && !collapsed && (
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: "rgba(168,85,247,0.15)", color: PURPLE, fontSize: "0.62rem", fontWeight: 700, border: `1px solid rgba(168,85,247,0.25)` }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Network status card */}
        <div
          className="p-3 m-3 rounded-xl"
          style={{ backgroundColor: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.12)" }}
        >
          {collapsed ? (
            <div className="flex justify-center"><ShieldCheck size={14} style={{ color: PURPLE }} /></div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <ShieldCheck size={11} style={{ color: PURPLE }} />
                <span style={{ color: PURPLE, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.08em" }}>VALIDATOR STATUS</span>
              </div>
              {[
                { k: "Subnet UID",    v: "42" },
                { k: "Validators",   v: "64" },
                { k: "My UID",       v: "12" },
                { k: "Trust Score",  v: "0.974" },
                { k: "Vtrust",       v: "0.961" },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-center justify-between mt-1.5">
                  <span style={{ color: "#334155", fontSize: "0.68rem" }}>{k}</span>
                  <span style={{ color: "#64748b", fontSize: "0.68rem", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main
        className="relative transition-all duration-300"
        style={{ marginLeft: `${w}px`, marginTop: "64px", padding: "24px", minHeight: "calc(100vh - 64px)", zIndex: 10 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
