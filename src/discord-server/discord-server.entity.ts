import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { ShopItem } from "../shop/shop-item.entity";
import { ServerUser } from "../user/server-user.entity";
import { ServerConfig } from "./server-config.entity";

@Entity()
export class DiscordServer {
  @PrimaryColumn()
  discordId: string;

  @Column()
  discordName: string;

  @Column({ type: "timestamptz" })
  installedAt: Date;

  @OneToOne(() => ServerConfig, (config) => config.server)
  config: ServerConfig;

  @OneToMany(() => ServerUser, (user) => user.server)
  users: ServerUser[];

  @OneToMany(() => ShopItem, (item) => item.server)
  shopItems: ShopItem[];
}
