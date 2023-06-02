import { DynamicModule, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLError, GraphQLFormattedError } from "graphql";

@Module({})
export class GraphQLAppModule {
  public static forRoot(): DynamicModule {
    return {
      module: GraphQLAppModule,
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true
        })
      ],
      providers: [],
      exports: []
    };
  }
}
