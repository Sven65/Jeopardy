import React, { Component } from 'react'

class InputField extends Component {
	constructor(props){
		super(props)
	}

	render(){
		/*return (
			<div className="control">				
				<label className="label" htmlFor={this.props.id}>{this.props.label}</label>
				<input id={this.props.id} type={this.props.type} className="input" value={this.props.value} ref={this.props.inputRef} onKeyDown={this.props.onKeyDown}/>
				<i className="bar"></i>
			</div>
		)*/

		/*return (
			<div className={"input-field " + (this.props.grid)}>
				<input id={this.props.id} type={this.props.type} className="validate" value={this.props.value} ref={this.props.inputRef} onKeyDown={this.props.onKeyDown}/>
				<label htmlFor={this.props.id}>{this.props.label}</label>
			</div>
		)*/

		return (
			<div className={"group "+(this.props.hidden?'hidden':'')}>
				<input id={this.props.id} autoComplete={this.props.autoComplete} type={this.props.type} className="validate" value={this.props.value} ref={this.props.inputRef} onKeyDown={this.props.onKeyDown} required="required"/>
				<span className="highlight"></span><span className="bar"></span>
				<label>{this.props.label}</label>
			</div>
		)
	}
}

export default InputField