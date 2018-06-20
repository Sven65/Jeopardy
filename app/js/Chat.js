const chatButton = document.querySelector("#chatButton")
const messageInput = document.querySelector("#message")
//const messageContainer = document.querySelector("#chat-messages")

function sendMessage(message, roomID, user){
	socket.emit("chat", {message, roomID, user, timeStamp: Date.now()})
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
			<li class="chat-message" data-sender="${data.user.id}" data-timestamp="${data.timeStamp}">
				<img src="http://placehold.it/128x128" class="chat-image"/>
				<div class="message-wrap">
					<span class="chat-sender">${data.user.name}</span>
					<span class="chat-message">${data.message}</span>
				</div>
			</li>
		`)
	)

	document.querySelector(`.chat-message[data-timestamp='${data.timeStamp}']`).scrollIntoView()
})