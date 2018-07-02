import React, { Component } from 'react'

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
			<div className={"col l3 s4 user-card "+(this.getClassName())} data-userid={this.props.userID}>
				<div className="card">
					<div className="card-image">
						<img src={this.props.image}/>
						<span className="card-title">{this.props.username}</span>
					</div>
					<div className="card-content">
						<p className="balance">${this.props.balance}</p>
						{this.props.extraContent}
					</div>
				</div>
			</div>
		)
	}
}

export default UserCard