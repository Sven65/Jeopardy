import React from 'react'
import ReactDOM from 'react-dom'

import io from 'socket.io-client'
const socket = io('http://localhost:3100');
import store from './store'

import App from './Components/App'


const Application = ReactDOM.render(
	<App />,
	document.getElementById('root')
);

window.store = store
window.Application = Application
window.socket = socket