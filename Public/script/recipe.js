const save = () => {
  let accessToken = localStorage.getItem("accessToken")
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