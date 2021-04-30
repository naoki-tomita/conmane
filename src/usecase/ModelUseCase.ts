import { binding, named } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Model, Models, ModelStructure, Name } from "../domain/Model";
import { User } from "../domain/User";
import { ModelPort } from "../port/ModelPort";

@named
export class ModelUseCase {
  @binding
  modelPort: ModelPort;

  list(owner: User): Promise<Models> {
    return this.modelPort.findByOwner(owner);
  }

  store(owner: User, name: Name, structure: ModelStructure): Promise<Model> {
    return this.modelPort.save(owner, name, structure);
  }

  getOne(owner: User, id: UUID): Promise<Model> {
    return this.modelPort.findOwnedById(owner, id);
  }

  update(owner: User, model: Model): Promise<Model> {
    return this.modelPort.update(owner, model);
  }
}
