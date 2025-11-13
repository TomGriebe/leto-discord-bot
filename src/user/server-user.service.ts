import { AppDataSource } from "../data-source";
import { DiscordServer } from "../discord-server/discord-server.entity";
import { ServerUser } from "./server-user.entity";

export async function createUserIfNotExists(userId: string, serverId: string) {
  const userRepo = AppDataSource.getRepository(ServerUser);
  const existingUser = await userRepo.findOneBy({
    server: { discordId: serverId },
  });

  if (!existingUser) {
    console.info("User not found, creating one!");

    const user = new ServerUser();
    user.discordId = userId;
    user.balance = 0;
    user.server = { discordId: serverId } as DiscordServer;
    await userRepo.save(user);
  }
}

export async function addBalance(
  discordId: string,
  serverId: string,
  delta: number
) {
  if (delta === 0) return;

  const userRepo = AppDataSource.getRepository(ServerUser);

  const user = await findServerUser(discordId, serverId);
  user.balance = Math.max(0, user.balance + delta);

  await userRepo.save(user);
}

export async function getBalance(
  discordId: string,
  serverId: string
): Promise<number> {
  const user = await findServerUser(discordId, serverId);
  return user.balance;
}

export async function findServerUser(
  discordId: string,
  serverId: string
): Promise<ServerUser> {
  const userRepo = AppDataSource.getRepository(ServerUser);

  return await userRepo.findOneBy({
    discordId,
    server: { discordId: serverId },
  });
}
