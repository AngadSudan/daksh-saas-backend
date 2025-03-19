import { PrismaClient } from "@prisma/client";

const primsaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default primsaClient;
