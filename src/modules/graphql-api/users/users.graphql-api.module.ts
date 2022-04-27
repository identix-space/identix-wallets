import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersEntity } from "@/libs/database/entities";
import { LoggingModule } from "@/libs/logging/logging.module";
import { UsersGraphqlApiService } from "@/modules/graphql-api/users/services/users.graphql-api.service";
import { UsersGraphqlApiResolvers } from "@/modules/graphql-api/users/resolvers/users.graphql-api.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    LoggingModule.forRoot({ serviceName: "Users GraphQL module" })
  ],
  providers: [UsersGraphqlApiResolvers, UsersGraphqlApiService],
  exports: [UsersGraphqlApiService]
})
export class UsersGraphqlApiModule {}
