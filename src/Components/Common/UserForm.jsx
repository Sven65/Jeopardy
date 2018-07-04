import React, { Component } from 'react'
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
			"registerError": {},
			"loginError": {},

			"login-username": "",
			"login-password": ""
		}

		this.handleInput = this.handleInput.bind(this)
		this.onRegisterKeyDown = this.onRegisterKeyDown.bind(this)
		this.onLoginKeyDown = this.onLoginKeyDown.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}
	
	handleInput(event){
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
		if(this.state.userRegistered){
			return
		}

		if(this.state['register-username'] !== "" && this.state['register-email'] !== "" && this.state['register-password'] !== "" && this.state['register-cpassword'] !== ""){
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
				registerError: {
					reason: "Please fill in all fields."
				}
			})
		}
	}

	login(){

		this.setState({
			loginError: {}
		})
		
		if(this.state.userLoggedIn){
			return
		}

		if(this.state['login-username'] === "" || this.state["login-password"] === ""){
			this.setState({
				loginError: {
					reason: "Please fill in all fields."
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

	render(){
		return (
			<div id="user-modal">
				<div className="modal-content">
					<div className="user-modal-form">
						<div className="user-modal-form-toggle"></div>
						<div className="user-modal-form-panel one">
							<div className="user-modal-form-header">
								<h1>Account Login</h1>
								<h6 className={this.state.loginError.reason!==""?'user-modal-error':''}>{this.state.loginError.reason||this.state.userLoggedIn&&"Logged In!"}</h6>
							</div>
							<div className="user-modal-form-content">
								<form>
									<div className="user-modal-form-group">
										<label htmlFor="login-username">Username</label>
										<input id="username" name="login-username" required="required" type="text" onChange={this.handleInput} onKeyDown={this.onLoginKeyDown}/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="login-password">Password</label>
										<input id="password" name="login-password" required="required" type="password" onChange={this.handleInput} onKeyDown={this.onLoginKeyDown}/>
									</div>
									<div className="user-modal-form-group">
										<label className="user-modal-form-remember">
											<input type="checkbox" name="login-checkbox"/>Remember Me
										</label>
										<a className="user-modal-form-recovery" href="#">Forgot Password?</a>
									</div>
									<div className="user-modal-form-group">
										<button type="button" onClick={this.login.bind(this)}>Log In</button>
									</div>
								</form>
							</div>
						</div>
						<div className="user-modal-form-panel two">
							<div className="user-modal-form-header">
								<h1>Register Account</h1>
								<h6>{this.state.registerError.reason||this.state.userRegistered&&"Registered! Check your emails to verify your email!"}</h6>
							</div>
							<div className="user-modal-form-content">
								<form>
									<div className="user-modal-form-group">
										<label htmlFor="username">Username</label>
										<input id="username" name="register-username" required="required" type="text" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="password">Password</label>
										<input id="password" name="register-password" required="required" type="password" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="cpassword">Confirm Password</label>
										<input id="cpassword" name="register-cpassword" required="required" type="password" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown} />
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="email">Email Address</label>
										<input id="email" name="register-email" required="required" type="email" onChange={this.handleInput} onKeyDown={this.onRegisterKeyDown}/>
										<span className="user-modal-form-group-error">Please enter a valid email</span>
									</div>
									<div className="user-modal-form-group">
										<button type="submit" onClick={this.register.bind(this)}>Register</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserForm