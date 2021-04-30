import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { when } from "jest-when";
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

      when(userPort.create)
        .calledWith(id, password)
        .mockResolvedValueOnce(user);

      const target = new UserUseCase();

      await expect(target.create(id, password)).resolves.toBe(user);
    });
  });

  describe("#login", () => {
    it("should login valid password.", async () => {
      const id = mock<LoginId>();
      const password = mock<Password>();
      const user = mock<User>();
      const session = mock<Session>();
      const periodSpy = jest.spyOn(Period, "fromNow");
      const period = mock<Period>();

      const userPort = mock<UserPort>();
      const sessionPort = mock<SessionPort>();
      register(sessionPort).as(SessionPort);
      register(userPort).as(UserPort);

      when(userPort.findById).calledWith(id).mockResolvedValueOnce(user);
      when(periodSpy)
        .calledWith(new Duration(60 * 60 * 1000))
        .mockReturnValueOnce(period);
      when(sessionPort.create)
        .calledWith(user, period)
        .mockResolvedValueOnce(session);
      when(user.verifyPassword).calledWith(password).mockReturnValueOnce(true);

      const target = new UserUseCase();

      await expect(target.login(id, password)).resolves.toBe(session);
      periodSpy.mockRestore();
    });

    it("should throw invalid password.", async () => {
      const id = mock<LoginId>();
      const password = mock<Password>();
      const user = mock<User>();

      const userPort = mock<UserPort>();
      const sessionPort = mock<SessionPort>();
      register(userPort).as(UserPort);
      register(sessionPort).as(SessionPort);

      when(userPort.findById).calledWith(id).mockResolvedValueOnce(user);
      when(user.verifyPassword).calledWith(password).mockReturnValueOnce(false);

      const target = new UserUseCase();

      await expect(target.login(id, password)).rejects.toBeInstanceOf(Error);
      expect(sessionPort.create).not.toBeCalled();
    });
  });
});
