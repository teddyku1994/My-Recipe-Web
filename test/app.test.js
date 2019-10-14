const axios = require('axios')
const user = require('../Model/user')
const recipe = require('../Model/recipe')
const connection = require('../Model/promiseFunc')
jest.mock('axios')

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

test('MySQL connection promise function test', () => {
  let cb = res => console.log(res)
  let validQuery = 'SELECT * FROM recipe WHERE id = ?'
  let InvalidQuery ='SELECTT * FROM recipe WHERE id = ?'
  expect(connection.sqlQuery(validQuery, 123, cb)).resolves.toBeTruthy()
  return expect(connection.sqlQuery(InvalidQuery, 123, cb)).rejects.toThrowError(/error/)
})

test('test facebook sign in using mock', () => {
  let error = err => console.log(err)

  let validUser = {
    provider: 'facebook',
    email: 'test@test.com',
  }

  let fbUserData = {
    name: 'testAcc',
    email: 'test@test.com',
    picture: {
      data: {
        url: 'https://testimage.com'
      }
    }
  }

  let res = {data: fbUserData}

  axios.mockResolvedValue(res)

  return user.signin(validUser, error).then(data => {
    expect(data).toHaveProperty('accessToken')
    expect(data).not.toHaveProperty('accessToken', null)
    expect(data).toHaveProperty('dp', 'https://testimage.com')
  })
})