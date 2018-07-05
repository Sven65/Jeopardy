const config = require("config")
const CryptoJS = require("crypto-js")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {} }){
		let usernameExists = await this._dbUtils.usernameExists(data.username)

		if(!usernameExists){
			socket.emit("USER_LOGIN_ERROR", {reason: "Username and Password doesn't match."})
			return
		}

		let userData = await this._dbUtils.getUserByName(data.username)

		data.password = CryptoJS.SHA512(`${data.password} + ${config.get("Domain")} + ${userData.salt}`)

		data.password = CryptoJS.enc.Base64.stringify(data.password)

		data.password = data.password.replace(/\=+$/, "")
		data.password = data.password.replace(/\+/g, "-")
		data.password = data.password.replace(/\//g, "_")

		data.password = data.password.trim()

		if(userData.password !== data.password){
			socket.emit("USER_LOGIN_ERROR", {reason: "Username and Password doesn't match."})
			return
		}else{
			socket.emit("USER_LOGGED_IN", {
				username: data.username,
				token: userData.token,
				wins: userData.wins||0,
				losses: userData.losses||0,
				balance: userData.balance||0,
				image: this._isset(userData.imageID)?`images/${userData.imageID}`:`https://placehold.it/128x128?text=${data.username}`,
				emailVerified: userData.isVerified
			})
		}
	}
}

module.exports = SocketHandler