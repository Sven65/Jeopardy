const sharp = require('sharp')

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {} }){
		let userData = await this._dbUtils.getUserByToken(data.userToken)

		if(!this._isset(userData)){
			return // Return socket emit of issue
		}

		let fileName = data.fileData.name

		let imageID = `${userData.ID}.webp`

		sharp(data.file).toFile(`dist/images/${imageID}`)

		await this._dbUtils.setUserImage(data.userToken, imageID)

		socket.emit("USER_EDIT_SAVED", {timeStamp: Date.now()})
	}
}

module.exports = SocketHandler