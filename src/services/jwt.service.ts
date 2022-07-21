import { Context, Errors, Service, ServiceSchema } from 'moleculer';
import { decode, verify } from 'jsonwebtoken';
import jwks = require('jwks-rsa');

const serviceSchema: ServiceSchema = {
    name: 'jwt',
    version: '1.0.0',
    settings: {
      $noVersionPrefix: false,
    },
    actions: {
        getPublicKey: {
            // cache: true,
            visibility: "protected",
            async handler(this: Service) {
                if(process.env.AUTH_URL === undefined) {
                    return Promise.reject(new Errors.MoleculerServerError('AUTH_URL must be provided'));
                }

                if(process.env.KID === undefined) {
                    return Promise.reject(new Errors.MoleculerServerError('KID must be provided'));
                }
                
                const client = jwks({
                    jwksUri: `${process.env.AUTH_URL}/realms/master/protocol/openid-connect/certs`
                });

                const signingKey = await client.getSigningKeyAsync(process.env.KID);
                return signingKey.getPublicKey();
            }
        },
        decode: {
            params: {
                token: { type: 'string' },
            },
            handler(context: Context<any>) {
                return decode(context.params.token);
            }
        },
        verify: {
            params: {
                token: { type: 'string' },
            },
            async handler(this: Service, context: Context<any>) {
                const certificate: string = await context.call(`${this.fullName}.getPublicKey`);
                const result = verify(context.params.token, certificate);
                return result;
            }
        }
    }
}

export = serviceSchema;