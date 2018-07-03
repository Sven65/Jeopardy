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

	async Execute({socket = null, io = null, data = {} }){
		let room = await this._dbUtils.getRoomByID(data.roomID)

		if(!this._isset(room)){
			return
		}

		if(data.force){
			room.questions = null
		}

		if(Object.keys(room.questions).length > 0 && !data.force){
			data.clues = room.questions.clues
			io.to(data.roomID).emit("ACTION_GOTQUESTIONS", data)
		}else{

			let categoryGet = await JS.getCategories(JS._categoryCount, Math.floor(Math.random() * JS._maxOffset) + JS._minOffset)
			let categories = categoryGet.body

			let clues = {}

			const start = async () => {
				await this.asyncForEach(categories, async (category) => {
					if(clues[category.id] === undefined){
						clues[category.id] = []
					}

					let clueGet = await JS.getClues(category.id)

					clues[category.id] = clueGet.body					

					clues[category.id] = clues[category.id].slice(0, 5)

					clues[category.id] = GameUtils.valueFixer(GameUtils.valueFixer(clues[category.id]))

					GameUtils.categoryUpperCase(clues[category.id])
					GameUtils.answerUnescape(clues[category.id])
				})

				data.clues = clues

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