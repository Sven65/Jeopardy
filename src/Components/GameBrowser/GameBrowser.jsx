import React, { Component } from 'react'

import store from './../../store'

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
								return (<GameRow gameCode={game.roomID} gameStarted={game.isStarted} gameDone={game.gameOver||false} userCount={game.users.length} host={game.users.filter(user => user.host)[0]||{username: "???"}}/>)
							})}
						</tbody>
						
					</table>
				</div>
			</div>
		)
	}
}

export default GameBrowser