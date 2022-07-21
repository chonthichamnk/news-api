import { Context, Service, ServiceSchema } from "moleculer";
import moleculerWeb from "moleculer-web";
import { createSecureContext } from "tls";
import { readFileSync } from "fs-extra";
const { /*, ERR_INVALID_TOKEN, ForbiddenError*/ UnAuthorizedError, ERR_NO_TOKEN } = require("moleculer-web").Errors;

// const { MoleculerError } = require("moleculer").Errors;

const JWT_SERVICE = "1.0.0.jwt";

//SMEGP
const INTERNAL_FILES_CONTROLLER = "1.0.0.internal-files";
const ACCOUNT_VERIFY_CONTROLLER = "1.0.0.account-verify";
const SMEGP_LOGGING_CONTROLLER = "1.0.0.logging-controller";
const SMEGP_NEWS_CONTROLLER = "1.0.0.smegp-news";
const SMEGP_INET_CONTROLLER = "1.0.0.inet-files";
const SMEGP_GDX_CONTROLLER = "1.0.0.gdx";

const serviceSchema: ServiceSchema = {
  name: "routes",
  version: "1.0.0",
  mixins: [moleculerWeb],
  settings: {
    $noVersionPrefix: false,
    https:
      process.env.CERT_FILE !== undefined && process.env.PRIVKEY_FILE !== undefined
        ? {
            cert: readFileSync(process.env.CERT_FILE),
            key: readFileSync(process.env.PRIVKEY_FILE),
            secureContext: createSecureContext({
              maxVersion: "TLSv1.3",
              minVersion: "TLSv1.2",
            }),
          }
        : undefined,
    logResponseData: "debug",
    cors: {
      // Global CORS settings for all routes
      origin: ["*"],
      methods: ["OPTIONS", "GET", "POST", "DELETE"],
    },
    routes: [
      {
        path: "/smegp",
        onBeforeCall(ctx: any, _: any, req: any) {
          ctx.meta.clientIp =
            req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

          ctx.meta.CLIENT_IP_A = typeof req.connection != "undefined" ? req.connection.remoteAddress : "";
          ctx.meta.CLIENT_IP_B = typeof req.socket != "undefined" ? req.socket.remoteAddress : "";
          ctx.meta.CLIENT_IP_C = typeof req.connection.socket != "undefined" ? req.connection.socket.remoteAddress : "";
          ctx.meta.REFERER = typeof req.headers["referer"] != "undefined" ? req.headers["referer"] : "";
        },
        aliases: {
          "GET /sms/check-status": `${ACCOUNT_VERIFY_CONTROLLER}.checkSMSStatus`,
          //"POST /register/request-otp": `${ACCOUNT_VERIFY_CONTROLLER}.otpSendToMobile`,
          "POST /gw/D_8tdQ6r/register/request-otp": `${ACCOUNT_VERIFY_CONTROLLER}.otpSendToMobile`,

          // SMEGP_LOGGING_CONTROLLER
          "POST log/external-gateway/push": `${SMEGP_LOGGING_CONTROLLER}.logExternalGateway`,
          "POST log/gdx-dbd/push": `${SMEGP_LOGGING_CONTROLLER}.logExternalGDXDBD`,
          "POST log/internal-sms/push": `${SMEGP_LOGGING_CONTROLLER}.logInternalSMS`,
        },
        mappingPolicy: "restrict",
        bodyParsers: {
          json: true,
          urlencoded: false,
        },
      },
      {
        path: "/smegp",
        onBeforeCall(ctx: any, _: any, req: any) {
          ctx.meta.clientIp =
            req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

          ctx.meta.CLIENT_IP_A = typeof req.connection != "undefined" ? req.connection.remoteAddress : "";
          ctx.meta.CLIENT_IP_B = typeof req.socket != "undefined" ? req.socket.remoteAddress : "";
          ctx.meta.CLIENT_IP_C = typeof req.connection.socket != "undefined" ? req.connection.socket.remoteAddress : "";
          ctx.meta.REFERER = typeof req.headers["referer"] != "undefined" ? req.headers["referer"] : "";
        },
        aliases: {
          //news
          "POST /news/addnews": `${SMEGP_NEWS_CONTROLLER}.addNews`,
          "POST /news/news": `${SMEGP_NEWS_CONTROLLER}.getNews`,
          "POST /news/newslist": `${SMEGP_NEWS_CONTROLLER}.getNewsAdmin`,
          "GET /news/:id": `${SMEGP_NEWS_CONTROLLER}.getNewsById`,
          "POST /news/suggestnews": `${SMEGP_NEWS_CONTROLLER}.getSuggestNews`,
        },
        mappingPolicy: "restrict",
        bodyParsers: {
          json: true,
          urlencoded: false,
        },
        authentication: false,
      },
      {
        path: "/smegp/internal",
        onBeforeCall(ctx: any, _: any, req: any) {
          ctx.meta.req = req;
          ctx.meta.objectName = req.$params.objectName?.join("/");
        },
        aliases: {
          //  GET FILE/IMAGE PUBLIC LINK
          "GET /files/:objectName*": `${INTERNAL_FILES_CONTROLLER}.getInternalDocumentsLinkByID`,
          // "GET /certificate/:objectName*": `${INTERNAL_FILES_CONTROLLER}.getCertificateDocumentsLinkByID`,
          "GET /certificate/:objectName*": `${INTERNAL_FILES_CONTROLLER}.getCertificateS3DocumentsLinkByID`,

          // Upload FILE/IMAGE
          "POST /files/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadInternalFile`,
          // "POST /images/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadS3PublicProductImage`,
          "POST /images/:objectName*": `multipart:${SMEGP_INET_CONTROLLER}.uploadS3PublicProductImage`,

          // Upload SME Vendor Logo
          "POST /images/sme/logo/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadPublicSMELogo`,

          // Upload FILE/IMAGE for news section
          "POST /images/news/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadPublicImageNews`,
          "POST /files/news/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadPublicFileNews`,

          // Upload Gov progress report
          "GET /gov/files/:objectName*": `${INTERNAL_FILES_CONTROLLER}.getGovInternalReportLinkByID`,
          "POST /gov/files/:objectName*": `multipart:${INTERNAL_FILES_CONTROLLER}.uploadGovInternalReport`,
        },
        mappingPolicy: "restrict",
        bodyParsers: {
          json: true,
          urlencoded: false,
        },
      },
      {
        path: "/smegp",
        aliases: {
          // "GET /gdx/get-token": `${SMEGP_GDX_CONTROLLER}.getGDXToken`,
          "GET /gdx/dbd/getLatestFinancialProfile/:FIRM_NO": `${SMEGP_GDX_CONTROLLER}.getLatestFinancialProfile`,
          "GET /gdx/dbd/getSMEProfile/:FIRM_NO": `${SMEGP_GDX_CONTROLLER}.getLatestFinancialProfile`,
        },
        mappingPolicy: "restrict",
        authorization: true,
        bodyParsers: {
          json: true,
          urlencoded: false,
        },
      },
    ],
  },
  methods: {
    async authenticate(this: Service, context: Context, _) {
      this.logger.info(context.requestID);

      // console.log(req.parsedUrl)
      /*
      this.logger.info(context.requestID);
      const referer = typeof req.headers["referer"] != "undefined" ? req.headers["referer"] : "";
      console.log(referer)

      if (referer.search("thaismegp.com") > 0 || referer.search("dev.thaisme.one") || referer.search("localhost:8080") > 0) {
        return {};
      }
      console.log("referer")

      throw new MoleculerError(500, "Too Many Requests");
      */
      /*
      const [, token] = req.$ctx.params.req.headers.authorization?.split(" ") || [];

      if (!token) {
        return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
      }

      const decoded = await context.call(`${JWT_SERVICE}.${process.env.JWT_VERIFY_TOKEN ? "verify" : "decode"}`, {
        token,
      });
      return decoded;
      */
    },
    async authorize(this: Service, context: Context, _, req) {
      this.logger.info(context.requestID);

      const [, token] = req.$ctx.params.req.headers.authorization?.split(" ") || [];

      if (!token) {
        return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
      }

      if (token == process.env.TEMP_TOKEN) {
        return "";
      }

      const decoded = await context.call(`${JWT_SERVICE}.${process.env.JWT_VERIFY_TOKEN ? "verify" : "decode"}`, {
        token,
      });

      return decoded;
    },
  },
};

export = serviceSchema;
