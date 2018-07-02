class User{
	constructor({balance=0, gameCode="", host=false, isTurn=false, timeStamp=0, userID="", username="", roomID="", isRegistered=false, token=""}){
		this.balance = balance
		this.gameCode = gameCode
		this.host = host
		this.isTurn = isTurn
		this.timeStamp = timeStamp
		this.userID = userID
		this.username = username
		this.roomID = roomID
		this.isRegistered = isRegistered
		this.token = token
	}

	toJSON(){
		return {
			balance: this.balance,
			gameCode: this.gameCode,
			host: this.host,
			isTurn: this.isTurn,
			timeStamp: this.timeStamp,
			userID: this.userID,
			username: this.username,
			roomID: this.roomID,
			isRegistered: this.isRegistered,
			token: this.token
		}
	}
}

module.exports = User