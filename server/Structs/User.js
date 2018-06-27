class User{
	constructor({balance=0, gameCode="", host=false, isTurn=false, timeStamp=0, userID="", username=""}){
		this.balance = balance
		this.gameCode = gameCode
		this.host = host
		this.isTurn = isTurn
		this.timeStamp = timeStamp
		this.userID = userID
		this.username = username
	}

	toJSON(){
		return {
			balance: this.balance,
			gameCode: this.gameCode,
			host: this.host,
			isTurn: this.isTurn,
			timeStamp: this.timeStamp,
			userID: this.userID,
			username: this.username
		}
	}
}

module.exports = User