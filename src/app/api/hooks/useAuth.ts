import { useAuthContext } from "../../context/AuthContext";
import { apiPost } from "../client";

export function useAuth() {
  const { setAuth, logout, isAuthenticated, address, isDemo } = useAuthContext();

  async function loginDemo(): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiPost<{ token: string; address: string; role: string; is_demo: boolean }>(
        "/api/auth/demo"
      );
      if (res.success && res.data) {
        setAuth(res.data.token, res.data.address, res.data.role, res.data.is_demo);
        return { success: true };
      }
      return { success: false, error: res.error ?? "Demo login gagal" };
    } catch {
      return { success: false, error: "Server tidak tersedia. Gunakan Try Demo untuk melihat demo." };
    }
  }

  async function loginWithWallet(
    address: string,
    signFn: (nonce: string) => Promise<string>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: get nonce
      const challengeRes = await apiPost<{ nonce: string }>("/api/auth/challenge", { address });
      if (!challengeRes.success || !challengeRes.data) {
        return { success: false, error: "Gagal mendapatkan challenge dari server" };
      }
      const { nonce } = challengeRes.data;

      // Step 2: sign nonce with wallet
      const signature = await signFn(nonce);

      // Step 3: verify signature
      const verifyRes = await apiPost<{ token: string; address: string; role: string; is_demo: boolean }>(
        "/api/auth/verify",
        { address, signature, nonce }
      );
      if (verifyRes.success && verifyRes.data) {
        setAuth(verifyRes.data.token, verifyRes.data.address, verifyRes.data.role, verifyRes.data.is_demo);
        return { success: true };
      }
      return { success: false, error: verifyRes.error ?? "Verifikasi gagal" };
    } catch {
      return { success: false, error: "Terjadi kesalahan. Coba lagi." };
    }
  }

  return { loginDemo, loginWithWallet, logout, isAuthenticated, address, isDemo };
}
