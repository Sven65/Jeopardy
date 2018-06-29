class DBUtils{
	constructor(client){
		this.client = client
	}

	async usernameExists(username){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE username = $1
		`, [username])

		return results.rows.length>0
	}

	async emailExists(email){
		let results = await this.client.query(`
			SELECT * FROM users
			WHERE email = $1
		`, [email])

		return results.rows.length>0
	}

	async registerUser({username, email, password, salt}){
		return await this.client.query(`
			INSERT INTO users
			(username, email, password, salt)
			VALUES ($1, $2, $3, $4)
		`,
			[username, email, password, salt]
		)
	}
}

module.exports = DBUtils