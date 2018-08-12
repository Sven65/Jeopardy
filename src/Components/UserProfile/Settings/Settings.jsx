import React, { Component } from 'react'
import Loadable from 'react-loadable'

import Loader from '../../Common/Loader'
import Alert from '../../Common/Alert'

const GeneralSettingsTab = Loadable({
	loader: () => import('./GeneralSettingsTab'),
	loading: Loader,
})

const AccountSettingsTab = Loadable({
	loader: () => import('./AccountSettingsTab'),
	loading: Loader,
})

import swal from 'sweetalert'

import store from '../../../store'

class Settings extends Component {
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
			selectedTab: "general"
		}

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

	selectTab(e){
		this.setState({
			selectedTab: e
		})
	}

	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.userEdit.unsavedChanges&&this.state.userEdit.editError!==""

		let settingsTab

		if(this.state.selectedTab === 'general'){
			settingsTab = <GeneralSettingsTab
							unlockedColors={this.props.unlockedColors}
							selectedTheme={this.props.selectedTheme}
							toggleSettings={this.props.toggleSettings}
							username={this.props.username}
							userToken={this.props.userToken}/>
		}else if(this.state.selectedTab === 'account'){
			settingsTab = <AccountSettingsTab
				userToken={this.props.userToken}
			/>
		}

		return (
			<div>
				<div className="columns is-multiline user-settings">
					<div className="column is-12 no-hover">
						<div className="tabs is-centered">
							<ul>
								<li className={this.state.selectedTab==='general'?"is-active":''} data-tab="general" onClick={() => this.selectTab("general")}>
									<a>General Settings</a>
								</li>
								<li className={this.state.selectedTab==='account'?"is-active":''} data-tab="account" onClick={() => this.selectTab("account")}>
									<a>Account Settings</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="column is-12 no-hover">
						{settingsTab}
					</div>

					<div className="column is-12" onClick={this.props.toggleSettings}>
						<span>
							<span className="icon is-left">
								<i className="mdi mdi-18px mdi-arrow-left"></i>
							</span>
							Go Back
						</span>
					</div>

				</div>
			</div>
		)
	}
}

export default Settings