import { Period, Session } from "../domain/Session";
import { User } from "../domain/User";

export abstract class SessionPort {
  abstract create(user: User, expiresAt: Period): Promise<Session>;
}
