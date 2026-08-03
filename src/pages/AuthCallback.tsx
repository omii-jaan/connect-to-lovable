import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { notify as toast } from "@/lib/notify";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
      if (error) {
        toast.error(`Auth failed: ${error.message}`);
        navigate("/login");
      } else {
        toast.success("Welcome aboard! Docked successfully.");
        navigate("/dashboard");
      }
    };
    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-canvas-dots px-6">
      <div className="text-center">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-mono text-sm">Finalizing dock...</p>
      </div>
    </div>
  );
};

export default AuthCallback;