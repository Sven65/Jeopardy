const messageContainer = document.querySelector("#chat-messages")
let socket = io()
let roomID = ""
let user = {}

let joinedUsers = []
let questionsLoaded = false


function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function addChatMessage(timeStamp, image, senderID, senderName, message){
	messageContainer.appendChild(
		htmlToElement(`
			<li class="chat-message-container" data-sender="${senderID}" data-timestamp="${timeStamp}">
				${senderID==="SYSTEM"?'<!--':''}<img src="http://placehold.it/128x128" class="chat-image"/>${senderID==="SYSTEM"?"-->":''}
				<div class="message-wrap">
					${senderID==="SYSTEM"?'<!--':''}<span class="chat-sender">${senderName}</span>${senderID==="SYSTEM"?'-->':''}
					<span class="chat-message">${Format.Format(message)}</span>
				</div>
			</li>
		`)
	)

	document.querySelector(`.chat-message-container[data-timestamp='${timeStamp}']`).scrollIntoView()
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

document.querySelector("#game-button-leave").addEventListener("click", e => {
	socket.disconnect()
	DOMStuff("#beforeGame").removeClass("hidden")
	DOMStuff("#gameArea").addClass("hidden")

	document.querySelector("#headerText").innerHTML = "Please Enter Details"
	document.querySelector("#gameCodeHeader").innerHTML = ""
})

socket.on('USER_JOIN', data => {

	console.log("J", data)

	DOMStuff("#beforeGame").addClass("hidden")
	DOMStuff("#gameArea").removeClass("hidden")

	document.querySelector("#gameCodeHeader").innerHTML = roomID


	if(joinedUsers.indexOf(data.userID) <= -1){
		document.querySelector("#card-container").appendChild(
			htmlToElement(`
				<div class="col s3 user-card" data-userid="${data.userID}">
					<div class="card">
						<div class="card-image">
							<img src="http://placehold.it/128x128">
							<span class="card-title">${data.username}</span>
						</div>
						<div class="card-content">
							<p>$0</p>
						</div>
					</div>
				</div>
			`)
		)

		if(data.userID === socket.id){
			addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `Joined room **${roomID}** as **${data.username}**!`)
		}else{
			addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.username} Joined!`)
		}

		joinedUsers.push(data.userID)

		if(!questionsLoaded){
			socket.emit("ACTION_GETQUESTIONS", {
				gameCode: roomID
			})
		}

		DOMStuff("#game-buttons").removeClass("hidden")

		if(data.host && data.userID === socket.id){
			DOMStuff("#game-button-start").removeClass("hidden")
		}

		
	}
})

socket.on('USER_LEAVE', data => {
	if(joinedUsers.indexOf(data.id) > -1){
		console.log("LEAVE", data)
		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.username} Left!`)

		document.querySelector(`.chat-message[data-timestamp='${data.timeStamp}']`).scrollIntoView()
		document.querySelector(`.user-card[data-userid='${data.id}']`).remove()

		joinedUsers.splice(joinedUsers.indexOf(data.id), 1)
	}
})

socket.on("ACTION_GOTQUESTIONS", data => {
	if(!questionsLoaded || data.force){
		questionsLoaded = true
	
		console.log("GOT QUESTIONS", data)

		Object.keys(data.clues).forEach((categoryID, i) => {
			document.querySelector(`#game-cat${i+1}`).innerHTML = data.clues[categoryID][0].category.title
			
			data.clues[categoryID].forEach(clue => {
				let trElement = document.querySelector(`#gameTable > tbody > tr[data-value='${clue.value}']`)

				trElement.appendChild(htmlToElement(`
					<td class="game-clue" data-revealed="false" data-id="${clue.id}">$${clue.value}</td>
				`))
			})

		})

		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `Questions Loaded!`)
	}
})

socket.on("GERROR", data => {
	if(data.type === "JOIN"){
		document.querySelector("#headerText").innerHTML = data.reason
	}
})

socket.on("DEBUG", d => {
	console.log("[DEBUG]", d)
})

socket.on("CHANGE_TURN", data => {
	DOMStuff(`.user-card[data-userid='${data.oldTurn}']`).removeClass("current-turn")
	DOMStuff(`.user-card[data-userid='${data.newTurn}']`).addClass("current-turn")
})