const recipeRender = async () => { 

  let accessToken = localStorage.getItem("accessToken")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  if(!id) return window.location = "/index.html"
  let body = {
    status: "check",
    recipeId: id
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
    let upperbanner = getClass('upperbanner')[0]

    upperbanner.innerText = response.data[0].title

    createElement("img", {atrs: {
      id: "mainImage",
      src: response.data[0].mainImage
    }}, mainImageCon)

    for(let i = 0; i < response.data[0].ingredient.length; i++) {
      createElement("div", {atrs: {
        className: "ingredients"
      }}, con2)
      let ingredients = getClass("ingredients")[i]
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
      let steps = getClass("steps")[i]
      createElement("div", {atrs: {
        className: "image"
      }}, steps)
      let image = getClass("image")[i]
      createElement("img", {atrs: {
        src: response.data[0].image[i],
        alt: "Step Image"
      }}, image)
      createElement("div", {atrs: {
        className: "stepCon"
      }}, steps)
      let stepCon = getClass("stepCon")[i]
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

  let recipeData = await fetching(`/recipe?id=${parseInt(id)}`, "GET", {
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`
  })  

  if(!recipeData.error) {
    render(recipeData)
  } else {
    window.location = "/index.html"
  }

  if(accessToken) {
    let saveStatus = await fetching(`/user/favorite`, "POST", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, JSON.stringify(body)) 
    if(saveStatus.length <= 0 && !saveStatus.error) {
      heart.style.display = "unset"
      hearted.style.display = "none"
    } else {
      heart.style.display = "none"
      hearted.style.display = "unset"
    }
    let LikeStatus = await fetching(`/user/like`, "POST", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }, JSON.stringify(body)) 
    if(LikeStatus.length <= 0 && !saveStatus.error) {
      liked.style.display  = "none"
      like.style.display = "unset"
    } else {
      liked.style.display  = "unset"
      like.style.display = "none"
    }
  }

  await checkLike(id)
}

const save = async () => {
  let accessToken = localStorage.getItem("accessToken")
  let url = document.URL
  let params = new URL(url).searchParams
  let id = params.get("id")
  let body = {
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

  let saveStatus = await fetching("/user/favorite", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(saveStatus.error) {
    recipeMsg.innerText = "收藏失敗"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  heart.style.display = "none"
  hearted.style.display = "unset"
}

const unsave = async () => {
  let accessToken = localStorage.getItem("accessToken")
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

  let unsaveStatus = await fetching("/user/favorite", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(unsaveStatus.error) {
    recipeMsg.innerText = "取消收藏失敗"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  hearted.style.display = "none"
  heart.style.display = "unset"
}

const thumb = async () => {

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

  let likeStatus = await fetching("/user/like", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(likeStatus.error) {
    recipeMsg.innerText = "操作失敗"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  like.style.display = "none"
  liked.style.display = "unset"
  await checkLike(id)
}

const thumbed = async () => {
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

  let unlikeStatus = await fetching("/user/like", "POST", {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  }, JSON.stringify(body))

  if(unlikeStatus.error) {
    recipeMsg.innerText = "操作失敗"
    recipeMsg.className = ""
    recipeMsg.offsetWidth
    recipeMsg.className = "requireAcc"
    return
  }

  liked.style.display  = "none"
  like.style.display = "unset"
  await checkLike(id)
}

const checkLike = async (recipeId) => {
  console.log(recipeId)
  let body = {
    recipeId: recipeId
  }

  let likeCount = await fetching(`/recipe/like`, "POST", {
    "Content-Type": "application/json"
  }, JSON.stringify(body)) 

  if(likeCount > 0){
    likeAmount.innerText = `(${likeCount})`
  } else {
    likeAmount.innerText = "(0)"
  }
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

if(fbShare) {
  let url = document.URL
  let shareLink = getId("shareLink")
  shareLink.href = `http://www.facebook.com/share.php?u=${url}`
}