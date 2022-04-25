import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AccountsEntity, UsersListSearchResult } from "@/libs/database/entities";
import { TUserCreate } from "@/modules/graphql-api/accounts/types";

@Injectable()
export class AccountsGraphqlApiService {
  constructor(
    @InjectRepository(AccountsEntity)
    private usersRepository: Repository<AccountsEntity>
  ) {}

  async create(data: TUserCreate): Promise<AccountsEntity> {
    const { did, lastActive } = data;

    if (!did) {
      throw new Error("Did is required");
    }

    let user = await this.usersRepository.findOne({ did });
    if (user) {
      throw new Error("User already exists");
    }

    user = new AccountsEntity();
    user.did = did;
    user.lastActivity = lastActive || new Date();

    await this.usersRepository.save(user);

    return user;
  }

  async findById(id: number): Promise<AccountsEntity> {
    return this.usersRepository.findOne(id);
  }

  async findByDid(did: string): Promise<AccountsEntity> {
    return this.usersRepository.findOne({ did });
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete({ id }));
  }
}
