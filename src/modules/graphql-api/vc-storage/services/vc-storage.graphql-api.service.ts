import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity, VcStorageEntity } from "@/libs/database/entities";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";

@Injectable()
export class VcStorageGraphqlApiService {
  constructor(
    @InjectRepository(VcStorageEntity)
    private vcStorageRepository: Repository<VcStorageEntity>,
    @InjectRepository(UsersEntity)
    private accountsRepository: Repository<UsersEntity>
  ) {}

  async create(data: TVCStorageCreate): Promise<VcStorageEntity> {
    const vc = new VcStorageEntity();
    vc.vcData = data.vcData;

    await this.vcStorageRepository.save(vc);

    return vc;
  }

  async findById(id: number): Promise<VcStorageEntity> {
    return this.vcStorageRepository.findOne(id);
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.vcStorageRepository.delete({ id }));
  }
}
