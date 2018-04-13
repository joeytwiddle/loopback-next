import {Constructor} from './common-types';
import {NumberType} from './handlers';

// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/types
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// tslint:disable-next-line:no-any
export function getSerializer(ctor: Constructor<any>) {
  if (ctor === Number) {
    return new NumberType();
  }
  throw new Error('only numberType is implemented');
}
