import { ServiceSchema } from "moleculer";
import mongodbMixin from "../../mixins/mongodb.mixin";
import { addNews, getNews,getNewsById, getSuggestNews } from "../../actions/smegp-news.action";

const serviceSchema: ServiceSchema = {
    name: "smegp-news-store",
    version: "1.0.0",
    settings: {
        $noVersionPrefix: false,
    },
    mixins: [mongodbMixin("SMEGP_NEWS")],
    actions: {
        addNews,
        getNews,
        getNewsById,
        getSuggestNews
    },
};

export = serviceSchema;
