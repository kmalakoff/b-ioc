export type Factory<T> = () => T;

export type Bindings = {
  [key: string]: Factory<unknown> | unknown;
};
export type Singletons = {
  [key: string]: Factory<unknown> | unknown;
};

export interface Dependency {
  key: string;
  args: unknown[];
}
export interface ClassHelper {
  inject: () => Dependency[];
}
