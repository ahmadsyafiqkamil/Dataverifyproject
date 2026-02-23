import { type ReactNode } from "react";
import { Shield, AlertTriangle, Info, Lock, Eye, Zap } from "lucide-react";
import { Label, FieldHint, ToggleSwitch, SliderInput, Select } from "./FormPrimitives";
import type { FormData } from "./types";

function SectionCard({ icon, title, color, children }: {
  icon: ReactNode; title: string; color: string; children: ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}>
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", fontWeight: 700 }}>{title}</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

function RiskMeter({ epsilon }: { epsilon: number }) {
  const risk = epsilon <= 0.5 ? "Very High" : epsilon <= 1 ? "High" : epsilon <= 3 ? "Medium" : epsilon <= 7 ? "Low" : "Very Low";
  const riskColor = epsilon <= 0.5 ? "#22c55e" : epsilon <= 1 ? "#34d399" : epsilon <= 3 ? "#f59e0b" : epsilon <= 7 ? "#fb923c" : "#ef4444";
  const pct = Math.min(100, (epsilon / 10) * 100);
  return (
    <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: "#64748b", fontSize: "0.74rem" }}>Privacy Protection Level</span>
        <span style={{ color: riskColor, fontSize: "0.74rem", fontWeight: 700 }}>{risk}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)", opacity: 0.3 }}>
      </div>
      <div className="relative h-2 rounded-full -mt-2" style={{ backgroundColor: "transparent" }}>
        <div
          className="absolute top-0 h-full w-3 h-3 rounded-full -translate-y-0 border-2"
          style={{ left: `calc(${pct}% - 6px)`, backgroundColor: riskColor, borderColor: "#0f172a", boxShadow: `0 0 8px ${riskColor}80`, width: "12px", height: "12px", top: "-5px" }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span style={{ color: "#22c55e", fontSize: "0.62rem" }}>ε = 0 · Perfect privacy</span>
        <span style={{ color: "#ef4444", fontSize: "0.62rem" }}>ε = 10 · Low privacy</span>
      </div>
    </div>
  );
}

import type React from "react";

export function Step3PrivacySettings({ data, onChange }: { data: FormData; onChange: (p: Partial<FormData>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

      {/* ── LEFT ── */}
      <div className="flex flex-col gap-4">

        {/* Differential Privacy */}
        <SectionCard icon={<Shield size={15} />} title="Differential Privacy (DP)" color="#38bdf8">
          <ToggleSwitch
            checked={data.differentialPrivacy}
            onChange={v => onChange({ differentialPrivacy: v })}
            label="Enable Differential Privacy"
            sub="Adds calibrated noise to protect individual records"
            accentColor="#38bdf8"
          />

          {data.differentialPrivacy && (
            <div className="flex flex-col gap-4 mt-1">
              <SliderInput
                label="Epsilon (ε) — Privacy budget"
                value={data.epsilon}
                min={0.1} max={10} step={0.1}
                accentColor="#38bdf8"
                onChange={v => onChange({ epsilon: v })}
                formatValue={v => `ε = ${v.toFixed(1)}`}
              />
              <RiskMeter epsilon={data.epsilon} />
              <SliderInput
                label="Delta (δ) — Failure probability × 10⁻ˢ"
                value={data.delta}
                min={1} max={8} step={1}
                accentColor="#a78bfa"
                onChange={v => onChange({ delta: v })}
                formatValue={v => `δ = 10⁻${v}`}
              />
              <FieldHint>
                Standard recommendation: ε ≤ 1.0, δ = 10⁻⁵. Lower ε = stronger privacy guarantee but higher utility loss.
              </FieldHint>
            </div>
          )}
        </SectionCard>

        {/* Anonymisation */}
        <SectionCard icon={<Lock size={15} />} title="Statistical Anonymisation" color="#a78bfa">
          <div>
            <Label>k-Anonymity Level</Label>
            <SliderInput
              label=""
              value={data.kAnonymity}
              min={2} max={20} step={1}
              accentColor="#a78bfa"
              onChange={v => onChange({ kAnonymity: v })}
              formatValue={v => `k = ${v}`}
            />
            <FieldHint>Each record is indistinguishable from at least k-1 others. k ≥ 5 recommended.</FieldHint>
          </div>

          <ToggleSwitch
            checked={data.lDiversity}
            onChange={v => onChange({ lDiversity: v })}
            label="ℓ-Diversity"
            sub="Ensures each equivalence class has ≥ ℓ distinct sensitive values"
            accentColor="#a78bfa"
          />

          <ToggleSwitch
            checked={data.tCloseness}
            onChange={v => onChange({ tCloseness: v })}
            label="t-Closeness"
            sub="Distribution of sensitive attributes ≈ overall distribution"
            accentColor="#a78bfa"
          />
        </SectionCard>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex flex-col gap-4">

        {/* Scanning & Testing */}
        <SectionCard icon={<Eye size={15} />} title="Scanning & Attack Testing" color="#f59e0b">
          <ToggleSwitch
            checked={data.piiScan}
            onChange={v => onChange({ piiScan: v })}
            label="PII Detection Scan"
            sub="Automated scan for names, emails, IDs, and biometric proxies"
            accentColor="#f59e0b"
          />

          <ToggleSwitch
            checked={data.adversarialTesting}
            onChange={v => onChange({ adversarialTesting: v })}
            label="Adversarial Robustness Test"
            sub="Black-box probing for model inversion and re-identification risk"
            accentColor="#f59e0b"
          />

          <ToggleSwitch
            checked={data.membershipInference}
            onChange={v => onChange({ membershipInference: v })}
            label="Membership Inference Attack Test"
            sub="Measures probability of inferring training data membership"
            accentColor="#f59e0b"
          />
        </SectionCard>

        {/* Synthetic Guarantee */}
        <SectionCard icon={<Zap size={15} />} title="Synthetic Data Guarantee" color="#22c55e">
          <div>
            <Label required>Guarantee Type</Label>
            <Select value={data.syntheticGuarantee} onChange={e => onChange({ syntheticGuarantee: e.target.value })}>
              <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select guarantee…</option>
              {[
                { v: "no_real",       l: "No real records included" },
                { v: "post_hoc",      l: "Post-hoc privacy audit passed" },
                { v: "dp_certified",  l: "DP-certified (formal guarantee)" },
                { v: "synthetic_only",l: "100% synthetically generated" },
                { v: "hybrid",        l: "Hybrid (synthetic + aggregated real)" },
              ].map(({ v, l }) => (
                <option key={v} value={v} style={{ backgroundColor: "#0b1628", color: "white" }}>{l}</option>
              ))}
            </Select>
            <FieldHint>Legal & compliance-facing guarantee for downstream data buyers.</FieldHint>
          </div>
        </SectionCard>

        {/* Privacy score preview */}
        <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(34,197,94,0.1)" }}>
            <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>ESTIMATED PRIVACY SCORE</span>
          </div>
          <div className="px-4 py-3">
            {[
              { k: "Differential privacy", pts: data.differentialPrivacy ? (data.epsilon <= 1 ? 35 : data.epsilon <= 3 ? 25 : 15) : 0, max: 35 },
              { k: "k-Anonymity (k=" + data.kAnonymity + ")", pts: Math.min(20, data.kAnonymity * 2), max: 20 },
              { k: "ℓ-Diversity", pts: data.lDiversity ? 10 : 0, max: 10 },
              { k: "PII scan", pts: data.piiScan ? 15 : 0, max: 15 },
              { k: "Adversarial test", pts: data.adversarialTesting ? 15 : 0, max: 15 },
              { k: "MIA test", pts: data.membershipInference ? 5 : 0, max: 5 },
            ].map(({ k, pts, max }) => (
              <div key={k} className="flex items-center gap-3 mb-2">
                <div className="w-24 shrink-0" style={{ color: "#475569", fontSize: "0.68rem" }}>{k}</div>
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(pts / max) * 100}%`, backgroundColor: pts === max ? "#22c55e" : pts > 0 ? "#f59e0b" : "#ef4444", opacity: 0.8 }} />
                </div>
                <span style={{ color: pts === max ? "#22c55e" : pts > 0 ? "#f59e0b" : "#475569", fontSize: "0.68rem", fontWeight: 700, width: "40px", textAlign: "right" }}>
                  {pts}/{max}
                </span>
              </div>
            ))}
            <div className="pt-2 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>Privacy Score</span>
              <div className="flex items-baseline gap-1">
                <span style={{ color: "#22c55e", fontSize: "1.1rem", fontWeight: 800 }}>
                  {Math.min(100,
                    (data.differentialPrivacy ? (data.epsilon <= 1 ? 35 : data.epsilon <= 3 ? 25 : 15) : 0) +
                    Math.min(20, data.kAnonymity * 2) +
                    (data.lDiversity ? 10 : 0) +
                    (data.piiScan ? 15 : 0) +
                    (data.adversarialTesting ? 15 : 0) +
                    (data.membershipInference ? 5 : 0)
                  )}
                </span>
                <span style={{ color: "#475569", fontSize: "0.72rem" }}>/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        {!data.differentialPrivacy && !data.piiScan && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <AlertTriangle size={15} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.5 }}>
              Enabling Differential Privacy and PII scanning is strongly recommended. Datasets without them receive lower quality scores and may be rejected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}