import React, { Component } from 'react'
import TimerLine from './TimerLine'

import tick from '../../Assets/tick.wav'
import tock from '../../Assets/tock.wav'

class UserCard extends Component {
	constructor(props){
		super(props)
	
		this.getClassName = this.getClassName.bind(this)

		this._tickAudio = React.createRef()
		this._tockAudio = React.createRef()
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

		if(this.props.playAudio === 0){
			this._tickAudio.play()
		}else if(this.props.playAudio === 1){
			this._tockAudio.play()
		}

		return (
			<div className={"column user-card "+(this.getClassName())} data-userid={this.props.userID}>
				<div className="card">
					<div className="card-image">
						<figure className="image is-192x192">
							<img src={this.props.image}/>
							<TimerLine timeLeft={this.props.timeLeft} maxTime={this.props.maxTime}/>
							
							<audio ref={el => this._tickAudio = el} src={tick}/>
							<audio ref={el => this._tockAudio = el} src={tock}/>
						</figure>
						
					</div>
					<div className="media">
						<div className="media-content">
							<p className="title is-4">{this.props.username} - ${this.props.balance}</p>
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