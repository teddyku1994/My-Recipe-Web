const express = require('express')
const nutrient = require('../Model/nutrient')
const cache = require('../Model/cache')
const verification = require('../util/verification')
const util = require('../util/util')
const router = express.Router()

router.use(express.json())

router.post('/nutrient/list', verification.verifyContentType, async (req, res) => {
  try {
    body = req.body
    let error = error => console.log(error)
    let result  = await nutrient.nutrientList(body.keyword.replace(/\s+/gi, ''), 9, error)
    console.log(result)
    res.json(result)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/nutrient/name', verification.verifyContentType, async (req, res) => {
  try {
    let {nutName} = req.body
    let error = error => console.log(error)
    let cacheResponse = await cache.getSetCache(nutName, error)
    console.log(cacheResponse)
    if(cacheResponse) return res.json(cacheResponse)
    let nutrientData = await nutrient.nutrientSearch(nutName, error)
    if(nutrientData.length <= 0) return res.json(nutrientData)
    await cache.createSetCache(nutName, 604800, JSON.stringify(nutrientData), error)
    res.json(nutrientData)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

module.exports = router