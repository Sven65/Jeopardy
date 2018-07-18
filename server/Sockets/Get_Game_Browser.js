class SocketHandler{
	constructor({dbUtils = null}){
		this._dbUtils = dbUtils
	}

	isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async Execute({socket = null, io = null, data = {}, roomTimers = {}}){
		let games = await this._dbUtils.getGames()

		let publicGames = games.rows.filter(game => game.public)

		socket.emit("GOT_GAME_BROWSER", publicGames)
	}
}

module.exports = SocketHandler