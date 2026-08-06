import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function submitToWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    await addDoc(collection(db, "waitlist"), {
      email: trimmed,
      source: "landing",
      createdAt: serverTimestamp(),
    });
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
