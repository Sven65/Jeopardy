class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {} }){
		let userData = await this._dbUtils.getUserByToken(data.token)

		if(!this._isset(userData)){
			return
		}

		let returnData = {
			username: userData.username,
			token: data.token,
			wins: userData.wins||0,
			losses: userData.losses||0,
			image: this._isset(userData.imageID)?`images/${userData.imageID}`:`https://placehold.it/128x128?text=${data.username}`,
			emailVerified: userData.isVerified,
			balance: userData.balance||0,
			theme: userData.theme||"light"
		}

		socket.emit("USER_LOGGED_IN", returnData)
	}
}

module.exports = SocketHandler