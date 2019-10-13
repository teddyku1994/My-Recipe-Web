const connection = require('../Model/promiseFunc')
const crawlRecipe = require('../util/crawl')
const crawl = require('../Model/crawl')
const util = require ('../util/util')

module.exports = {
  listDish: async (recipeId, error) => {
    try {
      let sql = `
      SELECT recipe.*, ingredient.name, ingredient.amount
      FROM recipe
      LEFT JOIN ingredient ON recipe.id = ingredient.recipe_id
      WHERE recipe.id = ?
      GROUP BY recipe.id, ingredient.id ORDER BY id;
      `
      let ingredients = await connection.sqlQuery(sql, recipeId, error)
      let sql2 = 'SELECT method.step, method.image FROM method WHERE recipe_id = ?'
      let steps = await connection.sqlQuery(sql2, recipeId, error)
      const dishInfo = ingredients.map(item => {
        container = {}
        container.id = item.id
        container.title = item.title
        !item.image.includes("https://") ? container.mainImage = `https://d1lpqhjzd6rmjw.cloudfront.net${item.image}` : container.mainImage = item.image
        container.likes = item.likes
        container.userId = item.user_id
        container.ingredient = item.name.split(',')
        container.amount = item.amount.split(',')
        container.step = steps.map(steps => steps.step)
        container.image = steps.map(images => !images.image.includes("https://") ? `https://d1lpqhjzd6rmjw.cloudfront.net${images.image}` : images.image)
        return container
      })
      let data = {
        data:dishInfo
      }
      return data
    } catch (err) {
      throw err
    }
  },
  listByDishName: async (dishName, limit, page, error) => {
    try {
      dishName = dishName.replace(' ','')
      let data = {}
      let offset = page*limit

      let sql = `SELECT * FROM recipe WHERE title LIKE ? LIMIT ? OFFSET ?`
      let recipes = await connection.sqlQuery(sql, [`%${dishName}%`, limit, offset], error)
      
      if(recipes.length < 3 && page === 0) {
        await crawlRecipe.recipeCrawler(dishName)
        return crawl.renderCrawlResult(dishName, limit, 0, error)
      } else {
        let sql2 = `SELECT COUNT(*) FROM recipe WHERE title LIKE ?`
        let total = await connection.sqlQuery(sql2, `%${dishName}%`, error)
        for(let i = 0; i<recipes.length; i++) {
          if(!recipes[i].image.includes("https://")) {
            recipes[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
          }
        }
        
        data.data = recipes
        let totalPage = total[0]['COUNT(*)']
        util.paging(limit, totalPage, page, data)
        return data
      }
    } catch (err) {
      throw err
    }
  },
  listByIngredient: async (ingredient, limit, page, error) => {
    try {
      let data = {}
      let offset = page*limit
      let name = ''
      if(!ingredient.includes(',')) {
        name += `name LIKE ${connection.escape(`%${ingredient}%`)}`
      } else {
        let ingredientArr = ingredient.split(',')
        let args = ingredientArr.map((ingredient) => `name LIKE ${connection.escape(`%${ingredient}%`)}`).join(` AND `)
        name += args
      }
      let sql = `SELECT recipe_id FROM ingredient WHERE ${name}`
      let recipeIds = await connection.sqlQuery(sql, null, error)
      if(recipeIds.length < 4 && page === 0) {
        await crawlRecipe.ingredientCralwer(ingredient)
        return crawl.renderCrawlResult2(ingredient, limit, 0, error)
      }
      let recipeIdsArr = recipeIds.map(item => item.recipe_id)
      let sql2 = 'SELECT * FROM recipe WHERE id IN (?) LIMIT ? OFFSET ?'
      let recipesInfo = await connection.sqlQuery(sql2, [recipeIdsArr, limit, offset], error)
      let sql3 = 'SELECT COUNT(*) FROM recipe WHERE id IN (?)'
      let total = await connection.sqlQuery(sql3, [recipeIdsArr], error)
      for(let i = 0; i<recipesInfo.length; i++) {
        if(!recipesInfo[i].image.includes("https://")) {
          recipesInfo[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
        }
      }
      data.data = recipesInfo
      let totalPage = total[0]['COUNT(*)']
      util.paging(limit, totalPage, page, data)
      return data
    } catch (err) {
      throw err
    }
  },
  listHots: async (limit, error) => {
    try {
      let sql = 'SELECT id, title, image, likes FROM recipe ORDER BY likes DESC LIMIT ?'
      let hotRecipes = await connection.sqlQuery(sql, limit, error)
      for(let i = 0; i<hotRecipes.length; i++) {
        if(!hotRecipes[i].image.includes("https://")) {
          hotRecipes[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${hotRecipes[i].image}`
        }
      }
      let data = {
        data: hotRecipes
      }
      return data
    } catch (err) {
      throw err
    }
  },
  searchRecords: async (body, error) => {
    try {
      let {searchItem, category} = body
      if (category === "dishName"){
        let sql = `INSERT INTO searchRecords SET ?`
        let params = {
          searchItem: searchItem.replace(' ',''),
          category: category
        }
        let result = await connection.sqlQuery(sql, params, error)
        return result
      } else if(category = "ingredient") {
        let searchArr = []
        if(searchItem.length === 1){
          searchArr.push(searchItem)
          searchArr[0].push(category)
        } 
        else {
          searchItem.map((item) => searchArr.push([item, category]))
        }
        let sql = `INSERT INTO searchRecords (searchItem, category) VALUES ?`
        let result = await connection.sqlQuery(sql, [searchArr], error)
        return result
      } else {
        return util.error('Invalid Token')
      }
    } catch (err) {
      throw err
    }
  },
  listHotKeywords: async (limit, error) => {
    try {
      let sql = `SELECT searchItem, category, COUNT(*) FROM searchRecords GROUP BY searchItem, category ORDER BY COUNT(*) DESC LIMIT ?`
      let hotKeywords = await connection.sqlQuery(sql, limit, error)
      let data = {
        data: hotKeywords
      }
      return data
    } catch (err) {
      throw err
    }
  },
  deleteHotKeywords: async(period) => {
    try {
      let error = (error) => console.log(error)
      let sql = `DELETE FROM searchRecords WHERE createAt < (NOW() - INTERVAL ${period})`
      let result = await connection.sqlQuery(sql, null, error)
      return result
    } catch (err) {
      throw err
    }
  }
}