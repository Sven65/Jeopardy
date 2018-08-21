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

		if(this.props.validateFunc !== undefined){
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
	}

	handleInput(event){
		this.props.onChange(event)
		this.validateInput(event.target.value)
	}

	render(){
		let showError = this.state.showError

		if(this.props.showError !== undefined){
			showError = !this.props.showError()
		}

		return (
			<div className={"user-modal-form-group "+this.props.className+" "+(showError?'has-error':'')}>
				<label htmlFor={this.props.id}>{this.props.label}</label>
				<input
					id={this.props.id}
					name={this.props.name}
					required={this.props.required}
					type={this.props.type}
					onChange={this.handleInput}
					autoComplete={this.props.autoComplete}
					defaultValue={this.props.defaultValue}
					onKeyDown={this.props.onKeyDown}
					ref={this.props.inputRef}
					/>
				<span className={"user-modal-form-group-error "+(showError?'':'hidden')}>{this.props.error}</span>
			</div>
		)
	}
}

export default UserInputField