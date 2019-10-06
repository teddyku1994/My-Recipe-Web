const searchResult = async () => {
  let url = document.URL
  let params = new URL(url).searchParams
  let dishName = params.get("dishName")
  let ingredient = params.get("ingredient")
  let factsCon = getId("factsCon")
  let loadImg = getId("loadImg")
  let loader = getClass("loader")[0]
  let page = params.get("page")
  let searchResult

  if(!page) return window.location = "/index.html"

  if(parseInt(page) === 0) {
    window.onload = () => {
      getId("recipes").scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      let fact = ["在極端緊急的情況下，椰子汁可以用來做血漿的替代品", "啤酒最早的釀造技術源自埃及——事實上，啤酒就是當年建造金字塔的工匠們每日的「薪水」", "爸媽經常掛在嘴邊的「一天一個蘋果，醫生遠離我」出自班傑明·富蘭克林之口。他居住在國外的時候，經常讓妻子給他寄成箱的蘋果吃~沒想到才華橫溢的文學家也是個蘋果控啊~", "日本最著名的三文魚壽司其實是從挪威引入的", "純凈的蜂蜜保質期可以達到3000年", "蘋果的種類其實是非常非常多的，假如每天吃一種，需要花20多年才能嘗遍世界上的所有蘋果", "製作一根100克重的巧克力棒需要用掉大約1700公升水", "世界上第一份炸藥是用花生做成的，因為花生油能生成硝酸甘油——炸藥的主要成分之一"]
      let num1 = Math.floor(Math.random() * 7)
      let num2 = Math.floor(Math.random() * 6)
      let num3 = Math.floor(Math.random() * 5)
      let num4 = Math.floor(Math.random() * 4)
      let num5 = Math.floor(Math.random() * 3)
      setTimeout(() => {
        loadImg.style.height = "40%"
        factsCon.style.width = "30%"
        createElement("h1", {atrs: {
          id: "factsTitle",
          innerText: "食物冷知識"
        }}, factsCon)
        createElement("div", {atrs: {
          id: "facts",
          innerText: fact[num1]
        }}, factsCon)
        fact.splice(num1, 1)
      }, 2000)
      setTimeout(() => {
        let facts = getId("facts")
        facts.innerText = fact[num2]
        fact.splice(num2, 1)
      }, 5000)
      setTimeout(() => {
        let facts = getId("facts")
        facts.innerText = fact[num3]
        fact.splice(num3, 1)
      }, 10000)
      setTimeout(() => {
        let facts = getId("facts")
        facts.innerText = fact[num4]
        fact.splice(num4, 1)
      }, 15000)
      setTimeout(() => {
        let facts = getId("facts")
        facts.innerText = fact[num5]
        fact.splice(num5, 1)
      }, 15000)
    } 
  } else {
    window.onload = () => getId("recipes").scrollIntoView({block: "center"})
  }

  if(dishName && page){
    searchResult = await fetching(`/search?dishName=${dishName}&page=${page}`, "GET", {"Accept": "application/json"}, null)
    if(!searchResult.error) {
      renderSearchResult(searchResult, "dishName")
      loader.className += " hidden"
    } else {
      loader.className += " hidden";
      noResultRender()
    }
  } else if(ingredient && page) {
    searchResult = await fetching(`/search?ingredient=${ingredient}&page=${page}`, "GET", {"Accept": "application/json"}, null)
    if(!searchResult.error) {
      renderSearchResult(searchResult, "ingredient")
      loader.className += " hidden"
    } else {
      loader.className += " hidden";
      noResultRender()
    }
  } else {
    window.location = "/index.html"
  }
}

const renderSearchResult = (response, args) => {
  let recipes = getId("recipes")
  let page = getId('pages')
  recipes.innerHTML = ""
  for (let i = 0; i < response.data.length; i++){
    createElement("div", {atrs: {
      className: "dish"
    }}, recipes)
    let dish = getClass("dish")[i]
    createElement("a", {atrs: {
      href: `/recipe.html?id=${response.data[i].id}`,
      className: "link"
    }}, dish)
    let link = getClass("link")[i]
    createElement("img", {atrs: {
      src: response.data[i].image,
      alt: "Dish Image"
    }}, link)
    createElement("div", {atrs: {
      innerText: response.data[i].title,
      className: "dishName"
    }}, link)
  }
  let pages = getClass("page")
  if(response.totalPage && !pages[0]){
    let length
    if(response.totalPage > 4) {
      length = 4
      for (let i=0; i <= length; i++){
        createElement("div", {
          atrs: {
            innerText: parseInt([i])+1,
            className: "page",
          },
          evts: {
            click:() => nextPage([i], args)
          }
        }, page)
      }
      createElement("div", {
        atrs: {
          className: "nextPages",
        },
        evts: {
          click:() => nextPages(parseInt(pages[pages.length-1].innerText), args, parseInt(response.totalPage))
        }
      }, page)
    } else {
      length = response.totalPage
      for (let i=0; i <= length; i++){
        createElement("div", {
          atrs: {
            innerText: parseInt([i])+1,
            className: "page",
          },
          evts: {
            click:() => nextPage([i], args)
          }
        }, page)
      }
    }
    let next = getClass("nextPages")[0]
    if(next) {
      createElement("img", {
        atrs: {
          src: "../img/icon/nextPage.png",
          className: "pageImg",
        }
      }, next)
    }
  }
}

const noResultRender = () => {
  let con2 = getId("con2")
  con2.style.height = "20em"
  createElement("div", {atrs: {
    innerText: "Sorry~ 沒有對應食譜喔...",
    className: "noResult"
  }}, con2)
}

const nextPage = async (num, args) => {
  try {
    let url = document.URL
    let params = new URL(url).searchParams
    let dishName = params.get("dishName")
    let ingredient = params.get("ingredient")
    let searchResult
    if(args === "dishName") {
    window.history.pushState("", "",  `/searchList.html?dishName=${dishName}&page=${num}`)

    searchResult = await fetching(`/search?dishName=${dishName}&page=${num}`, "GET", {"Accept": "application/json"}, null)

    if(!searchResult.error) {
      renderSearchResult(searchResult, "dishName")
      let pages =getClass("page")
      for(let i = 0; i < pages.length; i++) {
        pages[i].style.backgroundColor = "rgb(255, 194, 80)"
      }
      pages[num%5].style.backgroundColor = "orangered"
    } else {
      noResultRender()
    } 
  } else if(args === "ingredient") {
    window.history.pushState("", "",  `/searchList.html?ingredient=${ingredient}&page=${num}`)

    searchResult = await fetching(`/search?ingredient=${ingredient}&page=${num}`, "GET", {"Accept": "application/json"}, null)

    if(!searchResult.error) {
      renderSearchResult(searchResult, "dishName")
      let pages =getClass("page")
      for(let i = 0; i < pages.length; i++) {
        pages[i].style.backgroundColor = "rgb(255, 194, 80)"
      }
      pages[num%5].style.backgroundColor = "orangered"
    } else {
      noResultRender()
    } 

  } else {
    console.log("Error")
  }
  } catch (err) {
    console.log(err)
  }
}

const nextPages = (num, args, totalPage) => {
 let page = getId('pages') 
 let pages =getClass("page")
 page.innerHTML = ""
 let newPages = parseInt(totalPage - num)
 console.log(num)
 console.log(totalPage)
 console.log(newPages)
 createElement("div", {
  atrs: {
    className: "previousPages",
  },
  evts: {
    click:() => previousPages(parseInt(pages[0].innerText), args, parseInt(totalPage))
  }
  }, page)
  
 if(newPages > 4) {
  for (let i=0; i < num; i++){
    createElement("div", {
      atrs: {
        innerText: parseInt([i])+num+1,
        className: "page",
      },
      evts: {
        click:() => nextPage(parseInt([i])+num, args)
      }
    }, page)
  }
  createElement("div", {
    atrs: {
      className: "nextPages",
    },
    evts: {
      click:() => nextPages(parseInt(pages[pages.length-1].innerText), args, parseInt(totalPage))
    }
  }, page)
 } else {
  console.log(length)
  for (let i=0; i <= newPages; i++){
    createElement("div", {
      atrs: {
        innerText: parseInt([i])+num+1,
        className: "page",
      },
      evts: {
        click:() => nextPage(parseInt([i])+num, args)
      }
    }, page)
  }
 }
 let next =getClass("nextPages")[0]
  if(next) {
    createElement("img", {
      atrs: {
        src: "../img/icon/nextPage.png",
        className: "pageImg",
      }
    }, next)
  }
let previous =getClass("previousPages")[0]
if(previous) {
  createElement("img", {
    atrs: {
      src: "../img/icon/previousPage.png",
      className: "pageImg",
    }
  }, previous)
}
}

const previousPages = (num, args, totalPage) => {
  let page = getId('pages') 
  let pages =getClass("page")
  let newPages = num - 6
  page.innerHTML = ""
  if(num !== 6) {
    createElement("div", {
      atrs: {
        className: "previousPages",
      },
      evts: {
        click:() => previousPages(parseInt(pages[0].innerText), args, parseInt(totalPage))
      }
    }, page)
    for (let i=0; i < 5; i++){
      createElement("div", {
        atrs: {
          innerText: parseInt([i])+newPages+1,
          className: "page",
        },
        evts: {
          click:() => nextPage(parseInt([i])+newPages, args)
        }
      }, page)
    }
    createElement("div", {
      atrs: {
        className: "nextPages",
      },
      evts: {
        click:() => nextPages(parseInt(pages[pages.length-1].innerText), args, parseInt(totalPage))
      }
    }, page)
  } else {
    for (let i=0; i < 5; i++){
      createElement("div", {
        atrs: {
          innerText: parseInt([i])+newPages+1,
          className: "page",
        },
        evts: {
          click:() => nextPage(parseInt([i])+newPages, args)
        }
      }, page)
    }
    createElement("div", {
      atrs: {
        className: "nextPages",
      },
      evts: {
        click:() => nextPages(parseInt(pages[pages.length-1].innerText), args, parseInt(totalPage))
      }
    }, page)
  }
  let next =getClass("nextPages")[0]
  if(next) {
    createElement("img", {
      atrs: {
        src: "../img/icon/nextPage.png",
        className: "pageImg",
      }
    }, next)
  }
  let previous =getClass("previousPages")[0]
  if(previous) {
    createElement("img", {
      atrs: {
        src: "../img/icon/previousPage.png",
        className: "pageImg",
      }
    }, previous)
  }
}

