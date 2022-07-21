import { ActionSchema, Service, Context } from "moleculer";
import { Cursor, ObjectId } from "mongodb";
// import moment from "moment";
// import axios from "axios";

const addNews: ActionSchema = {
  async handler(this: Service, context: Context<any>): Promise<Cursor> {
    let id: any;
    let result: any;
    // console.log("context ",context.params);

    let newsData: { [key: string]: any } = {};
    if ("id" in context.params) {
      id = new ObjectId(context.params.id);
      newsData["UPDATE_DATETIME"] = new Date();
    } else {
      id = new ObjectId();
      newsData["CREATE_DATETIME"] = new Date();
    }
    //console.log(id);

    if ("TITLE" in context.params) newsData["TITLE"] = context.params.TITLE;
    if ("SHORT_DETAIL" in context.params) newsData["SHORT_DETAIL"] = context.params.SHORT_DETAIL;
    if ("DETAIL" in context.params) newsData["DETAIL"] = context.params.DETAIL;
    if ("IMAGE_URL" in context.params) newsData["IMAGE_URL"] = context.params.IMAGE_URL;
    if ("CATEGORY" in context.params) newsData["CATEGORY"] = context.params.CATEGORY;
    if ("STATUS" in context.params) newsData["STATUS"] = context.params.STATUS;
    if ("CREATE_BY" in context.params) newsData["CREATE_BY"] = context.params.CREATE_BY;
    if ("UPDATE_BY" in context.params) newsData["UPDATE_BY"] = context.params.UPDATE_BY;
    if ("CREATE_BY_NAME" in context.params) newsData["CREATE_BY_NAME"] = context.params.CREATE_BY_NAME;
    if ("UPDATE_BY_NAME" in context.params) newsData["UPDATE_BY_NAME"] = context.params.UPDATE_BY_NAME;

    const response: any = await this.adapter.collection.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: newsData,
      },
      {
        upsert: true,
      }
    );
    if (response.ok === 1) {
      result = {
        lastErrorObject: response.lastErrorObject,
        ok: 1,
      };
    } else {
      result.response;
    }
    return result;
  },
};
const getNews: ActionSchema = {
  async handler(this: Service, context: Context<any>): Promise<Cursor> {
    let filterStr: { [key: string]: any } = {};
    if ("TITLE" in context.params) filterStr["TITLE"] = new RegExp(context.params.TITLE, "i");
    if ("SHORT_DETAIL" in context.params) filterStr["SHORT_DETAIL"] = new RegExp(context.params.SHORT_DETAIL, "i");
    if ("CATEGORY" in context.params) filterStr["CATEGORY"] = context.params.CATEGORY;
    // console.log("filterStr ",filterStr);

    let orderStr: { [key: string]: any } = {};
    let secondDir = 1;
    if (context.params.orders !== undefined && context.params.orders.length > 0) {
      var dir = 1;
      var sortingCol = context.params.columns[Number(context.params.orders[0].column)].data;
      if (context.params.orders[0].dir == "desc") dir = -1;
      orderStr[sortingCol] = dir;
      orderStr["_id"] = secondDir;
    } else {
      orderStr["_id"] = secondDir;
    }
    let facetStr: { [key: string]: any } = {};
    facetStr = {
      paginatedResults: [
        { $sort: orderStr },
        { $skip: Number(( context.params.start - 1 ) * context.params.length) },
        { $limit: Number(context.params.length) },
      ],
      totalCount: [{ $count: "count" }],
    };
    const result = await this.adapter.collection.aggregate(
      [
        {
          $match: {
            STATUS: {
              $ne: "REMOVED",
            },
          },
        },
        { $match: filterStr },
        { $facet: facetStr },
      ],
      { allowDiskUse: true }
    );

    const resultArray = await result.toArray();
    let totalRecords = 0;
    if (resultArray[0].totalCount.length > 0) totalRecords = resultArray[0].totalCount[0].count;
    let resultObject = JSON.stringify({
      draw: context.params.draw,
      recordsFiltered: totalRecords,
      recordsTotal: totalRecords,
      maxPage: Math.ceil(totalRecords/context.params.length),
      data: resultArray[0].paginatedResults,
    });

    return JSON.parse(resultObject);
  },
};
const getNewsById: ActionSchema = {
  async handler(this: Service, context: Context<any>): Promise<Cursor> {
    let filterStr: { [key: string]: any } = {};
    filterStr = { _id: new ObjectId(context.params.id) };

    const cursor: Cursor = await this.adapter.collection.aggregate([{ $match: filterStr }]);
    return cursor;
  },
};
const getSuggestNews: ActionSchema = {
  async handler(this: Service, context: Context<any>): Promise<Cursor> {
    const result = await this.adapter.collection.aggregate([
      {
        $match: {
          $and: [
            {
              STATUS: {
                $ne: "REMOVED",
              },
            },
            {
              _id: {
                $ne: new ObjectId(context.params.id),
              },
            },
          ],
        },
      },
      {
        $match: { CATEGORY: context.params.CATEGORY },
      },
      {
        $facet: {
          paginatedResults: [
            { $sort: { CREATE_DATETIME: -1 } },
            { $skip: Number(context.params.start) },
            { $limit: Number(context.params.length) },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const resultArray = await result.toArray();
    let totalRecords = 0;
    if (resultArray[0].totalCount.length > 0) totalRecords = resultArray[0].totalCount[0].count;
    let resultObject = JSON.stringify({
      recordsFiltered: totalRecords,
      recordsTotal: totalRecords,
      data: resultArray[0].paginatedResults,
    });

    return JSON.parse(resultObject);
  },
};

export { addNews, getNews, getNewsById, getSuggestNews };
