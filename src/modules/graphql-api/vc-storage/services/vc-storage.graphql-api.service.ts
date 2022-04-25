import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {AccountsEntity, VCStorageEntity} from "@/libs/database/entities";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";

@Injectable()
export class VcStorageGraphqlApiService {
  constructor(
    @InjectRepository(VCStorageEntity)
    private vcStorageRepository: Repository<VCStorageEntity>,
    @InjectRepository(AccountsEntity)
    private accountsRepository: Repository<AccountsEntity>
  ) {}

  async create(data: TVCStorageCreate): Promise<VCStorageEntity> {
    const { did, lastActive } = data;

    if (!did) {
      throw new Error("Did is required");
    }

    let account = await this.accountsRepository.findOne({ did });
    if (!account) {
      throw new Error("Account does not exist");
    }

    const vc = new VCStorageEntity();

    await this.vcStorageRepository.save(vc);

    return vc;
  }

  async findById(id: number): Promise<VCStorageEntity> {
    return this.vcStorageRepository.findOne(id);
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.vcStorageRepository.delete({ id }));
  }
}
