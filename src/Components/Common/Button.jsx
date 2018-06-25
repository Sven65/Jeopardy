import React, { Component } from 'react'

class Button extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<button className="btn waves-effect waves-light fw-button" type={this.props.type} name={this.props.name||""} id={this.props.id} onClick={this.props.onClick}>
				{this.props.text}
				{this.props.icon !== undefined &&
					<i className="material-icons right">{this.props.icon}</i>
				}
			</button>
		)
	}
}

export default Button