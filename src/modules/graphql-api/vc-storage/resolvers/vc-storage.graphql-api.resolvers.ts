import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VcStorageEntity } from "@/libs/database/entities";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import {VcStorageGraphqlApiService} from "@/modules/graphql-api/vc-storage/services/vc-storage.graphql-api.service";

@UseGuards(SsoAuthGuard)
@Resolver(of => VcStorageEntity)
export class VcStorageGraphqlApiResolvers {
  constructor(private vcStorageService: VcStorageGraphqlApiService) {}

  @Mutation(returns => VcStorageEntity)
  async createVC(
    @Args("vcData", { type: () => String }) vcData: string,
    @Args("issuer", { type: () => String }) issuer?: string,
    @Args("holder", { type: () => String }) holder?: string,
    @Args("verifier", { type: () => String }) verifier?: string,
    @Args("status", { type: () => String }) status?: string
  ) {
    return this.vcStorageService.create({ vcData, issuer, holder, verifier, status} as TVCStorageCreate);
  }

  @Query(returns => VcStorageEntity)
  async getVC(@Args("id", { type: () => Int }) id: number) {
    return this.vcStorageService.findById(id);
  }

  @Mutation(returns => Boolean)
  async deleteVC(@Args("id", { type: () => Int }) id: number) {
    return this.vcStorageService.deleteById(id);
  }
}
