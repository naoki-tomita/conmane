import { UUID } from "./Id";

type OnlyOneOf<T, K extends keyof T = keyof T> = K extends keyof T
  ? Pick<T, K>
  : never;

interface DurationOption {
  hour: number;
  minutes: number;
  seconds: number;
  milliSeconds: number;
}

export class Duration {
  constructor(readonly value: number) {}
  static of(opt: OnlyOneOf<DurationOption>): Duration {
    const {
      hour,
      minutes = typeof hour === "number" ? hour * 60 : undefined,
      seconds = typeof minutes === "number" ? minutes * 60 : undefined,
      milliSeconds = typeof seconds === "number" ? seconds * 1000 : 0,
    } = opt as Partial<DurationOption>;
    return new Duration(milliSeconds);
  }
}

export class Period {
  constructor(readonly value: number) {}
  toDate(): Date {
    return new Date(this.value);
  }
  static fromNow(duration: Duration): Period {
    return new Period(Date.now() + duration.value);
  }
}

export class Session {
  constructor(readonly id: UUID, readonly expiresAt: Period) {}
}
