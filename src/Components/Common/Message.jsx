import React, { Component } from 'react'
import Format from './../../General/Format'

const HtmlToReactParser = require('html-to-react').Parser
const Parser = new HtmlToReactParser()

class Message extends Component {
	constructor(props){
		super(props)
	}



	render(){
		return (
			<li className="chat-message-container" data-sender={this.props.user.userID} data-timestamp={this.props.timeStamp}>
				{this.props.user.userID !== "SYSTEM" &&
					<img src={this.props.user.image} className="chat-image"/>
				}
				<div className="message-wrap" data-system={this.props.user.userID==="SYSTEM"}>
					{this.props.user.userID !== "SYSTEM" &&
						<span className="chat-sender">{this.props.user.username}</span>
					}
					<span className="chat-message">{Parser.parse(Format.Format(this.props.message))}</span>
				</div>
			</li>
		)
	}
}

export default Message