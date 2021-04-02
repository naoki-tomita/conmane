/* eslint @typescript-eslint/no-explicit-any: 0 */
export function TODO(msg?: string): any {
  throw Error(msg ?? "Unimplemented Error");
}
