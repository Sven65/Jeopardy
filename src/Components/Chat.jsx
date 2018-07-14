import React, { Component } from 'react'

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import InputField from './Common/InputField'
import Button from './Common/Button'
import Message from './Common/Message'
import HideBox from './Common/HideBox'

import store from './../store'


class Chat extends Component {
	constructor(props){
		super(props)

		this.state = {
			messages: [],
			showEmojiPicker: false
		}

		this.sendMessage = this.sendMessage.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)

		this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
		this.emojiClicked = this.emojiClicked.bind(this)

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

	toggleEmojiPicker(e){
		this.setState({
			showEmojiPicker: !this.state.showEmojiPicker
		})
	}

	_insertAtCursor(field, value){
		if (document.selection) {
			field.focus()
			sel = document.selection.createRange()
			sel.text = value
		}else if (field.selectionStart || field.selectionStart === 0) {
			let startPos = field.selectionStart
			let endPos = field.selectionEnd
			field.value = `${field.value.substring(0, startPos)}${value}${field.value.substring(endPos, field.value.length)}`
		} else {
			field.value += myValue
		}
	}

	emojiClicked(emoji){
		//this.messageInput.value += `:${emojiData.name}:`

		this._insertAtCursor(this.messageInput, emoji.colons)

		console.log("DATA", emoji)

		this.setState({
			showEmojiPicker: false
		})
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
							<HideBox hidden={!this.state.showEmojiPicker}>
								<Picker set='twitter' sheetSize={64} onSelect={this.emojiClicked} title="" showPreview={false} showSkinTones={true} emojiTooltip={true} style={{width: "100%"}}/>
							</HideBox>

							<div className="field has-addons">
								<div className="control has-icons-left">
									<input className="input" type="text" autoComplete="off" placeholder="Type a message!" id="message" ref={el => this.messageInput = el} onKeyDown={this.onKeyDown}/>
									
									<span className="icon is-left" id="emoji-picker-toggle" onClick={this.toggleEmojiPicker}>
										<i className="mdi mdi-emoticon"></i>
									</span>
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