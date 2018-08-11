import {
	loader,
	user,
	game,
	chat,
	userEdit,
	boardEdit
} from './Reducers/index.js'

import { createStore, applyMiddleware, combineReducers } from 'redux'

import createSocketIoMiddleware from 'redux-socket.io'
import asyncDispatchMiddleware from './Middlewares/AsyncDispatchMiddleware'
import io from 'socket.io-client'

let socket = io(`${CONFIG.Client.socket.host}`)

if(CONFIG.DEV){
	window.socket = socket
}

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
		default:
			if(CONFIG.DEV){
				console.log("OOF", action)
			}
			return state
		break
	
	}

	return state;
}

const appReducer = combineReducers({
	reducer,
	loader,
	user,
	game,
	chat,
	userEdit,
	boardEdit
})

const rootReducer = (state, action) => {
	if(state === undefined){
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

	return appReducer(state, action);
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