import { useRef, useState } from "react";
import { FileCode2, Upload, X, CheckCircle2, Info } from "lucide-react";
import { Label, FieldHint, TextInput, Select, SliderInput, MultiSelect } from "./FormPrimitives";
import type { FormData } from "./types";

const EVAL_METRICS = [
  "KL Divergence", "Wasserstein Distance", "FID Score",
  "TSTR", "TRTS", "DCR", "NNDR", "Correlations",
  "Authenticity", "Privacy Score",
];

function SchemaDropZone({ file, onFile, onClear }: { file: File | null; onFile: (f: File) => void; onClear: () => void }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = (f: File) => {
    if (f.name.endsWith(".json") || f.name.endsWith(".yaml") || f.name.endsWith(".yml") || f.name.endsWith(".csv")) {
      onFile(f);
    }
  };

  if (file) return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(56,189,248,0.1)" }}>
          <FileCode2 size={15} style={{ color: "#38bdf8" }} />
        </div>
        <div>
          <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 600 }}>{file.name}</div>
          <div style={{ color: "#475569", fontSize: "0.7rem" }}>{(file.size / 1024).toFixed(1)} KB</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 size={15} style={{ color: "#38bdf8" }} />
        <button type="button" onClick={onClear} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-all">
          <X size={12} style={{ color: "#64748b" }} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center gap-2 py-6 rounded-xl cursor-pointer transition-all"
      style={{
        border: `2px dashed ${dragging ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.07)"}`,
        backgroundColor: dragging ? "rgba(56,189,248,0.04)" : "rgba(255,255,255,0.01)",
      }}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
      onClick={() => ref.current?.click()}
    >
      <Upload size={18} style={{ color: dragging ? "#38bdf8" : "#334155" }} />
      <div className="text-center">
        <p style={{ color: dragging ? "#38bdf8" : "#475569", fontSize: "0.8rem" }}>Drop schema file or <span style={{ color: "#38bdf8", textDecoration: "underline" }}>browse</span></p>
        <p style={{ color: "#334155", fontSize: "0.68rem", marginTop: "2px" }}>.json · .yaml · .csv accepted</p>
      </div>
      <input ref={ref} type="file" accept=".json,.yaml,.yml,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); }} />
    </div>
  );
}

function TooltipInfo({ tip }: { tip: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <Info size={12} style={{ color: "#334155", cursor: "help" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
      {show && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg z-30 w-48"
          style={{ backgroundColor: "#0a1628", border: "1px solid rgba(56,189,248,0.2)", color: "#94a3b8", fontSize: "0.68rem", lineHeight: 1.5, whiteSpace: "normal" }}>
          {tip}
        </div>
      )}
    </div>
  );
}

export function Step2TechnicalSpecs({ data, onChange }: { data: FormData; onChange: (p: Partial<FormData>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

      {/* ── LEFT ── */}
      <div className="flex flex-col gap-5">

        {/* Feature count */}
        <div>
          <Label required>Number of Features / Columns</Label>
          <TextInput
            type="number" placeholder="e.g. 48" min={1}
            value={data.featureCount}
            onChange={e => onChange({ featureCount: e.target.value })}
          />
          <FieldHint>Total columns including target variables.</FieldHint>
        </div>

        {/* Target column(s) */}
        <div>
          <Label>Target / Label Column(s)</Label>
          <TextInput
            type="text" placeholder="e.g. diagnosis_code, mortality_flag"
            value={data.targetColumns}
            onChange={e => onChange({ targetColumns: e.target.value })}
          />
          <FieldHint>Comma-separated. Leave blank for unsupervised datasets.</FieldHint>
        </div>

        {/* Train/test split */}
        <div>
          <Label required>
            Train / Test Split
            <TooltipInfo tip="The percentage of data designated for training. Remaining is used for evaluation." />
          </Label>
          <SliderInput
            label=""
            value={data.trainTestSplit}
            min={50} max={95} step={5}
            formatValue={v => `${v}% train · ${100 - v}% test`}
            onChange={v => onChange({ trainTestSplit: v })}
          />
        </div>

        {/* Class balance */}
        <div>
          <Label>Class Balance</Label>
          <Select value={data.classBalance} onChange={e => onChange({ classBalance: e.target.value })}>
            <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select distribution…</option>
            {["Balanced (50/50)", "Imbalanced (reflects real-world)", "Stratified sampling", "Oversampled minority", "Undersampled majority"].map(v => (
              <option key={v} value={v} style={{ backgroundColor: "#0b1628", color: "white" }}>{v}</option>
            ))}
          </Select>
          <FieldHint>Label distribution strategy used during generation.</FieldHint>
        </div>

        {/* Schema Upload */}
        <div>
          <Label>Schema / Column Definitions</Label>
          <SchemaDropZone
            file={data.schemaFile}
            onFile={f => onChange({ schemaFile: f })}
            onClear={() => onChange({ schemaFile: null })}
          />
          <FieldHint>Optional: Provide column names, types, and value ranges in JSON/YAML.</FieldHint>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex flex-col gap-5">

        {/* Missing value strategy */}
        <div>
          <Label required>Missing Values Strategy</Label>
          <Select value={data.missingValueStrategy} onChange={e => onChange({ missingValueStrategy: e.target.value })}>
            <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select strategy…</option>
            {[
              { v: "none",    l: "None — No missing values" },
              { v: "mean",    l: "Mean / Mode imputation" },
              { v: "hotdeck", l: "Hot-deck imputation" },
              { v: "mice",    l: "MICE (multiple imputation)" },
              { v: "random",  l: "Random missing (MCAR)" },
              { v: "mar",     l: "Missing at random (MAR)" },
            ].map(({ v, l }) => (
              <option key={v} value={v} style={{ backgroundColor: "#0b1628", color: "white" }}>{l}</option>
            ))}
          </Select>
          <FieldHint>How missing values were generated or handled in the output.</FieldHint>
        </div>

        {/* Normalization */}
        <div>
          <Label required>Feature Normalization</Label>
          <Select value={data.normalization} onChange={e => onChange({ normalization: e.target.value })}>
            <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select normalization…</option>
            {[
              "None",
              "Min-Max Scaling [0, 1]",
              "Z-Score Standardization",
              "Robust Scaling (IQR)",
              "Log Transform",
              "Quantile Transform",
            ].map(v => (
              <option key={v} value={v} style={{ backgroundColor: "#0b1628", color: "white" }}>{v}</option>
            ))}
          </Select>
          <FieldHint>Applied to continuous features before generation.</FieldHint>
        </div>

        {/* Evaluation metrics */}
        <div>
          <Label required>
            Evaluation Metrics
            <TooltipInfo tip="Select which fidelity metrics verifiers will run against your dataset. More metrics = thorough but slower evaluation." />
          </Label>
          <MultiSelect
            options={EVAL_METRICS}
            value={data.evaluationMetrics}
            onChange={v => onChange({ evaluationMetrics: v })}
          />
          <FieldHint>Select all that apply. Minimum 2 required.</FieldHint>
        </div>

        {/* Estimated reward preview */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(56,189,248,0.02) 100%)",
            border: "1px solid rgba(56,189,248,0.15)",
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(56,189,248,0.1)" }}>
            <span style={{ color: "#38bdf8", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              ESTIMATED REWARD PREVIEW
            </span>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {[
              { k: "Base reward (size)", v: data.datasetSize ? `${Math.min(50, Math.floor(parseInt(data.datasetSize || "0") / 5000)).toFixed(1)} TAO` : "—" },
              { k: "Metrics bonus", v: data.evaluationMetrics.length >= 3 ? `+${(data.evaluationMetrics.length * 0.8).toFixed(1)} TAO` : "+0.0 TAO" },
              { k: "Schema bonus", v: data.schemaFile ? "+2.0 TAO" : "+0.0 TAO" },
            ].map(({ k, v }) => (
              <div key={k} className="flex items-center justify-between">
                <span style={{ color: "#475569", fontSize: "0.74rem" }}>{k}</span>
                <span style={{ color: "#94a3b8", fontSize: "0.74rem", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div className="pt-2 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>Total estimate</span>
              <div className="flex items-baseline gap-1">
                <span style={{ color: "#22c55e", fontSize: "1rem", fontWeight: 800 }}>
                  ~{(Math.min(50, Math.floor(parseInt(data.datasetSize || "0") / 5000)) + (data.evaluationMetrics.length >= 3 ? data.evaluationMetrics.length * 0.8 : 0) + (data.schemaFile ? 2 : 0)).toFixed(1)}
                </span>
                <span style={{ color: "#475569", fontSize: "0.72rem" }}>TAO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
