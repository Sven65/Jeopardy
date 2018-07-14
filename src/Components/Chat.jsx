import React, { Component } from 'react'

import InputField from './Common/InputField'
import Button from './Common/Button'
import Message from './Common/Message'

import store from './../store'


class Chat extends Component {
	constructor(props){
		super(props)

		this.state = {
			messages: []
		}

		this.sendMessage = this.sendMessage.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)

		this.messageInput = React.createRef()

		this.chatContainer = React.createRef()
		this.chatBottom = React.createRef()
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
			this.scrollToBottom()
		})

		
	}

	sendMessage(){
		if(this.messageInput.value === ""){
			return
		}

		if(this.messageInput.value.toLowerCase() === "/version"){
			store.dispatch({type: "LOCAL_COMMAND", data: {
				command: "VERSION"
			}})
		}else{

			store.dispatch({type: "s/chat", data: {
				roomID: this.state.roomID,
				user: this.state.user,
				message: this.messageInput.value,
				timeStamp: Date.now()
			}})
		}

		this.messageInput.value = ""
	}

	scrollToBottom(){
		let rect = this.chatContainer.getBoundingClientRect()
		let containerOffset = {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		}

		rect = this.chatBottom.getBoundingClientRect()
		let scrollToOffset = {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		}

		this.chatContainer.scrollTop = scrollToOffset.top - containerOffset.top + this.chatContainer.scrollTop
	}

	onKeyDown(e){
		if(e.keyCode === 13){
			this.sendMessage()
		}
	}

	render(){
		return (
			<div className="row no-pad-bot">
				<div className="col s12 l4 right" id="chat">
					<div className="row">
						<div className="container" id="chat-container">
							<ul id="chat-messages" ref={el => this.chatContainer = el}>
								{this.state.messages.map(message => {
									return (<Message user={message.user} timeStamp={message.timeStamp} message={message.message} key={message.timeStamp}/>)
								})}
								<li className="chatBottom" ref={el => this.chatBottom = el}></li>
							</ul>
						</div>
						<div className="chat-input">
							{/* Chat Input */}

							<div className="field has-addons">
								<div className="control">
									<input className="input" type="text" autoComplete="off" placeholder="Type a message!" id="message" ref={el => this.messageInput = el} onKeyDown={this.onKeyDown}/>
								</div>
								<div className="control">
									<a className="button is-primary" id="chatButton" onClick={this.sendMessage}>
										Send
										<span className="icon">
											<i className="mdi mdi-send"></i>
										</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Chat