import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { UUID } from "../domain/Id";
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
        password: password.value
      }
    });
    return new User(id, loginId, password);
  }

  findBy(loginId: LoginId): Promise<User> {
    return this.prisma.user.findFirst({ where: { loginId: loginId.value } })
      .then(it => new User(new UUID(it.id), new LoginId(it.loginId), Password.of(it.password)));
  }
}
