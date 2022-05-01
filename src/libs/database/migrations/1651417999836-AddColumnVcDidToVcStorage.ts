import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColumnVcDidToVcStorage1651417999836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vc-storage', [
      new TableColumn({
        name: 'vcDid',
        type: "varchar",
        length: "1024",
        isNullable: true,
        isUnique: true
      }),
    ]);
  }

  public async down(): Promise<void> {
  }
}
