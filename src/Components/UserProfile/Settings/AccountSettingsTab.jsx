import React, { Component } from 'react'
import Loadable from 'react-loadable'

import Loader from '../../Common/Loader'

const UserInputField = Loadable({
	loader: () => import('../../Common/UserInputField'),
	loading: Loader,
})

const ErrorIcon = Loadable({
	loader: () => import('../../Common/ErrorIcon'),
	loading: Loader,
})

const Button = Loadable({
	loader: () => import('../../Common/Button'),
	loading: Loader,
})

import swal from 'sweetalert'

import store from '../../../store'

class AccountSettingsTab extends Component {
	constructor(props){
		super(props)

		this.state = {
			loader: {
				isLoading: false
			},
			userEdit: {
				editError: "",
				buyColorError: "",
				boughtColor: false,
				boughtColorSuccess: "",
				unsavedChanges: false
			},
			user: {
				settings: {
					email: "",
					error: null
				}
			},
			showPasswordError: false
		}

		this.handleInput = this.handleInput.bind(this)
		this.checkPasswordMatch = this.checkPasswordMatch.bind(this)

		this._checkHasUnsavedChanges = this._checkHasUnsavedChanges.bind(this)

		this._saveSettings = this._saveSettings.bind(this)

		this.passwordConfirmInput = React.createRef()
		this.passwordInput = React.createRef()
		this.currentPasswordInput = React.createRef()

		// TODO: Make this save stuff
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})

		store.dispatch({type: "s/GET_USER_SETTINGS", data: {
			userToken: this.props.userToken
		}})
	}


	// Returns true if the user has unsaved changes
	_checkHasUnsavedChanges(){
		let emailChanged = this.state.user.settings.email!==this.state.emailInput&&this.state.emailInput!==undefined

		let passwordChanged = (this.state.password!==""&&this.state.password!==undefined)&&(this.state.confirmPassword!==""&&this.state.confirmPassword!==undefined)

		let passwordsMatch = this.checkPasswordMatch()

		return emailChanged||passwordChanged&&passwordsMatch
	}

	handleInput(event){
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			this.setState({
				showPasswordError: this.checkPasswordMatch(),
				userEdit: {
					unsavedChanges: this._checkHasUnsavedChanges()
				}
			})
		})
	}

	validateEmail(email){
		// regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email)
	}

	checkPasswordMatch(password){
		return this.passwordInput.value === this.passwordConfirmInput.value
	}

	_saveSettings(){
		store.dispatch({type: "s/SAVE_USER_SETTINGS", data: {
			userToken: this.props.userToken,
			newEmail: this.state.emailInput,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			currentPassword: this.state.currentPassword
		}})
	}


	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.userEdit.unsavedChanges&&this.state.userEdit.editError!==""
		let isError = this.state.user.settings.error!==null
		let showSaveButton = this.state.userEdit.unsavedChanges&&this.currentPasswordInput.value!==""

		let showPasswordError = this.state.showPasswordError

		if(isError){
			return (
				<div>
					<div className="columns is-multiline user-settings is-error">
						<div className="column is-12 no-hover">
							<ErrorIcon/>
							<h1 className="title">Failed to get user settings</h1>
							<h2 className="subtitle">{this.state.user.settings.error}</h2>
						</div>

					</div>
				</div>
			)
		}

		return (
			<div>
				<div className="columns is-multiline user-settings">
					<div className="column is-12 no-hover">
						<UserInputField 
							id="emailInput"
							name="emailInput"
							required="required"
							type="email"
							label="Email Address"
							onChange={this.handleInput}
							validateFunc={this.validateEmail}
							error="Please enter a valid email"
							autoComplete="off"
							defaultValue={this.state.user.settings.email}
						/>
					</div>

					<div className="column is-12 no-hover">
						<UserInputField 
							id="password"
							name="password"
							required="required"
							type="password"
							label="New Password"
							onChange={this.handleInput}
							showError={() => {return showPasswordError}}
							error="Passwords don't match"
							autoComplete="off"
							inputRef={el => this.passwordInput = el}
						/>

						<UserInputField 
							id="confirmPassword"
							name="confirmPassword"
							required="required"
							type="password"
							label="Confirm New Password"
							showError={() => {return showPasswordError}}
							error="Passwords don't match"
							onChange={this.handleInput}
							autoComplete="off"
							inputRef={el => this.passwordConfirmInput = el}
						/>
					</div>

					<div className="column is-12 no-hover padding-15 no-bottom-padding">
						<UserInputField 
							id="currentPassword"
							name="currentPassword"
							required="required"
							type="password"
							label="Current Password"
							onChange={this.handleInput}
							autoComplete="off"
							inputRef={el => this.currentPasswordInput = el}
						/>

						<form className={"mdl-form gameBrowser-button-holder "+(showSaveButton?'':'hidden')}>
							<Button type="button" name="save" id="saveButton" text="Save" icon="content-save" className="btn-submit" onClick={this._saveSettings}/>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default AccountSettingsTab