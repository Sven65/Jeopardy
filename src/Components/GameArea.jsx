import React, { Component } from 'react'


import UserCard from './Common/UserCard'
import QuestionCard from './Common/QuestionCard'
import QuestionTable from './Common/QuestionTable'
import Chat from './Chat'
import Loader from './Common/Loader'
import Standings from './Common/Standings'

import store from './../store'

class GameArea extends Component {
	constructor(props){
		super(props)

		this.state = {
			users: [],
			currentQuestion: {},
			clues: {},
			standings: {}
		}
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	getBadges(user){
		return (
			<div className="badges">
				{user.isRegistered&&<span class="hover" title="Registered User!">🌟</span>}
			</div>
		)
	}

	render(){
		if(Object.keys(this.state.clues).length<=0 && this.state.roomID !== undefined || this.state.gameDone){
			document.body.style.overflow = "hidden";
		}else{
			document.body.style.overflow = "";
		}

		return (
			<div className={"section no-pad-bot " + (this.props.hidden?'hidden':'')} id="gameArea">
				{Object.keys(this.state.clues).length<=0 &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{this.state.gameDone &&
					<Standings standings={this.state.standings}/>
				}

				{/*
					Start layout here
				 */}
				 <div className="container">
				 <div className="tile is-ancestor">
					<div className="tile is-vertical is-8">
						<div className="tile is-parent">
							<article className="tile is-child">
								{/* Start User Stats */}
								<div className="columns">
									{this.props.users.map((user, i) => {
										return (
											<UserCard
												userID={user.userID}
												image={user.image}
												username={user.username}
												extraContent={this.getBadges(user)}
												balance={user.balance}
												isTurn={user.isTurn&&this.state.gameStarted}
												timeLeft={user.timeLeft}
												maxTime={15}
											/>)
									})}
								</div>
								{/* End User Stats */}
							</article>
						</div>
						<div className="tile">
							<div className="tile is-parent is-vertical">
								<article className="tile is-child">
									{/* Start question area */}

									<QuestionCard question={this.state.currentQuestion}/>
									{/* End question area */}
								</article>
								<article className="tile is-child">
									{/* Start table area */}

									<QuestionTable values={this.props.values}/>

									{/* End table area */}
								</article>
							</div>
							
						</div>
						
					</div>
					<div className="tile is-parent">
						<article className="tile is-child">
							<div className="card">
								<Chat/>
							</div>
						</article>
					</div>
				</div>
			</div>
			</div>
		)
	}
}

export default GameArea