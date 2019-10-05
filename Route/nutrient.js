const express = require('express')
const nutrient = require('../dao/nutrient')
const cache = require('../dao/cache')
const verification = require('../util/verification')
const util = require('../util/util')
const router = express.Router()

router.use(express.json())

router.post('/nutrient/list', verification.verifyContentType, async (req, res) => {
  try {
    body = req.body
    let error = error => res.json(error)
    let result  = await nutrient.nutrientList(body.keyword.replace(/\s+/gi, ''), 9, error)
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.json(util.error('Invalid Token'))
  }
})

router.post('/nutrient/name', verification.verifyContentType, async (req, res) => {
  try {
    let {nutName} = req.body
    let error = error => console.log(error)
    let cacheResponse = await cache.getSetCache(nutName, error)
    if(cacheResponse) return res.json(cacheResponse)
    let nutrientData = await nutrient.nutrientSearch(nutName, error)
    if(nutrientData.length <= 0) return res.json(nutrientData)
    await cache.createSetCache(nutName, 604800, JSON.stringify(nutrientData), error)
    return res.json(nutrientData)
  } catch (err) {
    console.log(err)
    return res.json(util.error('Invalid Token'))
  }
})

module.exports = router