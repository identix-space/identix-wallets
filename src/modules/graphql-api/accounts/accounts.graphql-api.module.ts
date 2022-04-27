import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersEntity } from "@/libs/database/entities";
import { LoggingModule } from "@/libs/logging/logging.module";
import { AccountsGraphqlApiService } from "@/modules/graphql-api/accounts/services/accounts.graphql-api.service";
import { AccountsGraphqlApiResolvers } from "@/modules/graphql-api/accounts/resolvers/accounts.graphql-api.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    LoggingModule.forRoot({ serviceName: "Users GraphQL module" })
  ],
  providers: [AccountsGraphqlApiResolvers, AccountsGraphqlApiService],
  exports: [AccountsGraphqlApiService]
})
export class AccountsGraphqlApiModule {}
