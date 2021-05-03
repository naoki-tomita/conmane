import { FCC } from "./FCC";
import { UUID } from "./Id";

export class Title {
  constructor(readonly value: string) {}
}

export class Content {
  constructor(readonly value: string) {}
}

export class Entry {
  constructor(readonly id: UUID, readonly title: Title, readonly content: Content) {}
}

export class Entries extends FCC<Entry> {}
