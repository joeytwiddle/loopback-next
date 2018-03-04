// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/service
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// tslint:disable:no-any

/**
 * Invocable represents a weakly-typed object that has a generic `invoke` method
 * to handle method invocations
 */
export interface Invocable {
  /**
   * Properties or methods
   */
  [property: string]: any;
  /**
   * Invoke an operation with an array of arguments
   * @param operationName Name of the operation
   * @param args An array of arguments
   */
  invoke(operationName: string, ...args: any[]): any;
}

/**
 * An invoker is responsible for implementing method invocations on the given
 * target
 */
export interface Invoker {
  invoke(target: any, operationName: string, ...args: any[]): any;
}

function isInvocable(obj: any): obj is Invocable {
  return obj != null && typeof obj.invoke === 'function';
}

class InvocableProxyHandler<T extends {[property: string]: any}>
  implements ProxyHandler<T> {
  get(target: T, propKey: PropertyKey, receiver: any) {
    if (propKey in target) {
      return target[propKey];
    }
    if (isInvocable(target)) {
      return function(...args: any[]) {
        return target.invoke(propKey.toString(), ...args);
      };
    } else {
      return undefined;
    }
  }
}

class InvokerProxyHandler<T extends object> implements ProxyHandler<T> {
  constructor(private invoker: Invoker) {}
  get(target: T, propKey: PropertyKey, receiver: any) {
    return (...args: any[]) =>
      this.invoker.invoke(target, propKey.toString(), ...args);
  }
}

const DEFAULT_HANDLER = new InvocableProxyHandler<any>();

/**
 * Create a proxy for the given object
 * @param obj The source object
 * @param invoker The optional invoker that handles invocation of methods that
 * do not exist on the source object. If not provided, the proxy will try to
 * use the `invoke` method if it is implemented by the source object. If
 * neither an invoker nor the invoke method is present, the proxy only allows
 * existing properties and methods on the source object.
 */
export function proxify<T extends object>(obj: T, invoker?: Invoker): T {
  if (invoker) {
    return new Proxy<T>(obj, new InvokerProxyHandler(invoker));
  }
  return new Proxy<T>(obj, DEFAULT_HANDLER);
}
