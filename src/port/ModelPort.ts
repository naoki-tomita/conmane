import { UUID } from "../domain/Id";
import { Model, Models, ModelStructure, Name } from "../domain/Model";
import { User } from "../domain/User";

export abstract class ModelPort {
  abstract findByOwner(owner: User): Promise<Models>;
  abstract save(owner: User, name: Name, structure: ModelStructure): Promise<Model>;
  abstract findOwnedById(owner: User, id: UUID): Promise<Model>;
  abstract update(owner: User, model: Model): Promise<Model>;
}
