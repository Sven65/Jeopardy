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

	async registerUser({username, email, password, salt, token}){
		return await this.client.query(`
			INSERT INTO users
			(username, email, password, salt, token)
			VALUES ($1, $2, $3, $4, $5)
		`,
			[username, email, password, salt, token]
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
}

module.exports = DBUtils