import { registerCommands } from "./commands/register-commands";
import {
  addCommandHandlers,
  createGatewayClient,
  runGateway,
} from "./gateway/client";

async function runBot() {
  await registerCommands();

  const client = createGatewayClient();
  addCommandHandlers(client);
  runGateway(client);
}

runBot().catch(console.error);
