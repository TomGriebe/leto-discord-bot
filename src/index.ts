import "dotenv/config";
import "reflect-metadata";
import { registerCommands } from "./commands/register-commands";
import { AppDataSource } from "./data-source";
import {
  addCommandHandlers,
  createGatewayClient,
  runGateway,
} from "./gateway/client";

async function main() {
  await registerCommands();
  const client = createGatewayClient();
  addCommandHandlers(client);
  await runGateway(client);

  console.info("Initializing DB connection...");
  await AppDataSource.initialize();
  console.info("DB connection initialized!");
}

main().catch(console.error);
