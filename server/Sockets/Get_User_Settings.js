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
			socket.emit("GET_USER_SETTINGS_ERROR", {error: "Invalid User"})
			return
		}

		let returnData = {
			email: userData.email
		}

		socket.emit("GOT_USER_SETTINGS", returnData)
	}
}

module.exports = SocketHandler