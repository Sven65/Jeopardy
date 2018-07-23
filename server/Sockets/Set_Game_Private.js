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

		if(!this.isset(room)){
			return
		}

		let user = room.getUserByID(socket.id)

		if(!this.isset(user)){
			return
		}

		if(user.host){
			await this._dbUtils.setPrivate(roomID, !data.isPrivate)
		}

		io.to(roomID).emit("GAME_CHANGE_PRIVATE", data)
	}
}

module.exports = SocketHandler