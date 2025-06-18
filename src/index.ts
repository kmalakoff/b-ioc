/**
 * IoC Module
 * @module b-ioc-js
 */

export * from './types.js';

import type { Bindings, ClassHelper, Factory, Singletons } from './types.js';

let bindings: Bindings = {};
let resolvedBindings = {};
let singletons: Singletons = {};
let resolvedSingletons = {};

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function isFunction(obj) {
  return typeof obj === 'function' || false;
}

function inObject(key, obj) {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: Legacy
  return obj.hasOwnProperty(key);
}

/**
 * Gets all of the current bindings in the container
 * @return {Bindings} The containers bindings
 */
export function getBindings(): Bindings {
  return bindings;
}

/**
 * Gets all of the current singletons in the container
 * @return {Singletons} The containers singletons
 */
export function getSingletons(): Singletons {
  return singletons;
}

/**
 * Resets container to default state
 */
export function clear(): void {
  bindings = {};
  resolvedBindings = {};
  singletons = {};
  resolvedSingletons = {};
}

/**
 * Assigns to our bindings object
 * @template T
 * @param  {String} binding The name of the IoC binding
 * @param  {Factory<T> | T} closure Factory method or value to bind to container
 */
export function bind<T>(binding: string, closure: Factory<T> | T) {
  if (inObject(binding, bindings) || inObject(binding, singletons)) throw new Error(`Binding: ${binding} already binded.`);
  if (!isFunction(closure)) throw new Error(`Binding: ${binding} does not implement a factory.`);
  bindings[binding] = closure;
}

/**
 * Assigns to our singleton object
 * @template T
 * @param  {String} binding The name of the IoC binding
 * @param  {Factory<T> | T} closure Factory method or value to bind to container
 */
export function singleton<T>(binding: string, closure: Factory<T> | T) {
  if (inObject(binding, singletons) || inObject(binding, bindings)) throw new Error(`Singleton: ${binding} already binded.`);
  singletons[binding] = closure;
}

/**
 * Grabs a binding from the IoC. Leverages node require as a fallback
 * @template T
 * @param  {String} binding The name of the binding in the container
 * @returns {T} The instance of the binding
 */
export function use<T>(binding: string): T {
  // biome-ignore lint/complexity/noArguments: Apply arguments
  const args = Array.prototype.slice.call(arguments, 1);

  // first check bindings
  if (inObject(binding, bindings)) {
    if (resolvedBindings[binding]) {
      throw new Error(`Cyclic dependency detected in binding: ${binding}.`);
    }

    resolvedBindings[binding] = true;

    const instance = (bindings[binding] as Factory<T>).apply(null, args);

    resolvedBindings[binding] = false;

    return instance;
  }

  // then check singletons
  if (inObject(binding, singletons)) {
    if (!inObject(binding, resolvedSingletons)) {
      // we are not guarenteed to receive a factory function for a singleton
      if (isFunction(singletons[binding])) resolvedSingletons[binding] = (singletons[binding] as Factory<T>).apply(null, args);
      else resolvedSingletons[binding] = singletons[binding];
    }

    return resolvedSingletons[binding];
  }

  // finally check node_modules
  throw new Error(`Binding: ${binding} not found.`);
}

/**
 * Creates an instance of a class and will inject dependencies defined in static
 * inject method. This is an alternative to using Ioc.bind
 * @template T
 * @param  {T} Obj The class you wish to create a new instance of
 * @return {T} The instantiated function instance
 */
export function make<T>(Obj: new () => T): T {
  if (!isFunction(Obj)) throw new Error(`.make implementation error, expected function got: ${typeof Obj}`);

  if (!(Obj as unknown as ClassHelper).inject) throw new Error(`.make requires ${Obj.constructor.name} to have a static inject method.`);
  const dependencies = (Obj as unknown as ClassHelper).inject();
  if (dependencies.length === 0) return new Obj();

  const resolved = [];
  dependencies.forEach((dependency) => {
    if (!isString(dependency) && !isObject(dependency)) {
      throw new Error('static .inject implementation error, a string or object is required.');
    }

    // string based binding
    if (isString(dependency)) resolved.push(exports.use(dependency));

    // binding you want to pass args to
    if (isObject(dependency)) {
      dependency.args.unshift(dependency.key);
      resolved.push(exports.use.apply(null, dependency.args));
    }
  });

  return new (Function.prototype.bind.apply(Obj, [null].concat(resolved)))();
}
