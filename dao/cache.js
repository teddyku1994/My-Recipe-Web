const db = require('../db/dbConnect')

module.exports={
  createHashCache:(hash, key, value) => {
    let error = (err) => console.log(err)
    db.redis.hset(hash, key, value, (err, reply) => {
      if(err) error(err)
      console.log(reply)
    })
  },
  getHashCache:(hash, key, method) => {
    let error = (err) => console.log(err)
    db.redis.hget(hash, key, (err, reply) => {
      if(err) error(err)
      method(JSON.parse(reply))
    })
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
  },
  createSetCache:(key, timer, value) => {
    db.redis.setex(key, timer, value, (err, reply) => {
      if(err) return console.log(err)
      console.log(reply)
    })
  },
  getSetCache:(key, method) => {
    db.redis.get(key, (err, reply) => {
      if(err) throw err
      method(JSON.parse(reply))
    })
  }
}