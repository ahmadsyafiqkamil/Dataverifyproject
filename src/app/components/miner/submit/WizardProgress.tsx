import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Dataset Info",      sub: "Basic information"      },
  { n: 2, label: "Technical Specs",   sub: "Schema & evaluation"    },
  { n: 3, label: "Privacy Settings",  sub: "DP & anonymisation"     },
  { n: 4, label: "Review & Submit",   sub: "Sign on-chain"          },
];

export function WizardProgress({ current }: { current: number }) {
  return (
    <div className="relative flex items-start justify-between w-full">
      {/* connecting track */}
      <div
        className="absolute top-5 left-0 right-0 h-px"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", zIndex: 0 }}
      />
      {/* filled track */}
      <div
        className="absolute top-5 left-0 h-px transition-all duration-700"
        style={{
          width: `${((current - 1) / (STEPS.length - 1)) * 100}%`,
          background: "linear-gradient(90deg, #22c55e, #38bdf8)",
          boxShadow: "0 0 8px rgba(56,189,248,0.5)",
          zIndex: 1,
        }}
      />

      {STEPS.map(({ n, label, sub }) => {
        const done   = n < current;
        const active = n === current;
        const future = n > current;

        return (
          <div key={n} className="relative z-10 flex flex-col items-center gap-2" style={{ flex: 1 }}>
            {/* circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: done
                  ? "rgba(34,197,94,0.15)"
                  : active
                  ? "rgba(56,189,248,0.15)"
                  : "rgba(255,255,255,0.04)",
                border: done
                  ? "2px solid #22c55e"
                  : active
                  ? "2px solid #38bdf8"
                  : "2px solid rgba(255,255,255,0.1)",
                boxShadow: active
                  ? "0 0 0 4px rgba(56,189,248,0.12), 0 0 18px rgba(56,189,248,0.25)"
                  : done
                  ? "0 0 12px rgba(34,197,94,0.2)"
                  : "none",
              }}
            >
              {done ? (
                <Check size={16} style={{ color: "#22c55e" }} strokeWidth={2.5} />
              ) : (
                <span
                  style={{
                    color: active ? "#38bdf8" : "#334155",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {n}
                </span>
              )}
            </div>

            {/* labels */}
            <div className="text-center">
              <div
                style={{
                  color: done ? "#22c55e" : active ? "white" : "#334155",
                  fontSize: "0.8rem",
                  fontWeight: active ? 700 : 500,
                  transition: "color 0.3s",
                }}
              >
                {label}
              </div>
              <div style={{ color: future ? "#1e3a5f" : "#475569", fontSize: "0.68rem", marginTop: "2px" }}>
                {sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
