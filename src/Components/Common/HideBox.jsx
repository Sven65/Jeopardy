import React, { Component } from 'react'

class HideBox extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className={this.props.hidden?'hidden':''}>
				{this.props.children}
			</div>
		)
	}
}

export default HideBox