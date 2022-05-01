import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Field, Int, ObjectType} from "@nestjs/graphql";
import {UsersEntity} from "./users.entity";
import {VcVerificationCasesEntity} from "@/libs/database/entities/vc-verifier-cases.entity";

@Entity("vc-storage")
@ObjectType()
export class VcStorageEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: " vcDid",
    type: "varchar",
    length: 1024,
    nullable: false,
    unique: true
  })
  @Field({ nullable: false })
  public vcDid: string;

  @Column({
    name: "vcData",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public vcData: string;

  @ManyToOne(
    () => UsersEntity,
    account => account.issuerVCs,
  )
  @Field(type => UsersEntity)
  public issuer: UsersEntity;

  @ManyToOne(
    () => UsersEntity,
    account => account.holderVCs,
  )
  @Field(type => UsersEntity)
  public holder: UsersEntity;

  @OneToMany(
    () => VcVerificationCasesEntity,
    verificationCase => verificationCase.vc,
  )
  public verificationCases: VcVerificationCasesEntity[]

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
