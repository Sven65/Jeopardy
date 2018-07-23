import React, { Component } from 'react'

import store from './../../store'

import Button from '../Common/Button'
import GameRow from './GameRow'

class GameBrowser extends Component {
	constructor(props){
		super(props)

		this.state = {
			gameBrowser: {
				games: []
			}
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})

		store.dispatch({type: "s/GET_GAME_BROWSER"})
	}

	render(){
		return (
			<div className="container gamebrowser">
				<div className="wrapper">
					<table className="table gamebrowser__table is-scrollable">
						<thead>
							<tr>
								<th>Game Code</th>
								<th>Game Started</th>
								<th>Game Done</th>
								<th>Users</th>
								<th>Host</th>
							</tr>
						</thead>
						<tbody>
							{this.state.gameBrowser.games.map(game => {
								return (<GameRow gameCode={game.roomID} isSelected={game.roomID===this.props.selectedGame} gameStarted={game.isStarted} gameDone={game.gameOver||false} userCount={game.users.length} host={game.users.filter(user => user.host)[0]||{username: "???"}} onClick={this.props.rowClick}/>)
							})}
						</tbody>
						
					</table>
				</div>
				<form className="mdl-form gameBrowser-button-holder">
					<Button type="button" name="join" id="joinButton" text="Join Game" icon="send" onClick={this.props.joinGame} className="btn-submit" Ref={this.props.joinRef}/>
					<Button type="button" name="host" id="hostButton" text="Host Game" icon="send" onClick={this.props.hostGame} className="btn-submit" Ref={this.props.hostRef}/>
				</form>
			</div>
		)
	}
}

export default GameBrowser