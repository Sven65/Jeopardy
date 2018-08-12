import React, { Component } from 'react'

class UserInputField extends Component {
	constructor(props){
		super(props)

		this.state = {
			showError: false
		}

		this.validateInput = this.validateInput.bind(this)
		this.handleInput = this.handleInput.bind(this)
	}

	validateInput(input){
		if(this.props.validateFunc(input)){
			this.setState({
				showError: false
			})
		}else{
			this.setState({
				showError: true
			})
		}
	}

	handleInput(event){
		this.validateInput(event.target.value)
		this.props.onChange(event)
	}

	render(){
		return (
			<div className={"user-modal-form-group "+this.props.className+" "+(this.state.showError?'has-error':'')}>
				<label htmlFor={this.props.id}>{this.props.label}</label>
				<input
					id={this.props.id}
					name={this.props.name}
					required={this.props.required}
					type={this.props.type}
					onChange={this.handleInput}
					autoComplete={this.props.autoComplete}
					defaultValue={this.props.defaultValue}
					/>
				<span className={"user-modal-form-group-error "+(this.state.showError?'':'hidden')}>{this.props.error}</span>
			</div>
		)
	}
}

export default UserInputField