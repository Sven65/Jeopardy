let Game = require("../Structs/Game")

class DBUtils{
	constructor(client){
		this.client = client
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async addGame(roomID){
		return await this.client.query(`INSERT INTO games ("roomID", "currentQuestion", "isStarted", questions, users) VALUES ($1, $2, $3, $4, $5)`, [
			roomID,
			null,
			false,
			{},
			[]
		])
	}

	async usernameExists(username){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE LOWER(username) = LOWER($1)
		`, [username])

		return results.rows.length>0
	}

	async emailExists(email){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE LOWER(email) = LOWER($1)
		`, [email])

		return results.rows.length>0
	}

	async registerUser({userID, username, email, password, salt, token, verificationCode}){
		return await this.client.query(`
			INSERT INTO users
			("ID", username, email, password, salt, token, "verificationCode")
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`,
			[userID, username, email, password, salt, token, verificationCode]
		)
	}

	async getUserByName(username){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE LOWER(username) = LOWER($1)
		`, [username])

		return results.rows[0]
	}

	async getUserByToken(token){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE token = $1
		`, [token])

		return results.rows[0]
	}

	async getUserByID(id){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE "ID" = $1
		`, [id])

		return results.rows[0]
	}

	async getUserByEmail(email){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE "email" = $1
		`, [email])

		return results.rows[0]
	}

	async setUserImage(token, imageID){
		return await this.client.query(`
			UPDATE users
			SET "imageID" = $1
			WHERE token = $2
		`, [imageID, token])
	}

	async addWins(token, amount){
		return await this.client.query(`
			UPDATE users
			SET wins = wins + $1
			WHERE token = $2
		`, [amount, token])
	}

	async addLosses(token, amount){
		// is this loss?
		return await this.client.query(`
			UPDATE users
			SET losses = losses + $1
			WHERE token = $2
		`, [amount, token])
	}

	async addPlayedGames(token, amount){
		return await this.client.query(`
			UPDATE users
			SET "playedGames" = "playedGames" + $1
			WHERE token = $2
		`, [amount, token])
	}

	async getRoomByID(roomID){
		let roomData = await this.client.query(`SELECT * FROM games WHERE "roomID" = $1`, [roomID])

		if(!this._isset(roomData.rows[0])){
			return null
		}

		roomData.rows[0].db = this.client
		return new Game(roomData.rows[0])
	}

	async setUserEmailVerified(userID, verified){
		return await this.client.query(`
			UPDATE users
			SET "isVerified" = $1
			WHERE "ID" = $2
		`, [verified, userID])
	}

	async setUserEmailVerificationCode(userID, verificationCode){
		return await this.client.query(`
			UPDATE users
			SET "verificationCode" = $1
			WHERE "ID" = $2
		`, [verificationCode, userID])
	}

	async setPasswordResetToken(userID, verificationCode){
		return await this.client.query(`
			UPDATE users
			SET "passwordResetToken" = $1
			WHERE "ID" = $2
		`, [verificationCode, userID])
	}

	async setUserLogin(userID, password, salt){
		return await this.client.query(`
			UPDATE users
			SET "password" = $1, "salt" = $2
			WHERE "ID" = $3
		`, [password, salt, userID])
	}
}

module.exports = DBUtils