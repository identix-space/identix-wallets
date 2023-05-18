import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VcStorageEntity } from "@/libs/database/entities";
import { Did } from "@/libs/common/types/ssi.types";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import {VcStorageGraphqlApiService} from "@/modules/graphql-api/vc-storage/services/vc-storage.graphql-api.service";
import {VcVerificationStatusType} from "@/libs/database/types/vc-status.type";
import {ClaimsGroup} from "@/libs/everscale-client/types";

//S@UseGuards(SsoAuthGuard)
@Resolver(of => VcStorageEntity)
export class VcStorageGraphqlApiResolvers {
  constructor(private vcStorageService: VcStorageGraphqlApiService) {}

  @Mutation(returns => String)
  async issueVC(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.vcStorageService.issueVC(id);
  }

  @Mutation(returns => VcStorageEntity)
  async saveVC(
    @Args("vcDid", { type: () => String }) vcDid: string,
    @Args("vcData", { type: () => String }) vcData: string,
    @Args("issuerDid", { type: () => String }) issuerDid?: string | undefined,
    @Args("holderDid", { type: () => String }) holderDid?: string | undefined,
    @Args("vcSecret", { type: () => String }) vcSecret?: string | undefined,
  ) {
    return this.vcStorageService.saveVC({ vcDid, vcData, issuerDid, holderDid, vcSecret } as TVCStorageCreate);
  }

  @Query(returns => [VcStorageEntity])
  async getUserVCs(
    @Args("userDid", { type: () => String }) userDid: Did,
    @Args("page", { type: () => Int }) page?: number | undefined,
    @Args("limit", { type: () => Int }) limit?: number | undefined
  ): Promise<VcStorageEntity[]> {
    return this.vcStorageService.getUserVCs(userDid, page, limit);
  }

  @Query(returns => VcStorageEntity)
  async getVC(@Args("vcDid", { type: () => String }) vcDid: Did): Promise<VcStorageEntity> {
    return this.vcStorageService.findVcByDid(vcDid);
  }

  @Mutation(returns => Boolean)
  async deleteVC(@Args("id", { type: () => Int }) id: number) {
    return this.vcStorageService.deleteVcById(id);
  }

  @Mutation(returns => Boolean)
  async requestVcVerification(
    @Args("vcDid", { type: () => String! }) vcDid: Did,
    @Args("verifierDid", { type: () => String! }) verifierDid: Did) {
    return this.vcStorageService.requestVcVerification(vcDid, verifierDid);
  }

  @Mutation(returns => Boolean)
  async verifyVc(
    @Args("vcDid", { type: () => String! }) vcDid: Did,
    @Args("verifierDid", { type: () => String! }) verifierDid: Did,
    @Args("verificationStatus", { type: () => String! }) verificationStatus: VcVerificationStatusType) {
    return this.vcStorageService.verifyVc(vcDid, verifierDid, verificationStatus);
  }
}
