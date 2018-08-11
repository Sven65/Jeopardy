const JService = require('../util/JService')
const GameUtils = require("../util/GameUtils")

const JS = new JService()

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	_sendSystemMessage(io, roomID, message){
		io.to(roomID).emit('EVENT_CHAT', {
			message: message,
			user: {
				username: "SYSTEM",
				userID: "SYSTEM"
			},
			timeStamp: Date.now()
		})
	}

	async asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}

	async _getJServiceCategories(){
		let categoryGet = await JS.getCategories(JS._categoryCount, Math.floor(Math.random() * JS._maxOffset) + JS._minOffset)
		let categories = categoryGet.body
		
		return categories
	}

	async _getBoardData(boardID){
		if(boardID === "default"){
			return {
				title: "Default",
				id: "default",
				type: "standard"
			}
		}else{
			let boardData = await this._dbUtils.getBoardByID(boardID)

			boardData = boardData.rows[0]

			boardData.type = "custom"

			return boardData
		}
	}

	async Execute({socket = null, io = null, data = {} }){
		let room = await this._dbUtils.getRoomByID(data.roomID)
		let boardID = data.boardID

		if(!this._isset(room)){
			return
		}

		if(data.force){
			room.questions = null
		}

		if(Object.keys(room.questions).length > 0 && !data.force){
			data.clues = room.questions.clues
			data.boardData = await this._getBoardData(room.boardID)
			io.to(data.roomID).emit("ACTION_GOTQUESTIONS", data)
		}else{

			let categories = ""

			if(boardID === "default"){
				categories = await this._getJServiceCategories()
			}else{
				let boardData = await this._dbUtils.getBoardByID(boardID)

				if(boardData.rows.length <= 0){
					categories = await this._getJServiceCategories()
				}else{
					boardData = boardData.rows[0]

					data.boardData = boardData
					data.boardData.type = "custom"

					categories = boardData.categories.map(categoryID => {
						return {id: categoryID}
					})
				}
			}

			if(!this._isset(data.boardData)){
				data.boardData = {
					title: "Default",
					id: "default",
					type: "standard"
				}
			}

			let clues = {}

			const start = async () => {
				await this.asyncForEach(categories, async (category) => {
					if(clues[category.id] === undefined){
						clues[category.id] = []
					}

					let clueGet = {}

					if(boardID === "default"){
						clueGet = await JS.getClues(category.id)
					}else{
						let categoryData = await this._dbUtils.getCategoryByID(category.id)
						let clueBody = await this._dbUtils.getCluesByCategoryID(category.id)

						clueBody.rows.forEach(clue => {
							clue.category = categoryData.rows[0]
						})

						clueGet = {
							body: clueBody.rows
						}
					}

					clues[category.id] = clueGet.body					

					clues[category.id] = clues[category.id].slice(0, 5)

					clues[category.id] = GameUtils.valueFixer(GameUtils.valueFixer(clues[category.id]))

					GameUtils.categoryUpperCase(clues[category.id])
					GameUtils.answerUnescape(clues[category.id])
				})

				data.clues = clues
				data.boardID = boardID

				console.log("DATA", data)

				io.to(data.roomID).emit("ACTION_GOTQUESTIONS", data)

				if(!this._isset(room.questions)){
					room.questions = {}
				}

				await room.setQuestions({
					loaded: true,
					clues
				})
			}
			
			start()
		}
	}
}

module.exports = SocketHandler