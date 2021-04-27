import { Model, Models, ModelStructure } from "../domain/Model";
import { User } from "../domain/User";

export abstract class ModelPort {
  abstract findByOwner(owner: User): Promise<Models>;
  abstract save(owner: User, structure: ModelStructure): Promise<Model>;
}
