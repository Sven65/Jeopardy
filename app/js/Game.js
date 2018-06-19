let socket = io()
let roomID = ""
let user = {}

document.querySelector("#playButton").addEventListener("click", e => {
	socket.emit("JOIN", {
		gameCode: document.querySelector("#gameCode").value,
		username: document.querySelector("#username").value
	})
})

socket.on('USER_JOIN', data => {
	roomID = data.roomID
	user = data.user
})