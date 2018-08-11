function game(state={}, action){
	switch(action.type.replace("s/", "")){
		case "ACTION_GOTQUESTIONS":
			if(!state.questionsLoaded){

				action.asyncDispatch({type: "EVENT_CHAT", data: {
					message: `Questions Loaded from ${action.data.boardData.type} board **${action.data.boardData.title}**!`,
					user: {
						username: "SYSTEM",
						userID: "SYSTEM"
					},
					timeStamp: Date.now()
				}})

				return Object.assign({}, state, {
					questionsLoaded: true,
					clues: action.data.clues
				})
			}
		break
		case "USER_LEAVE":
			action.asyncDispatch({type: "EVENT_CHAT", data: {
				message: `User ${action.data.user.username} left!`,
				user: {
					username: "SYSTEM",
					userID: "SYSTEM"
				},
				timeStamp: Date.now()
			}})

			let newUsers = state.users.filter(user => {
				return user.userID !== action.data.user.id
			})

			return Object.assign({}, state, {
				users: newUsers
			})
		break
		case "GAME_ACTION_GOT_QUESTION":

			let clues = state.clues

			let clueIndex = clues[action.data.categoryID].findIndex(clue => ""+(clue.id||clue.ID) === action.data.clueID)

			clues[action.data.categoryID][clueIndex].revealed = true

			return Object.assign({}, state, {
				currentQuestion: action.data,
				clues
			})
		break
		case "CHANGE_TURN":
			let users = state.users

			let newUser = users.findIndex(user => user.userID === action.data.newTurn)
			let oldUser = users.findIndex(user => user.userID === action.data.oldTurn)

			users[oldUser].isTurn = false
			users[newUser].isTurn = true

			return Object.assign({}, state, {
				users: users
			})
		break
		case "GAME_ACTION_STARTED":
			return Object.assign({}, state, {
				gameStarted: true
			})
		break
		case "GAME_EVENT_ANSWERED":
			//let users = state.users

			let userIndex = state.users.findIndex(user => user.userID === action.data.user.userID)

			state.users[userIndex].balance = action.data.newBalance

			return Object.assign({}, state, {
				users: state.users
			})
		break
		case "GAME_OVER":
			return Object.assign({}, state, {
				gameDone: true,
				standings: action.data.standings
			})
		break
		case "ANSWER_TIME_LEFT":
			userIndex = state.users.findIndex(user => user.userID === action.data.user.userID)

			state.users[userIndex].timeLeft = action.data.timeLeft

			return Object.assign({}, state, {
				users: state.users
			})
		break
		case "CHANGE_HOST":
			users = state.users

			newUser = users.findIndex(user => user.userID === action.data.newHost)

			if(user[newUser] !== undefined){
				users[newUser].host = true

				return Object.assign({}, state, {
					users: users
				})
			}
		break

		case "USER_COLOR_SET":

			users = state.users

			if(state.users !== undefined){
				userIndex = users.findIndex(user => user.userID === action.data.userID)

				users[userIndex].color = action.data.color
			}

			return Object.assign({}, state, {
				users: users||[]
			})
		break

		case "GOT_GAME_BROWSER":
			return Object.assign({}, state, {
				gameBrowser: {
					games: action.data
				}
			})
		break

		default:
			return state
		break
	}
}

export default game