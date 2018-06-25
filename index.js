// @TODO: Make this redis ORM thing work

/*const config = require("config")
const redis = require("redis")*/

const app = require('./app')
const JService = require('./util/JService')
const fs = require("fs")

const JS = new JService()
const FuzzyMatching = require('fuzzy-matching')
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
require('./util/Models')

// END: NOHM SETUP \\

//const http = require("http").Server(app)

/** 
 * @TODO: Add passwords to rooms
 * @TODO: Add instructions to main page
 * @TODO: Make the game layout work on mobile phones
 * @TODO: Make users able to register to keep track of wins and such
 * @TODO: Make registered users able to add custom categories
 * @TODO: Move roomData into redis or something
 * @TODO: Cleanup
 */

const access = fs.createWriteStream(__dirname + '/node.access.log', { flags: 'a' });

let roomData = {}
let roomTimers = {}

const port = (process.env.PORT || 3100)
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
		clue.answer = unescape(clue.answer).replace(/<(?:.|\n)*?>/gm, '')
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
	console.log("SOCK", socket.conn.remoteAddress)

	socket.on('action', (action) => {
		console.log("ACT", action)
	});

	access.write(`Connection from ${socket.conn.remoteAddress}\n`)

	socket.on("disconnecting", () => {
		console.log("DISC")
		let roomID = socket.rooms[Object.keys(socket.rooms)[1]]

		if(roomData[roomID] !== undefined){

			let user = getUserByID(socket.id, roomID)

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
					return user.userID !== socket.id
				})


				if(roomData[roomID].users.length <= 0){
					delete roomData[roomID]
				}

				socket.leave(roomID)
				io.to(roomID).emit("USER_LEAVE", data)
			}
		}
	})

	socket.on("USER_ACTION_LEAVE", data => {
		let roomID = data.roomID

		if(roomData[roomID] !== undefined){

			let user = getUserByID(socket.id, roomID)

			socket.leave(roomID)

			if(user !== undefined){

				roomData[roomID].users = roomData[roomID].users.filter(user => {
					return user.userID !== socket.id
				})


				if(roomData[roomID].users.length <= 0){
					delete roomData[roomID]
				}

				data = {
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

		let isHost = false
		let canJoin = false
		let errorMessage = "Game is still loading, please wait."

		data.gameCode = data.gameCode.sanitizeHTML()
		data.username = data.username.sanitizeHTML()

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
			data.balance = 0

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

		if(data.message.length <= 0){
			return
		}

		if(checkUserIDInRoom(data.user.id, data.roomID)){

			let user = getUserByID(data.user.id, data.roomID)

			if(user !== null){
				if(roomData[data.roomID].isStarted){
					if(user.isTurn){

						let answer = roomData[data.roomID].currentQuestion.answer.toLowerCase()
						let fm = new FuzzyMatching([answer])


						if(answer === fm.get(data.message.toLowerCase(), { maxChanges: 1}).value){
							emitChat = false
							io.to(data.roomID).emit('chat', {
								message: `User **${user.username}** got it right! The answer was **${roomData[data.roomID].currentQuestion.answer}**`,
								user: {
									username: "SYSTEM",
									id: "SYSTEM"
								},
								timeStamp: Date.now()
							})

							let newTurnIndex = roomData[data.roomID].users.findIndex(user => {return user.userID===data.user.id})+1
							let oldTurnIndex = roomData[data.roomID].users.findIndex(user => {return user.userID===data.user.id})

							roomData[data.roomID].users[oldTurnIndex].balance += roomData[data.roomID].currentQuestion.value

							io.to(data.roomID).emit('GAME_EVENT_ANSWERED', {
								user: data.user,
								clue: roomData[data.roomID].currentQuestion,
								newBalance: roomData[data.roomID].users[oldTurnIndex].balance
							})							

							roomData[data.roomID].users[oldTurnIndex].isTurn = false


							if(roomData[data.roomID].users[newTurnIndex] === undefined){
								newTurnIndex = 0
							}

							roomData[data.roomID].users[newTurnIndex].isTurn = true

							roomData[data.roomID].currentQuestion = null

							if(roomTimers[data.roomID] !== null && roomTimers[data.roomID] !== undefined){
								clearTimeout(roomTimers[data.roomID])
								clearInterval(roomTimers[data.roomID])
							}


							let questionsLeft = 30

							Object.keys(roomData[data.roomID].questions.clues).forEach(category => {
								roomData[data.roomID].questions.clues[category].forEach(clue => {
									if(clue.revealed){
										questionsLeft--
									}
								})
							})
							
							if(questionsLeft <= 0){
								roomData[data.roomID].gameOver = true
								io.to(data.roomID).emit("GAME_OVER", {
									standings: roomData[data.roomID].users.sort((a, b) => {
										return b.balance - a.balance
									})
								})
							}else{
								io.to(data.roomID).emit("CHANGE_TURN", {
									oldTurn: data.user.id,
									newTurn: roomData[data.roomID].users[newTurnIndex].userID
								})
							}
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
		if(roomData[data.gameCode].users.length > 1){

			if(roomData[data.gameCode] !== undefined){
				roomData[data.gameCode].isStarted = true
			}

			io.to(data.gameCode).emit("GAME_ACTION_STARTED", {timeStamp: Date.now()})

			io.to(data.gameCode).emit('chat', {
				message: `User ${getUserByID(data.userID, data.gameCode).username} started the game!`,
				user: {
					username: "SYSTEM",
					id: "SYSTEM"
				},
				timeStamp: Date.now()
			})

			io.to(data.gameCode).emit("CHANGE_TURN", {
				oldTurn: data.userID,
				newTurn: data.userID
			})
		}else{
			socket.emit('chat', {
				message: `Not enough users to start game!`,
				user: {
					username: "SYSTEM",
					id: "SYSTEM"
				},
				timeStamp: Date.now()
			})
		}
	})

	socket.on("GAME_ACTION_GET_QUESTION", data => {
		if(roomData[data.gameCode] !== undefined){

			if(roomData[data.gameCode].gameOver){
				return
			}

			let isTurn = roomData[data.gameCode].users.filter(user => {
				return user.userID === data.userID && user.isTurn
			}).length>0

			if(isTurn && roomData[data.gameCode].isStarted){
				if(roomData[data.gameCode].currentQuestion === null || roomData[data.gameCode].currentQuestion === null){
					let questionData = roomData[data.gameCode].questions.clues[parseInt(data.categoryID)].filter(clue => {
						return clue.id === parseInt(data.clueID)
					})[0]

					if(!questionData.revealed){

						data.questionData = questionData

						let questionIndex = roomData[data.gameCode].questions.clues[data.categoryID].findIndex(clue => {
							return clue.id === parseInt(data.clueID)
						})

						roomData[data.gameCode].questions.clues[data.categoryID][questionIndex].revealed = true

						roomData[data.gameCode].currentQuestion = data.questionData

						roomTimers[data.gameCode] = setTimeout(() => {
							clearTimeout(roomTimers[data.gameCode])
							let timeLeft = 5
							roomTimers[data.gameCode] = setInterval(() => {

								let currentUser = getUserByID(data.userID, data.gameCode)

								if(timeLeft > 0){
									io.to(data.gameCode).emit('chat', {
										message: `User **${currentUser.username}** has **${timeLeft}** seconds to answer`,
										user: {
											username: "SYSTEM",
											id: "SYSTEM"
										},
										timeStamp: Date.now()
									})
									timeLeft--
								}else{
									clearInterval(roomTimers[data.gameCode])

									let newTurnIndex = roomData[data.gameCode].users.findIndex(user => {return user.userID===data.userID})+1
									let oldTurnIndex = roomData[data.gameCode].users.findIndex(user => {return user.userID===data.userID})

									roomData[data.gameCode].users[oldTurnIndex].isTurn = false


									if(roomData[data.gameCode].users[newTurnIndex] === undefined){
										newTurnIndex = 0
									}

									roomData[data.gameCode].users[newTurnIndex].isTurn = true

									roomData[data.gameCode].currentQuestion = null

									io.to(data.gameCode).emit('chat', {
										message: `User **${currentUser.username}** took too long to answer`,
										user: {
											username: "SYSTEM",
											id: "SYSTEM"
										},
										timeStamp: Date.now()
									})

									let questionsLeft = 30

									Object.keys(roomData[data.gameCode].questions.clues).forEach(category => {
										roomData[data.gameCode].questions.clues[category].forEach(clue => {
											if(clue.revealed){
												questionsLeft--
											}
										})
									})
									
									if(questionsLeft <= 0){
										roomData[data.gameCode].gameOver = true
										io.to(data.gameCode).emit("GAME_OVER", {
											standings: roomData[data.gameCode].users.sort((a, b) => {
												return a.balance - b.balance
											})
										})
									}else{
										io.to(data.gameCode).emit("CHANGE_TURN", {
											oldTurn: roomData[data.gameCode].users[oldTurnIndex].userID,
											newTurn: roomData[data.gameCode].users[newTurnIndex].userID
										})
									}
								}

							}, 1000)
						}, 10000)

						io.to(data.gameCode).emit("GAME_ACTION_GOT_QUESTION", data)
					}
				}
			}
		}
	})

	socket.on("GET_ROOM", d => {
		socket.emit("DEBUG", roomData[d.gameCode])
	})

	
	socket.on("DEBUG", d => {
		console.log("DEBUG", d)
		socket.emit("DEBUG", d)
	})

	socket.on("SET_BAL", data => {
		roomData[data.gameCode]
	})
})