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
 * @TODO: Make game send event of when a question is answered to clients
 * @TODO: Make game keep track of player balance
 * @TODO: Make client show user balances
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

	return roomData[room].users.filter(u => {return u.userID === userID}).length>0
}

function getUserByID(userID, room){
	return roomData[room].users.filter(u => {return u.userID === userID})[0]||null
}

function valueFixer(clues){
	let valueMatch = [200, 400, 600, 800, 1000]
	let hasValues = []

	clues.forEach((clue, i) => {
		if(clue.value !== undefined && clue.value !== null && clue.hasOwnProperty("value")){
			if(clue.value%200 === 100){
				clue.value *= 2
			}

			if(hasValues.indexOf(clue.value) > -1){
				/*clue.value = valueMatch.filter(value => {
					return hasValues.indexOf(value)<=-1
				})[0]||0*/

				let found = clues.some(cl => {
					return clue.value === cl.value 
				})

				if(found){
					 //console.log("DOUNG", found)
					/*clue.value = valueMatch.filter(value => {
						return hasValues.indexOf(value)<=-1
					})[0]||0*/

					delete clue.value
				}

				delete clue.value
			}else{
				hasValues.push(clue.value)
			}
		}else{
			clue.value = valueMatch.filter(value => {
				return hasValues.indexOf(value)<=-1
			})[i-1]
		}
	})

	clues.forEach((clue, i) => {
		if(!clue.hasOwnProperty("value") || clue.value === undefined || clue.value === null){
			//clue.value = 0
			let VMG = valueMatch.filter(value => {
				return hasValues.indexOf(value)<=-1
			})

			//console.log("VMG", VMG, "I", i, "CLUE", clue, "HASVAL", hasValues)

			clue.value = VMG[i-1]||VMG[0]
		}
	})

	return clues
}

function categoryUpperCase(clues){
	clues.forEach(clue => {
		clue.category.title = clue.category.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	})
}

function answerUnescape(clues){
	clues.forEach(clue => {
		clue.answer = unescape(clue.answer)
	})
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
				users: [],
				isStarted: false,
				currentQuestion: null
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
			data.isTurn = isHost

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
		let emitChat = true

		data.message = data.message.sanitizeHTML()

		if(checkUserIDInRoom(data.user.id, data.roomID)){

			let user = getUserByID(data.user.id, data.roomID)

			if(user !== null){
				if(roomData[data.roomID].isStarted){
					if(user.isTurn){
						if(data.message.toLowerCase() === roomData[data.roomID].currentQuestion.answer.toLowerCase()){
							emitChat = false
							io.to(data.roomID).emit('chat', {
								message: `User **${user.username}** got it right! The answer was **${roomData[data.roomID].currentQuestion.answer}**`,
								user: {
									username: "SYSTEM",
									id: "SYSTEM"
								},
								timeStamp: Date.now()
							})

							io.to(data.roomID).emit('GAME_EVENT_ANSWERED', {
								user: data.user,
								clue: roomData[data.roomID].currentQuestion
							})

							let newTurnIndex = roomData[data.roomID].users.findIndex(user => user.userID===data.user.id)+1
							let oldTurnIndex = roomData[data.roomID].users.findIndex(user => user.userID===data.user.id)

							roomData[data.roomID].users[oldTurnIndex].isTurn = false

							if(roomData[data.roomID].users[newTurnIndex] === undefined){
								newTurnIndex = 0
							}

							roomData[data.roomID].users[newTurnIndex].isTurn = true

							roomData[data.roomID].currentQuestion = null
							
							io.to(data.roomID).emit("CHANGE_TURN", {
								oldTurn: data.user.id,
								newTurn: roomData[data.roomID].users[newTurnIndex].userID
							})
						}
					}
				}
			}

			if(emitChat){
				io.to(data.roomID).emit('chat', data)
			}
		}
	})

	socket.on("ACTION_GETQUESTIONS", async data => {
		if(data.force){
			roomData[data.gameCode].questions = undefined
		}

		if(roomData[data.gameCode].questions !== undefined && !data.force){
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

					clues[category.id] = clues[category.id].slice(0, 5)

					clues[category.id] = valueFixer(valueFixer(clues[category.id]))

					categoryUpperCase(clues[category.id])
					answerUnescape(clues[category.id])
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

	socket.on("GAME_ACTION_START", data => {
		console.log("GAS", data)

		if(roomData[data.gameCode] !== undefined){
			roomData[data.gameCode].isStarted = true
		}

		io.to(data.gameCode).emit("GAME_ACTION_STARTED", {oof: true})
	})

	socket.on("GAME_ACTION_GET_QUESTION", data => {
		if(roomData[data.gameCode] !== undefined){

			let isTurn = roomData[data.gameCode].users.filter(user => {
				return user.userID === data.userID && user.isTurn
			}).length>0

			if(isTurn && roomData[data.gameCode].isStarted){
				if(roomData[data.gameCode].currentQuestion === null || roomData[data.gameCode].currentQuestion === null){
					data.questionData = roomData[data.gameCode].questions.clues[parseInt(data.categoryID)].filter(clue => {
						return clue.id === parseInt(data.clueID)
					})[0]

					roomData[data.gameCode].currentQuestion = data.questionData

					io.to(data.gameCode).emit("GAME_ACTION_GOT_QUESTION", data)
				}
			}
		}
	})

	socket.on("GET_ROOM", d => {
		socket.emit("DEBUG", roomData[d.gameCode])
	})
})