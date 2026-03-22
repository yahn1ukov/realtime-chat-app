import { BaseEntity } from "src/common/entities/base.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("messages")
export class MessageEntity extends BaseEntity {
  @Column({ length: 200 })
  content: string;

  @ManyToOne(() => UserEntity, (author) => author.messages)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;
}
