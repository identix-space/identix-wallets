import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AccountsEntity } from "@/libs/database/entities";
import { AccountsGraphqlApiService } from "./accounts.graphql-api.service";

describe("AccountsService", () => {
  let service: AccountsGraphqlApiService;
  let accountsRepositoryMock: Repository<AccountsEntity>;
  const accountsRepositoryToken = getRepositoryToken(AccountsEntity);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: accountsRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        AccountsGraphqlApiService
      ]
    }).compile();

    service = module.get<AccountsGraphqlApiService>(AccountsGraphqlApiService);
    accountsRepositoryMock = module.get(accountsRepositoryToken);

    jest.clearAllMocks();
  });

  describe("services", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
      expect(accountsRepositoryMock).toBeDefined();
    });
  });

  describe("createUser()", () => {
    it("email is undefined: should trow error", async () => {
      let result;
      try {
        result = await service.create({ did: undefined });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Email is required");
      }

      expect(result).toBeUndefined();
    });

    it("user exists: should be trow error", async () => {
      const user = new AccountsEntity();
      jest.spyOn(accountsRepositoryMock, "findOne").mockImplementation(() => {
        return new Promise(resolve => resolve(user));
      });

      let result;
      try {
        result = await service.create({ did: "test:did:123" });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("User already exists");
      }

      expect(result).toBeUndefined();
    });

    it("user not exists: should be create user", async () => {
      const did = "test:did:123";

      const user = new AccountsEntity();
      user.did = did;

      jest.spyOn(accountsRepositoryMock, "findOne").mockImplementation(() => {
        return new Promise(resolve => resolve(null));
      });

      const userRepoSaveSpy = jest
        .spyOn(accountsRepositoryMock, "save")
        .mockImplementation(() => {
          return new Promise(resolve => resolve(user));
        });

      const result = await service.create({ did });

      expect(userRepoSaveSpy).toBeCalled();
      expect(userRepoSaveSpy.mock.calls[0][0].did).toBe(user.did);
      expect(result).toBeDefined();
      expect(result.did).toBe(did);
    });
  });
});
