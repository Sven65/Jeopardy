import React, { Component } from 'react'
import swal from 'sweetalert'
import store from './../../store'
/**
 * Userform
 * Contains tabs for loging in and registering
 */
class UserForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			"register-username": "",
			"register-email": "",
			"register-password": "",
			"register-cpassword": "",
			"user": {
				"registerError": {},
				"loginError": {
					reason: ""
				}
			},

			"login-username": "",
			"login-password": "",
			forgotPasswordSent: false,
			passwordResetError: null,

			disableRegisterForm: false,
			disableLoginForm: false
		}

		this.handleInput = this.handleInput.bind(this)
		this.onRegisterKeyDown = this.onRegisterKeyDown.bind(this)
		this.onLoginKeyDown = this.onLoginKeyDown.bind(this)
		this.forgotPassword = this.forgotPassword.bind(this)

		this._loginForm = React.createRef()
		this._registerForm = React.createRef()
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {

				if(this.state.user.forgotPasswordSent){
					swal({
						title: "Success!",
						text: "Check your email for further instructions!",
						icon: "success",
						button: "Okay!"
					})
				}else if(this.state.user.passwordResetError !== null){
					swal({
						title: "Error!",
						text: this.state.user.passwordResetError,
						icon: "error",
						button: "Try Again"
					}).then(e => {
						this.forgotPassword()
					})
				}

				if(this.state.clearUserForm){
					this.clearLoginForm()
					this.clearRegisterForm()

					store.dispatch({type: "RESET_CLEAR_USER_FORM"})
				}
			})
		})
	}
	
	handleInput(event){
		if(event.target.name === "privacyAgree"){
			event.target.value = event.target.checked
		}

		this.setState({
			[event.target.name]: event.target.value
		});

		if(event.target.name === "register-email"){
			if(!this.validateEmail(event.target.value)){
				event.target.style["border-bottom"] = "1px solid #ff0000"
				event.target.parentNode.querySelector('.user-modal-form-group-error').classList.remove("hidden")
			}else{
				event.target.removeAttribute("style")
				event.target.parentNode.querySelector('.user-modal-form-group-error').classList.add("hidden")
			}
		}
	}

	validateEmail(email){
		// regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email)
	}

	register(){
		if(this.state.userRegistered || this.state.disableRegisterForm){
			return
		}

		if(this.state['register-username'] !== "" && this.state['register-email'] !== "" && this.state['register-password'] !== "" && this.state['register-cpassword'] !== "" && this.state.privacyAgree){
			if(this.validateEmail(this.state['register-email'])){
				store.dispatch({type: "USER_FORM_LOAD"})

				store.dispatch({type: "s/USER_REGISTER", data: {
					username: this.state['register-username'],
					email: this.state['register-email'],
					password: this.state['register-password'],
					cpassword: this.state['register-cpassword']
				}})

			}
		}else{
			this.setState({
				user: {
					registerError: {
						reason: "Please fill in all fields."
					}
				}
			})
		}
	}

	login(){

		this.setState({
			user: {
				loginError: {}
			}
		})
		
		if(this.state.userLoggedIn || this.state.disableLoginForm){
			return
		}

		if(this.state['login-username'] === "" || this.state["login-password"] === ""){
			this.setState({
				user: {
					loginError: {
						reason: "Please fill in all fields."
					}
				}
			})
			return
		}

		store.dispatch({type: "USER_FORM_LOAD"})

		store.dispatch({type: "s/USER_LOGIN", data: {
			username: this.state['login-username'],
			password: this.state['login-password']
		}})
	}

	onRegisterKeyDown(e){
		if(e.keyCode === 13){
			this.register()
		}
	}

	onLoginKeyDown(e){
		if(e.keyCode === 13){
			this.login()
		}
	}

	forgotPassword(){
		let swalField = document.createElement('input');
		swalField.setAttribute("placeholder", "me@example.com");
		swalField.setAttribute("type", "email");
		swalField.setAttribute("required", "true");
		swalField.classList.add("swal-content__input");

		swal({
			title: 'Please enter the email of your account',
			content: swalField,
			buttons: {
				cancel: "Cancel",
				go: {
					text: "Go!",
					closeModal: false,
					value: 1
				}
			}
		}).then(val => {

			if (!val || val === null){
				swal.stopLoading();
				swal.close();

				store.dispatch({type: "RESET_PASSWORD_RESET_ERROR"})

				return
			}

			let email = swalField.value

			if(!email) throw null


			if(!this.validateEmail(email)){
				swal({
					title: "Error.",
					text: "Invalid email entered.",
					icon: "error",
					button: "Try again"
				}).then(e => {
					this.forgotPassword()
				})
				return
			}

			store.dispatch({type: "s/FORGOT_PASSWORD", data: {
				email
			}})

		}).catch(err => {
			if (err) {
				swal("Oh noes!", "The AJAX request failed!", "error");
			} else {
				swal({
					title: "Error.",
					text: "No email entered.",
					icon: "error",
					button: "Try again"
				}).then(e => {
					this.forgotPassword()
				})
			}
		});
	}

	clearLoginForm(){
		this.setState({
			"login-username": "",
			"login-password": ""
		})

		this._loginForm.reset()
	}

	clearRegisterForm(){
		this.setState({
			"register-username": "",
			"register-email": "",
			"register-password": "",
			"register-cpassword": "",
			user: {
				"registerError": {}
			}
		})

		this._registerForm.reset()
	}

	render(){

		return (
			<div className="modal is-active" id="user-profile">
				<div className="modal-background"></div>
				<div className="modal-card">
					<div id="user-modal">
						<div className="modal-content">
							<div className="user-modal-form">
								<div className="user-modal-form-toggle"></div>
								<div className="user-modal-form-panel one">
									<div className="user-modal-form-header">
										<h1>Account Login</h1>
										<h6 className={this.state.user.loginError.reason===""?'user-modal-success':'user-modal-error'}>{this.state.user.loginError.reason||this.state.user.userLoggedIn&&"Logged In!"}</h6>
									</div>
									<div className="user-modal-form-content">
										<form ref={(el) => this._loginForm = el}>
											<div className="user-modal-form-group">
												<label htmlFor="login-username">Username</label>
												<input id="login-username" name="login-username" disabled={this.state.disableLoginForm} required="required" type="text" onChange={this.handleInput} onKeyDown={this.onLoginKeyDown}/>
											</div>
											<div className="user-modal-form-group">
												<label htmlFor="login-password">Password</label>
												<input id="login-password" name="login-password" disabled={this.state.disableLoginForm} required="required" type="password" onChange={this.handleInput} onKeyDown={this.onLoginKeyDown}/>
											</div>
											<div className="user-modal-form-group">
												<label className="user-modal-form-remember">
													<input type="checkbox" name="login-checkbox" disabled={this.state.disableLoginForm}/>Remember Me
												</label>
												<a className="user-modal-form-recovery" href="#" onClick={this.forgotPassword}>Forgot Password?</a>
											</div>
											<div className="user-modal-form-group" id="register-trigger-holder">
												<a className="user-modal-form-recovery right" href="#" id="register-trigger">New User?</a>
											</div>
											<div className="user-modal-form-group">
												<button type="button" disabled={this.state.disableLoginForm} onClick={this.login.bind(this)}>Log In</button>
											</div>
										</form>
									</div>
								</div>
								<div className="user-modal-form-panel two">
									<div className="user-modal-form-header">
										<h1>Register Account</h1>
										<h6>{this.state.user.registerError.reason||this.state.userRegistered&&"Registered! Check your emails to verify your email!"}</h6>
									</div>
									<div className="user-modal-form-content">
										<form ref={(el) => this._registerForm = el}>
											<div className="user-modal-form-group">
												<label htmlFor="username">Username</label>
												<input id="username" name="register-username" disabled={this.state.disableRegisterForm} required="required" type="text" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
											</div>
											<div className="user-modal-form-group">
												<label htmlFor="password">Password</label>
												<input id="password" name="register-password" disabled={this.state.disableRegisterForm} required="required" type="password" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
											</div>
											<div className="user-modal-form-group">
												<label htmlFor="cpassword">Confirm Password</label>
												<input id="cpassword" name="register-cpassword" disabled={this.state.disableRegisterForm} required="required" type="password" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown} />
											</div>
											<div className="user-modal-form-group">
												<label htmlFor="email">Email Address</label>
												<input id="email" name="register-email" disabled={this.state.disableRegisterForm} required="required" type="email" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
												<span className="user-modal-form-group-error">Please enter a valid email</span>
											</div>
											<div className="user-modal-form-group privacyAgreementHolder">
												<div className="md-checkbox">
													<input id="privacyAgree" name="privacyAgree" disabled={this.state.disableRegisterForm} required="required" type="checkbox" onClick={this.handleInput}/>
													<label htmlFor="privacyAgree">I have read and agree to the <a href="Privacy" id="privacyLink" target="_blank">Privacy Policy</a></label>
												</div>
											</div>
											<div className="user-modal-form-group">
												<button type="submit" disabled={this.state.disableRegisterForm} onClick={this.register.bind(this)}>Register</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
						<button className="modal-close is-large" aria-label="close" onClick={this.props.closeButtonFunction}></button>
					</div>
				</div>
			</div>
		)
	}
}

export default UserForm