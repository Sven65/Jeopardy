const config = require("config")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const FlakeId63 = require('flake-idgen-63')

const EmailUtils = require(`${__dirname}/../util/EmailUtils`)

const Email = new EmailUtils()
const flake = new FlakeId63()

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async _sendVerificationEmail(to, userID, username, verificationCode){
		let verificationLink = `${config.get('Email.Options.verifyDomain')}/user/${userID}/verify/${verificationCode}`

		return await Email.sendEmail({
			to,
			subject: "Please Verify Your Email For TriviaParty!",
			template: "ValidationEmail",
			context: {
				username,
				account: to,
				verificationLink,
				assetURL: config.get('Email.Options.assetURL')
			}
		})
	}

	_getVerificationCode(userID){
		const crc32 = (function() {
			let c, crcTable = []; // generate crc table

			for (let n = 0; n < 256; n++) {
				c = n;

				for (let k = 0; k < 8; k++) {
					c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
				}

				crcTable[n] = c;
			}

			return function(str) {
				let crc = 0 ^ (-1); // calculate actual crc

				for (let i = 0; i < str.length; i++) {
					crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
				}

				return (crc ^ (-1)) >>> 0;
			}
		})();

		let crcPattern = "00000000"

		let nextCode = crc32(userID.toString() + Date.now().toString()).toString(16).toUpperCase();
		nextCode = crcPattern.substr(0, crcPattern.length - nextCode.length) + nextCode;

		return nextCode
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

		data.verificationCode = this._getVerificationCode(data.userID)

		await this._dbUtils.registerUser(data)

		await this._sendVerificationEmail(data.email, data.userID, data.username, data.verificationCode)

		let emitData = {
			username: data.username,
			token: userToken
		}

		socket.emit("USER_REGISTERED", data)
	}
}

module.exports = SocketHandler