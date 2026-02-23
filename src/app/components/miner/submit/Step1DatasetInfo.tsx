import { useState, useRef } from "react";
import { Upload, FileJson, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Label, FieldHint, TextInput, Textarea, Select, SegmentedToggle } from "./FormPrimitives";
import type { FormData } from "../../miner/submit/types";

interface Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}

function FileDropZone({ file, onFile, onClear }: { file: File | null; onFile: (f: File) => void; onClear: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!f.name.endsWith(".json")) { setError("Only .json files are accepted"); return; }
    setError("");
    onFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".json")) { setError("Only .json files are accepted"); return; }
    setError("");
    onFile(f);
  };

  if (file) {
    return (
      <div
        className="flex items-center justify-between px-4 py-3.5 rounded-xl"
        style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <FileJson size={16} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 600 }}>{file.name}</div>
            <div style={{ color: "#475569", fontSize: "0.7rem" }}>{(file.size / 1024).toFixed(1)} KB · JSON</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
          <button
            type="button"
            onClick={onClear}
            className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X size={13} style={{ color: "#64748b" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          backgroundColor: dragging ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.02)",
          border: `2px dashed ${dragging ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.08)"}`,
          padding: "28px 16px",
          boxShadow: dragging ? "0 0 20px rgba(56,189,248,0.08) inset" : "none",
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => ref.current?.click()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: dragging ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${dragging ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <Upload size={20} style={{ color: dragging ? "#38bdf8" : "#475569" }} />
        </div>
        <div className="text-center">
          <p style={{ color: dragging ? "#38bdf8" : "#64748b", fontSize: "0.82rem", fontWeight: 600 }}>
            {dragging ? "Drop to upload" : "Upload JSON file"}
          </p>
          <p style={{ color: "#334155", fontSize: "0.72rem", marginTop: "3px" }}>
            Drag & drop or <span style={{ color: "#38bdf8", textDecoration: "underline" }}>browse</span> · .json only
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          <FileJson size={11} style={{ color: "#38bdf8" }} />
          <span style={{ color: "#38bdf8", fontSize: "0.68rem" }}>Reference statistics · marginal distributions</span>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle size={13} style={{ color: "#ef4444" }} />
          <span style={{ color: "#ef4444", fontSize: "0.72rem" }}>{error}</span>
        </div>
      )}
      <input ref={ref} type="file" accept=".json" className="hidden" onChange={handleChange} />
    </div>
  );
}

export function Step1DatasetInfo({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
      {/* ── LEFT COLUMN ── */}
      <div className="flex flex-col gap-5">

        {/* Dataset Name */}
        <div>
          <Label required>Dataset Name</Label>
          <TextInput
            type="text"
            placeholder="e.g. Healthcare-Tabular-v2-2026"
            value={data.datasetName}
            onChange={e => onChange({ datasetName: e.target.value })}
          />
          <FieldHint>Use a descriptive, versioned name for tracking purposes.</FieldHint>
        </div>

        {/* Domain */}
        <div>
          <Label required>Domain</Label>
          <Select value={data.domain} onChange={e => onChange({ domain: e.target.value })}>
            <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select a domain…</option>
            {["Healthcare", "Finance", "NLP", "Autonomous Vehicles", "Computer Vision"].map(d => (
              <option key={d} value={d} style={{ backgroundColor: "#0b1628", color: "white" }}>{d}</option>
            ))}
          </Select>
          <FieldHint>The real-world domain your synthetic data represents.</FieldHint>
        </div>

        {/* Data Type */}
        <div>
          <Label required>Data Type</Label>
          <SegmentedToggle
            options={["Tabular", "Image", "Text", "Time Series"]}
            value={data.dataType}
            onChange={v => onChange({ dataType: v })}
          />
          <FieldHint>Determines which evaluation pipeline is applied.</FieldHint>
        </div>

        {/* Description */}
        <div>
          <Label required>Description</Label>
          <Textarea
            rows={4}
            placeholder="Describe the synthetic dataset: generation approach, real-world source analog, any notable characteristics or limitations…"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
          />
          <div className="flex items-center justify-between mt-1">
            <FieldHint>Shown to verifiers and marketplace buyers.</FieldHint>
            <span style={{ color: data.description.length > 480 ? "#ef4444" : "#334155", fontSize: "0.65rem" }}>
              {data.description.length}/500
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="flex flex-col gap-5">

        {/* Dataset Size */}
        <div>
          <Label required>Dataset Size</Label>
          <TextInput
            type="number"
            placeholder="240000"
            suffix="records"
            value={data.datasetSize}
            onChange={e => onChange({ datasetSize: e.target.value })}
            min={1}
          />
          <FieldHint>Total number of synthetic rows / samples / documents.</FieldHint>
        </div>

        {/* Generation Method */}
        <div>
          <Label required>Generation Method</Label>
          <Select value={data.generationMethod} onChange={e => onChange({ generationMethod: e.target.value })}>
            <option value="" disabled style={{ backgroundColor: "#0b1628", color: "#475569" }}>Select method…</option>
            {[
              { v: "CTGAN",           l: "CTGAN — Conditional Tabular GAN" },
              { v: "GAN",             l: "GAN — Generative Adversarial Network" },
              { v: "Diffusion",       l: "Diffusion Model" },
              { v: "VAE",             l: "VAE — Variational Autoencoder" },
              { v: "TimeGAN",         l: "TimeGAN — Time-series GAN" },
              { v: "Other",           l: "Other / Custom" },
            ].map(({ v, l }) => (
              <option key={v} value={v} style={{ backgroundColor: "#0b1628", color: "white" }}>{l}</option>
            ))}
          </Select>
          <FieldHint>The generative model architecture used to produce the data.</FieldHint>
        </div>

        {/* Intended Use Case */}
        <div>
          <Label>Intended Use Case</Label>
          <TextInput
            type="text"
            placeholder="e.g. ML model pre-training, bias testing, benchmarking…"
            value={data.intendedUseCase}
            onChange={e => onChange({ intendedUseCase: e.target.value })}
          />
          <FieldHint>Helps verifiers calibrate quality benchmarks appropriately.</FieldHint>
        </div>

        {/* Reference Stats Upload */}
        <div>
          <Label>Reference Statistics</Label>
          <FileDropZone
            file={data.referenceStatsFile ?? null}
            onFile={f => onChange({ referenceStatsFile: f })}
            onClear={() => onChange({ referenceStatsFile: null })}
          />
          <FieldHint>Optional: Upload marginal distribution stats from the real dataset for fidelity scoring.</FieldHint>
        </div>
      </div>
    </div>
  );
}
