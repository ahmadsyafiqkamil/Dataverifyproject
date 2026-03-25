import { useState } from "react";
import { useNavigate } from "react-router";
import { Wallet, Zap, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../api/hooks/useAuth";

type Status = "idle" | "loading" | "error";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginDemo, loginWithWallet, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Already logged in → redirect
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleDemo() {
    setStatus("loading");
    setError(null);
    const result = await loginDemo();
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setStatus("error");
      setError(result.error ?? "Demo login gagal");
    }
  }

  async function handleWalletConnect() {
    setStatus("loading");
    setError(null);
    try {
      const { web3Enable, web3Accounts, web3FromAddress } = await import(
        "@polkadot/extension-dapp"
      );

      const extensions = await web3Enable("DataVerify");
      if (extensions.length === 0) {
        setStatus("error");
        setError(
          "Wallet extension tidak ditemukan. Install Talisman atau Polkadot.js, lalu coba lagi."
        );
        return;
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        setStatus("error");
        setError("Tidak ada akun ditemukan di wallet. Buat akun Bittensor terlebih dahulu.");
        return;
      }

      // Use first account (can be expanded to account picker later)
      const account = accounts[0];
      const address = account.address;

      const result = await loginWithWallet(address, async (nonce: string) => {
        const injector = await web3FromAddress(address);
        const signRaw = injector?.signer?.signRaw;
        if (!signRaw) throw new Error("Signer tidak tersedia");
        const { signature } = await signRaw({
          address,
          data: nonce,
          type: "bytes",
        });
        return signature;
      });

      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setStatus("error");
        setError(result.error ?? "Verifikasi gagal");
      }
    } catch (e: unknown) {
      setStatus("error");
      if (e instanceof Error && e.message.includes("dibatalkan")) {
        setError("Signing dibatalkan. Coba lagi atau gunakan Try Demo.");
      } else {
        setError("Terjadi kesalahan. Gunakan Try Demo untuk melihat demo.");
      }
    }
  }

  const isLoading = status === "loading";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#0f172a",
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 60%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(56,189,248,0.15)",
          boxShadow: "0 0 60px rgba(56,189,248,0.06)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#38bdf8" }} />
            <span style={{ color: "#38bdf8", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              BITTENSOR SUBNET
            </span>
          </div>
          <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            DataVerify
          </h1>
          <p style={{ color: "#475569", fontSize: "0.9rem", marginTop: "6px" }}>
            Marketplace synthetic data terdesentralisasi
          </p>
        </div>

        {/* Error banner */}
        {status === "error" && error && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-6"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <AlertCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#fca5a5", fontSize: "0.85rem", lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* Try Demo — primary CTA */}
        <button
          onClick={handleDemo}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl mb-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.95rem",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Zap size={18} />
          )}
          Try Demo (tanpa wallet)
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <span style={{ color: "#334155", fontSize: "0.75rem" }}>atau</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Wallet Connect */}
        <button
          onClick={handleWalletConnect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "rgba(56,189,248,0.06)",
            border: "1px solid rgba(56,189,248,0.2)",
            color: "#38bdf8",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Wallet size={18} />
          Connect Wallet (Talisman / Polkadot.js)
        </button>

        <p style={{ color: "#1e293b", fontSize: "0.72rem", textAlign: "center", marginTop: "20px" }}>
          Dengan login kamu menyetujui ketentuan penggunaan DataVerify Subnet
        </p>
      </div>
    </div>
  );
}
