import { randomInt } from "crypto";
import { WORK_ACTION } from "../constants/actions";
import { AppDataSource } from "../data-source";
import { DiscordServer } from "../discord-server/discord-server.entity";
import { ServerUser } from "./server-user.entity";
import { UserCooldown } from "./user-cooldown.entity";

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

export async function getTimeUntilNextShift(user: ServerUser): Promise<number> {
  const workStatus = user.cooldowns.find((cd) => cd.action === WORK_ACTION);

  if (!workStatus) {
    return -1;
  }

  const workTimeout = user.server.config.workTimeout;
  const timeSinceLastShift = Date.now() - workStatus.lastUsedAt.valueOf();

  return workTimeout - timeSinceLastShift;
}

interface WorkResult {
  lastSalary: number;
  nextSalary: number;
  duration: number;
}

export async function startWorkShift(user: ServerUser): Promise<WorkResult> {
  let workStatus = user.cooldowns.find((cd) => cd.action === WORK_ACTION);
  const { minSalary, maxSalary, workTimeout } = user.server.config;

  if (!workStatus) {
    workStatus = new UserCooldown();
    workStatus.action = WORK_ACTION;
    workStatus.user = user;
  }

  workStatus.lastUsedAt = new Date();

  const lastSalary = user.nextSalary;
  const nextSalary = randomInt(minSalary, maxSalary + 1);
  user.nextSalary = nextSalary;
  user.balance += lastSalary;

  const result: WorkResult = {
    lastSalary: lastSalary,
    nextSalary: nextSalary,
    duration: workTimeout,
  };

  const userRepo = AppDataSource.getRepository(ServerUser);
  const cooldownRepo = AppDataSource.getRepository(UserCooldown);

  await userRepo.save(user);
  await cooldownRepo.save(workStatus);

  return result;
}
