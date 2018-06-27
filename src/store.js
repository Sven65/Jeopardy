import reducers from './Reducers'

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
		console.log("ACT", action)
	}

	if(!state) return {}

	switch(action.type.replace("s/", "")){
		case 'USER_JOIN':
			let user = {
				username: action.data.username,
				userID: action.data.userID,
				balance: action.data.balance,
				host: action.data.host,
				isTurn: action.data.isTurn,
				timeStamp: action.data.timeStamp
			}

			if(state.users === undefined){
				state.users = []
			}

			let isJoined = state.users.filter(stateUser => {
				return stateUser.userID === action.data.userID
			}).length>0

			if(!isJoined){

				action.asyncDispatch({type: "s/ACTION_GETQUESTIONS", data: {
					gameCode: action.data.gameCode
				}})

				if(user.userID === socket.id){
					action.asyncDispatch({type: "EVENT_CHAT", data: {
						message: `Joined room **${action.data.gameCode}** as **${action.data.username}**!`,
						user: {
							username: "SYSTEM",
							userID: "SYSTEM"
						},
						timeStamp: Date.now()
					}})

					return Object.assign({}, state, {
						roomID: action.data.gameCode,
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
						roomID: action.data.gameCode,
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

			return Object.assign({}, state, {
				users: state.users.filter(user => user.userID !== action.data.user.userID)
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
		state = {
			joinedUsers: [],
			users: [],
			questionsLoaded: false,
			roomID: "",
			user: {},
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