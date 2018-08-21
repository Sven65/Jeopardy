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
			socket.emit("SET_TITLE_ERROR", {error: `Invalid User!`})
			return
		}

		let categoryData = await this._dbUtils.getCategoryByID(data.categoryID)

		if(categoryData.rows.length <= 0){
			socket.emit("SET_TITLE_ERROR", {"error": "Category Not Found"})
			return
		}

		if(categoryData.rows[0].owner !== userData.ID){
			socket.emit("SET_TITLE_ERROR", {"error": "Category does not belong to current user."})
			return
		}

		await this._dbUtils.setCategoryTitle(data.categoryID, data.title)

		socket.emit("TITLE_EDIT_SAVED", {timeStamp: Date.now()})
	}
}

module.exports = SocketHandler