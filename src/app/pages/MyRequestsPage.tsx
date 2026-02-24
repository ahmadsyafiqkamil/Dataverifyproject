import { useState } from "react";
import {
  Plus,
  Send,
  ChevronDown,
  ClipboardList,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  RotateCcw,
  Eye,
  X,
  AlertTriangle,
  Users,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = "Open" | "In Progress" | "Completed";

interface ActiveRequest {
  id: string;
  domain: string;
  dataType: string;
  status: RequestStatus;
  minersResponding: number;
  minersTotal: number;
  eta: string;
  price: string;
  submittedAt: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: ActiveRequest[] = [
  {
    id: "REQ-0042",
    domain: "Healthcare",
    dataType: "Synthetic",
    status: "In Progress",
    minersResponding: 7,
    minersTotal: 12,
    eta: "~18 min",
    price: "4.20 TAO",
    submittedAt: "2 hours ago",
  },
  {
    id: "REQ-0039",
    domain: "Finance",
    dataType: "Augmented",
    status: "Completed",
    minersResponding: 11,
    minersTotal: 11,
    eta: "Done",
    price: "6.80 TAO",
    submittedAt: "1 day ago",
  },
  {
    id: "REQ-0041",
    domain: "Cybersecurity",
    dataType: "Synthetic",
    status: "Open",
    minersResponding: 0,
    minersTotal: 0,
    eta: "Pending",
    price: "2.50 TAO",
    submittedAt: "14 min ago",
  },
];

const DOMAINS = [
  "Healthcare",
  "Finance",
  "Cybersecurity",
  "E-commerce",
  "Legal",
  "Education",
  "Logistics",
  "Other",
];

const PRIVACY_OPTIONS = [
  "Standard",
  "Differential Privacy",
  "Federated / No Raw Export",
  "HIPAA Compliant",
  "GDPR Compliant",
];

const DATA_TYPES = ["Synthetic", "Augmented", "Real-world Proxy"];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  const config = {
    Open: {
      color: "#38bdf8",
      bg: "rgba(56,189,248,0.1)",
      border: "rgba(56,189,248,0.25)",
      Icon: Circle,
      glow: "rgba(56,189,248,0.35)",
    },
    "In Progress": {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      Icon: Loader2,
      glow: "rgba(245,158,11,0.35)",
    },
    Completed: {
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
      Icon: CheckCircle2,
      glow: "rgba(34,197,94,0.35)",
    },
  }[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: "0.74rem",
        fontWeight: 700,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      <config.Icon
        size={11}
        style={{
          filter: `drop-shadow(0 0 4px ${config.glow})`,
          animation: status === "In Progress" ? "spin 2s linear infinite" : undefined,
        }}
      />
      {status}
    </span>
  );
}

function MinerBar({
  responding,
  total,
}: {
  responding: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : (responding / total) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "64px",
          height: "5px",
          borderRadius: "99px",
          backgroundColor: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "99px",
            background:
              pct === 100
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : "linear-gradient(90deg, #38bdf8, #818cf8)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500 }}>
        {responding}/{total}
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        color: "#94a3b8",
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: "7px",
      }}
    >
      {children}
    </label>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f1f5f9",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "38px",
  cursor: "pointer",
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function MyRequestsPage() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<ActiveRequest[]>(INITIAL_REQUESTS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form state
  const [domain, setDomain] = useState("Healthcare");
  const [dataType, setDataType] = useState("Synthetic");
  const [datasetSize, setDatasetSize] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("Standard");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = () => {
    if (!description || !datasetSize || !maxPrice) return;
    setSubmitting(true);
    setTimeout(() => {
      const newReq: ActiveRequest = {
        id: `REQ-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        domain,
        dataType,
        status: "Open",
        minersResponding: 0,
        minersTotal: 0,
        eta: "Pending",
        price: `${maxPrice} TAO`,
        submittedAt: "Just now",
      };
      setRequests((prev) => [newReq, ...prev]);
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setDescription("");
        setDatasetSize("");
        setMaxPrice("");
        setDomain("Healthcare");
        setDataType("Synthetic");
        setPrivacy("Standard");
      }, 1800);
    }, 1600);
  };

  const focusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: "rgba(56,189,248,0.5)", boxShadow: "0 0 0 3px rgba(56,189,248,0.08)" }
      : {};

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.15))",
                border: "1px solid rgba(56,189,248,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipboardList size={18} style={{ color: "#38bdf8" }} />
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
          <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>
            Submit a custom data request to the miner network
          </p>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "10px",
            background: showForm
              ? "rgba(56,189,248,0.08)"
              : "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            border: showForm ? "1px solid rgba(56,189,248,0.25)" : "none",
            color: showForm ? "#38bdf8" : "#0f172a",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: showForm ? "none" : "0 4px 14px rgba(56,189,248,0.28)",
            transition: "all 0.22s",
            letterSpacing: "0.01em",
          }}
        >
          {showForm ? (
            <>
              <X size={16} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={16} />
              New Request
            </>
          )}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Requests",
            value: String(requests.length),
            icon: ClipboardList,
            color: "#38bdf8",
          },
          {
            label: "In Progress",
            value: String(requests.filter((r) => r.status === "In Progress").length),
            icon: Loader2,
            color: "#f59e0b",
          },
          {
            label: "Completed",
            value: String(requests.filter((r) => r.status === "Completed").length),
            icon: CheckCircle2,
            color: "#22c55e",
          },
          {
            label: "Open",
            value: String(requests.filter((r) => r.status === "Open").length),
            icon: Circle,
            color: "#a855f7",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                backgroundColor: `${stat.color}12`,
                border: `1px solid ${stat.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <stat.icon size={17} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.2 }}>
                {stat.value}
              </div>
              <div style={{ color: "#475569", fontSize: "0.74rem", marginTop: "2px" }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Form Card ── */}
      <div
        style={{
          maxHeight: showForm ? "1200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            border: "1px solid rgba(56,189,248,0.14)",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(90deg, rgba(56,189,248,0.06), transparent)",
            }}
          >
            <Send size={16} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700 }}>
              Submit New Request
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "#475569",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Users size={13} />
              Broadcast to {Math.floor(Math.random() * 20) + 40} active miners
            </span>
          </div>

          {/* Form body */}
          <div style={{ padding: "24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                marginBottom: "18px",
              }}
            >
              {/* Domain */}
              <div>
                <FieldLabel>Domain</FieldLabel>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onFocus={() => setFocusedField("domain")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...selectBase, ...focusStyle("domain") }}
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d} style={{ backgroundColor: "#1e293b" }}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dataset Size */}
              <div>
                <FieldLabel>Dataset Size (rows)</FieldLabel>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={datasetSize}
                  onChange={(e) => setDatasetSize(e.target.value)}
                  onFocus={() => setFocusedField("size")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputBase, ...focusStyle("size") }}
                />
              </div>
            </div>

            {/* Data Type segmented toggle */}
            <div style={{ marginBottom: "18px" }}>
              <FieldLabel>Data Type</FieldLabel>
              <div
                style={{
                  display: "inline-flex",
                  backgroundColor: "#0f172a",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "3px",
                  gap: "2px",
                }}
              >
                {DATA_TYPES.map((type) => {
                  const active = dataType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setDataType(type)}
                      style={{
                        padding: "7px 18px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: active ? 700 : 500,
                        backgroundColor: active ? "rgba(56,189,248,0.15)" : "transparent",
                        color: active ? "#38bdf8" : "#475569",
                        transition: "all 0.18s",
                        boxShadow: active ? "0 0 0 1px rgba(56,189,248,0.25) inset" : "none",
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "18px" }}>
              <FieldLabel>Description</FieldLabel>
              <textarea
                rows={3}
                placeholder="Describe the data you need, including schema, format, and any special requirements…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField("desc")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputBase,
                  resize: "vertical",
                  lineHeight: 1.65,
                  ...focusStyle("desc"),
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                marginBottom: "24px",
              }}
            >
              {/* Privacy */}
              <div>
                <FieldLabel>Privacy Requirements</FieldLabel>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  onFocus={() => setFocusedField("privacy")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...selectBase, ...focusStyle("privacy") }}
                >
                  {PRIVACY_OPTIONS.map((p) => (
                    <option key={p} value={p} style={{ backgroundColor: "#1e293b" }}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price */}
              <div>
                <FieldLabel>Max Price (TAO)</FieldLabel>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 5.00"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputBase, paddingRight: "52px", ...focusStyle("price") }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#38bdf8",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      pointerEvents: "none",
                    }}
                  >
                    TAO
                  </span>
                </div>
              </div>
            </div>

            {/* Tip bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "9px",
                backgroundColor: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.15)",
                marginBottom: "20px",
              }}
            >
              <AlertTriangle size={13} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <span style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.5 }}>
                Requests are broadcast anonymously. Miners compete to fulfill your spec within your price ceiling.
                Funds are escrowed until you approve delivery.
              </span>
            </div>

            {/* Submit button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSubmit}
                disabled={submitting || submitted || !description || !datasetSize || !maxPrice}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  cursor:
                    submitting || submitted || !description || !datasetSize || !maxPrice
                      ? "not-allowed"
                      : "pointer",
                  background:
                    submitted
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : submitting || !description || !datasetSize || !maxPrice
                      ? "rgba(56,189,248,0.15)"
                      : "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                  color:
                    submitted
                      ? "#fff"
                      : submitting || !description || !datasetSize || !maxPrice
                      ? "#475569"
                      : "#0f172a",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  boxShadow:
                    submitted
                      ? "0 4px 14px rgba(34,197,94,0.3)"
                      : !submitting && description && datasetSize && maxPrice
                      ? "0 4px 14px rgba(56,189,248,0.28)"
                      : "none",
                  transition: "all 0.25s",
                  letterSpacing: "0.01em",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Broadcasting…
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Request Submitted!
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Submit to Network →
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Requests Table ── */}
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <Clock size={15} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#f1f5f9", fontSize: "0.92rem", fontWeight: 700 }}>
              Active Requests
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "20px",
                backgroundColor: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "#38bdf8",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {requests.length}
            </span>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#64748b",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={12} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  "Request ID",
                  "Domain",
                  "Data Type",
                  "Status",
                  "Miners Responding",
                  "ETA",
                  "Max Price",
                  "Submitted",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <TableRow key={req.id} req={req} isLast={i === requests.length - 1} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state (never shown here but included for completeness) */}
        {requests.length === 0 && (
          <div
            style={{
              padding: "56px 24px",
              textAlign: "center",
              color: "#334155",
            }}
          >
            <ClipboardList size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: "0.9rem" }}>No requests yet — submit your first one above.</p>
          </div>
        )}

        {/* Table footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#334155", fontSize: "0.75rem" }}>
            Showing {requests.length} of {requests.length} requests
          </span>
          <div style={{ display: "flex", items: "center", gap: "6px" }}>
            {["←", "1", "→"].map((label) => (
              <button
                key={label}
                style={{
                  padding: "4px 9px",
                  borderRadius: "6px",
                  backgroundColor: label === "1" ? "rgba(56,189,248,0.12)" : "transparent",
                  border: label === "1" ? "1px solid rgba(56,189,248,0.22)" : "1px solid rgba(255,255,255,0.06)",
                  color: label === "1" ? "#38bdf8" : "#475569",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function TableRow({ req, isLast }: { req: ActiveRequest; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        backgroundColor: hovered ? "rgba(56,189,248,0.03)" : "transparent",
        transition: "background-color 0.15s",
      }}
    >
      {/* Request ID */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span
          style={{
            color: "#38bdf8",
            fontSize: "0.84rem",
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "0.03em",
          }}
        >
          {req.id}
        </span>
      </td>

      {/* Domain */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span style={{ color: "#cbd5e1", fontSize: "0.84rem", fontWeight: 500 }}>
          {req.domain}
        </span>
      </td>

      {/* Data Type */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "5px",
            backgroundColor: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.18)",
            color: "#c084fc",
            fontSize: "0.74rem",
            fontWeight: 600,
          }}
        >
          {req.dataType}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <StatusBadge status={req.status} />
      </td>

      {/* Miners responding */}
      <td style={{ padding: "14px 16px" }}>
        <MinerBar responding={req.minersResponding} total={req.minersTotal} />
      </td>

      {/* ETA */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span
          style={{
            color:
              req.eta === "Done"
                ? "#22c55e"
                : req.eta === "Pending"
                ? "#475569"
                : "#f59e0b",
            fontSize: "0.84rem",
            fontWeight: 600,
          }}
        >
          {req.eta}
        </span>
      </td>

      {/* Max Price */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span style={{ color: "#94a3b8", fontSize: "0.84rem", fontWeight: 500 }}>
          {req.price}
        </span>
      </td>

      {/* Submitted */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span style={{ color: "#475569", fontSize: "0.8rem" }}>{req.submittedAt}</span>
      </td>

      {/* Action */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            style={{
              padding: "5px 10px",
              borderRadius: "7px",
              backgroundColor: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.18)",
              color: "#38bdf8",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.15s",
            }}
          >
            <Eye size={12} />
            View
          </button>
          {req.status === "Completed" && (
            <button
              style={{
                padding: "5px 10px",
                borderRadius: "7px",
                backgroundColor: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#22c55e",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ExternalLink size={11} />
              Download
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
