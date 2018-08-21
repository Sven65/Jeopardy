class Game{
	constructor({users=[], isStarted=false, currentQuestion=null, questions=null, roomID="", db=null, boardID="default"}){
		this.currentQuestion = currentQuestion
		this.isStarted = isStarted
		this.questions = questions
		this.users = users
		this.gameOver = false
		this.roomID = roomID
		this.boardID = boardID
		this._client = db
	}

	get playerCount(){
		return this.users.length
	}

	checkUsernameInRoom(username){
		return this.users.filter(user => {return user.username === username}).length>0
	}

	checkUserIDInRoom(userID){
		return this.users.filter(user => {return user.userID === userID}).length>0
	}

	getUserByID(userID){
		return this.users.filter(user => {return user.userID === userID})[0]||null
	}

	checkQuestionsLeft(questionsLeft){
		Object.keys(this.questions.clues).forEach(category => {
			this.questions.clues[category].forEach(clue => {
				if(clue.revealed){
					questionsLeft--
				}
			})
		})

		return questionsLeft
	}

	getClueData(categoryID, clueID){
		return this.questions.clues[categoryID].filter(clue => {
			return (clue.id||clue.ID) === clueID
		})[0]||null
	}

	async addUser(user){
		this.users.push(user)
		return await this._client.query(`
			UPDATE games
			SET users = array_append(users, $1)
			WHERE "roomID" = $2
		`,
			[user.toJSON(), this.roomID]
		)
	}

	async removeUser(user){
		this.users = this.users.filter(thisUser => {
			return user.userID !== thisUser.userID
		})

		console.log("NEWUSER", this.users)

		let userUpdate = []

		this.users.map(thisUser => {
			userUpdate.push(thisUser)
		})

		return await this._client.query(`
			UPDATE games
			SET users = $1
			WHERE "roomID" = $2
			`,
			[userUpdate, this.roomID]
		)
	}

	async setQuestions(questions){
		this.questions = questions

		// Despite what pgAdmin3 says, this works
		return await this._client.query(`
			UPDATE games
			SET questions = questions || $1::jsonb
			WHERE "roomID" = $2
			`,
			[questions, this.roomID]
		)
	}

	async setStarted(isStarted){
		this.isStarted = isStarted

		return await this._client.query(`
			UPDATE games
			SET "isStarted" = $1
			WHERE "roomID" = $2
			`,
			[isStarted, this.roomID]
		)
	}

	async changeTurn(fromUser){
		let newTurnIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})+1
		let oldTurnIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})

		if(this.users[newTurnIndex] === undefined){
			newTurnIndex = 0
		}

		this.users[oldTurnIndex].isTurn = false
		this.users[newTurnIndex].isTurn = true

		await this._client.query(`
			UPDATE games
			SET users = $1
			WHERE "roomID" = $2
			`,
			[this.users, this.roomID]
		)

		return {newTurnIndex, oldTurnIndex}
	}

	async changeHost(fromUser){
		let newHostIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})+1
		//let oldHostIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})

		if(this.users[newHostIndex] === undefined){
			newHostIndex = 0
		}

		//this.users[oldHostIndex].isHost = false
		if(this.users[newHostIndex] === undefined){
			return {newHostIndex: -1}
		}

		this.users[newHostIndex].host = true

		await this._client.query(`
			UPDATE games
			SET users = $1
			WHERE "roomID" = $2
			`,
			[this.users, this.roomID]
		)

		return {newHostIndex}
	}

	async setClueRevealed(categoryID, clueID){
		let clueIndex = this.questions.clues[categoryID].findIndex(clue => {
			return (clue.id||clue.ID) === clueID
		})

		this.questions.clues[categoryID][clueIndex].revealed = true

		return await this.setQuestions(this.questions)
	}

	async setCurrentQuestion(question){
		this.currentQuestion = question


		return await this._client.query(`
			UPDATE games
			SET "currentQuestion" = $1::jsonb
			WHERE "roomID" = $2
			`,
			[question, this.roomID]
		)
	}

	async setGameOver(gameOver){
		this.gameOver = gameOver

		return await this._client.query(`
			UPDATE games
			SET "gameOver" = $1
			WHERE "roomID" = $2
			`,
			[gameOver, this.roomID]
		)
	}

	async addUserBalance(userID, amount){
		this.getUserByID(userID).balance += amount

		return await this._client.query(`
			UPDATE games
			SET users = $1
			WHERE "roomID" = $2
			`,
			[this.users, this.roomID]
		)
	}

	async setBoardID(boardID){
		return await this._client.query(`
			UPDATE games
			SET "boardID" = $1
			WHERE "roomID" = $2
			`,
			[boardID, this.roomID]
		)
	}

	async delete(){
		return await this._client.query(`
			DELETE FROM games
			WHERE "roomID" = $1
			`,
			[this.roomID]
		)
	}
}

module.exports = Game