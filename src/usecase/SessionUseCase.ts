import { binding, named } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { User } from "../domain/User";
import { SessionPort } from "../port/SessionPort";
import { UserPort } from "../port/UserPort";

@named
export class SessionUseCase {
  @binding
  userPort!: UserPort;

  @binding
  sessionPort!: SessionPort;

  async verifySession(sessionId: UUID): Promise<User> {
    const session = await this.sessionPort.findBy(sessionId);
    return this.userPort.findBySession(session);
  }
}
