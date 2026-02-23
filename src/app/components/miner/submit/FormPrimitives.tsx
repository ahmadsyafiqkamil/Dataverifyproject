import type React from "react";
import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { ChevronDown, Check } from "lucide-react";

/* ── shared token ─────────────────────────────────────────── */
const INPUT_BASE: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0b1628",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "white",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const INPUT_FOCUS: React.CSSProperties = {
  border: "1px solid #38bdf8",
  boxShadow: "0 0 0 3px rgba(56,189,248,0.12), 0 0 18px rgba(56,189,248,0.08)",
};

/* ── Label ────────────────────────────────────────────────── */
export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 mb-1.5">
      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.02em" }}>
        {children}
      </span>
      {required && <span style={{ color: "#38bdf8", fontSize: "0.7rem" }}>*</span>}
    </label>
  );
}

/* ── FieldHint ────────────────────────────────────────────── */
export function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p style={{ color: "#334155", fontSize: "0.68rem", marginTop: "5px", lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

/* ── TextInput ────────────────────────────────────────────── */
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}
export function TextInput({ suffix, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false);
  if (suffix) {
    return (
      <div className="flex items-center overflow-hidden" style={{ ...INPUT_BASE, ...(focused ? INPUT_FOCUS : {}), padding: 0 }}>
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{ flex: 1, backgroundColor: "transparent", border: "none", outline: "none", color: "white", fontSize: "0.88rem", padding: "11px 14px" }}
        />
        <span style={{ color: "#334155", fontSize: "0.78rem", fontWeight: 600, paddingRight: "14px", whiteSpace: "nowrap" }}>
          {suffix}
        </span>
      </div>
    );
  }
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{ ...INPUT_BASE, ...(focused ? INPUT_FOCUS : {}), padding: "11px 14px", ...props.style }}
    />
  );
}

/* ── Textarea ─────────────────────────────────────────────── */
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{ ...INPUT_BASE, ...(focused ? INPUT_FOCUS : {}), padding: "11px 14px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.55, ...props.style }}
    />
  );
}

/* ── Select ───────────────────────────────────────────────── */
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{ ...INPUT_BASE, ...(focused ? INPUT_FOCUS : {}), padding: "11px 38px 11px 14px", appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
      >
        {children}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
    </div>
  );
}

/* ── SegmentedToggle ──────────────────────────────────────── */
export function SegmentedToggle({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center rounded-xl overflow-hidden" style={{ backgroundColor: "#0b1628", border: "1px solid rgba(255,255,255,0.08)", padding: "3px", gap: "2px" }}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <button
            key={opt} type="button" onClick={() => onChange(opt)}
            className="flex-1 px-2 py-2 rounded-lg transition-all duration-200 text-center"
            style={{
              backgroundColor: active ? "#38bdf8" : "transparent",
              color: active ? "#0a1628" : "#475569",
              fontSize: "0.76rem",
              fontWeight: active ? 700 : 500,
              boxShadow: active ? "0 0 14px rgba(56,189,248,0.3)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ── ToggleSwitch ─────────────────────────────────────────── */
export function ToggleSwitch({ checked, onChange, label, sub, accentColor = "#38bdf8" }: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; sub?: string; accentColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
      style={{ backgroundColor: checked ? `${accentColor}0d` : "rgba(255,255,255,0.02)", border: `1px solid ${checked ? `${accentColor}30` : "rgba(255,255,255,0.06)"}` }}
      onClick={() => onChange(!checked)}
    >
      <div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.84rem", fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "2px" }}>{sub}</div>}
      </div>
      <div className="relative rounded-full transition-all duration-300 shrink-0" style={{ width: "40px", height: "22px", backgroundColor: checked ? accentColor : "rgba(255,255,255,0.08)", boxShadow: checked ? `0 0 12px ${accentColor}50` : "none" }}>
        <div className="absolute rounded-full transition-all duration-300" style={{ width: "18px", height: "18px", backgroundColor: "white", left: checked ? "20px" : "2px", top: "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
      </div>
    </div>
  );
}

/* ── SliderInput ──────────────────────────────────────────── */
export function SliderInput({ label, value, min, max, step = 1, unit = "", accentColor = "#38bdf8", onChange, formatValue }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; accentColor?: string;
  onChange: (v: number) => void; formatValue?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value}${unit}`;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 600 }}>{label}</span>
        <span className="px-2 py-0.5 rounded-lg" style={{ backgroundColor: `${accentColor}15`, color: accentColor, fontSize: "0.78rem", fontWeight: 700 }}>{display}</span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}60` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ height: "100%" }} />
      </div>
      <div className="flex justify-between mt-1">
        <span style={{ color: "#334155", fontSize: "0.65rem" }}>{min}{unit}</span>
        <span style={{ color: "#334155", fontSize: "0.65rem" }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────── */
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all"
        style={{ backgroundColor: checked ? "#38bdf8" : "rgba(255,255,255,0.04)", border: `1.5px solid ${checked ? "#38bdf8" : "rgba(255,255,255,0.12)"}`, boxShadow: checked ? "0 0 10px rgba(56,189,248,0.35)" : "none" }}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check size={11} style={{ color: "#0a1628" }} strokeWidth={3} />}
      </div>
      <span style={{ color: "#94a3b8", fontSize: "0.83rem", lineHeight: 1.55 }}>{label}</span>
    </label>
  );
}

/* ── MultiSelect chips ────────────────────────────────────── */
export function MultiSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = value.includes(opt);
        return (
          <button
            key={opt} type="button" onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: active ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: active ? "#38bdf8" : "#475569",
              fontSize: "0.76rem",
              fontWeight: active ? 600 : 400,
              boxShadow: active ? "0 0 10px rgba(56,189,248,0.15)" : "none",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}