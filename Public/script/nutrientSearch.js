// const nutSearchClick = () => {
//   let keyword = nutSearch.value
//   let flipped = document.getElementsByClassName("flipped")[0]
//   let body = {
//     keyword: keyword
//   }
//   ajax("POST", "/api/1.0/nutrient/list", body, null, (result) => {
//     renderList(result.data[0].names)
//     if(flipped) toggleFlip()
//   })

//   let renderList = (response) => {
//     let nutList = getId("nutList")
//     nutList.innerHTML = ""
//     nutList.style.display = "flex"
//     createElement("div", {atrs: {
//         className: "nutListTitle",
//         innerText: "搜尋結果"
//       }}, nutList)
//     createElement("div", {atrs: {
//       className: "nutInstruc",
//       innerText: "請點擊清單中的項目"
//     }}, nutList)
//     if(response.length > 0 ) {
//       createElement("ul", {atrs: {
//         id: "nutListUL"
//       }}, nutList)
//       let nutListUL = getId("nutListUL")
//       response.map((item) => {
//         createElement("li", {
//           atrs: {
//           className: "nutListLI",
//           innerText: item
//           },
//           evts: {
//             click: nutDetail
//           }
//         }, nutListUL)
//       })
//     } else {
//       createElement("div", {atrs: {
//         className: "noInfo",
//         innerText: "Sorry~ Try Again...",
//       }}, nutList)
//     }
//   }
// }

// const nutDetail = (event) => {
//   let nutName = event.target.innerText

//   let body = {
//     nutName: nutName
//   }

//   ajax("POST", "/api/1.0/nutrient/name", body, null, (result) => {
//     nutInfo(result.data[0])
//     toggleFlip()
//     nutCard.removeEventListener("click",toggleFlip)
//     nutCard.addEventListener("click", toggleFlip)
//   })

//   const nutInfo = (res) => {
//       nutCard.style.display = "flex"
//       let calories = document.getElementsByClassName("calories")[0]
//       let nutTitle = document.getElementsByClassName("nutTitle")[0]

//       let arr = [res.calories+"大卡", res.protein+"公克", res.totalFat+"公克", res.saturatedFat+"公克", res.carbohydrate+"公克", res.dietaryFiber+"公克", res.sugar+"公克"]

//       let arr2 = ["calories", "protein", "totalFat", "satFat", "carbonhydrate", "dietFiber", "sugar"]

//       let arr3 = [res.vitE+"毫克", res.vitB2+"毫克", res.vitC+"毫克", res.calcium+"毫克"]

//       let arr4 = ["vitE", "vitB2", "vitC", "cal"]

//       if(calories){
//         removechild(".calories")
//         removechild(".protein")
//         removechild(".totalFat")
//         removechild(".satFat")
//         removechild(".carbonhydrate")
//         removechild(".dietFiber")
//         removechild(".sugar")
//         removechild(".sodium")
//         removechild(".vitE")
//         removechild(".vitB2")
//         removechild(".vitC")
//         removechild(".cal")
//       }
      
//       nutTitle.innerText = res.name
//       if(res.name.length > 11) {
//         nutTitle.style.fontSize = "18px"
//       } else {
//         nutTitle.style.fontSize = "25px"
//       }
//       for (let i =0; i<arr.length; i++){
//         createElement("div", {atrs: {
//           innerText: arr[i],
//           className: arr2[i]
//         }}, info[i])
//         createElement("div", {atrs: {
//           innerText: arr3[i],
//           className: arr4[i]
//         }}, infos[i])
//       }
//       createElement("div", {atrs: {
//         innerText: res.sodium+"毫克",
//         className: "sodium"
//       }}, calInfo[0])
//     }
// }

// const toggleFlip = () => {
//   let nutflipCard = document.getElementsByClassName("nutflipCard")[0]
//   nutflipCard.classList.toggle("flipped")
// }

// nutSearch.addEventListener("keyup", (event) => {
//   if (event.keyCode === 13){
//     nutSearchClick() 
//   }
// })

