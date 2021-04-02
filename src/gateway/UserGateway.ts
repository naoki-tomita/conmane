import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Session } from "../domain/Session";
import { LoginId, Password, User } from "../domain/User";
import { UserPort } from "../port/UserPort";

@namedWith(UserPort)
export class UserGateway implements UserPort {
  @binding
  prisma!: PrismaClient;

  async create(loginId: LoginId, password: Password): Promise<User> {
    const id = UUID.generate();
    await this.prisma.user.create({
      data: {
        id: id.value,
        loginId: loginId.value,
        password: password.value,
      },
    });
    return new User(id, loginId, password);
  }

  async findById(loginId: LoginId): Promise<User> {
    const entity = await this.prisma.user.findFirst({
      where: { loginId: loginId.value },
    });
    return new User(
      new UUID(entity.id),
      new LoginId(entity.loginId),
      Password.of(entity.password)
    );
  }

  async findBySession(session: Session): Promise<User> {
    const { user } = await this.prisma.session.findFirst({
      where: { id: session.id.value },
      include: { user: true },
    });
    return new User(
      new UUID(user.id),
      new LoginId(user.loginId),
      Password.of(user.password)
    );
  }
}
