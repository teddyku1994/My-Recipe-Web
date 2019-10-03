const db = require('../db/dbConnect')

module.exports={
  createHashCache: async (hash, key, value, cb) => {
    try {
      return cache = await db.redis.hsetAsync(hash, key, value)
    } catch (err) {
      return cb(err)
    }
  },
  getHashCache: async (hash, key, cb) => {
    try {
      let cache = await db.redis.hgetAsync(hash, key)
      return JSON.parse(cache)
    } catch (err) {
      return cb(err)
    }
  },
  createSetCache: async (key, timer, value, cb) => {
    try {
      return cache = await db.redis.setexAsync(key, timer, value)
    } catch (err) {
      return cb(err)
    }
  },
  getSetCache: async (key, cb) => {
    try {
      let cache = await db.redis.getAsync(key)
      return JSON.parse(cache)
    } catch (err) {
      return cb(err)
    }
  },
  deleteCache: async (req, res, next) => {
    try {
      let id = req.body.recipeId
      await db.redis.hdelAsync('recipePage', id)
      next()
    } catch (err) {
      console.log(err)
      return res.json(new Error('Invalid Token'))
    }
  }
}