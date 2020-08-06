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
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id}
    const item = await context.db.query.item({where}, `{id, title}`)
    return context.db.mutation.deleteItem({where}, info)
  }
};

module.exports = Mutations;
