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
			socket.emit("USER_EDIT_ERROR", {error: `Invalid User!`})
			return
		}

		await this._dbUtils.setTheme(data.userToken, data.theme)

		socket.emit("USER_EDIT_SAVED", {timeStamp: Date.now()})
		socket.emit("CHANGE_THEME", {timeStamp: Date.now(), theme: data.theme})
	}
}

module.exports = SocketHandler