import { ShieldCheck } from "lucide-react";

export function ValidatorPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.06) 100%)", border: "1px solid rgba(168,85,247,0.25)" }}
      >
        <ShieldCheck size={24} style={{ color: "#a855f7" }} />
      </div>
      <div>
        <h2 style={{ color: "white", fontSize: "1.2rem", fontWeight: 700, textAlign: "center" }}>{title}</h2>
        <p style={{ color: "#475569", fontSize: "0.85rem", textAlign: "center", marginTop: "6px" }}>
          This section is under construction for DataVerify Subnet.
        </p>
      </div>
    </div>
  );
}
