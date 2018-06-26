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
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())

			console.log("MESSAGE", this.state.messages)
		})
	}

	sendMessage(){
		if(this.messageInput.value !== ""){
			store.dispatch({type: "s/chat", data: {
				roomID: this.state.roomID,
				user: this.state.user,
				message: this.messageInput.value,
				timeStamp: Date.now()
			}})

			this.messageInput.value = ""
		}
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
							<ul id="chat-messages">
								{this.state.messages.map(message => {
									return (<Message user={message.user} timeStamp={message.timeStamp} message={message.message} key={message.timeStamp}/>)
								})}
							</ul>
						</div>
						<div className="col s12 m12 l12">
							{/* Chat Input */}

							<div className="file-field input-field">
								<button className="waves-effect waves-light btn-large right" type="button" name="send" id="chatButton" onClick={this.sendMessage}>
									Send!
									<i className="material-icons right">send</i>
								</button>
								<div className="file-path-wrapper">
									<div className="file-path-wrapper">
										<input id="message" type="text" className="validate" ref={el => this.messageInput = el} onKeyDown={this.onKeyDown}/>
										<label htmlFor="message">Type a message!</label>
									</div>
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