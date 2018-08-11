const FuzzyMatching = require('fuzzy-matching')
const config = require("config")

const GameUtils = require("../util/GameUtils")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils

		this._questionAmount = config.get("Game.questionAmount")
		this._distanceThreshold = config.get("Game.distanceThreshold")
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

	async Execute({socket = null, io = null, data = {}, roomTimers = {}}){
		let emitChat = true

		let room = await this._dbUtils.getRoomByID(data.roomID)

		if(!this._isset(room)){
			return
		}

		data.message = data.message.sanitizeHTML()

		if(data.message.length <= 0){
			return
		}

		if(!room.checkUserIDInRoom(data.user.userID)){
			return
		}

		let user = room.getUserByID(data.user.userID)

		if(!this._isset(user)){
			return
		}

		if(room.isStarted && user.isTurn && this._isset(room.currentQuestion)){
			let answers = GameUtils.answerResolver(room.currentQuestion.answer.toLowerCase())

			let fm = new FuzzyMatching(answers)

			if(fm.get(data.message.toLowerCase()).distance >= this._distanceThreshold){

				if(this._isset(roomTimers[data.roomID])){
					clearTimeout(roomTimers[data.roomID])
					clearInterval(roomTimers[data.roomID])

					delete roomTimers[data.roomID]
				}

				emitChat = false
				this._sendSystemMessage(io, data.roomID, `User **${user.username}** got it right! The answer was **${room.currentQuestion.answer}**`)

				let turnData = await room.changeTurn(user)

				//user.balance += room.currentQuestion.value

				await room.addUserBalance(user.userID, room.currentQuestion.value)

				io.to(data.roomID).emit("ANSWER_TIME_LEFT", {
					user,
					timeLeft: 0
				})

				io.to(data.roomID).emit('GAME_EVENT_ANSWERED', {
					user: user,
					clue: room.currentQuestion,
					newBalance: user.balance
				})

				await room.setCurrentQuestion(null)


				if(room.checkQuestionsLeft(this._questionAmount) <= 0){
					await room.setGameOver(true)

					let standings = room.users.sort((a, b) => {
						return b.balance - a.balance
					})

					const start = async () => {
						await this.asyncForEach(standings, async (user) => {
							if(user.isRegistered){
								await this._dbUtils.addPlayedGames(user.token, 1)
								await this._dbUtils.addLosses(user.token, 1)

								await this._dbUtils.addBalance(user.token, user.balance)
							}
						})
					}
					
					start()

					if(standings[0].isRegistered){
						await this._dbUtils.addWins(standings[0].token, 1)
						await this._dbUtils.addLosses(standings[0].token, -1)
					}

					io.to(data.roomID).emit("GAME_OVER", {
						standings
					})
				}else{
					io.to(data.roomID).emit("CHANGE_TURN", {
						oldTurn: user.userID,
						newTurn: room.users[turnData.newTurnIndex].userID,
						ID: 1
					})
				}
			}
		}

		if(emitChat){
			io.to(data.roomID).emit('EVENT_CHAT', data)
		}
	}
}

module.exports = SocketHandler