let heart = document.getElementById("heart")
let hearted = document.getElementById("hearted")
let like = document.getElementById("like")
let liked = document.getElementById("liked")
let likeAmount = getId('likeAmount')
let searchCon = document.getElementById("searchCon")
let close = document.getElementById("btn_close")
let nutrient = document.getElementById("nutrientCon")
let nutclose = document.getElementById("close")
let dishName = document.getElementById("searchBar")
let smartSearch = document.getElementsByClassName("smartSearch")[0]
let search_txt = getId("search_txt")
let fbShare = getId("fbShare")

const searchResult = () => {
  
  let url = document.URL
  let params = new URL(url).searchParams
  let dishName = params.get("dishName")
  let ingredient = params.get("ingredient")
  let factsCon = getId("factsCon")
  let loadImg = getId("loadImg")
  let loader = document.getElementsByClassName("loader")[0]
  let page = params.get("page")
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
    ajax("GET", "/api/1.0/search", `dishName=${dishName}&page=${page}`, {}, (result) => {
      let results = JSON.parse(result)
      if(results.error === "Invalid Search") {
        loader.className += " hidden";
        return noResultRender()
      } 
      renderSearchResult(results, "dishName")
      loader.className += " hidden";
    })
  } else if(ingredient && page) {
    ajax("GET", "/api/1.0/search", `ingredient=${ingredient}&page=${page}`, {}, (result) => {
      console.log(loader)
      let results = JSON.parse(result)
      console.log(results)
      if(results.error === "Invalid Search") {
        loader.className += " hidden";
        return noResultRender()
      }
      renderSearchResult(results, "ingredient")
      loader.className += " hidden";
    })
  } else {
    return window.location = "/index.html"
  }
}

const noResultRender = (response) => {
  let con2 = getId("con2")
  con2.style.height = "20em"
  createElement("div", {atrs: {
    innerText: "Sorry~ 沒有對應食譜喔...",
    className: "noResult"
  }}, con2)
}

const renderSearchResult = (response, args) => {
  let recipes = getId("recipes")
  let page = getId('pages')
  recipes.innerHTML = ""
  for (let i = 0; i < response.data.length; i++){
    createElement("div", {atrs: {
      className: "dish"
    }}, recipes)
    let dish = document.getElementsByClassName("dish")[i]
    createElement("a", {atrs: {
      href: `/recipe.html?id=${response.data[i].id}`,
      className: "link"
    }}, dish)
    let link = document.getElementsByClassName("link")[i]
    createElement("img", {atrs: {
      src: response.data[i].image,
      alt: "Dish Image"
    }}, link)
    createElement("div", {atrs: {
      innerText: response.data[i].title,
      className: "dishName"
    }}, link)
  }
  let pages = document.getElementsByClassName("page")
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
    let next = document.getElementsByClassName("nextPages")[0]
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

const nextPage = (num, args) => {
  let url = document.URL
  let params = new URL(url).searchParams
  let dishName = params.get("dishName")
  let ingredient = params.get("ingredient")
  let loader = document.getElementsByClassName("loader")[0]

  if(args === "dishName") {
    window.history.pushState("", "",  `/searchList.html?dishName=${dishName}&page=${num}`)
    ajax("GET", "/api/1.0/search", `dishName=${dishName}&page=${num}`, {}, (result) => {
      let results = JSON.parse(result)
      if(results.error === "Invalid Search") {
        return noResultRender()
      } 
      renderSearchResult(results, "dishName")
      let pages = document.getElementsByClassName("page")
      for(let i = 0; i < pages.length; i++) {
        pages[i].style.backgroundColor = "rgb(255, 194, 80)"
      }
      pages[num%5].style.backgroundColor = "orangered"
    })
  } else if(args === "ingredient") {
    window.history.pushState("", "",  `/searchList.html?ingredient=${ingredient}&page=${num}`)
    ajax("GET", "/api/1.0/search", `ingredient=${ingredient}&page=${num}`, {}, (result) => {
      let results = JSON.parse(result)
      if(results.error === "Invalid Search") {
        return noResultRender()
      }
      renderSearchResult(results, "ingredient")
      let pages = document.getElementsByClassName("page")
      for(let i = 0; i < pages.length; i++) {
        pages[i].style.backgroundColor = "rgb(255, 194, 80)"
      }
      pages[num%5].style.backgroundColor = "orangered"
    })
  } else {
    console.log("bug")
  }
}

const nextPages = (num, args, totalPage) => {
 let page = getId('pages') 
 let pages = document.getElementsByClassName("page")
 page.innerHTML = ""
 let newPages = parseInt(totalPage - num)
 createElement("div", {
  atrs: {
    className: "previousPages",
  },
  evts: {
    click:() => previousPages(parseInt(pages[0].innerText), args, parseInt(totalPage))
  }
  }, page)
  
 if(newPages > 4) {
  for (let i=0; i < newPages; i++){
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
 let next = document.getElementsByClassName("nextPages")[0]
  if(next) {
    createElement("img", {
      atrs: {
        src: "../img/icon/nextPage.png",
        className: "pageImg",
      }
    }, next)
  }
let previous = document.getElementsByClassName("previousPages")[0]
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
  let pages = document.getElementsByClassName("page")
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
  let next = document.getElementsByClassName("nextPages")[0]
  if(next) {
    createElement("img", {
      atrs: {
        src: "../img/icon/nextPage.png",
        className: "pageImg",
      }
    }, next)
  }
  let previous = document.getElementsByClassName("previousPages")[0]
  if(previous) {
    createElement("img", {
      atrs: {
        src: "../img/icon/previousPage.png",
        className: "pageImg",
      }
    }, previous)
  }
}

const save = () => {
  let accessToken = localStorage.getItem("accessToken")
  let exp = localStorage.getItem("exp")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  body = {
    status: "save",
    recipeId: id
  }
  
  if(!accessToken) {
    recipeMsg.innerText = "請登入帳號"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }
  
  if(accessToken && exp - Date.now() <= 0) {
    window.localStorage.removeItem("accessToken")
    window.localStorage.removeItem("exp")
    alert("請重新登入，謝謝")
    return setTimeout(() => window.location = "/index.html", 3000)
  }

  fetch("/api/1.0/user/favorite", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error){
      heart.style.display = "none"
      hearted.style.display = "unset"
      return
    }
  }).catch((error) => {
    // alert("系統錯誤")
    console.log(error)
  })
}

const unsave = () => {
  let accessToken = localStorage.getItem("accessToken")
  let exp = localStorage.getItem("exp")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  body = {
    status: "unsave",
    recipeId: id
  }

  if(!accessToken) {
    recipeMsg.innerText = "請登入帳號"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }
  if(accessToken && exp - Date.now() <= 0) {
    window.localStorage.removeItem("accessToken")
    window.localStorage.removeItem("exp")
    alert("請重新登入，謝謝")
    return setTimeout(() => window.location = "/index.html", 3000)
  }

  fetch("/api/1.0/user/favorite", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error){
      hearted.style.display = "none"
      heart.style.display = "unset"
      return
    }
  }).catch((error) => {
    alert("系統錯誤")
  })
}

const thumb = () => {

  let accessToken = localStorage.getItem("accessToken")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  let recipeMsg = getId("recipeMsg")
  body = {
    status: "like",
    recipeId: id
  }
  
  if(!accessToken) {
    recipeMsg.innerText = "請登入帳號"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  fetch("/api/1.0/user/like", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    console.log(result)
    if(!result.error){
      like.style.display = "none"
      liked.style.display = "unset"
      checkLike(id)
      return
    }
  }).catch((error) => {
    alert("系統錯誤")
  })
}

const thumbed = () => {
  let accessToken = localStorage.getItem("accessToken")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  body = {
    status: "unlike",
    recipeId: id
  }

  if(!accessToken) {
    recipeMsg.innerText = "請登入帳號"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  fetch("/api/1.0/user/like", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error){
      liked.style.display  = "none"
      like.style.display = "unset"
      checkLike(id)
      return
    }
  }).catch((error) => {
    alert("系統錯誤")
  })
}

const Search = () => {
  
  searchCon.style.padding = "6.5em 8em"

  let hotKeywords = getId("hotKeywords")

  fetch("/api/1.0/search/hotKeywords", {
    method:"GET",
    headers: {
      "content-type": "application/json"
    }
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(result.data.length > 0) {
      hotKeywords.innerHTML = ''
      render(result.data)
    }
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })

  let render = (response) => {
    console.log(response)
    response.map((item) => {
      if(item.category === "dishName") {
        createElement("a", {atrs: {
          href:`/searchList.html?dishName=${item.searchItem}&page=0`,
          className: "keywords",
          innerText: item.searchItem
        }}, hotKeywords)
      } else {
        createElement("a", {atrs: {
          href: `/searchList.html?ingredient=${item.searchItem.replace('肉','')}&page=0`,
          className: "keywords",
          innerText: item.searchItem
        }}, hotKeywords)
      }
    })
  }
}

const closeSearch = () => {
  searchCon.style.padding = "0"
}

const Nutrient = () => {
  nutrient.style.height = "100%"
}

const closeNut = () => {
  nutrient.style.height = "0%" 
}

const add = () => {
  let smartSearch = getId("smartSearch")
  let atrs = { atrs: {
    className: "smartSearch",
    type: "text",
    placeholder: "輸入食材..."
  }}
  createElement("input", atrs, smartSearch)
}

const searchRecords = (keywords, category) => {
  body = {
    searchItem: keywords,
    category: category
  }
  fetch("/api/1.0/search", {
    method:"POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    // alert("系統錯誤")
  })
}

const recipeSearch = () => {
  let dishName = getId("searchBar").value
  if(!dishName) return
  searchRecords(dishName, "dishName")
  window.location = `/searchList.html?dishName=${dishName.replace(/\s+/gi,'')}&page=0`
}

dishName.addEventListener("keyup", (event) => {
  if (event.keyCode === 13){
    recipeSearch()
  }
})

const recipeSearch2 = () => {
  let ingredient = document.getElementsByClassName("smartSearch")
  if(!ingredient[0].value) return console.log("Nothing")
  if(ingredient.length === 1) {
    searchRecords([ingredient[0].value], "ingredient")
    return window.location = `/searchList.html?ingredient=${ingredient[0].value.replace('肉','').replace(/\s+/g,'')}&page=0`
  } 
  let ingredients = []
  for(let i = 0; i < ingredient.length; i++) {
    if(ingredient[i].value) ingredients.push(ingredient[i].value)
  }
  searchRecords(ingredients, "ingredient")
  return window.location = `searchList.html?ingredient=${ingredients.join('%2C').replace('肉','').replace(/\s+/g,'')}&page=0`
}

smartSearch.addEventListener("keyup", (event) => {
  if (event.keyCode === 13){
    recipeSearch2()
  }
})

const recipeRender = () => { 

  let accessToken = localStorage.getItem("accessToken")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  if(!id) return window.location = "/index.html"
  body = {
    status: "check",
    recipeId: id
  }
  
  ajax("GET", "/api/1.0/recipe", `id=${parseInt(id)}`, {}, (result) => {
    let results = JSON.parse(result)
    render(results)
  })

  checkLike(id)

  if(accessToken) {
    fetch("/api/1.0/user/favorite", {
      method:"POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    }).then((result) => {
      return (result.json())
    }).then((result) => {
      if(result.length <= 0){
        heart.style.display = "unset"
        hearted.style.display = "none"
        return
      }
      heart.style.display = "none"
      hearted.style.display = "unset"
      return
    }).catch((error) => {
      // alert("系統錯誤")
    })

    fetch("/api/1.0/user/like", {
      method:"POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    }).then((result) => {
      return (result.json())
    }).then((result) => {
      if(result.length <= 0){
        liked.style.display  = "none"
        like.style.display = "unset"
        return
      }
      liked.style.display  = "unset"
      like.style.display = "none"
      return
    }).catch((error) => {
      console.log(error)
      // alert("系統錯誤")
    })
  }

  let render = (response) => {
    let mainImageCon = getId("mainImageCon")
    let con2 = getId('con2')
    let con3 = getId('con3')
    let url = document.URL
    let metaURL = getId("metaURL")
    let metaTitle = getId("metaTitle")
    let metaDes = getId("metaDes")
    let metaImg = getId("metaImg")
    let upperbanner = document.getElementsByClassName('upperbanner')[0]

    upperbanner.innerText = response.data[0].title

    createElement("img", {atrs: {
      id: "mainImage",
      src: response.data[0].mainImage
    }}, mainImageCon)

    for(let i = 0; i < response.data[0].ingredient.length; i++) {
      createElement("div", {atrs: {
        className: "ingredients"
      }}, con2)
      let ingredients = document.getElementsByClassName("ingredients")[i]
      createElement("div", {atrs: {
        innerText: response.data[0].ingredient[i],
        className: "ingredient"
      }}, ingredients)
      createElement("div", {atrs: {
        innerText: response.data[0].amount[i],
        className: "amount"
      }}, ingredients)
    }
    for(let i = 0; i < response.data[0].step.length; i++) {
      createElement("div", {atrs: {
        className: "steps"
      }}, con3)
      let steps = document.getElementsByClassName("steps")[i]
      createElement("div", {atrs: {
        className: "image"
      }}, steps)
      let image = document.getElementsByClassName("image")[i]
      createElement("img", {atrs: {
        src: response.data[0].image[i],
        alt: "Step Image"
      }}, image)
      createElement("div", {atrs: {
        className: "stepCon"
      }}, steps)
      let stepCon = document.getElementsByClassName("stepCon")[i]
      createElement("div", {atrs: {
        innerText: `STEP ${[i+1]}`,
        className: "stepNum"
      }}, stepCon)
      createElement("div", {atrs: {
        innerText: response.data[0].step[i],
        className: "step"
      }}, stepCon)
    }
    metaURL.content = url
    metaDes.content = "My Recipe 提供眾多食譜讓您選不完"
    metaTitle.content = `My Recipe ${response.data[0].title}的食譜`
    metaImg.content = response.data[0].mainImage
  }
}

const checkLike = (recipeId) => {
  fetch("/api/1.0/recipe/like", {
    method:"POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    console.log(result)
    if(result > 0){
      likeAmount.innerText = `(${result})`
    } else {
      likeAmount.innerText = "(0)"
    }
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const share = () => {
  FB.ui({
    method: 'share',
    href: window.location.href
  },function (response) {
    if (!response) {
        console.log('User did not share the page.');
    }
    else {
        console.log('User shared the page!');
    }
});
}

const recipeSearch3 = () => {
  let dishName = getId("search_txt").value
  if(!dishName) return
  window.location = `/searchList.html?dishName=${dishName}&page=0`
}

if(fbShare) {
  let url = document.URL
  let shareLink = getId("shareLink")
  shareLink.href = `http://www.facebook.com/share.php?u=${url}`
}

if(search_txt) {
  search_txt.addEventListener("keyup", (event) => {
    if (event.keyCode === 13){
      recipeSearch3()
    }
  })
}