import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VcStorageEntity } from "@/libs/database/entities";
import { Did } from "@/libs/common/types/ssi.types";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import {VcStorageGraphqlApiService} from "@/modules/graphql-api/vc-storage/services/vc-storage.graphql-api.service";

@UseGuards(SsoAuthGuard)
@Resolver(of => VcStorageEntity)
export class VcStorageGraphqlApiResolvers {
  constructor(private vcStorageService: VcStorageGraphqlApiService) {}

  @Mutation(returns => VcStorageEntity)
  async createVC(
    @Args("vcDid", { type: () => String }) vcDid: string,
    @Args("vcData", { type: () => String }) vcData: string,
    @Args("issuerDid", { type: () => String }) issuerDid?: string | undefined,
    @Args("holderDid", { type: () => String }) holderDid?: string | undefined,
  ) {
    return this.vcStorageService.create({ vcDid, vcData, issuerDid, holderDid} as TVCStorageCreate);
  }

  @Query(returns => [VcStorageEntity])
  async getUserVCs(@Args("userDid", { type: () => String }) userDid: Did): Promise<VcStorageEntity[]> {
    return this.vcStorageService.getUserVCs(userDid);
  }

  @Query(returns => VcStorageEntity)
  async getVC(@Args("vcDid", { type: () => String }) vcDid: Did): Promise<VcStorageEntity> {
    return this.vcStorageService.findVcByDid(vcDid);
  }

  @Mutation(returns => Boolean)
  async deleteVC(@Args("id", { type: () => Int }) id: number) {
    return this.vcStorageService.deleteVcById(id);
  }
}
