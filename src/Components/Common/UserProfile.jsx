import React, { Component } from 'react'

import Loader from './Loader'
import store from '../../store'

class UserProfile extends Component {
	constructor(props){
		super(props)

		this.fileInput = React.createRef()

		this.state = {
			imagePreview: this.props.image,
			selectedImage: null,
			unsavedChanges: false,
			isLoading: false
		}

		this._acceptedMimes = [
			"image/jpeg",
			"image/png"
		]
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

	render(){
		return (
			

			<div className="content absolute-center">
				{this.state.isLoading &&
					<div className="loader-holder">
						<Loader />
					</div>
				}
				<div className="profile">
					<div className="profile-top">
						<div className="pic-sec">
							<div className="pic">
								<div className="user-image" style={{
									backgroundImage: "url("+this.state.imagePreview+")"
								}} onClick={this.triggerUpload.bind(this)}>
									<div className="image-overlay">
										<a href="#" id="picture-overlay" className="">
											<i className="material-icons">photo_camera</i>
										</a>
									</div>
								</div>

								<input type="file" className="hidden" ref={input => this.fileInput = input} onChange={this.fileChangedHandler.bind(this)} accept=".jpg,.png"/>
								
							</div>
							<div className="pic-info">
								<h2>{this.props.username}</h2>
								{
									this.state.unsavedChanges?(
										<button className="btn waves-effect waves-light" id="save-profile-button" onClick={this.saveProfile.bind(this)}>Save!</button>
									):(
										<h3>&nbsp;</h3>
									)
								}
							</div>
							<div className="clear"></div>
						</div>
						<div className="media">
							<div className="wins">
								<h4>{this.props.wins}</h4>
								<h5>Wins</h5>
							</div>
							<div className="losses">
								<h4>{this.props.losses}</h4>
								<h5>Losses</h5>
							</div>
							<div className="clear"></div>
						</div>
					</div>
					<div className="profile-bottom">
						<ul>
							<li>
								<a href="#">My Settings <i className="material-icons right">settings</i></a>
							</li>
							<li>
								<a href="#" onClick={this.props.logoutFunc}>Logout<i className="material-icons right">exit_to_app</i></a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default UserProfile