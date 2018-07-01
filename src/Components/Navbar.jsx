import React, { Component } from 'react'

import UserForm from './Common/UserForm'
import Loader from './Common/Loader'

import store from './../store'

class Navbar extends Component {
	constructor(props){
		super(props)

		this.state = {
			userData: {},
			userLoggedIn: false,
			userFormLoad: false
		}
	
		//this.startGame = this.startGame.bind(this)
		//this.leaveGame = this.leaveGame.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())

			//console.log("MESSAGE", this.state.messages)
		})
		console.log("STATE", this.state)
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
		const isLoggedIn = this.state.userLoggedIn

		console.log("ILI", isLoggedIn)

		return (
			<nav className="light-blue lighten-1" role="navigation">
				{!isLoggedIn ? (
					<ul id="user-dropdown" className="dropdown-content">
						<li>
							<a className="modal-trigger" href="#user-modal-holder" id="usermodal-trigger">Login</a>
						</li>
					</ul>
					) : (
						<ul id="user-dropdown" className="dropdown-content">
							<li>
								<a className="modal-trigger" href="#userprofile-modal-holder" id="userprofile-modal-trigger">Profile</a>
							</li>
							<li>
								<a className="logout" id="user-logout">Logout<i className="material-icons right">exit_to_app</i></a>
							</li>
						</ul>
					)
				}
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
							{isLoggedIn? (
									<a className="dropdown-trigger" href="#!" data-target="user-dropdown"><i className="material-icons left">person</i>{this.state.userData.username}<i className="material-icons right">arrow_drop_down</i></a>
								) : (
									<a className="dropdown-trigger" href="#!" data-target="user-dropdown"><i className="material-icons left">person</i>User<i className="material-icons right">arrow_drop_down</i></a>
								)
							}
						</li>
					</ul>
				</div>

				<div className="loader-holder" id="usermodal-holder">
					<UserForm />
				</div>

				{this.state.userFormLoad &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{(() => {
					if(isLoggedIn || this.state.userRegistered){
						var event = new Event("USER_FORM_DONE")
						//event.initEvent("login", true, true);
						var target = document.querySelector('#usermodal-holder');
						target.dispatchEvent(event);
					}
				})()}
			</nav>
		)
	}
}

export default Navbar