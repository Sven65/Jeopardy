import React, { Component } from 'react'

import Loader from './Loader'
import Alert from './Alert'

import store from '../../store'

class UserProfile extends Component {
	constructor(props){
		super(props)

		this.fileInput = React.createRef()

		this.state = {
			imagePreview: this.props.image,
			selectedImage: null,
			unsavedChanges: false,
			isLoading: false,
			editError: "",
			showSettings: false
		}

		this._acceptedMimes = [
			"image/jpeg",
			"image/png"
		]

		this.toggleSettings = this.toggleSettings.bind(this)
		this.themeChange = this.themeChange.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	logout(){
		localStorage.removeItem(localStorage.userData)
		store.dispatch({type: "USER_LOGOUT"})
	}

	fileChangedHandler(e){
		let file = e.target.files[0]

		if(this._acceptedMimes.indexOf(file.type) <= -1){
			return
		}

		let self = this

		var reader = new FileReader()

		reader.addEventListener("load", function () {
			self.setState({
				imagePreview: reader.result,
				selectedImage: file,
				unsavedChanges: true
			})
		}, false)

		if (file) {
			reader.readAsDataURL(file);
		}
	}

	saveProfile(){
		store.dispatch({type: "s/ACTION_USER_EDIT", data: {
			file: this.state.selectedImage,
			fileData: {
				lastModified: this.state.selectedImage.lastModified,
				name: this.state.selectedImage.name,
				size: this.state.selectedImage.size,
				type: this.state.selectedImage.type
			},
			userToken: this.props.userToken
		}})
	}

	triggerUpload(e){
		e.preventDefault()
		this.fileInput.click()
	}

	toggleSettings(){
		this.setState({
			showSettings: !this.state.showSettings
		})
	}

	themeChange(e){
		store.dispatch({type: "s/USER_CHANGE_THEME", data: {
			theme: e.target.value,
			userToken: this.props.userToken
		}})
	}


	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.unsavedChanges&&this.state.editError!==""

		return (
			<div>
				{this.state.isLoading &&
					<div className="loader-holder">
						<Loader />
					</div>
				}
				<div className="modal is-active" id="user-profile">
					<div className="modal-background"></div>
					<div className="modal-card">
						<section className="">
							<section className="profile-top hero">
								{showError&& (
									<Alert message={
										<span>
											{this.state.editError}
										</span>
									} type="danger"/>
								)}
								<div className="hero-body">
									<div className="columns">
										<div className="column">
											<div className="user-pic">
												<div className="user-image" style={{
													backgroundImage: "url("+this.state.imagePreview+")"
												}} onClick={this.triggerUpload.bind(this)}>
													<div className="image-overlay">
														<span id="picture-overlay">
															<span className="icon has-text-white">
																<i className="mdi mdi-24px mdi-camera"></i>
															</span>
														</span>
													</div>
												</div>

												<input type="file" className="hidden" ref={input => this.fileInput = input} onChange={this.fileChangedHandler.bind(this)} accept=".jpg,.png"/>
											</div>
											<div className="column">
												{
													this.state.unsavedChanges&&(
														<button className="mdl-btn" id="save-profile-button" onClick={this.saveProfile.bind(this)}>Save!</button>
													)
												}
											</div>
										</div>
										<div className="column">
											<h1 className="title has-text-weight-light">{this.props.username}</h1>
											<div className="columns is-multiline">
												<div className="column" id="profile-wins">
													<h4 className="is-size-4 has-text-weight-light">{this.props.wins}</h4>
													<h5 className="is-size-5 has-text-weight-light">Wins</h5>
												</div>

												<div className="column" id="profile-losses">
													<h4 className="is-size-4 has-text-weight-light">{this.props.losses}</h4>
													<h5 className="is-size-5 has-text-weight-light">Losses</h5>
												</div>

												<div className="column" id="profile-balance">
													<h4 className="is-size-4 has-text-weight-light">${this.props.balance}</h4>
													<h5 className="is-size-5 has-text-weight-light">Balance</h5>
												</div>
											</div>
										</div>

									</div>
								</div>
							</section>
							<section className="profile-bottom">
								{!this.state.showSettings ? (
									<div className="columns is-multiline">		
										<div className="column is-12" onClick={this.toggleSettings}>
											<span>My Settings
												<span className="icon is-left">
													<i className="mdi mdi-18px mdi-settings"></i>
												</span>
											</span>
										</div>
										<div className="column is-12" onClick={this.props.logoutFunc}>Logout
											<span>
												<span className="icon is-left">
													<i className="mdi mdi-18px mdi-exit-to-app"></i>
												</span>
											</span>
										</div>
									</div>
								):(
									<div className="columns is-multiline" id="user-settings">

										<div className="column is-12" onClick={this.toggleSettings}>
											<span>
												<span className="icon is-left">
													<i className="mdi mdi-18px mdi-arrow-left"></i>
												</span>
												Go Back
											</span>
										</div>

										<div className="column is-12">Theme:
											<div className="select is-fullwidth">
												<select onChange={this.themeChange} defaultValue={this.props.selectedTheme}>
													<option value="light">Light</option>
													<option value="dark">Dark</option>
												</select>
											</div>
										</div>
									</div>
								)}
							</section>
						</section>
					</div>

					<button className="modal-close is-large" aria-label="close" onClick={this.props.closeButtonFunction}></button>
				</div>
			</div>
		)
	}
}

export default UserProfile