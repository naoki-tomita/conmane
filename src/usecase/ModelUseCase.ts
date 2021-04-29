import { binding, named } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Model, Models, ModelStructure } from "../domain/Model";
import { User } from "../domain/User";
import { ModelPort } from "../port/ModelPort";
import { TODO } from "../TODO";

@named
export class ModelUseCase {
  @binding
  modelPort: ModelPort;

  list(owner: User): Promise<Models> {
    return this.modelPort.findByOwner(owner);
  }

  store(owner: User, structure: ModelStructure) {
    return this.modelPort.save(owner, structure);
  }

  get(owner: User, id: UUID): Promise<Model> {
    return TODO();
  }

  update(owner: User, structure: ModelStructure): Promise<Model> {
    return TODO();
  }
}
