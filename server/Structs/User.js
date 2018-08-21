class User{
	constructor({balance=0, gameCode="", host=false, isTurn=false, timeStamp=0, userID="", username="", roomID="", isRegistered=false, token="", image="", color="#EEE", boardID="default"}){
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
		this.image = image
		this.color = color
		this.boardID = boardID
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
			token: this.token,
			image: this.image,
			color: this.color,
			boardID: this.boardID
		}
	}
}

module.exports = User