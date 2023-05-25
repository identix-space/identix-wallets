import {MigrationInterface, QueryRunner} from "typeorm";

export class cascadeRemove21685019086901 implements MigrationInterface {
    name = 'cascadeRemove21685019086901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web3-accounts" DROP CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ADD CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web3-accounts" DROP CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe"`);
        await queryRunner.query(`ALTER TABLE "web3-accounts" ADD CONSTRAINT "FK_402f71d0e5742d4955fa86d6bbe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
