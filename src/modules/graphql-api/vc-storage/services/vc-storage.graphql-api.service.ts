import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Did } from "@/libs/common/types/ssi.types";
import { DidsEntity, UsersEntity, VcStorageEntity, VcVerificationCasesEntity } from "@/libs/database/entities";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { VcVerificationStatusType } from "@/libs/database/types/vc-status.type";
import { ClaimsGroup, EverscaleClient, IEverscaleClient } from "@/libs/everscale-client/types";
import { ThrowStatement } from "ts-morph";

@Injectable()
export class VcStorageGraphqlApiService {
  constructor(
    @InjectRepository(VcStorageEntity)
    private vcStorageRepository: Repository<VcStorageEntity>,
    @InjectRepository(VcVerificationCasesEntity)
    private vcVerificationCasesRepository: Repository<VcVerificationCasesEntity>,
    @InjectRepository(UsersEntity)
    private accountsRepository: Repository<UsersEntity>,
    @InjectRepository(DidsEntity)
    private didsRepository: Repository<DidsEntity>,
    @Inject(EverscaleClient) private everscaleClient: IEverscaleClient
  ) { }

  /**
   * Issues VC in Everscale blockchain
   *
   * @param claims
   * @param issuerPublicKey
   */
  async issueVC(claimsGroups: ClaimsGroup[], issuerDid: Did): Promise<Did> {
    try {
      const did = await this.didsRepository.findOne({
        where: { did: issuerDid },
        relations: ['web3Account']
      });
      if (!did && !did.web3Account) throw new BadRequestException(`Issuer not found`);

      return this.everscaleClient.issueVC(claimsGroups, did.web3Account.publicKey);
    } catch (e) {
      throw new BadRequestException(`Cannot issue VC to Venom: ${e.message}`);
    }
  }

  /**
   * Saves VC in database
   *
   * @param params
   */
  async saveVC(params: TVCStorageCreate): Promise<VcStorageEntity> {
    const { vcDid, vcData, issuerDid, holderDid, vcSecret } = params;

    const vc = new VcStorageEntity();
    vc.vcDid = vcDid;
    vc.vcData = vcData;
    vc.issuerDid = issuerDid;
    vc.holderDid = holderDid;
    vc.vcSecret = vcSecret;

    await this.vcStorageRepository.save(vc);

    return vc;
  }

  async getUserVCs(userDid: Did, vcType: string): Promise<VcStorageEntity[]> {
    const VCs = await this.vcStorageRepository.find({
      where: { holderDid: userDid },
      relations: ['verificationCases']
    });

    return vcType ? VCs.filter(cV => {
      console.log(JSON.parse(cV.vcData).vcTypeDid);
      return JSON.parse(cV.vcData).vcTypeDid === vcType
    }) : VCs;
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

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    const vc = await this.vcStorageRepository.findOne({ vcDid });
    if (!vc) {
      throw new Error('VC not found');
    }

    let vcVerificationCase = (await this.vcVerificationCasesRepository.find({
      where: { verifierDid, vc: { vcDid } },
      relations: ['vc']
    })).shift();
    if (vcVerificationCase) {
      throw new Error(`The verification case already exists. Params: ${JSON.stringify({ vcDid, verifierDid })}`);
    }

    vcVerificationCase = new VcVerificationCasesEntity();
    vcVerificationCase.vc = vc;
    vcVerificationCase.verifierDid = verifierDid;
    vcVerificationCase.verificationStatus = VcVerificationStatusType.PendingVerify;

    await this.vcVerificationCasesRepository.save(vcVerificationCase)
    await this.refreshVc(vc);

    return true;
  }

  async verifyVc(userDid: Did, titledid: string): Promise<VcStorageEntity> {
    const VCs = await this.vcStorageRepository.find({
      where: { holderDid: userDid },
      relations: ['verificationCases']
    });

    const verifiedVC = VCs.find(cV => {
      const {vcParams} = JSON.parse(cV.vcData);
      const data = JSON.parse(vcParams);
      return data.titledeedid === titledid;
    });

    return verifiedVC;
  }

  async refreshVc(vc: VcStorageEntity): Promise<void> {
    try {
      const vcVerificationCases =
        (await this.vcVerificationCasesRepository.find({
          where: { vc: { vcDid: vc.vcDid } },
          relations: ['vc']
        }))
          .map(vfc => ({ verifierDid: vfc.verifierDid, verificationStatus: vfc.verificationStatus }));

      const vcDataObj = JSON.parse(vc.vcData);
      vcDataObj.verificationCases = vcVerificationCases;
      vc.vcData = JSON.stringify(vcDataObj);

      await this.vcStorageRepository.save(vc);
    } catch (e) {
      throw new BadRequestException('Invalid vcData: it could not be parsed and refreshed as json object');
    }
  }
}
