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
			socket.emit("DELETE_BOARD_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = await this._dbUtils.getBoardByID(data.boardID)

		if(boardData.rows.length <= 0){
			socket.emit("DELETE_BOARD_ERROR", {"error": "Board Not Found"})
			return
		}

		boardData = boardData.rows[0]

		if(boardData.owner !== userData.ID){
			socket.emit("DELETE_BOARD_ERROR", {"error": "Board does not belong to current user."})
			return
		}

		await this._dbUtils.deleteBoard(data.boardID)

		const start = async () => {
			await this.asyncForEach(boardData.categories, async (category) => {
				let clues = await this._dbUtils.getCluesByCategoryID(category)

				await this.asyncForEach(clues.rows, async (clue) => {
					await this._dbUtils.deleteClue(clue.ID)
				})

				await this._dbUtils.deleteCategory(category)
			})

			socket.emit("DELETED_BOARD", {timeStamp: Date.now(), id: data.boardID, userToken: data.userToken})
		}
		
		start()
	}
}

module.exports = SocketHandler