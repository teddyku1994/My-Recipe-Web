window.fbAsyncInit = function() {
  FB.init({
    appId      : '393256091313777',
    cookie     : true,
    xfbml      : true,
    version    : 'v4.0'
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response){
  if(response.status === 'connected') {
    console.log('Logged in and authenticated');
    testAPI();
  } else {
    console.log('Not authenticated')
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);

    body = {
      provider: "facebook",
      accessToken: response.authResponse.accessToken
    }

    fetch("/api/1.0/user/signin", {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    }).then((result) => {
      return (result.json())
    }).then((result) => {
      if(result.accessToken) return fbSignin(result)
      console.log("Login Failed")
    }).catch((error) => {
      console.log(error)
    })

    const fbSignin = (data) => {
      let url = window.location.href
      localStorage.setItem("accessToken", data.accessToken);
      if(data.dp) localStorage.setItem("dp", data.dp)
      return window.location = url
  }

  });
}

function testAPI() {
  FB.api('/me?fields=name,email,picture.width(300).height(300)', function(response){
    if(response && !response.error){
    }
  });
}