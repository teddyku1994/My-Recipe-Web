let user = require('../Model/user')
let recipe = require('../Model/recipe')
let crawler = require('../util/crawl')

test('recipe search by Dish name test', async () => {
  let error = err => console.log(err)
  let validRes = await recipe.listByDishName('牛肉麵', 6, 0, error)
  let InvalidRes = await recipe.listByDishName('Invalid Dish Name', 6, 0, error)

  expect(validRes).toBeDefined()
  expect(validRes.data).toHaveLength(6)
  validRes.data.map((recipe) => {
    expect(isNaN(recipe.id)).toBe(false)
    expect(typeof recipe.title).toBe('string')
    expect(recipe.image).toEqual(expect.stringContaining('https://'))
    expect(recipe).toHaveProperty('likes')
    expect(recipe).toHaveProperty('user_id')
  })
  expect(validRes).toHaveProperty('page')
  expect(validRes).toHaveProperty('totalPage')
  expect(InvalidRes).toHaveProperty('error', 'Invalid Search')
})

test('recipe search by Ingredient test', async () => {
  let error = err => console.log(err)
  let validRes = await recipe.listByIngredient('牛肉,醬油', 6, 0, error)
  let InvalidRes = await recipe.listByIngredient('Invalid Ing',  6, 0, error)

  expect(validRes).toBeDefined()
  expect(validRes.data.length).toBeGreaterThanOrEqual(1)
  validRes.data.map((recipe) => {
    expect(isNaN(recipe.id)).toBe(false)
    expect(typeof recipe.title).toBe('string')
    expect(recipe.image).toEqual(expect.stringContaining('https://'))
    expect(recipe).toHaveProperty('likes')
    expect(recipe).toHaveProperty('user_id')
  })
  expect(InvalidRes).toHaveProperty('error', 'Invalid Search')
})

test('sign in returns access token upon valid native account', async () => {
  let valid = {
  provider: 'native',
  email: 'test@test.com',
  pw: '12345678'
  }

  let validWithoutDp = {
    provider: 'native',
    email: 'test123@test.com',
    pw: '12345678'
  }

  let inValid = {
  provider: 'native',
  email: 'test@test.com',
  pw: 'invalidPw'
  }
  
  let error = err => console.log(err)
  let response1 = await user.signin(valid, error)
  let response2 = await user.signin(validWithoutDp, error)
  let response3 = await user.signin(inValid, error)
  inValid.email = 'invalidEmail@test.com'
  let response4 = await user.signin(inValid, error)

  expect(response1).toBeDefined()
  expect(response1).toHaveProperty('accessToken')
  expect(response1).toHaveProperty('dp')

  expect(response2).toBeDefined()
  expect(response2).toHaveProperty('accessToken')
  expect(response2).not.toHaveProperty('dp')

  expect(response3).toEqual({"error": "Invalid Token"})

  expect(response4).toEqual({"error": "Invalid Token"})
})

test('greenPriceCralwer will return complete message upon completion else return null', async () => {
  let response1 = await crawler.greenPriceCralwer("水蜜桃")
  let response2 = await crawler.greenPriceCralwer("高麗菜")
  let response3 = await crawler.greenPriceCralwer("abc水果")

  expect(response1).toBeDefined()
  expect(response1).toHaveProperty('data')
  expect(Object.keys(response1.data[0])).toEqual(expect.arrayContaining(['title', 'price', 'image', 'cacheLink']))
  expect(Object.keys(response1.data[0])).not.toEqual(expect.arrayContaining(['others', 'otherLinks']))
  expect(typeof response1.data[0].title).toBe('string')
  expect(typeof response1.data[0].image).toBe('string')
  expect(typeof response1.data[0].cacheLink).toBe('string')
  expect(Array.isArray(response1.data[0].price)).toBe(true)
  expect(response1.data[0].price).toHaveLength(2)

  expect(response2).toBeDefined()
  expect(response2).toHaveProperty('data')
  expect(Object.keys(response2.data[0])).toEqual(expect.arrayContaining(['title', 'price', 'image', 'others', 'otherLinks', 'cacheLink']))
  expect(Array.isArray(response2.data[0].others)).toBe(true)
  expect(Array.isArray(response2.data[0].otherLinks)).toBe(true)

  expect(response3).toBe(null)
})