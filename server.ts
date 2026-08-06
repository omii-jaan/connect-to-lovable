import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { SEEDED_BUILDERS, computeProjectMatches } from "./src/lib/match-engine";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Shipyards AI Match Engine" });
  });

  // AI Match Engine Endpoint (Server-Side Computation)
  app.all("/api/match-engine", (req, res) => {
    try {
      const projectId = (req.body?.projectId || req.query?.projectId || "") as string;
      const project = req.body?.project || null;

      const targetProject = (project || {
        id: projectId,
        title: "AI System Project",
        category: "AI Agents",
        skills: ["Python", "Claude", "FastAPI"],
        techStack: ["Claude 3.5 Sonnet", "PostgreSQL"],
        budgetMax: 15000,
      }) as Record<string, unknown>;

      const matches = computeProjectMatches(targetProject, SEEDED_BUILDERS);

      return res.json({
        success: true,
        projectId: targetProject.id || projectId,
        matches,
        computedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Match Engine calculation error:", err);
      return res.status(500).json({ error: "Failed to compute project matches" });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
