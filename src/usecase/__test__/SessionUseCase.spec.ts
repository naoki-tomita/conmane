import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Session } from "../../domain/Session";
import { User } from "../../domain/User";
import { SessionPort } from "../../port/SessionPort";
import { UserPort } from "../../port/UserPort";
import { SessionUseCase } from "../SessionUseCase";
describe("SessionUseCase", () => {
  describe("#verifySession", () => {
    it("should verify session and get user", async () => {
      const user = mock<User>();
      const uuid = mock<UUID>();
      const session = mock<Session>();

      const sessionPort = mock<SessionPort>();
      register(sessionPort).as(SessionPort);
      sessionPort.findBy.mockResolvedValueOnce(session);

      const userPort = mock<UserPort>();
      register(userPort).as(UserPort);
      userPort.findBySession.mockResolvedValueOnce(user);

      const target = new SessionUseCase();

      const actual = await target.verifySession(uuid);

      expect(actual).toBe(user);
      expect(sessionPort.findBy).toBeCalledWith(uuid);
      expect(userPort.findBySession).toBeCalledWith(session);
    });
  });
});
