import { createHandler } from "../../../../lib/ApiHandler";
import { app } from "../../../../src";
import { UUID } from "../../../../src/domain/Id";
import { Model, ModelStructure, Name } from "../../../../src/domain/Model";

const model = createHandler()
  .get(async (req, res) => {
    const session = req.cookies.SESSION;
    const { id } = req.query;
    const owner = await app
      .get("sessionUseCase")
      .verifySession(new UUID(session));
    const model = await app
      .get("modelUseCase")
      .getOne(owner, new UUID(id as string));
    res.json(toEntity(model));
  })
  .put(async (req, res) => {
    const session = req.cookies.SESSION;
    const { name, structure } = req.body;
    const { id } = req.query;
    const owner = await app
      .get("sessionUseCase")
      .verifySession(new UUID(session));
    const model = await app
      .get("modelUseCase")
      .update(
        owner,
        new Model(
          new UUID(id as string),
          new Name(name),
          new ModelStructure(JSON.stringify(structure))
        )
      );
    res.json(toEntity(model));
  });

function toEntity(model: Model) {
  return {
    id: model.id.value,
    name: model.name.value,
    structure: JSON.parse(model.structure.value),
  };
}

export default model;
