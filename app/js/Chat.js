/*
 * Copyright Mackan <mackan@discorddungeons.me>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//let socket = io()

console.log("CHAT", socket.id)

const messageContainer = document.querySelector("#chat-messages")
const chatButton = document.querySelector("#chatButton")
const messageInput = document.querySelector("#message")
//const messageContainer = document.querySelector("#chat-messages")

function scrollChat(chatContainer, scrollTo){
	let rect = chatContainer.getBoundingClientRect()
	let containerOffset = {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft
	}

	rect = scrollTo.getBoundingClientRect()
	let scrollToOffset = {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft
	}

	chatContainer.scrollTop = scrollToOffset.top - containerOffset.top + chatContainer.scrollTop
}

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function sendMessage(message, roomID, user){
	if(message.length > 0){
		socket.emit("chat", {message, roomID: variables.roomID, user: variables.user, timeStamp: Date.now()})
	}
}

chatButton.addEventListener("click", e => {
	e.preventDefault()
	sendMessage(messageInput.value, variables.roomID, variables.user)
	messageInput.value = ""
})

messageInput.addEventListener("keydown", e => {
	if(e.keyCode === 13){
		e.preventDefault()
		sendMessage(messageInput.value, variables.roomID, variables.user)
		messageInput.value = ""
	}
})

socket.on('chat', data => {

	messageContainer.appendChild(
		htmlToElement(`
			<li class="chat-message-container" data-sender="${data.user.id}" data-timestamp="${data.timeStamp}">
				${data.user.id==="SYSTEM"?'<!--':''}<img src="http://placehold.it/128x128" class="chat-image"/>${data.user.id==="SYSTEM"?"-->":''}
				<div class="message-wrap">
					${data.user.id==="SYSTEM"?'<!--':''}<span class="chat-sender">${data.user.username}</span>${data.user.id==="SYSTEM"?'-->':''}
					<span class="chat-message">${Format.Format(data.message)}</span>
				</div>
			</li>
		`)
	)

	scrollChat(messageContainer, document.querySelector(`.chat-message-container[data-timestamp='${data.timeStamp}']`))
})