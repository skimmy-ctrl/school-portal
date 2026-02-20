import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { attachAdminSocket } from "./realtime/adminSocket";
import { bootstrapAdminUser } from "./services/bootstrap.service";

const PORT = process.env.PORT || 4000;

async function startServer() {
  await bootstrapAdminUser();

  const server = http.createServer(app);
  attachAdminSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
