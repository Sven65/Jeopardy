const config = require("config")
const CryptoJS = require("crypto-js")
const crypto = require("crypto")

const EmailUtils = require(`${__dirname}/../util/EmailUtils`)

const Email = new EmailUtils()

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	_encrypt(str, salt){
		str = CryptoJS.SHA512(`${str} + ${config.get("Domain")} + ${salt}`)

		str = CryptoJS.enc.Base64.stringify(str)

		str = str.replace(/\=+$/, "")
		str = str.replace(/\+/g, "-")
		str = str.replace(/\//g, "_")

		str = str.trim()

		return str
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
		let userData = await this._dbUtils.getUserByToken(data.userToken)

		let setNewPassword = false
		let setNewEmail = false

		if(!this._isset(userData)){
			socket.emit("SAVE_USER_SETTINGS_ERROR", {error: "Invalid User"})
			return
		}

		if(!this._isset(data.currentPassword)){
			socket.emit("SAVE_USER_SETTINGS_ERROR", {error: "No Current Password Entered."})
			return
		}

		if(this._encrypt(data.currentPassword, userData.salt) !== userData.password){
			socket.emit("SAVE_USER_SETTINGS_ERROR", {error: "Invalid Current Password Entered"})
			return
		}


		if(this._isset(data.password) && this._isset(data.confirmPassword)){
			// Set password

			let salt = crypto.randomBytes(32).toString("hex")
			let password = this._encrypt(data.password, salt)

			await this._dbUtils.setUserLogin(userData.ID, password, salt)

			setNewPassword = true
		}

		if(this._isset(data.newEmail)){
			if(data.newEmail !== userData.email){

				let emailExists = await this._dbUtils.emailExists(data.newEmail)

				if(emailExists){
					socket.emit("SAVE_USER_SETTINGS_ERROR", {error: "Email Already Registered."})
					return
				}

				let verificationCode = this._getVerificationCode(userData.ID)

				await this._dbUtils.setUserEmail(userData.ID, data.newEmail)
				await this._dbUtils.setUserEmailVerified(userData.ID, false)
				await this._dbUtils.setUserEmailVerificationCode(userData.ID, verificationCode)

				await this._sendVerificationEmail(data.newEmail, userData.ID, userData.username, verificationCode)

				setNewEmail = true
			}
		}

		socket.emit("SAVED_USER_SETTINGS", {setNewEmail, setNewPassword})
	}
}

module.exports = SocketHandler