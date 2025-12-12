import { create } from "zustand";
import { signIn as nextSignIn, signOut as nextSignOut } from "next-auth/react";

type AuthState = {
  token: string | null;
  user: any | null;
  setAuth: (token: string, user: any) => void;
  clearAuth: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ token, user });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null });
  },

  login: async (username, password) => {
    const res = await nextSignIn("credentials", {
      redirect: false,
      username,
      password,
    });

    console.log("SIGN-IN RESPONSE:", res);

    if (res?.ok) {
      // Fetch session manually (App Router compatible)
      const sess = await fetch("/api/auth/session").then((r) => r.json());

      console.log("SESSION RECEIVED:", sess);

      const token = sess?.accessToken;
      const user = sess?.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        set({ token, user });
        return true;
      }
    }

    return false;
  },

  logout: () => {
    nextSignOut({ redirect: false });

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    set({ token: null, user: null });
  },
}));
