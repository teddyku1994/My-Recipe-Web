const connection = require('../Model/promiseFunc')

module.exports = {
  nutrientSearch: async (keyword, error) => {
    try {
      let sql = `SELECT * FROM nutrient WHERE name = ?`
      let nutrientData = await connection.sqlQuery(sql, keyword, error)
      return {data: nutrientData}
    } catch (err) {
      throw err
    }
  },
  nutrientList: async (keyword, limit, error) => {
    try {
      let sql = `SELECT name FROM nutrient WHERE name LIKE 
      ${connection.escape(`%${keyword}%`)}
      ORDER BY 
      CASE
      WHEN name LIKE ${connection.escape(keyword)} THEN 1
      WHEN name LIKE ${connection.escape(`全${keyword}%`)} THEN 2 
      WHEN name LIKE ${connection.escape(`${keyword}%`)} THEN 3
      WHEN name LIKE ${connection.escape(`%${keyword}`)} THEN 4
      ELSE ${connection.escape(`${keyword}%`)}
      END 
      LIMIT  ${connection.escape(limit)}`
      let relevantFoodList = await connection.sqlQuery(sql, null, error)
      let names = relevantFoodList.map((food) => {
        return food.name
      })
      let nameObj = {}
      nameObj.names = names
      return {data: [nameObj]}
    } catch (err) {
      throw err
    }
  }
} 

