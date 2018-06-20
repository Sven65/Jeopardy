const messageContainer = document.querySelector("#chat-messages")
let socket = io()
let roomID = ""
let user = {}

let joinedUsers = []


function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function addChatMessage(timeStamp, image, senderID, senderName, message){
	messageContainer.appendChild(
		htmlToElement(`
			<li class="chat-message" data-sender="${senderID}" data-timestamp="${timeStamp}">
				${senderID==="SYSTEM"?'<!--':''}<img src="http://placehold.it/128x128" class="chat-image"/>${senderID==="SYSTEM"?"-->":''}
				<div class="message-wrap">
					${senderID==="SYSTEM"?'<!--':''}<span class="chat-sender">${senderName}</span>${senderID==="SYSTEM"?'-->':''}
					<span class="chat-message">${message}</span>
				</div>
			</li>
		`)
	)

	document.querySelector(`.chat-message[data-timestamp='${timeStamp}']`).scrollIntoView()
}

document.querySelector("#playButton").addEventListener("click", e => {
	roomID = document.querySelector("#gameCode").value
	user.username = document.querySelector("#username").value
	user.id = socket.id

	socket.emit("JOIN", {
		gameCode: document.querySelector("#gameCode").value,
		username: document.querySelector("#username").value
	})
})

socket.on('USER_JOIN', data => {

	DOMStuff("#beforeGame").addClass("hidden")
	DOMStuff("#gameArea").removeClass("hidden")

	document.querySelector("#gameCodeHeader").innerHTML = roomID


	if(joinedUsers.indexOf(data.user.id) <= -1){
		document.querySelector("#card-container").appendChild(
			htmlToElement(`
				<div class="col s3 user-card" data-userid="${data.user.id}">
					<div class="card">
						<div class="card-image">
							<img src="http://placehold.it/128x128">
							<span class="card-title">${data.user.username}</span>
						</div>
						<div class="card-content">
							<p>$0</p>
						</div>
					</div>
				</div>
			`)
		)

		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.user.username} Joined!`)

		joinedUsers.push(data.user.id)
	}
})

socket.on('USER_LEAVE', data => {
	if(joinedUsers.indexOf(data.user.id) > -1){
		/*messageContainer.appendChild(
			htmlToElement(`
				<li class="chat-message" data-sender="SYSTEM" data-timestamp="${data.timeStamp}">
					<!--<img src="http://placehold.it/128x128" class="chat-image"/>-->
					<div class="message-wrap">
						<!--<span class="chat-sender">${data.user.username}</span>-->
						<span class="chat-message">User ${data.user.username} Left!</span>
					</div>
				</li>
			`)
		)*/

		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.user.username} Left!`)

		document.querySelector(`.chat-message[data-timestamp='${data.timeStamp}']`).scrollIntoView()
		document.querySelector(`.user-card[data-userid='${data.user.id}']`).remove()

		joinedUsers.splice(joinedUsers.indexOf(data.user.id), 1)
	}
})

socket.on("ACTION_GOTQUESTIONS", data => {
	console.log("GOT QUESTIONS", data)

	Object.keys(data.clues).forEach((categoryID, i) => {
		document.querySelector(`#game-cat${i+1}`).innerHTML = data.clues[categoryID][0].category.title
	})

	addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `Questions Loaded!`)
})