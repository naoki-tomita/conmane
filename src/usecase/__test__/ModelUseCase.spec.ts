import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { when } from "jest-when";
import { UUID } from "../../domain/Id";
import { Model, Models, ModelStructure, Name } from "../../domain/Model";
import { User } from "../../domain/User";
import { ModelPort } from "../../port/ModelPort";
import { ModelUseCase } from "../ModelUseCase";
describe("ModelUseCase", () => {
  describe("#list", () => {
    it("should get models includes only own item.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const models = mock<Models>();

      const port = mock<ModelPort>();
      register(port).as(ModelPort);

      when(port.findByOwner).calledWith(owner).mockResolvedValueOnce(models);

      await expect(target.list(owner)).resolves.toEqual(models);
    });
  });

  describe("#storeModel", () => {
    it("should store model and return stored model.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const name = mock<Name>();
      const structure = mock<ModelStructure>();
      const model = mock<Model>();

      const port = mock<ModelPort>();
      register(port).as(ModelPort);

      when(port.save)
        .calledWith(owner, name, structure)
        .mockResolvedValueOnce(model);

      await expect(target.store(owner, name, structure)).resolves.toEqual(
        model
      );
    });
  });

  describe("#getOne", () => {
    it("should return one model.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const id = mock<UUID>();
      const model = mock<Model>();

      const port = mock<ModelPort>();
      register(port).as(ModelPort);

      when(port.findOwnedById)
        .calledWith(owner, id)
        .mockResolvedValueOnce(model);

      await expect(target.getOne(owner, id)).resolves.toBe(model);
    });
  });

  describe("#update", () => {
    it("should update model.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const model = mock<Model>();

      const port = mock<ModelPort>();
      register(port).as(ModelPort);

      when(port.update).calledWith(owner, model).mockResolvedValueOnce(model);

      await expect(target.update(owner, model)).resolves.toBe(model);
    });
  });
});
