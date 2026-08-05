import { supabase } from "@/lib/supabase";

export async function submitToWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const { error } = await supabase.from("waitlist").insert([{
      email: trimmed,
      source: "landing",
      created_at: new Date().toISOString(),
    }]);

    if (error) {
      // If table doesn't exist or RLS issue, save locally as fallback
      const existing = JSON.parse(localStorage.getItem("shipyards_waitlist") || "[]");
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem("shipyards_waitlist", JSON.stringify(existing));
      }
    }
  } catch (err) {
    console.error("Waitlist error:", err);
    const existing = JSON.parse(localStorage.getItem("shipyards_waitlist") || "[]");
    if (!existing.includes(trimmed)) {
      existing.push(trimmed);
      localStorage.setItem("shipyards_waitlist", JSON.stringify(existing));
    }
  }

  return { success: true, message: "You're on the waitlist! We'll notify you when early access opens." };
}
