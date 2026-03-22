import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageEntity } from "./message.entity";
import { CreateMessagePayload } from "./types/chat.type";

@Injectable()
export class ChatRepository {
  constructor(@InjectRepository(MessageEntity) private readonly repository: Repository<MessageEntity>) {}

  async createMessage(authorId: string, payload: CreateMessagePayload): Promise<MessageEntity> {
    const message = this.repository.create({ ...payload, author: { id: authorId } });
    return this.repository.save(message);
  }

  async getAllMessages(limit: number): Promise<MessageEntity[]> {
    return this.repository.find({
      relations: { author: true },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }
}
