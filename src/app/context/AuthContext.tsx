import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AuthState {
  token: string | null;
  address: string | null;
  role: string | null;
  isDemo: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth: (token: string, address: string, role: string, isDemo: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem("dv_token");
    if (!token) return { token: null, address: null, role: null, isDemo: false };
    // Decode JWT payload (client-side only — not verified, just read claims)
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem("dv_token");
      return { token: null, address: null, role: null, isDemo: false };
    }
    return { token, address: payload.sub, role: payload.role, isDemo: payload.is_demo ?? false };
  } catch {
    localStorage.removeItem("dv_token");
    return { token: null, address: null, role: null, isDemo: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const setAuth = useCallback((token: string, address: string, role: string, isDemo: boolean) => {
    localStorage.setItem("dv_token", token);
    setState({ token, address, role, isDemo });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dv_token");
    setState({ token: null, address: null, role: null, isDemo: false });
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout, isAuthenticated: !!state.token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
