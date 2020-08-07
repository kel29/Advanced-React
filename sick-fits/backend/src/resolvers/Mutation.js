const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { singleFieldOnlyMessage } = require('graphql/validation/rules/SingleFieldSubscriptions');

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
  },
  async signup(parent, args, context, info) {
    const { email: rawEmail, password: rawPassword } = args
    const email = rawEmail.toLowerCase()
    const password = await bcrypt.hash(rawPassword, 10)
    const user = await context.db.mutation.createUser({
      data: {
        ...args,
        password,
        email,
        permissions: { set: ['USER'] }
      }
    }, info)
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 20 * 60 * 24 * 365 // one year cookie
    })
    return user
  },
  async signin(parent, { email, password }, context, info) {
    const user = await context.db.query.user({where: {email}})
    if (!user) {
      throw new Error(`No user found for that email`)
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error(`Invalid password`)
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 20 * 60 * 24 * 365 // one year cookie
    })
    return user
  },
  signout(parent, args, context, info) {
    context.response.clearCookie('token')
    return { message: 'sign out successful'}
  }
};

module.exports = Mutations;
