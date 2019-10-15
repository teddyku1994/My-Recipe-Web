const hots = async () => {
  let con2 = getId('con2')
  let numArr = [0,1,2,3,4,5,6,7,8,9,10,11]
  
  let shuffle = (arr, numbers) => {
    let num = arr.slice()
    let newArr = []
    for (let i = 0; i < numbers; i++) {
      let randomNum = Math.floor(Math.random() * num.length-1)
      newArr.push(num.splice(randomNum,1))
    }
    return newArr.reduce((a,b) => a.concat(b))
  }

  let render = (response) => {
    let randomNum = shuffle(numArr, 8)
    for(let i = 0; i < 8; i++) {
      createElement("div", {atrs: {
        className: "hotsDish"
      }}, con2)
      let hotsDish = document.getElementsByClassName("hotsDish")[i]
      createElement("a", {atrs: {
        href: `/recipe.html?id=${response.data[[randomNum[i]]].id}`,
        className: "hotLink"
      }}, hotsDish)
      let hotLink = document.getElementsByClassName("hotLink")[i]
      createElement("img", {atrs: {
        src: response.data[[randomNum[i]]].image,
        alt: "Dish Image"
      }}, hotLink)
    }
    createElement("div", {atrs: {
      className: "hotsBanner"
    }}, con2)
  }

  let hotRecipes = await fetching("/recipe/hots", "GET", {"Content-Type": "application/json",}, null)

  !hotRecipes.error ? render(hotRecipes) : console.log("hotRecipes render failed")
}

const recipeSearch3 = () => {
  let dishName = getId("search_txt").value
  if(!dishName) return
  window.location = `/searchList.html?dishName=${dishName}&page=0`
}

if(search_txt) {
  search_txt.addEventListener("keyup", (event) => {
    if (event.keyCode === 13){
      recipeSearch3()
    }
  })
}

let controller = new ScrollMagic.Controller();
let scene = new ScrollMagic.Scene({
  triggerElement: '.search_boxTitle'
})
.setClassToggle('.search_boxTitle', 'show')
.addTo(controller);

hots()