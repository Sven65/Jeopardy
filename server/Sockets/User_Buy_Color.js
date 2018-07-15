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
			socket.emit("BUY_COLOR_ERROR", {error: `Invalid User!`})
			return
		}

		if(userData.balance < config.get("Game.colorCost")){
			socket.emit("BUY_COLOR_ERROR", {error: `You don't have enough money for this.`})
			return
		}

		await this._dbUtils.addUnlockedColor(data.userToken, data.color)
		await this._dbUtils.removeBalance(data.userToken, config.get("Game.colorCost"))

		socket.emit("BOUGHT_COLOR", {timeStamp: Date.now(), color: data.color, newBalance: userData.balance-config.get("Game.colorCost")})
	}
}

module.exports = SocketHandler