import React, { Component } from 'react'


import UserCard from './Common/UserCard'
import QuestionCard from './Common/QuestionCard'
import QuestionTable from './Common/QuestionTable'
import Chat from './Chat'
import Loader from './Common/Loader'

import store from './../store'

class GameArea extends Component {
	constructor(props){
		super(props)

		this.state = {
			users: [],
			currentQuestion: {},
			clues: {}
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	render(){
		if(Object.keys(this.state.clues).length<=0){
			document.body.style.overflow = "hidden";
		}else{
			document.body.style.overflow = "scroll";
		}

		return (
			<div className={"section no-pad-bot " + (this.props.hidden?'hidden':'')} id="gameArea">
				{Object.keys(this.state.clues).length<=0 &&
					<div className="loader-holder">
						<Loader />
					</div>
				}
				<div className="container">
					<div className="row">
						{/* Start User Stats */}
						<div className="col l8 s12 left" id="stat-container">
							<div className="row" id="card-container">
								{this.props.users.map((user, i) => {
									return (<UserCard userID={user.userID} image="http://placehold.it/128x128" username={user.username} balance={user.balance} isTurn={user.isTurn&&this.state.gameStarted} />)
								})}
								
							</div>
						</div>
						{/* End User Stats */}

						{/* Start question area */}

						<QuestionCard question={this.state.currentQuestion}/>

						{/* End question area */}

						{/* Start table area */}

						<QuestionTable values={this.props.values}/>

						{/* End table area */}
					</div>

					{/* Start Chat Area */}

					<Chat/>

					{/* End Chat Area */}

				</div>
			</div>
		)
	}
}

export default GameArea