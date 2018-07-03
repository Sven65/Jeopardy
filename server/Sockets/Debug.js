class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	async Execute({socket = null, io = null, data = {} }){
		console.log("DEBUG", data)
		socket.emit("DEBUG", data)
	}
}

module.exports = SocketHandler