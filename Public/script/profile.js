//* Member Basic Information
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

const renderProfile = async () => {
  let accessToken = localStorage.getItem("accessToken")
  let con2 = getId("con2")
  let body = {
    status: "basicInfo"
  }

  if(!accessToken) return window.location = "/index.html"

  let render = (response) => {
    let dp = getId('dp')
    if(response.image) {
      dp.src = response.image
      dp.style.borderRadius = "15px"
    }
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = getClass('con2_1')[0]
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
      let con2_2 = getClass("con2_1")[1]
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
    let information = getClass("information")
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

  let profileData = await fetching("/user/profile", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(profileData.error) {
    localStorage.clear()
    window.location = "/index.html"
    return 
  }

  render(profileData.data[0])
}

const editBasic = async () => {
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
    body = {
      search: "basicInfo"
    }
    editSubmit.style.visibility = "hidden"
    file.style.visibility = "hidden"
    userName.readOnly = true
    userName.style.backgroundColor = "#fff"
    userName.style.border = "none"

    let newProfileData = await fetching("/user/profile", "POST", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, JSON.stringify(body))

    loading.style.visibility = "hidden"
    
    if(!newProfileData.error) {
      userName.value = newProfileData.data[0].name
      if(newProfileData.data[0].image) {
        localStorage.setItem("dp", newProfileData.data[0].image)
        dp.src = newProfileData.data[0].image
        profileDp.src = newProfileData.data[0].image
      }
    } else {
      console.log(newProfileData)
    }
  }
}

const editSubmit = async () => {
  try {
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
    fd.append("status", "updateDp")
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
  
    let profileUpdate = await fetching("/user/profile", "PUT", {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, fd)
  
    loading.style.visibility = "hidden"
  
    if(profileUpdate.status === "Success") {
      editSubmit.innerText = "Submit"
      feedback("基本資料更改成功", "success")
      editBasic()
    } else {
      editSubmit.innerText = "Submit"
      feedback("基本資料更改失敗", "error")
    }
  } catch (err) {
    loading.style.visibility = "hidden"
    console.log(err)
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

const pwSubmit = async () => {
  let oldPw = getId("oldPw").value
  let newPw = getId("newPw").value
  let confirmNewPw = getId("confirmNewPw").value
  let loading = getId("loading")
  let accessToken = localStorage.getItem("accessToken")

  if(!oldPw || !newPw || !confirmNewPw) return feedback("請輸入所有欄位", "error")
  if(newPw.length < 8)  return feedback("密碼長度未達8位數", "error")
  if(newPw !== confirmNewPw) return feedback("確認密碼錯誤", "error")
  
  loading.style.visibility = "visible"

  let body = {
    status: "updatePw",
    oldPw: oldPw,
    newPw: newPw
  }

  let pwUpdate = await fetching("/user/profile", "PUT", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  loading.style.visibility = "hidden"

  if(pwUpdate.status === "Success") {
    feedback("密碼更改成功", "success")
    editPw()
  } else if(pwUpdate.error === "Invalid Password") {
    return feedback("舊密碼錯誤", "error")
  } else {
    console.log(pwUpdate)
  }
} 

//* Member Favorite
const memberFav = () => {
  profileRecipe.style.backgroundColor = "rgb(255, 194, 80)"
  profileInfo.style.backgroundColor = "rgb(255, 194, 80)"
  profileFav.style.backgroundColor = "#ffffff60"

  renderMemberFav(0)

}

const renderMemberFav = async (page) => {
  let con2 = getId("con2")
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }

  let accessToken = localStorage.getItem("accessToken")
  let body = {
    status: "favInfo",
    page: page
  }

  let render = (response) => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = getClass("con2_1")[0]
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
          id: response.data[i].id,
          className:"favCon2"
        }}, favCon)
        let favCon2 = getClass("favCon2")
        createElement("a", { atrs: {
          className:"favLink",
          href: `/recipe.html?id=${response.data[i].id}`
        }}, favCon2[i])
        let favLink = getClass("favLink")
        createElement("img", { atrs: {
          className:"favImg",
          src: response.data[i].image,
          alt: "Recipe Image"
        }}, favLink[i])
      }
    }
    if(response.totalPage){
      for (let i=0; i < response.totalPage; i++){
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

  let userFavList = await fetching("/user/profile", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(!userFavList.error || userFavList.error === "No Result") {
    render(userFavList) 
  } else {
    console.log(userFavList)
  }
}

const editFavorite = async () => {
  let accessToken = localStorage.getItem("accessToken")
  let favImg = getClass("favImg")
  let favLink = getClass("favLink")
  let links = []

  if(favLink[0].href.length > 0) {
    for(let i = 0; i < favImg.length; i++) {
      favImg[i].className += " move"
      favImg[i].style.filter = "grayscale(100%)"
      links.push(favLink[i].href)
      favLink[i].removeAttribute("href")
      favImg[i].addEventListener("click", async (e) => {
        let id = e.target.parentNode.parentNode.id
        let removed = getId(id)
        body = {
          status: "unsave",
          recipeId: id
        }

        let removedFav = await fetching("/user/favorite", "POST", {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }, JSON.stringify(body))

        if(removedFav.status === "Success") {
          removed.parentNode.removeChild(removed)
        } else {
          feedback("刪除失敗", "error")
        }
      })
    }
  } else {
    renderMemberFav(0)
  }
}

//* Member Recipes
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

const renderMemberRecipe = async () => {
  let con2 = getId("con2")
  if(localStorage.getItem('userRecipes')) localStorage.removeItem('userRecipes')
  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }
  let accessToken = localStorage.getItem("accessToken")
  body = {
    status: "list"
  }

  let render = (response) => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = getClass("con2_1")[0]
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
      let myRecipeList = getClass("myRecipeList")
      createElement("a", { atrs: {
        className: "myRecipeLink",
        innerText: response[i].title,
        href: `/recipe.html?id=${response[i].id}`
      }}, myRecipeList[i])
      userRecipes.push(response[i].id)
    }
    
    localStorage.setItem("userRecipes", userRecipes)
  }

  let render2 = () => {
    createElement("div", { atrs: {
      className: "con2_1"
    }}, con2)
    let con2_1 = getClass("con2_1")[0]
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

  let userRecipeList = await fetching("/user/recipe", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(!userRecipeList.error) {
    render(userRecipeList.data)
  } else {
    console.log(userRecipeList)
    render2()
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
  let con2_1 = getClass("con2_1")[0]
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
  let ingredientCon2 = getClass("ingredientCon2")[0]
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
  let delIngCon = getClass("delIngCon")[0]
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
  let stepCon = getClass("stepCon")[0]
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

const createSubmit = async () => {
  let title = getId("createTitle").value
  let mainImg = getId("createMainImg").files[0]
  let createSubmit = getId("createSubmit")
  let loading = getId("loading")
  let createIng = getClass("createIng")
  let createAmount = getClass("createAmount")
  let createSteps = getClass("createSteps")
  let createImg = getClass("createImg")
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

  let createRecipeStatus = await fetching("/user/recipe/upload", "POST", {
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, fd)

  loading.style.visibility = "hidden"

  if(createRecipeStatus.status === "Success") {
    renderMemberRecipe()
  } else {
    console.log(createRecipeStatus)
    createSubmit.innerText = "SUBMIT"
    feedback("上傳失敗", "error")
  }
}

const editMyRecipe = () => {
  let recipeEditCon = getId("recipeEditCon")
  let myRecipeLink = getClass("myRecipeLink")
  let updateRecipe = getClass("updateRecipe")
  let userRecipes = localStorage.getItem('userRecipes').split(",")
  if(updateRecipe.length === 0){
    for(let i = 0; i < myRecipeLink.length; i++) {
      createElement("div", { 
        atrs: {
        id: `${userRecipes[i]}update`,
        className: "updateCon"
        }
      }, recipeEditCon)
      let updateCon = getClass("updateCon")
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

const updateMyRecipe = async (recipeId) => {
  let con2 = getId("con2")
  let accessToken = localStorage.getItem("accessToken")

  if(localStorage.getItem('userRecipes')) localStorage.removeItem('userRecipes')

  while (con2.hasChildNodes()) {
    con2.removeChild(con2.lastChild)
  }

  let body = {
    status: "update",
    recipeId: recipeId
  }

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
    let con2_1 = getClass("con2_1")[0]
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
      let ingredientCon2 = getClass("ingredientCon2")[i]
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
      let delIngCon = getClass("delIngCon")[i]
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
      let stepCon = getClass("stepCon")[i]
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

  let recipeData = await fetching("/user/recipe", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(!recipeData.error) {
    window.localStorage.setItem("recipeId", recipeData.data[0].id)
    render(recipeData)
  } else {
    console.log(recipeData)
  }
}

const updateSubmit = async () => {
  let fd = new FormData();
  let title = getId("createTitle").value
  let mainImg = getId("createMainImg").files[0]
  let updateSubmit = getId("updateSubmit")
  let loading = getId("loading")
  let createIng = getClass("createIng")
  let createAmount = getClass("createAmount")
  let createSteps = getClass("createSteps")
  let createImg = getClass("createImg")
  let imgNum = getClass("imgNum")
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

  let recipeUpdate = await fetching("/user/recipe/upload", "PUT", {
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, fd)

  loading.style.visibility = "hidden"
  
  if(recipeUpdate.status === "Success") return renderMemberRecipe()

  updateSubmit.innerText = "SUBMIT"
  feedback("更新失敗", "error")
}

const addStep = () => {
  let createSteps = getId("createSteps")
  createElement("div", { atrs: {
    className: "stepCon"
  }}, createSteps)
  let stepCon = getClass("stepCon")
  let stepsNum = getClass("stepsNum")
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
  
  let ingNum = getClass("ingNum")
  let lastingNum = parseInt(ingNum[ingNum.length-1].innerText.split(".")[0])+1

  createElement("div", { atrs: {
    className: "ingredientCon2",
  }}, ingredientCon)
  let ingredientCon2 = getClass("ingredientCon2")
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
  let delIngCon = getClass("delIngCon")
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
  let ingNum = getClass("ingNum")
  let check = confirm("是否確認要刪除食材")
  if(check === true) {
    if(ingNum.length > 2) {
      event.target.parentElement.parentElement.parentNode.removeChild(event.target.parentElement.parentElement)
      for(let i = 0; i < ingNum.length; i++) {
        ingNum[i].innerText = `${i+1}.`
      }
    } else {
      feedback("至少需要2樣食材", "error")
    }
  }
}

function delStep(event) {
  let stepsNum = getClass("stepsNum")
  let check = confirm("是否確認要刪除步驟")
    if(check === true) {
      if(stepsNum.length > 2) {
        event.target.parentElement.parentNode.removeChild(event.target.parentElement)
        for(let i = 0; i < stepsNum.length; i++) {
          stepsNum[i].innerText = `${i+1}.`
        }
      } else {
        feedback("至少需要2個步驟", "error")
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
    let deleteStatus = await fetching("/user/recipe", "DELETE", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, fd)
    if(deleteStatus.status === "Success") {
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

//* Message
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