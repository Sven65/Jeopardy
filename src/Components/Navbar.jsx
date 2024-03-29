import React, { Component } from 'react'
import Loadable from 'react-loadable'

import Loader from './Common/Loader'

import UserForm from './Common/UserForm'

import ToggleSwitch from './Common/ToggleSwitch'

import mainLogo from'../Assets/TriviaPartyWhite.svg'

import store from './../store'

const UserProfile = Loadable({
	loader: () => import('./UserProfile'),
	loading: Loader,
})

const BoardAdder = Loadable({
	loader: () => import('./BoardAdder'),
	loading: Loader,
})

class Navbar extends Component {
	constructor(props){
		super(props)

		this.state = {
			user: {
				userData: {},
				userLoggedIn: false
			},
			userFormLoad: false,
			showProfile: false,
			showLoginForm: false,
			showBoardAdder: false,
			showDropdown: false
		}
	
		//this.startGame = this.startGame.bind(this)
		//this.leaveGame = this.leaveGame.bind(this)

		this.privateSwitch = this.privateSwitch.bind(this)
		this._burgerClick = this._burgerClick.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {

			this.setState(store.getState())

			//console.log("MESSAGE", this.state.messages)
		})

		document.addEventListener('closeUserForm', e => {
			this.setState({
				showLoginForm: false
			})
		})
	}

	startGame(){
		store.dispatch({type: "s/GAME_ACTION_START", data: {
			roomID: this.state.game.roomID,
			userID: this.state.game.user.userID
		}})
	}

	leaveGame(){
		store.dispatch({type: "s/USER_ACTION_LEAVE", data: {
			roomID: this.state.game.roomID,
			userID: this.state.game.user.userID
		}})

		store.dispatch({type: "LEAVE"})
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

	toggleBoardAdder(e){
		this.setState({
			showBoardAdder: !this.state.showBoardAdder
		})
	}

	privateSwitch(e){
		store.dispatch({type: "s/SET_GAME_PRIVATE", data: {
			roomID: this.state.game.roomID,
			userID: this.state.game.user.userID,
			isPrivate: e.target.checked
		}})
	}

	_burgerClick(){
		this.setState({
			showDropdown: !this.state.showDropdown
		})
	}

	render(){
		const isLoggedIn = this.state.user.userLoggedIn
		const showProfile = (this.state.user.userLoggedIn && this.state.showProfile)
		const showLoginForm = (this.state.showLoginForm)
		const showBoardAdder = (this.state.showBoardAdder)

		return (
			<nav className="navbar" role="navigation" aria-label="main navigation" id="main-nav">
				<div className="navbar-brand">
					<a className="navbar-item">
						<img src={mainLogo} alt="TriviaParty"/>
						{this.props.roomID!=="" &&
							<span id="gameCodeHeader">Game: {this.props.roomID}</span>
						}
					</a>
					<a role="button" className={"navbar-burger "+(this.state.showDropdown?'is-active':'is-gay')} data-target="navMenu" aria-label="menu" aria-expanded="false" onClick={this._burgerClick}>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>

				<div className={"navbar-menu "+(this.state.showDropdown?'is-active':'')} id="navMenu">
					<div className="navbar-end">
						
						{/* Game Buttons */}
						<a className={"navbar-item no-background "+(this.props.hidePrivateSwitch?'hidden':'')}>
							<ToggleSwitch onChange={this.privateSwitch}/>
						</a>
						<a id="game-button-start" onClick={this.startGame.bind(this)} className={"navbar-item dark-background "+(this.props.hideStartButton?'hidden':'')}>Start Game <i className="mdi mdi-18px mdi-play"></i></a>
						<a id="game-button-leave" onClick={this.leaveGame.bind(this)} className={"navbar-item dark-background "+(this.props.hideLeaveButton?'hidden':'')}>Leave Game <i className="mdi mdi-18px mdi-exit-to-app"></i></a>
						{/* End Game Buttons */}

						<div className="navbar-item has-dropdown is-hoverable">
							{/* User stuff */}
							<a className="navbar-link user-link">
								<i className="mdi mdi-account"></i>{!isLoggedIn?"User":this.state.user.userData.username}
							</a>

							{!isLoggedIn?(
								<div className="navbar-dropdown">
									<a className="navbar-item" onClick={this.toggleLoginForm.bind(this)}>
										<a className="modal-trigger" id="usermodal-trigger">Login</a>
									</a>
								</div>
							) : (
								<div className="navbar-dropdown">
									<a className="navbar-item" onClick={this.toggleProfile.bind(this)}>
										<a className="modal-trigger" id="userprofile-trigger">Profile</a>
									</a>

									<a className="navbar-item" onClick={this.toggleBoardAdder.bind(this)}>
										<a className="modal-trigger" id="boardAdder-trigger">Game Boards</a>
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
					<UserForm closeButtonFunction={this.toggleLoginForm.bind(this)}/>
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
						username={this.state.user.userData.username}
						image={this.state.user.userData.image}
						wins={this.state.user.userData.wins}
						losses={this.state.user.userData.losses}
						balance={this.state.user.userData.balance}
						logoutFunc={this.logout.bind(this)}
						userToken={this.state.user.userData.token}
						closeButtonFunction={this.toggleProfile.bind(this)}
						selectedTheme={this.state.user.userData.theme}
						unlockedColors={this.state.user.userData.unlockedColors}
					/>
				}

				{showBoardAdder &&
					<BoardAdder
						closeButtonFunction={this.toggleBoardAdder.bind(this)}
						userToken={this.state.user.userData.token}
					/>
				}

				{(() => {
					if(isLoggedIn){
						if(!this.state.userRegistered){
							let event = new Event("USER_FORM_DONE")
							let target = document.querySelector('#usermodal-holder');
							target.dispatchEvent(event);
						}
					}
				})()}
			</nav>
		)
	}
}

export default Navbar