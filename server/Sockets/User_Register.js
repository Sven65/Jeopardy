const config = require("config")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const FlakeId63 = require('flake-idgen-63')

const flake = new FlakeId63()

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {} }){
		if(data.password !== data.cpassword){
			socket.emit("USER_REGISTER_ERROR", {reason: "Passwords don't match"})
			return
		}

		let usernameExists = await this._dbUtils.usernameExists(data.username)

		if(usernameExists){
			socket.emit("USER_REGISTER_ERROR", {reason: "Username Already Registered."})
			return
		}

		let emailExists = await this._dbUtils.emailExists(data.email)

		if(emailExists){
			socket.emit("USER_REGISTER_ERROR", {reason: "Email Already Registered."})
			return
		}

		data.salt = crypto.randomBytes(32).toString("hex")

		data.cpassword = ""

		data.password = CryptoJS.SHA512(`${data.password} + ${config.get("Domain")} + ${data.salt}`)

		data.password = CryptoJS.enc.Base64.stringify(data.password)

		data.password = data.password.replace(/\=+$/, "")
		data.password = data.password.replace(/\+/g, "-")
		data.password = data.password.replace(/\//g, "_")

		data.password = data.password.trim()

		let userToken = CryptoJS.enc.Utf8.parse('_' + Math.random().toString(36).substr(2, 9))

		data.token = CryptoJS.enc.Base64.stringify(userToken)

		data.userID = parseInt(flake.next().toString('hex'), 16).toString()

		data.image = `https://placehold.it/128x128?text=${data.username}`

		await this._dbUtils.registerUser(data)

		let emitData = {
			username: data.username,
			token: userToken
		}

		socket.emit("USER_REGISTERED", data)
	}
}

module.exports = SocketHandler