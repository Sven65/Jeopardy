import React, { Component } from 'react'
import Loadable from 'react-loadable'

import Loader from '../../Common/Loader'
import Alert from '../../Common/Alert'

const SwatchPicker = Loadable({
	loader: () => import('../../Common/SwatchPicker'),
	loading: Loader,
})

import swal from 'sweetalert'

import store from '../../../store'

class GeneralSettingsTab extends Component {
	constructor(props){
		super(props)

		this.state = {
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
			},
			selectedTab: "general"
		}


		this.themeChange = this.themeChange.bind(this)
		this.colorSelected = this.colorSelected.bind(this)
		this.onColorSelect = this.onColorSelect.bind(this)

		this.selectTab = this.selectTab.bind(this)
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
					}).then(() => {
						store.dispatch({type: "RESET_BUY_COLOR_ERROR"})
					})
				}else if(this.state.userEdit.boughtColor !== false){
					swal({
						title: "Success!",
						text: this.state.userEdit.boughtColorSuccess,
						icon: "success",
						button: "Close"
					}).then(() => {
						store.dispatch({type: "RESET_BOUGHT_COLOR"})
					})

					
				}
			})
		})
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

	themeChange(e){
		store.dispatch({type: "s/USER_CHANGE_THEME", data: {
			theme: e.target.value,
			userToken: this.props.userToken
		}})
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

	selectTab(e){
		console.log("tab", e)
	}


	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.userEdit.unsavedChanges&&this.state.userEdit.editError!==""

		return (
			<div className="columns is-multiline user-settings">
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
				
			</div>
		)
	}
}

export default GeneralSettingsTab