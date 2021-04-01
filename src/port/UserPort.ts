import { Password, LoginId, User } from "../domain/User";

export abstract class UserPort {
  abstract create(userId: LoginId, password: Password): Promise<User>;
  abstract findBy(userId: LoginId): Promise<User>;
}
