// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/service
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import * as util from 'util';

import {DataSourceConstructor, juggler, getService} from '../../../';

describe('loopback-connector-rest', () => {
  let ds: juggler.DataSource;

  before(function() {
    ds = new DataSourceConstructor({
      name: 'db',

      connector: 'loopback-connector-rest',
      strictSSL: false,
      debug: false,
      defaults: {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      },
      operations: [
        {
          template: {
            method: 'GET',
            url: 'http://maps.googleapis.com/maps/api/geocode/{format=json}',
            query: {
              address: '{street},{city},{zipcode}',
              sensor: '{sensor=false}',
            },
            options: {
              strictSSL: true,
              useQuerystring: true,
            },
            responsePath: '$.results[0].geometry.location',
          },
          functions: {
            geocode: ['street', 'city', 'zipcode'],
          },
        },
      ],
    });
  });

  it('invokes geocode()', async () => {
    const loc = {
      street: '107 S B St',
      city: 'San Mateo',
      zipcode: '94401',
    };

    const geoService: {geocode: Function} = getService(ds);

    const geocode = util.promisify(geoService.geocode);
    //tslint:disable:no-any
    const result = await geocode(loc.street, loc.city, loc.zipcode);

    // { lat: 37.5669986, lng: -122.3237495 }
    expect(result[0].lat).approximately(37.5669986, 0.5);
    expect(result[0].lng).approximately(-122.3237495, 0.5);
  });
});
