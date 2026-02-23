import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Zap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How It Works", href: "#solution" },
  { label: "Marketplace",  href: "#marketplace" },
  { label: "Miners",       href: "#miners" },
  { label: "Validators",   href: "#validators" },
  { label: "Docs",         href: "#roadmap" },
];

export function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(15,23,42,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 24px",
          height: "68px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer" }}
        >
          <div
            style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(56,189,248,0.4)",
            }}
          >
            <Zap size={18} color="white" />
          </div>
          <span style={{ color: "white", fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            DataVerify
          </span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <button
              key={l.label}
              onClick={() => handleNav(l.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94a3b8", fontSize: "0.88rem", fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "9px 20px", borderRadius: "10px",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              color: "#0a1628", fontSize: "0.86rem", fontWeight: 700,
              border: "none", cursor: "pointer",
              boxShadow: "0 0 20px rgba(56,189,248,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(56,189,248,0.6)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(56,189,248,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Launch App →
          </button>
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute", top: "68px", left: 0, right: 0,
            backgroundColor: "rgba(15,23,42,0.97)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 24px 24px",
            display: "flex", flexDirection: "column", gap: "4px",
          }}
        >
          {NAV_LINKS.map(l => (
            <button
              key={l.label}
              onClick={() => handleNav(l.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94a3b8", fontSize: "0.95rem", fontWeight: 500,
                textAlign: "left", padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
