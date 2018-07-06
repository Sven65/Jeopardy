import React, { Component } from 'react'

import InputField from './Common/InputField'
import Button from './Common/Button'

import store from './../store'

class BeforeGame extends Component {
	constructor(props){
		super(props)

		this.joinGame = this.joinGame.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)

		this.roomIDInput = React.createRef()
		this.usernameInput = React.createRef()

		this.state = {
			userData: {}
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
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
								<InputField autoComplete="off" grid={"col s12 "+(this.state.userData.username!==undefined?'hidden':'')} id="username" type="text" label="Username" inputRef={el => this.usernameInput = el} onKeyDown={this.onKeyDown}/>
								<InputField autoComplete="off" grid="col s12" id="roomIDInput" type="text" label="Game Code" inputRef={el => this.roomIDInput = el} onKeyDown={this.onKeyDown}/>
								<Button type="button" name="play" id="playButton" text="Play" icon="send" onClick={this.joinGame} className="btn-submit"/>
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
									Enter a username and a room code that you can share with your friends or get from your friends as this acts as the game identifier, keep in mind that it's case sensitive!

									<p className="light center">The first player that joins a room is designated as the host, and can start the game by clicking the "start game" button when a game has two to four players.</p>

									<p className="light center">When it's a players turn, indicated by a red box around their status card, they can click a question in the table and they then have 15 seconds to answer the question by typing the answer in the chat and sending it, either by clicking the "send" button, or by hitting the enter key.</p>
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