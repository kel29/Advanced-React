const { forwardTo } = require('prisma-binding')

const Query = {
  items: forwardTo('db'),
  // async items(parent, args, context, info) {
  //   return context.db.query.items()
  // }
};

module.exports = Query;
