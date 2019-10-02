const db = require('../db/dbConnect')
const util = require('../util/util')

module.exports = {
  traceGreenPrice: async (userId, args, method) => {
    try {
      let title = Object.keys(args)[0]
      let reply = await db.redis.hkeysAsync(userId)
      // if(reply.includes(title)) return method(util.error('Duplicate'))
      if(reply.length > 18) return method(util.error('Exceed Max Count'))
      await db.redis.hdelAsync('userList', userId)
      await db.redis.hmsetAsync(userId, args)
      let updateLink = await db.redis.hgetallAsync("greensForUpdate")
      await db.redis.hsetAsync("tracelist", title, updateLink[title])
      let test = await db.redis.hgetallAsync("tracelist")
      console.log(test)
      method({status: "Success"})
    } catch(err) {
      console.log(err)
      return mthod(util.error('Invalid Token'))
    } 
  },
  traceList: async (userId, method) => {
    try {
      let userList = await db.redis.hgetallAsync(userId)
      if(!userList) return method(util.error('No Result'))
      let oldPrice = {}
      let newPrice = {}
      console.log(userList)
      Object.keys(userList).map((data) => {
        !data.includes("new") ?
        oldPrice[data] = userList[data].split(',')
        : newPrice[data] = userList[data].split(',')
      })
      let data = [oldPrice, newPrice]
      let updatedUserList = {data:data}
      await db.redis.hsetAsync('userList', userId, JSON.stringify(updatedUserList))
      return method(updatedUserList)
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
      let result = 0
      keylist.indexOf(keyword) === -1 ? result += 0 : result += 1
      return result
    } catch(err) {
      console.log(err)
      return util.error('Invalid Token')
    }
  },
  traceDelete: async (userId, title, method) => {
    try {
      await db.redis.hdelAsync(userId, title)
      await db.redis.hdelAsync(userId, `new${title}`)
      await db.redis.hdelAsync('userList', userId)
      method({status: "Success"})
    } catch(err) {
      console.log(err)
      return method(util.error('Invalid Token'))
    }
  }
}


  // getGreenPrice: async (keyword, method, error) => {
  //   try{
  //     utf8Keyword = encodeURI(keyword)
  //     let url = `http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx?Market=%E5%8F%B0%E5%8C%97&Crop=${utf8Keyword}`
  //     let response = await fetch(url)
  //     let result = await response.json()
  //     let avgPrice = Math.round((result.map((price) => price.平均價).reduce((accumulator, currentValue) => accumulator + currentValue))/result.length)
  //     if(!avgPrice) return util.error('Invalid Token')
  //     console.log(avgPrice)
  //   }
  //   catch (err) {
  //     console.log(err)
  //     return util.error('Invalid Token')
  //   }
  // }