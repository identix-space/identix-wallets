import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int } from "@nestjs/graphql";

@Entity("vc-storage")
export class VCStorageEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;
}
