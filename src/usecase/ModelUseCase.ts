import { binding, named } from "automated-omusubi";
import { Models, ModelStructure } from "../domain/Model";
import { User } from "../domain/User";
import { ModelPort } from "../port/ModelPort";

@named
export class ModelUseCase {
  @binding
  modelPort: ModelPort;

  models(owner: User): Promise<Models> {
    return this.modelPort.findByOwner(owner);
  }

  store(owner: User, structure: ModelStructure) {
    return this.modelPort.save(owner, structure);
  }
}
