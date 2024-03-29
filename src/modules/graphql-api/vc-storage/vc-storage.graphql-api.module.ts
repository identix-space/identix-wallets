import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {DidsEntity, UsersEntity, VcStorageEntity, VcVerificationCasesEntity} from "@/libs/database/entities";
import { LoggingModule } from "@/libs/logging/logging.module";
import { VcStorageGraphqlApiService } from "./services/vc-storage.graphql-api.service";
import { VcStorageGraphqlApiResolvers} from "./resolvers/vc-storage.graphql-api.resolvers";
import {EverscaleClientModule} from "@/libs/everscale-client/everscale-client.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DidsEntity, UsersEntity, VcStorageEntity, VcVerificationCasesEntity]),
    LoggingModule.forRoot({ serviceName: "VCs Storage GraphQL module" }),
    EverscaleClientModule
  ],
  providers: [VcStorageGraphqlApiResolvers, VcStorageGraphqlApiService],
  exports: [VcStorageGraphqlApiService]
})
export class VcStorageGraphqlApiModule {}
