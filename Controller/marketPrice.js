const express = require('express')
const cache = require('../Model/cache')
const marketPrice = require('../Model/marketPrice')
const verification = require('../util/verification')
const router = express.Router()

router.use(express.json())

router.post('/marketPrice/greens', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let body = req.body
    let {userId} = req
    let error = error => console.log(error)
    let greenPrice = await marketPrice.getGreenPrice(userId, body, error)
    res.json(greenPrice)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/marketPrice/trace', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let {userId} = req
    let { title, wholesalePrice, retailPrice } = req.body
    let args = {}
    args[`${title}`] = [wholesalePrice, retailPrice, 0].join(",")
    args[`new${title}`] = [wholesalePrice, retailPrice].join(",")
    let status = await marketPrice.traceGreenPrice(userId, args)
    res.json(status)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.delete('/marketPrice/trace', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  try {
    let {userId} = req
    let {delItem} = req.body
    let status = await marketPrice.traceDelete(userId, delItem)
    return res.json(status)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.get('/marketPrice/tracelist', verification.verifyToken, async (req, res) => {
  try {
    let {userId} = req
    let error = error => console.log(error)
    let cacheResponse = await cache.getHashCache('userList', userId, error)
    if(cacheResponse) return res.json(cacheResponse)
    let userTraceList = await marketPrice.traceList(userId)
    return res.json(userTraceList)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

module.exports = router