import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { when } from "jest-when";
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
      const userPort = mock<UserPort>();
      register(sessionPort).as(SessionPort);
      register(userPort).as(UserPort);

      when(sessionPort.findBy).calledWith(uuid).mockResolvedValueOnce(session);
      when(userPort.findBySession).calledWith(session).mockResolvedValueOnce(user);

      const target = new SessionUseCase();
      const actual = await target.verifySession(uuid);

      expect(actual).toBe(user);
      expect(sessionPort.findBy).toBeCalledWith(uuid);
      expect(userPort.findBySession).toBeCalledWith(session);
    });
  });
});
