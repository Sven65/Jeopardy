const config = require("config")

Object.defineProperty(Array.prototype, "equals", {
	enumerable: false,
	writable: false,
	value: function(arr){
		if(this.length !== arr.length){
			return false
		}

		for(let i=this.length;i--;){
			if(this[i] !== arr[i]){
				return false
			}
		}

		return true
	}
})

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
			socket.emit("GET_VALID_USER_BOARDS_ERROR", {error: `Invalid User!`})
			return
		}

		let boardData = []
		let userBoards = await this._dbUtils.getBoardsByUserID(userData.ID)

		userBoards = userBoards.rows

		if(userBoards.length <= 0){
			socket.emit("GOT_VALID_USER_BOARDS", {boards: []})
			return
		}

		// Criteria check

		// Enough categories

		let validBoards = []

		let validCategoryBoards = userBoards.filter(board => {
			return board.categories.length >= 6
		})


		// Check clues
		const start = async () => {

			await this.asyncForEach(validCategoryBoards, async (board) => {
				let validCategoryAmount = 0
				await this.asyncForEach(board.categories, async categoryID => {
					let clues = await this._dbUtils.getCluesByCategoryID(categoryID)

					clues = clues.rows
					if(clues.length >= 5){
						// Enough clues

						let hasValues = []

						clues.forEach(clue => {
							hasValues.push(clue.value)

						})
						if(hasValues.sort().equals([200, 400, 600, 800, 1000].sort())){
							// Category has all values
							validCategoryAmount++

						}
					}
				})

				if(validCategoryAmount >= 6){
					validBoards.push(board)
				}
			})

			socket.emit("GOT_VALID_USER_BOARDS", {boards: validBoards, type: "2"})

		}
		
		await start()
	}
}

module.exports = SocketHandler