export type Factory<T> = () => T;

export type Bindings = Record<string, Factory<unknown> | unknown>;
export type Singletons = Record<string, Factory<unknown> | unknown>;

export interface Dependency {
  key: string;
  args: unknown[];
}
export interface ClassHelper {
  inject: () => Dependency[];
}
