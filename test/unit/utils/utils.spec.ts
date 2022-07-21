// tslint:disable-next-line: no-implicit-dependencies
import { conform } from '@utils/utils';
import { GenericObject } from 'moleculer';

const schema: GenericObject = {
  APP_CLUSTER_ISMASTER: { name: 'app.cluster.isMaster', type: 'boolean' },
  APP_CLUSTER_WORKERS: { name: 'app.cluster.workers', type: 'number' },
  APP_DATABASE: { name: 'app.database', type: 'object' },
  APP_IP: { name: 'app.ip', type: 'string' },
  APP_NAME: 'app.name',
  APP_PORT: { name: 'app.port', type: 'number' },
  APP_USETLS: 'app.useTls',
  CHECKED: { name: 'checked', type: 'boolean' },
  COUNT: { name: 'count', type: 'number' },
  FINISHED: { name: 'finished', type: 'boolean' },
  NAME: { name: 'name', type: 'string' },
  OPTS: { name: 'opts', type: 'object' },
  SSL: { name: 'ssl', type: 'boolean' },
  STRICTMODE: { name: 'strictMode', type: 'boolean' },
};

describe('utils.conform', () => {
  it('convert string to number', () => {
    const options: GenericObject = {
      COUNT: '199',
    };
    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.count).toStrictEqual(199);
  });

  it('get number representation', () => {
    const options: GenericObject = {
      COUNT: 234,
    };
    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.count).toStrictEqual(234);
  });

  it('convert string to boolean', () => {
    const options: GenericObject = {
      CHECKED: 'true',
      FINISHED: '1',
      SSL: 'yes',
      STRICTMODE: 'no',
    };

    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.checked).toStrictEqual(true);
    expect(result.finished).toStrictEqual(true);
    expect(result.ssl).toStrictEqual(true);
    expect(result.strictMode).toStrictEqual(false);
  });

  it('get string representation', () => {
    const options: GenericObject = {
      NAME: 'John Doe',
    };
    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.name).toStrictEqual('John Doe');
  });

  it('convert string to object', () => {
    const options: GenericObject = {
      OPTS: '{"indent":4,"prefix": "TEST_"}',
    };
    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.opts).toStrictEqual({ indent: 4, prefix: 'TEST_' });
  });

  it('convert key with `_` to object', () => {
    const options: GenericObject = {
      APP_CLUSTER_ISMASTER: 'false',
      APP_CLUSTER_WORKERS: '8',
      APP_DATABASE: '{"user": "test","password": "12345"}',
      APP_IP: '127.0.0.1',
      APP_NAME: 'APP 1',
      APP_PORT: '5012',
      APP_USETLS: 'yes',
    };

    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.app.cluster.isMaster).toStrictEqual(false);
    expect(result.app.cluster.workers).toStrictEqual(8);
    expect(result.app.database.user).toStrictEqual('test');
    expect(result.app.database.password).toStrictEqual('12345');
    expect(result.app.name).toStrictEqual('APP 1');
    expect(result.app.ip).toStrictEqual('127.0.0.1');
    expect(result.app.port).toStrictEqual(5012);
    expect(result.app.useTls).toStrictEqual('yes');
  });

  it('get an empty object when options is {}', () => {
    const options: GenericObject = {};

    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result).toStrictEqual({});
  });

  it('exclude keys not conform to the schema', () => {
    const options: GenericObject = {
      NAME: 'APP 1',
      WORKERS: '2',
    };

    const result: GenericObject = conform<GenericObject>(options, schema);
    expect(result.WORKERS).toBeUndefined();
    expect(result.name).toStrictEqual('APP 1');
  });
});
