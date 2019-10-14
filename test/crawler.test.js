const crawler = require('../util/crawl')

test('greenPriceCrawler will return complete message upon completion else return null', async () => {
  let response1 = await crawler.greenPriceCrawler("水蜜桃")
  let response2 = await crawler.greenPriceCrawler("高麗菜")
  let response3 = await crawler.greenPriceCrawler("abc水果")

  console.log(response1)

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

