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
			socket.emit("DELETE_CLUE_ERROR", {error: `Invalid User!`})
			return
		}

		let clueData = await this._dbUtils.getClueData(data.clueID)

		if(clueData.rows.length <= 0){
			socket.emit("DELETE_CLUE_ERROR", {"error": "Clue Not Found"})
			return
		}

		clueData = clueData.rows[0]

		if(clueData.owner !== userData.ID){
			socket.emit("DELETE_CLUE_ERROR", {"error": "Clue does not belong to current user."})
			return
		}

		await this._dbUtils.deleteClue(data.clueID)

		socket.emit("DELETED_CLUE", {timeStamp: Date.now(), id: data.clueID, boardID: data.boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler