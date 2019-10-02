const connection = require('./promiseFunc')

module.exports = {
  insert: async(userId, recipeId, error) => {
    let sql = `INSERT INTO likes (user_id, recipe_id) VALUES (${userId},${recipeId})`
    let result = await connection.sqlQuery(sql, error)
    let sql2 = `SELECT COUNT(*) FROM likes WHERE recipe_id = ${recipeId}`
    let count = await connection.sqlQuery(sql2, error)
    let sql3 = `UPDATE recipe SET likes = ${count[0]['COUNT(*)']} WHERE id = ${recipeId}`
    let update = await connection.sqlQuery(sql3, error)
    return result
  },
  delete: async(userId, recipeId, error) => {
    let sql = `DELETE FROM likes WHERE user_id = ${userId} AND recipe_id = ${recipeId}`
    let result = await connection.sqlQuery(sql, error)
    let sql2 = `SELECT COUNT(*) FROM likes WHERE recipe_id = ${recipeId}`
    let count = await connection.sqlQuery(sql2, error)
    let sql3 = `UPDATE recipe SET likes = ${count[0]['COUNT(*)']} WHERE id = ${recipeId}`
    let update = await connection.sqlQuery(sql3, error)
    return result
  },
  count: async (recipeId, error) => {
    let sql = `SELECT COUNT(*) FROM likes WHERE recipe_id = ${recipeId}`
    let result = await connection.sqlQuery(sql, error)
    return result[0]['COUNT(*)']
  },
  check: async(userId, recipeId, error) => {
    let sql = `SELECT * FROM likes WHERE user_id = ${userId} AND recipe_id = ${recipeId}`
    let result = await connection.sqlQuery(sql, error)
    return result
  }
}