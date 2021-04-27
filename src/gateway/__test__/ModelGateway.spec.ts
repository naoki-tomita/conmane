import { PrismaClient } from ".prisma/client";
import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Model, Models, ModelStructure } from "../../domain/Model";
import { User } from "../../domain/User";
import { ModelGateway } from "../ModelGateway";

describe("ModelGateway", () => {
  describe("#findByOwner", () => {
    it("should find models", async () => {
      const target = new ModelGateway();
      const owner = new User(new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), mock(), mock() );
      const models = new Models([
        new Model(new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"), new ModelStructure(JSON.stringify({ c: "c" }))),
        new Model(new UUID("dddddddd-dddd-dddd-dddd-dddddddddddd"), new ModelStructure(JSON.stringify({ d: "d" }))),
      ]);

      const modelEntityList = [{
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        structure: JSON.stringify({ c: "c" }),
      }, {
        id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        structure: JSON.stringify({ d: "d" }),
      }];
      const prisma = {
        model: {
          findMany: jest.fn(() => Promise.resolve(modelEntityList)),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.findByOwner(owner)).resolves.toEqual(models);
      expect(prisma.model.findMany).toBeCalledWith({ where: { ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" } });
    });
  });

  describe("#save", () => {
    it("should save entity", async () => {
      const target = new ModelGateway();
      const owner = new User(new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), mock(), mock());
      const structure = new ModelStructure(JSON.stringify({ c: "c" }));
      const id = new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc");
      const model = new Model(id, structure);

      const uuidSpy = jest.spyOn(UUID, "generate");
      uuidSpy.mockReturnValueOnce(id);

      const prisma = {
        model: {
          create: jest.fn(() => ({})),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.save(owner, structure)).resolves.toEqual(model);
      expect(prisma.model.create).toBeCalledWith({ data: {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        structure: JSON.stringify({ c: "c" }),
      } });
    });
  })
});
