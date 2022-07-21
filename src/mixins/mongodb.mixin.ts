import dbService from 'moleculer-db';
import mongoAdapter from 'moleculer-db-adapter-mongo';
import { readFileSync } from 'fs';
import { Errors, Service, ServiceSchema } from 'moleculer';
// tslint:disable-next-line: no-implicit-dependencies
import { MongoClientOptions } from 'mongodb';
import { conform } from '../utils/utils';

const mongodbPrefix = 'MONGODB_';
/* tslint:disable: prefer-template */
const mongoClientOptionsMap: {
  [index: string]: { name: string; type: string } | string;
} = {
  [mongodbPrefix + 'ACCEPTABLELATENCYMS']: {
    name: 'acceptableLatencyMS',
    type: 'number',
  },
  [mongodbPrefix + 'APPNAME']: { name: 'appname', type: 'string' },
  [mongodbPrefix + 'AUTH_PASSWORD']: { name: 'auth.password', type: 'string' },
  [mongodbPrefix + 'AUTH_USER']: { name: 'auth.user', type: 'string' },
  [mongodbPrefix + 'AUTHMECHANISM']: { name: 'authMechanism', type: 'string' },
  [mongodbPrefix + 'AUTHSOURCE']: { name: 'authSource', type: 'string' },
  [mongodbPrefix + 'AUTORECONNECT']: { name: 'autoReconnect', type: 'boolean' },
  [mongodbPrefix + 'AUTO_RECONNECT']: {
    name: 'auto_reconnect',
    type: 'boolean',
  },
  [mongodbPrefix + 'BUFFERMAXENTRIES']: {
    name: 'bufferMaxEntries',
    type: 'number',
  },
  [mongodbPrefix + 'CHECKSERVERIDENTITY']: {
    name: 'checkServerIdentity',
    type: 'boolean',
  },
  [mongodbPrefix + 'COMPRESSION']: { name: 'compression', type: 'object' },
  [mongodbPrefix + 'CONNECTTIMEOUTMS']: {
    name: 'connectTimeoutMS',
    type: 'number',
  },
  [mongodbPrefix + 'CONNECTWITHNOPRIMARY']: {
    name: 'connectWithNoPrimary',
    type: 'boolean',
  },
  [mongodbPrefix + 'DOMAINSENABLED']: {
    name: 'domainsEnabled',
    type: 'boolean',
  },
  [mongodbPrefix + 'FAMILY']: { name: 'family', type: 'number' },
  [mongodbPrefix + 'FORCESERVEROBJECTID']: {
    name: 'forceServerObjectId',
    type: 'boolean',
  },
  [mongodbPrefix + 'FSYNC']: { name: 'fsync', type: 'boolean' },
  [mongodbPrefix + 'HA']: { name: 'ha', type: 'boolean' },
  [mongodbPrefix + 'HAINTERVAL']: { name: 'haInterval', type: 'number' },
  [mongodbPrefix + 'IGNOREUNDEFINED']: {
    name: 'ignoreUndefined',
    type: 'boolean',
  },
  [mongodbPrefix + 'J']: { name: 'j', type: 'boolean' },
  [mongodbPrefix + 'KEEPALIVE']: { name: 'keepAlive', type: 'boolean' },
  [mongodbPrefix + 'KEEPALIVEINITIALDELAY']: {
    name: 'keepAliveInitialDelay',
    type: 'number',
  },
  [mongodbPrefix + 'LOGGER']: { name: 'logger', type: 'object' },
  [mongodbPrefix + 'LOGGERLEVEL']: { name: 'loggerLevel', type: 'string' },
  [mongodbPrefix + 'MAXSTALENESSSECONDS']: {
    name: 'maxStalenessSeconds',
    type: 'number',
  },
  [mongodbPrefix + 'MINSIZE']: { name: 'minSize', type: 'number' },
  [mongodbPrefix + 'MONITORCOMMANDS']: {
    name: 'monitorCommands',
    type: 'boolean',
  },
  [mongodbPrefix + 'NODELAY']: { name: 'noDelay', type: 'boolean' },
  [mongodbPrefix + 'NUMBEROFRETRIES']: {
    name: 'numberOfRetries',
    type: 'number',
  },
  [mongodbPrefix + 'PKFACTORY']: { name: 'pkFactory', type: 'object' },
  [mongodbPrefix + 'POOLSIZE']: { name: 'poolSize', type: 'number' },
  [mongodbPrefix + 'PROMISELIBRARY']: {
    name: 'promiseLibrary',
    type: 'object',
  },
  [mongodbPrefix + 'PROMOTEBUFFERS']: {
    name: 'promoteBuffers',
    type: 'boolean',
  },
  [mongodbPrefix + 'PROMOTELONGS']: { name: 'promoteLongs', type: 'boolean' },
  [mongodbPrefix + 'PROMOTEVALUES']: { name: 'promoteValues', type: 'boolean' },
  [mongodbPrefix + 'RAW']: { name: 'raw', type: 'boolean' },
  [mongodbPrefix + 'READCONCERN']: { name: 'readConcern', type: 'object' },
  [mongodbPrefix + 'READPREFERENCE']: {
    name: 'readPreference',
    type: 'string',
  },
  [mongodbPrefix + 'READPREFERENCETAGS']: {
    name: 'readPreferenceTags',
    type: 'array',
  },
  [mongodbPrefix + 'RECONNECTINTERVAL']: {
    name: 'reconnectInterval',
    type: 'number',
  },
  [mongodbPrefix + 'RECONNECTTRIES']: {
    name: 'reconnectTries',
    type: 'number',
  },
  [mongodbPrefix + 'REPLICASET']: { name: 'replicaSet', type: 'string' },
  [mongodbPrefix + 'SECONDARYACCEPTABLELATENCYMS']: {
    name: 'secondaryAcceptableLatencyMS',
    type: 'number',
  },
  [mongodbPrefix + 'SERIALIZEFUNCTIONS']: {
    name: 'serializeFunctions',
    type: 'boolean',
  },
  [mongodbPrefix + 'SOCKETTIMEOUTMS']: {
    name: 'socketTimeoutMS',
    type: 'number',
  },
  [mongodbPrefix + 'SSL']: { name: 'ssl', type: 'boolean' },
  [mongodbPrefix + 'SSLCA']: { name: 'sslCA', type: 'buffer' },
  [mongodbPrefix + 'SSLCERT']: { name: 'sslCert', type: 'buffer' },
  [mongodbPrefix + 'SSLCRL']: { name: 'sslCRL', type: 'buffer' },
  [mongodbPrefix + 'SSLKEY']: { name: 'sslKey', type: 'buffer' },
  [mongodbPrefix + 'SSLPASS']: { name: 'sslPass', type: 'string' },
  [mongodbPrefix + 'SSLVALIDATE']: { name: 'sslValidate', type: 'boolean' },
  [mongodbPrefix + 'USENEWURLPARSER']: {
    name: 'useNewUrlParser',
    type: 'boolean',
  },
  [ mongodbPrefix + 'USEUNIFIEDTOPOLOGY']: {
    name: 'useUnifiedTopology',
    type: 'boolean',
  },
  [mongodbPrefix + 'VALIDATEOPTIONS']: {
    name: 'validateOptions',
    type: 'object',
  },
  [mongodbPrefix + 'W']: { name: 'w', type: 'string' },
  [mongodbPrefix + 'WTIMEOUT']: { name: 'wtimeout', type: 'number' },
};

function mongodbMixin(collectionName: string): ServiceSchema | never {
  if (process.env.MONGODB_URI === undefined) {
    // prettier-ignore
    throw new Errors.ServiceSchemaError('MONGODB_URI is not defined', undefined);
  }

  // prettier-ignore
  const options = conform<MongoClientOptions>(process.env, mongoClientOptionsMap);
  // prettier-ignore
  const scheme = process.env.MONGODB_URI.substring(0, process.env.MONGODB_URI.indexOf('://'));
  let dbAdapter: any;

  // prettier-ignore
  if (scheme === 'mongodb') {

    if (process.env[mongodbPrefix + 'SSLCA'] !== undefined) {
      const ca: Buffer[] = [];
      ca.push(readFileSync(<string>process.env[mongodbPrefix + 'SSLCA']));
      options.sslCA = ca;
    }

    if (process.env[mongodbPrefix + 'SSLCERT'] !== undefined) {
      // prettier-ignore
      options.sslCert = readFileSync(<string>(process.env[mongodbPrefix + 'SSLCERT']));
    }

    if (process.env[mongodbPrefix + 'SSLKEY'] !== undefined) {
      // prettier-ignore
      options.sslKey = readFileSync(<string>(process.env[mongodbPrefix + 'SSLKEY']));
    }

    dbAdapter = new mongoAdapter(process.env.MONGODB_URI, options);
  } else {
    // prettier-ignore
    throw new Errors.ServiceSchemaError('Unsupported database', process.env.MONGODB_URI);
  }

  const result: ServiceSchema = {
    name: "mongodb-mixin",
    version: "1.0.0",
    mixins: [dbService],
    adapter: dbAdapter,
    collection: collectionName,
    afterConnected(this: Service) {
      const servers = (<any[]>this.adapter.client.s.options.servers)
        .map(server => server.host)
        .reduce(
          (x, y) => (x.includes(y) ? x : [...x, y]),
          [],
        )
        .join(',');
      this.logger.info(
        `Connected successfully to ${servers}/${this.adapter.db.databaseName}`,
      );
    },
  };
  return result;
}

export default mongodbMixin;
