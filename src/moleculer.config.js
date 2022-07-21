const options = {
  metrics: true,
  // cacher: {
  //   type: "Redis",
  //   options: {
  //     ttl: process.env.REDIS_TTL,
  //     prefix: process.env.REDIS_PREFIX,
  //     redis: {
  //       host: process.env.REDIS_HOST,
  //       port: process.env.REDIS_PORT,
  //       password: process.env.REDIS_PASSWORD,
  //       db: process.env.REDIS_DATABASE,
  //     },
  //   },
  // },
};

// if(process.env.CACHER) {
//     options.cacher = {
//         type: "MemoryLRU",
//         options: {
//             max: 100,
//             ttl: 300,
//         }
//     }
// }

module.exports = options;
