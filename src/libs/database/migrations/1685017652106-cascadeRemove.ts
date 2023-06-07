import {MigrationInterface, QueryRunner} from "typeorm";

export class cascadeRemove1685017652106 implements MigrationInterface {
    name = 'cascadeRemove1685017652106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web2-accounts" DROP CONSTRAINT "FK_18d8f07ebd13852bffe151c8919"`);
        await queryRunner.query(`ALTER TABLE "dids" DROP CONSTRAINT "FK_f3ed0dd5e0efed1fe1fb19fe947"`);
        await queryRunner.query(`ALTER TYPE "web2_auth_methods" RENAME TO "web2_auth_methods_old"`);
        await queryRunner.query(`CREATE TYPE "web2-accounts_authmethod_enum" AS ENUM('clientId', 'magicLink', 'google', 'facebook', 'twitter', 'telegram', 'evmAddress')`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "authMethod" TYPE "web2-accounts_authmethod_enum" USING "authMethod"::"text"::"web2-accounts_authmethod_enum"`);
        await queryRunner.query(`DROP TYPE "web2_auth_methods_old"`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nickname" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" DROP CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "blockchains_list" RENAME TO "blockchains_list_old"`);
        await queryRunner.query(`CREATE TYPE "web3-accounts_blockchain_enum" AS ENUM('polygon', 'everscale')`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "blockchain" TYPE "web3-accounts_blockchain_enum" USING "blockchain"::"text"::"web3-accounts_blockchain_enum"`);
        await queryRunner.query(`DROP TYPE "blockchains_list_old"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "web3AccountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "vc_statuses" RENAME TO "vc_statuses_old"`);
        await queryRunner.query(`CREATE TYPE "vc-verifier-cases_verificationstatus_enum" AS ENUM('PENDING_VERIFY', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "verificationStatus" TYPE "vc-verifier-cases_verificationstatus_enum" USING "verificationStatus"::"text"::"vc-verifier-cases_verificationstatus_enum"`);
        await queryRunner.query(`DROP TYPE "vc_statuses_old"`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "verificationStatus" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "createdAt" SET DEFAULT '"2023-05-25T12:27:35.980Z"'`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-05-25T12:27:35.980Z"'`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "vcDid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "issuerDid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "vcSecret" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ADD CONSTRAINT "FK_18d8f07ebd13852bffe151c8919" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ADD CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dids" ADD CONSTRAINT "FK_f3ed0dd5e0efed1fe1fb19fe947" FOREIGN KEY ("web3AccountId") REFERENCES "web3-accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dids" DROP CONSTRAINT "FK_f3ed0dd5e0efed1fe1fb19fe947"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" DROP CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe"`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" DROP CONSTRAINT "FK_18d8f07ebd13852bffe151c8919"`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "vcSecret" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "issuerDid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-storage" ALTER COLUMN "vcDid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "verificationStatus" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "vc_statuses_old" AS ENUM('PENDING_VERIFY_REQUEST', 'PENDING_VERIFY', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "vc-verifier-cases" ALTER COLUMN "verificationStatus" TYPE "vc_statuses_old" USING "verificationStatus"::"text"::"vc_statuses_old"`);
        await queryRunner.query(`DROP TYPE "vc-verifier-cases_verificationstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "vc_statuses_old" RENAME TO "vc_statuses"`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "web3AccountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "dids" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "blockchains_list_old" AS ENUM('polygon', 'everscale')`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "blockchain" TYPE "blockchains_list_old" USING "blockchain"::"text"::"blockchains_list_old"`);
        await queryRunner.query(`DROP TYPE "web3-accounts_blockchain_enum"`);
        await queryRunner.query(`ALTER TYPE "blockchains_list_old" RENAME TO "blockchains_list"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ALTER COLUMN "address" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ADD CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nickname" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "web2_auth_methods_old" AS ENUM('clientId', 'magicLink', 'google', 'facebook', 'twitter', 'telegram')`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ALTER COLUMN "authMethod" TYPE "web2_auth_methods_old" USING "authMethod"::"text"::"web2_auth_methods_old"`);
        await queryRunner.query(`DROP TYPE "web2-accounts_authmethod_enum"`);
        await queryRunner.query(`ALTER TYPE "web2_auth_methods_old" RENAME TO "web2_auth_methods"`);
        await queryRunner.query(`ALTER TABLE "dids" ADD CONSTRAINT "FK_f3ed0dd5e0efed1fe1fb19fe947" FOREIGN KEY ("web3AccountId") REFERENCES "web3-accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "web2-accounts" ADD CONSTRAINT "FK_18d8f07ebd13852bffe151c8919" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
