const config = require("config")

const app = require('./app')

//----------------------------

let roomTimers = {}

const port = (config.get("Server.port") || 3100)
const host = (config.get("Server.host") || undefined)

const Sockets = require("./Sockets")

require("./util/Extenders")

function isset(variable){
	return (variable !== null && variable !== undefined)
}

//----------------------------------------------

const server = app.listen(port, host, () => {
	// ask server for the actual address and port its listening on
	const listenAddress = server.address()
	console.log(`Jeopardy server running on ${listenAddress.address}:${listenAddress.port}` )
})

const io = require("socket.io")(server)
const middleware = require('socketio-wildcard')()

io.use(middleware)

io.on("connection", socket => {
	socket.on('*', packet => {
		const event = packet.data[0].toLowerCase()
		const data = packet.data[1]

		if(isset(Sockets[event])){
			Sockets[event].Execute({socket, io, data, roomTimers})
		}
	})

	socket.on('disconnecting', e => {
		if(isset(Sockets['disconnecting'])){
			Sockets['disconnecting'].Execute({socket, io, data: {}, roomTimers})
		}
	})
})