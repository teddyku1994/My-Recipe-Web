const express = require('express')
const nutrient = require('../dao/nutrient')
const cache = require('../dao/cache')
const jwt = require('../util/verification')
const router = express.Router()

router.use(express.json())

// Search for Nutrient
router.post('/nutrient/name', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json({"error": "Header is not in application/json"})
  }
 
  let body = req.body
  console.log(body.nutName)
  let error = error => res.json(error)
  let checkCahce = async (response) => {
    if(response) return res.json(response)
    let result = await nutrient.nutrientSearch(body.nutName, error)
    if(result.length <= 0) return res.json(result)
    cache.createSetCache(body.nutName, 604800, JSON.stringify(result))
    return res.json(result)
  }
  cache.getSetCache(body.nutName, checkCahce)
})

router.post('/nutrient/list', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json({"error": "Header is not in application/json"})
  }
  body = req.body
  console.log(body)
  let error = error => res.json(error)
  let result  = await nutrient.nutrientList(body.keyword.replace(/\s+/gi, ''), 9, error)
  return res.json(result)
})

module.exports = router