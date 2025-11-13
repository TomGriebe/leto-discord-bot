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

export async function addBalance(userId: string, delta: number) {}
