import React, { Component } from 'react'

import UserForm from './Common/UserForm'
import Loader from './Common/Loader'
import UserProfile from './Common/UserProfile'

import mainLogo from'../Assets/TriviaPartyWhite.svg'

import store from './../store'

class Navbar extends Component {
	constructor(props){
		super(props)

		this.state = {
			userData: {},
			userLoggedIn: false,
			userFormLoad: false,
			showProfile: false
		}
	
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

	logout(){
		this.setState({
			showProfile: false
		})

		var event = new Event("USER_FORM_UNDONE")
		//event.initEvent("login", true, true);
		var target = document.querySelector('#usermodal-holder');
		if(target !== null){
			target.dispatchEvent(event);
		}

		store.dispatch({type: "USER_LOGOUT"})
	}

	toggleProfile(e){
		this.setState({
			showProfile: true
		})

		if(e.target.classList.contains("loader-holder")){
			if(this.state.showProfile){
				this.setState({
					showProfile: false
				})
			}
		}
	}

	render(){
		const isLoggedIn = this.state.userLoggedIn
		const showProfile = (this.state.userLoggedIn && this.state.showProfile)

		return (
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<a className="navbar-item">
						<img src={mainLogo} alt="TriviaParty"/>
						{this.props.roomID!=="" &&
							<span id="gameCodeHeader">Game: {this.props.roomID}</span>
						}
					</a>
					<a role="button" className="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>

				<div className="navbar-menu" id="navMenu">
					<div className="navbar-end">

						{/* Game Buttons */}
						<a id="game-button-start" onClick={this.startGame.bind(this)} className={"navbar-item "+(this.props.hideStartButton?'hidden':'')}>Start Game <i className="material-icons right">play_arrow</i></a>
						<a id="game-button-leave" onClick={this.leaveGame.bind(this)} className={"navbar-item "+(this.props.hideLeaveButton?'hidden':'')}>Leave Game <i className="material-icons right">exit_to_app</i></a>
						{/* End Game Buttons */}

						<hr class="navbar-divider"/>

						<div className="navbar-item has-dropdown is-hoverable">
							{/* User stuff */}
							<a className="navbar-link user-link">
								<i className="material-icons left">person</i>{!isLoggedIn?"User":this.state.userData.username}
							</a>

							{!isLoggedIn?(
								<div className="navbar-dropdown">
									<a className="navbar-item">
										<a className="modal-trigger" href="#user-modal-holder" id="usermodal-trigger">Login</a>
									</a>
								</div>
							) : (
								<div className="navbar-dropdown">
									<a className="navbar-item">
										<a className="modal-trigger" href="#userprofile-holder" id="userprofile-trigger" onClick={this.toggleProfile.bind(this)}>Profile</a>
									</a>
									<a className="navbar-item">
										<a className="logout" id="user-logout" onClick={this.logout.bind(this)}>Logout<i className="material-icons right">exit_to_app</i></a>
									</a>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="loader-holder" id="usermodal-holder">
					<UserForm />
				</div>

				{this.state.userFormLoad &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{showProfile &&
					<div className="loader-holder" id="userprofile-holder" onClick={this.toggleProfile.bind(this)}>
						<UserProfile
							username={this.state.userData.username}
							image={this.state.userData.image}
							wins={this.state.userData.wins}
							losses={this.state.userData.losses}
							balance={this.state.userData.balance}
							logoutFunc={this.logout.bind(this)}
							userToken={this.state.userData.token}
						/>
					</div>
				}

				{(() => {
					if(isLoggedIn || this.state.userRegistered){
						let event = new Event("USER_FORM_DONE")
						let target = document.querySelector('#usermodal-holder');
						target.dispatchEvent(event);
					}
				})()}
			</nav>
		)
	}
}

export default Navbar