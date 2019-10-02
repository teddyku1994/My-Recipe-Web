const getId = selector => document.getElementById(selector)
const getClass = selector => document.getElementsByClassName(selector)

const createElement = (tagName,settings,parentElement) => {
	let obj=document.createElement(tagName);
	if(settings.atrs){setAttributes(obj,settings.atrs);}
	if(settings.stys){setStyles(obj,settings.stys);}
	if(settings.evts){setEventHandlers(obj,settings.evts);}
	if(parentElement instanceof Element){parentElement.appendChild(obj);}
	return obj;
};

const setStyles = (obj,styles) => {
	for(let name in styles){
		obj.style[name]=styles[name];
	}
	return obj;
};

const setAttributes = (obj,attributes) => {
	for(let name in attributes){
		obj[name]=attributes[name];
	}
	return obj;
};

const setEventHandlers = (obj,eventHandlers,useCapture) => {
	for(let name in eventHandlers){
		if(eventHandlers[name] instanceof Array){
			for(let i=0;i<eventHandlers[name].length;i++){
				obj.addEventListener(name,eventHandlers[name][i],useCapture);
			}
		}else{
			obj.addEventListener(name,eventHandlers[name],useCapture);
		}
	}
	return obj;
};

const ajax = (method, src, args, headers, callback) => {
	let xhr=new XMLHttpRequest();
	if(method.toLowerCase()==="post"){
		xhr.open(method, src);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = () => {
			console.log(xhr.response)
			callback(JSON.parse(xhr.response));
		};
		xhr.send(JSON.stringify(args));
	}else{ 
		console.log("get")
		xhr.open(method, src+"?"+args);
		// xhr.setRequestHeader(xhr, headers);
		xhr.onload = () => {
			callback(xhr.response);
		};
		xhr.send();
	}
};

const removechild = (child) => {
	let removed = document.querySelector(child)
	removed.parentNode.removeChild(removed)
}

//Profile
const verifyAcc = () => {
	let accessToken = localStorage.getItem('accessToken')
	if (!accessToken) return window.location = "/index.html"
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
      console.log('here')
      signin.style.display = "none"
      signup.style.display = "none"
      mainNav.style.margin = "1em 0"
      profile.style.display = "unset"
    } else {
  		window.location = "/index.html"
    }
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const Market = () => {
	let accessToken = localStorage.getItem('accessToken')
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
      window.location = "/marketPlace.html"
    } else {
			let recipeMsg = getId("recipeMsg")
			recipeMsg.style.left  = "28%"
			recipeMsg.innerText = "此功能為用戶功能，請先註冊/登入，謝謝"
			recipeMsg.className = ""
			recipeMsg.offsetWidth
			recipeMsg.className = "requireAcc"
			window.localStorage.clear()
			return
    }
  }).catch((error) => {
    console.log(error)
    // alert("系統錯誤")
  })
}

const fetching = async (src, method, headers, body) =>{
	try {
		let options
		headers ?
		options = {
			method:method,
			headers: headers,
			body: JSON.stringify(body)
		}
		: options = {
			method:method,
			body: JSON.stringify(body)
		}
		let response = await fetch(`/api/1.0${src}`, options)
		let result = await response.json()
		return result
	} catch (err) {
		console.log(err)
		return err
	}
}