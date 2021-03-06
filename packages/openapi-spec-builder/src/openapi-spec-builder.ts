// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/openapi-spec-builder
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as assert from 'assert';
import {
  ExtensionValue,
  OpenApiSpec,
  OperationObject,
  ResponseObject,
  ParameterObject,
  createEmptyApiSpec,
  RequestBodyObject,
} from '@loopback/openapi-v3-types';

/**
 * Create a new instance of OpenApiSpecBuilder.
 *
 * @param basePath The base path on which the API is served.
 */
export function anOpenApiSpec() {
  return new OpenApiSpecBuilder();
}

/**
 * Create a new instance of OperationSpecBuilder.
 */
export function anOperationSpec() {
  return new OperationSpecBuilder();
}

export interface Extendable {
  [extension: string]: ExtensionValue;
}

export class BuilderBase<T extends Extendable> {
  protected _spec: T;

  constructor(initialSpec: T) {
    this._spec = initialSpec;
  }

  /**
   * Add a custom (extension) property to the spec object.
   *
   * @param key The property name starting with "x-".
   * @param value The property value.
   */
  withExtension(key: string, value: ExtensionValue): this {
    assert(
      key.startsWith('x-'),
      `Invalid extension ${key}, extension keys must be prefixed with "x-"`,
    );

    this._spec[key] = value;
    return this;
  }

  /**
   * Build the spec object.
   */
  build(): T {
    // TODO(bajtos): deep-clone
    return this._spec;
  }
}
/**
 * A builder for creating OpenApiSpec documents.
 */
export class OpenApiSpecBuilder extends BuilderBase<OpenApiSpec> {
  /**
   * @param basePath The base path on which the API is served.
   */
  constructor() {
    super(createEmptyApiSpec());
  }

  /**
   * Define a new OperationObject at the given path and verb (method).
   *
   * @param verb The HTTP verb.
   * @param path The path relative to basePath.
   * @param spec Additional specification of the operation.
   */
  withOperation(
    verb: string,
    path: string,
    spec: OperationObject | OperationSpecBuilder,
  ): this {
    if (spec instanceof OperationSpecBuilder) spec = spec.build();
    if (!this._spec.paths[path]) this._spec.paths[path] = {};
    this._spec.paths[path][verb] = spec;
    return this;
  }

  /**
   * Define a new operation that returns a string response.
   *
   * @param verb The HTTP verb.
   * @param path The path relative to basePath.
   * @param operationName The name of the controller method implementing
   * this operation (`x-operation-name` field).
   */
  withOperationReturningString(
    verb: string,
    path: string,
    operationName?: string,
  ): this {
    const spec = anOperationSpec().withStringResponse(200);
    if (operationName) spec.withOperationName(operationName);

    return this.withOperation(verb, path, spec);
  }
}

/**
 * A builder for creating OperationObject specifications.
 */
export class OperationSpecBuilder extends BuilderBase<OperationObject> {
  constructor() {
    super({
      responses: {},
    });
  }

  /**
   * Describe a response for a given HTTP status code.
   * @param status HTTP status code or string "default"
   * @param responseSpec Specification of the response
   */
  withResponse(status: number | 'default', responseSpec: ResponseObject): this {
    // OpenAPI spec uses string indices, i.e. 200 OK uses "200" as the index
    this._spec.responses[status.toString()] = responseSpec;
    return this;
  }

  withStringResponse(status: number | 'default' = 200): this {
    return this.withResponse(status, {
      description: 'The string result.',
      content: {
        'text/plain': {
          schema: {type: 'string'},
        },
      },
    });
  }

  /**
   * Describe a parameter accepted by the operation.
   * Note that parameters are positional in OpenAPI Spec, therefore
   * the first call of `withParameter` defines the first parameter,
   * the second call defines the second parameter, etc.
   * @param parameterSpec
   */
  withParameter(parameterSpec: ParameterObject): this {
    if (!this._spec.parameters) this._spec.parameters = [];
    this._spec.parameters.push(parameterSpec);
    return this;
  }

  withRequestBody(requestBodySpec: RequestBodyObject): this {
    this._spec.requestBody = requestBodySpec;
    return this;
  }

  /**
   * Define the operation name (controller method name).
   *
   * @param name The name of the controller method implementing this operation.
   */
  withOperationName(name: string): this {
    return this.withExtension('x-operation-name', name);
  }

  /**
   * Describe tags associated with the operation
   * @param tags
   */
  withTags(tags: string | string[]): this {
    if (typeof tags === 'string') this._spec.tags = [tags];
    else {
      this._spec.tags = tags;
    }
    return this;
  }
}
