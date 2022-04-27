import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity } from "@/libs/database/entities";
import {TAccountGetOrCreate, TGetOrCreateAccountResult} from "@/modules/graphql-api/users/types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ) {}

  async getOrCreateAccount(params: TAccountGetOrCreate): Promise<TGetOrCreateAccountResult> {
    const { nickname } = params;

    const user = new UsersEntity();
    user.nickname = nickname;

    await this.usersRepository.save(user);

    return {did: 'did:user:123456'};
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete({ id }));
  }
}
