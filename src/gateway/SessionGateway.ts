import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Period, Session } from "../domain/Session";
import { User } from "../domain/User";
import { SessionPort } from "../port/SessionPort";

@namedWith(SessionPort)
export class SessionGateway implements SessionPort {
  @binding
  prisma!: PrismaClient;

  async create(user: User, expiresAt: Period): Promise<Session> {
    const id = UUID.generate();
    await this.prisma.session.create({
      data: {
        id: id.value,
        userId: user.id.value,
        expiresAt: expiresAt.value
      }
    });
    return new Session(id, expiresAt);
  }
}
