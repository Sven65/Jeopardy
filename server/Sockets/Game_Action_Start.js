const config = require("config")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils

		this._minPlayers = config.get("Game.minPlayers")
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

	async Execute({socket = null, io = null, data = {} }){
		let room = await this._dbUtils.getRoomByID(data.roomID)

		if(!this._isset(room)){
			return
		}

		if(room.playerCount >= this._minPlayers){
			await room.setStarted(true)

			io.to(data.roomID).emit("GAME_ACTION_STARTED", {timeStamp: Date.now()})

			this._sendSystemMessage(io, data.roomID, `User ${room.getUserByID(data.userID).username} started the game!`)

			io.to(data.roomID).emit("CHANGE_TURN", {
				oldTurn: data.userID,
				newTurn: data.userID,
				ID: 2
			})
		}else{
			socket.emit('EVENT_CHAT', {
				message: `Not enough users to start game!`,
				user: {
					username: "SYSTEM",
					userID: "SYSTEM"
				},
				timeStamp: Date.now()
			})
		}
	}
}

module.exports = SocketHandler