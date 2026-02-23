import { Zap, Twitter, Github, MessageCircle, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  {
    label: "Product",
    links: [
      { name: "How It Works", href: "#solution" },
      { name: "Marketplace",  href: "#marketplace" },
      { name: "Quality Standards", href: "#marketplace" },
      { name: "Pricing",      href: "#" },
    ],
  },
  {
    label: "For Miners",
    links: [
      { name: "Getting Started", href: "#miners" },
      { name: "Submit Dataset",  href: "#miners" },
      { name: "Earnings Guide",  href: "#miners" },
      { name: "Leaderboard",     href: "#" },
    ],
  },
  {
    label: "For Validators",
    links: [
      { name: "Getting Started", href: "#validators" },
      { name: "Stake TAO",       href: "#validators" },
      { name: "Evaluations",     href: "#validators" },
      { name: "Rewards",         href: "#validators" },
    ],
  },
  {
    label: "Resources",
    links: [
      { name: "Documentation",  href: "#" },
      { name: "Whitepaper",     href: "#" },
      { name: "GitHub",         href: "#" },
      { name: "Discord",        href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter,       label: "Twitter / X", href: "#" },
  { icon: Github,        label: "GitHub",       href: "#" },
  { icon: MessageCircle, label: "Discord",      href: "#" },
];

export function FooterSection() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      style={{
        backgroundColor: "#020617",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "64px 24px 0",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(4, 1fr)",
            gap: "32px",
            marginBottom: "56px",
          }}
        >
          {/* Brand col */}
          <div>
            <button
              onClick={scrollTop}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "none", border: "none", cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px", height: "32px", borderRadius: "9px",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 12px rgba(56,189,248,0.35)",
                }}
              >
                <Zap size={16} color="white" />
              </div>
              <span style={{ color: "white", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                DataVerify
              </span>
            </button>

            <p style={{ color: "#334155", fontSize: "0.84rem", lineHeight: 1.7, maxWidth: "240px", marginBottom: "20px" }}>
              The first decentralized quality standard for AI training data. Built on Bittensor.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  style={{
                    width: "36px", height: "36px", borderRadius: "9px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#475569", textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.color = "#38bdf8"; t.style.borderColor = "rgba(56,189,248,0.3)"; t.style.backgroundColor = "rgba(56,189,248,0.06)"; }}
                  onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.color = "#475569"; t.style.borderColor = "rgba(255,255,255,0.07)"; t.style.backgroundColor = "rgba(255,255,255,0.04)"; }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(col => (
            <div key={col.label}>
              <h4
                style={{
                  color: "#94a3b8", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {col.label}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      style={{
                        color: "#475569", fontSize: "0.84rem",
                        textDecoration: "none", transition: "color 0.2s",
                        display: "inline-flex", alignItems: "center", gap: "4px",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "24px" }} />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingBottom: "28px",
            flexWrap: "wrap", gap: "12px",
          }}
        >
          <p style={{ color: "#334155", fontSize: "0.78rem" }}>
            © 2026 DataVerify Subnet. Built on Bittensor.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <a
                key={l}
                href="#"
                style={{ color: "#334155", fontSize: "0.76rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#475569", fontSize: "0.76rem",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.color = "#94a3b8"; t.style.borderColor = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.color = "#475569"; t.style.borderColor = "rgba(255,255,255,0.07)"; }}
          >
            <ArrowUpRight size={13} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
