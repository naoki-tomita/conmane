import { Session } from "../domain/Session";
import { Password, LoginId, User } from "../domain/User";

export abstract class UserPort {
  abstract create(userId: LoginId, password: Password): Promise<User>;
  abstract findById(userId: LoginId): Promise<User>;
  abstract findBySession(session: Session): Promise<User>;
}
