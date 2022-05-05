import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ISSOClientService} from "@/libs/sso-client/types";
import {ISsoService} from "identix-sso-client-js/src/ISsoService";
import {Did} from "@/libs/everscale-client/types";

@Injectable()
export class SsoClientService implements ISSOClientService{
  private ssoService: ISsoService;
  private didSessionsStorage: Map<Did, {did: Did, createdAt: Date}>
    = new Map<Did, {did: Did, createdAt: Date}>();
  private expiringDurationInSec: number = 24 * 3600; //24 hours

  init(ssoService: ISsoService): void {
    this.ssoService = ssoService;
  }

  public async validateUserSession(clientToken: string, userSessionDid: Did): Promise<Did> {
    if (this.didSessionsStorage.has(userSessionDid)) {
      const session = this.didSessionsStorage.get(userSessionDid);
      const sessionCreatedAt = session.createdAt;
      if (sessionCreatedAt.getTime() + this.expiringDurationInSec * 1000 > (new Date()).getTime()) {
        return session.did;
      }

      this.didSessionsStorage.delete(userSessionDid);
    }

    let userDid;
    try {
      await this.ssoService.validateUserSession(clientToken, userSessionDid);
      const userInfo = await this.ssoService.getCurrentUserInfo(clientToken, userSessionDid);
      userDid = userInfo?.did;
    } catch (e) {
      throw new UnauthorizedException();
    }

    if (!userDid) {
      throw new UnauthorizedException();
    }

    this.didSessionsStorage.set(userSessionDid, {did: userDid, createdAt: new Date()})

    return userDid;
  }
}
