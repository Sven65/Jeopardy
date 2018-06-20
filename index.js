const app = require('./app')
const JService = require('./src/JService')
const JS = new JService()

//const http = require("http").Server(app)

/** 
 * @TODO: Make sure nobody but the host  can join a room if the questions are loading
 * @TODO: Make it so that only one person can use a name per room
 * @TODO: Add passwords to rooms
 * @TODO: Add logic to check if the user sending a message is doing it in a room they're in
 * @TODO: Make sure that only the person that recently joined gets the questions loaded instead of the entire room.
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

io.on("connection", socket => {
	console.log("connexct")

	socket.on("disconnecting", () => {
		let roomID = Object.keys(socket.rooms)[1]

		if(roomData[roomID] !== undefined){

			let user = roomData[roomID].users.filter(user => {
				console.log(user)
				return user.id === socket.id
			}).user

			if(user !== undefined){

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

					console.log(clues[category.id])
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
})