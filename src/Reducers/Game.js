import history from '../history'

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

			return state
		break

		case 'USER_JOIN':
			console.log("GAME STATE", state)

			let user = {
				username: action.data.username,
				userID: action.data.userID,
				balance: action.data.balance,
				host: action.data.host,
				isTurn: action.data.isTurn,
				timeStamp: action.data.timeStamp,
				image: action.data.image,
				isRegistered: action.data.isRegistered||false,
				color: action.data.color||"#eee"
			}

			if(state.users === undefined){
				state.users = []
			}

			let isJoined = state.users.filter(stateUser => {
				return stateUser.userID === action.data.userID
			}).length>0

			if(!isJoined){

				history.push({
					hash: `#${action.data.roomID}`
				})

				action.asyncDispatch({type: "s/ACTION_GETQUESTIONS", data: {
					roomID: action.data.roomID,
					boardID: action.data.boardID
				}})

				if(user.userID === socket.id){
					action.asyncDispatch({type: "EVENT_CHAT", data: {
						message: `Joined room **${action.data.roomID}** as **${action.data.username}**!`,
						user: {
							username: "SYSTEM",
							userID: "SYSTEM"
						},
						timeStamp: Date.now()
					}})

					return Object.assign({}, state, {
						roomID: action.data.roomID,
						user: user,
						users: [...state.users||[], user]
					})
				}else{
					action.asyncDispatch({type: "EVENT_CHAT", data: {
						message: `User **${action.data.username}** joined!`,
						user: {
							username: "SYSTEM",
							userID: "SYSTEM"
						},
						timeStamp: Date.now()
					}})


					return Object.assign({}, state, {
						roomID: action.data.roomID,
						users: [...state.users||[], user]
					})
				}
			}

			return state
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

		case "GOT_VALID_USER_BOARDS":
			return Object.assign({}, state, {
				validUserBoards: action.data.boards
			})
		break

		case "GERROR":
			return Object.assign({}, state, {
				error: action.data,
				validUserBoards: []
			})
		break
		case "RESET_ERROR":
			return Object.assign({}, state, {
				error: null
			})
		break

		case "JOIN":
			return Object.assign({}, state, {
				validUserBoards: []
			})
		break

		case "LEAVE":
			return {
				validUserBoards: [],
				users: [],
				roomID: "",
				gameStarted: false,
				gameDone: false,
				standings: {},
				questionsLoaded: false,
				joinedUsers: [],
				clues: {},
				currentQuestion: {},
				user: {},
				gameBrowser: {
					games: state.gameBrowser.games
				}
			}
		break

		default:
			return Object.assign({
				validUserBoards: [],
				users: [],
				roomID: "",
				gameStarted: false,
				gameDone: false,
				standings: {},
				questionsLoaded: false,
				joinedUsers: [],
				clues: {},
				currentQuestion: {},
				user: {},
				gameBrowser: {
					games: []
				}
			}, state)
		break
	}
}

export default game