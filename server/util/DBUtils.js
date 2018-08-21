let Game = require("../Structs/Game")

class DBUtils{
	constructor(client){
		this.client = client
	}

	_isset(variable){
		return (variable !== null && variable !== undefined)
	}

	async addGame(roomID, boardID){
		return await this.client.query(`INSERT INTO games ("roomID", "currentQuestion", "isStarted", questions, users, "boardID") VALUES ($1, $2, $3, $4, $5, $6)`, [
			roomID,
			null,
			false,
			{},
			[],
			boardID
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

	async addBalance(token, amount){
		return await this.client.query(`
			UPDATE users
			SET "balance" = "balance" + $1
			WHERE token = $2
		`, [amount, token])
	}

	async removeBalance(token, amount){
		return await this.client.query(`
			UPDATE users
			SET "balance" = "balance" - $1
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

	async setUserEmail(userID, email){
		return await this.client.query(`
			UPDATE users
			SET "email" = $1
			WHERE "ID" = $2
		`, [email, userID])
	}

	async setLastVerificationRequest(userID, time){
		return await this.client.query(`
			UPDATE users
			SET "lastVerificationRequest" = to_timestamp($1)
			WHERE "ID" = $2
		`, [time, userID])
	}

	async setLastPasswordResetRequest(userID, time){
		return await this.client.query(`
			UPDATE users
			SET "lastPasswordResetRequest" = to_timestamp($1)
			WHERE "ID" = $2
		`, [time, userID])
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

	async setTheme(token, theme){
		return await this.client.query(`
			UPDATE users
			SET "theme" = $1
			WHERE "token" = $2
		`, [theme, token])
	}

	async addUnlockedColor(token, color){
		return await this.client.query(`
			UPDATE users
			SET "unlockedColors" = array_append("unlockedColors", $1)
			WHERE "token" = $2
		`, [color , token])
	}

	async setNameColor(token, color){
		return await this.client.query(`
			UPDATE users
			SET "nameColor" = $1
			WHERE "token" = $2
		`, [color , token])
	}

	async getGames(){
		return await this.client.query(`
			SELECT * FROM games
		`)
	}

	async setPrivate(gameID, isPrivate){
		return await this.client.query(`
			UPDATE games
			SET "public" = $1
			WHERE "roomID" = $2
		`, [isPrivate, gameID])
	}

	async getBoardByID(boardID){
		return await this.client.query(`
			SELECT * FROM boards.boards
			WHERE "id" = $1
		`, [boardID])
	}

	async getCategoryByID(categoryID){
		return await this.client.query(`
			SELECT * FROM boards.categories
			WHERE "id" = $1
		`, [categoryID])
	}

	async getCluesByCategoryID(categoryID){
		return await this.client.query(`
			SELECT * FROM boards.clues
			WHERE "category_id" = $1
			ORDER By "ID"
		`, [categoryID])
	}

	async getClueData(clueID){
		return await this.client.query(`
			SELECT * FROM boards.clues
			WHERE "ID" = $1
		`, [clueID])
	}

	async getBoardsByUserID(userID){
		return await this.client.query(`
			SELECT * FROM boards.boards
			WHERE "owner" = $1
		`, [userID])
	}

	async setCategoryTitle(categoryID, title){
		return await this.client.query(`
			UPDATE boards.categories
			SET "title" = $1
			WHERE "id" = $2
		`, [title, categoryID])
	}

	async setBoardTitle(boardID, title){
		return await this.client.query(`
			UPDATE boards.boards
			SET "title" = $1
			WHERE "id" = $2
		`, [title, boardID])
	}

	async addCategory(title, cluesCount, userID){
		return await this.client.query(`
			INSERT INTO boards.categories
			("title", "created_at", "updated_at", "clues_count", "owner")
			VALUES ($1, current_timestamp, current_timestamp, $2, $3)
			RETURNING "id"
		`, [title, cluesCount, userID])
	}

	async addCategoryToBoard(boardID, categoryID){
		return await this.client.query(`
			UPDATE boards.boards
			SET "categories" = array_append("categories", $1)
			WHERE "id" = $2
		`, [categoryID, boardID])
	}

	async addClue(answer, question, value, categoryID, owner){
		return await this.client.query(`
			INSERT INTO boards.clues
			("answer", "question", "value", "created_at", "updated_at", "category_id", "owner")
			VALUES ($1, $2, $3, current_timestamp, current_timestamp, $4, $5)
		`, [answer, question, value, categoryID, owner])
	}

	async getUserBoardCount(userID){
		return await this.client.query(`
			SELECT COUNT(*) FROM boards.boards
			WHERE owner = $1
		`, [userID])
	}

	async addBoard(id, owner, categories, title){
		return await this.client.query(`
			INSERT INTO boards.boards
			("id", "owner", "created_at", "updated_at", "categories", "title")
			VALUES ($1, $2, current_timestamp, current_timestamp, $3, $4)
		`, [id, owner, categories, title])
	}

	// Deletion Stuff

	async deleteBoard(boardID){
		return await this.client.query(`
			DELETE FROM boards.boards
			WHERE "id" = $1
		`, [boardID])
	}

	async deleteCategory(categoryID){
		return await this.client.query(`
			DELETE FROM boards.categories
			WHERE "id" = $1
		`, [categoryID])
	}

	async deleteClue(clueID){
		return await this.client.query(`
			DELETE FROM boards.clues
			WHERE "ID" = $1
		`, [clueID])
	}

	async removeCategoryFromBoard(categoryID, boardID){
		return await this.client.query(`
			UPDATE boards.boards
			SET "categories" = array_remove("categories", $1)
			WHERE "id" = $2
		`, [categoryID , boardID])
	}

	async editClue(clueID, answer, question, value){
		return await this.client.query(`
			UPDATE boards.clues
			SET "answer" = $1, "question" = $2, "value" = $3, "updated_at" = current_timestamp
			WHERE "ID" = $4
		`, [answer, question, value, clueID])
	}
}

module.exports = DBUtils