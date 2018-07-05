const config = require("config")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils

		this._minPlayers = config.get("Game.minPlayers")
		this._questionAmount = config.get("Game.questionAmount")
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
		let room = await this._dbUtils.getRoomByID(data.roomID)

		if(!this._isset(room)){
			return
		}

		if(room.gameOver){
			return
		}

		let user = room.getUserByID(data.userID)

		if(!this._isset(user)){
			return
		}

		if(!user.isTurn || !room.isStarted){
			return
		}

		if(this._isset(room.currentQuestion)){
			return
		}

		if(!this._isset(room.questions.clues[data.categoryID])){
			return
		}

		let clueData = room.getClueData(data.categoryID, parseInt(data.clueID))

		if(!this._isset(clueData)){
			return
		}

		if(clueData.revealed){
			return
		}

		data.questionData = clueData

		await room.setClueRevealed(data.categoryID, parseInt(data.clueID))

		await room.setCurrentQuestion(clueData)

		let cTimeLeft = config.get("Game.timers.answerTime.beforeCountdown")+config.get("Game.timers.answerTime.countdown")

		roomTimers[data.roomID] = setInterval(async () => {
			if(cTimeLeft > config.get("Game.timers.answerTime.countdown")){
				io.to(data.roomID).emit("ANSWER_TIME_LEFT", {
					user,
					timeLeft: cTimeLeft
				})
				cTimeLeft--
			}
		}, 1000)

		roomTimers[data.roomID] = setTimeout(() => {
			clearTimeout(roomTimers[data.roomID])

			let timeLeft = config.get("Game.timers.answerTime.countdown")

			roomTimers[data.roomID] = setInterval(async () => {
				if(timeLeft > 0){
					this._sendSystemMessage(io, data.roomID, `User **${user.username}** has **${timeLeft}** seconds to answer`)
					io.to(data.roomID).emit("ANSWER_TIME_LEFT", {
						user,
						timeLeft
					})
					timeLeft--
					return
				}

				clearInterval(roomTimers[data.roomID])

				
				this._sendSystemMessage(io, data.roomID, `User **${user.username}** took too long to answer correctly! The answer was **${room.currentQuestion.answer}**!`)
				
				io.to(data.roomID).emit("ANSWER_TIME_LEFT", {
					user,
					timeLeft: 0
				})

				await room.setCurrentQuestion(null)

				if(room.checkQuestionsLeft(this._questionAmount) > 0){

					let turnData = await room.changeTurn(user)
					io.to(data.roomID).emit("CHANGE_TURN", {
						oldTurn: user.userID,
						newTurn: room.users[turnData.newTurnIndex].userID,
						ID: 3
					})

					return
				}

				await room.setGameOver(true)

				let standings = room.users.sort((a, b) => {
					return b.balance - a.balance
				})

				const start = async () => {
					await this.asyncForEach(standings, async (user) => {
						if(user.isRegistered){
							await this._dbUtils.addPlayedGames(user.token, 1)
							await this._dbUtils.addLosses(user.token, 1)
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

			}, 1000)
		}, config.get("Game.timers.answerTime.beforeCountdown")*1000)

		io.to(data.roomID).emit("GAME_ACTION_GOT_QUESTION", data)
	}
}

module.exports = SocketHandler