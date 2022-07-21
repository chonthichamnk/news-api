import mongodbMixin from '@mixins/mongodb.mixin';
import { Errors } from 'moleculer';
import { MongoClient } from 'mongodb';
const authCallback = jest.fn(() => null);
const fakeCollection = {
  clear: jest.fn(),
  s: {
    name: 'books',
  },
  topology: {
    auth: jest.fn(() => authCallback),
  },
};
const fakeConnection = {
  client: {
    topology: {
      auth: jest.fn(() => Promise.resolve(Promise.resolve('OK'))),
    },
  },
  close: jest.fn(),
  db: jest.fn().mockReturnValue({
    databaseName: 'mockDB',
    collection: jest.fn(() => fakeCollection),
    on: jest.fn(),
  }),
  s: {
    options: {
      servers: [{ host: 'localhost', port: 53017 }]
    },
  }
};

const mongodbPrefix = 'MONGODB_';

describe('Test mongodb-mixin', () => {
  describe('get mixin', () => {

    it('connect to mockDB on 127.0.0.1:20071', () => {
      MongoClient.connect = jest.fn(() => <any>Promise.resolve(fakeConnection));
      process.env.MONGODB_URI = 'mongodb://127.0.0.1:20071/mockDB';
      const actual = mongodbMixin('documents');
      expect(actual).toBeDefined();
      expect(actual.adapter.uri).toBe('mongodb://127.0.0.1:20071/mockDB');
      expect(actual.collection).toBe('documents');
    });

    it('connect with SSL', () => {
      process.env[mongodbPrefix + 'SSL'] = 'true';
      process.env[mongodbPrefix + 'SSLCA'] = './test/unit/fixtures/pubkey';
      process.env[mongodbPrefix + 'SSLCERT'] = './test/unit/fixtures/pubkey';
      process.env[mongodbPrefix + 'SSLKEY'] = './test/unit/fixtures/pubkey';
      const actual = mongodbMixin('documents');
      expect(actual).toBeDefined();
      expect(actual.adapter.uri).toBe('mongodb://127.0.0.1:20071/mockDB');
      expect(actual.collection).toBe('documents');
    });

    it('connect without SSL', () => {
      delete process.env[mongodbPrefix + 'SSL'];
      delete process.env[mongodbPrefix + 'SSLCA'];
      delete process.env[mongodbPrefix + 'SSLCERT'];
      delete process.env[mongodbPrefix + 'SSLKEY'];
      const actual = mongodbMixin('documents');
      expect(actual).toBeDefined();
    });
    
    it('throw ServiceSchemaError when MONGODB_URI is not defined', () => {
      delete process.env.MONGODB_URI;
      const actual = () => {
        mongodbMixin('documents');
      };
      expect(actual).toThrowError(Errors.ServiceSchemaError);
    });

    it('throw Unsupported database', () => {
      process.env.MONGODB_URI = 'mariadb://localhost:3306';
      const actual = () => {
        mongodbMixin('collection1');
      };
      expect(actual).toThrowError(Errors.ServiceSchemaError);
      expect(actual).toThrowError('Unsupported database');
    });
  });

  describe('afterConnected', () => {
    it('log 1 server', () => {
      process.env.MONGODB_URI = 'mongodb://127.0.0.2:22017';
      const result = mongodbMixin('doc_id_counters');
      if(result.afterConnected !== undefined && result.adapter !== undefined) {
        result.adapter = {
          client: {
            s: {
              options:
              { servers : [{host: '127.0.0.2', port: 22017}] }
            }
          },
          db: {
            databaseName: 'db1'
          }
        };
        (<any>result).logger = {
          info: (data:string) => expect(data).toBe('Connected successfully to 127.0.0.2/db1')
        }
        result.afterConnected();
      }
    });

    it('log only 1 server when connect to the same server ip', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:22017,localhost:22018,localhost:22019';
      const result = mongodbMixin('doc_id_counters');
      if(result.afterConnected !== undefined && result.adapter !== undefined) {
        result.adapter = {
          client: {
            s: {
              options:
              { servers : [{host: 'localhost', port: 22017},{host: 'localhost', port: 22018},{host: 'localhost', port: 22019}] }
            }
          },
          db: {
            databaseName: 'db1'
          }
        };
        (<any>result).logger = {
          info: (data:string) => expect(data).toBe('Connected successfully to localhost/db1')
        }
        result.afterConnected();
      }
    });

    it('log 3 servers', () => {
      process.env.MONGODB_URI = 'mongodb://192.168.1.1:22017,192.168.1.2:22018,192.168.1.3:22019';
      const result = mongodbMixin('doc_id_counters');
      if(result.afterConnected !== undefined && result.adapter !== undefined) {
        result.adapter = {
          client: {
            s: {
              options:
              { servers : [{host: '192.168.1.1', port: 22017},{host: '192.168.1.2', port: 22018},{host: '192.168.1.3', port: 22019}] }
            }
          },
          db: {
            databaseName: 'db1'
          }
        };
        (<any>result).logger = {
          info: (data:string) => expect(data).toBe('Connected successfully to 192.168.1.1,192.168.1.2,192.168.1.3/db1')
        }
        result.afterConnected();
      }
    });
  });
});