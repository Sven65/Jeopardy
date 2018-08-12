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
			socket.emit("ADD_CATEGORY_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = await this._dbUtils.getBoardByID(data.boardID)

		if(boardData.rows.length <= 0){
			socket.emit("ADD_CATEGORY_ERROR", {"error": "Board Not Found"})
			return
		}

		if(boardData.rows[0].owner !== userData.ID){
			socket.emit("ADD_CATEGORY_ERROR", {"error": "Board does not belong to current user."})
			return
		}

		let categoryID = await this._dbUtils.addCategory("Category Title", 0, userData.ID)
		categoryID = categoryID.rows[0].id
		await this._dbUtils.addCategoryToBoard(data.boardID, categoryID)

		socket.emit("ADDED_CATEGORY", {timeStamp: Date.now(), id: categoryID, boardID: data.boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler