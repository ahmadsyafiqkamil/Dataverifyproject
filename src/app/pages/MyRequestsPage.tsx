import { useState, useRef, useCallback } from "react";
import {
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Users,
  Clock,
  Upload,
  FileJson,
  X,
  ArrowRight,
  Cpu,
  Zap,
  Database,
  BarChart3,
  Eye,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Data Specs" },
  { id: 2, label: "Privacy Settings" },
  { id: 3, label: "Budget & Timeline" },
  { id: 4, label: "Review & Submit" },
];

const DOMAINS = [
  "Healthcare",
  "Finance",
  "Autonomous Vehicles",
  "NLP",
  "Computer Vision",
  "Cybersecurity",
  "E-commerce",
  "Legal",
];

const DATA_TYPES = ["Tabular", "Image", "Text", "Time Series"];

const FORMATS: Record<string, string[]> = {
  Tabular: ["CSV", "Parquet", "JSONL", "Custom"],
  Image: ["PNG Archive", "ZIP (JPEG)", "WebDataset", "Custom"],
  Text: ["JSONL", "TXT", "CSV", "Custom"],
  "Time Series": ["CSV", "Parquet", "JSONL", "Custom"],
};

const PREVIOUS_REQUESTS = [
  {
    id: "REQ-2841",
    domain: "Healthcare",
    domainColor: "#22c55e",
    status: "In Progress",
    statusColor: "#f59e0b",
    statusBg: "rgba(245,158,11,0.1)",
    statusBorder: "rgba(245,158,11,0.22)",
    meta: "8 miners responding",
  },
  {
    id: "REQ-2790",
    domain: "Finance",
    domainColor: "#f59e0b",
    status: "Completed",
    statusColor: "#22c55e",
    statusBg: "rgba(34,197,94,0.1)",
    statusBorder: "rgba(34,197,94,0.22)",
    meta: "Delivered Feb 22",
  },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1e293b",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.07)",
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        color: "#94a3b8",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.055em",
        textTransform: "uppercase",
        marginBottom: "7px",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#38bdf8", marginLeft: "3px" }}>*</span>
      )}
    </label>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

function UploadZone({
  file,
  onFile,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        borderRadius: "10px",
        border: `1.5px dashed ${dragging ? "#38bdf8" : file ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
        backgroundColor: dragging
          ? "rgba(56,189,248,0.05)"
          : file
          ? "rgba(34,197,94,0.04)"
          : "rgba(255,255,255,0.02)",
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        cursor: "pointer",
        transition: "all 0.2s",
        minHeight: "92px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <>
          <FileJson size={20} style={{ color: "#22c55e" }} />
          <span style={{ color: "#22c55e", fontSize: "0.78rem", fontWeight: 600 }}>
            {file.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFile(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#475569",
              cursor: "pointer",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <X size={10} /> Remove
          </button>
        </>
      ) : (
        <>
          <Upload size={18} style={{ color: "#475569" }} />
          <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600 }}>
            Upload JSON{" "}
            <span style={{ color: "#334155", fontWeight: 400 }}>(optional)</span>
          </span>
          <span style={{ color: "#334155", fontSize: "0.7rem" }}>
            Drag & drop or click to browse
          </span>
        </>
      )}
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div
            key={step.id}
            style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}
          >
            {/* Circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  transition: "all 0.25s",
                  backgroundColor: done
                    ? "#22c55e"
                    : active
                    ? "#38bdf8"
                    : "rgba(255,255,255,0.05)",
                  border: done
                    ? "none"
                    : active
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: done || active ? "#0f172a" : "#475569",
                  boxShadow: active ? "0 0 12px rgba(56,189,248,0.5)" : "none",
                }}
              >
                {done ? <CheckCircle2 size={14} /> : step.id}
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: active ? 700 : 500,
                  color: done ? "#22c55e" : active ? "#38bdf8" : "#475569",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  marginInline: "6px",
                  marginBottom: "18px",
                  borderRadius: "99px",
                  backgroundColor: done ? "#22c55e" : "rgba(255,255,255,0.07)",
                  transition: "background-color 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input / Select base styles ───────────────────────────────────────────────

function useInputStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 13px",
    borderRadius: "9px",
    backgroundColor: "#0f172a",
    border: `1px solid ${focused ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.08)"}`,
    color: "#f1f5f9",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: focused ? "0 0 0 3px rgba(56,189,248,0.07)" : "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
  };
}

// ─── Focusable Input ─────────────────────────────────────────────────────────

function FInput({
  type = "text",
  placeholder,
  value,
  onChange,
  suffix,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const style = useInputStyle(focused);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...style, paddingRight: suffix ? "56px" : style.padding }}
      />
      {suffix && (
        <span
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#38bdf8",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            pointerEvents: "none",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

// ─── Focusable Select ─────────────────────────────────────────────────────────

function FSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [focused, setFocused] = useState(false);
  const style = useInputStyle(focused);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...style,
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 13px center",
        paddingRight: "36px",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ backgroundColor: "#1e293b" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

// ─── Focusable Textarea ───────────────────────────────────────────────────────

function FTextarea({
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const style = useInputStyle(focused);
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...style, resize: "vertical", lineHeight: 1.65 }}
    />
  );
}

// ─── Right sidebar — Preview Card ─────────────────────────────────────────────

function PreviewCard({
  domain,
  dataType,
  datasetSize,
}: {
  domain: string;
  dataType: string;
  datasetSize: string;
}) {
  const sizeNum = parseInt(datasetSize, 10);
  const hasSize = !isNaN(sizeNum) && sizeNum > 0;

  const estimatedCost =
    !hasSize
      ? "~8–15 TAO"
      : sizeNum < 10000
      ? "~3–7 TAO"
      : sizeNum < 100000
      ? "~8–15 TAO"
      : sizeNum < 500000
      ? "~16–30 TAO"
      : "~30–60 TAO";

  const estimatedMiners =
    domain === "Healthcare"
      ? "~9 miners"
      : domain === "Finance"
      ? "~14 miners"
      : domain === "NLP"
      ? "~11 miners"
      : "~12 miners";

  return (
    <div style={{ ...cardStyle, overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "linear-gradient(90deg, rgba(56,189,248,0.06), transparent)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Eye size={14} style={{ color: "#38bdf8" }} />
        <span style={{ color: "#f1f5f9", fontSize: "0.88rem", fontWeight: 700 }}>
          Request Preview
        </span>
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.68rem",
            color: "#22c55e",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 5px #22c55e",
              animation: "pulse 2s infinite",
            }}
          />
          Live
        </span>
      </div>

      <div style={{ padding: "18px" }}>
        {/* Domain + type pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              backgroundColor: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.22)",
              color: "#38bdf8",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {domain}
          </span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              backgroundColor: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
              color: "#c084fc",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {dataType}
          </span>
        </div>

        {/* Stats */}
        {[
          {
            icon: Database,
            label: "Dataset Size",
            value: hasSize ? `${Number(datasetSize).toLocaleString()} records` : "—",
            color: "#38bdf8",
          },
          {
            icon: Zap,
            label: "Est. Cost Range",
            value: estimatedCost,
            color: "#f59e0b",
          },
          {
            icon: Cpu,
            label: "Est. Miners",
            value: estimatedMiners,
            color: "#a855f7",
          },
          {
            icon: Clock,
            label: "Est. Delivery",
            value: "~2–4 hours",
            color: "#22c55e",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <Icon size={13} style={{ color }} />
              <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{label}</span>
            </div>
            <span
              style={{
                color: value === "—" ? "#334155" : "#f1f5f9",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              {value}
            </span>
          </div>
        ))}

        {/* Info note */}
        <div
          style={{
            marginTop: "14px",
            padding: "9px 11px",
            borderRadius: "8px",
            backgroundColor: "rgba(56,189,248,0.05)",
            border: "1px solid rgba(56,189,248,0.1)",
            display: "flex",
            gap: "7px",
            alignItems: "flex-start",
          }}
        >
          <AlertCircle size={12} style={{ color: "#38bdf8", flexShrink: 0, marginTop: "1px" }} />
          <p style={{ margin: 0, color: "#475569", fontSize: "0.73rem", lineHeight: 1.55 }}>
            Final cost is determined by validator consensus after miners submit bids.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Right sidebar — Active Requests ─────────────────────────────────────────

function ActiveRequestsMini() {
  return (
    <div style={{ ...cardStyle, overflow: "hidden" }}>
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <BarChart3 size={13} style={{ color: "#94a3b8" }} />
        <span style={{ color: "#f1f5f9", fontSize: "0.85rem", fontWeight: 700 }}>
          Active Requests
        </span>
        <span
          style={{
            marginLeft: "auto",
            padding: "1px 7px",
            borderRadius: "20px",
            backgroundColor: "rgba(56,189,248,0.1)",
            border: "1px solid rgba(56,189,248,0.18)",
            color: "#38bdf8",
            fontSize: "0.68rem",
            fontWeight: 700,
          }}
        >
          2
        </span>
      </div>

      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {PREVIOUS_REQUESTS.map((req) => (
          <div
            key={req.id}
            style={{
              padding: "11px 13px",
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  color: "#38bdf8",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {req.id}
              </span>
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: "20px",
                  backgroundColor: req.statusBg,
                  border: `1px solid ${req.statusBorder}`,
                  color: req.statusColor,
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {req.status === "In Progress" ? (
                  <Loader2 size={9} style={{ animation: "spin 2s linear infinite" }} />
                ) : (
                  <CheckCircle2 size={9} />
                )}
                {req.status}
              </span>
            </div>
            {/* Bottom row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: "5px",
                  backgroundColor: `${req.domainColor}12`,
                  border: `1px solid ${req.domainColor}22`,
                  color: req.domainColor,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                }}
              >
                {req.domain}
              </span>
              <span style={{ color: "#475569", fontSize: "0.7rem" }}>{req.meta}</span>
            </div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            padding: "7px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "transparent",
            color: "#475569",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            transition: "all 0.15s",
          }}
        >
          <ExternalLink size={11} />
          View all requests
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function MyRequestsPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [domain, setDomain] = useState("Healthcare");
  const [dataType, setDataType] = useState("Tabular");
  const [datasetSize, setDatasetSize] = useState("");
  const [format, setFormat] = useState("CSV");
  const [description, setDescription] = useState("");
  const [targetDist, setTargetDist] = useState("");
  const [refFile, setRefFile] = useState<File | null>(null);

  // Update format default when dataType changes
  const handleDataTypeChange = (dt: string) => {
    setDataType(dt);
    setFormat(FORMATS[dt][0]);
  };

  const canProceed = domain && dataType && datasetSize && description.length > 10;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "26px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(99,102,241,0.18))",
                border: "1px solid rgba(56,189,248,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipboardList size={17} style={{ color: "#38bdf8" }} />
            </div>
            <h1
              style={{
                color: "#f1f5f9",
                fontSize: "1.55rem",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              My Requests
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
            Submit a custom data request to the miner network
          </p>
        </div>

        {/* Stats pills */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "10px",
              backgroundColor: "#1e293b",
              border: "1px solid rgba(56,189,248,0.14)",
            }}
          >
            <Users size={13} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Open Miners:</span>
            <span style={{ color: "#38bdf8", fontSize: "0.8rem", fontWeight: 700 }}>14</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "10px",
              backgroundColor: "#1e293b",
              border: "1px solid rgba(34,197,94,0.14)",
            }}
          >
            <Clock size={13} style={{ color: "#22c55e" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Avg Response:</span>
            <span style={{ color: "#22c55e", fontSize: "0.8rem", fontWeight: 700 }}>2.4h</span>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)",
          gap: "18px",
          alignItems: "start",
        }}
      >
        {/* ══ LEFT — Main Form Card ══ */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          {/* Card header */}
          <div
            style={{
              padding: "18px 22px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "linear-gradient(90deg, rgba(56,189,248,0.06), transparent)",
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <ChevronRight size={15} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#f1f5f9", fontSize: "0.92rem", fontWeight: 700 }}>
              New Data Request
            </span>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.18)",
                color: "#38bdf8",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              DRAFT
            </span>
          </div>

          <div style={{ padding: "24px 24px 20px" }}>
            {/* ── Step progress bar ── */}
            <StepBar current={currentStep} />

            {/* ── Step 1: Data Specs ── */}
            {currentStep === 1 && (
              <div>
                {/* Step heading */}
                <div style={{ marginBottom: "22px" }}>
                  <h2
                    style={{
                      color: "#f1f5f9",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      margin: "0 0 4px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Data Specifications
                  </h2>
                  <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>
                    Tell miners exactly what kind of data you need generated.
                  </p>
                </div>

                {/* Row 1: Domain + Data Type */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <FieldLabel required>Domain</FieldLabel>
                    <FSelect value={domain} onChange={setDomain} options={DOMAINS} />
                  </div>

                  <div>
                    <FieldLabel required>Data Type</FieldLabel>
                    <div
                      style={{
                        display: "flex",
                        backgroundColor: "#0f172a",
                        borderRadius: "9px",
                        border: "1px solid rgba(255,255,255,0.07)",
                        padding: "3px",
                        gap: "2px",
                      }}
                    >
                      {DATA_TYPES.map((t) => {
                        const active = dataType === t;
                        return (
                          <button
                            key={t}
                            onClick={() => handleDataTypeChange(t)}
                            style={{
                              flex: 1,
                              padding: "7px 0",
                              borderRadius: "7px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: active ? 700 : 500,
                              backgroundColor: active
                                ? "rgba(56,189,248,0.15)"
                                : "transparent",
                              color: active ? "#38bdf8" : "#475569",
                              boxShadow: active
                                ? "inset 0 0 0 1px rgba(56,189,248,0.28)"
                                : "none",
                              transition: "all 0.15s",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 2: Dataset Size + Format */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <FieldLabel required>Dataset Size</FieldLabel>
                    <FInput
                      type="number"
                      placeholder="e.g. 50000"
                      value={datasetSize}
                      onChange={setDatasetSize}
                      suffix="records"
                    />
                  </div>
                  <div>
                    <FieldLabel>Expected Format</FieldLabel>
                    <FSelect
                      value={format}
                      onChange={setFormat}
                      options={FORMATS[dataType] ?? FORMATS.Tabular}
                    />
                  </div>
                </div>

                {/* Row 3: Description */}
                <div style={{ marginBottom: "16px" }}>
                  <FieldLabel required>Description / Use Case</FieldLabel>
                  <FTextarea
                    placeholder="Describe what you need this data for, target distribution, and any specific requirements..."
                    value={description}
                    onChange={setDescription}
                    rows={4}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: description.length > 400 ? "#f59e0b" : "#334155",
                      }}
                    >
                      {description.length} / 500
                    </span>
                  </div>
                </div>

                {/* Row 4: Target Distribution + Upload */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <FieldLabel>Target Distribution</FieldLabel>
                    <FInput
                      placeholder="e.g. Normal dist, mean=50, std=15"
                      value={targetDist}
                      onChange={setTargetDist}
                    />
                  </div>
                  <div>
                    <FieldLabel>Reference Stats</FieldLabel>
                    <UploadZone file={refFile} onFile={setRefFile} />
                  </div>
                </div>

                {/* Tip */}
                <div
                  style={{
                    padding: "10px 13px",
                    borderRadius: "9px",
                    backgroundColor: "rgba(245,158,11,0.05)",
                    border: "1px solid rgba(245,158,11,0.13)",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                    marginBottom: "22px",
                  }}
                >
                  <AlertCircle
                    size={13}
                    style={{ color: "#f59e0b", flexShrink: 0, marginTop: "1px" }}
                  />
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.775rem", lineHeight: 1.55 }}>
                    More detailed descriptions attract higher-quality miner responses.
                    Miners with lower reputations are automatically filtered out.
                  </p>
                </div>

                {/* Form actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "18px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <button
                    style={{
                      padding: "10px 20px",
                      borderRadius: "9px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "transparent",
                      color: "#64748b",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => canProceed && setCurrentStep(2)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 24px",
                      borderRadius: "9px",
                      border: "none",
                      cursor: canProceed ? "pointer" : "not-allowed",
                      background: canProceed
                        ? "linear-gradient(135deg, #38bdf8, #0ea5e9)"
                        : "rgba(56,189,248,0.12)",
                      color: canProceed ? "#0f172a" : "#334155",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      boxShadow: canProceed
                        ? "0 4px 14px rgba(56,189,248,0.28)"
                        : "none",
                      transition: "all 0.2s",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Next: Privacy Settings
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Steps 2–4 placeholder ── */}
            {currentStep > 1 && (
              <div>
                <div style={{ marginBottom: "22px" }}>
                  <h2
                    style={{
                      color: "#f1f5f9",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      margin: "0 0 4px",
                    }}
                  >
                    {currentStep === 2
                      ? "Privacy Settings"
                      : currentStep === 3
                      ? "Budget & Timeline"
                      : "Review & Submit"}
                  </h2>
                  <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>
                    {currentStep === 2
                      ? "Set privacy requirements and compliance standards for your dataset."
                      : currentStep === 3
                      ? "Define your budget ceiling and delivery deadline."
                      : "Review all settings and broadcast to the miner network."}
                  </p>
                </div>

                {/* Placeholder content */}
                <div
                  style={{
                    padding: "48px 24px",
                    borderRadius: "10px",
                    border: "1px dashed rgba(255,255,255,0.07)",
                    backgroundColor: "rgba(255,255,255,0.01)",
                    textAlign: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ color: "#334155", fontSize: "0.85rem" }}>
                    Step {currentStep} content
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "18px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "9px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "transparent",
                      color: "#64748b",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => currentStep < 4 && setCurrentStep((s) => s + 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 24px",
                      borderRadius: "9px",
                      border: "none",
                      cursor: "pointer",
                      background:
                        currentStep === 4
                          ? "linear-gradient(135deg, #22c55e, #16a34a)"
                          : "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                      color: "#0f172a",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      boxShadow:
                        currentStep === 4
                          ? "0 4px 14px rgba(34,197,94,0.28)"
                          : "0 4px 14px rgba(56,189,248,0.28)",
                      transition: "all 0.2s",
                    }}
                  >
                    {currentStep === 4 ? (
                      <>
                        <Zap size={15} />
                        Submit to Network
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT — Sidebar ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <PreviewCard
            domain={domain}
            dataType={dataType}
            datasetSize={datasetSize}
          />
          <ActiveRequestsMini />
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
