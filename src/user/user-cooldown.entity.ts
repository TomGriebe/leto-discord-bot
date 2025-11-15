import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServerUser } from "./server-user.entity";

@Entity()
export class UserCooldown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ type: "timestamptz" })
  lastUsedAt: Date;

  @ManyToOne(() => ServerUser, (user) => user.cooldowns, { cascade: true })
  user: ServerUser;
}
