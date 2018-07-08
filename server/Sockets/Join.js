const config = require("config")
const User = require("../Structs/User")

class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils

		this._maxPlayers = config.get("Game.maxPlayers")
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}

	async _getUserImage(data){
		if(this._isset(data.user.image)){
			return data.user.image
		}

		if(this._isset(data.user.token)){
			let user = await this._dbUtils.getUserByToken(data.user.token)

			if(this._isset(user)){
				return `images/${user.imageID}`
			}
		}

		return `https://placehold.it/128x128?text=${data.username}`
	}

	async Execute({socket = null, io = null, data = {} }){
		let isHost = false
		let canJoin = false
		let errorMessage = "Game is still loading, please wait."

		data.roomID = data.roomID.sanitizeHTML()
		data.username = data.user.username.sanitizeHTML()

		let room = await this._dbUtils.getRoomByID(data.roomID)

		if(!this._isset(room)){
			await this._dbUtils.addGame(data.roomID)

			room = await this._dbUtils.getRoomByID(data.roomID)
		}

		if(Object.keys(room.questions) <= 0 && room.users.length <= 0){
			isHost = true
		}

		if(this._isset(room.questions) && room.questions.loaded){
			canJoin = true
		}else{
			if(isHost){
				canJoin = true
			}
		}

		if(room.checkUsernameInRoom(data.username)){
			canJoin = false
			errorMessage = "Username already in use."
		}

		if(room.users.length >= this._maxPlayers){
			canJoin = false
			errorMessage = "Game is full."
		}

		if(!canJoin){
			socket.emit("GERROR", {type: "JOIN", reason: errorMessage})
			return
		}

		socket.join(data.roomID)

		console.log("JOIN", data)

		data.timeStamp = Date.now()
		data.roomID = data.roomID
		data.userID = socket.id
		data.host = isHost
		data.isTurn = isHost
		data.balance = 0
		data.isRegistered = this._isset(data.user.token)
		data.token = data.user.token||""
		data.image = await this._getUserImage(data)

		if(!this._isset(data.user)){
			this.user = {}
		}

		if(!this._isset(data.user.image)){
			data.user.image = `https://placehold.it/128x128?text=${data.username}`
		}

		let user = new User(data)

		await room.addUser(user)

		room.users.forEach(user => {
			socket.emit("USER_JOIN", user)
		})

		io.to(data.roomID).emit("USER_JOIN", data)
	}
}

module.exports = SocketHandler