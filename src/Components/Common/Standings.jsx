import React, { Component } from 'react'
import UserCard from './UserCard'

class Standings extends Component {
	constructor(props){
		super(props)
	}

	getPlaceString(i){
		return [
			"1st",
			"2nd",
			"3rd",
			"4th"
		][i]
	}

	render(){
		return (
			<div className="loader-holder">
				<div className="absolute-center standings">
					<h2>Game Over!</h2>
					<div className="standings-holder">
						{this.props.standings.map((user, i) => {
							return (<UserCard userID={user.userID} image={user.image} username={user.username} balance={user.balance} extraContent={
								<p className="position">Position: {this.getPlaceString(i)}</p>
							}/>)
						})}
					</div>
				</div>
			</div>
		)
	}
}

export default Standings