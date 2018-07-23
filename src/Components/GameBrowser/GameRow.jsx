import React, { Component } from 'react'

class GameRow extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<tr onClick={this.props.onClick} data-gamecode={this.props.gameCode} className={this.props.isSelected?'selected':''}>
				<td data-label="Game Code">{this.props.gameCode}</td>
				<td data-label="Game Started">{this.props.gameStarted?'Yes':'No'}</td>
				<td data-label="Game Done">{this.props.gameDone?'Yes':'No'}</td>
				<td data-label="Users">{this.props.userCount}/4</td>
				<td data-label="Host">{this.props.host.username}</td>
			</tr>
		)
	}
}

export default GameRow