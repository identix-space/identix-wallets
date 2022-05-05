import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColumnVcSecretToVcStorage1651674668662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vc-storage', [
      new TableColumn({
        name: 'vcSecret',
        type: "varchar",
        length: "1024",
        isNullable: true,
        isUnique: false,
        default: 'NULL'
      }),
    ]);
  }

  public async down(): Promise<void> {
  }
}
