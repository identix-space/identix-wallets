import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersEntity } from "@/libs/database/entities";
import { AccountsGraphqlApiService } from "@/modules/graphql-api/accounts/services/accounts.graphql-api.service";
import { TAccountCreate } from "@/modules/graphql-api/accounts/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";

@UseGuards(SsoAuthGuard)
@Resolver(of => UsersEntity)
export class AccountsGraphqlApiResolvers {
  constructor(private usersService: AccountsGraphqlApiService) {}

  @Mutation(returns => UsersEntity)
  async createAccount(@Args("did", { type: () => String }) did: string) {
    return this.usersService.create({ did } as TAccountCreate);
  }

  @Query(returns => UsersEntity)
  async getAccount(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.findById(id);
  }

  @Mutation(returns => Boolean)
  async deleteAccount(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.deleteById(id);
  }
}
