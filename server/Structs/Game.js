class Game{
	constructor({users=[], isStarted=false, currentQuestion=null, questions=null}){
		this.currentQuestion = currentQuestion
		this.isStarted = isStarted
		this.questions = questions
		this.users = users
		this.gameOver = false
	}

	addUser(user){
		this.users.push(user)
	}

	removeUser(user){
		this.users = this.users.filter(thisUser => {
			return user.userID !== user.userID
		})
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

	changeTurn(fromUser){
		let newTurnIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})+1
		let oldTurnIndex = this.users.findIndex(user => {return user.userID===fromUser.userID})

		if(this.users[newTurnIndex] === undefined){
			newTurnIndex = 0
		}

		this.users[oldTurnIndex].isTurn = false
		this.users[newTurnIndex].isTurn = true

		return {newTurnIndex, oldTurnIndex}
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
			return clue.id === clueID
		})[0]||null
	}

	setClueRevealed(categoryID, clueID){
		let clueIndex = this.questions.clues[categoryID].findIndex(clue => {
			return clue.id === clueID
		})

		this.questions.clues[categoryID][clueIndex].revealed = true
	}

	get playerCount(){
		return this.users.length
	}
}

module.exports = Game