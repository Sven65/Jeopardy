const config = require("config")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}

	async Execute({socket = null, io = null, data = {} }){
		let userData = await this._dbUtils.getUserByToken(data.userToken)

		if(!this._isset(userData)){
			socket.emit("DELETE_CATEGORY_ERROR", {error: `Invalid User!`})
			return
		}

		let categoryData = await this._dbUtils.getCategoryByID(data.categoryID)

		if(categoryData.rows.length <= 0){
			socket.emit("DELETE_CATEGORY_ERROR", {"error": "Category Not Found"})
			return
		}

		categoryData = categoryData.rows[0]

		if(categoryData.owner !== userData.ID){
			socket.emit("DELETE_CATEGORY_ERROR", {"error": "Category does not belong to current user."})
			return
		}

		const start = async () => {
			let clues = await this._dbUtils.getCluesByCategoryID(data.categoryID)

			await this.asyncForEach(clues.rows, async (clue) => {
				await this._dbUtils.deleteClue(clue.ID)
			})

			await this._dbUtils.deleteCategory(data.categoryID)

			await this._dbUtils.removeCategoryFromBoard(data.categoryID, data.boardID)

			socket.emit("DELETED_CATEGORY", {timeStamp: Date.now(), id: data.categoryID, boardID: data.boardID, userToken: data.userToken})
		}
		
		start()

		
	}
}

module.exports = SocketHandler