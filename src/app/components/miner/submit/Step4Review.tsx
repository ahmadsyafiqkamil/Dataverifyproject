import { useState, type ReactNode } from "react";
import {
  Database, Settings, Shield, CheckCircle2,
  ExternalLink, Wallet, Zap, Clock, AlertCircle,
  FileJson, Lock,
} from "lucide-react";
import { Checkbox } from "./FormPrimitives";
import type { FormData } from "./types";

function ReviewSection({ icon, title, color, items }: {
  icon: ReactNode; title: string; color: string;
  items: { k: string; v: string | boolean | null; highlight?: boolean }[];
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}
      >
        <span style={{ color }}>{icon}</span>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontWeight: 700 }}>{title}</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {items.map(({ k, v }) => (
          <div key={k}>
            <div style={{ color: "#475569", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>{k}</div>
            <div
              style={{
                color: v === null || v === "" ? "#334155" : typeof v === "boolean" ? (v ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.85)",
                fontSize: "0.82rem",
                fontWeight: 500,
                fontFamily: k.toLowerCase().includes("id") ? "monospace" : "inherit",
              }}
            >
              {v === null || v === "" ? "—"
                : typeof v === "boolean" ? (v ? "✓ Enabled" : "✗ Disabled")
                : String(v)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardEstimate({ data }: { data: FormData }) {
  const base = Math.min(50, Math.floor(parseInt(data.datasetSize || "0") / 5000));
  const metrics = data.evaluationMetrics.length >= 3 ? data.evaluationMetrics.length * 0.8 : 0;
  const schema = data.schemaFile ? 2 : 0;
  const privacy = (data.differentialPrivacy ? 8 : 0) + (data.piiScan ? 4 : 0) + (data.adversarialTesting ? 4 : 0);
  const total = base + metrics + schema + privacy;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(56,189,248,0.05) 100%)",
        border: "1px solid rgba(34,197,94,0.2)",
      }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} style={{ color: "#f59e0b" }} />
          <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>ESTIMATED REWARD BREAKDOWN</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { k: "Dataset size bonus", v: `${base.toFixed(1)} TAO`, color: "#38bdf8" },
            { k: "Evaluation metrics", v: `${metrics.toFixed(1)} TAO`, color: "#38bdf8" },
            { k: "Schema provided", v: `${schema.toFixed(1)} TAO`, color: "#a78bfa" },
            { k: "Privacy stack", v: `${privacy.toFixed(1)} TAO`, color: "#22c55e" },
          ].map(({ k, v, color }) => (
            <div key={k} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "#475569", fontSize: "0.73rem" }}>{k}</span>
              <span style={{ color, fontSize: "0.78rem", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.72rem" }}>Total estimated reward</div>
            <div style={{ color: "#475569", fontSize: "0.65rem" }}>Paid upon verification · subject to score</div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span style={{ color: "#22c55e", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", textShadow: "0 0 20px rgba(34,197,94,0.5)" }}>
              ~{total.toFixed(1)}
            </span>
            <span style={{ color: "#22c55e", fontSize: "0.9rem", fontWeight: 600 }}>TAO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Step4Review({ data, onChange, onSubmit, submitting }: {
  data: FormData;
  onChange: (p: Partial<FormData>) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [signed, setSigned] = useState(false);
  const canSubmit = data.agreedToTerms && data.agreedToDataPolicy && signed;

  const txHash = "0x3f7a...b2e9"; // mock

  return (
    <div className="flex flex-col gap-5">
      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-4">
        <ReviewSection
          icon={<Database size={14} />} title="Dataset Info" color="#38bdf8"
          items={[
            { k: "Name", v: data.datasetName || null },
            { k: "Domain", v: data.domain || null },
            { k: "Data Type", v: data.dataType },
            { k: "Size", v: data.datasetSize ? `${parseInt(data.datasetSize).toLocaleString()} records` : null },
            { k: "Generation Method", v: data.generationMethod || null },
            { k: "Use Case", v: data.intendedUseCase || null },
          ]}
        />
        <ReviewSection
          icon={<Settings size={14} />} title="Technical Specs" color="#a78bfa"
          items={[
            { k: "Features", v: data.featureCount ? `${data.featureCount} columns` : null },
            { k: "Target columns", v: data.targetColumns || "Unsupervised" },
            { k: "Train/test split", v: `${data.trainTestSplit}% / ${100 - data.trainTestSplit}%` },
            { k: "Missing values", v: data.missingValueStrategy || null },
            { k: "Normalization", v: data.normalization || null },
            { k: "Eval metrics", v: data.evaluationMetrics.length ? `${data.evaluationMetrics.length} selected` : null },
          ]}
        />
        <ReviewSection
          icon={<Shield size={14} />} title="Privacy Settings" color="#22c55e"
          items={[
            { k: "Differential privacy", v: data.differentialPrivacy },
            { k: "Epsilon (ε)", v: data.differentialPrivacy ? `ε = ${data.epsilon.toFixed(1)}` : null },
            { k: "k-Anonymity", v: `k = ${data.kAnonymity}` },
            { k: "ℓ-Diversity", v: data.lDiversity },
            { k: "PII scan", v: data.piiScan },
            { k: "MIA test", v: data.membershipInference },
          ]}
        />

        {/* Submission metadata */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <Lock size={14} style={{ color: "#f59e0b" }} />
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontWeight: 700 }}>On-Chain Metadata</span>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2.5">
            {[
              { icon: <Wallet size={12} />, k: "Submitter", v: "5GrwvaEF…8PH3", color: "#38bdf8" },
              { icon: <Clock size={12} />, k: "Timestamp", v: "Feb 23, 2026 · 14:32 UTC", color: "#94a3b8" },
              { icon: <Database size={12} />, k: "Subnet", v: "DataVerify — UID 42", color: "#94a3b8" },
              { icon: <Zap size={12} />, k: "Gas estimate", v: "~0.001 TAO", color: "#f59e0b" },
              { icon: <FileJson size={12} />, k: "IPFS / CID", v: "Will be assigned on-chain", color: "#334155" },
              { icon: <ExternalLink size={12} />, k: "Public listing", v: data.publicListing ? "Yes" : "No", color: data.publicListing ? "#22c55e" : "#ef4444" },
            ].map(({ icon, k, v, color }) => (
              <div key={k} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ color: "#334155" }}>{icon}</span>
                  <span style={{ color: "#475569", fontSize: "0.72rem" }}>{k}</span>
                </div>
                <span style={{ color, fontSize: "0.75rem", fontWeight: 600, fontFamily: k === "Submitter" ? "monospace" : "inherit" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reward estimate */}
      <RewardEstimate data={data} />

      {/* Agreements */}
      <div className="flex flex-col gap-3 px-5 py-4 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Agreements Required</div>
        <Checkbox
          checked={data.agreedToTerms}
          onChange={v => onChange({ agreedToTerms: v })}
          label={
            <span>
              I agree to the <span style={{ color: "#38bdf8", textDecoration: "underline", cursor: "pointer" }}>DataVerify Subnet Terms of Service</span> and confirm this dataset was generated synthetically without including real personal data.
            </span>
          }
        />
        <Checkbox
          checked={data.agreedToDataPolicy}
          onChange={v => onChange({ agreedToDataPolicy: v })}
          label={
            <span>
              I acknowledge the <span style={{ color: "#38bdf8", textDecoration: "underline", cursor: "pointer" }}>Data Quality & Privacy Policy</span>. Misrepresentation may result in stake slashing and permanent miner ban.
            </span>
          }
        />
      </div>

      {/* Wallet signature */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all"
        style={{
          background: signed
            ? "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.04) 100%)"
            : "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)",
          border: `1px solid ${signed ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.2)"}`,
        }}
        onClick={() => setSigned(s => !s)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: signed ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.08)", border: `1px solid ${signed ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.2)"}` }}
          >
            {signed ? <CheckCircle2 size={18} style={{ color: "#22c55e" }} /> : <Wallet size={18} style={{ color: "#f59e0b" }} />}
          </div>
          <div>
            <div style={{ color: signed ? "#22c55e" : "rgba(255,255,255,0.85)", fontSize: "0.88rem", fontWeight: 700 }}>
              {signed ? "Wallet Signed ✓" : "Sign with Wallet"}
            </div>
            <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "2px" }}>
              {signed ? `Signature: ${txHash}` : "5GrwvaEF…8PH3 · Bittensor network"}
            </div>
          </div>
        </div>
        {!signed && (
          <div
            className="px-4 py-2 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#0a1628",
              fontSize: "0.8rem",
              fontWeight: 700,
              boxShadow: "0 0 16px rgba(245,158,11,0.3)",
            }}
          >
            Sign →
          </div>
        )}
      </div>

      {/* Missing fields warning */}
      {(!data.datasetName || !data.domain || !data.generationMethod) && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.5 }}>
            Required fields are missing: {[!data.datasetName && "Dataset Name", !data.domain && "Domain", !data.generationMethod && "Generation Method"].filter(Boolean).join(", ")}.
            Go back and complete all required fields before submitting.
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
        style={{
          background: canSubmit
            ? "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)"
            : "rgba(255,255,255,0.04)",
          color: canSubmit ? "#0a1628" : "#334155",
          fontSize: "0.95rem",
          fontWeight: 700,
          boxShadow: canSubmit ? "0 0 32px rgba(56,189,248,0.35)" : "none",
          cursor: canSubmit ? "pointer" : "not-allowed",
          border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(10,22,40,0.3) rgba(10,22,40,0.3) rgba(10,22,40,0.3) #0a1628" }} />
            Broadcasting to Bittensor network…
          </>
        ) : (
          <>
            <Zap size={18} />
            Submit Dataset to DataVerify Subnet
          </>
        )}
      </button>
    </div>
  );
}

import type React from "react";