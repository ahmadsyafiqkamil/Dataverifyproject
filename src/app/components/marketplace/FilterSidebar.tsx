import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

const domains = [
  { id: "healthcare", label: "Healthcare", color: "#38bdf8", count: 312 },
  { id: "finance", label: "Finance", color: "#34d399", count: 228 },
  { id: "autonomous", label: "Autonomous Vehicles", color: "#fb923c", count: 141 },
  { id: "nlp", label: "NLP", color: "#a78bfa", count: 407 },
  { id: "cv", label: "Computer Vision", color: "#f472b6", count: 194 },
];

const dataTypes = [
  { id: "tabular", label: "Tabular", count: 489 },
  { id: "image", label: "Image", count: 213 },
  { id: "text", label: "Text", count: 376 },
  { id: "timeseries", label: "Time Series", count: 204 },
];

const sortOptions = ["Latest", "Highest Score", "Lowest Price", "Highest Price", "Most Popular"];

interface FilterSidebarProps {
  selectedDomains: string[];
  setSelectedDomains: (d: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (t: string[]) => void;
  qualityRange: [number, number];
  setQualityRange: (r: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 group"
    >
      <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <ChevronDown
        size={13}
        style={{
          color: "#475569",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );
}

function RangeSlider({
  min, max, value, onChange, unit,
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void; unit?: string;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span
          className="px-2 py-0.5 rounded-md"
          style={{ backgroundColor: "rgba(56,189,248,0.1)", color: "#38bdf8", fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(56,189,248,0.2)" }}
        >
          {value[0]}{unit}
        </span>
        <div className="h-px flex-1 mx-2" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
        <span
          className="px-2 py-0.5 rounded-md"
          style={{ backgroundColor: "rgba(56,189,248,0.1)", color: "#38bdf8", fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(56,189,248,0.2)" }}
        >
          {value[1]}{unit}
        </span>
      </div>
      <div className="relative h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${pct(value[0])}%`,
            right: `${100 - pct(value[1])}%`,
            background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
            boxShadow: "0 0 8px rgba(56,189,248,0.5)",
          }}
        />
        <input
          type="range" min={min} max={max} value={value[0]}
          onChange={(e) => { const v = Number(e.target.value); if (v <= value[1] - 1) onChange([v, value[1]]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 2 }}
        />
        <input
          type="range" min={min} max={max} value={value[1]}
          onChange={(e) => { const v = Number(e.target.value); if (v >= value[0] + 1) onChange([value[0], v]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 3 }}
        />
        {/* Thumb min */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${pct(value[0])}% - 7px)`,
            backgroundColor: "#0f172a",
            borderColor: "#38bdf8",
            boxShadow: "0 0 8px rgba(56,189,248,0.7)",
            zIndex: 4,
          }}
        />
        {/* Thumb max */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${pct(value[1])}% - 7px)`,
            backgroundColor: "#0f172a",
            borderColor: "#38bdf8",
            boxShadow: "0 0 8px rgba(56,189,248,0.7)",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}

export function FilterSidebar({
  selectedDomains, setSelectedDomains,
  selectedTypes, setSelectedTypes,
  qualityRange, setQualityRange,
  priceRange, setPriceRange,
  sortBy, setSortBy,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    domain: true, type: true, quality: true, price: true, sort: true,
  });
  const [sortOpen, setSortOpen] = useState(false);

  const toggle = (section: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [section]: !s[section] }));

  const toggleDomain = (id: string) =>
    setSelectedDomains(selectedDomains.includes(id) ? selectedDomains.filter(d => d !== id) : [...selectedDomains, id]);

  const toggleType = (id: string) =>
    setSelectedTypes(selectedTypes.includes(id) ? selectedTypes.filter(t => t !== id) : [...selectedTypes, id]);

  const resetAll = () => {
    setSelectedDomains([]);
    setSelectedTypes([]);
    setQualityRange([0, 100]);
    setPriceRange([0, 50]);
    setSortBy("Latest");
  };

  const activeCount = selectedDomains.length + selectedTypes.length +
    (qualityRange[0] > 0 || qualityRange[1] < 100 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0);

  return (
    <aside
      className="flex flex-col gap-0 shrink-0"
      style={{ width: "220px", minWidth: "220px" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
        style={{
          backgroundColor: "#1e293b",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          border: "1px solid rgba(56,189,248,0.08)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: "#38bdf8" }} />
          <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>Filters</span>
          {activeCount > 0 && (
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#38bdf8", color: "#0a1628", fontSize: "0.6rem", fontWeight: 800 }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ color: "#64748b", fontSize: "0.7rem" }}
          >
            <RotateCcw size={10} />
            Reset
          </button>
        )}
      </div>

      <div
        className="flex flex-col rounded-b-2xl overflow-hidden"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid rgba(56,189,248,0.08)",
          borderTop: "none",
        }}
      >
        {/* --- Domain --- */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <SectionHeader label="Domain" open={openSections.domain} onToggle={() => toggle("domain")} />
          {openSections.domain && (
            <div className="flex flex-col gap-2 mt-2.5">
              {domains.map((d) => {
                const checked = selectedDomains.includes(d.id);
                return (
                  <label key={d.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleDomain(d.id)}
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        backgroundColor: checked ? d.color : "transparent",
                        border: `1.5px solid ${checked ? d.color : "rgba(255,255,255,0.12)"}`,
                        boxShadow: checked ? `0 0 8px ${d.color}60` : "none",
                        cursor: "pointer",
                      }}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="#0a1628" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="flex-1 transition-colors"
                      onClick={() => toggleDomain(d.id)}
                      style={{
                        color: checked ? "white" : "#64748b",
                        fontSize: "0.8rem",
                        userSelect: "none",
                      }}
                    >
                      {d.label}
                    </span>
                    <span style={{ color: "#334155", fontSize: "0.68rem" }}>{d.count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* --- Data Type --- */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <SectionHeader label="Data Type" open={openSections.type} onToggle={() => toggle("type")} />
          {openSections.type && (
            <div className="flex flex-col gap-2 mt-2.5">
              {dataTypes.map((t) => {
                const checked = selectedTypes.includes(t.id);
                return (
                  <label key={t.id} className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => toggleType(t.id)}
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        backgroundColor: checked ? "#38bdf8" : "transparent",
                        border: `1.5px solid ${checked ? "#38bdf8" : "rgba(255,255,255,0.12)"}`,
                        boxShadow: checked ? "0 0 8px rgba(56,189,248,0.5)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="#0a1628" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleType(t.id)}
                      className="flex-1 transition-colors"
                      style={{ color: checked ? "white" : "#64748b", fontSize: "0.8rem", userSelect: "none" }}
                    >
                      {t.label}
                    </span>
                    <span style={{ color: "#334155", fontSize: "0.68rem" }}>{t.count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* --- Quality Score --- */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <SectionHeader label="Quality Score" open={openSections.quality} onToggle={() => toggle("quality")} />
          {openSections.quality && (
            <div className="mt-3">
              <RangeSlider
                min={0} max={100}
                value={qualityRange}
                onChange={setQualityRange}
              />
              <div className="flex justify-between mt-2">
                <span style={{ color: "#334155", fontSize: "0.65rem" }}>0</span>
                <span style={{ color: "#334155", fontSize: "0.65rem" }}>100</span>
              </div>
            </div>
          )}
        </div>

        {/* --- Price Range --- */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <SectionHeader label="Price Range" open={openSections.price} onToggle={() => toggle("price")} />
          {openSections.price && (
            <div className="mt-3">
              <RangeSlider
                min={0} max={50}
                value={priceRange}
                onChange={setPriceRange}
                unit=" τ"
              />
              <div className="flex justify-between mt-2">
                <span style={{ color: "#334155", fontSize: "0.65rem" }}>0 TAO</span>
                <span style={{ color: "#334155", fontSize: "0.65rem" }}>50 TAO</span>
              </div>
            </div>
          )}
        </div>

        {/* --- Sort By --- */}
        <div className="px-4 py-3">
          <SectionHeader label="Sort By" open={openSections.sort} onToggle={() => toggle("sort")} />
          {openSections.sort && (
            <div className="relative mt-2.5">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "0.8rem",
                }}
              >
                <span>{sortBy}</span>
                <ChevronDown size={13} style={{ color: "#64748b", transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {sortOpen && (
                <div
                  className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                  style={{
                    backgroundColor: "#0f1f35",
                    border: "1px solid rgba(56,189,248,0.2)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full text-left px-3 py-2 transition-all"
                      style={{
                        color: sortBy === opt ? "#38bdf8" : "#94a3b8",
                        fontSize: "0.8rem",
                        backgroundColor: sortBy === opt ? "rgba(56,189,248,0.08)" : "transparent",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
