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
  deleteCahe:(req, res, next) => {
    let error = (err) => console.log(err)
    let id = req.body.recipeId
    db.redis.hdel('recipePage', id, (err, reply) => {
      if(err) error(err)
      console.log("deleted:",reply)
    })
    next()
  },
  deleteCahe2:(hash, id) => {
    let error = (err) => console.log(err)
    db.redis.hdel(hash, id, (err, reply) => {
      if(err) error(err)
      console.log("deleted:",reply)
    })
  }
}