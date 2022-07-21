import { ServiceSchema, Context } from "moleculer";
import { Cursor } from "mongodb";
const SMEGP_NEWS_STORE: string = "1.0.0.smegp-news-store";

const serviceSchema: ServiceSchema = {
  name: "smegp-news",
  version: "1.0.0",
  settings: {
    $noVersionPrefix: false,
  },
  actions: {
    addNews: {
      params: {
        id: { type: "string", optional: true },
        TITLE: { type: "string" },
        SHORT_DETAIL: { type: "string" },
        DETAIL: { type: "string" },
        IMAGE_URL: { type: "string", optional: true },
        STATUS: { type: "string", default: "NEW" },
        CATEGORY: { type: "string", optional: true },
        CREATE_BY: { type: "string", optional: true },
        CREATE_DATETIME: { type: "date", convert: true, optional: true },
        UPDATE_BY: { type: "string", optional: true },
        UPDATE_DATETIME: { type: "date", convert: true, optional: true },
        CREATE_BY_NAME: { type: "string", optional: true },
        UPDATE_BY_NAME: { type: "string", optional: true },
      },
      async handler(context: Context): Promise<string[]> {
        const response: any = await context.call(`${SMEGP_NEWS_STORE}.addNews`, context.params);
        return response;
      },
    },
    getNews: {
      // cache: true,
      params: {
        id: { type: "string", optional: true },
        TITLE: { type: "string", optional: true },
        SHORT_DETAIL: { type: "string", optional: true },
        DETAIL: { type: "string", optional: true },
        IMAGE_URL: { type: "string", optional: true },
        STATUS: { type: "string", optional: true },
        CATEGORY: { type: "string", optional: true },
        CREATE_BY: { type: "string", optional: true },
        CREATE_DATETIME: { type: "date", convert: true, optional: true },
        UPDATE_BY: { type: "string", optional: true },
        UPDATE_DATETIME: { type: "date", convert: true, optional: true },
        // search: { type: 'string', optional: true },
        CREATE_BY_NAME: { type: "string", optional: true },
        UPDATE_BY_NAME: { type: "string", optional: true },
        orders: {
          type: "array",
          optional: true,
          items: {
            type: "object",
            props: {
              column: { type: "string", empty: false },
              dir: { type: "string", empty: false },
            },
          },
        },
        columns: {
          type: "array",
          optional: true,
          items: {
            type: "object",
            props: {
              data: { type: "string", empty: false },
            },
          },
        },
        start: { type: "string" },
        length: { type: "string" },
        draw: { type: "string" },
      },
      async handler(context: Context): Promise<string[]> {
        const response: any = await context.call(`${SMEGP_NEWS_STORE}.getNews`, context.params);
        return response;
      },
    },
    getNewsAdmin: {
      params: {
        id: { type: "string", optional: true },
        TITLE: { type: "string", optional: true },
        SHORT_DETAIL: { type: "string", optional: true },
        DETAIL: { type: "string", optional: true },
        IMAGE_URL: { type: "string", optional: true },
        STATUS: { type: "string", optional: true },
        CATEGORY: { type: "string", optional: true },
        CREATE_BY: { type: "string", optional: true },
        CREATE_DATETIME: { type: "date", convert: true, optional: true },
        UPDATE_BY: { type: "string", optional: true },
        UPDATE_DATETIME: { type: "date", convert: true, optional: true },
        // search: { type: 'string', optional: true },
        CREATE_BY_NAME: { type: "string", optional: true },
        UPDATE_BY_NAME: { type: "string", optional: true },
        orders: {
          type: "array",
          optional: true,
          items: {
            type: "object",
            props: {
              column: { type: "string", empty: false },
              dir: { type: "string", empty: false },
            },
          },
        },
        columns: {
          type: "array",
          optional: true,
          items: {
            type: "object",
            props: {
              data: { type: "string", empty: false },
            },
          },
        },
        start: { type: "string" },
        length: { type: "string" },
        draw: { type: "string" },
      },
      async handler(context: Context): Promise<string[]> {
        const response: any = await context.call(`${SMEGP_NEWS_STORE}.getNews`, context.params);
        return response;
      },
    },
    getNewsById: {
      params: {
        id: { type: "string" },
      },
      async handler(context: Context): Promise<string[]> {
        const cursor: Cursor = await context.call(`${SMEGP_NEWS_STORE}.getNewsById`, context.params);
        // console.log("res ", cursor);

        const result: string[] = [];
        let item;
        while (await cursor.hasNext()) {
          item = await cursor.next();
          result.push(item);
        }
        return result;
      },
    },
    getSuggestNews: {
      params: {
        CATEGORY: { type: "string" },
        id: { type: "string" },
        start: { type: "string" },
        length: { type: "string" },
      },
      async handler(context: Context): Promise<string[]> {
        const response: any = await context.call(`${SMEGP_NEWS_STORE}.getSuggestNews`, context.params);
        return response;
      },
    },
  },
};
export = serviceSchema;
