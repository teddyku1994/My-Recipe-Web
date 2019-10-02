const express = require('express')
const recipe = require('../dao/recipe')
const util = require('../util/util')
const likes = require('../dao/likes')
const cache = require('../dao/cache')
const router = express.Router()

router.get('/search', async (req, res) => {
  let dishName = req.query.dishName
  let ingredient = req.query.ingredient
  let page = parseInt(req.query.page)
  let error = error => res.json(error)
  if(dishName) {
    let result = await recipe.listByDishName(dishName.replace(' ',''),6,page,error)
    return res.json(result)
  } else if(ingredient) {
    if(ingredient.length === 1){
      let result = await recipe.listByIngredient(ingredient,6,page,error)
      return res.json(result)
    } else {
      let result = await recipe.listByIngredient(ingredient,6,page,error)
      return res.json(result)
    }
  } else {
    return res.json(util.error('Invalid Search'))
  }
})

router.post('/search', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let body = req.body
  let error = error => res.json(error)
  let result = await recipe.searchRecords(body, error)
  return res.json(result)
})

router.get('/search/hotKeywords', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let error = error => res.json(error)
  let checkCahce = async (response) => {
    if(response) return res.json(response)
    let result = await recipe.listHotKeywords(6, error)
    cache.createSetCache('hotKeywords', 3600, JSON.stringify(result))
    return res.json(result)
  }
  cache.getSetCache('hotKeywords', checkCahce)
})

router.get('/recipe', async (req, res) => {
  
  let id = req.query.id
  let error = error => res.json(error)  
  if(!id) {
    return res.redirect('/index.html')
  } else if(id) {
    let checkCahce = async (response) => {
      if(response) return res.json(response)
      let result = await recipe.listDish(id, error)
      if(result.data.length <= 0) return res.redirect('/index.html')
      cache.createHashCache('recipePage', id, JSON.stringify(result))
      return res.json(result)
    }
    cache.getHashCache('recipePage', id, checkCahce)
  } else {
    return res.json({error: 'Invalid Token'})
  }

})

router.get('/recipe/hots', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let error = error => res.json(error)
  let checkCahce = async (response) => {
    if(response) return res.json(response)
    let result = await recipe.listHots(16, error)
    if(result.data.length === 0) return res.json(util.error('No Result'))
    cache.createSetCache('hots', 21600, JSON.stringify(result))
    return res.json(result)
  }
  cache.getSetCache('hots', checkCahce)
})

router.post('/recipe/like', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  let body = req.body
  let error = error => res.json(util.error(error))

  let result = await likes.count(body.recipeId, error)
  return res.json(result)
})

module.exports = router