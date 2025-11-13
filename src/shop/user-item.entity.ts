import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServerUser } from "../user/server-user.entity";
import { ShopItem } from "./shop-item.entity";

@Entity()
export class UserItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  amount: number;

  @ManyToOne(() => ServerUser, (user) => user.items, { onDelete: "CASCADE" })
  user: ServerUser;

  @ManyToOne(() => ShopItem, (item) => item.userItems, { onDelete: "CASCADE" })
  item: ShopItem;
}
