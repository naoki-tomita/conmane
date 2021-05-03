import { Entries } from "../domain/Entry";
import { User } from "../domain/User";

export abstract class EntryPort {
  abstract findByOwner(owner: User): Promise<Entries>;
}
