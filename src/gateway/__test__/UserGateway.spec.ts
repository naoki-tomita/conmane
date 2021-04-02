import {
  PrismaClient,
  User as UserEntity,
  Session as SessionEntity,
} from "@prisma/client";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Period, Session } from "../../domain/Session";
import { Password, LoginId, User } from "../../domain/User";
import { UserGateway } from "../UserGateway";

describe("UserGateway", () => {
  describe("#create", () => {
    it("should create user", async () => {
      const uuid = new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
      const loginId = new LoginId("loginId");
      const password = Password.from("password");
      const uuidSpy = jest.spyOn(UUID, "generate");
      const user = new User(uuid, loginId, password);

      uuidSpy.mockReturnValueOnce(uuid);

      const userEntity: UserEntity = {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        loginId: "loginId",
        password:
          "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      };
      const client = {
        user: {
          create: jest.fn(() => Promise.resolve(userEntity)),
        },
      };

      register(client).as(PrismaClient);
      const target = new UserGateway();

      const actual = await target.create(loginId, password);
      expect(actual).toEqual(user);
      expect(client.user.create).toBeCalledWith({ data: userEntity });
      uuidSpy.mockRestore();
    });
  });

  describe("findBy", () => {
    it("should find user", async () => {
      const id = new LoginId("loginId");
      const user = new User(
        new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        new LoginId("loginId"),
        Password.of(
          "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        )
      );
      const userEntity: UserEntity = {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        loginId: "loginId",
        password:
          "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      };
      const client = {
        user: {
          findFirst: jest.fn(() => Promise.resolve(userEntity)),
        },
      };

      register(client).as(PrismaClient);
      const target = new UserGateway();

      const actual = await target.findById(id);
      expect(actual).toEqual(user);
      expect(client.user.findFirst).toBeCalledWith({
        where: { loginId: "loginId" },
      });
    });
  });

  describe("#findBySession", () => {
    it("should find user by session", async () => {
      const session = new Session(
        new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        new Period(99999)
      );
      const sessionEntity: SessionEntity & { user: UserEntity } = {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        expiresAt: 99999,
        userId: "loginId",
        user: {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          loginId: "loginId",
          password:
            "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        },
      };
      const user = new User(
        new UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        new LoginId("loginId"),
        Password.of(
          "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        )
      );

      const client = {
        session: {
          findFirst: jest.fn(() => Promise.resolve(sessionEntity)),
        },
      };
      register(client).as(PrismaClient);

      const target = new UserGateway();

      const actual = await target.findBySession(session);
      expect(actual).toEqual(user);
      expect(client.session.findFirst).toBeCalledWith({
        where: { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
        include: { user: true },
      });
    });
  });
});
