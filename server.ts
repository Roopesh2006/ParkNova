import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import os from "os";

// Load environment variables FIRST, before any other code
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

async function startServer() {
  // Dynamic imports after environment is loaded
  const authRoutes = (await import("./src/lib/api-auth.js")).default;
  const usersRoutes = (await import("./src/lib/api-users.js")).default;
  const placesRoutes = (await import("./src/lib/api-places.js")).default;
  const floorsRoutes = (await import("./src/lib/api-floors.js")).default;
  const categoriesRoutes = (await import("./src/lib/api-categories.js")).default;
  const slotsRoutes = (await import("./src/lib/api-slots.js")).default;
  const tariffsRoutes = (await import("./src/lib/api-tariffs.js")).default;
  const parkingRoutes = (await import("./src/lib/api-parking.js")).default;

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mount API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/places", placesRoutes);
  app.use("/api/floors", floorsRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/slots", slotsRoutes);
  app.use("/api/tariffs", tariffsRoutes);
  app.use("/api/parking", parkingRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const localIp = getLocalIpAddress();
    console.log('\n  ✓ PARKNOVA Server is running\n');
    console.log(`  ➜  Local:        http://localhost:${PORT}`);
    console.log(`  ➜  Network:      http://${localIp}:${PORT}`);
    console.log(`\n  ✓ API routes mounted on /api`);
    console.log(`  ✓ Ready to serve requests\n`);
  });
}

startServer();
