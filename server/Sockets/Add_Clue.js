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
			socket.emit("ADD_CLUE_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = await this._dbUtils.getBoardByID(data.boardID)

		if(boardData.rows.length <= 0){
			socket.emit("ADD_CLUE_ERROR", {"error": "Board Not Found"})
			return
		}

		if(boardData.rows[0].owner !== userData.ID){
			socket.emit("ADD_CLUE_ERROR", {"error": "Board does not belong to current user."})
			return
		}

		let categoryID = await this._dbUtils.addClue(data.answer, data.question, data.value, data.categoryID, userData.ID)

		socket.emit("ADDED_CLUE", {timeStamp: Date.now(), boardID: data.boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler