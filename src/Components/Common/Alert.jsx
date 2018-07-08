import React, { Component } from 'react'

class Alert extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<nav className={"alert alert-"+(this.props.type)} onClick={this.props.onClick}>
				<div className="nav-wrapper">
					<span className="left" style={{paddingLeft: "15px"}}>{this.props.message}</span>
				</div>
			</nav>
		)
	}
}

export default Alert