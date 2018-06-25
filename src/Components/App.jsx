import React, { Component } from 'react'
import io from 'socket.io-client';

import './../styles/materialize.min.css'
import './../styles/main.css'

import './../General/materialize.min.js'

//import {socket, socketDebug, getQuestions } from '../api'
import Navbar from './Navbar'
import BeforeGame from './BeforeGame'
import GameArea from './GameArea'

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
			beforeGame: {
				hide: false
			},
			gameArea: {
				hide: true
			}
		}

		//this.socket = io('http://localhost:3100');

		/*this.socket.on("USER_JOIN", data => {
			console.log("JOINDATA", data)

			this.setState(prevState => ({
				roomID: data.roomID,
				joinedUsers: [...prevState.joinedUsers, data.userID],
				users: [...prevState.users, {userID: data.userID, username: data.username}]
			}))

			console.log("JOINSTATE", this.state)
		})*/
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	render(){
		return (
			<div className="App">
				<Navbar gameCode={this.state.roomID} />
				<BeforeGame hidden={this.state.beforeGame.hide} headerText="Please enter details" /*socket={this.socket}*//>
				<GameArea hidden={this.state.gameArea.hide} categories={[
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