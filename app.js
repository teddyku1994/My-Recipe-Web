const express = require('express')
const bodyPasrser = require('body-parser')
const recipeRouter = require('./Controller/recipe')
const nutrientRouter = require('./Controller/nutrient')
const userRouter = require('./Controller/user')
const marketPrice = require('./Controller/marketPrice')
// const schedule = require('./util/schedule')
const cst = require('./util/const')
const path = require('path')

const app = express()
const PORT = 8000

app.use(express.json());
app.use(bodyPasrser.urlencoded({ extended: false }))
app.use(bodyPasrser.json())
app.use('/', express.static(path.join(__dirname, 'Public')))

//Schedule Update
// schedule.deleteKeywords('7 DAY')
// schedule.greenPriceUpdate()

app.use(`/api/${cst.api_ver}/`, nutrientRouter, recipeRouter, userRouter, marketPrice)

app.get('/', (req, res) => {
  res.redirect("/index.html")
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
