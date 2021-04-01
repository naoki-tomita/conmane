import { v4 } from "uuid";
export class UUID {
  constructor(readonly value: string) {}
  static generate(): UUID {
    return new UUID(v4());
  }
}
