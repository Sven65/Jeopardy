import React, { Component } from 'react'

class InputField extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className={"group "+(this.props.hidden?'hidden':'')}>
				<input id={this.props.id} autoComplete={this.props.autoComplete} type={this.props.type} className="validate" value={this.props.value} ref={this.props.inputRef} onKeyDown={this.props.onKeyDown} onChange={this.props.onChange} required="required"/>
				<span className="highlight"></span><span className="bar"></span>
				<label>{this.props.label}</label>
			</div>
		)
	}
}

export default InputField