const crawl = require('../Model/crawl')
const axios = require('axios')
const cheerio = require('cheerio')
const promise = require('../Model/promiseFunc')

const removeEmojis = (str) => {
  if(!str) return ''
  let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
  return str.replace(regex, '')
}


module.exports = {
  recipeCrawler:async(keywords) => {
    try {
      let keyword = encodeURI(keywords)
      const url = `https://www.fooding.com.tw/search.php?keywords=${keyword}&search_class_str=&search_city_str=&search_season_str=&search_cook_str=&search_need_str=&sorttype=1&search_type=4`
      let html = await axios.get(url)
      let $ = cheerio.load(html.data)
      let href = $('div.col-md-9 > a')
      if(!href.attr('href')) return console.log("No Result")
      let links = []
      href.each((idx, el) => links.push(`https://www.fooding.com.tw/${$(el).attr('href')}`))

      for(let i = 0; i < links.length; i++) {
        let html = await axios.get(links[i])
        let $ = cheerio.load(html.data)

        let title = $('.form-horizontal > h1').text()

        let mainImg = $('.col-sm-7 > img').attr('src')

        let ingredient = $('.col-sm-5 > .mg-btm10-border > .col-sm-8')
        let ingredients = []
        ingredient.each((idx, el) => ingredients.push($(el).text()))

        let amount = $('.col-sm-5 > .mg-btm10-border > .col-sm-4')
        let amounts = []
        amount.each((idx, el) => amounts.push($(el).text()))

        let step = $('.mg-btm10 > .col-sm-8 > p')
        let steps = []
        step.length !== 0 ? 
        step.each((idx, el) => {
          let text = $(el).text()
          if(text) {
            if(text[0].match(/[0-9]/gi) && text[1].match(/[0-9]/gi) && text[2].match(/[.,\s]/gi)) {
              steps.push(text.slice(3))
            } else if (text[0].match(/[0-9]/gi) && text[1].match(/[.,\s]/gi) || text[0].match(/[0-9]/gi) && text[1].match(/[0-9]/gi)) {
              steps.push(text.slice(2))
            } else if(text[0].match(/[0-9]/gi)) {
              steps.push(text.slice(1))
            } else {
              steps.push(text)
            }
          } else {
            steps.push(null)
          }
        })
        : steps.push(null)

        let image = $('.mg-btm10 > .col-sm-4 > img')
        let images = []
        image.length !== 0 ? 
        image.each((idx, el) => {
          images.push($(el).attr('src'))
        })
        : images.push(null)

        let error = err => console.log(err)
        let duplicate = await crawl.checkDuplicate(mainImg, error)

        if(duplicate.length === 0 && steps.length === images.length && images.indexOf(null) === -1 && steps.indexOf(null) === -1) {
          title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/【】]/gi,' ').split(' ').map((word) => {
            word.includes(keywords.replace(' ','')) ? title = word : title = title
          })
          let body = { 
            title: title,
            mainImg: mainImg,
            ingredient: ingredients.join(','),
            amount: amounts.join(','),
            steps: steps,
            images: images
          }
          await crawl.recipeCrawlInsert(body)
          console.log("complete")
        } else {
          console.log("Duplicate")
        }
      }
      console.log('All Done')

    } catch (err) {
      console.log(err)
    }
  },
  ingredientCralwer: async (keywords) => {
    try {
      let ingredient = encodeURI(keywords)
      let name = ''
      if(!ingredient.includes(',')) {
        name += ingredient
      } else {
        let ingredients = ingredient.split(',')
        name += ingredients.join('%2C')
      }
      const url = `https://icook.tw/recipes/search?q=&ingredients=${name}`
      let html = await axios.get(url)
      let $ = cheerio.load(html.data)

      let href = $('.browse-recipe-cover > a')
      if(!href.attr('href')) return console.log("No Result")
      let links = []
      href.each((idx, el) => {
        links.push(`https://icook.tw${$(el).attr('href')}`)
      })
      if(links.length > 5) links.splice(5, links.length-1)

      for(let i = 0; i < links.length; i++) {
        let html = await promise.html(links[i], i)
        let $ = cheerio.load(html.data)

        let title = $('.recipe-details-header-title > .title').text().replace(/\s+/gi, '')

        let mainImg = $('.main-pic').attr('src')

        let ingredient = $('.ingredient-name')
        let ingredients = []
        ingredient.each((idx, el) => ingredients.push(removeEmojis($(el).text())))

        let amount = $('.ingredient-unit')
        let amounts = []
        amount.each((idx, el) => amounts.push(removeEmojis($(el).text())))

        let step = $('.step-instruction-content')
        let steps = []
        step.length !== 0 ?
        step.each((idx, el) => !$(el).text() ? steps.push(null) : steps.push(removeEmojis($(el).text())))
        : steps.push(null)

        let image = $('a.strip')
        let images = []
        image.length !== 0 ?
        image.each((idx, el) => !$(el).attr('href') ? images.push(null) : images.push($(el).attr('href')))
        : images.push(null)

        let error = err => console.log(err)
        let duplicate = await crawl.checkDuplicate(mainImg, error)
        
        if(duplicate.length === 0 && steps.length === images.slice(1).length && images.indexOf(null) === -1 && steps.indexOf(null) === -1) {
          let body = {
            title: title,
            mainImg: mainImg,
            ingredient: ingredients.join(','),
            amount: amounts.join(','),
            steps: steps,
            images: images.slice(1)
          }
          console.log(body)
          await crawl.recipeCrawlInsert(body)
          console.log('Inserted')
        } else {
          console.log('Duplicate')
        }
      }
      console.log('All Done')

    } catch (err) {
      console.log (err)
    }
  },
  greenPriceCralwer: async (keywords) => {
    try {
      let keyword = encodeURI(keywords)
      let url = `https://www.twfood.cc/search?q=${keyword}`
      let html = await axios.get(url)
      let $ = cheerio.load(html.data)
      let href = $('.blog-posts > h4 > a')
      let links = []
      let others = []
      let titles = []

      if(!href.attr('href')) return null
      href.each((idx, el) => {
        links.push($(el).attr('href'))
        others.push($(el).text().replace(/\s+/gi, ''))
        titles.push($(el).attr('href').split("/").slice(-1)[0])
      })

      let titles2 = titles.map((title) => {
        if(title.includes('-')) {
          return title.split('-')[0]
        } else {
          return title
        }
      })

      let titles3 = []
      titles2.map((title, idx) => {
        if(title.includes(keywords)) {
          titles3.push(idx)
        }
      })

      let newLink
      let title2Idx = titles2.indexOf(keywords)
      if(title2Idx !== -1) {
        newLink = encodeURI(links[title2Idx])
        title = others.splice(title2Idx,1)
        titles2.splice(title2Idx,1)
        links.splice(title2Idx,1)
        let excludeIdx = []
        titles2.map((title, idx) => {
          if(!title.includes(keywords)) {
            excludeIdx.push(idx)
          }
        })
        let newOthers = []
        let newLinks = []
        for(let i = 0; i < others.length; i++) {
          if(excludeIdx.indexOf(i) === -1) {
            newOthers.push(others[i])
            newLinks.push(links[i])
          }
        }
        others = newOthers
        links = newLinks
      } else if(titles3[0]) {
        newLink = encodeURI(links[titles3[0]])
        title = others.splice(title2Idx,1)
        links.splice(title2Idx,1)
      } else {
        newLink = encodeURI(links[0])
        title = others[0]
      }

      let url2 = `https://www.twfood.cc${newLink}`
      let html2 = await axios.get(url2)
      $ = cheerio.load(html2.data)

      let price = $('span.text-price')
      let pricesArr = []
      price.each((idx, el) => {
        pricesArr.push($(el).text())
      })
      let prices = [pricesArr[0], pricesArr[2]]

      let image = `https://www.twfood.cc${$('.vege_img > a > img').attr('src')}`
      
      let greenData
      Array.isArray(title) ? title = title[0] : title = title
      if(others.length > 9) {
        others.splice(10, others.length - 10)
        links.splice(10, links.length - 10)
      }
      others.length > 1 ?
      greenData = {
        title: title,
        price: prices,
        image: image,
        others: others,
        otherLinks: links,
        cacheLink: decodeURI(newLink)
      }
      : greenData = {
        title: title,
        price: prices,
        image: image,
        cacheLink: decodeURI(newLink)
      }
      let data = {
        data:[greenData]
      }
      return data

    } catch (err) {
      console.log(err)
    }
  },
  greenPriceCrawler2: async (links) => {
    try {
      let greenData
      let link = encodeURI(links)
      let url = `https://www.twfood.cc${link}`
      let html = await axios.get(url)
      let $ = cheerio.load(html.data)

      let price = $('span.text-price')
      let pricesArr = []
      price.each((idx, el) => {
        pricesArr.push($(el).text())
      })
      let prices = [pricesArr[0], pricesArr[2]]

      let image = `https://www.twfood.cc${$('.vege_img > a > img').attr('src')}`

      let newKeyword = encodeURI(links.split('/').slice(-1)[0].split('-')[0])
      let url2 = `https://www.twfood.cc/search?q=${newKeyword}`
      let html2 = await axios.get(url2)
       
      if(html2) {
        let $ = cheerio.load(html2.data)
        let links2 = []
        let others = []
        let titles = []
        let href = $('.blog-posts > h4 > a')
        href.each((idx, el) => {
          links2.push($(el).attr('href'))
          others.push($(el).text().replace(/\s+/gi, ''))
          titles.push($(el).attr('href').split("/").slice(-1)[0])
        })

        let titles2 = titles.map((title) => {
          if(title.includes('-')) {
            return title.split('-')[0]
          } else {
            return title
          }
        })

        let title2Idx = titles2.indexOf(links.split('/').slice(-1)[0].split('-')[0])
        let keywordIdx = titles.indexOf(links.split('/').slice(-1)[0])
        if(title2Idx !== -1) {
          others.splice(keywordIdx,1)
          links2.splice(keywordIdx,1)
          titles2.splice(title2Idx,1)
          let excludeIdx = []
          titles2.map((title, idx) => {
            if(!title.includes(links.split('/').slice(-1)[0].split('-')[0])) {
              excludeIdx.push(idx)
            }
          })
          let newOthers = []
          let newLinks = []
          for(let i = 0; i < others.length; i++) {
            if(excludeIdx.indexOf(i) === -1) {
              newOthers.push(others[i])
              newLinks.push(links2[i])
            }
          }
          others = newOthers
          links2 = newLinks
        } else {
          others.splice(title2Idx,1)
          links2.splice(title2Idx,1)
        }

        others.length > 1 ?
        greenData = {
          title: links.split('/').slice(-1)[0],
          price: prices,
          image: image,
          others: others,
          otherLinks: links2, 
          cacheLink: links
        }
        : greenData = {
          title: links.split('/').slice(-1)[0],
          price: prices,
          image: image,
          cacheLink: links
        }
      } else {
        greenData = {
          title: links.split('/').slice(-1)[0],
          price: prices,
          image: image,
          cacheLink: links
        } 
      }

      let data = {
        data:[greenData]
      }
      return data

    } catch (err) {
      console.log(err)
    }
  }
}