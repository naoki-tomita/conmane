import { PrismaClient, User as UserEntity } from "@prisma/client";
import { mock } from "@kojiro.ueda/bandia";
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
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
      }
      const client = {
        user: {
          create: jest.fn(() => Promise.resolve(userEntity)),
        }
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
        Password.of("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")
      );
      const userEntity: UserEntity = {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        loginId: "loginId",
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
      };
      const client = {
        user: {
          findFirst: jest.fn(() => Promise.resolve(userEntity)),
        }
      }

      register(client).as(PrismaClient);
      const target = new UserGateway();

      const actual = await target.findBy(id);
      expect(actual).toEqual(user);
      expect(client.user.findFirst).toBeCalledWith({ where: { loginId: "loginId" } });
    });
  });
});
