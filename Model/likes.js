const connection = require('./promiseFunc')
const util = require('../util/util')

module.exports = {
  insert: async(userId, recipeId, error) => {
    try {
      let sql = 'INSERT INTO likes (user_id, recipe_id) VALUES (?)'
      let result = await connection.sqlQuery(sql, [[userId, recipeId]], error)
      let sql2 = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
      let count = await connection.sqlQuery(sql2, recipeId, error)
      let sql3 = 'UPDATE recipe SET likes = ? WHERE id = ?'
      await connection.sqlQuery(sql3, [count[0]['COUNT(*)'], recipeId], error)
      if(result.insertId)return result
      return util.error('Invalid Token')
    } catch (err) {
      throw err
    }
  },
  delete: async(userId, recipeId, error) => {
    try {
      let sql = 'DELETE FROM likes WHERE user_id = ? AND recipe_id = ?'
      let result = await connection.sqlQuery(sql, [userId, recipeId], error)
      let sql2 = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
      let count = await connection.sqlQuery(sql2, recipeId, error)
      let sql3 = 'UPDATE recipe SET likes = ? WHERE id = ?'
      await connection.sqlQuery(sql3, [count[0]['COUNT(*)'], recipeId], error)
      if(result.affectedRows) return result
      return util.error('Invalid Token')
    } catch (err) {
      throw err
    }
  },
  count: async (recipeId, error) => {
    try {
      let sql = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
      let likesCount = await connection.sqlQuery(sql, recipeId, error)
      return likesCount[0]['COUNT(*)']
    } catch (err) {
      throw err
    }
  },
  checkExist: async(userId, recipeId, error) => {
    try {
      let sql = 'SELECT * FROM likes WHERE user_id = ? AND recipe_id = ?'
      let result = await connection.sqlQuery(sql, [userId, recipeId], error)
      return result
    } catch (err) {
      throw err
    }
  }
}