import React, { Component } from 'react'
import store from '../../store'

class UserProfile extends Component {
	constructor(props){
		super(props)
	}

	logout(){
		localStorage.removeItem(localStorage.userData)
		store.dispatch({type: "USER_LOGOUT"})
	}

	render(){
		return (
			<div className="content absolute-center">
				<div className="profile">
					<div className="profile-top">
						<div className="pic-sec">
							<div className="pic">
								<div className="user-image" style={{
									backgroundImage: "url("+this.props.image+")"
								}}>
									<div className="image-overlay">
										<a href="#" id="picture-overlay" className="">
											<i className="material-icons">photo_camera</i>
										</a>
									</div>
								</div>
								
							</div>
							<div className="pic-info">
								<h2>{this.props.username}</h2>
								<h3>&nbsp;</h3>
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