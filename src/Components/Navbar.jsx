import React, { Component } from 'react'

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
			gameCode: this.state.roomID,
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
				<div className="nav-wrapper container">
					<a id="logo-container" href="#" className="brand-logo">TriviaParty - <span id="gameCodeHeader">{this.props.gameCode}</span></a>

					<ul id="game-buttons" className={"right "+(this.props.hideButtons?'hidden':'')}>
						{!this.props.hideStartButton &&
							<li>
								<a id="game-button-start" onClick={this.startGame.bind(this)}>Start Game <i className="material-icons right">play_arrow</i></a>
							</li>
						}
						<li><a id="game-button-leave" onClick={this.leaveGame.bind(this)}>Leave Game <i className="material-icons right">exit_to_app</i></a></li>
					</ul>
				</div>
			</nav>
		)
	}
}

export default Navbar