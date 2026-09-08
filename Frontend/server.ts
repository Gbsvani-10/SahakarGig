import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./src/server/api";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());
  app.use("/api", apiRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const possibleDistPaths = [
      path.join(process.cwd(), "dist"),
      path.join(process.cwd(), "Frontend", "dist"),
      path.resolve(__dirname),
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "../dist"),
    ];
    const distPath =
      possibleDistPaths.find((p) => fs.existsSync(path.join(p, "index.html"))) ||
      possibleDistPaths[0];

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("SahakarGig frontend build not found. Please run 'npm run build' first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SahakarGig server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
