import { PrismaClient } from ".prisma/client";
import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { UUID } from "../../domain/Id";
import { Model, Models, ModelStructure, Name } from "../../domain/Model";
import { User } from "../../domain/User";
import { ModelGateway } from "../ModelGateway";

describe("ModelGateway", () => {
  describe("#findByOwner", () => {
    it("should find models", async () => {
      const target = new ModelGateway();
      const owner = new User(
        new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        mock(),
        mock()
      );
      const models = new Models([
        new Model(
          new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
          new Name("model1"),
          new ModelStructure(JSON.stringify({ c: "c" }))
        ),
        new Model(
          new UUID("dddddddd-dddd-dddd-dddd-dddddddddddd"),
          new Name("model2"),
          new ModelStructure(JSON.stringify({ d: "d" }))
        ),
      ]);

      const modelEntityList = [
        {
          id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
          name: "model1",
          structure: JSON.stringify({ c: "c" }),
        },
        {
          id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
          name: "model2",
          structure: JSON.stringify({ d: "d" }),
        },
      ];
      const prisma = {
        model: {
          findMany: jest.fn(() => Promise.resolve(modelEntityList)),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.findByOwner(owner)).resolves.toEqual(models);
      expect(prisma.model.findMany).toBeCalledWith({
        where: { ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
      });
    });
  });

  describe("#save", () => {
    it("should save entity", async () => {
      const target = new ModelGateway();
      const owner = new User(
        new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        mock(),
        mock()
      );
      const structure = new ModelStructure(JSON.stringify({ c: "c" }));
      const id = new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc");
      const name = new Name("model1");
      const model = new Model(id, name, structure);

      const uuidSpy = jest.spyOn(UUID, "generate");
      uuidSpy.mockReturnValueOnce(id);

      const entity = {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        name: "model1",
        structure: JSON.stringify({ c: "c" }),
      };
      const prisma = {
        model: {
          create: jest.fn(() => Promise.resolve(entity)),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.save(owner, name, structure)).resolves.toEqual(model);
      expect(prisma.model.create).toBeCalledWith({
        data: {
          id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
          ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          name: "model1",
          structure: JSON.stringify({ c: "c" }),
        },
      });

      uuidSpy.mockRestore();
    });
  });

  describe("#findOwnedById", () => {
    it("should get one", async () => {
      const target = new ModelGateway();
      const owner = new User(
        new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        mock(),
        mock()
      );
      const id = new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc");
      const name = new Name("model1");
      const structure = new ModelStructure(JSON.stringify({ c: "c" }));
      const model = new Model(id, name, structure);

      const uuidSpy = jest.spyOn(UUID, "generate");
      uuidSpy.mockReturnValueOnce(id);

      const entity = {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "model1",
        structure: JSON.stringify({ c: "c" }),
      };
      const prisma = {
        model: {
          findFirst: jest.fn(() => Promise.resolve(entity)),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.findOwnedById(owner, id)).resolves.toEqual(model);
      expect(prisma.model.findFirst).toBeCalledWith({
        where: {
          id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
          ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        },
      });
    });
  });

  describe("#update", () => {
    it("should update entity", async () => {
      const target = new ModelGateway();
      const owner = new User(mock(), mock(), mock());
      const id = new UUID("cccccccc-cccc-cccc-cccc-cccccccccccc");
      const name = new Name("model1");
      const structure = new ModelStructure(JSON.stringify({ c: "c" }));
      const model = new Model(id, name, structure);

      const entity = {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        name: "model1",
        structure: JSON.stringify({ c: "c" }),
      };
      const prisma = {
        model: {
          update: jest.fn(() => Promise.resolve(entity)),
        },
      };
      register(prisma).as(PrismaClient);

      await expect(target.update(owner, model)).resolves.toEqual(model);
      expect(prisma.model.update).toBeCalledWith({
        where: {
          id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        },
        data: {
          name: "model1",
          structure: JSON.stringify({ c: "c" }),
        },
      });
    });
  });
});
