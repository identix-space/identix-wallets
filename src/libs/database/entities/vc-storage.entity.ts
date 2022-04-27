import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Field, Int } from "@nestjs/graphql";
import {AccountsEntity} from "./accounts.entity";
import {VcStatusType} from "@/libs/database/types/vc-status.type";

@Entity("vc-storage")
export class VcStorageEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "vcData",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public vcData: string;

  @ManyToOne(
    () => AccountsEntity,
    account => account.issuerVCs,
  )
  @Field(type => AccountsEntity)
  public issuer: AccountsEntity;

  @ManyToOne(
    () => AccountsEntity,
    account => account.holderVCs,
  )
  @Field(type => AccountsEntity)
  public holder: AccountsEntity;

  @ManyToOne(
    () => AccountsEntity,
    account => account.verifierVCs,
  )
  @Field(type => AccountsEntity)
  public verifier: AccountsEntity;

  @Column({
    name: "status",
    type: "enum",
    enum: VcStatusType,
    nullable: false
  })
  @Field(type => VcStatusType, { nullable: false })
  public status: VcStatusType;

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
}


export class VCsListResult {
  @Field(type => [VcStorageEntity])
  public vcs: VcStorageEntity[];

  @Field(type => Int)
  public total: number;
}
