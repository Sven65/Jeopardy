import React, { Component } from 'react'

import Loadable from 'react-loadable'
import Loader from './Common/Loader'

const UserCard = Loadable({
	loader: () => import('./Common/UserCard'),
	loading: Loader,
})

const QuestionCard = Loadable({
	loader: () => import('./Common/QuestionCard'),
	loading: Loader,
})

const QuestionTable = Loadable({
	loader: () => import('./Common/QuestionTable'),
	loading: Loader,
})

const Chat = Loadable({
	loader: () => import('./Chat'),
	loading: Loader,
})

const Standings = Loadable({
	loader: () => import('./Common/Standings'),
	loading: Loader,
})

import GoogleAd from './Common/GoogleAd'

import store from './../store'

class GameArea extends Component {
	constructor(props){
		super(props)

		this.state = {
			game: {
				users: [],
				currentQuestion: {},
				clues: {},
				standings: {}
			}
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
				{user.isRegistered&&<span className="hover" title="Registered User!">🌟</span>}
			</div>
		)
	}

	render(){
		if(Object.keys(this.state.game.clues).length<=0 && this.state.game.roomID !== undefined || this.state.game.gameDone){
			document.body.style.overflow = "hidden";
		}else{
			document.body.style.overflow = "";
		}

		return (
			<div className={"section no-pad-bot " + (this.props.hidden?'hidden':'')} id="gameArea">
				{Object.keys(this.state.game.clues).length<=0 &&
					<div className="loader-holder">
						<Loader />
					</div>
				}

				{this.state.gameDone &&
					<Standings standings={this.state.game.standings}/>
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
													isTurn={user.isTurn&&this.state.game.gameStarted}
													timeLeft={user.timeLeft}
													maxTime={15}
													playAudio={user.timeLeft===0?-1:user.timeLeft%2}
													key={user.userID}
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

										<QuestionCard question={this.state.game.currentQuestion}/>
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
							<article className="tile is-child is-12">
								<div className="card">
									<Chat/>
								</div>
							</article>
							<article className="tile is-child is-12">
								<GoogleAd
									adClient="ca-pub-8672763383629607"
									adSlot="9283614809"
									adFormat="auto"
								/>
							</article>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default GameArea