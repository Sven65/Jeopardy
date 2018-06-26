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


const messageContainer = document.querySelector("#chat-messages")

variables.joinedUsers = []
variables.questionsLoaded = false
window.socket = io()
variables.roomID = ""
variables.user = {}

console.log("GAME", socket.id)

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

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

	scrollChat(messageContainer, document.querySelector(`.chat-message-container[data-timestamp='${timeStamp}']`))
}

function questionCellClick(e){
	let target = e.target
	socket.emit("GAME_ACTION_GET_QUESTION", {
		clueID: target.dataset.id,
		gameCode: variables.roomID,
		userID: socket.id,
		categoryID: target.dataset.category
	})
}

document.querySelector("#playButton").addEventListener("click", e => {
	variables.roomID = document.querySelector("#gameCode").value
	variables.user.username = document.querySelector("#username").value
	variables.user.id = socket.id

	socket.emit("JOIN", {
		gameCode: document.querySelector("#gameCode").value,
		username: document.querySelector("#username").value
	})
})

document.querySelector("#game-button-leave").addEventListener("click", e => {
	socket.emit("USER_ACTION_LEAVE", {roomID: variables.roomID, userID: socket.id})

	variables.roomID = ""
	variables.user = {}

	variables.joinedUsers = []
	variables.questionsLoaded = false

	DOMStuff("#beforeGame").removeClass("hidden")
	DOMStuff("#gameArea").addClass("hidden")

	document.querySelector("#headerText").innerHTML = "Please Enter Details"
	document.querySelector("#gameCodeHeader").innerHTML = ""
	document.querySelector("#chat-messages").innerHTML = ""
	document.querySelector("#card-container").innerHTML = ""
	document.querySelectorAll("#gameTable > tbody > tr").forEach(el => {
		el.innerHTML = ""
	})

	DOMStuff("#game-button-start").addClass("hidden")
	DOMStuff("#game-button-leave").addClass("hidden")
})

document.querySelector("#game-button-start").addEventListener("click", e => {
	socket.emit("GAME_ACTION_START", {
		gameCode: variables.roomID,
		userID: socket.id
	})
})

socket.on('USER_JOIN', data => {

	//console.log("J", data)

	DOMStuff("#beforeGame").addClass("hidden")
	DOMStuff("#gameArea").removeClass("hidden")

	variables.roomID = data.gameCode

	document.querySelector("#gameCodeHeader").innerHTML = variables.roomID


	if(variables.joinedUsers.indexOf(data.userID) <= -1){
		document.querySelector("#card-container").appendChild(
			htmlToElement(`
				<div class="col l3 s4 user-card" data-userid="${data.userID}">
					<div class="card">
						<div class="card-image">
							<img src="http://placehold.it/128x128">
							<span class="card-title">${data.username}</span>
						</div>
						<div class="card-content">
							<p class="balance">$${data.balance}</p>
						</div>
					</div>
				</div>
			`)
		)

		if(data.userID === socket.id){
			addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `Joined room **${variables.roomID}** as **${data.username}**!`)
		}else{
			addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.username} Joined!`)
		}

		variables.joinedUsers.push(data.userID)

		if(!variables.questionsLoaded){
			socket.emit("ACTION_GETQUESTIONS", {
				gameCode: variables.roomID
			})
		}

		DOMStuff("#game-buttons").removeClass("hidden")

		if(data.host && data.userID === socket.id){
			DOMStuff("#game-button-start").removeClass("hidden")
		}

		
	}
})

socket.on('USER_LEAVE', data => {
	if(variables.joinedUsers.indexOf(data.user.id) > -1){
		//console.log("LEAVE", data)
		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `User ${data.user.username} Left!`)

		//document.querySelector(`.chat-message[data-timestamp='${data.timeStamp}']`).scrollIntoView()
		document.querySelector(`.user-card[data-userid='${data.user.id}']`).remove()

		variables.joinedUsers.splice(variables.joinedUsers.indexOf(data.user.id), 1)
	}
})

socket.on("ACTION_GOTQUESTIONS", data => {
	if(!variables.questionsLoaded || data.force){
		variables.questionsLoaded = true
	
		//console.log("GOT QUESTIONS", data)

		Object.keys(data.clues).forEach((categoryID, i) => {
			document.querySelector(`#game-cat${i+1}`).innerHTML = data.clues[categoryID][0].category.title
			
			data.clues[categoryID].forEach(clue => {
				let trElement = document.querySelector(`#gameTable > tbody > tr[data-value='${clue.value}']`)

				let questionCell = htmlToElement(`
					<td class="game-clue" data-revealed="false" data-id="${clue.id}" data-category="${categoryID}">$${clue.value}</td>
				`)

				questionCell.addEventListener("click", questionCellClick)

				trElement.appendChild(questionCell)
			})

		})

		addChatMessage(data.timeStamp, null, "SYSTEM", "SYSTEM", `Questions Loaded!`)
	}
})

socket.on("GAME_ACTION_GOT_QUESTION", data => {
	//console.log("GETQ", data)
	document.querySelector("#game-question-title").innerHTML = `${data.questionData.category.title} for $${data.questionData.value}`
	document.querySelector("#game-question-clue").innerHTML = data.questionData.question

	let clueEl = document.querySelector(`.game-clue[data-id='${data.questionData.id}']`)
	clueEl.dataset.revealed = true
	clueEl.innerHTML = "X"
})

socket.on("GAME_EVENT_ANSWERED", data => {
	//console.log("GEA", data)
	document.querySelector(`.user-card[data-userid='${data.user.id}'] > .card > .card-content > .balance`).innerHTML = `$${data.newBalance}`
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

socket.on("GAME_ACTION_STARTED", data => {
	DOMStuff("#game-button-start").addClass("hidden")
})

socket.on("GAME_OVER", data => {
	document.querySelector("#game-question-title").innerHTML = `Game Over!`
	document.querySelector("#game-question-clue").innerHTML = ""

	document.querySelector("#card-container").innerHTML = ""

	let placeString = [
		"1st",
		"2nd",
		"3rd",
		"4th"
	]

	data.standings.forEach((user, i) => {
		document.querySelector("#game-question-clue").innerHTML += `<p>${placeString[i]} - ${user.username}</p>`

		document.querySelector("#card-container").appendChild(
			htmlToElement(`
				<div class="col s3 user-card" data-userid="${user.userID}">
					<div class="card">
						<div class="card-image">
							<img src="http://placehold.it/128x128">
							<span class="card-title">${user.username}</span>
						</div>
						<div class="card-content">
							<p class="balance">$${user.balance}</p>
						</div>
					</div>
				</div>
			`)
		)
	})
})