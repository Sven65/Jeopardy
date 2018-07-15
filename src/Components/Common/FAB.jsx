// Totally not stolen from https://codepen.io/SinceSidSlid/pen/vExJaP

import React, { Component } from 'react'

class FAB extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="FAB__action-button" onClick={this.props.onClick}>
				<span className="action-button__text">{this.props.text}</span>
				<span className="action-button__icon icon has-text-white is-large">
					<i className={"mdi mdi mdi-36px mdi-"+this.props.icon}></i>
				</span>
			</div>
		
		)
	}
}

export default FAB