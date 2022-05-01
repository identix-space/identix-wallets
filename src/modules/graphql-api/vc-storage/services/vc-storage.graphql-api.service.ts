import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Did } from "@/libs/common/types/ssi.types";
import {UsersEntity, VcStorageEntity, VcVerificationCasesEntity} from "@/libs/database/entities";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";

@Injectable()
export class VcStorageGraphqlApiService {
  constructor(
    @InjectRepository(VcStorageEntity)
    private vcStorageRepository: Repository<VcStorageEntity>,
    @InjectRepository(VcVerificationCasesEntity)
    private vcVerificationCasesRepository: Repository<VcVerificationCasesEntity>,
    @InjectRepository(UsersEntity)
    private accountsRepository: Repository<UsersEntity>
  ) {}

  async create(params: TVCStorageCreate): Promise<VcStorageEntity> {
    const { vcDid, vcData, issuerDid, holderDid} = params;

    const vc = new VcStorageEntity();
    vc.vcDid = vcDid;
    vc.vcData = vcData;
    vc.issuerDid = issuerDid;
    vc.holderDid = holderDid;

    await this.vcStorageRepository.save(vc);

    return vc;
  }

  async getUserVCs(userDid: Did): Promise<VcStorageEntity[]> {
    const userVCs: Map<string, VcStorageEntity> = new Map<string, VcStorageEntity>();

    const userAsIssuerVCs = await this.vcStorageRepository.find({
          where: { issuerDid: userDid },
          relations: ['verificationCases']
        }
      );

    if (userAsIssuerVCs && userAsIssuerVCs.length > 0) {
      for (const vc of userAsIssuerVCs) {
        userVCs.set(vc.vcDid, vc);
      }
    }

    const userAsHolderVCs = await this.vcStorageRepository.find({
        where: { holderDid: userDid },
        relations: ['verificationCases']
      }
    );

    if (userAsHolderVCs && userAsHolderVCs.length > 0) {
      for (const vc of userAsHolderVCs) {
        userVCs.set(vc.vcDid, vc);
      }
    }

    const userAsVerifierVerificationCases = await this.vcVerificationCasesRepository.find({
      where: { verifierDid: userDid },
      relations: ['vc']
    });

    if (userAsVerifierVerificationCases && userAsVerifierVerificationCases.length > 0) {
      for await (const vcs of userAsVerifierVerificationCases) {
        const vc = await this.vcStorageRepository.findOne(vcs.vc.id, {
          relations: ['verificationCases']
        })

        userVCs.set(vc.vcDid, vc);
      }
    }

    return Array.from(userVCs.values());
  }

  async findVcByDid(vcDid: Did): Promise<VcStorageEntity> {
    return this.vcStorageRepository.findOne({
      where: { vcDid },
      relations: ['verificationCases']
    });
  }

  async findVcById(id: number): Promise<VcStorageEntity> {
    return this.vcStorageRepository.findOne(id, {
      relations: ['verificationCases']
    });
  }

  async deleteVcById(id: number): Promise<boolean> {
    return !!(await this.vcStorageRepository.delete({ id }));
  }
}
