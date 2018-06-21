// @TODO: Make this redis ORM thing work

/*const config = require("config")
const redis = require("redis")*/

const app = require('./app')
const JService = require('./src/JService')

const JS = new JService()
/*
const redisCli = redis.createClient({
	host: config.get('redis.host'),
	port: config.get('redis.port')
})

redisCli.on("error", err => {
	throw err
})

redisCli.on("connect", () => {
	nohm.setClient(redisCli)
})


// START: NOHM START \\

nohm.setPrefix('Jeopardy')
require('./src/Models')

// END: NOHM SETUP \\

//const http = require("http").Server(app)

/** 
 * @TODO: Add passwords to rooms
 * @TODO: Make game logic work
 * @TODO: Make game respond to answers
 * @TODO: Make game show questions
 */

let roomData = {}

const port = (process.env.PORT || 3000)
const host = (process.env.HOST || undefined)

const server = app.listen(port, host, () => {
	// ask server for the actual address and port its listening on
	const listenAddress = server.address()
	console.log(`Jeopardy server running on ${listenAddress.address}:${listenAddress.port}` )
})

const io = require("socket.io")(server)

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

function checkUsernameInRoom(username, room){
	if(roomData[room] === undefined){
		return false
	}

	return roomData[room].users.filter(u => {return u.username === username}).length>0
}

function checkUserIDInRoom(userID, room){
	if(roomData[room] === undefined){
		return false
	}

	return roomData[room].users.filter(u => {return u.id === userID}).length>0
}

Object.defineProperty(String.prototype, "sanitizeHTML", {
	enumerable: false,
	writable: true,
	value: function(){

		const map = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#x27;",
			"/": "&#x2F;"
		}

		return this.replace(/[&<>]/g, c => {
			return map[c]
		})
	}
})

io.on("connection", socket => {
	console.log("connexct")

	socket.on("disconnecting", () => {
		let roomID = Object.keys(socket.rooms)[1]

		if(roomData[roomID] !== undefined){

			let user = roomData[roomID].users.filter(user => {
				return user.id === socket.id
			})[0]

			if(user !== undefined){

				let data = {
					timeStamp: Date.now(),
					roomCode: roomID,
					user: {
						id: socket.id,
						username: user.username
					}
				}

				roomData[roomID].users = roomData[roomID].users.filter(user => {
					return user.id !== socket.id
				})

				if(roomData[roomID].users.length <= 0){
					delete roomData[roomID]
				}

				socket.leave(roomID)
				io.to(roomID).emit("USER_LEAVE", data)
			}
		}
	})

	socket.on("JOIN", data => {

		let isHost = false
		let canJoin = false
		let errorMessage = "Game is still loading, please wait."

		if(roomData[data.gameCode] === undefined){
			roomData[data.gameCode] = {
				users: []
			}
		}


		if(roomData[data.gameCode].questions === undefined && roomData[data.gameCode].users.length <= 0){
			isHost = true
		}

		if(roomData[data.gameCode].questions !== undefined && roomData[data.gameCode].questions.loaded){
			canJoin = true
		}else{
			if(isHost){
				canJoin = true
			}
		}

		if(checkUsernameInRoom(data.username, data.gameCode)){
			canJoin = false
			errorMessage = "Username already in use."
		}

		if(roomData[data.gameCode].users.length >= 4){
			canJoin = false
			errorMessage = "Game is full."
		}

		if(canJoin){
			socket.join(data.gameCode)

			data.timeStamp = Date.now()
			data.roomCode = data.gameCode
			data.userID = socket.id
			data.host = isHost

			roomData[data.gameCode].users.push(data)

			roomData[data.gameCode].users.forEach(user => {
				socket.emit("USER_JOIN", user)
			})
			
			io.to(data.gameCode).emit("USER_JOIN", data)
		}else{
			socket.emit("GERROR", {type: "JOIN", reason: errorMessage})
		}
	})

	socket.on('chat', data => {
		// TODO: Add logic to check if the sending user is in the room

		data.message = data.message.sanitizeHTML()

		if(checkUserIDInRoom(data.id, data.roomID)){
			io.emit('chat', data)
		}
	})

	socket.on("ACTION_GETQUESTIONS", async data => {
		// TODO: Make sure nobody other than the host can join a room if the questions are loading
		if(roomData[data.gameCode].questions !== undefined){
			data.clues = roomData[data.gameCode].questions.clues
			io.to(data.gameCode).emit("ACTION_GOTQUESTIONS", data)
		}else{

			let categoryGet = await JS.getCategories(JS._categoryCount, Math.floor(Math.random() * JS._maxOffset) + JS._minOffset)
			let categories = categoryGet.body

			let clues = {}

			const start = async () => {
				await asyncForEach(categories, async (category) => {
					if(clues[category.id] === undefined){
						clues[category.id] = []
					}

					let clueGet = await JS.getClues(category.id)

					clues[category.id] = clueGet.body
				})

				data.clues = clues

				io.to(data.gameCode).emit("ACTION_GOTQUESTIONS", data)

				if(roomData[data.gameCode].questions === undefined){
					roomData[data.gameCode].questions = {}
				}

				roomData[data.gameCode].questions = {
					loaded: true,
					clues
				}
			}
			
			start()
		}
	})

	socket.on("GET_ROOM", d => {
		socket.emit("DEBUG", roomData[d.gameCode])
	})
})