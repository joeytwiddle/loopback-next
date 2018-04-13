import {
  createClientForRestServer,
  supertest,
  createClientForHandler,
} from '@loopback/testlab';
import {RestApplication, RestServer, post, param} from '../../../src';
import {NumberType} from '@loopback/types';

describe.only('Coercion', () => {
  let app: RestApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;

  before(givenAnApplication);
  before(givenAServer);
  before(givenAClient);

  it('coerces into number', async () => {
    await client.post('/post/13').expect(200);
  });

  after(async () => {
    await app.stop();
  });

  async function givenAnApplication() {
    app = new RestApplication();
    app.controller(MyController);
    await app.start();
  }

  async function givenAServer() {
    server = await app.getServer(RestServer);
  }

  async function givenAClient() {
    client = await createClientForHandler(server.requestHandler);
  }

  class MyController {
    @post('/post/{num}')
    createNumber(@param.path.number('num') num: number) {
      console.log(typeof num);
      return num;
    }
  }
});
