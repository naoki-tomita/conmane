import { FCC } from "./FCC";
import { UUID } from "./Id";

export class Models extends FCC<Model> {}
export class ModelStructure {
  constructor(readonly value: string) {}
}
export class Name {
  constructor(readonly value: string) {}
}
export class Model {
  constructor(readonly id: UUID, readonly name: Name, readonly structure: ModelStructure) {}
}
