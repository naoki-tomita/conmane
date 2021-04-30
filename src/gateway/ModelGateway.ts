import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { UUID } from "../domain/Id";
import { Model, Models, ModelStructure, Name } from "../domain/Model";
import { User } from "../domain/User";
import { ModelPort } from "../port/ModelPort";

@namedWith(ModelPort)
export class ModelGateway implements ModelPort {
  @binding
  prisma: PrismaClient;

  findByOwner(owner: User): Promise<Models> {
    return this.prisma.model
      .findMany({ where: { ownerId: owner.id.value } })
      .then((models) =>
        models.map(
          (model) => new Model(
            new UUID(model.id),
            new Name(model.name),
            new ModelStructure(model.structure)
          )
        )
      )
      .then((models) => new Models(models));
  }

  async save(owner: User, name: Name, structure: ModelStructure): Promise<Model> {
    const id = UUID.generate();
    const e = await this.prisma.model.create({
      data: {
        id: id.value,
        ownerId: owner.id.value,
        name: name.value,
        structure: structure.value,
      },
    });
    return new Model(new UUID(e.id), new Name(e.name), new ModelStructure(e.structure));
  }

  findOwnedById(owner: User, id: UUID): Promise<Model> {
    return this.prisma.model
      .findFirst({
        where: {
          id: id.value,
          ownerId: owner.id.value,
        },
      })
      .then(e => {
        if (e == null) {
          throw Error("not found")
        }
        return e;
      })
      .then(
        (e) => new Model(new UUID(e.id), new Name(e.name), new ModelStructure(e.structure))
      );
  }

  update(_: User, model: Model): Promise<Model> {
    return this.prisma.model
      .update({
        where: {
          id: model.id.value,
        },
        data: {
          name: model.name.value,
          structure: model.structure.value,
        },
      })
      .then((e) => new Model(new UUID(e.id), new Name(e.name), new ModelStructure(e.structure)));
  }
}
