import React, { Component } from 'react'

class UserCard extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="col l3 s4 user-card" data-userid={this.props.userID}>
				<div className="card">
					<div className="card-image">
						<img src={this.props.image}/>
						<span className="card-title">{this.props.username}</span>
					</div>
					<div className="card-content">
						<p className="balance">${this.props.balance}</p>
					</div>
				</div>
			</div>
		)
	}
}

export default UserCard