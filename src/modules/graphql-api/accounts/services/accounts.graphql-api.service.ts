import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity } from "@/libs/database/entities";
import { TAccountCreate } from "@/modules/graphql-api/accounts/types";

@Injectable()
export class AccountsGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private accountsRepository: Repository<UsersEntity>
  ) {}

  async create(data: TAccountCreate): Promise<UsersEntity> {
    const { did, lastActive } = data;

    if (!did) {
      throw new Error("Did is required");
    }

    let account = await this.accountsRepository.findOne({ did });
    if (account) {
      throw new Error("Account already exists");
    }

    account = new UsersEntity();
    account.did = did;

    await this.accountsRepository.save(account);

    return account;
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.accountsRepository.findOne(id);
  }

  async findByDid(did: string): Promise<UsersEntity> {
    return this.accountsRepository.findOne({ did });
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.accountsRepository.delete({ id }));
  }
}
