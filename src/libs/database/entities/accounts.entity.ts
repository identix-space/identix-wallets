import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { VcStorageEntity } from "@/libs/database/entities/vc-storage.entity";


@Entity("accounts")
@ObjectType()
export class AccountsEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "did",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public did: string;

  @Column({
    name: "createdAt",
    type: "timestamp",
    nullable: true,
    default: "CURRENT_TIMESTAMP"
  })
  @Field({ nullable: false })
  public createdAt: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp",
    nullable: true,
    default: "CURRENT_TIMESTAMP"
  })
  @Field({ nullable: false })
  public updatedAt: Date;

  @OneToMany(
    () => VcStorageEntity,
    vc => vc.issuer,
  )
  public issuerVCs: VcStorageEntity[]

  @OneToMany(
    () => VcStorageEntity,
    vc => vc.holder,
  )
  public holderVCs: VcStorageEntity[]

  @OneToMany(
    () => VcStorageEntity,
    vc => vc.verifier,
  )
  public verifierVCs: VcStorageEntity[]
}

export class AccountsListResult {
  @Field(type => [AccountsEntity])
  public accounts: AccountsEntity[];

  @Field(type => Int)
  public total: number;
}
