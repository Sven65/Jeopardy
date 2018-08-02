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
			socket.emit("DELETE_CATEGORY_ERROR", {error: `Invalid User!`})
			return
		}

		let categoryData = await this._dbUtils.getCategoryByID(data.boardID)

		if(categoryData.rows.length <= 0){
			socket.emit("DELETE_CATEGORY_ERROR", {"error": "Category Not Found"})
			return
		}

		categoryData = categoryData.rows[0]

		if(categoryData.owner !== userData.ID){
			socket.emit("DELETE_CATEGORY_ERROR", {"error": "Category does not belong to current user."})
			return
		}

		await this._dbUtils.deleteBoard(data.boardID)

		socket.emit("DELETED_CATEGORY", {timeStamp: Date.now(), id: data.boardID, userToken: data.userToken})
	}
}

module.exports = SocketHandler