function user(state={}, action){
	switch(action.type.replace("s/", "")){
		case "JOIN":
			return Object.assign({}, state, {
				validUserBoards: []
			})
		break
		case 'USER_JOIN':
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
		break


		case "USER_REGISTER_ERROR":
			return Object.assign({}, state, {
				registerError: action.data,
				userFormLoad: false
			})
		break
		case "USER_REGISTERED": 
			action.asyncDispatch({type: "s/GET_USER_BY_TOKEN", data: {
				token: action.data.token
			}})

			return Object.assign({}, state, {
				registerError: {},
				userRegistered: true,
				userFormLoad: false,
				userData: action.data,
				userLoggedIn: true,
				disableRegisterForm: true,
				disableLoginForm: true
				//showLoginForm: false
			})
		break

		case "USER_LOGIN_ERROR":
			return Object.assign({}, state, {
				loginError: action.data,
				userFormLoad: false
			})
		break
		case "USER_LOGGED_IN":
			return Object.assign({}, state, {
				loginError: {reason: ""},
				userLoggedIn: true,
				userFormLoad: false,

				//showLoginForm: false,
				userData: action.data,

				disableRegisterForm: true,
				disableLoginForm: true
			})
		break
		case "USER_FORM_LOAD":
			return Object.assign({}, state, {
				userFormLoad: true
			})
		break
		case "INIT_GET_USER_DATA":
			let loadedData = localStorage.getItem( 'userData' )

			let userData = {}

			if(loadedData !== undefined && loadedData !== null){
				userData = JSON.parse(atob(loadedData))
			}

			if(userData.token !== undefined){
				action.asyncDispatch({type: "s/GET_USER_BY_TOKEN", data: {
					token: userData.token
				}})
			}

			return Object.assign({}, state, {
				userData: userData,
				userLoggedIn: Object.keys(userData).length>0
			})
		break

		case "USER_LOGOUT":

			localStorage.removeItem("userData")

			return Object.assign({}, state, {
				userData: {},
				userLoggedIn: false,
				showProfile: false,
				clearUserForm: true,
				disableRegisterForm: false,
				disableLoginForm: false,
				registerError: {},
				userRegistered: false
			})
		break

		case "CHANGE_THEME":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					theme: action.data.theme
				}
			})
		break

		case "BOUGHT_COLOR":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					unlockedColors: [...state.userData.unlockedColors, action.data.color],
					balance: action.data.newBalance
				}
			})
		break

		case "USER_COLOR_SET":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					color: action.data.color
				}
			})
		break

		default:
			return state
		break
	}
}

export default user