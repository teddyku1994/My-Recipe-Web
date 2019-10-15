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
		return err
	}
}

const removechild = (child) => {
	let removed = document.querySelector(child)
	removed.parentNode.removeChild(removed)
}

const verifyStatus = async () => {
	let accessToken = localStorage.getItem('accessToken')
	let tokenStatus = await fetching("/user/verify", "POST", {
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`
	}, null)
	return tokenStatus
}

const doubleCheckStatus = async () => {
	try {
		let status = await verifyStatus()
		if(!status.status === "Valid Token") {
			alert("請重新登入，謝謝")
			window.location = "/index.html"
			return 
		}
	} catch (err) {
		window.location = "/index.html"
	}
	
}