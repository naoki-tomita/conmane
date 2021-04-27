import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Model, Models, ModelStructure } from "../domain/Model";
import { User } from "../domain/User";
import { ModelPort } from "../port/ModelPort";

@namedWith(ModelPort)
export class ModelGateway implements ModelPort {
  @binding
  prisma: PrismaClient;

  async findByOwner(owner: User): Promise<Models> {
    return this.prisma.model.findMany({ where: { ownerId: owner.id.value } })
      .then(models => models.map(model => new Model(new UUID(model.id), new ModelStructure(model.structure))))
      .then(models => new Models(models));
  }

  async save(owner: User, structure: ModelStructure): Promise<Model> {
    const id = UUID.generate();
    this.prisma.model.create({
      data: {
        id: id.value,
        ownerId: owner.id.value,
        structure: structure.value
      }
    })
    return new Model(id, structure);
  }
}
