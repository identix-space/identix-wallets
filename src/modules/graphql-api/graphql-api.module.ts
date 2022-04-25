import { Module } from "@nestjs/common";

import { AccountsGraphqlApiModule } from "@/modules/graphql-api/accounts/accounts.graphql-api.module";

@Module({
  imports: [AccountsGraphqlApiModule],
  providers: [],
  exports: []
})
export class GraphQLApiModule {}
