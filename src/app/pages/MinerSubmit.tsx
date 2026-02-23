import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, Sparkles } from "lucide-react";
import { WizardProgress } from "../components/miner/submit/WizardProgress";
import { Step1DatasetInfo } from "../components/miner/submit/Step1DatasetInfo";
import { Step2TechnicalSpecs } from "../components/miner/submit/Step2TechnicalSpecs";
import { Step3PrivacySettings } from "../components/miner/submit/Step3PrivacySettings";
import { Step4Review } from "../components/miner/submit/Step4Review";
import { DEFAULT_FORM } from "../components/miner/submit/types";
import type { FormData } from "../components/miner/submit/types";

const STEP_META = [
  { n: 1, title: "Dataset Info",     sub: "Basic information",    color: "#38bdf8" },
  { n: 2, title: "Technical Specs",  sub: "Schema & evaluation",  color: "#a78bfa" },
  { n: 3, title: "Privacy Settings", sub: "DP & anonymisation",   color: "#22c55e" },
  { n: 4, title: "Review & Submit",  sub: "Sign on-chain",        color: "#f59e0b" },
];

export function MinerSubmit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const patch = (p: Partial<FormData>) => setForm(f => ({ ...f, ...p }));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2400)); // simulate tx
    setSubmitting(false);
    setSubmitted(true);
  };

  const meta = STEP_META[step - 1];

  // ── Success screen ──────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.08) 100%)",
            border: "1px solid rgba(34,197,94,0.35)",
            boxShadow: "0 0 40px rgba(34,197,94,0.2)",
          }}
        >
          <CheckCircle2 size={42} style={{ color: "#22c55e" }} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} style={{ color: "#f59e0b" }} />
          <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>SUBMITTED SUCCESSFULLY</span>
        </div>
        <h2 style={{ color: "white", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>
          Dataset Submitted to Chain
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "8px", maxWidth: "380px", textAlign: "center", lineHeight: 1.6 }}>
          Your dataset <strong style={{ color: "#94a3b8" }}>{form.datasetName || "DS-XXXX"}</strong> has been broadcast to the Bittensor network and is now in the verification queue.
        </p>

        <div
          className="mt-6 px-5 py-4 rounded-2xl flex flex-col gap-2.5 w-80"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { k: "Transaction Hash", v: "0x3f7a…b2e9", mono: true },
            { k: "Dataset ID", v: "DS-4922", mono: true },
            { k: "Status", v: "In Review", status: "review" },
            { k: "Est. Verification", v: "~24–48 hours" },
          ].map(({ k, v, mono, status }) => (
            <div key={k} className="flex items-center justify-between">
              <span style={{ color: "#475569", fontSize: "0.75rem" }}>{k}</span>
              <span style={{
                color: status === "review" ? "#f59e0b" : "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 600,
                fontFamily: mono ? "monospace" : "inherit",
              }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm(DEFAULT_FORM); }}
            className="px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "0.86rem" }}
          >
            Submit Another
          </button>
          <button
            onClick={() => navigate("/miner")}
            className="px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              fontSize: "0.86rem",
              fontWeight: 700,
              boxShadow: "0 0 20px rgba(34,197,94,0.3)",
            }}
          >
            View Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate("/miner")}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: "#475569", fontSize: "0.75rem" }}
            >
              <ArrowLeft size={12} />
              Dashboard
            </button>
            <span style={{ color: "#1e3a5f" }}>/</span>
            <span style={{ color: "#38bdf8", fontSize: "0.75rem" }}>Submit Dataset</span>
          </div>
          <h1 style={{ color: "white", fontSize: "1.55rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Submit New{" "}
            <span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dataset
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: "0.85rem", marginTop: "4px" }}>
            Step {step} of 4 · {meta.title} — {meta.sub}
          </p>
        </div>

        {/* Upload icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${meta.color}20 0%, ${meta.color}08 100%)`,
            border: `1px solid ${meta.color}35`,
          }}
        >
          <Upload size={20} style={{ color: meta.color }} />
        </div>
      </div>

      {/* Wizard progress bar */}
      <div
        className="px-6 py-5 rounded-2xl mb-5"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <WizardProgress current={step} />
      </div>

      {/* Form card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Card header */}
        <div
          className="px-7 py-5 flex items-center justify-between"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: `linear-gradient(135deg, ${meta.color}08 0%, transparent 100%)`,
          }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className="px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${meta.color}15`,
                  border: `1px solid ${meta.color}35`,
                }}
              >
                <span style={{ color: meta.color, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                  STEP {step} / 4
                </span>
              </div>
              <span style={{ color: "#334155", fontSize: "0.72rem" }}>·</span>
              <span style={{ color: "#64748b", fontSize: "0.72rem" }}>{meta.sub}</span>
            </div>
            <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>{meta.title}</h2>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEP_META.map(({ n, color }) => (
              <div
                key={n}
                className="rounded-full transition-all duration-300"
                style={{
                  width: n === step ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: n < step ? "#22c55e" : n === step ? color : "rgba(255,255,255,0.08)",
                  boxShadow: n === step ? `0 0 8px ${color}80` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="px-7 py-7">
          {step === 1 && <Step1DatasetInfo data={form} onChange={patch} />}
          {step === 2 && <Step2TechnicalSpecs data={form} onChange={patch} />}
          {step === 3 && <Step3PrivacySettings data={form} onChange={patch} />}
          {step === 4 && <Step4Review data={form} onChange={patch} onSubmit={handleSubmit} submitting={submitting} />}
        </div>

        {/* Footer nav */}
        {step < 4 && (
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.08)" }}
          >
            <button
              onClick={() => step === 1 ? navigate("/miner") : setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#64748b",
                fontSize: "0.86rem",
              }}
            >
              <ArrowLeft size={15} />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <div className="flex items-center gap-3">
              {/* progress micro-bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(step / 4) * 100}%`,
                      background: `linear-gradient(90deg, ${meta.color}, ${STEP_META[Math.min(step, 3)].color})`,
                    }}
                  />
                </div>
                <span style={{ color: "#334155", fontSize: "0.7rem" }}>{step}/4</span>
              </div>

              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                  color: "#0a1628",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  boxShadow: `0 0 20px ${meta.color}40`,
                }}
              >
                {step === 3 ? "Review →" : `Next: ${STEP_META[step].title} →`}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-xl mt-4"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
        <span style={{ color: "#334155", fontSize: "0.72rem" }}>
          All fields marked with <span style={{ color: "#38bdf8" }}>*</span> are required. Your form is auto-saved locally as you type.
        </span>
        <span style={{ color: "#1e3a5f", marginLeft: "auto", fontSize: "0.72rem" }}>DataVerify Subnet · UID 42</span>
      </div>
    </div>
  );
}
