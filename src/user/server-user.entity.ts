import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DiscordServer } from "../discord-server/discord-server.entity";
import { UserItem } from "../shop/user-item.entity";
import { UserCooldown } from "./user-cooldown.entity";

@Entity()
export class ServerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discordId: string;

  @Column({ type: "int", default: 0 })
  balance: number;

  @Column({ type: "int", default: 0 })
  nextSalary: number;

  @OneToMany(() => UserCooldown, (cooldown) => cooldown.user)
  cooldowns: UserCooldown[];

  @OneToMany(() => UserItem, (item) => item.user)
  items: UserItem[];

  @ManyToOne(() => DiscordServer, (server) => server.users, { cascade: true })
  server: DiscordServer;
}
