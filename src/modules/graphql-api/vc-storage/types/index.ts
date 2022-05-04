import {Did} from "@/libs/common/types/ssi.types";

export type TVCStorageCreate = {
  vcDid: Did;
  vcData: string;
  issuerDid?: Did;
  holderDid?: Did;
  vcSecret?: string
};
