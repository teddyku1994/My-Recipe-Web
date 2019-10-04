let searchText = getId("searchText")

const searchPrice = () => {
  let searchTitle = getId("searchTitle")
  let listTitle = getId("listTitle")
  let searchBoxCon = getId("searchBoxCon")
  let instruction = getId("instruction")
  let wholesalePrice = getId("wholesalePrice")
  let traceList = getId("traceList")
  
  listTitle.style.fontSize = "1.5rem"
  listTitle.style.color = "rgb(0, 0, 0)"
  listTitle.style.borderBottom = "none"
  searchTitle.style.fontSize = "1.7rem"
  searchTitle.style.color = "rgb(255, 194, 80)"
  searchTitle.style.borderBottom = "2px solid rgb(255, 194, 80)"
  searchBoxCon.style.display = "unset"
  traceList.style.display = "none"
  if(wholesalePrice.innerText === "") {
    instruction.style.display = "unset"
  }
  marketResultCon.style.display = "unset"
  setTimeout(() => {
    searchBoxCon.style.opacity = "1"
    if(wholesalePrice.innerText === "") {
      instruction.style.opacity = "1"
    }
    marketResultCon.style.opacity = "1"
    traceList.style.opacity = "0"
  },500)
}

const priceList = () => {
  let accessToken = localStorage.getItem("accessToken")
  let listTitle = getId("listTitle")
  let searchTitle = getId("searchTitle")
  let searchBoxCon = getId("searchBoxCon")
  let instruction = getId("instruction")
  let marketResultCon = getId("marketResultCon")
  let traceList = getId("traceList")

  searchTitle.style.fontSize = "1.5rem"
  searchTitle.style.color = "rgb(0, 0, 0)"
  searchTitle.style.borderBottom = "none"
  listTitle.style.fontSize = "1.7rem"
  listTitle.style.color = "rgb(255, 194, 80)"
  listTitle.style.borderBottom = "2px solid rgb(255, 194, 80)"
  searchBoxCon.style.opacity = "0"
  instruction.style.opacity = "0"
  marketResultCon.style.opacity = "0"
  setTimeout(() => {
    searchBoxCon.style.display = "none"
    instruction.style.display = "none"
    marketResultCon.style.display = "none"
    traceList.style.display = "flex"
  },500)
  setTimeout(() => {
    traceList.style.opacity = "1"
  }, 100);

  fetch("/api/1.0/marketPrice/tracelist", {
    method:"GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(result){
      console.log(result)
      return priceListRender(result)
    }
    console.log(result)
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })

}

const priceListRender = (response) => {
  let traceList = getId("traceList")
  traceList.innerHTML = ""
  createElement("div", {atrs: {
    id: "updatePolicy"
  }}, traceList)
  let updatePolicy = getId("updatePolicy")
  let policy = ["*最多可關注十筆菜價", "*更新時間: 週一6:00 A.M."]
  policy.map((policy) => {
    createElement("p", {atrs: {
      className: "updatePolicy",
      innerText: policy
    }}, updatePolicy)
  })
  createElement("div", {atrs: {
    id: "tableCon"
  }}, traceList)
  let tableCon = getId("tableCon")
  createElement("div", {atrs: {
    id: "columnTitle"
  }}, tableCon)
  let columnTitle = getId("columnTitle")
  let columnTags = ["名稱", "本週零售價(NTD/Kg)", "上週零售價(NTD/Kg)", "價差(NTD/Kg)", ""]
  var count = 1
  columnTags.map((tag) => {
    createElement("div", {atrs: {
      id: `column${count}`,
      className: "columnTag",
      innerText: tag
    }}, columnTitle)
    count++
  })
  if(!response.error) {
    let names = Object.keys(response.data[0])
    let length = names.length
    for(let i = 0; i < length; i++) {
      let curPrice = response.data[1][`new${names[i]}`]
      let oldPrice = response.data[0][names[i]]
      console.log(response)
      console.log(curPrice)
      createElement("div", {atrs: {
        className: "priceCon",
      }}, tableCon)
      let priceCon = document.getElementsByClassName("priceCon")[i]
      createElement("div", {atrs: {
        className: "nameTag traceInfo",
        innerText: names[i]
      }}, priceCon)
      createElement("div", {atrs: {
        className: "curPrice traceInfo",
        innerText: curPrice[1]
      }}, priceCon)
      if(parseInt(oldPrice[2]) !== 0) {
        createElement("div", {atrs: {
          className: "oldPrice traceInfo",
          innerText: oldPrice[1]
        }}, priceCon)
        oldPrice[1]-curPrice[1] === 0 ?
        createElement("div", {atrs: {
          className: "priceDiff traceInfo",
          innerText: "-"
        }}, priceCon)
        : createElement("div", {atrs: {
          className: "priceDiff traceInfo",
          innerText: curPrice[1] - oldPrice[1]
        }}, priceCon)
      } else {
        createElement("div", {atrs: {
          className: "oldPrice traceInfo",
          innerText: "-"
        }}, priceCon)
        createElement("div", {atrs: {
          className: "priceDiff traceInfo",
          innerText: "-"
        }}, priceCon)
      }
      createElement("div", {
        atrs: {
        className: "delTrace traceInfo",
        innerHTML: "&times;"
        },
        evts: {
          click: () => delTrace(names[i])
        }
      }, priceCon)
      let priceDiff = document.getElementsByClassName("priceDiff")[i]
      switch (true) {
        case priceDiff.innerText === "-" : 
          priceCon.style.backgroundColor = "white"
          break
        case parseInt(priceDiff.innerText) < 0:
            priceCon.style.backgroundColor = "rgba(196, 250, 196, 0.35)"
          break
        case parseInt(priceDiff.innerText) > 0:
            priceCon.style.backgroundColor = "rgba(255, 185, 185, 0.35)"
          break
      }
    }
  }
}

const delTrace = (name) => {
  let accessToken = localStorage.getItem("accessToken")
  let 
  body = {
    delItem: name
  }
  fetch("/api/1.0/marketPrice/trace", {
    method:"DELETE",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error){
      let traceMsg = getId("traceMsg")
      let nameTag = document.getElementsByClassName("nameTag")
      let titles = []
      for(let i = 0; i < nameTag.length; i++) {
        titles.push(nameTag[i].innerText)
      }
      let index  = titles.indexOf(name)
      let priceCon = document.getElementsByClassName("priceCon")[index]
      priceCon.parentNode.removeChild(priceCon)
      if(greenTitle.innerText === name) {
        trace.className = "traceHover"
        trace.style.backgroundColor = "rgb(255, 194, 80)"
        trace.value = "加入關注"
        trace.addEventListener("click", tracePrice)
        trace.removeEventListener("click", delTrace2)
      }
      traceMsg.innerText = "取消成功"
      traceMsg.className = ""
      traceMsg.offsetWidth
      traceMsg.className = "popRed"
      return 
    }
    console.log(result)
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const delTrace2 = () => {
  let accessToken = localStorage.getItem("accessToken")
  let trace = getId("trace")
  let greenTitle = getId("greenTitle")

  body = {
    delItem: greenTitle.innerText
  }
  fetch("/api/1.0/marketPrice/trace", {
    method:"DELETE",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(!result.error){
      let traceMsg = getId("traceMsg")
      trace.className = "traceHover"
      trace.style.backgroundColor = "rgb(255, 194, 80)"
      trace.value = "加入關注"
      traceMsg.innerText = "取消成功"
      traceMsg.className = ""
      traceMsg.offsetWidth
      traceMsg.className = "popRed"
      trace.addEventListener("click", tracePrice)
      trace.removeEventListener("click", delTrace2)
      return
    }
    console.log(result)
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const marketSearch = () => {
  let accessToken = localStorage.getItem("accessToken")
  let searchBoxCon = getId("searchBoxCon")
  let searchText = getId("searchText")
  let searchBtn = getId("searchBtn")
  let marketResultCon = getId("marketResultCon")
  let instruction = getId("instruction")
  let myMarketTitle = getId("myMarketTitle")
  let loadImg = getId("loadImg")
  let searchMsg = getId("searchMsg")
  
  if(searchText.style.width = "0" && !searchText.value) {
    searchBoxCon.className += " widen"
    searchText.className += " widen"
    searchBtn.className += " widen"
  } else {
    searchBoxCon.className = "searchBoxCon"
    searchText.className = "searchText"
    searchBtn.className = "searchBtn"
  }
  if(!searchText.value) return

  if(marketResultCon.style.height = "70%") {
    marketResultCon.style.display = "none"
  }
  loadImg.style.display = "unset"

  body = {
    keywords: searchText.value.replace(/\s+/g,''),
  }

  console.log(body)
  
  fetch("/api/1.0/marketPrice/greens", {
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
      instruction.style.display = "none"
      loadImg.style.display = "none"
      marketResultCon.style.display = "unset"
      searchBoxCon.style.top = "5%"
      marketResultCon.style.height = "70%"
      marketResultCon.style.overflow = "scroll"
      myMarketTitle.style.marginBottom = "20px"
      renderMarketPrice(result.data[0])
    }
    if(result.error === "No Result") {
      loadImg.style.display = "none"
      searchMsg.innerText = "SORRY~ 沒有查到您在尋找的菜價..."
      searchMsg.className = ""
      searchMsg.offsetWidth
      searchMsg.className = "noResult"
    }
    searchBoxCon.className += " widen"
    searchText.className += " widen"
    searchBtn.className += " widen"
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

searchText.addEventListener("keyup", (event) => {
  if (event.keyCode === 13){
    marketSearch()
  }
})

let renderMarketPrice = (response) => {
  let greenImg = getId("greenImg")
  let greenTitle = getId("greenTitle")
  let wholesalePrice = getId("wholesalePrice")
  let retailPrice = getId("retailPrice")
  let othersTitle = getId("othersTitle")
  let otherResult = getId("otherResult")
  let trace = getId("trace")

  greenImg.src = response.image
  greenTitle.innerText = response.title
  wholesalePrice.innerText = `${response.price[0]} / KG`
  retailPrice.innerText = `${response.price[1]} / KG`
  if(response.exist === 1) {
    trace.removeEventListener("click", tracePrice)
    trace.addEventListener("click", delTrace2)
    trace.className = ""
    trace.value = "取消關注"
    trace.style.backgroundColor = "grey"
  } else {
    trace.addEventListener("click", tracePrice)
    trace.removeEventListener("click", delTrace2)
    if(trace.className !== "traceHover") trace.className = "traceHover"
    trace.value = "加入關注"
    trace.style.backgroundColor = "rgb(255, 194, 80)"
  }
  otherResult.innerHTML = ""
  if(response.others) {
    othersTitle.innerText = "其他結果:"
    for(let i = 0; i < response.others.length; i++) {
      createElement("div", {
        atrs: {
          innerText: response.others[i],
          className: "recomName",
        },
        evts: {
          click:() => relatedSearch(response.otherLinks[i])
        }
      }, otherResult)
    }
  } else {
    othersTitle.innerText = ""
  }
}

const relatedSearch = (links) => {
  let accessToken = localStorage.getItem("accessToken")
  let loadImg = getId("loadImg")
  let marketResultCon = getId("marketResultCon")
  
  marketResultCon.style.display = "none"
  loadImg.style.display = "unset"

  body = {
    links: links
  }
  
  fetch("/api/1.0/marketPrice/greens", {
    method:"POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    loadImg.style.display = "none"
    marketResultCon.style.display = "unset"
    if(!result.error){
      return renderMarketPrice(result.data[0])
    }
    console.log(result)
  }).catch((error) => {
    // alert("系統錯誤")
  })
}

const tracePrice = () => {
  let accessToken = localStorage.getItem("accessToken")
  let greenTitle = getId("greenTitle")
  let wholesalePrice = getId("wholesalePrice")
  let retailPrice = getId("retailPrice")
  let trace = getId("trace")

  body = {
    title: greenTitle.innerText,
    wholesalePrice: wholesalePrice.innerText.split(" ")[0],
    retailPrice: retailPrice.innerText.split(" ")[0]
  }

  fetch("/api/1.0/marketPrice/trace", {
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
      let traceMsg = getId("traceMsg")
      trace.className = ""
      trace.style.backgroundColor = "grey"
      trace.value = "取消關注"
      traceMsg.innerText = "關注成功"
      traceMsg.className = ""
      traceMsg.offsetWidth
      traceMsg.className = "popGreen"
      trace.addEventListener("click", delTrace2)
      trace.removeEventListener("click", tracePrice)
      return
    } else if(result.error === "Duplicate") {
      traceMsg.innerText = "已在關注清單"
      traceMsg.className = ""
      traceMsg.offsetWidth
      traceMsg.className = "popRed"
      return
    } else if (result.error === "Exceed Max Count") {
      traceMsg.innerText = "已關注超過十筆菜價"
      traceMsg.className = ""
      traceMsg.offsetWidth
      traceMsg.className = "popRed"
    }
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })  

}

let sumArr = (arr, target) => {
  let ans = arr.map(x => {
    let y = target - x
    arr.indexOf(y) !== -1 ? arr.indexOf(x) : null
  })
  return new Set(ans)
}