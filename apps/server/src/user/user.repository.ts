import type { Role } from "@chat/shared";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserPayload, UpdateUserPayload } from "./types/user.type";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ username });
  }

  async countByRole(role: Role): Promise<number> {
    return this.repository.countBy({ role });
  }

  async create(payload: CreateUserPayload): Promise<UserEntity> {
    const user = this.repository.create(payload);
    return this.repository.save(user);
  }

  async updateById(id: string, payload: UpdateUserPayload): Promise<void> {
    await this.repository.update(id, payload);
  }
}
