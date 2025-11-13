import { findServerUser } from "../user/server-user.service";

export async function getUserBalance(
  userId: string,
  serverId: string
): Promise<number> {
  return (await findServerUser(userId, serverId)).balance;
}
