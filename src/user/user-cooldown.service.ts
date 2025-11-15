import { AppDataSource } from "../data-source";
import { ServerConfig } from "../discord-server/server-config.entity";
import { findServerUser } from "./server-user.service";
import { UserCooldown } from "./user-cooldown.entity";

export async function getRemainingMinigameCooldown(
  userId: string,
  serverId: string,
  game: string
): Promise<number> {
  const configRepo = AppDataSource.getRepository(ServerConfig);
  const cooldownRepo = AppDataSource.getRepository(UserCooldown);

  const serverConfig = await configRepo.findOneBy({ serverId });
  const user = await findServerUser(userId, serverId);

  if (!serverConfig || !user) {
    return Infinity;
  }

  const cooldown = await cooldownRepo.findOneBy({ user, action: game });

  if (!cooldown) {
    return 0;
  }

  const timePassed = Date.now() - cooldown.lastUsedAt.valueOf();
  return Math.max(0, serverConfig.minigameTimeout - timePassed);
}

export async function setMinigameCooldown(
  userId: string,
  serverId: string,
  game: string
) {
  const cooldownRepo = AppDataSource.getRepository(UserCooldown);
  const user = await findServerUser(userId, serverId);

  let cooldown = await cooldownRepo.findOneBy({ action: game, user });

  if (cooldown) {
    cooldown.lastUsedAt = new Date();
    await cooldownRepo.update({ id: cooldown.id }, cooldown);
  } else {
    cooldown = new UserCooldown();
    cooldown.user = user;
    cooldown.action = game;
    cooldown.lastUsedAt = new Date();
    await cooldownRepo.save(cooldown);
  }
}
