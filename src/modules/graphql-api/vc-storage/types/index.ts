import {Did} from "@/libs/common/types/ssi.types";
import {Field, Int, ObjectType} from "@nestjs/graphql";

export type TVCStorageCreate = {
  vcDid: Did;
  vcData: string;
  issuerDid?: Did;
  holderDid?: Did;
  vcSecret?: string
};

@ObjectType()
export class SignMessageResponse {
  @Field(type => String)
  signed: string;

  @Field(type => String)
  signature: string;
}
