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
			socket.emit("GET_BOARDS_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = await this._dbUtils.getBoardsByUserID(userData.ID)

		socket.emit("GOT_BOARDS", {boards: boardData.rows, maxBoards: userData.isPremium?config.get("Game.maxCustomBoardsPremium"):config.get("Game.maxCustomBoards")})
	}
}

module.exports = SocketHandler
