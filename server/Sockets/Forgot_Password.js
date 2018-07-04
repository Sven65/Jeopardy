const config = require("config")
const EmailUtils = require(`${__dirname}/../util/EmailUtils`)

const Email = new EmailUtils()

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async _sendResetEmail(to, userID, username, verificationCode){
		let verificationLink = `${config.get('Email.Options.verifyDomain')}/user/${userID}/reset/${verificationCode}`

		return await Email.sendEmail({
			to,
			subject: "Reset your TriviaParty password",
			template: "PasswordReset",
			context: {
				username,
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
		let emailExists = await this._dbUtils.emailExists(data.email)

		if(!emailExists){
			socket.emit("PASSWORD_RESET_ERROR", {reason: "Email not found."})
			return
		}

		let userData = await this._dbUtils.getUserByEmail(data.email)

		let verificationCode = this._getVerificationCode(data.email)
		
		await this._dbUtils.setPasswordResetToken(userData.ID, verificationCode)
		await this._sendResetEmail(userData.email, userData.ID, userData.username, verificationCode)

		socket.emit("SENT_FORGOT_PASSWORD_EMAIL", {
			timeStamp: Date.now()
		})
	}
}

module.exports = SocketHandler