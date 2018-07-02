import React from 'react'
import ReactDOM from 'react-dom'

import io from 'socket.io-client'
import store from './store'

import App from './Components/App'

let socket = null

if(CONFIG.DEV){
	socket = io(`${CONFIG.Client.socket.host}`);
}else{
	if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
		for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
			window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value == "function" ? ()=>{} : null;
		}
	}
}


const Application = ReactDOM.render(
	<App />,
	document.getElementById('root')
);

if(CONFIG.DEV){
	window.store = store
	window.Application = Application
	window.socket = socket
}

/**
 * @TODO: Fix bug where disconnection doesn't remove user card in game area
 * @TODO: Add AFK timer
 * @TODO: Add a message saying whos turn it is in chat
 * @TODO: Make turn indicator more clear, maybe highlight the user box
 * @TODO: Fix bug where winner is last
 */