import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersEntity } from "@/libs/database/entities";
import { UsersGraphqlApiService } from "@/modules/graphql-api/users/services/users.graphql-api.service";
import { TAccountGetOrCreate, TGetOrCreateAccountResult } from "@/modules/graphql-api/users/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import {SignMessageResponse} from "@/modules/graphql-api/vc-storage/types";

//@UseGuards(SsoAuthGuard)
@Resolver(of => UsersEntity)
export class UsersGraphqlApiResolvers {
  constructor(private usersService: UsersGraphqlApiService) {}

  @Mutation(returns => TGetOrCreateAccountResult)
  async getOrCreateAccount(
    @Args("params", { type: () => TAccountGetOrCreate }) params: TAccountGetOrCreate
  ) {
    return this.usersService.getOrCreateAccount(params as TAccountGetOrCreate);
  }

  @Mutation(returns => Boolean)
  async deleteAccount(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.deleteById(id);
  }

  @Mutation(returns => SignMessageResponse)
  async signMessage(
    @Args("accountDid", { type: () => String }) accountDid: string,
    @Args("message", { type: () => String }) message: string
  ) {
    return this.usersService.signMessage(accountDid, message);
  }

  @Mutation(returns => Boolean)
  async verifySignedMessage(
    @Args("accountDid", { type: () => String }) accountDid: string,
    @Args("message", { type: () => String }) message: string,
    @Args("signedMessage", { type: () => String }) signedMessage: string
  ) {
    return this.usersService.verifySignedMessage(accountDid, signedMessage, message);
  }
}
