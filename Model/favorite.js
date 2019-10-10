const connection = require('./promiseFunc')
const util = require('../util/util')

module.exports = {
  insert: async (userId, recipeId, error) => {
    try {
      let sql = 'INSERT INTO favorite (user_id, recipe_id) VALUES (?)'
      let result = await connection.sqlQuery(sql, [[userId,recipeId]], error)
      if(result.insertId)return result
      return util.error('Invalid Token')
    } catch (err) {
      throw err
    }
  },
  delete: async(userId, recipeId, error) => {
    try {
      let sql = 'DELETE FROM favorite WHERE user_id = ? AND recipe_id = ?'
      let result = await connection.sqlQuery(sql, [userId, recipeId], error)
      if(result.affectedRows) return result
      return util.error('Invalid Token')
    } catch {
      throw err
    }
  },
  list: async (userId, limit, page, error) => {
    try {
      if(isNaN(page) || isNaN(limit)) return util.error("Invalid Token")
      let data= {}
      let offset = page*limit
      let sql = `
      SELECT favorite.*, recipe.*
      FROM favorite
      JOIN recipe
      ON favorite.recipe_id = recipe.id
      WHERE favorite.user_id = ?
      LIMIT ? OFFSET ?
      `
      let params = [userId, limit, offset]
      let favList = await connection.sqlQuery(sql, params, error)
      data.data = favList
      if(favList.length === 0) return util.error('No Result')
      let sql2 = 'SELECT COUNT(*) FROM favorite WHERE user_id = ?'
      let total = await connection.sqlQuery(sql2, userId, error)
      let totalPage = total[0]['COUNT(*)']
      util.paging2(limit, totalPage, page, data)
      return data
    } catch (err) {
      throw err
    } 
  },
  checkExist: async(userId, recipeId, error) => {
    try {
      let sql = 'SELECT * FROM favorite WHERE user_id = ? AND recipe_id = ?'
      let result = await connection.sqlQuery(sql, [userId, recipeId], error)
      return result
    } catch (err) {
      throw err
    }
  }
}