import {Module } from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {LoggingModule} from "@/libs/logging/logging.module";
import EverscaleClientConfigurationFactory from "./factories/everscale-configuration.factory";
import {EverscaleClientProvider} from "@/libs/everscale-client/providers/everscale-client.provider";
import {EverscaleClientService} from "@/libs/everscale-client/services/everscale-client.service";

@Module({
  imports: [
    ConfigModule.forFeature(EverscaleClientConfigurationFactory),
    LoggingModule.forRoot({ serviceName: "Everscale Client" })
  ],
  providers: [EverscaleClientProvider, EverscaleClientService],
  exports: [EverscaleClientProvider]
})

export class EverscaleClientModule {}
