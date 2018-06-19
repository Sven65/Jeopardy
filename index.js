const app = require('./app')
//const http = require("http").Server(app)

let roomData = {}

const port = (process.env.PORT || 3000)
const host = (process.env.HOST || undefined)

const server = app.listen(port, host, () => {
	// ask server for the actual address and port its listening on
	const listenAddress = server.address()
	console.log(`Jeopardy server running on ${listenAddress.address}:${listenAddress.port}` )
})

const io = require("socket.io")(server)

io.on("connection", socket => {
	console.log("connexct")

	socket.on("disconnecting", () => {
		let roomID = Object.keys(socket.rooms)[1]

		if(roomData[roomID] !== undefined){

			let user = roomData[roomID].users.filter(user => {
				console.log(user)
				return user.id === socket.id
			}).user

			let data = {
				timeStamp: Date.now(),
				roomCode: roomID,
				user: {
					id: socket.id,
					username: user.username
				}
			}

			io.to(roomID).emit("USER_LEAVE", data)
		}
	})

	socket.on("JOIN", data => {
		if(roomData[data.gameCode] === undefined){
			roomData[data.gameCode] = {
				users: []
			}
		}

		socket.join(data.gameCode)

		data.timeStamp = Date.now()
		data.roomCode = data.gameCode
		data.user = {
			username: data.username,
			id: socket.id
		}

		roomData[data.gameCode].users.push(data)

		roomData[data.gameCode].users.forEach(user => {
			socket.emit("USER_JOIN", user)
		})
		
		io.to(data.gameCode).emit("USER_JOIN", data)
	})

	socket.on('chat', data => {
		// TODO: Add logic to check if the sending user is in the room

		io.emit('chat', data)
	})
})