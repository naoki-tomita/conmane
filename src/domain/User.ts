import { createHash } from "crypto";
import { UUID } from "./Id";

export class LoginId {
  constructor(readonly value: string) {}
}
export class Password {
  private constructor(readonly value: string) {}
  static of(encodedPassword: string): Password {
    return new Password(encodedPassword);
  }
  static from(rawPassword: string): Password {
    return new Password(createHash("sha256").update(rawPassword).digest("hex"));
  }
}

export class User {
  constructor(
    readonly id: UUID,
    readonly userId: LoginId,
    readonly password: Password
  ) {}
  verifyPassword(password: Password): boolean {
    return password.value === this.password.value;
  }
}
