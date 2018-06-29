import React, { Component } from 'react'
import io from 'socket.io-client';
import $ from "jquery";

window.$ = $;

import './../styles/materialize.min.css'
import './../styles/main.css'
import './../styles/loaders.min.css'

import './../General/materialize.min.js'
import './../General/init.js'

//import {socket, socketDebug, getQuestions } from '../api'
import Navbar from './Navbar'
import BeforeGame from './BeforeGame'
import GameArea from './GameArea'

import Footer from './Common/Footer'

import store from '../store'

class App extends Component {
	constructor(props){
		super(props)

		this.state = {
			joinedUsers: [],
			users: [],
			questionsLoaded: false,
			roomID: "",
			user: {},
			error: {

			},
			gameStarted: false,
			gameDone: false,
			standings: []
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	render(){
		return (
			<div className="App">
				<Navbar roomID={this.state.roomID} hideButtons={this.state.roomID===""} hideStartButton={(this.state.gameStarted || !this.state.user.host)}/>
				<BeforeGame hidden={this.state.roomID!==""} headerText={this.state.error.reason||"Please enter details"} />
				<GameArea hidden={this.state.roomID===""} categories={[
					"Category 1",
					"Category 2",
					"Category 3",
					"Category 4",
					"Category 5",
					"Category 6"
				]} values={[
					200,
					400,
					600,
					800,
					1000
				]} users={this.state.users}/>
			</div>
		)
	}
}

export default App