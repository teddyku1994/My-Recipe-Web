const express = require('express')
const crawl = require('../util/crawl')
const util = require('../util/util')
const cache = require('../dao/cache')
const marketPrice = require('../dao/marketPrice')
const verification = require('../util/verification')
const router = express.Router()

router.use(express.json())

router.post('/marketPrice/greens', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let body = req.body
    let {userId} = req
    let error = error => console.log(error)
    let priceExist = async (userId, response) => {
      let responseCopy = response
      let exist = await marketPrice.traceListSingle(userId, responseCopy.data[0].title)
      responseCopy.data[0]['exist'] = exist
      return responseCopy
    }
    if(body.keywords) {
      let cacheResponse = await cache.getHashCache("greens", body.keywords, error)
      if(cacheResponse) {
        let greenPriceData = await priceExist(userId, cacheResponse)
        return res.json(greenPriceData)
      }
      let greenPrice = await crawl.greenPriceCralwer(body.keywords)
      if(!greenPrice) return res.json(util.error('No Result'))
      greenPriceData = await priceExist(userId, greenPrice)
      await cache.createHashCache("greens", body.keywords, JSON.stringify(greenPrice))
      await cache.createHashCache("greens", greenPrice.data[0].title, JSON.stringify(greenPrice))
      await cache.createHashCache("greensForUpdate", greenPrice.data[0].title,greenPrice.data[0].cacheLink)
      return res.json(greenPriceData)
    } else if(body.links) {
      let cacheResponse = await cache.getHashCache("greens", body.links, error)
      if(cacheResponse) {
        let greenPriceData = await priceExist(userId, cacheResponse)
        return res.json(greenPriceData)
      }
      let greenPrice = await crawl.greenPriceCrawler2(body.links)
      if(!greenPrice) return res.json(util.error('No Result'))
      greenPriceData = await priceExist(userId, greenPrice)
      await cache.createHashCache("greens", greenPrice.data[0].title, JSON.stringify(greenPrice))
      await cache.createHashCache("greensForUpdate", greenPrice.data[0].title,greenPrice.data[0].cacheLink)
      return res.json(greenPriceData)
    } else {
      return res.json(util.error('Invalid Token'))
    }
  } catch (err) {
    console.log(err)
    res.json("Invalid Token")
  }
})

router.post('/marketPrice/trace', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  let {userId} = req
  let { title, wholesalePrice, retailPrice } = req.body
  let args = {}
  args[`${title}`] = [wholesalePrice, retailPrice, 0].join(",")
  args[`new${title}`] = [wholesalePrice, retailPrice].join(",")
  let status = marketPrice.traceGreenPrice(userId, args)
  return res.json(status)
})

router.delete('/marketPrice/trace', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  let {userId} = req
  let {delItem} = req.body
  let status = marketPrice.traceDelete(userId, delItem)
  return res.json(status)
})

router.get('/marketPrice/tracelist', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let {userId} = req
    let error = error => console.log(error)
    let cacheResponse = await cache.getHashCache('userList', userId, error)
    if(cacheResponse) return res.json(cacheResponse)
    let userTraceList = marketPrice.traceList(userId)
    return res.json(userTraceList)
  } catch (err) {
    console.log(err)
    return res.json('Invalid Token')
  }
})

module.exports = router