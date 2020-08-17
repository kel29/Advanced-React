const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util')
const { hasPermission } = require('../utils');

const oneYear = 1000 * 20 * 60 * 24 * 365

const Mutations = {
  async createItem(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const item = await context.db.mutation.createItem({
      data: {
        user: {
          connect: {
            id: context.request.userId
          }
        },
        ...args
      }
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
      maxAge: oneYear
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
      maxAge: oneYear
    })
    return user
  },
  signout(parent, args, context, info) {
    context.response.clearCookie('token')
    return { message: 'sign out successful'}
  },
  async requestReset(parent, {email}, context, info) {
    const user = await context.db.query.user({where: { email}})
    if (!user) {
      throw new Error(`No user found for that email`)
    }

    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000
    const res = await context.db.mutation.updateUser({
      where: {email},
      data: {resetToken, resetTokenExpiry}
    })

    return { message: 'reset sent'}
  },
  async resetPassword(parent, { password: rawPassword, confirmPassword, resetToken }, context, info) {
    if (rawPassword !== confirmPassword) {
      throw new Error('Passwords do not match')
    }
    const [user] = await context.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })

    if (!user) {
      throw new Error('The reset token is either invalid or expired')
    }

    const password = await bcrypt.hash(rawPassword, 10)
    const updatedUser = await context.db.mutation.updateUser({
      where: {email: user.email},
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      }
    }, info)

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: oneYear
    })
    return updatedUser
  },
  async updatePermissions(parent, { permissions, userId }, context, info) {
    if (!context.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const currentUser = await context.db.query.user({
      where: {
        id: context.request.userId,
      }
    }, info)
    hasPermission(context.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    return context.db.mutation.updateUser({
      data: {
        permissions: {
          set: permissions
        }
      },
      where: {
        id: userId
      },
    }, info)
  },
};

module.exports = Mutations;
