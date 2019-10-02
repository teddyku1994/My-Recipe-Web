const express = require('express')
const crawl = require('../util/crawl')
const util = require('../util/util')
const cache = require('../dao/cache')
const marketPrice = require('../dao/marketPrice')
const jwt = require('../util/verification')
const router = express.Router()

router.use(express.json())

router.post('/marketPrice/greens', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let token = req.headers.authorization.replace('Bearer ', '')
  let verify = jwt.verifyToken(token)
  if(verify.error) return res.json(util.error('Invalid Token'))
  
  let body = req.body
  if(body.keywords) {
    let checkCahce = async (response) => {
      if(response) {
        let exist = await marketPrice.traceListSingle(verify.userId, response.data[0].title)
        response.data[0]['exist']= exist
        return res.json(response)
      }
      let price = await crawl.greenPriceCralwer(body.keywords)
      if(!price) return res.json(util.error('No Result'))
      let exist = await marketPrice.traceListSingle(verify.userId, price.data[0].title)
      price.data[0]['exist'] = exist
      cache.createHashCache("greens", body.keywords, JSON.stringify(price))
      cache.createHashCache("greens", price.data[0].title, JSON.stringify(price))
      cache.createHashCache("greensForUpdate", price.data[0].title,price.data[0].cacheLink)
      return res.json(price)
    }
    cache.getHashCache("greens", body.keywords, checkCahce)
  } else if(body.links) {
    let checkCahce = async (response) => {
      if(response) {
        let exist = await marketPrice.traceListSingle(verify.userId, response.data[0].title)
        response.data[0]['exist']= exist
        return res.json(response)
      }
      let price = await crawl.greenPriceCrawler2(body.links)
      if(!price) return res.json(util.error('No Result'))
      let exist = await marketPrice.traceListSingle(verify.userId, price.data[0].title)
      price.data[0]['exist'] = exist
      cache.createHashCache("greens", body.links, JSON.stringify(price))
      cache.createHashCache("greens", price.data[0].title, JSON.stringify(price))
      cache.createHashCache("greensForUpdate", price.data[0].title, price.data[0].cacheLink)
      return res.json(price)
    }
    cache.getHashCache("greens", body.links, checkCahce)
  }
})

router.post('/marketPrice/trace', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let token = req.headers.authorization.replace('Bearer ', '')
  let verify = jwt.verifyToken(token)
  if(verify.error) return res.json(util.error('Invalid Token'))
  let userId = verify.userId
  let send = (response) => res.json(response)
  let { title, wholesalePrice, retailPrice } = req.body
  let args = {}
  args[`${title}`] = [wholesalePrice, retailPrice, 0].join(",")
  args[`new${title}`] = [wholesalePrice, retailPrice].join(",")
  
  marketPrice.traceGreenPrice(userId, args, send)

})

router.post('/marketPrice/deleteTrace', async (req,res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  console.log()
  let token = req.headers.authorization.replace('Bearer ', '')
  let verify = jwt.verifyToken(token)
  if(verify.error) return res.json(util.error('Invalid Token'))
  let userId = verify.userId
  let send = (response) => res.json(response)
  let { delItem } = req.body
  marketPrice.traceDelete(userId, delItem, send)
})

router.get('/marketPrice/tracelist', async (req, res) => {
  let token = req.headers.authorization.replace('Bearer ', '')
  let verify = jwt.verifyToken(token)
  if(verify.error) return res.json(util.error('Invalid Token'))
  let send = (response) => res.json(response)
  let userId = verify.userId

  let checkCahce = async (response) => {
    if(response) return res.json(response)
    marketPrice.traceList(userId, send)
  }
  cache.getHashCache('userList', userId, checkCahce)
})

module.exports = router