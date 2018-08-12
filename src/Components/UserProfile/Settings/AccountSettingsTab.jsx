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
			}
		}

		this.handleInput = this.handleInput.bind(this)
		this.checkPasswordMatch = this.checkPasswordMatch.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})

		store.dispatch({type: "s/GET_USER_SETTINGS", data: {
			userToken: this.props.userToken
		}})
	}

	handleInput(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	validateEmail(email){
		// regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email)
	}

	checkPasswordMatch(password){
		return this.state.confirmPassword === this.state.password
	}


	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.userEdit.unsavedChanges&&this.state.userEdit.editError!==""
		let isError = this.state.user.settings.error!==null

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
							id="email"
							name="email"
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
							validateFunc={this.checkPasswordMatch}
							error="Passwords don't match"
							autoComplete="off"
						/>

						<UserInputField 
							id="confirmPassword"
							name="confirmPassword"
							required="required"
							type="password"
							label="Confirm New Password"
							validateFunc={this.checkPasswordMatch}
							error="Passwords don't match"
							onChange={this.handleInput}
							autoComplete="off"
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default AccountSettingsTab