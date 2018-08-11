import React, { Component } from 'react'

import Loader from './Loader'
import Alert from './Alert'

import SwatchPicker from './SwatchPicker'

import swal from 'sweetalert'

import store from '../../store'

// TODO: FIX issue with this popping up errors and stuff when it shouldn't when buying and selecting colors

class UserProfile extends Component {
	constructor(props){
		super(props)

		this.fileInput = React.createRef()

		this.state = {
			imagePreview: this.props.image,
			selectedImage: null,
			showSettings: false,
			swatches: [
				'#FFF',
				'#F44336',
				'#E91E63',
				'#9C27B0',
				'#673AB7',
				'#3F51B5',
				'#2196F3',
				'#03A9F4',
				'#00BCD4',
				'#009688',
				'#4CAF50',
				'#8BC34A',
				'#CDDC39',
				'#FFEB3B',
				'#FFC107',
				'#FF9800',
				'#FF5722'
			],

			loader: {
				isLoading: false
			},
			userEdit: {
				editError: "",
				buyColorError: "",
				boughtColor: false,
				boughtColorSuccess: "",
				unsavedChanges: false
			}
		}

		this._acceptedMimes = [
			"image/jpeg",
			"image/png"
		]

		this.toggleSettings = this.toggleSettings.bind(this)
		this.themeChange = this.themeChange.bind(this)
		this.colorSelected = this.colorSelected.bind(this)
		this.onColorSelect = this.onColorSelect.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState(), () => {
				if(this.state.userEdit.buyColorError !== ""){
					swal({
						title: "Error!",
						text: this.state.userEdit.buyColorError,
						icon: "error",
						button: "Close"
					})
				}else if(this.state.userEdit.boughtColor !== false){
					swal({
						title: "Success!",
						text: this.state.userEdit.boughtColorSuccess,
						icon: "success",
						button: "Close"
					}).then(() => {
						this.setState(Object.assign({}, this.state, {
							userEdit: {
								boughtColor: false
							}
						}))
					})

					
				}
			})
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

	_getColorImage(color, boxSize){
		let canvas = document.createElement("canvas")
		canvas.width = boxSize
		canvas.height = boxSize
		let ctx = canvas.getContext('2d')

		ctx.fillStyle = color

		ctx.fillRect(0, 0, boxSize, boxSize)

		return ctx.canvas.toDataURL("image/png")
	}

	_htmlToElement(html) {
	    const template = document.createElement('template')
	    html = html.trim()
	    template.innerHTML = html
	    return template.content.firstChild
	}

	_getSwalContent(color, username){
		return this._htmlToElement(`
			<div class="color-buy-holder">
				<div class="columns is-multiline">
					<div class="column is-12 chat-even">
						<span style="color: ${color};font-weight: bold;">${username}</span>
					</div>
					<div class="column is-12 chat-odd">
						<span style="color: ${color};font-weight: bold;">${username}</span>
					</div>
				</div>
			</div>
		`)
	}

	colorSelected(color){
		if(!color.unlocked){
			swal({
				title: "Do you want to unlock this color for $2,000?",
				//icon: this._getColorImage(color.color, 64),
				content: this._getSwalContent(color.color, this.props.username),
				buttons: ["Nope!", true]
			}).then(confirm => {
				if(confirm){
					store.dispatch({type: "s/USER_BUY_COLOR", data: {
						color: color.color,
						userToken: this.props.userToken
					}})
				}
			});
		}else{
			store.dispatch({type: "s/USER_SET_COLOR", data: {
				color: color.color,
				userToken: this.props.userToken
			}})
		}
	}

	getSwatchColors(){
		let swatchColors = []
		let colors = this.state.swatches
		
		this.props.unlockedColors.forEach(color => {
			if(colors.indexOf(color) <= -1){
				colors.push(color)
			}
		})

		colors.forEach(color => {
			swatchColors.push({color, unlocked: this.props.unlockedColors.indexOf(color) > -1})
		})

		return swatchColors
	}

	onColorSelect(colors){
		this.setState({
			swatches: [...this.state.swatches, colors.color]
		})
	}


	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.userEdit.unsavedChanges&&this.state.userEdit.editError!==""

		return (
			<div>
				{this.state.loader.isLoading &&
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
											{this.state.userEdit.editError}
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

										<div className="column is-12 no-hover">
											<div className="field has-addons">
												<div className="control">
													<a className="button is-profile">Theme</a>
												</div>

												<div className="control is-expanded">
													<div className="select is-fullwidth">
														<select onChange={this.themeChange} defaultValue={this.props.selectedTheme}>
															<option value="light">Light</option>
															<option value="dark">Dark</option>
														</select>
													</div>
												</div>
											</div>
										</div>

										<div className="column is-12 no-hover">
											<span className="title name-title">Name Color</span>
											<SwatchPicker colors={this.getSwatchColors()} onSelect={this.colorSelected} closeHandler={this.onColorSelect}/>
										</div>

										<div className="column is-12" onClick={this.toggleSettings}>
											<span>
												<span className="icon is-left">
													<i className="mdi mdi-18px mdi-arrow-left"></i>
												</span>
												Go Back
											</span>
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