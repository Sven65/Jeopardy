const config = require("config")

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
			socket.emit("SET_COLOR_ERROR", {error: `Invalid User!`})
			return
		}

		if(userData.unlockedColors.indexOf(data.color) <= -1){
			socket.emit("SET_COLOR_ERROR", {error: `You don't have that color unlocked.`})
			return
		}

		await this._dbUtils.setNameColor(data.userToken, data.color)

		socket.emit("USER_COLOR_SET", {timeStamp: Date.now(), color: data.color, userID: socket.id})
	}
}

module.exports = SocketHandler