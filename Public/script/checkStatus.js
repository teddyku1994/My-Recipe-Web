const checkStatus = () => {
  let accessToken = localStorage.getItem('accessToken')
  let signin = getId("signin")
  let signup = getId("signup")
  let mainNav = getId("mainNav")
  let profile = getId("profile")
  let profileDp = getId("profileDp")

  if(!accessToken) {
    return
  }
  
  fetch("/api/1.0/user/verify", {
    method:"POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  }).then((result) => {
    return (result.json())
  }).then((result) => {
    if(result.status === "Valid Token") {
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
  }).catch((error) => {
    console.log(error)
  })
}

const Profile = () => {
  window.location = "/profile.html"
}

checkStatus()