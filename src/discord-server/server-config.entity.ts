import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { DiscordServer } from "./discord-server.entity";

@Entity()
export class ServerConfig {
  @PrimaryColumn()
  serverId: string;

  @OneToOne(() => DiscordServer, (server) => server.config, { cascade: true })
  @JoinColumn({ name: "serverId" })
  server: DiscordServer;

  @Column({ type: "int" })
  minSalary: number;

  @Column({ type: "int" })
  maxSalary: number;

  @Column({ type: "int" })
  workTimeout: number;

  @Column({ type: "int" })
  minigameTimeout: number;
}
