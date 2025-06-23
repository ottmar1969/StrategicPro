import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import routes from "./server/routes.js";
import agentRoutes from "./server/agent-api.js";
import { corsOptions, securityHeaders, sanitizeInput, agentAuth, createRateLimit } from "./server/security.js";

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
  
  // Security middleware
  app.use(cors(corsOptions));
  app.use(securityHeaders);
  app.use(sanitizeInput);
  app.use(agentAuth);
  
  // Rate limiting
  app.use('/api/', createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
  app.use('/api/agent/', createRateLimit(5 * 60 * 1000, 50)); // 50 requests per 5 minutes for agents
  
  app.use(express.json());
  app.use(vite.ssrFixStacktrace);
  
  // API routes
  app.use(routes);
  app.use(agentRoutes);
  
  // Vite middleware handles the frontend
  app.use(vite.middlewares);
  
  const port = process.env.PORT || 5173;
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 ContentScale running on http://0.0.0.0:${port}`);
    console.log(`📧 Contact: consultant@contentscale.site`);
  });
}

startServer().catch(console.error);