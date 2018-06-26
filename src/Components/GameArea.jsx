import React, { Component } from 'react'

import UserCard from './Common/UserCard'
import QuestionCard from './Common/QuestionCard'
import QuestionTable from './Common/QuestionTable'

import store from './../store'

class GameArea extends Component {
	constructor(props){
		super(props)

		this.state = {
			users: []
		}
	}
	
	render(){
		return (
			<div className={"section no-pad-bot " + (this.props.hidden?'hidden':'')} id="gameArea">
				<div className="container">
					<div className="row">
						{/* Start User Stats */}
						<div className="col l8 s12 left" id="stat-container">
							<div className="row" id="card-container">
								{this.props.users.map((user, i) => {
									return (<UserCard userID={user.userID} image="http://placehold.it/128x128" username={user.username} balance={user.balance}/>)
								})}
								
							</div>
						</div>
						{/* End User Stats */}

						{/* Start question area */}

						<QuestionCard title="Question" clue="This is the clue"/>

						{/* End question area */}

						{/* Start table area */}

						<QuestionTable categories={this.props.categories} values={this.props.values}/>

						{/* End table area */}
					</div>
				</div>
			</div>
		)
	}
}

export default GameArea