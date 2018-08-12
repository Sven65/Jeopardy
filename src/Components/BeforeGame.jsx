import React, { Component } from 'react'

import Loadable from 'react-loadable'
import Loader from './Common/Loader'

const GameBrowser = Loadable({
	loader: () => import('./GameBrowser'),
	loading: Loader,
})

import BoardPicker from './Common/BoardPicker'
import InputField from './Common/InputField'
import Button from './Common/Button'

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
			user: {
				userData: {}
			},
			game: {
				validUserBoards: [],
				error: null
			},
			joinClick: false,
			selectedGame: "",
			error: null,
			selectedBoard: "default"
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {
				let gameCode = history.location.hash.replace(/#/, "").replace(/\%20/g, " ")

				if(gameCode !== undefined && gameCode !== ""){
					this.roomIDInput.value = gameCode
					if(!this.state.joinClick){
						this.joinButton.click()
						this.setState({joinClick: true, selectedGame: gameCode})
					}
				}

				if(this.state.game.error !== null && this.state.game.error !== undefined){
					if(this.state.game.error.reason !== undefined){
						let error = this.state.game.error.reason
						
						swal("Error!", error, "error").then(() => {
							store.dispatch({type: "RESET_ERROR"})
						})
						
					}
				}

				if(this.state.game.validUserBoards.length > 0 && (this.state.game.roomID === null || this.state.game.roomID === undefined || this.state.game.roomID === "")){
					swal(
						<BoardPicker boards={this.state.game.validUserBoards} onSelect={this._selectBoard}/>, {
							title: "Please select a board"
						}
					).then(() => {
						this.setState({validUserBoards: [], joinClick: true})
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
			let username = Object.keys(this.state.user.userData).length>0?this.state.user.userData:this.usernameInput.value

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
			user: Object.keys(this.state.user.userData).length>0?this.state.user.userData:{
				username: username
			},
			boardID: this.state.selectedBoard
		}})
	}

	joinGame(){
		let username = Object.keys(this.state.user.userData).length>0?this.state.user.userData:""

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
		let username = Object.keys(this.state.user.userData).length>0?this.state.user.userData:this.usernameInput.value

		this.getRoomID().then(roomID => {
			if(username.length <= 0){
				this.joinGame()
			}else{

				store.dispatch({type: "s/GET_USER_VALID_BOARDS", data: {
					userToken: this.state.user.userData.token
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
											Sed fermentum mi tellus, id placerat nibh semper eget.
											Sed dapibus, diam sed mattis congue, tortor mauris sodales risus, at dignissim quam elit in eros.
											Aliquam vulputate non dui et suscipit.
											Nunc gravida auctor arcu vitae hendrerit.
											Quisque nec consequat neque, non lobortis sapien.
											Curabitur consequat velit mi, id mattis lacus condimentum sit amet.
											Sed volutpat felis libero, a faucibus tortor luctus non.
											Vestibulum nec bibendum urna. Curabitur vitae pulvinar neque.
											Quisque convallis nisi lobortis, sodales risus vitae, tincidunt velit.
											Etiam pulvinar malesuada erat, in imperdiet leo venenatis id.
											Interdum et malesuada fames ac ante ipsum primis in faucibus. 
											Fusce et rhoncus purus, ac dictum enim.
											Curabitur at quam vitae diam dapibus fermentum.
											Aliquam nisi magna, sollicitudin nec eros eget, vulputate fringilla est.
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