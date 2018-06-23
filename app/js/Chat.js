const chatButton = document.querySelector("#chatButton")
const messageInput = document.querySelector("#message")
//const messageContainer = document.querySelector("#chat-messages")

function sendMessage(message, roomID, user){
	if(message.length > 0){
		socket.emit("chat", {message, roomID, user, timeStamp: Date.now()})
	}
}


chatButton.addEventListener("click", e => {
	e.preventDefault()
	sendMessage(messageInput.value, roomID, user)
	messageInput.value = ""
})

messageInput.addEventListener("keydown", e => {
	if(e.keyCode === 13){
		e.preventDefault()
		sendMessage(messageInput.value, roomID, user)
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

	document.querySelector(`.chat-message-container[data-timestamp='${data.timeStamp}']`).scrollIntoView()
})