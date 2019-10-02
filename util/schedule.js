const schedule = require('node-schedule');
const recipe = require('../dao/recipe');
const crawl = require('../util/crawl')
const mysql = require('../dao/promiseFunc')
const db = require('../db/dbConnect')

module.exports = {
  deleteKeywords: (period) => {
    schedule.scheduleJob('0 18 * * 7', async function() {
      try {
        console.log('period')
        let deleted = await recipe.deleteKeywords(period)
        console.log('keywords deleted:', deleted)
      } catch (err) {
        console.log(err)
      }
    })
  },
  greenPriceUpdate: async () => {
    schedule.scheduleJob('0 18 * * 7', async function() {
      try {
        console.log("updating")
        await db.redis.delAsync('greens')
        let tracelist = await db.redis.hgetallAsync('tracelist')
        let keys = await db.redis.hkeysAsync('tracelist')
        let newPrice = keys.map(async (key, index) => {
          let link = tracelist[key]
          let newPrice = await crawl.greenPriceCrawler2(link)
          if(newPrice) {
            await db.redis.hsetAsync('greens', key, JSON.stringify(newPrice))
          }
        })
        Promise.all(newPrice).then(async (res) => {
          console.log('Updating User')
          let error = error => console.log(error)
          let sql = 'SELECT id from user'
          let userIds = await mysql.sqlQuery(sql, error)
          userIds.map(async (user) => {
            let userId = user.id
            let userList = await db.redis.hgetallAsync(userId)
            await db.redis.hdelAsync('userList', userId)
            console.log('userList:',userList)
            if(userList) {
              Object.keys(userList).map(async (key) => {
                if(key.includes('new')) {
                  let newKey = key.replace('new','')
                  console.log('newKey:',newKey)
                  let args = {}
                  args[newKey] = [userList[key],1].join(",")
                  await db.redis.hmsetAsync(userId, args)
                  await db.redis.hdelAsync(userId, key)
                  let newPrice = await db.redis.hgetAsync('greens', newKey)
                  args2 = {}
                  args2[key] = JSON.parse(newPrice).data[0].price.join(',')
                  await db.redis.hmsetAsync(userId, args2)
                  console.log(`user${userId} update complete`)
                }
              })
            }
          }) 
        })
        .catch(err => {
          console.log(err)
        })
      } catch (err) {
        console.log(err)
      }
    }) 
  }
}