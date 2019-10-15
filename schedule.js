const express = require('express')
const schedule = require('node-schedule');
const recipe = require('./Model/recipe');
const crawl = require('./util/crawl')
const mysql = require('./Model/promiseFunc')
const db = require('./db/dbConnect')

const app = express()
const PORT = 3000

// Delete Hot Keywords
schedule.scheduleJob('30 30 11 * * *', async function() {
  try {
    let deleted = await recipe.deleteHotKeywords('7 DAY')
    console.log('keywords deleted:', deleted)
  } catch (err) {
    console.log(err)
  }
})

// Delete & Update Green Price
schedule.scheduleJob('0 18 * * 7', async function() {
  try {
    console.log("Updating")
    await db.redis.delAsync('greens')
    let traceList = await db.redis.hgetallAsync('tracelist')
    let traceListKeys = await db.redis.hkeysAsync('tracelist')
    let newPrice = traceListKeys.map(async (key) => {
      let urlParams = traceList[key]
      let newPrice = await crawl.greenPriceCrawler2(urlParams)
      if(newPrice) {
        await db.redis.hsetAsync('greens', key, JSON.stringify(newPrice))
      }
    })
    Promise.all(newPrice).then(async (res) => {
      console.log('Updating User')
      let error = error => console.log(error)
      let sql = 'SELECT id from user'
      let userIds = await mysql.sqlQuery(sql, null, error)
      userIds.map(async (user) => {
        let userId = user.id
        let userList = await db.redis.hgetallAsync(userId)
        await db.redis.hdelAsync('userList', userId)
        if(userList) {
          Object.keys(userList).map(async (key) => {
            if(key.includes('new')) {
              let newKey = key.replace('new','')
              let args = {}
              args[newKey] = [userList[key],1].join(",")
              await db.redis.hmsetAsync(userId, args)
              await db.redis.hdelAsync(userId, key)
              let newPrice = await db.redis.hgetAsync('greens', newKey)
              args2 = {}
              args2[key] = JSON.parse(newPrice).data[0].price.join(',')
              await db.redis.hmsetAsync(userId, args2)
            }
          })
        }
      }) 
    })
    .catch(err => {
      throw err
    })
  } catch (err) {
    console.log(err)
  }
}) 

app.listen(PORT, () => console.log(`Server running on ${PORT}`))