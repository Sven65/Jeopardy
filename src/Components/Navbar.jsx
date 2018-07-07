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
			showProfile: false,
			showLoginForm: false
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
			showProfile: false,
			showLoginForm: false
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
			showProfile: !this.state.showProfile
		})
	}

	toggleLoginForm(e){
		this.setState({
			showLoginForm: !this.state.showLoginForm
		})
	}

	render(){
		const isLoggedIn = this.state.userLoggedIn
		const showProfile = (this.state.userLoggedIn && this.state.showProfile)
		const showLoginForm = (this.state.showLoginForm)

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
						<a id="game-button-start" onClick={this.startGame.bind(this)} className={"navbar-item dark-background "+(this.props.hideStartButton?'hidden':'')}>Start Game <i className="mdi mdi-18px mdi-play"></i></a>
						<a id="game-button-leave" onClick={this.leaveGame.bind(this)} className={"navbar-item dark-background "+(this.props.hideLeaveButton?'hidden':'')}>Leave Game <i className="mdi mdi-18px mdi-exit-to-app"></i></a>
						{/* End Game Buttons */}

						<div className="navbar-item has-dropdown is-hoverable">
							{/* User stuff */}
							<a className="navbar-link user-link">
								<i className="mdi mdi-account"></i>{!isLoggedIn?"User":this.state.userData.username}
							</a>

							{!isLoggedIn?(
								<div className="navbar-dropdown">
									<a className="navbar-item">
										<a className="modal-trigger" href="#user-modal-holder" id="usermodal-trigger" onClick={this.toggleLoginForm.bind(this)}>Login</a>
									</a>
								</div>
							) : (
								<div className="navbar-dropdown">
									<a className="navbar-item" onClick={this.toggleProfile.bind(this)}>
										<a className="modal-trigger" href="#userprofile-holder" id="userprofile-trigger">Profile</a>
									</a>
									<a className="navbar-item" onClick={this.logout.bind(this)}>

										<a className="logout" id="user-logout">
											<span className="icon is-left">
												<i className="mdi mdi-18px mdi-exit-to-app"></i>
											</span>
											Logout
											
										</a>
									</a>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="loader-holder is-fixed" id="usermodal-holder" style={{display: (showLoginForm?'':"none")}}>
					<UserForm />
				</div>

				{(() => {
					if(showLoginForm){
						let event = new Event("SET_HEIGHT")
						let target = document.querySelector('#usermodal-holder');
						target.dispatchEvent(event);
					}
				})()}

				{this.state.userFormLoad &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{showProfile &&
					<UserProfile
						username={this.state.userData.username}
						image={this.state.userData.image}
						wins={this.state.userData.wins}
						losses={this.state.userData.losses}
						balance={this.state.userData.balance}
						logoutFunc={this.logout.bind(this)}
						userToken={this.state.userData.token}
						closeButtonFunction={this.toggleProfile.bind(this)}
					/>

						
					
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