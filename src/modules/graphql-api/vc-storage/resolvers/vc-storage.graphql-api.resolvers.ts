import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VCStorageEntity } from "@/libs/database/entities";
import { AccountsGraphqlApiService } from "@/modules/graphql-api/accounts/services/accounts.graphql-api.service";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";

@UseGuards(SsoAuthGuard)
@Resolver(of => VCStorageEntity)
export class VcStorageGraphqlApiResolvers {
  constructor(private usersService: AccountsGraphqlApiService) {}

  @Mutation(returns => VCStorageEntity)
  async createUser(@Args("did", { type: () => String }) did: string) {
    return this.usersService.create({ did } as TVCStorageCreate);
  }

  @Query(returns => VCStorageEntity)
  async getUser(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.findById(id);
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.deleteById(id);
  }
}
