
import { binding, named } from "automated-omusubi";
import { Duration, Period, Session } from "../domain/Session";
import { Password, LoginId, User } from "../domain/User";
import { SessionPort } from "../port/SessionPort";
import { UserPort } from "../port/UserPort";
import { TODO } from "../TODO";

@named
export class UserUseCase {
  @binding
  userPort!: UserPort;

  @binding
  sessionPort!: SessionPort;

  async create(id: LoginId, password: Password): Promise<User> {
    return this.userPort.create(id, password);
  }

  async login(id: LoginId, password: Password): Promise<Session> {
    const user = await this.userPort.findBy(id);
    if (user.verifyPassword(password)) {
      return this.sessionPort.create(user, Period.fromNow(Duration.of({ hour: 1 })));
    }
    TODO();
  }
}
