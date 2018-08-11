import React, { Component } from 'react'
import io from 'socket.io-client';
import $ from "jquery";

window.$ = $;

import 'bulma/css/bulma.css'
import './../styles/main/main.scss'

import './../styles/loaders.min.css'

import './../General/init.js'

//import {socket, socketDebug, getQuestions } from '../api'
import Navbar from './Navbar'
import BeforeGame from './BeforeGame'
import GameArea from './GameArea'

import Footer from './Common/Footer'
import Alert from './Common/Alert'
import Loader from './Common/Loader'

import FAB from './Common/FAB'

import swal from 'sweetalert'

import store from '../store'

class App extends Component {
	constructor(props){
		super(props)

		this.state = {
			
			user: {
				userData: {},
				verifyEmailError: ""
			},
			error: {

			},
			game: {
				gameStarted: false,
				gameDone: false,
				standings: [],
				roomID: "",
				joinedUsers: [],
				users: [],
				questionsLoaded: false,
				user: {}
			},
			loader: {
				isLoading: false
			}
		}


		this.setUserData = this.setUserData.bind(this)
	}

	setUserData(){
		let data = {
			username: this.state.user.userData.username,
			token: this.state.user.userData.token,
			setAt: Date.now()
		}

		localStorage.setItem('userData', btoa(JSON.stringify(data)));
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {

				if(this.state.user.userData !== undefined && this.state.user.userData !== null && Object.keys(this.state.user.userData).length>0 && this.state.user.userLoggedIn){
					this.setUserData()

					if(this.state.user.userData.theme !== ""){
						document.body.classList = ""
						document.body.classList.add(`theme-${this.state.user.userData.theme}`)
					}
				}

				if(this.state.user.appEmailSent && !this.state.loader.isLoading && Object.keys(this.state.user.userData).length>0){
					swal("Email sent!", "Please check your inbox for further instructions!", "success");
				}else if(!this.state.user.appEmailSent && !this.state.loader.isLoading && this.state.user.verifyEmailError !== "" && Object.keys(this.state.user.userData).length>0){
					swal("Error!", this.state.user.verifyEmailError, "error");
				}


			})

			// TODO: Make this have an expiry

			
		})

		if(Object.keys(this.state.user.userData).length <= 0){
			store.dispatch({type: "INIT_GET_USER_DATA"})
		}
	}

	sendVerificationEmail(){
		store.dispatch({type: "s/SEND_VERIFICATION_EMAIL", data: {
			token: this.state.user.userData.token
		}})
	}

	discordFABClick(){
		window.open(CONFIG.discordLink, "_blank")
	}

	render(){
		const showVerifyBanner = Object.keys(this.state.user.userData).length>0&&!this.state.user.userData.emailVerified

		return (
			<div className="App">

				{this.state.loader.isLoading &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{showVerifyBanner &&
					<Alert message={
						<span>
							Hey you! You haven't verified your email yet! Please do so by clicking anywhere on this message!
						</span>
					} onClick={this.sendVerificationEmail.bind(this)} type="danger"/>
				}

				<Navbar roomID={this.state.game.roomID} hideLeaveButton={this.state.game.roomID===""} hideStartButton={(this.state.game.gameStarted || !this.state.game.user.host)} hidePrivateSwitch={(this.state.game.roomID === "" || !this.state.game.user.host)}/>

				<div className={"scroll-wrapper" + (this.state.game.roomID!==""?'hidden':'')}>
					<BeforeGame hidden={this.state.game.roomID!==""}/>
				</div>
				<GameArea hidden={this.state.game.roomID===""} categories={[
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
				]} users={this.state.game.users}/>
				<FAB icon="discord" text="Join our Discord!" onClick={this.discordFABClick}/>
			</div>
		)
	}
}

export default App