import {
  Inject,
  Injectable,
} from "@nestjs/common";

import { SSOClient, ISSOClient} from "@/libs/sso-client/types";
import {Did} from "@/libs/everscale-client/types";

@Injectable()
export class AuthenticationService {
  constructor(@Inject(SSOClient) private ssoClient: ISSOClient) {}

  public async validateUserSession(userSessionDid: Did): Promise<Did> {
    return this.ssoClient.validateUserSession(userSessionDid);
  }
}
