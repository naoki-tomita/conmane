export class FCC<T> {
  constructor(readonly values: T[]) {}
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: FCC<T>
  ): U[] {
    return this.values.map(callbackfn, thisArg);
  }
}
