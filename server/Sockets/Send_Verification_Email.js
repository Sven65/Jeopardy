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
		let userData = await this._dbUtils.getUserByToken(data.token)

		let verificationCode = this._getVerificationCode(userData.ID)
	
		await this._dbUtils.setUserEmailVerificationCode(userData.ID, verificationCode)

		await this._sendVerificationEmail(userData.email, userData.ID, userData.username, verificationCode)

		socket.emit("SENT_VERIFICATION_EMAIL", {timeStamp: Date.now()})
	}
}

module.exports = SocketHandler