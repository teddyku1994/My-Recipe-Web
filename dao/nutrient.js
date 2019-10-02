const connection = require('../dao/promiseFunc')

module.exports = {
  nutrientSearch: async (keyword, error) => {
    let sql = `SELECT * FROM nutrient WHERE name = '${keyword}'`
    console.log(sql)
    let result = await connection.sqlQuery(sql,error)
    return {data: result}
  },
  nutrientList: async (keyword, limit, error) => {
    let sql = `SELECT name FROM nutrient WHERE name LIKE '%${keyword}%' 
    ORDER BY 
    CASE
    WHEN name LIKE '${keyword}' THEN 1
    WHEN name LIKE '全${keyword}%' THEN 2 
    WHEN name LIKE '${keyword}%' THEN 3
    WHEN name LIKE '%${keyword}' THEN 4
    ELSE '${keyword}%'
    END 
    LIMIT ${limit}`
    let result = await connection.sqlQuery(sql,error)
    let names = result.map((item) => {
      return item.name
    })
    let nameObj = {}
    nameObj.names = names
    return {data: [nameObj]}
  }
} 

