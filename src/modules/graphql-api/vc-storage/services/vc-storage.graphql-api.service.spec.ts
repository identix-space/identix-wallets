import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity } from "@/libs/database/entities";
import { VcStorageGraphqlApiService } from "./vc-storage.graphql-api.service";

describe("UsersService", () => {
  let service: VcStorageGraphqlApiService;
  let usersRepositoryMock: Repository<UsersEntity>;
  const usersRepositoryToken = getRepositoryToken(UsersEntity);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: usersRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        VcStorageGraphqlApiService
      ]
    }).compile();

    service = module.get<VcStorageGraphqlApiService>(VcStorageGraphqlApiService);
    usersRepositoryMock = module.get(usersRepositoryToken);

    jest.clearAllMocks();
  });

  describe("services", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
      expect(usersRepositoryMock).toBeDefined();
    });
  });

});
