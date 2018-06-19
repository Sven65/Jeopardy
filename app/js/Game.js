let socket = io()
let roomID = ""
let user = {}

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

document.querySelector("#playButton").addEventListener("click", e => {
	socket.emit("JOIN", {
		gameCode: document.querySelector("#gameCode").value,
		username: document.querySelector("#username").value
	})
})

socket.on('USER_JOIN', data => {
	roomID = data.roomCode
	user = data.user

	DOMStuff("#beforeGame").addClass("hidden")
	DOMStuff("#gameArea").removeClass("hidden")

	document.querySelector("#gameCodeHeader").innerHTML = roomID

	document.querySelector("#card-container").appendChild(
		htmlToElement(`
			<div class="col s3">
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
})