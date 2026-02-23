import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  History,
  Settings,
  ChevronRight,
  Zap,
  Cpu,
  ShieldCheck,
  Globe,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
  { id: "requests", label: "My Requests", icon: ClipboardList, path: "/requests" },
  { id: "history", label: "History", icon: History, path: "/history" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

export function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = collapsed ? 70 : 220;

  const getActive = () => {
    const match = navItems.find(n => {
      if (n.path === "/") return location.pathname === "/";
      return location.pathname.startsWith(n.path);
    });
    return match?.id ?? "dashboard";
  };
  const active = getActive();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#0f172a",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(56,189,248,0.055) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          zIndex: 0,
        }}
      />
      {/* Ambient glows */}
      <div className="fixed pointer-events-none" style={{ top: "10%", left: "20%", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "20%", right: "10%", width: "500px", height: "400px", background: "radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)", zIndex: 0 }} />

      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 50 }}>
        <Navbar />
      </div>

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300 z-40"
        style={{
          width: `${sidebarWidth}px`,
          backgroundColor: "#0d1b2e",
          borderRight: "1px solid rgba(56,189,248,0.1)",
        }}
      >
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(56,189,248,0.3)",
            color: "#38bdf8",
          }}
        >
          <ChevronRight
            size={12}
            style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }}
          />
        </button>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 mt-4 flex-1">
          {navItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
                style={{
                  backgroundColor: isActive ? "rgba(56,189,248,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent",
                  color: isActive ? "#38bdf8" : "#64748b",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? label : undefined}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 8px rgba(56,189,248,0.8)" }}
                  />
                )}
                <Icon
                  size={19}
                  style={{
                    color: isActive ? "#38bdf8" : "#64748b",
                    flexShrink: 0,
                    filter: isActive ? "drop-shadow(0 0 6px rgba(56,189,248,0.6))" : "none",
                    transition: "all 0.2s",
                  }}
                />
                {!collapsed && (
                  <span style={{ fontSize: "0.88rem", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                )}
                {collapsed && (
                  <div
                    className="absolute left-full ml-3 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                    style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.2)", color: "white", fontSize: "0.8rem" }}
                  >
                    {label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Miner Portal CTA */}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {/* Landing Page link */}
            <button
              onClick={() => navigate("/landing")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full group mb-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.04) 100%)",
                border: "1px solid rgba(56,189,248,0.18)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? "Landing Page" : undefined}
            >
              <Globe
                size={17}
                style={{ color: "#38bdf8", filter: "drop-shadow(0 0 5px rgba(56,189,248,0.5))", flexShrink: 0 }}
              />
              {!collapsed && (
                <span style={{ color: "#38bdf8", fontSize: "0.86rem", fontWeight: 600 }}>
                  Landing Page
                </span>
              )}
              {collapsed && (
                <div
                  className="absolute left-full ml-3 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                  style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontSize: "0.8rem" }}
                >
                  Landing Page
                </div>
              )}
            </button>

            <button
              onClick={() => navigate("/miner")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full group"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)",
                border: "1px solid rgba(245,158,11,0.22)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? "Miner Portal" : undefined}
            >
              <Cpu
                size={17}
                style={{
                  color: "#f59e0b",
                  filter: "drop-shadow(0 0 5px rgba(245,158,11,0.5))",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <span style={{ color: "#f59e0b", fontSize: "0.86rem", fontWeight: 600 }}>
                  Miner Portal
                </span>
              )}
              {collapsed && (
                <div
                  className="absolute left-full ml-3 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                  style={{ backgroundColor: "#1e293b", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontSize: "0.8rem" }}
                >
                  Miner Portal
                </div>
              )}
            </button>

            {/* Validator Portal CTA */}
            <button
              onClick={() => navigate("/validator")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full group mt-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)",
                border: "1px solid rgba(168,85,247,0.22)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? "Validator Portal" : undefined}
            >
              <ShieldCheck
                size={17}
                style={{
                  color: "#a855f7",
                  filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <span style={{ color: "#a855f7", fontSize: "0.86rem", fontWeight: 600 }}>
                  Validator Portal
                </span>
              )}
              {collapsed && (
                <div
                  className="absolute left-full ml-3 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                  style={{ backgroundColor: "#1e293b", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", fontSize: "0.8rem" }}
                >
                  Validator Portal
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* Network status */}
        <div
          className="p-3 m-3 rounded-xl"
          style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          {collapsed ? (
            <div className="flex justify-center">
              <Zap size={16} style={{ color: "#38bdf8" }} />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} style={{ color: "#38bdf8" }} />
                <span style={{ color: "#38bdf8", fontSize: "0.75rem", fontWeight: 600 }}>NETWORK</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
                  <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 600 }}>Live</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Validators</span>
                <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>128</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Block</span>
                <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>#4,821,093</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Page content */}
      <main
        className="relative transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginTop: "64px",
          padding: "28px",
          minHeight: "calc(100vh - 64px)",
          zIndex: 10,
        }}
      >
        <Outlet />

        {/* Footer */}
        <div
          className="flex items-center justify-between py-4 mt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span style={{ color: "#334155", fontSize: "0.75rem" }}>
            © 2026 DataVerify Subnet · Powered by Bittensor
          </span>
          <div className="flex items-center gap-4">
            {["Docs", "API", "Discord", "Status"].map((link) => (
              <button key={link} style={{ color: "#334155", fontSize: "0.75rem" }} className="hover:text-cyan-400 transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}