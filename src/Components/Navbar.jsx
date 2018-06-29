import React, { Component } from 'react'

import UserForm from './Common/UserForm'

import store from './../store'

class Navbar extends Component {
	constructor(props){
		super(props)

		this.state = {}
	
		//this.startGame = this.startGame.bind(this)
		//this.leaveGame = this.leaveGame.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())

			//console.log("MESSAGE", this.state.messages)
		})
	}

	startGame(){
		store.dispatch({type: "s/GAME_ACTION_START", data: {
			roomID: this.state.roomID,
			userID: this.state.user.userID
		}})
	}

	leaveGame(){
		store.dispatch({type: "s/USER_ACTION_LEAVE", data: {
			roomID: this.state.roomID,
			userID: this.state.user.userID
		}})

		store.dispatch({type: "LEAVE", data: {a: "oof"}})
	}

	render(){
		return (
			<nav className="light-blue lighten-1" role="navigation">
				<ul id="user-dropdown" className="dropdown-content">
					<li>
						<a className="modal-trigger" href="#user-modal-holder" id="usermodal-trigger">Login</a>
					</li>
				</ul>
				<div className="nav-wrapper container">
					<a className="brand-logo" href="#" id="logo-container">TriviaParty - <span id="gameCodeHeader">{this.props.roomID}</span></a>
					<ul id="game-buttons" className={"right "+(this.props.hideButtons?'hidden':'')}>
						{!this.props.hideStartButton &&
							<li>
								<a id="game-button-start" onClick={this.startGame.bind(this)}>Start Game <i className="material-icons right">play_arrow</i></a>
							</li>
						}
						<li><a id="game-button-leave" onClick={this.leaveGame.bind(this)}>Leave Game <i className="material-icons right">exit_to_app</i></a></li>
					</ul>
					<ul className="right">
						<li>
							<a className="dropdown-trigger" href="#!" data-target="user-dropdown"><i className="material-icons left">person</i>User<i className="material-icons right">arrow_drop_down</i></a>
						</li>
					</ul>
				</div>
				<div className="loader-holder" id="usermodal-holder">
					<UserForm />
				</div>
			</nav>
		)
	}
}

export default Navbar