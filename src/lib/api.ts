import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { SEEDED_BUILDERS, computeProjectMatches } from "@/lib/match-engine";
import { sendNotification } from "@/lib/notifications";
import type { ContractMilestone, MarketplaceApplication, Profile, MarketplaceProject, Contract, ContractTerms, ContractRatingStatus, Rating } from "@/types";

export const profileApi = {
  async getCurrent(userId?: string) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return null;

    try {
      const snap = await getDoc(doc(db, "profiles", uid));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn("Failed to fetch profile:", e);
    }
    return null;
  },

  async getById(id: string) {
    const snap = await getDoc(doc(db, "profiles", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async getByUsername(username: string) {
    const q = query(collection(db, "profiles"), where("username", "==", username), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const first = snap.docs[0];
      return { id: first.id, ...first.data() };
    }
    return null;
  },

  async update(
    updates: Partial<{
      username: string;
      full_name: string;
      bio: string;
      stack: string[];
      social_links: Record<string, string>;
      avatar_url: string;
    }>,
    userId?: string
  ) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("Not authenticated");

    const ref = doc(db, "profiles", uid);
    await setDoc(ref, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  async uploadAvatar(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

export const projectApi = {
  async getAll(filters?: {
    builder_id?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let q = query(collection(db, "projects"));
      if (filters?.builder_id) {
        q = query(q, where("ownerUid", "==", filters.builder_id));
      }
      if (filters?.category) {
        q = query(q, where("category", "==", filters.category));
      }
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore projects load error, returning empty list", err);
      return [];
    }
  },

  async getById(id: string) {
    const snap = await getDoc(doc(db, "projects", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async create(
    project: {
      title: string;
      description?: string;
      github_repo_full_name?: string;
      github_repo_url?: string;
      live_url?: string;
      demo_video_url?: string;
      category?: string;
      category_color?: "cyan" | "purple" | "green" | "orange";
      stack?: string[];
    },
    userId?: string
  ) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("Not authenticated");

    const newRef = doc(collection(db, "projects"));
    const newProject = {
      ...project,
      ownerUid: uid,
      builder_id: uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
    };
    await setDoc(newRef, newProject);
    return { id: newRef.id, ...newProject };
  },

  async update(id: string, updates: Partial<{
    title: string;
    description: string;
    live_url: string;
    demo_video_url: string;
    category: string;
    category_color: "cyan" | "purple" | "green" | "orange";
    stack: string[];
    status: "draft" | "docked" | "verified" | "archived";
    is_featured: boolean;
  }>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const ref = doc(db, "projects", id);
    await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  async delete(id: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const ref = doc(db, "projects", id);
    await deleteDoc(ref);
    return true;
  },

  async incrementViews(id: string) {
    try {
      const ref = doc(db, "projects", id);
      await updateDoc(ref, { viewsCount: increment(1) });
    } catch (err) {
      // non-critical
    }
  },
};

export const contractApi = {
  async getAll(filters?: {
    builder_id?: string;
    founder_id?: string;
    status?: string;
  }) {
    try {
      const snap = await getDocs(collection(db, "contracts"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      return [];
    }
  },

  async getById(id: string) {
    const snap = await getDoc(doc(db, "contracts", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async create(contract: {
    project_id?: string;
    founder_id: string;
    builder_id: string;
    title: string;
    description?: string;
    amount_usd: number;
    milestones: ContractMilestone[];
    deadline?: string;
  }) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const newRef = doc(collection(db, "contracts"));
    const data = {
      ...contract,
      founder_id: user.uid,
      createdAt: new Date().toISOString(),
      status: "pending",
      payment_status: "unpaid",
    };
    await setDoc(newRef, data);
    return { id: newRef.id, ...data };
  },

  async update(id: string, updates: Partial<{
    status: "pending" | "active" | "completed" | "cancelled" | "disputed";
    payment_status: "unpaid" | "escrowed" | "released" | "refunded";
    milestones: ContractMilestone[];
  }>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const ref = doc(db, "contracts", id);
    await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },
};

export const marketplaceApi = {
  async getAll() {
    try {
      const q = query(collection(db, "marketplaceProjects"));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return items;
    } catch (err) {
      console.warn("Error fetching marketplaceProjects from Firestore:", err);
      return [];
    }
  },

  async getBySlugOrId(slugOrId: string) {
    try {
      // First try by ID
      const docRef = doc(db, "marketplaceProjects", slugOrId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // Query by slug
      const q = query(collection(db, "marketplaceProjects"), where("slug", "==", slugOrId), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
      }
    } catch (err) {
      console.warn("Error getting marketplaceProject by slug/id:", err);
    }
    return null;
  },

  async getUserProjects(uid: string) {
    if (!uid) return [];
    try {
      const q = query(
        collection(db, "marketplaceProjects"),
        where("creatorUid", "==", uid)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn("Error fetching founder user projects:", e);
      return [];
    }
  },

  async create(data: {
    title: string;
    category: string;
    description: string;
    requirements: string[];
    budgetType: "Fixed" | "Hourly" | "Range";
    budgetMin: number;
    budgetMax: number;
    currency: string;
    timelineStart?: string;
    timelineEnd?: string;
    timelineWeeks: number;
    skills: string[];
    techStack: string[];
    complexity: "low" | "medium" | "high" | "critical";
    teamSize: string;
    remote: boolean;
    ndaRequired: boolean;
    visibility: "public" | "invite-only";
    featured: boolean;
  }) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to post a project.");

    // Generate unique slug
    const cleanTitle = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${cleanTitle}-${Math.random().toString(36).substring(2, 7)}`;

    const newDocRef = doc(collection(db, "marketplaceProjects"));
    const newProject = {
      ...data,
      slug,
      creatorUid: user.uid,
      status: "open",
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(newDocRef, newProject);
    return { id: newDocRef.id, ...newProject };
  },

  async incrementViews(id: string) {
    try {
      const ref = doc(db, "marketplaceProjects", id);
      await updateDoc(ref, { viewsCount: increment(1) });
    } catch (e) {
      // non-critical
    }
  },

  async applyToProject(data: {
    projectId: string;
    pitch: string;
    links?: string[];
    proposedRate: number;
    proposedTimelineWeeks: number;
  }) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to submit an application.");

    // Prevent duplicate active application (pending or accepted)
    const existing = await this.getUserApplication(data.projectId, user.uid);
    if (existing && (existing.status === "pending" || existing.status === "accepted")) {
      throw new Error("You already have an active application submitted for this project scope.");
    }

    const appRef = doc(collection(db, "applications"));
    const newApp = {
      projectId: data.projectId,
      marketplaceProjectId: data.projectId,
      builderUid: user.uid,
      pitch: data.pitch,
      links: data.links || [],
      proposedRate: data.proposedRate,
      proposedTimelineWeeks: data.proposedTimelineWeeks,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(appRef, newApp);

    // Try incrementing project applicationsCount
    try {
      const projRef = doc(db, "marketplaceProjects", data.projectId);
      await updateDoc(projRef, { applicationsCount: increment(1) });
    } catch (e) {
      // non-blocking if rules or doc structure differ
    }

    return { id: appRef.id, ...newApp };
  },

  async getUserApplication(projectId: string, builderUid: string) {
    if (!builderUid || !projectId) return null;
    try {
      const q = query(
        collection(db, "applications"),
        where("projectId", "==", projectId),
        where("builderUid", "==", builderUid),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
      console.warn("Error fetching user application:", e);
    }
    return null;
  },

  async getProjectApplications(projectId: string) {
    if (!projectId) return [];
    try {
      const q = query(
        collection(db, "applications"),
        where("projectId", "==", projectId)
      );
      const snap = await getDocs(q);
      const apps = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

      // Enrich with builder profiles if available
      const enriched = await Promise.all(
        apps.map(async (app) => {
          const appObj = app as unknown as MarketplaceApplication;
          try {
            if (appObj.builderUid) {
              const pDoc = await getDoc(doc(db, "profiles", appObj.builderUid));
              if (pDoc.exists()) {
                return { ...appObj, builder: { id: pDoc.id, ...pDoc.data() } as unknown as Profile };
              }
            }
          } catch (e) {
            // fallback
          }
          return appObj;
        })
      );
      return enriched;
    } catch (e) {
      console.warn("Error fetching project applications:", e);
      return [];
    }
  },

  async getUserApplications(builderUid: string) {
    if (!builderUid) return [];
    try {
      const q = query(
        collection(db, "applications"),
        where("builderUid", "==", builderUid)
      );
      const snap = await getDocs(q);
      const apps = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

      // Enrich with project details
      const enriched = await Promise.all(
        apps.map(async (app) => {
          const appObj = app as unknown as MarketplaceApplication;
          try {
            const targetId = appObj.projectId || appObj.marketplaceProjectId;
            if (targetId) {
              const proj = await this.getBySlugOrId(targetId);
              if (proj) {
                return { ...appObj, project: proj as unknown as MarketplaceProject };
              }
            }
          } catch (e) {
            // fallback
          }
          return appObj;
        })
      );
      return enriched;
    } catch (e) {
      console.warn("Error fetching user applications:", e);
      return [];
    }
  },

  async updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected",
    extraData?: { projectId?: string; builderUid?: string; pitch?: string; proposedRate?: number; title?: string }
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to update application.");

    const appRef = doc(db, "applications", applicationId);
    await updateDoc(appRef, {
      status,
      updatedAt: new Date().toISOString(),
    });

    // If accepted, create an active contract doc in `contracts` collection
    if (status === "accepted" && extraData) {
      try {
        const now = new Date().toISOString();
        const contractRef = doc(collection(db, "contracts"));
        const newContract = {
          project_id: extraData.projectId || "",
          marketplaceProjectId: extraData.projectId || "",
          builder_id: extraData.builderUid || "",
          builderUid: extraData.builderUid || "",
          founder_id: user.uid,
          founderUid: user.uid,
          creatorUid: user.uid,
          title: extraData.title ? `Contract: ${extraData.title}` : "Project Scope Contract",
          description: extraData.pitch || "Agreed scope contract.",
          status: "active",
          startedAt: now,
          started_at: now,
          completedAt: null,
          completed_at: null,
          terms: {
            budgetType: "Fixed",
            budgetMin: extraData.proposedRate || 0,
            budgetMax: extraData.proposedRate || 0,
            currency: "USD",
          },
          ratingStatus: {
            founder: false,
            builder: false,
          },
          amount_usd: extraData.proposedRate || 0,
          currency: "USD",
          payment_status: "unpaid",
          createdAt: now,
          created_at: now,
          updatedAt: now,
          updated_at: now,
        };
        await setDoc(contractRef, newContract);

        // Update project status to matched/in_progress
        if (extraData.projectId) {
          const projRef = doc(db, "marketplaceProjects", extraData.projectId);
          await updateDoc(projRef, { status: "matched", updatedAt: now });
        }

        // Notify builder
        if (extraData.builderUid) {
          sendNotification({
            recipientUid: extraData.builderUid,
            actorUid: user.uid,
            actorName: user.displayName || user.email?.split("@")[0] || "Founder",
            type: "contract",
            targetId: extraData.projectId || contractRef.id,
            title: `Contract Active for "${extraData.title || 'Project Scope'}"`,
            text: `Your proposal was accepted! Your scope contract is now active.`,
            link: `/dashboard?tab=contracts`,
          });
        }
      } catch (err) {
        console.warn("Error creating contract:", err);
      }
    }

    return { id: applicationId, status };
  },

  async computeMatches(projectId: string, projectData?: Record<string, unknown>) {
    try {
      const response = await fetch("/api/match-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, project: projectData }),
      });

      if (!response.ok) {
        throw new Error(`Match engine endpoint responded with status ${response.status}`);
      }

      const data = await response.json();
      const matches = data.matches || [];

      // Save matches to Firestore marketplaceProjects doc if possible
      try {
        if (projectId) {
          const ref = doc(db, "marketplaceProjects", projectId);
          await updateDoc(ref, { matches });
        }
      } catch (err) {
        // Non-blocking if offline/mock
      }

      return matches;
    } catch (err) {
      console.warn("Error computing AI matches from server engine, using client fallback:", err);
      const targetProj = projectData || { id: projectId };
      return computeProjectMatches(targetProj, SEEDED_BUILDERS);
    }
  },

  async checkExistingInvite(projectId: string, builderUid: string) {
    if (!projectId || !builderUid) return null;
    try {
      const q = query(
        collection(db, "invitations"),
        where("marketplaceProjectId", "==", projectId),
        where("builderUid", "==", builderUid),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
      const q2 = query(
        collection(db, "invitations"),
        where("projectId", "==", projectId),
        where("builderUid", "==", builderUid),
        limit(1)
      );
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        return { id: snap2.docs[0].id, ...snap2.docs[0].data() };
      }
    } catch (e) {
      console.warn("Error checking existing invite:", e);
    }
    return null;
  },

  async getProjectInvitations(projectId: string) {
    if (!projectId) return [];
    try {
      const q = query(
        collection(db, "invitations"),
        where("marketplaceProjectId", "==", projectId)
      );
      const snap = await getDocs(q);
      const invs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return invs;
    } catch (e) {
      console.warn("Error fetching project invitations:", e);
      return [];
    }
  },

  async sendInvitation(projectIdOrData: string | { projectId: string; builderUid: string; message?: string }, builderUidParam?: string, messageParam?: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to send invitation.");

    let projectId = "";
    let builderUid = "";
    let message = "";

    if (typeof projectIdOrData === "object") {
      projectId = projectIdOrData.projectId;
      builderUid = projectIdOrData.builderUid;
      message = projectIdOrData.message || "";
    } else {
      projectId = projectIdOrData;
      builderUid = builderUidParam || "";
      message = messageParam || "";
    }

    if (!projectId || !builderUid) {
      throw new Error("Missing projectId or builderUid for invitation.");
    }

    // Check for duplicate pending invitation
    const existing = await this.checkExistingInvite(projectId, builderUid);
    if (existing && (existing as unknown as { status: string }).status === "pending") {
      throw new Error("An active invitation has already been sent to this builder for this project.");
    }

    const invRef = doc(collection(db, "invitations"));
    const newInv = {
      marketplaceProjectId: projectId,
      projectId,
      founderUid: user.uid,
      creatorUid: user.uid,
      senderUid: user.uid,
      builderUid,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(invRef, newInv);
    return { id: invRef.id, ...newInv };
  },

  async getUserInvitations(builderUid: string) {
    if (!builderUid) return [];
    try {
      const q = query(
        collection(db, "invitations"),
        where("builderUid", "==", builderUid)
      );
      const snap = await getDocs(q);
      const invs = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

      // Enrich each invitation with project and founder profile details
      const enriched = await Promise.all(
        invs.map(async (inv) => {
          const invObj = inv as unknown as Invitation;
          const targetProjId = invObj.marketplaceProjectId || invObj.projectId;
          const founderUid = invObj.founderUid || invObj.creatorUid || invObj.senderUid;

          let projectData = null;
          let founderData = null;

          if (targetProjId) {
            try {
              projectData = await this.getBySlugOrId(targetProjId);
            } catch (e) {
              // fallback
            }
          }

          if (founderUid) {
            try {
              const fDoc = await getDoc(doc(db, "profiles", founderUid));
              if (fDoc.exists()) {
                founderData = { id: fDoc.id, ...fDoc.data() };
              }
            } catch (e) {
              // fallback
            }
          }

          return {
            ...invObj,
            project: projectData as unknown as MarketplaceProject,
            founder: founderData as unknown as Profile,
          };
        })
      );
      return enriched;
    } catch (e) {
      console.warn("Error fetching user invitations:", e);
      return [];
    }
  },

  async updateInvitationStatus(
    invitationId: string,
    status: "accepted" | "declined",
    extraData?: {
      projectId?: string;
      founderUid?: string;
      message?: string;
      projectTitle?: string;
      budgetMax?: number;
    }
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to respond to invitation.");

    const invRef = doc(db, "invitations", invitationId);
    await updateDoc(invRef, {
      status,
      updatedAt: new Date().toISOString(),
    });

    if (status === "accepted" && extraData) {
      try {
        const now = new Date().toISOString();
        const founderUid = extraData.founderUid || "";
        const contractRef = doc(collection(db, "contracts"));
        const newContract = {
          project_id: extraData.projectId || "",
          marketplaceProjectId: extraData.projectId || "",
          builder_id: user.uid,
          builderUid: user.uid,
          founder_id: founderUid,
          founderUid: founderUid,
          creatorUid: founderUid,
          title: extraData.projectTitle ? `Contract: ${extraData.projectTitle}` : "Project Scope Contract",
          description: extraData.message || "Agreed scope contract via invitation.",
          status: "active",
          startedAt: now,
          started_at: now,
          completedAt: null,
          completed_at: null,
          terms: {
            budgetType: "Fixed",
            budgetMin: extraData.budgetMax || 0,
            budgetMax: extraData.budgetMax || 0,
            currency: "USD",
          },
          ratingStatus: {
            founder: false,
            builder: false,
          },
          amount_usd: extraData.budgetMax || 0,
          currency: "USD",
          payment_status: "unpaid",
          createdAt: now,
          created_at: now,
          updatedAt: now,
          updated_at: now,
        };
        await setDoc(contractRef, newContract);

        // Update project status to matched/in_progress
        if (extraData.projectId) {
          const projRef = doc(db, "marketplaceProjects", extraData.projectId);
          await updateDoc(projRef, { status: "matched", updatedAt: now });
        }

        // Notify founder
        if (founderUid) {
          sendNotification({
            recipientUid: founderUid,
            actorUid: user.uid,
            actorName: user.displayName || user.email?.split("@")[0] || "Builder",
            type: "contract",
            targetId: extraData.projectId || contractRef.id,
            title: `Contract Active for "${extraData.projectTitle || 'Project Scope'}"`,
            text: `Builder accepted your invitation! Your scope contract is now active.`,
            link: `/dashboard?tab=contracts`,
          });
        }
      } catch (err) {
        console.warn("Error creating contract for accepted invitation:", err);
      }
    }

    return { id: invitationId, status };
  },

  async getUserContracts(uid: string) {
    if (!uid) return [];
    try {
      const queries = [
        query(collection(db, "contracts"), where("founderUid", "==", uid)),
        query(collection(db, "contracts"), where("builderUid", "==", uid)),
        query(collection(db, "contracts"), where("creatorUid", "==", uid)),
        query(collection(db, "contracts"), where("founder_id", "==", uid)),
        query(collection(db, "contracts"), where("builder_id", "==", uid)),
      ];

      const results = await Promise.all(queries.map((q) => getDocs(q).catch(() => null)));
      const rawMap = new Map<string, Record<string, unknown>>();

      results.forEach((snap) => {
        if (snap) {
          snap.docs.forEach((d) => {
            if (!rawMap.has(d.id)) {
              rawMap.set(d.id, { id: d.id, ...d.data() });
            }
          });
        }
      });

      const rawContracts = Array.from(rawMap.values());

      const enriched = await Promise.all(
        rawContracts.map(async (c) => {
          const cObj = c as unknown as Contract;
          const targetProjId = cObj.marketplaceProjectId || cObj.projectId || cObj.project_id;
          const founderUid = cObj.founderUid || cObj.creatorUid || cObj.founder_id;
          const builderUid = cObj.builderUid || cObj.builder_id;

          let projectData: MarketplaceProject | null = null;
          let founderData: Profile | null = null;
          let builderData: Profile | null = null;

          if (targetProjId) {
            try {
              projectData = (await this.getBySlugOrId(targetProjId)) as unknown as MarketplaceProject;
            } catch (e) {
              // fallback
            }
          }

          if (founderUid) {
            try {
              const fDoc = await getDoc(doc(db, "profiles", founderUid));
              if (fDoc.exists()) {
                founderData = { id: fDoc.id, ...fDoc.data() } as unknown as Profile;
              }
            } catch (e) {
              // fallback
            }
          }

          if (builderUid) {
            try {
              const bDoc = await getDoc(doc(db, "profiles", builderUid));
              if (bDoc.exists()) {
                builderData = { id: bDoc.id, ...bDoc.data() } as unknown as Profile;
              }
            } catch (e) {
              // fallback
            }
          }

          const normalizedStatus = (cObj.status === "draft" ? "active" : cObj.status || "active") as Contract["status"];
          const normalizedTerms: ContractTerms = cObj.terms || {
            budgetType: projectData?.budgetType || "Fixed",
            budgetMin: cObj.amount_usd || projectData?.budgetMin || 0,
            budgetMax: cObj.amount_usd || projectData?.budgetMax || 0,
            currency: cObj.currency || projectData?.currency || "USD",
          };
          const normalizedRatingStatus: ContractRatingStatus = cObj.ratingStatus || { founder: false, builder: false };
          const startedAt = cObj.startedAt || cObj.started_at || cObj.createdAt || cObj.created_at || new Date().toISOString();
          const completedAt = cObj.completedAt || cObj.completed_at || null;

          return {
            ...cObj,
            founderUid,
            builderUid,
            marketplaceProjectId: targetProjId,
            status: normalizedStatus,
            terms: normalizedTerms,
            ratingStatus: normalizedRatingStatus,
            startedAt,
            completedAt,
            project: projectData || undefined,
            founder: founderData || undefined,
            builder: builderData || undefined,
          } as Contract;
        })
      );

      enriched.sort((a, b) => {
        const tA = new Date(a.startedAt || a.createdAt || a.created_at || 0).getTime();
        const tB = new Date(b.startedAt || b.createdAt || b.created_at || 0).getTime();
        return tB - tA;
      });

      return enriched;
    } catch (e) {
      console.warn("Error fetching user contracts:", e);
      return [];
    }
  },

  async completeContract(contractId: string, projectId?: string, builderUid?: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to complete contract.");

    const contractRef = doc(db, "contracts", contractId);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      throw new Error("Contract record not found.");
    }

    const cData = contractSnap.data() as Contract;
    const founderUid = cData.founderUid || cData.creatorUid || cData.founder_id;
    const targetBuilderUid = builderUid || cData.builderUid || cData.builder_id;
    const targetProjectId = projectId || cData.marketplaceProjectId || cData.projectId || cData.project_id;

    if (founderUid && founderUid !== user.uid) {
      throw new Error("Only the founder who issued this scope can mark the contract as completed.");
    }

    const completedTime = new Date().toISOString();

    await updateDoc(contractRef, {
      status: "completed",
      completedAt: completedTime,
      completed_at: completedTime,
      updatedAt: completedTime,
      updated_at: completedTime,
    });

    if (targetProjectId) {
      try {
        const projRef = doc(db, "marketplaceProjects", targetProjectId);
        await updateDoc(projRef, {
          status: "completed",
          updatedAt: completedTime,
        });
      } catch (err) {
        console.warn("Error updating project status to completed:", err);
      }
    }

    if (targetBuilderUid) {
      sendNotification({
        recipientUid: targetBuilderUid,
        actorUid: user.uid,
        actorName: user.displayName || user.email?.split("@")[0] || "Founder",
        type: "contract",
        targetId: targetProjectId || contractId,
        title: `Contract Completed for "${cData.title || 'Project Scope'}"`,
        text: `The founder marked your scope contract as completed. Ratings and reviews are unlocked!`,
        link: `/dashboard?tab=contracts`,
      });
    }

    return { id: contractId, status: "completed", completedAt: completedTime };
  },
};

export const ratingsApi = {
  async submitRating({
    contractId,
    raterUid,
    rateeUid,
    score,
    comment,
    role,
  }: {
    contractId: string;
    raterUid: string;
    rateeUid: string;
    score: number;
    comment: string;
    role: "founder" | "builder";
  }) {
    if (!contractId || !raterUid || !rateeUid) {
      throw new Error("Missing required parameters for submitting rating.");
    }

    // Deterministic doc ID: `${contractId}_${role}`
    const ratingDocId = `${contractId}_${role}`;
    const ratingRef = doc(db, "ratings", ratingDocId);
    const now = new Date().toISOString();

    const ratingData: Rating = {
      id: ratingDocId,
      contractId,
      raterUid,
      rateeUid,
      score: Math.min(5, Math.max(1, score)),
      comment: comment.trim(),
      role,
      createdAt: now,
    };

    // Save rating doc
    await setDoc(ratingRef, ratingData);

    // Update contract ratingStatus
    try {
      const contractRef = doc(db, "contracts", contractId);
      await setDoc(
        contractRef,
        {
          ratingStatus: {
            [role]: true,
          },
          updatedAt: now,
          updated_at: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Error updating contract ratingStatus:", e);
    }

    // Send notification to ratee (if raterUid !== rateeUid)
    if (raterUid !== rateeUid) {
      try {
        const raterDoc = await getDoc(doc(db, "profiles", raterUid));
        const raterName = raterDoc.exists()
          ? raterDoc.data().full_name || raterDoc.data().username || "User"
          : "User";

        await sendNotification({
          recipientUid: rateeUid,
          actorUid: raterUid,
          actorName: raterName,
          type: "contract",
          targetId: contractId,
          title: `New ${score}-Star Review Received`,
          text: `You received a ${score}-star rating & review for completed scope contract.`,
          link: `/dashboard?tab=contracts`,
        });
      } catch (e) {
        console.warn("Failed to send rating notification:", e);
      }
    }

    return ratingData;
  },

  async getUserRatings(rateeUid: string) {
    if (!rateeUid) return { ratings: [], average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

    try {
      const q = query(
        collection(db, "ratings"),
        where("rateeUid", "==", rateeUid)
      );
      const snap = await getDocs(q);
      const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Rating));

      // Enrich ratings with rater profile info
      const enriched = await Promise.all(
        raw.map(async (r) => {
          let raterProfile: Profile | undefined = undefined;
          if (r.raterUid) {
            try {
              const pDoc = await getDoc(doc(db, "profiles", r.raterUid));
              if (pDoc.exists()) {
                raterProfile = { id: pDoc.id, ...pDoc.data() } as Profile;
              }
            } catch (e) {
              // fallback
            }
          }
          return { ...r, rater: raterProfile };
        })
      );

      // Sort newest first
      enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Compute stats
      const count = enriched.length;
      const sum = enriched.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const average = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;

      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      enriched.forEach((r) => {
        const s = Math.min(5, Math.max(1, Math.round(r.score || 5)));
        distribution[s] = (distribution[s] || 0) + 1;
      });

      return {
        ratings: enriched,
        average,
        count,
        distribution,
      };
    } catch (e) {
      console.warn("Error getting user ratings:", e);
      return { ratings: [], average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }
  },

  async getFounderRating(founderUid: string) {
    if (!founderUid) return { average: 0, count: 0 };
    try {
      const q = query(
        collection(db, "ratings"),
        where("rateeUid", "==", founderUid)
      );
      const snap = await getDocs(q);
      if (snap.empty) return { average: 0, count: 0 };

      const docs = snap.docs.map((d) => d.data() as Rating);
      const count = docs.length;
      const sum = docs.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const average = parseFloat((sum / count).toFixed(1));

      return { average, count };
    } catch (e) {
      return { average: 0, count: 0 };
    }
  },

  async getContractRatings(contractId: string) {
    if (!contractId) return { founder: null, builder: null };
    try {
      const q = query(
        collection(db, "ratings"),
        where("contractId", "==", contractId)
      );
      const snap = await getDocs(q);
      let founderRating: Rating | null = null;
      let builderRating: Rating | null = null;

      snap.docs.forEach((d) => {
        const data = { id: d.id, ...d.data() } as Rating;
        if (data.role === "founder") founderRating = data;
        if (data.role === "builder") builderRating = data;
      });

      return { founder: founderRating, builder: builderRating };
    } catch (e) {
      return { founder: null, builder: null };
    }
  },
};

