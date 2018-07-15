import history from './history'
import { localCommand } from './Reducers/Commands.js'

import { createStore, applyMiddleware, combineReducers } from 'redux'

import createSocketIoMiddleware from 'redux-socket.io'
import asyncDispatchMiddleware from './Middlewares/AsyncDispatchMiddleware'
import io from 'socket.io-client'

let socket = io(`${CONFIG.Client.socket.host}`)

const patch = require('socketio-wildcard')(io.Manager);
patch(socket)


function optimisticExecute(action, emit, next, dispatch) {
	emit(action.type.replace("s/", ""), action.data);
	next(action);
}

let socketIoMiddleware = createSocketIoMiddleware(socket, "s/", {execute: optimisticExecute})

function updateObjectInArray(array, action) {
	return array.map( (item, index) => {
		if(index !== action.index) {
			// This isn't the item we care about - keep it as-is
			return item;
		}
		
		// Otherwise, this is the one we want - return an updated value
		return {
			...item,
			...action.item
		};
	});
}

function reducer(state, action){
	if(CONFIG.DEV){
		console.log("ACTION", action.type, " ", action)
	}

	if(!state) return {}

	switch(action.type.replace("s/", "")){
		case 'USER_JOIN':

			console.log("JOIN", action.data)

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
					roomID: action.data.roomID
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
		case "GERROR":
			return Object.assign({}, state, {
				error: action.data
			})
		break
		case "EVENT_CHAT":
			return Object.assign({}, state, {
				messages: [...state.messages||[], action.data]
			})
		break
		case "LOCAL_COMMAND":
			localCommand(state, action)
		break
		case "ACTION_GOTQUESTIONS":
			if(!state.questionsLoaded){

				action.asyncDispatch({type: "EVENT_CHAT", data: {
					message: `Questions Loaded!`,
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

			let clueIndex = clues[action.data.categoryID].findIndex(clue => ""+clue.id === action.data.clueID)

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
			console.log(action.data)

			return Object.assign({}, state, {
				loginError: {reason: ""},
				userLoggedIn: true,
				userFormLoad: false,
				//showLoginForm: false,
				userData: action.data
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
				showProfile: false
			})
		break
		case "ACTION_USER_EDIT":
			return Object.assign({}, state, {
				isLoading: true
			})
		break
		case "USER_CHANGE_THEME":
		case "USER_BUY_COLOR":
		case "USER_SET_COLOR":
			return Object.assign({}, state, {
				isLoading: true
				//theme: action.data.theme
			})
		break
		case "USER_EDIT_SAVED":
			return Object.assign({}, state, {
				isLoading: false,
				unsavedChanges: false,
				editError: ""
			})
		break
		case "USER_EDIT_ERROR":
			return Object.assign({}, state, {
				isLoading: false,
				unsavedChanges: false,
				editError: action.data.error
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

		case "BUY_COLOR_ERROR":
		case "SET_COLOR_ERROR":
			return Object.assign({}, state, {
				isLoading: false,
				buyColorError: action.data.error
			})
		break

		case "BOUGHT_COLOR":
			return Object.assign({}, state, {
				isLoading: false,
				buyColorError: "",
				boughtColor: true,
				boughtColorSuccess: "Color bought!",
				userData: {
					...state.userData,
					unlockedColors: [...state.userData.unlockedColors, action.data.color],
					balance: action.data.newBalance
				}
			})
		break

		case "USER_COLOR_SET":

			users = state.users

			if(state.users !== undefined){
				userIndex = users.findIndex(user => user.userID === action.data.userID)

				users[userIndex].color = action.data.color
			}

			return Object.assign({}, state, {
				isLoading: false,
				buyColorError: "",
				boughtColor: true,
				boughtColorSuccess: "Color Set!",
				userData: {
					...state.userData,
					color: action.data.color
				},
				users: users||[]
			})
		break

		case "SEND_VERIFICATION_EMAIL":
			return Object.assign({}, state, {
				appLoading: true
			})
		break
		case "SENT_VERIFICATION_EMAIL":
			return Object.assign({}, state, {
				appLoading: false,
				appEmailSent: true
			})
		break
		case "SENT_VERIFICATION_EMAIL_ERROR":
			return Object.assign({}, state, {
				appLoading: false,
				appEmailSent: false,
				verifyEmailError: action.data.error
			})
		break
		case "PASSWORD_RESET_ERROR":
			return Object.assign({}, state, {
				forgotPasswordSent: false,
				passwordResetError: action.data.reason
			})
		break
		case "SENT_FORGOT_PASSWORD_EMAIL":
			return Object.assign({}, state, {
				forgotPasswordSent: true,
				passwordResetError: null
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
			users[newUser].host = true

			return Object.assign({}, state, {
				users: users
			})
		break
		default:
			if(CONFIG.DEV){
				console.log("OOF", action)
			}
			return state
		break
	
	}

	return state;
}

const rootReducer = (state, action) => {
	if (action.type === 'LEAVE') {

		history.push({
			hash: ""
		})

		state = {
			joinedUsers: [],
			users: [],
			questionsLoaded: false,
			roomID: "",
			user: {},
			clues: {},
			currentQuestion: {},
			gameStarted: false,
			messages: [],
			error: {

			}
		}
	}

	return reducer(state, action);
}


socket.on("*", data => {
	//console.log("*", data)
	store.dispatch({type: data.data[0], data: data.data[1]})
})

let store = applyMiddleware(socketIoMiddleware, asyncDispatchMiddleware)(createStore)(rootReducer)

store.subscribe(()=>{
	if(CONFIG.DEV){
		console.log('new client state', store.getState())
	}
})

store.dispatch({
	type: '__BOOT__'
})

export default store