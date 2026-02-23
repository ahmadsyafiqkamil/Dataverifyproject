import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{
          backgroundColor: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.2)",
        }}
      >
        <Construction size={32} style={{ color: "#38bdf8" }} />
      </div>
      <h2 style={{ color: "white", fontSize: "1.2rem", fontWeight: 600 }}>{title}</h2>
      <p style={{ color: "#475569", fontSize: "0.88rem", marginTop: "8px" }}>
        This section is under construction
      </p>
    </div>
  );
}
