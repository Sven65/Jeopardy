import React, { Component } from 'react'
import TimerLine from './TimerLine'

class UserCard extends Component {
	constructor(props){
		super(props)
	
		this.getClassName = this.getClassName.bind(this)
	}

	getClassName(){
		let className = ""

		if(this.props.isTurn){
			className += " isTurn"
		}

		if(this.props.isRegistered){
			className += " isRegistered"
		}

		return className
	}

	render(){

		return (
			<div className={"column user-card "+(this.getClassName())} data-userid={this.props.userID}>
				<div className="card">
					<div className="card-image">
						<figure class="image is-128x128">
							<img src={this.props.image}/>
							<TimerLine timeLeft={this.props.timeLeft} maxTime={this.props.maxTime}/>
						</figure>
						
					</div>
					<div className="media">
						<div className="media-content">
							<p className="title is-4">{this.props.username}</p>
							<p className="subtitle is-8">${this.props.balance}</p>
						</div>
					</div>
					<div className="content">
						{this.props.extraContent}
					</div>
				</div>
			</div>
		)
	}
}

export default UserCard