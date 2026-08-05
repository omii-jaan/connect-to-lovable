import {
  collection,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface NotificationItem {
  id: string;
  uid: string;           // Recipient user ID
  actorUid: string;      // Actor user ID
  actorName?: string;
  actorAvatar?: string;
  type: "like" | "comment" | "follow" | "contract" | "system";
  targetId?: string;     // e.g. projectId, commentId, etc.
  title: string;
  text?: string;
  link: string;
  read: boolean;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | unknown;
}

/**
 * Creates or updates a notification in Firestore.
 * 
 * Rules enforced:
 * 1) No self-notifications: If actorUid === recipientUid, skip inserting.
 * 2) Rate/batch spam: Uses deterministic doc ID `${recipientUid}_${actorUid}_${type}_${targetId || "global"}`
 *    so re-triggering overwrites createdAt and resets read: false without creating duplicate items.
 */
export async function sendNotification(params: {
  recipientUid: string;
  actorUid: string;
  actorName?: string;
  actorAvatar?: string;
  type: "like" | "comment" | "follow" | "contract" | "system";
  targetId?: string;
  title: string;
  text?: string;
  link: string;
}): Promise<void> {
  const { recipientUid, actorUid, actorName, actorAvatar, type, targetId, title, text, link } = params;

  // 1) No self-notifications
  if (!recipientUid || !actorUid || recipientUid === actorUid) {
    return;
  }

  // 2) Deterministic notification ID for rate/batch spam prevention
  const notifId = `${recipientUid}_${actorUid}_${type}_${targetId || "global"}`;

  try {
    const ref = doc(db, "notifications", notifId);
    await setDoc(
      ref,
      {
        uid: recipientUid,
        actorUid,
        actorName: actorName || "A builder",
        actorAvatar: actorAvatar || "",
        type,
        targetId: targetId || "",
        title,
        text: text || "",
        link,
        read: false,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error sending notification to Firestore:", err);
  }
}

/**
 * Subscribes to real-time notifications for a user.
 */
export function subscribeToNotifications(
  userId: string,
  onUpdate: (notifications: NotificationItem[], unreadCount: number) => void
) {
  if (!userId) {
    onUpdate([], 0);
    return () => {};
  }

  try {
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list: NotificationItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NotificationItem, "id">),
        }));

        // Sort by createdAt descending
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const tB = b.createdAt?.toMillis?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return tB - tA;
        });

        const unread = list.filter((n) => !n.read).length;
        onUpdate(list, unread);
      },
      (error) => {
        console.error("Error listening to notifications:", error);
      }
    );
  } catch (err) {
    console.error("Failed to setup notification listener:", err);
    return () => {};
  }
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(notifId: string): Promise<void> {
  if (!notifId) return;
  try {
    const ref = doc(db, "notifications", notifId);
    await updateDoc(ref, { read: true });
  } catch (err) {
    console.error("Error marking notification read:", err);
  }
}

/**
 * Marks all unread notifications as read for a given user.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", userId),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  } catch (err) {
    console.error("Error marking all notifications read:", err);
  }
}
