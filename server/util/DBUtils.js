class DBUtils{
	constructor(client){
		this.client = client
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

	async registerUser({userID, username, email, password, salt, token}){
		return await this.client.query(`
			INSERT INTO users
			("ID", username, email, password, salt, token)
			VALUES ($1, $2, $3, $4, $5, $6)
		`,
			[userID, username, email, password, salt, token]
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
}

module.exports = DBUtils