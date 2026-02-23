import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  History,
  Settings,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "requests", label: "My Requests", icon: ClipboardList },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [active, setActive] = useState("dashboard");

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300 z-40"
      style={{
        width: collapsed ? "70px" : "220px",
        backgroundColor: "#0d1b2e",
        borderRight: "1px solid rgba(56,189,248,0.1)",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
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
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
              style={{
                backgroundColor: isActive ? "rgba(56,189,248,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent",
                color: isActive ? "#38bdf8" : "#64748b",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? label : undefined}
            >
              {/* Active glow indicator */}
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

              {/* Tooltip for collapsed state */}
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
      </nav>

      {/* Bottom: Network status */}
      <div
        className="p-3 m-3 rounded-xl"
        style={{
          backgroundColor: "rgba(56,189,248,0.06)",
          border: "1px solid rgba(56,189,248,0.15)",
        }}
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
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }}
                />
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
  );
}
