import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { attachAdminSocket } from "./realtime/adminSocket";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
attachAdminSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
