import { NextApiHandler } from "next";
import { app } from "../../../../src";
import { UUID } from "../../../../src/domain/Id";
import { Model, Models, ModelStructure } from "../../../../src/domain/Model";

const entities: NextApiHandler = async (req, res) => {
  try {
    switch (req?.method?.toUpperCase()) {
      case "GET":
        return get(req, res);
      case "POST":
        return post(req, res);
      default:
        return res.status(405).json({});
    }
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
};

const get: NextApiHandler = async (req, res) => {
  const session = req.cookies.SESSION;
  const owner = await app.get("sessionUseCase").verifySession(new UUID(session));
  const models = await app.get("modelUseCase").models(owner);
  res.json(toEntities(models));
}

function toEntities(models: Models) {
  return { models: models.map(toEntity) };
}
function toEntity(model: Model) {
  return { id: model.id.value, structure: JSON.parse(model.structure.value) }
}

const post: NextApiHandler = async (req, res) => {
  const session = req.cookies.SESSION;
  const { structure } = req.body;
  const owner = await app.get("sessionUseCase").verifySession(new UUID(session));
  const model = await app.get("modelUseCase").store(owner, new ModelStructure(JSON.stringify(structure)));
  res.json(toEntity(model));
}

export default entities;
