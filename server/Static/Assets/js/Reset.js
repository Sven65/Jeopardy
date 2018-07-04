if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
	for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value == "function" ? ()=>{} : null;
	}
}

document.querySelector("input[name=userID]").value = document.URL.split("/")[4]
document.querySelector("input[name=verificationCode]").value = document.URL.split("/")[6]


function verifyCallback(){
	document.querySelector("#form-error").innerHTML = ""
	document.querySelector('.g-recaptcha div div').style.border = ''
	document.querySelector('.g-recaptcha div div').style.height = ''
}

document.querySelector("#submit-button").addEventListener("click", e => {
	e.preventDefault()

	let captchaResponse = grecaptcha.getResponse()

	if(captchaResponse === ""){
		document.querySelector("#form-error").innerHTML = "Why, hello there, Mr. Robot."
		document.querySelector('.g-recaptcha div div').style.border = '1px solid red'
		document.querySelector('.g-recaptcha div div').style.height = 'inherit'
		return
	}

	let password = document.querySelector("input[name=newPass]").value
	let cpassword = document.querySelector("input[name=newPassConfirm]").value

	if(password !== cpassword){
		document.querySelector("#form-error").innerHTML = "Passwords don't match."
		return
	}

	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/user/verify/password');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			let response = JSON.parse(xhr.responseText)

			document.querySelector("#loader-holder").classList.add("hidden")

			if(response.success){
				document.querySelector("#header").innerHTML = "Password reset! You may now close this page."
				document.querySelector("#submit-button").disabled = true
			}else{
				document.querySelector("#form-error").innerHTML = response.error
			}

		}
	};
	xhr.send(JSON.stringify({
		userID: document.querySelector("input[name=userID]").value,
		verificationCode: document.querySelector("input[name=verificationCode]").value,
		captchaResponse: captchaResponse,
		password,
		cpassword
	}));

	document.querySelector("#loader-holder").classList.remove("hidden")
})