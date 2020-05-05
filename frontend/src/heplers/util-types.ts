export type Unbox<T> = T extends {[K in keyof T]: infer U} ? U : never;
export type PropType<T, K extends keyof T> = T[K];
export type RequiredPick<T, U extends keyof T> = Required<Pick<T, U>> &
  Omit<T, U>;

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#example-2
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U /* eslint-disable-line */
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
