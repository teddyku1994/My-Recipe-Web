//* Recipt Slide Search
// DishName Search
const Search = async () => {
  searchCon.style.padding = "6.5em 8em"

  let hotWords = await fetching("/search/hotKeywords", "GET", {"Content-Type": "application/json"})

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

  if(!hotWords.error && hotWords.data.length > 0) {
    console.log(hotWords)
    let hotKeywords = getId("hotKeywords")
    hotKeywords.innerHTML = ''
    render(hotWords.data)
  } else {
    console.log(hotWords)
  }
}

const closeSearch = () => {
  searchCon.style.padding = "0"
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

//Ingredient Search
const recipeSearch2 = () => {
  let ingredient = getClass("smartSearch")
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

const add = () => {
  let smartSearch = getId("smartSearch")
  let atrs = { atrs: {
    className: "smartSearch",
    type: "text",
    placeholder: "輸入食材..."
  }}
  createElement("input", atrs, smartSearch)
}

smartSearch.addEventListener("keyup", (event) => {
  if (event.keyCode === 13){
    recipeSearch2()
  }
})

const searchRecords = async (keywords, category) => {
  let body = {
    searchItem: keywords,
    category: category
  }
  let searchRecord = await fetching("/search", "POST", {"Content-Type": "application/json"}, JSON.stringify(body))
  searchRecord.error ? console.log(searchRecords) : null
}

//* Nutrient Search
const Nutrient = () => {
  nutrient.style.height = "100%"
}

const closeNut = () => {
  nutrient.style.height = "0%" 
}

const nutSearchClick = async () => {
  let keyword = nutSearch.value
  let flipped = getClass("flipped")[0]
  let body = {
    keyword: keyword
  }

  let render = (response) => {
    let nutList = getId("nutList")
    nutList.innerHTML = ""
    nutList.style.display = "flex"
    createElement("div", {atrs: {
        className: "nutListTitle",
        innerText: "搜尋結果"
      }}, nutList)
    createElement("div", {atrs: {
      className: "nutInstruc",
      innerText: "請點擊清單中的項目"
    }}, nutList)
    if(response.length > 0 ) {
      createElement("ul", {atrs: {
        id: "nutListUL"
      }}, nutList)
      let nutListUL = getId("nutListUL")
      response.map((item) => {
        createElement("li", {
          atrs: {
          className: "nutListLI",
          innerText: item
          },
          evts: {
            click: nutDetail
          }
        }, nutListUL)
      })
    } else {
      createElement("div", {atrs: {
        className: "noInfo",
        innerText: "Sorry~ Try Again...",
      }}, nutList)
    }
  }

  let nutList = await fetching("/nutrient/list", "POST", {"Content-Type": "application/json"}, JSON.stringify(body))

  if(!nutList.error) {
    render(nutList.data[0].names)
    if(flipped) toggleFlip()
  } else {
    console.log(nutList)
    alert("Search Error")
  }
}

const nutDetail = async (event) => {
  let nutName = event.target.innerText
  let body = {
    nutName: nutName
  }

  let render = (res) => {
    nutCard.style.display = "flex"
    let calories = getClass("calories")[0]
    let nutTitle = getClass("nutTitle")[0]

    let arr = [res.calories+"大卡", res.protein+"公克", res.totalFat+"公克", res.saturatedFat+"公克", res.carbohydrate+"公克", res.dietaryFiber+"公克", res.sugar+"公克"]

    let arr2 = ["calories", "protein", "totalFat", "satFat", "carbonhydrate", "dietFiber", "sugar"]

    let arr3 = [res.vitE+"毫克", res.vitB2+"毫克", res.vitC+"毫克", res.calcium+"毫克"]

    let arr4 = ["vitE", "vitB2", "vitC", "cal"]

    if(calories){
      removechild(".calories")
      removechild(".protein")
      removechild(".totalFat")
      removechild(".satFat")
      removechild(".carbonhydrate")
      removechild(".dietFiber")
      removechild(".sugar")
      removechild(".sodium")
      removechild(".vitE")
      removechild(".vitB2")
      removechild(".vitC")
      removechild(".cal")
    }
    
    nutTitle.innerText = res.name
    if(res.name.length > 11) {
      nutTitle.style.fontSize = "18px"
    } else {
      nutTitle.style.fontSize = "25px"
    }
    for (let i =0; i<arr.length; i++){
      createElement("div", {atrs: {
        innerText: arr[i],
        className: arr2[i]
      }}, info[i])
      createElement("div", {atrs: {
        innerText: arr3[i],
        className: arr4[i]
      }}, infos[i])
    }
    createElement("div", {atrs: {
      innerText: res.sodium+"毫克",
      className: "sodium"
    }}, calInfo[0])
  }

  let nutData = await fetching("/nutrient/name", "POST", {"Content-Type": "application/json"}, JSON.stringify(body))

  if(!nutData.error) {
    render(nutData.data[0])
    toggleFlip()
    nutCard.removeEventListener("click",toggleFlip)
    nutCard.addEventListener("click", toggleFlip)
  } else {
    console.log(nutData)
    alert("Search Error")
  }
}

const toggleFlip = () => {
  let nutflipCard = getClass("nutflipCard")[0]
  nutflipCard.classList.toggle("flipped")
}

nutSearch.addEventListener("keyup", (event) => {
  if (event.keyCode === 13){
    nutSearchClick() 
  }
})

//* Market Search
const Market = async () => {
  let accessToken = localStorage.getItem('accessToken')
  let recipeMsg = getId("recipeMsg")
  if(!accessToken) {
    recipeMsg.style.left  = "28%"
    recipeMsg.innerText = "此功能為用戶功能，請先註冊/登入，謝謝"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    window.localStorage.clear()
    return
  }
  let status = await verifyStatus()
  if(status.status === "Valid Token") {
    window.location = "/marketPlace.html"
  } else {
    recipeMsg.style.left  = "28%"
    recipeMsg.innerText = "此功能為用戶功能，請先註冊/登入，謝謝"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    window.localStorage.clear()
  }
}

//* Account
const Signup = () => {
  signupCon.style.height = "100%"
  signupCon.innerHTML = ""
  signup.style.visibility = "hidden"
  createElement("div", {
    atrs: {
    innerHTML: "&times;",
    id: "accountClose"
    },
    evts: {
      click:() => accountClose()
    }
  }, signupCon)
  createElement("div", {atrs: {
    id: "signupCon2"
  }}, signupCon)
  let signupCon2 = getId('signupCon2')
  createElement("div", {
    atrs: {
    id: "signupTitle",
    innerText: "SIGN UP"
    },
    evts: {
      click:() => register()
    }
  }, signupCon2)
  createElement("div", {atrs: {
    id: "signupCon3"
  }}, signupCon2)
  let signupCon3 = getId('signupCon3')
  createElement("div", {
    atrs: {
    id: "errorMsg",
    }
  }, signupCon3)
  let fillin = ["帳號名稱", "Email", "密碼", "確認密碼"]
  let inputId = ["fullName", "email", "pw", "confirmPw"]
  for(let i = 0; i < fillin.length; i++) {
    createElement("div", {atrs: {
      className: "fillInfo"
    }}, signupCon3)
    let fillInfo = getClass("fillInfo")
    createElement("div", {atrs: {
      className: "fillin",
      innerText: fillin[i]
    }}, fillInfo[i])
    createElement("input", {atrs: {
      id: inputId[i],
      className: "input",
      placeholder: "Required"
    }}, fillInfo[i])
  }
  let pw = getId('pw')
  let confirmPw = getId('confirmPw')
  let email = getId('email')
  confirmPw.addEventListener("keyup", (event) => {
    if (event.keyCode === 13){
      register()
    }
  })
  email.type = "email"
  pw.type = "password"
  pw.placeholder = "密碼長度至少8位數..."
  confirmPw.type = "password"
  confirmPw.placeholder = "密碼長度至少8位數..."
  let signupTitle = getId("signupTitle")
  confirmPw.addEventListener('focus', () => {
    signupTitle.innerText = "CLICK ME"
    signupTitle.style.backgroundColor = "orangered"
  })
  confirmPw.addEventListener('blur', () => {
    signupTitle.innerText = "SIGN UP"
    signupTitle.style.backgroundColor = "rgb(255, 193, 77)"
  })
}

const register = async () => {
  let fullName = getId("fullName")
  let email = getId("email")
  let pw = getId("pw")
  let confirmPw = getId("confirmPw")

  if(!fullName.value) {
    fullName.focus()
    return errorMsg("請輸入帳號名稱", "signup")
  }
  if(!email.value || !email.value.includes("@")) {
    email.focus()
    return errorMsg("請輸入您的Email", "signup")
  }
  if(!pw.value) {
    pw.focus()
    return errorMsg("請輸入密碼", "signup")
  }
  if(pw.value.length < 8) {
    pw.focus()
    return errorMsg("密碼長度小於8， 請重新輸入密碼", "signup")
  }
  if(!confirmPw.value) {
    confirmPw.focus()
    return errorMsg("請輸入確認密碼", "signup")
  }
  if(pw.value !== confirmPw.value) {
    confirmPw.focus()
    return errorMsg("密碼與確認密碼不相符，請確認", "signup")
  }

  let body = {
    name: fullName.value,
    email: email.value,
    pw: pw.value,
    confirmPw: confirmPw.value
  }
  
  let result = await fetching("/user/signup", "POST", {"Content-Type": "application/json"}, JSON.stringify(body))
  if(result.error === "All fields required") return errorMsg("請輸入所有欄位", "signup")
  if(result.error === "Invalid Token") return errorMsg("密碼各式錯誤，請確認", "signup")
  if(result.error === "Email Taken") return errorMsg("Email已使用", "signup")
  if(result.error === "Failed to signup") return errorMsg("註冊失敗", "signup")
  if(result.error) return errorMsg("系統錯誤", "signup")
  localStorage.setItem("accessToken", result.accessToken)
  if(result.dp) localStorage.setItem("dp", result.dp)
  sucessMsg("註冊成功!", "signup")
  setTimeout(() => {
    return window.location = "/index.html"
  }, 1000)
}

const Signin = () => {
  signinCon.style.height = "100%"
  let verify = getId('signinCon2')
  signup.style.visibility = "hidden"
  if(!verify){
    createElement("div", {
      atrs: {
      innerHTML: "&times;",
      id: "accountClose"
      },
      evts: {
        click:() => accountClose()
      }
    }, signinCon)
    createElement("div", {atrs: {
      id: "signinCon2"
    }}, signinCon)
    let signinCon2 = getId('signinCon2')
    createElement("div", {
      atrs: {
      id: "signinTitle",
      innerText: "SIGN IN"
      },
      evts: {
        click:() => login()
      }
    }, signinCon2)
    createElement("div", {atrs: {
      id: "signinCon3"
    }}, signinCon2)
    let signinCon3 = getId('signinCon3')
    createElement("div", {
      atrs: {
      id: "errorMsg",
      }
    }, signinCon3)
    createElement("div", {atrs: {
      className: "fillInfo"
    }}, signinCon3)
    createElement("div", {atrs: {
      className: "fillInfo pwInput"
    }}, signinCon3)
    let fillInfo = getClass("fillInfo")
    createElement("div", {atrs: {
      className: "fillin email",
      innerText: "Email"
    }}, fillInfo[0])
    createElement("input", {atrs: {
      id: "email",
      className: "input",
      placeholder: "Required"
    }}, fillInfo[0])
    createElement("div", {atrs: {
      className: "fillin",
      innerText: "Password"
    }}, fillInfo[1])
    createElement("input", {atrs: {
      id: "pw",
      className: "input",
      placeholder: "Required",
      type: "password"
    }}, fillInfo[1])
  }
  let email = getId("email")
  email.type = "email"
  let pw = getId("pw")

  pw.addEventListener("keyup", (event) => {
    if (event.keyCode === 13){
      login()
    }
  })

  let fb = getId("fbLogin")
  signinCon3.appendChild(fb)

  let signinTitle = getId("signinTitle")
  pw.addEventListener('focus', () => {
    signinTitle.innerText = "CLICK ME"
    signinTitle.style.backgroundColor = "orangered"
  })
  pw.addEventListener('blur', () => {
    signinTitle.innerText = "SIGN IN"
    signinTitle.style.backgroundColor = "rgb(255, 193, 77)"
  })
}

const login = async () => {
  let email = getId("email")
  let pw = getId("pw")

  if(!email.value || !email.value.includes("@")) {
    email.focus()
    return errorMsg("請輸入您的Email", "signin")
  } 
  if(!pw.value){
    pw.focus()
    return errorMsg("請輸入您密碼", "signin")
  }

  let body = {
    provider: "native",
    email: email.value,
    pw: pw.value
  }

  let result = await fetching("/user/signin", "POST", {"Content-Type": "application/json"}, JSON.stringify(body))
  let url = window.location.href
  if(result.error === "All fields required") return errorMsg("請輸入所有欄位", "signin")
  if(result.error === "Invalid Token") return errorMsg("帳號/密碼錯誤", "signin")
  if(result.error === "Failed to signin") return errorMsg("登入失敗", "signin")
  if(result.error) return errorMsg("系統錯誤", "signin")
  localStorage.setItem("accessToken", result.accessToken)
  if(result.dp) localStorage.setItem("dp", result.dp)
  sucessMsg("歡迎回來!", "signin")
  setTimeout(() => {
    return window.location = url
  }, 1000)
}

const accountClose = () => {
  signupCon.style.height = 0
  signinCon.style.height = 0
  signup.style.visibility = "visible"
}

const logout = () => {
  window.localStorage.clear();
  return window.location = "/index.html"
}

let errorMsg = (msg,option) => {
  let con3
  let error = getId("errorMsg")
  option === "signup" ? con3 = getId("signupCon3") : con3 = getId("signinCon3")
  error.innerHTML = ""
  con3.style.padding = "0"
  error.innerHTML = msg
  error.style.display = "unset"
  return 
}

let sucessMsg = (msg,option) => {
  let con3
  let error = getId("errorMsg")
  option === "signup" ? con3 = getId("signupCon3") : con3 = getId("signinCon3")
  error.innerHTML = ""
  con3.style.padding = "0"
  error.innerHTML = msg
  error.style.backgroundColor = "rgba(219, 241, 196, 0.9)"
  error.style.color = "green"
  error.style.border = "1px solid rgba(130, 243, 16, 0.9)"
  error.style.display = "unset"
  return 
}

//* Profile
const Profile = () => {
  window.location = "/profile.html"
}

const navBarCheckStatus = async () => {
  let accessToken = localStorage.getItem('accessToken')
  let signin = getId("signin")
  let signup = getId("signup")
  let mainNav = getId("mainNav")
  let profile = getId("profile")
  let profileDp = getId("profileDp")
  if(!accessToken) return
  let status = await verifyStatus()
  if(status.status = "Valid Token") {
    signin.style.display = "none"
    signup.style.display = "none"
    mainNav.style.margin = "1em 0"
    profile.style.display = "unset"
    if(localStorage.getItem('dp')) {
      profileDp.src = localStorage.getItem('dp')
    }
  } else {
    window.localStorage.clear()
    window.location = "/index.html"
  }
}

navBarCheckStatus()