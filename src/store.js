import reducers from './Reducers'

import { createStore, applyMiddleware, combineReducers } from 'redux'

import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

let socket = io('http://localhost:3100')

const patch = require('socketio-wildcard')(io.Manager);
patch(socket)


function optimisticExecute(action, emit, next, dispatch) {
	emit(action.type.replace("s/", ""), action.data);
	next(action);
}

let socketIoMiddleware = createSocketIoMiddleware(socket, "s/", {execute: optimisticExecute})

function reducer(state, action){
	console.log("ACT", action)

	if(!state) return {}

	switch(action.type.replace("s/", "")){
		case 'USER_JOIN':
		// TODO: Make this add to the users table in state and make it show game area
			return Object.assign({}, state, {
				roomID: action.data.gameCode,
				user: {
					username: action.data.username,
					userID: action.data.userID,
					balance: action.data.balance,
					host: action.data.host,
					isTurn: action.data.isTurn,
					timeStamp: action.data.timeStamp
				}
			})
		break
		default:
		break
	
	}

	return state;
}


socket.on("*", data => {
	//console.log("*", data)
	store.dispatch({type: data.data[0], data: data.data[1]})
})

let store = applyMiddleware(socketIoMiddleware)(createStore)(reducer)

store.subscribe(()=>{
	console.log('new client state', store.getState())
})

store.dispatch({
	type: '__BOOT__'
})

export default store