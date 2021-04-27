import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { Model, Models, ModelStructure } from "../../domain/Model";
import { User } from "../../domain/User";
import { ModelPort } from "../../port/ModelPort";
import { ModelUseCase } from "../ModelUseCase";
describe("ModelUseCase", () => {
  describe("#models", () => {
    it("should get models includes only own item.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const models = mock<Models>();

      const port = mock<ModelPort>();
      port.findByOwner.mockResolvedValueOnce(models);
      register(port).as(ModelPort);

      await expect(target.models(owner)).resolves.toEqual(models);
      expect(port.findByOwner).toBeCalledWith(owner);
    });
  });

  describe("#storeModel", () => {
    it("should store model and return stored model.", async () => {
      const target = new ModelUseCase();
      const owner = mock<User>();
      const model = mock<Model>();
      const structure = mock<ModelStructure>();

      const port = mock<ModelPort>();
      port.save.mockResolvedValueOnce(model);
      register(port).as(ModelPort);

      await expect(target.store(owner, structure)).resolves.toEqual(model);
      expect(port.save).toBeCalledWith(owner, structure);
    });
  });
});
