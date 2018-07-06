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
			<div className="group">
				<input id={this.props.id} autocomplete={this.props.autoComplete} type={this.props.type} className="validate" value={this.props.value} ref={this.props.inputRef} onKeyDown={this.props.onKeyDown} required="required"/>
				<span class="highlight"></span><span class="bar"></span>
				<label>{this.props.label}</label>
			</div>
		)
	}
}

export default InputField