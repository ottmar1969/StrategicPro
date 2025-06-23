import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "../client/dist")));

// API Routes
app.use(routes);

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ContentScale server running on port ${PORT}`);
});