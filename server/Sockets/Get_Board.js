const GameUtils = require("../util/GameUtils")

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
		let boardData = await this._dbUtils.getBoardByID(data.boardID)

		if(boardData.rows.length <= 0){
			socket.emit("GET_BOARD_ERROR", {"error": "Board Not Found"})
			return
		}

		boardData = boardData.rows[0]

		let categoryData = []
		let clues = {}

		const start = async () => {
			await this.asyncForEach(boardData.categories, async (category) => {
				let categoryData = await this._dbUtils.getCategoryByID(category)

				if(clues[category] === undefined){
					clues[category] = []
				}

				let clueGet = await this._dbUtils.getCluesByCategoryID(category)

				if(clueGet.rows.length > 0){

					clueGet = clueGet.rows

					clueGet.forEach(clue => {
						clue.category = categoryData.rows[0]
					})

					clues[category] = clueGet					

					clues[category] = clues[category].slice(0, 5)

					//clues[category] = GameUtils.valueFixer(GameUtils.valueFixer(clues[category]))

					GameUtils.categoryUpperCase(clues[category])
					GameUtils.answerUnescape(clues[category])
				}
			})

			socket.emit("GOT_BOARD", {boardData, clues})
		}
		
		start()
	}
}

module.exports = SocketHandler