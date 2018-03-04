// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/service
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const jugglerModule = require('loopback-datasource-juggler');

import {juggler} from './loopback-datasource-juggler';

export const DataSourceConstructor = jugglerModule.DataSource as typeof juggler.DataSource;

export function getService<T>(ds: juggler.DataSource): T {
  return ds.DataAccessObject as T;
}
