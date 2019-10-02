const connection = require('./promiseFunc')
const util = require('../util/util')

module.exports = {
  insert: async(userId, recipeId, error) => {
    let sql = 'INSERT INTO likes (user_id, recipe_id) VALUES (?)'
    let result = await connection.sqlQuery(sql, [userId, recipeId], error)
    let sql2 = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
    let count = await connection.sqlQuery(sql2, recipeId, error)
    let sql3 = 'UPDATE recipe SET likes = ? WHERE id = ?'
    await connection.sqlQuery(sql3, [count[0]['COUNT(*)'], recipeId], error)
    if(result.insertId)return {status:"Success"}
    return util.error('Invalid Token')
  },
  delete: async(userId, recipeId, error) => {
    let sql = 'DELETE FROM likes WHERE user_id = ? AND recipe_id = ?'
    let result = await connection.sqlQuery(sql, [userId, recipeId], error)
    let sql2 = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
    let count = await connection.sqlQuery(sql2, recipeId, error)
    let sql3 = 'UPDATE recipe SET likes = ? WHERE id = ?'
    await connection.sqlQuery(sql3, [count[0]['COUNT(*)'], recipeId], error)
    console.log(result)
    return result
  },
  count: async (recipeId, error) => {
    let sql = 'SELECT COUNT(*) FROM likes WHERE recipe_id = ?'
    let result = await connection.sqlQuery(sql, recipeId, error)
    return result[0]['COUNT(*)']
  },
  checkExist: async(userId, recipeId, error) => {
    let sql = 'SELECT * FROM likes WHERE user_id = ? AND recipe_id = ?'
    let result = await connection.sqlQuery(sql, [userId, recipeId], error)
    return result
  }
}