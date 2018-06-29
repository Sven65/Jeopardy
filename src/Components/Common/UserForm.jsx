import React, { Component } from 'react'
import store from './../../store'
/**
 * Userform
 * Contains tabs for loging in and registering
 */
class UserForm extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}

	register(){

	}

	login(){

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
							</div>
							<div className="user-modal-form-content">
								<form>
									<div className="user-modal-form-group">
										<label htmlFor="username">Username</label>
										<input id="username" name="username" required="required" type="text"/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="password">Password</label>
										<input id="password" name="password" required="required" type="password"/>
									</div>
									<div className="user-modal-form-group">
										<label className="user-modal-form-remember">
											<input type="checkbox"/>Remember Me
										</label>
										<a className="user-modal-form-recovery" href="#">Forgot Password?</a>
									</div>
									<div className="user-modal-form-group">
										<button type="submit">Log In</button>
									</div>
								</form>
							</div>
						</div>
						<div className="user-modal-form-panel two">
							<div className="user-modal-form-header">
								<h1>Register Account</h1>
							</div>
							<div className="user-modal-form-content">
								<form>
									<div className="user-modal-form-group">
										<label htmlFor="username">Username</label>
										<input id="username" name="username" required="required" type="text"/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="password">Password</label>
										<input id="password" name="password" required="required" type="password"/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="cpassword">Confirm Password</label>
										<input id="cpassword" name="cpassword" required="required" type="password"/>
									</div>
									<div className="user-modal-form-group">
										<label htmlFor="email">Email Address</label>
										<input id="email" name="email" required="required" type="email"/>
									</div>
									<div className="user-modal-form-group">
										<button type="submit">Register</button>
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