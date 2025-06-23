import express from "express";
import { createServer as createViteServer } from "vite";
import routes from "./server/routes.js";

async function startServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: "./client",
    resolve: {
      alias: {
        "@": "/src",
        "@shared": "../shared",
        "@assets": "/src/assets",
      },
    },
  });
  
  app.use(express.json());
  app.use(vite.ssrFixStacktrace);
  
  // API routes first
  app.use(routes);
  
  // Vite middleware handles the frontend
  app.use(vite.middlewares);
  
  const port = process.env.PORT || 5173;
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 ContentScale running on http://0.0.0.0:${port}`);
    console.log(`📧 Contact: consultant@contentscale.site`);
  });
}

startServer().catch(console.error);