import React, { Component } from 'react'
import JSEMOJI from 'emoji-js'

import Format from './../../General/Format'

const HtmlToReactParser = require('html-to-react').Parser
const Parser = new HtmlToReactParser()

class Message extends Component {
	constructor(props){
		super(props)

		this.jsemoji = new JSEMOJI()

		this.jsemoji.img_set = 'twitter'
		// set the storage location for all emojis
		this.jsemoji.img_sets.twitter.path = 'https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/64/'

		// some more settings...
		this.jsemoji.supports_css = false
		this.jsemoji.allow_native = false
		this.jsemoji.replace_mode = 'unified'
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
					<span className="chat-message">{Parser.parse(this.jsemoji.replace_colons(Format.Format(this.props.message)))}</span>
				</div>
			</li>
		)
	}
}

export default Message