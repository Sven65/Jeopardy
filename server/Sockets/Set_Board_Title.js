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
			socket.emit("SET_BOARD_TITLE_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = await this._dbUtils.getBoardByID(data.boardID)

		if(boardData.rows.length <= 0){
			socket.emit("SET_BOARD_TITLE_ERROR", {"error": "Board Not Found"})
			return
		}

		if(boardData.rows[0].owner !== userData.ID){
			socket.emit("SET_BOARD_TITLE_ERROR", {"error": "Board does not belong to current user."})
			return
		}

		await this._dbUtils.setBoardTitle(data.boardID, data.title)

		socket.emit("BOARD_TITLE_EDIT_SAVED", {timeStamp: Date.now()})
	}
}

module.exports = SocketHandler