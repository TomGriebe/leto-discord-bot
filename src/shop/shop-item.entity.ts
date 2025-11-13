import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DiscordServer } from "../discord-server/discord-server.entity";
import { UserItem } from "./user-item.entity";

@Entity()
export class ShopItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int" })
  timesSold: number;

  @Column()
  itemType: string;

  @OneToMany(() => UserItem, (userItem) => userItem.item)
  userItems: UserItem[];

  @ManyToOne(() => DiscordServer, (server) => server.shopItems, {
    onDelete: "CASCADE",
  })
  server: DiscordServer;
}
