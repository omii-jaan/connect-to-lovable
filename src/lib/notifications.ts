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
import { db, auth } from "@/lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

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

const MOCK_TEST_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  user_a: [
    {
      id: "mock_1",
      uid: "user_a",
      actorUid: "user_b",
      actorName: "Priya Sharma",
      actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
      type: "like",
      targetId: "proj_1",
      title: "Priya Sharma liked Neural Canvas",
      text: "Neural Canvas - AI Art Generator",
      link: "/projects/proj_1",
      read: false,
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 },
    },
    {
      id: "mock_2",
      uid: "user_a",
      actorUid: "user_b",
      actorName: "Priya Sharma",
      actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
      type: "comment",
      targetId: "proj_1",
      title: "Priya Sharma commented on Neural Canvas",
      text: "Great implementation of the diffusion model pipeline!",
      link: "/projects/proj_1",
      read: true,
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    },
  ],
  user_b: [
    {
      id: "mock_3",
      uid: "user_b",
      actorUid: "user_a",
      actorName: "Alex Rivera",
      actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=00f2ff",
      type: "follow",
      title: "Alex Rivera started following you",
      link: "/builder/user_a",
      read: false,
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800, nanoseconds: 0 },
    },
  ]
};

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

  if (!auth.currentUser) {
    if (!MOCK_TEST_NOTIFICATIONS[recipientUid]) {
      MOCK_TEST_NOTIFICATIONS[recipientUid] = [];
    }
    const newNotif: NotificationItem = {
      id: notifId,
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
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
    };
    MOCK_TEST_NOTIFICATIONS[recipientUid].unshift(newNotif);
    return;
  }

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
    handleFirestoreError(err, OperationType.WRITE, `notifications/${notifId}`);
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

  // If the user is using a test account or guest mode and is not signed in to Firebase Auth as userId,
  // serve local test notifications instead of triggering Firestore Security Rule errors.
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    const mockList = MOCK_TEST_NOTIFICATIONS[userId] || [];
    const unread = mockList.filter((n) => !n.read).length;
    onUpdate(mockList, unread);
    return () => {};
  }

  const pathForOnSnapshot = "notifications";
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
          const ca = a.createdAt as { toMillis?: () => number; seconds?: number } | undefined;
          const cb = b.createdAt as { toMillis?: () => number; seconds?: number } | undefined;
          const tA = ca?.toMillis ? ca.toMillis() : ca?.seconds ? ca.seconds * 1000 : 0;
          const tB = cb?.toMillis ? cb.toMillis() : cb?.seconds ? cb.seconds * 1000 : 0;
          return tB - tA;
        });

        const unread = list.filter((n) => !n.read).length;
        onUpdate(list, unread);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
        const fallback = MOCK_TEST_NOTIFICATIONS[userId] || [];
        onUpdate(fallback, fallback.filter((n) => !n.read).length);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForOnSnapshot);
    const fallback = MOCK_TEST_NOTIFICATIONS[userId] || [];
    onUpdate(fallback, fallback.filter((n) => !n.read).length);
    return () => {};
  }
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(notifId: string): Promise<void> {
  if (!notifId) return;

  if (!auth.currentUser) {
    Object.values(MOCK_TEST_NOTIFICATIONS).forEach((list) => {
      const item = list.find((n) => n.id === notifId);
      if (item) item.read = true;
    });
    return;
  }

  try {
    const ref = doc(db, "notifications", notifId);
    await updateDoc(ref, { read: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `notifications/${notifId}`);
  }
}

/**
 * Marks all unread notifications as read for a given user.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  if (!userId) return;

  if (!auth.currentUser) {
    if (MOCK_TEST_NOTIFICATIONS[userId]) {
      MOCK_TEST_NOTIFICATIONS[userId].forEach((n) => (n.read = true));
    }
    return;
  }

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
    handleFirestoreError(err, OperationType.UPDATE, "notifications");
  }
}

