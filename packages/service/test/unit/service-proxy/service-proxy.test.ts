// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/service
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';

import {proxify, Invocable, Invoker} from '../../..';

// tslint:disable:no-any
describe('proxify', () => {
  class MyService implements Invocable {
    [property: string]: any;
    name = 'MyService';

    invoke(operationName: string, ...args: any[]) {
      return operationName + ': ' + args;
    }

    getName() {
      return this.name;
    }
  }

  class YourService {
    [property: string]: any;

    getName() {
      return 'YourService';
    }
  }

  class MyInvoker implements Invoker {
    invoke(target: any, operationName: string, ...args: any[]) {
      return operationName + ': ' + args;
    }
  }

  it('creates a proxy', () => {
    const proxy = proxify(new MyService());
    let result = proxy.x(1);
    expect(result).to.eql('x: 1');
    result = proxy.y('a', 1);
    expect(result).to.eql('y: a,1');
  });

  it('honors existing methods', () => {
    const proxy = proxify(new MyService());
    let result = proxy.getName();
    expect(result).to.eql('MyService');
  });

  it('creates a proxy from an invoker', () => {
    const proxy = proxify({} as {[property: string]: any}, new MyInvoker());
    let result = proxy.x(1);
    expect(result).to.eql('x: 1');
    result = proxy.y('a', 1);
    expect(result).to.eql('y: a,1');
  });

  it('creates a proxy from a regular object', () => {
    const proxy = proxify(new YourService());
    let result = proxy.getName();
    expect(result).to.eql('YourService');

    expect(proxy.x).to.be.undefined();
  });
});
