class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {}, roomTimers = {}}){
		let roomID = data.roomID

		let room = await this._dbUtils.getRoomByID(roomID)

		if(!isset(room)){
			return
		}

		let user = room.getUserByID(socket.id)

		if(!isset(user)){
			return
		}

		Object.assign(data, {
			timeStamp: Date.now(),
			roomCode: roomID,
			user: {
				id: socket.id,
				username: user.username
			}
		})

		await room.removeUser(user)

		if(room.playerCount <= 0){

			clearTimeout(roomTimers[roomID])
			clearInterval(roomTimers[roomID])

			delete roomTimers[roomID]

			room.delete()
		}

		io.to(roomID).emit("USER_LEAVE", data)
		socket.leave(roomID)
	}
}

module.exports = SocketHandler