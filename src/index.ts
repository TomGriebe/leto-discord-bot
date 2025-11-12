import {
  addCommandHandlers,
  createGatewayClient,
  runGateway,
} from "./gateway/client";

const client = createGatewayClient();
addCommandHandlers(client);
runGateway(client);
