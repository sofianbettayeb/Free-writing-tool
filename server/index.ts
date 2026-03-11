import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// ── Health check ──────────────────────────────────────────────────────────────
// Registered synchronously and first so it always responds immediately.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

const server = createServer(app);
const port = parseInt(process.env.PORT || "5000", 10);

// ── Production: serve static files synchronously ──────────────────────────────
// In production the static middleware is set up synchronously so the root
// endpoint (/) returns 200 immediately — satisfying the deployment health check
// as soon as the server starts listening, before any async setup completes.
if (app.get("env") !== "development") {
  serveStatic(app);
}

// Start listening immediately so the health check on / gets a fast response.
server.listen(port, "0.0.0.0", () => {
  log(`serving on port ${port}`);
});

// ── Async setup (auth routes, vite dev server) ────────────────────────────────
// OIDC discovery is pre-warmed at module load (replitAuth.ts) so this
// completes quickly. Routes are added to the already-listening server.
(async () => {
  await registerRoutes(app, server);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  }
})();
