import React, { Component } from 'react'

import InputField from './Common/InputField'
import Button from './Common/Button'

import GameBrowser from './GameBrowser'
import BoardPicker from './Common/BoardPicker'

import swal from './SweetAlert'

import store from './../store'
import history from './../history'

class BeforeGame extends Component {
	constructor(props){
		super(props)

		this.joinGame = this.joinGame.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
		this.hostGame = this.hostGame.bind(this)
		this.rowClick = this.rowClick.bind(this)
		this.getUsername = this.getUsername.bind(this)
		this.getRoomID = this.getRoomID.bind(this)
		this._sendJoin = this._sendJoin.bind(this)
		this._selectBoard = this._selectBoard.bind(this)


		this.roomIDInput = React.createRef()
		this.usernameInput = React.createRef()
		this.joinButton = React.createRef()
		this.hostButton = React.createRef()

		this.state = {
			userData: {},
			joinClick: false,
			selectedGame: "",
			error: null,
			selectedBoard: "default",
			validUserBoards: []
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {
				let gameCode = history.location.hash.replace(/#/, "").replace(/\%20/g, " ")

				if(gameCode !== undefined && gameCode !== ""){
					this.roomIDInput.value = gameCode
					if(!this.state.joinClick){
						console.log("CLICK JB")
						this.joinButton.click()
						this.setState({joinClick: true, selectedGame: gameCode})
					}
				}

				if(this.state.error !== null && this.state.error !== undefined){
					if(this.state.error.reason !== undefined){
						let error = this.state.error.reason
						store.dispatch({type: "RESET_ERROR"})
						swal("Error!", error, "error");
						
					}
				}

				if(this.state.validUserBoards.length > 0 && this.state.roomID !== null && this.state.roomID !== undefined){
					swal(
						<BoardPicker boards={this.state.validUserBoards} onSelect={this._selectBoard}/>, {
							title: "Please select a board"
						}
					).then(() => {
						this.setState({validUserBoards: []})
						this.joinGame()
					})
				}
			})
		})
	}

	getUsername(){
		return new Promise((resolve, reject) => {
			let swalField = document.createElement('input');
			swalField.setAttribute("placeholder", "Username");
			swalField.setAttribute("type", "text");
			swalField.setAttribute("required", "true");
			swalField.classList.add("swal-content__input");

			swal({
				title: 'Please enter a username',
				content: swalField,
				buttons: {
					cancel: "Cancel",
					go: {
						text: "Play!",
						closeModal: false,
						value: 1
					}
				}
			}).then(val => {

				if (!val || val === null){
					swal.stopLoading();
					swal.close();

					return
				}

				let username = swalField.value

				if(!username) throw null

				this.usernameInput.value = username

				swal.stopLoading();
				swal.close();

				resolve(username)

			}).catch(err => {
				if (err) {
					swal("Oh noes!", "The AJAX request failed!", "error");
				} else {
					swal({
						title: "Error.",
						text: "No username entered.",
						icon: "error",
						button: "Try again"
					}).then(e => {
						this.getUsername()
					})
				}
			});
		})
	}

	getRoomID(){
		return new Promise((resolve, reject) => {
			let username = Object.keys(this.state.userData).length>0?this.state.userData:this.usernameInput.value

			let swalField = document.createElement('input');
			swalField.setAttribute("placeholder", "Room ID");
			swalField.setAttribute("type", "text");
			swalField.setAttribute("required", "true");
			swalField.classList.add("swal-content__input");

			swal({
				title: 'Please enter a room ID',
				content: swalField,
				buttons: {
					cancel: "Cancel",
					go: {
						text: "Host!",
						closeModal: false,
						value: 1
					}
				}
			}).then(val => {

				if (!val || val === null){
					swal.stopLoading();
					swal.close();

					return
				}

				let roomID = swalField.value

				if(!roomID) throw null

				this.roomIDInput.value = roomID

				swal.stopLoading();
				swal.close();

				resolve(roomID)

			}).catch(err => {
				if (err) {
					swal("Oh noes!", "The AJAX request failed!", "error");
				} else {
					swal({
						title: "Error.",
						text: "No Room ID entered.",
						icon: "error",
						button: "Try again"
					}).then(e => {
						resolve(this.getRoomID())
					})
				}
			});
		})
	}

	_sendJoin(username){
		store.dispatch({type: "s/JOIN", data: {
			roomID: this.roomIDInput.value,
			user: Object.keys(this.state.userData).length>0?this.state.userData:{
				username: username
			},
			boardID: this.state.selectedBoard
		}})
	}

	joinGame(){
		let username = Object.keys(this.state.userData).length>0?this.state.userData:""

		if(username.length <= 0){
			this.getUsername().then(username => {
				this.usernameInput.value = username
				this._sendJoin(username)
			})
		}else{
			this._sendJoin(username)
		}
	}

	_selectBoard(board){
		this.setState({
			selectedBoard: board.id
		})
	}

	hostGame(){
		let username = Object.keys(this.state.userData).length>0?this.state.userData:this.usernameInput.value

		this.getRoomID().then(roomID => {
			if(username.length <= 0){
				this.joinGame()
			}else{

				store.dispatch({type: "s/GET_USER_VALID_BOARDS", data: {
					userToken: this.state.userData.token
				}})
			}
		})
	}

	rowClick(e){
		let clickedRow = e.target.parentNode
		let gameCode = clickedRow.dataset.gamecode

		this.roomIDInput.value = gameCode

		this.setState({
			selectedGame: gameCode
		})
	}

	onKeyDown(e){
		if(e.keyCode === 13){
			this.joinGame()
		}
	}

	render(){
		return (
			<div className={"scroller" + (this.props.hidden?'hidden':'')}>
				<div className={"section " + (this.props.hidden?'hidden':'')}>
					<div className="container" id="instructions-container">
						<div className="tile is-ancestor">
							<div className="columns">

								<div className="column">
									<div className="tile is-vertical is-parent">
										<p className="title">What is TriviaParty?</p>
										<p className="subtitle"></p>
										<div className="content">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Sed lectus nisl, porttitor sed tellus quis, malesuada euismod nunc.
											Morbi sodales id neque eget eleifend. Nunc id turpis consectetur, euismod metus in, laoreet libero.
											Suspendisse ullamcorper mattis est, dictum pulvinar nibh rutrum nec.
											Vivamus sollicitudin ante odio, ut aliquam lorem pellentesque in.
											Pellentesque auctor orci at consectetur suscipit.
											Praesent id leo vestibulum, egestas nulla et, auctor purus.
											Ut fermentum dignissim molestie. Maecenas tincidunt ac turpis et molestie.
											Suspendisse consequat, enim eu tincidunt sagittis, urna libero commodo lacus, ac luctus nulla nisi quis lacus.
											Phasellus tristique massa a tempus elementum. Morbi felis nunc, iaculis id justo ac, dignissim vulputate lacus.
											Aliquam placerat non sapien in tincidunt.
										</div>
									</div>
								</div>

								<div className="column">
									<div className="tile is-vertical is-parent">
										<p className="title">How do I play?</p>
										<p className="subtitle"></p>
										<div className="content">
											<ul>
												<li>
													To join an existing game, click it in the list below, then click the "join game" button, enter a username and you'll be in the game!
												</li>

												<li>
													To start a new game, click the "host game" button and enter a room code that you can share with your friends to play together, keep in mind that it's case sensitive!
												</li>

												<li>
													<p className="light center">The first player that joins a room is designated as the host, and can start the game by clicking the "start game" button when a game has one to four players.</p>
												</li>

												<li>
													<p className="light center">Player turns are designated by a red box around the Player Card. When it's your turn, click on a question, type your answer in the answer field, then click on send or hit enter on your keyboard. Remember, you only have 15 seconds to answer!</p>
												</li>
											</ul>
										</div>
									</div>
								</div>


							</div>
						</div>
					</div>
				</div>
				<div className={"section " + (this.props.hidden?'hidden':'')} id="beforeGame">
					<GameBrowser selectedGame={this.state.selectedGame} joinGame={this.joinGame} joinRef={el => this.joinButton = el} hostGame={this.hostGame} hostRef={el => this.hostButton = el} rowClick={this.rowClick}/>
					<br/>

					<form className="mdl-form">
						<InputField autoComplete="off" hidden={true} id="bfg-username" type="text" label="Username" inputRef={el => this.usernameInput = el} onKeyDown={this.onKeyDown}/>
						<InputField autoComplete="off" hidden={true} grid="col s12" id="roomIDInput" type="text" label="Game Code" inputRef={el => this.roomIDInput = el} onKeyDown={this.onKeyDown}/>
					</form>
				</div>
				<br/><br/>
			</div>
		)
	}
}

export default BeforeGame