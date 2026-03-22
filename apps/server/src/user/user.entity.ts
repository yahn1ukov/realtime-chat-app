import { ROLE, type Role } from "@chat/shared";
import { Exclude } from "class-transformer";
import { MessageEntity } from "src/chat/message.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column("enum", { enum: Object.values(ROLE), default: ROLE.USER })
  role: Role;

  @Column()
  color: string;

  @Column({ name: "is_banned", default: false })
  isBanned: boolean;

  @Column({ name: "is_muted", default: false })
  isMuted: boolean;

  @OneToMany(() => MessageEntity, (message) => message.author)
  messages: MessageEntity[];
}
