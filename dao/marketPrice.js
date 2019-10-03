const db = require('../db/dbConnect')
const util = require('../util/util')

module.exports = {
  traceGreenPrice: async (userId, args) => {
    try {
      let greenName = Object.keys(args)[0]
      let traceKeys = await db.redis.hkeysAsync(userId)
      if(traceKeys.includes(greenName)) return (util.error('Duplicate'))
      if(traceKeys.length > 18) return (util.error('Exceed Max Count'))
      await db.redis.hdelAsync('userList', userId)
      await db.redis.hmsetAsync(userId, args)
      let updateLink = await db.redis.hgetallAsync("greensForUpdate")
      await db.redis.hsetAsync("tracelist", greenName, updateLink[greenName])
      return {status: "Success"}
    } catch(err) {
      console.log(err)
      return util.error('Invalid Token')
    } 
  },
  traceList: async (userId) => {
    try {
      let userList = await db.redis.hgetallAsync(userId)
      if(!userList) return method(util.error('No Result'))
      let oldPrice = {}
      let newPrice = {}
      Object.keys(userList).map((data) => {
        !data.includes("new") ?
        oldPrice[data] = userList[data].split(',')
        : newPrice[data] = userList[data].split(',')
      })
      let priceData = [oldPrice, newPrice]
      let updatedUserList = {data:priceData}
      await db.redis.hsetAsync('userList', userId, JSON.stringify(updatedUserList))
      return updatedUserList
    } catch(err) {
      console.log(err)
      return util.error('Invalid Token')
    }
  },
  traceListSingle: async (userId, keyword) => {
    try {
      let userList = await db.redis.hgetallAsync(userId)
      if(!userList) return util.error('No Result')
      let keylist = Object.keys(userList)
      let exist = 0
      keylist.indexOf(keyword) === -1 ? null : exist += 1
      return exist
    } catch(err) {
      console.log(err)
      return util.error('Invalid Token')
    }
  },
  traceDelete: async (userId, delItem) => {
    try {
      await db.redis.hdelAsync(userId, delItem)
      await db.redis.hdelAsync(userId, `new${delItem}`)
      await db.redis.hdelAsync('userList', userId)
      return {status: "Success"}
    } catch(err) {
      console.log(err)
      return util.error('Invalid Token')
    }
  }
}