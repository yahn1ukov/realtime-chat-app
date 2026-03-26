import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/entities/base.entity";
import { UserEntity } from "../user/user.entity";

@Entity("messages")
export class MessageEntity extends BaseEntity {
  @Column({ length: 200 })
  content: string;

  @ManyToOne(() => UserEntity, (author) => author.messages)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;
}
