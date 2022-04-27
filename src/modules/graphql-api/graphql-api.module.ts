import { Module } from "@nestjs/common";

import { AccountsGraphqlApiModule } from "@/modules/graphql-api/accounts/accounts.graphql-api.module";
import { VcStorageGraphqlApiModule } from "@/modules/graphql-api/vc-storage/vc-storage.graphql-api.module";

@Module({
  imports: [AccountsGraphqlApiModule, VcStorageGraphqlApiModule],
  providers: [],
  exports: []
})
export class GraphQLApiModule {}
