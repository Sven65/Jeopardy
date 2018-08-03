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
			socket.emit("SAVE_CLUE_ERROR", {error: `Invalid User!`})
			return
		}

		let clueData = await this._dbUtils.getClueData(data.clueID)

		if(clueData.rows.length <= 0){
			socket.emit("SAVE_CLUE_ERROR", {"error": "Clue Not Found"})
			return
		}

		if(clueData.rows[0].owner !== userData.ID){
			socket.emit("SAVE_CLUE_ERROR", {"error": "Clue does not belong to current user."})
			return
		}

		await this._dbUtils.editClue(data.clueID, data.answer, data.question, data.value)

		socket.emit("SAVED_CLUE", {timeStamp: Date.now(), boardID: data.boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler