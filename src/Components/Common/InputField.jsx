import React, { Component } from 'react'

class InputField extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className={"input-field " + (this.props.grid)}>
				<input id={this.props.id} type={this.props.type} className="validate" value={this.props.value} ref={this.props.inputRef}/>
				<label htmlFor={this.props.id}>{this.props.label}</label>
			</div>
		)
	}
}

export default InputField