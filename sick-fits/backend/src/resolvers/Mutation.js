const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO, check if logged in
    const item = await context.db.mutation.createItem({
      data: { ...args }
    }, info)
    return item
  },
  async updateItem(parent, args, context, info) {
    const { id, ...updates } = args
    return context.db.mutation.updateItem({
      data: updates,
      where: { id },
      info
    })
  }
};

module.exports = Mutations;
