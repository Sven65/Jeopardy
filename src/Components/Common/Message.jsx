import React, { Component } from 'react'

class Message extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<li className="chat-message-container" data-sender={this.props.user.id} data-timestamp={this.props.timeStamp}>
				{this.props.user.id !== "SYSTEM" &&
					<img src="http://placehold.it/128x128" className="chat-image"/>
				}
				<div className="message-wrap">
					{this.props.user.id !== "SYSTEM" &&
						<span className="chat-sender">{this.props.user.username}</span>
					}
					<span className="chat-message">{/*${Format.Format(data.message)*/}{this.props.message}</span>
				</div>
			</li>
		)
	}
}

export default Message