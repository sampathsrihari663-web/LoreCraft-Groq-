import express from "express";
import path from "path";
import { app } from "./app";

const PORT = 3000;

// Vite middleware for development (only run if not exported for serverless)
if (process.env.NODE_ENV !== "production" && !process.env.NETLIFY) {
  (async () => {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteServer.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })();
} else if (!process.env.NETLIFY) {
  // Production traditional server (Cloud Run, Render, etc)
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

