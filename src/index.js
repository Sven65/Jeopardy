import React from 'react'
import ReactDOM from 'react-dom'

import io from 'socket.io-client'
import store from './store'

import App from './Components/App'

let socket = null

if(CONFIG.DEV){
	
}else{
	if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
		for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
			window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value == "function" ? ()=>{} : null;
		}
	}

	socket = io(`${CONFIG.Client.socket.host}`);
}


const Application = ReactDOM.render(
	<App />,
	document.getElementById('root')
);

if(CONFIG.DEV){
	window.store = store
	window.Application = Application
	
}

window.socket = socket