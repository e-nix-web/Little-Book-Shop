import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .restoreSession()
      .then(setUser)
      .catch((error) => console.error("Could not restore demo session:", error))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        const profile = await authService.signIn(email, password);
        setUser(profile);
        return profile;
      },
      async signUp(name, email) {
        const profile = await authService.signUp(name, email);
        setUser(profile);
        return profile;
      },
      updateProfile(name) {
        const updated = authService.updateProfile(user, name);
        setUser(updated);
        return updated;
      },
      signOut() {
        authService.signOut();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
