import { createHandler } from "../../../../lib/ApiHandler";
import { app } from "../../../../src";
import { UUID } from "../../../../src/domain/Id";
import {
  Model,
  Models,
  ModelStructure,
  Name,
} from "../../../../src/domain/Model";

const models = createHandler()
  .get(async (req, res) => {
    const session = req.cookies.SESSION;
    const owner = await app
      .get("sessionUseCase")
      .verifySession(new UUID(session));
    const models = await app.get("modelUseCase").list(owner);
    res.json(toEntities(models));
  })
  .post(async (req, res) => {
    const session = req.cookies.SESSION;
    const { name, structure } = req.body;
    const owner = await app
      .get("sessionUseCase")
      .verifySession(new UUID(session));
    const model = await app
      .get("modelUseCase")
      .store(
        owner,
        new Name(name),
        new ModelStructure(JSON.stringify(structure))
      );
    res.json(toEntity(model));
  });
function toEntities(models: Models) {
  return { models: models.map(toEntity) };
}
function toEntity(model: Model) {
  return {
    id: model.id.value,
    name: model.name.value,
    structure: JSON.parse(model.structure.value),
  };
}

export default models;
