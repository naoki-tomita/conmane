// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TODO(msg?: string): any {
  throw Error(msg ?? "Unimplemented Error");
}
