import React, { Component } from 'react'

import InputField from './Common/InputField'
import Button from './Common/Button'

import store from './../store'
import history, {parseQueryString} from './../history'

class BeforeGame extends Component {
	constructor(props){
		super(props)

		this.joinGame = this.joinGame.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)

		this.roomIDInput = React.createRef()
		this.usernameInput = React.createRef()
		this.joinButton = React.createRef()

		this.state = {
			userData: {},
			joinClick: false
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {
				console.log(history.location)

				//let queryData = parseQueryString(history.location.search)

				let gameCode = history.location.hash.replace(/#/, "")

				if(gameCode !== undefined && gameCode !== ""){
					this.roomIDInput.value = gameCode
					if(Object.keys(this.state.userData).length>0){
						if(!this.state.joinClick){
							this.joinButton.click()
							this.setState({joinClick: true})
						}
					}
				}
			})
		})

		//console.log("queryData", queryData.game)
	}

	joinGame(){
		store.dispatch({type: "s/JOIN", data: {
			roomID: this.roomIDInput.value,
			user: Object.keys(this.state.userData).length>0?this.state.userData:{
				username: this.usernameInput.value
			}
		}})
	}

	onKeyDown(e){
		if(e.keyCode === 13){
			this.joinGame()
		}
	}

	render(){
		return (
			<div>
				<div className={"section " + (this.props.hidden?'hidden':'')} id="beforeGame">
					<div className="container">
						<div className="wrapper">

							<form className="mdl-form">
								<h1 className="title">{this.props.headerText}</h1>
								<InputField autoComplete="off" hidden={(this.state.userData.username!==undefined)} id="bfg-username" type="text" label="Username" inputRef={el => this.usernameInput = el} onKeyDown={this.onKeyDown}/>
								<InputField autoComplete="off" grid="col s12" id="roomIDInput" type="text" label="Game Code" inputRef={el => this.roomIDInput = el} onKeyDown={this.onKeyDown}/>
								<Button type="button" name="play" id="playButton" text="Play" icon="send" onClick={this.joinGame} className="btn-submit" Ref={el => this.joinButton = el}/>
							</form>
						</div>
					</div>
				</div>
				<div className={"section " + (this.props.hidden?'hidden':'')}>
					<div className="container" id="instructions-container">
						<div className="tile is-ancestor">
							<div className="tile is-vertical is-parent">
								<p className="title">Instructions</p>
								<p className="subtitle">Playing</p>
								<div className="content">
									<ul>
										<li>
											Enter a username and a room code that you can share with your friends to play together, keep in mind that it's case sensitive!
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
		)
	}
}

export default BeforeGame