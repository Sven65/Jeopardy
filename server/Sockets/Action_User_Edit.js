const config = require("config")
const sharp = require('sharp')

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils

		this._maxAvatarSize = config.get("Upload.maxAvatarSize")

		this._acceptedMimes = [
			"image/jpeg",
			"image/png"
		]
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	formatBytes(bytes,decimals){
		if(bytes === 0){
			return '0 Bytes'
		}

		let k = 1024
		let dm = decimals || 2
		let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		let i = Math.floor(Math.log(bytes) / Math.log(k))

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
	}

	async Execute({socket = null, io = null, data = {} }){
		let userData = await this._dbUtils.getUserByToken(data.userToken)

		if(!this._isset(userData)){
			socket.emit("USER_EDIT_ERROR", {error: `Invalid User!`})
			return
		}

		if(this._acceptedMimes.indexOf(data.fileData.type) <= -1){
			socket.emit("USER_EDIT_ERROR", {error: `Invalid file type!`})
			return
		}

		if(data.fileData.size > this._maxAvatarSize){
			socket.emit("USER_EDIT_ERROR", {error: `File size too large! Maximum is ${this.formatBytes(this._maxAvatarSize)}`})
			return
		}

		let fileName = data.fileData.name

		let imageID = `${userData.ID}.webp`

		sharp(data.file).toFile(`dist/images/${imageID}`)

		await this._dbUtils.setUserImage(data.userToken, imageID)

		socket.emit("USER_EDIT_SAVED", {timeStamp: Date.now()})
	}
}

module.exports = SocketHandler