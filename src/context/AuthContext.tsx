import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { notify as toast } from "@/lib/notify";

export const TEST_USERS = {
  user_a: {
    id: "user_a",
    email: "alex@shipyards.dev",
    user_metadata: {
      full_name: "Alex Rivera",
      user_name: "alex_builds",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=00f2ff",
      role: "AI Architect",
    }
  },
  user_b: {
    id: "user_b",
    email: "priya@shipyards.dev",
    user_metadata: {
      full_name: "Priya Sharma",
      user_name: "priya_ships",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
      role: "ML Engineer",
    }
  }
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  activeUserId: string;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  switchTestUser: (key: "user_a" | "user_b" | "none") => void;
  activeTestKey: "user_a" | "user_b" | "custom" | "none";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTestKey, setActiveTestKey] = useState<"user_a" | "user_b" | "custom" | "none">("user_a");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setSessionUser(session.user);
        setActiveTestKey("custom");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setSessionUser(session.user);
        setActiveTestKey("custom");
      } else {
        setSessionUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const switchTestUser = (key: "user_a" | "user_b" | "none") => {
    setActiveTestKey(key);
    if (key === "none") {
      toast("Switched to Guest mode");
    } else {
      const name = TEST_USERS[key].user_metadata.full_name;
      toast(`Switched active user to ${name} (${key})`);
    }
  };

  const currentUser: User | null =
    activeTestKey === "custom" && sessionUser
      ? sessionUser
      : activeTestKey === "user_a"
      ? (TEST_USERS.user_a as unknown as User)
      : activeTestKey === "user_b"
      ? (TEST_USERS.user_b as unknown as User)
      : null;

  const activeUserId = currentUser?.id || "";

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
    return { error };
  };

  const signOut = async () => {
    setActiveTestKey("none");
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        session,
        loading,
        activeUserId,
        signInWithGithub,
        signInWithGoogle,
        signOut,
        switchTestUser,
        activeTestKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};