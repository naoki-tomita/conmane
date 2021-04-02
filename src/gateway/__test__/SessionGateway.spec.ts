import { PrismaClient, Session as SessionEntity } from "@prisma/client";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Period, Session } from "../../domain/Session";
import { Password, LoginId, User } from "../../domain/User";
import { SessionGateway } from "../SessionGateway";

describe("SessionGateway", () => {
  describe("#create", () => {
    it("should create session", async () => {
      const uuid = new UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
      const userId = new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
      const loginId = new LoginId("loginId");
      const password = Password.from("password");
      const user = new User(userId, loginId, password);
      const session = new Session(
        new UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        new Period(99999)
      );

      const uuidSpy = jest.spyOn(UUID, "generate");
      uuidSpy.mockReturnValueOnce(uuid);

      const sessionEntity: SessionEntity = {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        expiresAt: 99999,
      };
      const client = {
        session: {
          create: jest.fn(() => Promise.resolve(sessionEntity)),
        },
      };

      register(client).as(PrismaClient);
      const target = new SessionGateway();

      const actual = await target.create(user, new Period(99999));
      expect(actual).toEqual(session);
      expect(client.session.create).toBeCalledWith({ data: sessionEntity });
      uuidSpy.mockRestore();
    });
  });

  describe("#findBy", () => {
    it("should find session by id", async () => {
      const uuid = new UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
      const session = new Session(
        new UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        new Period(99999)
      );

      const sessionEntity: SessionEntity = {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        expiresAt: 99999,
      };
      const client = {
        session: {
          findFirst: jest.fn(() => Promise.resolve(sessionEntity)),
        },
      };
      register(client).as(PrismaClient);

      const target = new SessionGateway();
      const actual = await target.findBy(uuid);

      expect(actual).toEqual(session);
      expect(client.session.findFirst).toBeCalledWith({
        where: { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
      });
    });
  });
});
