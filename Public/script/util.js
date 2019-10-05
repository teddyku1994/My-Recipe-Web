const getId = selector => document.getElementById(selector)
const getClass = selector => document.getElementsByClassName(selector)

const createElement = (tagName,settings,parentElement) => {
	let obj=document.createElement(tagName)
	if(settings.atrs){setAttributes(obj,settings.atrs)}
	if(settings.stys){setStyles(obj,settings.stys)}
	if(settings.evts){setEventHandlers(obj,settings.evts)}
	if(parentElement instanceof Element){parentElement.appendChild(obj)}
	return obj;
}

const setStyles = (obj,styles) => {
	for(let name in styles){
		obj.style[name]=styles[name];
	}
	return obj;
}

const setAttributes = (obj,attributes) => {
	for(let name in attributes){
		obj[name]=attributes[name]
	}
	return obj
}

const setEventHandlers = (obj,eventHandlers,useCapture) => {
	for(let name in eventHandlers){
		if(eventHandlers[name] instanceof Array){
			for(let i=0;i<eventHandlers[name].length;i++){
				obj.addEventListener(name,eventHandlers[name][i],useCapture)
			}
		}else{
			obj.addEventListener(name,eventHandlers[name],useCapture)
		}
	}
	return obj
}

const fetching = async (src, method, headers, body) =>{
	try {
		let options
		if(method.toUpperCase === "GET") {
			headers ?
			options = {
				method:method,
				headers: headers,
			}
			: options = {
				method:method,
			}
		} else {
			headers ?
			options = {
				method:method,
				headers: headers,
				body: body
			}
			: options = {
				method:method,
				body: body
			}
		}
		let response = await fetch(`/api/1.0${src}`, options)
		let result = await response.json()
		return result
	} catch (err) {
		console.log(err)
		return err
	}
}

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
		xhr.open(method, src+"?"+args);
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
// const verifyAcc = () => {
// 	let accessToken = localStorage.getItem('accessToken')
// 	if (!accessToken) return window.location = "/index.html"
// 	fetch("/api/1.0/user/verify", {
//     method:"POST",
//     headers: {
//       "Accept": "application/json",
//       "Authorization": `Bearer ${accessToken}`
//     }
//   }).then((result) => {
//     return (result.json())
//   }).then((result) => {
//     if(result.status === "Valid Token") {
//       console.log('here')
//       signin.style.display = "none"
//       signup.style.display = "none"
//       mainNav.style.margin = "1em 0"
//       profile.style.display = "unset"
//     } else {
//   		window.location = "/index.html"
//     }
//   }).catch((error) => {
//     console.log(error)
//     // alert("系統錯誤")
//   })
// }

const verifyStatus = async () => {
	let accessToken = localStorage.getItem('accessToken')
	let tokenStatus = await fetching("/user/verify", "POST", {
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`
	}, null)
	return tokenStatus
}