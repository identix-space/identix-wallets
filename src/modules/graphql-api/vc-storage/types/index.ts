import {Did} from "@/libs/common/types/ssi.types";
import {VcStatusType} from "@/libs/database/types/vc-status.type";

export type TVCStorageCreate = {
  vcData: string;
  issuer?: Did;
  holder?: Did;
  verifier?: Did;
  status?: VcStatusType;
};
