const express = require('express')
const bodyPasrser = require('body-parser')
const recipeRouter = require('./Route/recipe')
const nutrientRouter = require('./Route/nutrient')
const userRouter = require('./Route/user')
const marketPrice = require('./Route/marketPrice')
const schedule = require('./util/schedule')
const cst = require('./util/const')
const path = require('path')

const app = express()
const PORT = 8000;

app.use(express.json());
app.use(bodyPasrser.urlencoded({ extended: false }))
app.use(bodyPasrser.json())
app.use('/', express.static(path.join(__dirname, 'Public')))

//Schedule Update
schedule.deleteKeywords('7 DAY')
schedule.greenPriceUpdate()

//app.use("/api/", function(req, res, next){
// 	res.set("Access-Control-Allow-Origin", "*");
// 	res.set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
// 	res.set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
// 	res.set("Access-Control-Allow-Credentials", "true");
// 	next();
// });

console.log("Date:",Date())

app.use(`/api/${cst.api_ver}/`, nutrientRouter, recipeRouter, userRouter, marketPrice)

app.get('/', (req, res) => {
  res.redirect("/index.html")
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
