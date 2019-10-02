let signupCon = getId("signupCon")
let signinCon = getId("signinCon")
let signup = getId("signup")
let profileInfo = getId("profileInfo")
let profileFav = getId("profileFav")
let profileRecipe = getId("profileRecipe")

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
    let fillInfo = document.getElementsByClassName("fillInfo")
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
    let fillInfo = document.getElementsByClassName("fillInfo")
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

const logout = () => {
  window.localStorage.clear();
  return window.location = "/index.html"
}

const accountClose = () => {
  signupCon.style.height = 0
  signinCon.style.height = 0
  signup.style.visibility = "visible"
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
  
  let result = await fetching("/user/signup", "POST", {"Content-Type": "application/json"}, body)
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

  let result = await fetching("/user/signin", "POST", {"Content-Type": "application/json"}, body)
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

const renderProfile = async () => {
  let con2 = getId("con2")
  let accessToken = localStorage.getItem("accessToken")
  let body = {
    search: "basicInfo"
  }

  let result = await fetching("/user/profile", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, body)
  console.log(result)
  if(result.error) return window.location = "/index.html"

  let render = (response) => {
    let dp = getId('dp')
    if(response.image) {
      dp.src = response.image
      dp.style.borderRadius = "15px"
    }
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = document.getElementsByClassName('con2_1')[0]
    createElement("div", { atrs: {
      className: "basicInfo",
      innerText: "基本資料"
    }}, con2_1)
    createElement("div", {
      atrs: {
      id: "edit1",
      },
      evts: {
        click:() => editBasic()
      }
    }, con2_1)
    let edit1 = getId("edit1")
    createElement("img", { atrs: {
      src: "./img/icon/edit.png",
      alt: "Edit"
    }}, edit1)
    createElement("div", { atrs: {
      id: "basicInfo"
    }}, con2)
    let basicInfo = getId("basicInfo")
    createElement("div", { atrs: {
      className: "information"
    }}, basicInfo)
    createElement("div", { atrs: {
      className: "information value"
    }}, basicInfo)
    createElement("div", { 
      atrs: {
      className: "submitDetails",
      id: "editSubmit",
      innerText: "SUBMIT"
      },
      evts: {
        click:() => editSubmit()
      }
    }, con2)
    createElement("div", { atrs: {
      className: "con2_1"
      }}, con2)
      let con2_2 = document.getElementsByClassName("con2_1")[1]
    createElement("div", { atrs: {
      className: "changePw",
      innerText: "密碼管理"
    }}, con2_2)
    createElement("div", {
      atrs: {
      id: "edit2",
      },
      evts: {
        click:() => editPw()
      }
    }, con2_2)
    let edit2 = getId("edit2")
    createElement("img", { atrs: {
      src: "./img/icon/edit.png",
      alt: "Edit"
    }}, edit2)
    createElement("div", { atrs: {
      id: "changePw",
    }}, con2)
    let changePw = getId("changePw")
    createElement("div", { atrs: {
      className: "information"
    }}, changePw)
    createElement("div", { atrs: {
      className: "information value"
    }}, changePw)
    createElement("div", { 
      atrs: {
      className: "submitDetails",
      id: "pwSubmit",
      innerText: "SUBMIT"
      },
      evts: {
        click:() => pwSubmit()
      }
    }, con2)
    createElement("input", { 
      atrs: {
      type: "button",
      id: "logoutBtn",
      value: "登出"
      },
      evts: {
        click:() => logout()
      }
    }, con2)
    let information = document.getElementsByClassName("information")
    let subtitle1 = ["名稱:", "ID:", "Email", "大頭貼:"]
    let details1 = ["userName", "userId", "userEmail"]
    let subtitle2 = ["舊密碼", "新密碼", "確認密碼"]
    let details2=  ["oldPw", "newPw", "confirmNewPw"]
    for(let i = 0; i < subtitle1.length; i++) {
      createElement("div", { atrs: {
        className: "subtitle",
        innerText: subtitle1[i]
      }}, information[0])
    }
    let accountInfo = [response.name, response.id, response.email]
    for(let i = 0; i < details1.length; i++) {
      createElement("input", { atrs: {
        className: "details",
        id: details1[i],
        value: accountInfo[i],
        readOnly: true
      }}, information[1])
      createElement("input", { atrs: {
        className: "details",
        id: details2[i],
        type: "password",
        readOnly: true
      }}, information[3])
    }
    for(let i = 0; i < subtitle2.length; i++) {
      createElement("div", { atrs: {
        className: "subtitle",
        innerText: subtitle2[i]
      }}, information[2])
    }
    createElement("input", { atrs: {
      id: "file",
      type: "file",
      name: "profileImg",
      accept: "image/png, image/jpeg, image/png, image/gif"
    }}, information[1])
  }

  render(result.data[0])
}

const editBasic = () => {
  let editSubmit = getId("editSubmit")
  let file = getId("file")
  let userName = getId("userName")
  let dp = getId("dp")
  let profileDp = getId("profileDp")
  let accessToken = localStorage.getItem("accessToken")
  let loading = getId("loading")
  if(editSubmit.style.visibility === "hidden" || editSubmit.style.visibility === "") {
    editSubmit.style.visibility = "visible"
    file.style.visibility = "visible"
    userName.readOnly = false
    userName.style.width = "7em"
    userName.style.backgroundColor = "#97979713"
    userName.style.border = "1px solid #ccc"
  } else {
    editSubmit.style.visibility = "hidden"
    file.style.visibility = "hidden"
    userName.readOnly = true
    userName.style.backgroundColor = "#fff"
    userName.style.border = "none"
    
    fetch("/api/1.0/user/profile", {
      method:"POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    }).then((result) => {
      return (result.json())
    }).then((result) => {
      userName.value = result.data[0].name
      localStorage.setItem("dp", result.data[0].image)
      dp.src = result.data[0].image
      profileDp.src = result.data[0].image
      loading.style.visibility = "hidden"
    }).catch((error) => {
      loading.style.visibility = "hidden"
      console.log(error)
      // alert("系統錯誤")
    })
  }
}

const editPw = () => {
  let pwSubmit = getId("pwSubmit")
  let oldPw = getId("oldPw")
  let newPw = getId("newPw")
  let confirmNewPw = getId("confirmNewPw")
  if(pwSubmit.style.visibility === "hidden" || pwSubmit.style.visibility === "") {
    pwSubmit.style.visibility = "visible"
    oldPw.readOnly = false
    newPw.readOnly = false
    confirmNewPw.readOnly = false
  } else {
    pwSubmit.style.visibility = "hidden"
    oldPw.readOnly = true
    newPw.readOnly = true
    confirmNewPw.readOnly = true
    oldPw.value = ""
    newPw.value = ""
    confirmNewPw.value = ""
  }
}

const editSubmit = () => {
  let editSubmit = getId("editSubmit")
  let file = getId("file")
  let userName = getId("userName")
  let userId = getId("userId")
  let dp = getId("dp")
  let loading = getId("loading")
  let accessToken = localStorage.getItem("accessToken")
  let fd = new FormData();
  
  editSubmit.innerText = ""

  fd.append("name", userName.value)
  fd.append("id", userId.value)
  fd.append("dp", dp.src)
  if(file.files[0]) {
    let imagetype = ["jpg", "jpeg", "png", "gif"]
    let type = file.files[0].type.split("/")[1].toLowerCase()
    if(imagetype.indexOf(type) === -1) {
      editSubmit.innerText = "Submit"
      return feedback("請使用 jpg/jpeg/png/gif", "error") 
    }
    fd.append("profilePic", file.files[0])
  }

  loading.style.visibility = "visible"

  fetch("/api/1.0/user/profile/updateFile", {
    method:"POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: fd
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(result.status === "Success") {
      editSubmit.innerText = "Submit"
      feedback("基本資料更改成功", "success")
      return editBasic()
    } else {
      editSubmit.innerText = "Submit"
      feedback("基本資料更改失敗", "error")
      loading.style.visibility = "hidden"
    }
  }).catch((error) => {
    loading.style.visibility = "hidden"
    console.log(error)
    // alert("系統錯誤")
  })
}

const pwSubmit = () => {
  let oldPw = getId("oldPw").value
  let newPw = getId("newPw").value
  let confirmNewPw = getId("confirmNewPw").value
  let loading = getId("loading")
  let accessToken = localStorage.getItem("accessToken")

  if(!oldPw || !newPw || !confirmNewPw) return feedback("請輸入所有欄位", "error")
  if(newPw.length < 8)  return feedback("密碼長度未達8位數", "error")
  if(newPw !== confirmNewPw) return feedback("確認密碼錯誤", "error")
  
  loading.style.visibility = "visible"

  body = {
    search: "updatePw",
    oldPw: oldPw,
    newPw: newPw
  }

  fetch("/api/1.0/user/profile", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    loading.style.visibility = "hidden"
    if(result.status === "Success") {
      feedback("密碼更改成功", "success")
      return editPw()
    }
    if(result.error === "Invalid Password") return feedback("舊密碼錯誤", "error")
    
  }).catch((error) => {
    loading.style.visibility = "hidden"
    console.log(error)
    // alert("系統錯誤")
  })


} 

const renderMemberFav = (page) => {
  let con2 = getId("con2")
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }
  let accessToken = localStorage.getItem("accessToken")
  body = {
    search: "favInfo",
    page: page
  }

  fetch("/api/1.0/user/profile", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    return render(result)
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })

  let render = (response) => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = document.getElementsByClassName("con2_1")[0]
    createElement("div", { atrs: {
      innerText: "收藏清單"
    }}, con2_1)
    createElement("div", {
      atrs: {
      id: "editFav",
      className: "edit"
      },
      evts: {
        click:() => editFavorite()
      }
    }, con2_1)
    let editFav = getId("editFav")
    createElement("img", { atrs: {
      src: "./img/icon/edit.png",
      alt: "Edit"
    }}, editFav)
    createElement("div", { atrs: {
      id: "favCon",
    }}, con2)
    let favCon = getId("favCon")
    createElement("div", { atrs: {
      id: "favPage",
    }}, con2)
    let favPage = getId("favPage")
    if(response.data){
      for(let i = 0; i < response.data.length; i++){
        createElement("div", { atrs: {
          id: response.data[i].recipe_id,
          className:"favCon2"
        }}, favCon)
        let favCon2 = document.getElementsByClassName("favCon2")
        createElement("a", { atrs: {
          className:"favLink",
          href: `/recipe.html?id=${response.data[i].recipe_id}`
        }}, favCon2[i])
        let favLink = document.getElementsByClassName("favLink")
        createElement("img", { atrs: {
          className:"favImg",
          src: response.data[i].image,
          alt: "Recipe Image"
        }}, favLink[i])
      }
    }
    if(response.totalPage){
      for (let i=0; i <= response.totalPage; i++){
        createElement("div", {
          atrs: {
            innerText: parseInt([i])+1,
            className: "page",
          },
          evts: {
            click:() => renderMemberFav([i])
          }
        }, favPage)
      }
    }
  }
}

const editFavorite = () => {
  let accessToken = localStorage.getItem("accessToken")
  let favImg = document.getElementsByClassName("favImg")
  let favLink = document.getElementsByClassName("favLink")

  let links = []
  if(favLink[0].href.length > 0) {
    for(let i = 0; i < favImg.length; i++) {
      favImg[i].className += " move"
      favImg[i].style.filter = "grayscale(100%)"
      links.push(favLink[i].href)
      favLink[i].removeAttribute("href")
      favImg[i].addEventListener("click", (e) => {
        let id = e.target.parentNode.parentNode.id
        let removed = getId(id)
        body = {
          status: "unsave",
          recipeId: id
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
          if(result.status === "Success") {
            removed.parentNode.removeChild(removed)
          } else {
            feedback("系統錯誤", "error")
          }
        }).catch((error) => {
          console.log(error)
          // alert("系統錯誤")
        })
      })
    }
  } else {
    renderMemberFav(0)
  }
}

const renderCreateRecipe = () => {
  let con2 = getId("con2")
  
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }
  
  createElement("div", { atrs: {
    className: "con2_1"
  }}, con2)
  let con2_1 = document.getElementsByClassName("con2_1")[0]
  createElement("div", { atrs: {
    innerText: "新增食譜"
  }}, con2_1)
  createElement("div", { atrs: {
    id: "createRecipe"
  }}, con2)
  let createRecipe = getId('createRecipe')
  createElement("div", { atrs: {
    className: "createTitle createLabels",
    innerHTML: "標題:"
  }}, createRecipe)
  createElement("input", { atrs: {
    id: "createTitle",
    placeholder: "Required"
  }}, createRecipe)
  createElement("div", { atrs: {
    className: "createMainImg createLabels",
    innerHTML: "成品圖片(必填):"
  }}, createRecipe)
  createElement("input", { atrs: {
    id: "createMainImg",
    type: "file",
    accept: "image/png, image/jpeg, image/png, image/gif"
  }}, createRecipe)
  createElement("div", { atrs: {
    className: "createStep createLabels",
    innerHTML: "食材:"
  }}, createRecipe)
  createElement("div", { atrs: {
    id: "ingredientCon",
  }}, createRecipe)
  let ingredientCon = getId("ingredientCon")
  createElement("div", { atrs: {
    className: "ingredientCon2",
  }}, ingredientCon)
  let ingredientCon2 = document.getElementsByClassName("ingredientCon2")[0]
  createElement("div", { atrs: {
    className: "stepNum ingNum",
    innerText: "1."
  }}, ingredientCon2)
  createElement("input", { atrs: {
    className: "createIng stepItem",
    type: "text",
    placeholder: "食材"
  }}, ingredientCon2)
  createElement("input", { atrs: {
    className: "createAmount stepItem",
    type: "text",
    placeholder: "數量"
  }}, ingredientCon2)
  createElement("div", { atrs: {
    className: "delIngCon stepItem"
  }}, ingredientCon2)
  let delIngCon = document.getElementsByClassName("delIngCon")[0]
  createElement("a", { 
    atrs: {
    className: "delIng",
    innerHTML: "&times;"
    },
    evts: {
      click: delIngredient
    }
  }, delIngCon)
  createElement("input", { 
    atrs: {
    id: "addIng",
    value: "新增食材",
    type: "button"
    },
    evts: {
      click: () => addIngredient()
    }
  }, createRecipe)
  createElement("div", { atrs: {
    className: "createStep createLabels",
    innerHTML: "步驟:"
  }}, createRecipe)
  createElement("div", { atrs: {
    id: "createSteps",
  }}, createRecipe)
  createElement("input", { 
    atrs: {
    id: "addStep",
    value: "新增步驟",
    type: "button"
    },
    evts: {
      click: () => addStep()
    }
  }, createRecipe)
  createElement("div", { 
    atrs: {
    id: "createSubmit",
    innerText:"SUBMIT"
    },
    evts: {
      click: () => createSubmit()
    }
  }, createRecipe)
  let createSteps = getId("createSteps")
  createElement("div", { atrs: {
    className: "stepCon"
  }}, createSteps)
  let stepCon = document.getElementsByClassName("stepCon")[0]
  createElement("div", { atrs: {
    className: "stepNum stepsNum",
    innerText: "1."
  }}, stepCon)
  createElement("textarea", { atrs: {
    className: "createSteps stepItem",
    rows: "2",
    cols: "40"
  }}, stepCon)
  createElement("div", { atrs: {
    className: "imgNum stepItem",
    innerText: "步驟圖片(限一張)"
  }}, stepCon)
  createElement("input", { atrs: {
    className: "createImg stepItem",
    type: "file",
    accept: "image/png, image/jpeg, image/png, image/gif"
  }}, stepCon)
  createElement("div", {
    atrs: {
      className: "delSteps",
      innerHTML: "&times;"
    },
    evts: {
      click: delStep
    }
  }, stepCon)
}

const renderMemberRecipe = () => {
  let con2 = getId("con2")
  if(localStorage.getItem('userRecipes')) localStorage.removeItem('userRecipes')
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }
  let accessToken = localStorage.getItem("accessToken")
  body = {
    status: "list"
  }

  fetch("/api/1.0/user/recipe", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error) return render(result.data)
    return render2()
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })

  let render2 = () => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = document.getElementsByClassName("con2_1")[0]
    createElement("div", { atrs: {
      innerText: "我的食譜"
    }}, con2_1)
    createElement("div", { atrs: {
      id: "recipeListCon"
    }}, con2)
    createElement("input", { 
      atrs: {
      id: "addRecipe",
      value: "新增食譜",
      type: "button"
      },
      evts: {
        click: () => renderCreateRecipe()
      }
    }, con2)
  }

  let render = (response) => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = document.getElementsByClassName("con2_1")[0]
    createElement("div", { atrs: {
      innerText: "我的食譜"
    }}, con2_1)
    createElement("div", {
      atrs: {
      className: "edit",
      id: "edit4",
      },
      evts: {
        click:() => editMyRecipe()
      }
    }, con2_1)
    let edit4 = getId("edit4")
    createElement("img", { atrs: {
      src: "./img/icon/edit.png",
      alt: "Edit"
    }}, edit4)
    createElement("div", { atrs: {
      id: "recipeListCon"
    }}, con2)
    createElement("input", { 
      atrs: {
      id: "addRecipe",
      value: "新增食譜",
      type: "button"
      },
      evts: {
        click: () => renderCreateRecipe()
      }
    }, con2)
    let recipeListCon = getId("recipeListCon")
    createElement("ul", { atrs: {
      id: "myRecipeNav"
    }}, recipeListCon)
    createElement("div", { atrs: {
      id: "recipeEditCon"
    }}, recipeListCon)
    let myRecipeNav = getId("myRecipeNav")
    let userRecipes = []
    for(let i = 0; i < response.length; i++) {
      createElement("li", { atrs: {
        id: `${response[i].id}list`,
        className: "myRecipeList"
      }}, myRecipeNav)
      let myRecipeList = document.getElementsByClassName("myRecipeList")
      createElement("a", { atrs: {
        className: "myRecipeLink",
        innerText: response[i].title,
        href: `/recipe.html?id=${response[i].id}`
      }}, myRecipeList[i])
      userRecipes.push(response[i].id)
    }
    
    localStorage.setItem("userRecipes", userRecipes)
  }
}

const editMyRecipe = () => {
  let recipeEditCon = getId("recipeEditCon")
  let myRecipeLink = document.getElementsByClassName("myRecipeLink")
  let updateRecipe = document.getElementsByClassName("updateRecipe")
  let userRecipes = localStorage.getItem('userRecipes').split(",")
  if(updateRecipe.length === 0){
    for(let i = 0; i < myRecipeLink.length; i++) {
      createElement("div", { 
        atrs: {
        id: `${userRecipes[i]}update`,
        className: "updateCon"
        }
      }, recipeEditCon)
      let updateCon = document.getElementsByClassName("updateCon")
      createElement("input", { 
        atrs: {
        className: "updateRecipe",
        value: "更新",
        type: "button"
        },
        evts: {
          click: () => updateMyRecipe(userRecipes[i])
        }
      }, updateCon[i])
      createElement("input", { 
        atrs: {
        className: "deleteRecipe",
        value: "刪除",
        type: "button"
        },
        evts: {
          click: () => deleteRecipe(userRecipes[i])
        }
      }, updateCon[i])
    } 
  } else {
    recipeEditCon.innerHTML = ""
  }
  
}

const updateMyRecipe = (recipeId) => {
  let con2 = getId("con2")
  let accessToken = localStorage.getItem("accessToken")
  if(localStorage.getItem('userRecipes')) localStorage.removeItem('userRecipes')
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }
  body = {
    status: "update",
    recipeId: recipeId
  }

  fetch("/api/1.0/user/recipe", {
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
    window.localStorage.setItem("recipeId", result.data[0].id)
    render(result)
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })

  let render = (response) => {
    let res = response.data[0]
    let title = res.title
    let ingredient = res.ingredient
    let amount = res.amount
    let step = res.step
    let image = res.image
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = document.getElementsByClassName("con2_1")[0]
    createElement("div", { atrs: {
      innerText: "更新食譜"
    }}, con2_1)
    createElement("div", { atrs: {
      id: "createRecipe"
    }}, con2)
    let createRecipe = getId('createRecipe')
    createElement("div", { atrs: {
      className: "createTitle createLabels",
      innerHTML: "標題:"
    }}, createRecipe)
    createElement("input", { atrs: {
      id: "createTitle",
      placeholder: "Required",
      value: title
    }}, createRecipe)
    createElement("div", { atrs: {
      className: "createMainImg createLabels",
      innerHTML: "成品圖片(上傳更新):"
    }}, createRecipe)
    createElement("input", { atrs: {
      id: "createMainImg",
      type: "file",
      accept: "image/png, image/jpeg, image/png, image/gif"
    }}, createRecipe)
    createElement("div", { atrs: {
      className: "createStep createLabels",
      innerHTML: "食材:"
    }}, createRecipe)
    createElement("div", { atrs: {
      id: "ingredientCon",
    }}, createRecipe)
    createElement("input", { 
      atrs: {
      id: "addIng",
      value: "新增食材",
      type: "button"
      },
      evts: {
        click: () => addIngredient()
      }
    }, createRecipe)
    createElement("div", { atrs: {
      className: "createStep createLabels",
      innerHTML: "步驟:"
    }}, createRecipe)
    createElement("div", { atrs: {
      id: "createSteps",
    }}, createRecipe)
    createElement("input", { 
      atrs: {
      id: "addStep",
      value: "新增步驟",
      type: "button"
      },
      evts: {
        click: () => addStep()
      }
    }, createRecipe)
    createElement("div", { 
      atrs: {
      id: "updateSubmit",
      innerText:"SUBMIT"
      },
      evts: {
        click: () => updateSubmit()
      }
    }, createRecipe)

    let ingredientCon = getId("ingredientCon")

    for(let i = 0; i < ingredient.length; i++) {
      createElement("div", { atrs: {
        className: "ingredientCon2",
      }}, ingredientCon)
      let ingredientCon2 = document.getElementsByClassName("ingredientCon2")[i]
      createElement("div", { atrs: {
        className: "stepNum ingNum",
        innerText: `${i+1}.`
      }}, ingredientCon2)
      createElement("input", { atrs: {
        className: "createIng stepItem",
        type: "text",
        placeholder: "食材",
        value: ingredient[i]
      }}, ingredientCon2)
      createElement("input", { atrs: {
        className: "createAmount stepItem",
        type: "text",
        placeholder: "數量",
        value: amount[i]
      }}, ingredientCon2)
      createElement("div", { atrs: {
        className: "delIngCon stepItem"
      }}, ingredientCon2)
      let delIngCon = document.getElementsByClassName("delIngCon")[i]
      createElement("a", { 
        atrs: {
        className: "delIng",
        innerHTML: "&times;"
        },
        evts: {
          click: delIngredient
        }
      }, delIngCon)
    }
    
    let createSteps = getId("createSteps")
    for(let i = 0; i < step.length; i++) {
      createElement("div", { atrs: {
        className: "stepCon"
      }}, createSteps)
      let stepCon = document.getElementsByClassName("stepCon")[i]
      createElement("div", { atrs: {
        className: "stepNum stepsNum",
        innerText: `${i+1}.`
      }}, stepCon)
      createElement("textarea", { atrs: {
        className: "createSteps stepItem",
        rows: "2",
        cols: "40",
        innerText: `${step[i]}`
      }}, stepCon)
      createElement("img", { atrs: {
        className: "imgNum stepItem",
        src: `${image[i]}`,
        alt: "Step Image"
      }}, stepCon)
      createElement("input", { atrs: {
        className: "createImg stepItem",
        type: "file",
        accept: "image/png, image/jpeg, image/png, image/gif"
      }}, stepCon)
      createElement("div", {
        atrs: {
          className: "delSteps",
          innerHTML: "&times;"
        },
        evts: {
          click: delStep
        }
      }, stepCon)
    }
  }

}

const deleteRecipe = async (recipeId) => {
  let accessToken = localStorage.getItem("accessToken")
  let li = getId(`${recipeId}list`) 
  let update = getId(`${recipeId}update`)
  let loading = getId("loading")
  body = {
    recipeId: recipeId
  }
  let check = confirm("是否確認要刪除食譜")
  if(check === true) {
    loading.style.visibility = "visible"
    let result = await fetching("/user/recipe", "DELETE", {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, body)
    if(result.status === "Success") {
      li.parentNode.removeChild(li)
      update.parentNode.removeChild(update)
      loading.style.visibility = "hidden"
      feedback("刪除成功", "error")
      return 
    }
    loading.style.visibility = "hidden"
    feedback("刪除失敗", "error")
  }
}

const addStep = () => {
  let createSteps = getId("createSteps")
  createElement("div", { atrs: {
    className: "stepCon"
  }}, createSteps)
  let stepCon = document.getElementsByClassName("stepCon")
  let stepsNum = document.getElementsByClassName("stepsNum")
  let lastStepNum = parseInt(stepsNum[stepsNum.length-1].innerText.split(".")[0])+1
  
  createElement("div", { atrs: {
    className: "stepNum stepsNum",
    innerText: `${lastStepNum}.`
  }}, stepCon[stepCon.length-1])
  createElement("textarea", { atrs: {
    className: "createSteps stepItem",
    rows: "2",
    cols: "40"
  }}, stepCon[stepCon.length-1])
  createElement("div", { atrs: {
    className: "imgNum stepItem",
    innerText: "步驟圖片(限一張)"
  }}, stepCon[stepCon.length-1])
  createElement("input", { atrs: {
    className: "createImg stepItem",
    type: "file",
    accept: "image/png, image/jpeg, image/png, image/gif"
  }}, stepCon[stepCon.length-1])
  createElement("div", {
    atrs: {
      className: "delSteps",
      innerHTML: "&times;"
    },
    evts: {
      click: delStep
    }
  }, stepCon[stepCon.length-1])
}

const addIngredient = () => {
  
  let ingNum = document.getElementsByClassName("ingNum")
  let lastingNum = parseInt(ingNum[ingNum.length-1].innerText.split(".")[0])+1

  createElement("div", { atrs: {
    className: "ingredientCon2",
  }}, ingredientCon)
  let ingredientCon2 = document.getElementsByClassName("ingredientCon2")
  createElement("div", { atrs: {
    className: "stepNum ingNum",
    innerText: `${[lastingNum]}.`
  }}, ingredientCon2[ingredientCon2.length-1])
  createElement("input", { atrs: {
    className: "createIng stepItem",
    type: "text",
    placeholder: "食材"
  }}, ingredientCon2[ingredientCon2.length-1])
  createElement("input", { atrs: {
    className: "createAmount stepItem",
    type: "text",
    placeholder: "數量"
  }}, ingredientCon2[ingredientCon2.length-1])
  createElement("div", { atrs: {
    className: "delIngCon stepItem"
  }}, ingredientCon2[ingredientCon2.length-1])
  let delIngCon = document.getElementsByClassName("delIngCon")
  createElement("a", { 
    atrs: {
    className: "delIng",
    innerHTML: "&times;"
    },
    evts: {
      click: delIngredient
    }
  }, delIngCon[delIngCon.length-1])
}

function delIngredient(event) {
  let ingNum = document.getElementsByClassName("ingNum")
  if(ingNum.length > 2) {
    event.target.parentElement.parentElement.parentNode.removeChild(event.target.parentElement.parentElement)
    for(let i = 0; i < ingNum.length; i++) {
      ingNum[i].innerText = `${i+1}.`
    }
  } else {
    feedback("至少需要2樣食材", "error")
  }
}

function delStep(event) {
  let stepsNum = document.getElementsByClassName("stepsNum")
  if(stepsNum.length > 2) {
    event.target.parentElement.parentNode.removeChild(event.target.parentElement)
    for(let i = 0; i < stepsNum.length; i++) {
      stepsNum[i].innerText = `${i+1}.`
    }
  } else {
    feedback("至少需要2個步驟", "error")
  }
}

const createSubmit = () => {
  let title = getId("createTitle").value
  let mainImg = getId("createMainImg").files[0]
  let createSubmit = getId("createSubmit")
  let loading = getId("loading")
  let createIng = document.getElementsByClassName("createIng")
  let createAmount = document.getElementsByClassName("createAmount")
  let createSteps = document.getElementsByClassName("createSteps")
  let createImg = document.getElementsByClassName("createImg")
  let accessToken = localStorage.getItem("accessToken")

  createSubmit.innerText = ""

  if(!title) return feedback("請填入標題", "error")
  if(!mainImg) return feedback("請上傳成品圖片", "error")
  if(createIng.length < 2) return feedback("請填寫至少2種食材", "error")
  if(createSteps.length < 2) return feedback("請填寫至少2個步驟", "error")

  let fd = new FormData();
  let imagetype = ["jpg", "jpeg", "png", "gif"]

  fd.append('title', title)
  let mainImgType = mainImg.type.split("/")[1].toLowerCase()
  if(imagetype.indexOf(mainImgType) === -1) {
    return feedback("請使用 jpg/jpeg/png/gif", "error") 
  }
  fd.append('mainImg', mainImg)
  
  for(let i = 0; i < createIng.length; i++) {
    if(!createIng[i].value) return feedback(`請輸入食材${i+1}`, "error")
    fd.append('ingredient', createIng[i].value)
    if(!createAmount[i].value) return feedback(`請輸入食材${i+1}的數量`, "error")
    fd.append('amount', createAmount[i].value)
  }
  for(let i = 0; i < createSteps.length; i++) {
    if(!createSteps[i].value) return feedback(`請填入料理步驟${i+1}`, "error")
    fd.append('steps', createSteps[i].value)
    if(!createImg[i].files[0]) return feedback(`請上傳料理步驟${i+1}的圖片`, "error")
    let imgType = createImg[i].files[0].type.split("/")[1].toLowerCase()
    if(imagetype.indexOf(imgType) === -1) return feedback("請使用 jpg/jpeg/png/gif", "error")
    fd.append('images', createImg[i].files[0])
  }

  loading.style.visibility = "visible"

  fetch("/api/1.0/user/recipe/upload", {
    method:"POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: fd
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    loading.style.visibility = "hidden"
    if(result.status === "Success") return renderMemberRecipe()
    createSubmit.innerText = "SUBMIT"
    return feedback("上傳失敗", "error")
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const updateSubmit = () => {
  let fd = new FormData();
  let title = getId("createTitle").value
  let mainImg = getId("createMainImg").files[0]
  let updateSubmit = getId("updateSubmit")
  let loading = getId("loading")
  let createIng = document.getElementsByClassName("createIng")
  let createAmount = document.getElementsByClassName("createAmount")
  let createSteps = document.getElementsByClassName("createSteps")
  let createImg = document.getElementsByClassName("createImg")
  let imgNum = document.getElementsByClassName("imgNum")
  let accessToken = localStorage.getItem("accessToken")
  let recipeId = localStorage.getItem("recipeId")

  if(!title) return feedback("請填入標題", "error")
  if(createIng.length < 2) return feedback("請填寫至少2種食材", "error")
  if(createSteps.length < 2) return feedback("請填寫至少2個步驟", "error")

  updateSubmit.innerText = ""

  fd.append('title', title)
  if(mainImg) fd.append('mainImg', mainImg)
  fd.append('recipeId', recipeId)
  for(let i = 0; i < createIng.length; i++) {
    if(!createIng[i].value) return feedback(`請輸入食材${i+1}`, "error")
    fd.append('ingredient', createIng[i].value)
    if(!createAmount[i].value) return feedback(`請輸入食材${i+1}的數量`, "error")
    fd.append('amount', createAmount[i].value)
  }
  for(let i = 0; i < createSteps.length; i++) {
    if(!createSteps[i].value) return feedback(`請填入料理步驟${i+1}`, "error")
    fd.append('steps', createSteps[i].value)
    if(!imgNum[i].src && !createImg[i].files[0]) return feedback(`請上傳料理步驟${i+1}的圖片`, "error")
    if(createImg[i].files[0]){
      fd.append('images', createImg[i].files[0])
      fd.append('image', i)
    } else {
      fd.append('image', imgNum[i].src)
    }
  }
  
  loading.style.visibility = "visible"

  fetch("/api/1.0/user/recipe/update", {
    method:"POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: fd
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    loading.style.visibility = "hidden"
    if(result.status === "Success") return renderMemberRecipe()
    updateSubmit.innerText = "SUBMIT"
    return feedback("更新失敗", "error")
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const memberInfo = () => {
  profileRecipe.style.backgroundColor = "rgb(255, 194, 80)"
  profileFav.style.backgroundColor = "rgb(255, 194, 80)"
  profileInfo.style.backgroundColor = "#ffffff60"
  
  let con2 = getId("con2")
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }

  renderProfile() 
}

const memberFav = () => {
  profileRecipe.style.backgroundColor = "rgb(255, 194, 80)"
  profileInfo.style.backgroundColor = "rgb(255, 194, 80)"
  profileFav.style.backgroundColor = "#ffffff60"

  renderMemberFav(0)

}

const memberRecipe = () => {
  profileFav.style.backgroundColor = "rgb(255, 194, 80)"
  profileInfo.style.backgroundColor = "rgb(255, 194, 80)"
  profileRecipe.style.backgroundColor = "#ffffff60"

  let con2 = getId("con2")
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }

  renderMemberRecipe()

}

const feedback = (msg, status) => {
  let createSubmit = getId("createSubmit")
  let feedbackMsg  = getId("feedbackMsg")
  let updateSubmit = getId("updateSubmit")
  if(status === "error") {
    feedbackMsg.innerText = msg
    feedbackMsg.className = ""
    feedbackMsg.offsetWidth
    feedbackMsg.className = "fadeInError"
    createSubmit ? createSubmit.innerText = "SUBMIT" : null
    updateSubmit ? updateSubmit.innerText = "SUBMIT" : null
  } else {
    feedbackMsg.innerText = msg
    feedbackMsg.className = ""
    feedbackMsg.offsetWidth
    feedbackMsg.className = "fadeInOk"
  }
}