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
			socket.emit("CREATE_BOARD_ERROR", {error: `Invalid User!`})
			return
		}

		let boardCount = await this._dbUtils.getUserBoardCount(userData.ID)

		boardCount = boardCount.rows[0].count

		let maxBoards = userData.isPremium?config.get("Game.maxCustomBoardsPremium"):config.get("Game.maxCustomBoards")

		if(boardCount >= maxBoards){
			socket.emit("CREATE_BOARD_ERROR", {error: `Maximum amount of custom boards reached!`})
			return
		}

		let boardID = Date.now().toString(36)
		
		await this._dbUtils.addBoard(boardID, userData.ID, [], "Board Name")

		socket.emit("CREATED_BOARD", {timeStamp: Date.now(), id: boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler