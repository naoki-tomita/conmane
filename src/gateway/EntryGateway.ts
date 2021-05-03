import { PrismaClient } from ".prisma/client";
import { binding, namedWith } from "automated-omusubi";
import { Content, Entries, Entry, Title } from "../domain/Entry";
import { UUID } from "../domain/Id";
import { User } from "../domain/User";
import { EntryPort } from "../port/EntryPort";

@namedWith(EntryPort)
export class EntryGateway extends EntryPort {
  @binding
  prisma: PrismaClient;

  findByOwner(owner: User): Promise<Entries> {
    return this.prisma.entry.findMany({
      where: {
        ownerId: owner.id.value
      },
    })
    .then(entities => entities.map(entity => new Entry(new UUID(entity.id), new Title(entity.title), new Content(entity.content))))
    .then(it => new Entries(it));
  }
}
