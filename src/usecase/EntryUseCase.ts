import { binding, named } from "automated-omusubi";
import { Entries } from "../domain/Entry";
import { User } from "../domain/User";
import { EntryPort } from "../port/EntryPort";

@named
export class EntryUseCase {
  @binding
  entryPort: EntryPort;

  list(owner: User): Promise<Entries> {
    return this.entryPort.findByOwner(owner);
  }
}
