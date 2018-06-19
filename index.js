const app = require('./app')
//const http = require("http").Server(app)


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

	socket.on("disconnect", () => {
		console.log("disconnect")
	})

	socket.on('chat', data => {
		// TODO: Add logic to check if the sending user is in the room

		io.emit('chat', data)
	})
})