import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Duration, Period, Session } from "../../domain/Session";
import { Password, LoginId, User } from "../../domain/User";
import { SessionPort } from "../../port/SessionPort";
import { UserPort } from "../../port/UserPort";
import { UserUseCase } from "../UserUseCase";

describe("UserUseCase", () => {
  describe("#create", () => {
    it("should create user.", async () => {
      const id = mock<LoginId>();
      const password = mock<Password>();
      const user = mock<User>();

      const userPort = mock<UserPort>();
      register(userPort).as(UserPort);
      userPort.create.mockResolvedValueOnce(user);

      const target = new UserUseCase();
      const actual = await target.create(id, password);

      expect(actual).toBe(user);
      expect(userPort.create).toBeCalledWith(id, password);
    });
  });

  describe("#login", () => {
    it("should login valid password.", async () => {
      const id = mock<LoginId>();
      const password = mock<Password>();
      const user = mock<User>();
      const session = mock<Session>();
      const periodSpy = jest.spyOn(Period, "fromNow");
      const period = mock<Period>()

      const userPort = mock<UserPort>();
      register(userPort).as(UserPort);
      userPort.findBy.mockResolvedValueOnce(user);

      const sessionPort = mock<SessionPort>();
      register(sessionPort).as(SessionPort);
      sessionPort.create.mockResolvedValueOnce(session);

      user.verifyPassword.mockReturnValueOnce(true);

      periodSpy.mockReturnValueOnce(period);

      const target = new UserUseCase();
      const actual = await target.login(id, password);

      expect(actual).toBe(session);
      expect(userPort.findBy).toBeCalledWith(id);
      expect(user.verifyPassword).toBeCalledWith(password);
      expect(periodSpy).toBeCalledWith(new Duration(3600000));
      expect(sessionPort.create).toBeCalledWith(user, period);
      periodSpy.mockRestore();
    });

    it("should throw invalid password.", async () => {
      const id = mock<LoginId>();
      const password = mock<Password>();
      const user = mock<User>();
      const session = mock<Session>();


      const userPort = mock<UserPort>();
      register(userPort).as(UserPort);
      userPort.findBy.mockResolvedValueOnce(user);

      const sessionPort = mock<SessionPort>();
      register(sessionPort).as(SessionPort);
      sessionPort.create.mockResolvedValueOnce(session);

      user.verifyPassword.mockReturnValueOnce(false);

      const target = new UserUseCase();
      await expect(target.login(id, password)).rejects.toBeInstanceOf(Error);

      expect(userPort.findBy).toBeCalledWith(id);
      expect(user.verifyPassword).toBeCalledWith(password);
      expect(sessionPort.create).not.toBeCalled();
    })
  });
});
